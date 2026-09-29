#!/usr/bin/env bash
# Despliegue de xkale-inventory en Ubuntu/Debian.
# Ejecutar en el servidor como root desde la raíz del repositorio clonado:
#   sudo bash deployment/deploy.sh
# Para actualizar: git pull && sudo bash deployment/deploy.sh
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
APP_DIR="/opt/xkale-inventory"
WEB_ROOT="/var/www/xkale-inventory"
SERVICE_NAME="xkale-inventory"
DOMAIN="xkale.inventory"
APP_USER="xkale"
NODE_MAJOR=22   # Vite 8 requiere Node >= 20.19

# ── 1. Dependencias del sistema ───────────────────────────────────────────────
echo "==> Instalando dependencias del sistema..."
apt-get update -q
apt-get install -y nginx python3 python3-venv python3-pip openssl rsync curl ca-certificates

node_ok() {
    command -v node >/dev/null && node -e 'const [a,b]=process.versions.node.split(".").map(Number); process.exit(a>20||(a===20&&b>=19)?0:1)'
}
if ! node_ok; then
    echo "==> Instalando Node.js $NODE_MAJOR (NodeSource)..."
    curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
    apt-get install -y nodejs
fi
echo "    Node $(node --version), npm $(npm --version)"

# ── 2. Usuario de servicio ────────────────────────────────────────────────────
if ! id "$APP_USER" &>/dev/null; then
    useradd --system --no-create-home --shell /usr/sbin/nologin "$APP_USER"
    echo "==> Usuario '$APP_USER' creado."
fi

# ── 3. Copiar código de la aplicación ─────────────────────────────────────────
# Lo excluido no se borra con --delete: el .env y el venv del servidor se conservan.
echo "==> Copiando código a $APP_DIR..."
mkdir -p "$APP_DIR"
rsync -a --delete \
    --exclude '.git' \
    --exclude 'backend/.env' \
    --exclude 'backend/venv' \
    --exclude '__pycache__' \
    --exclude 'frontend/node_modules*' \
    --exclude 'frontend/dist' \
    "$REPO_DIR/" "$APP_DIR/"

# ── 4. Backend: .env ──────────────────────────────────────────────────────────
ENV_FILE="$APP_DIR/backend/.env"
if [[ ! -f "$ENV_FILE" ]]; then
    SECRET=$(python3 -c "import secrets; print(secrets.token_urlsafe(48))")
    sed "s|^SECRET_KEY=.*|SECRET_KEY=$SECRET|" "$APP_DIR/backend/.env.example" > "$ENV_FILE"
    chown "$APP_USER:$APP_USER" "$ENV_FILE"
    chmod 600 "$ENV_FILE"
    echo ""
    echo "Se creó $ENV_FILE con una SECRET_KEY nueva."
    echo "Edítalo y pon la contraseña real en DATABASE_URL:"
    echo "    sudo nano $ENV_FILE"
    echo "Luego vuelve a ejecutar: sudo bash deployment/deploy.sh"
    exit 1
fi
if grep -q 'CONTRASEÑA' "$ENV_FILE"; then
    echo "ERROR: $ENV_FILE todavía tiene 'CONTRASEÑA' en DATABASE_URL. Complétalo y vuelve a ejecutar."
    exit 1
fi

# ── 5. Backend: entorno virtual e instalación ─────────────────────────────────
echo "==> Configurando entorno virtual Python..."
python3 -m venv "$APP_DIR/backend/venv"
"$APP_DIR/backend/venv/bin/pip" install --quiet --upgrade pip
"$APP_DIR/backend/venv/bin/pip" install --quiet -r "$APP_DIR/backend/requirements.txt"
chown -R "$APP_USER:$APP_USER" "$APP_DIR/backend"
chmod 600 "$ENV_FILE"

echo "==> Verificando conexión a la base de datos..."
if ! (cd "$APP_DIR/backend" && sudo -u "$APP_USER" venv/bin/python -c "
from app.database import engine
from sqlalchemy import text, inspect
with engine.connect() as c: c.execute(text('select 1'))
faltan = {'auth_user','usuario','laptop','tecnico','ticket'} - set(inspect(engine).get_table_names())
assert not faltan, f'faltan tablas: {sorted(faltan)} (¿se cargó el backup?)'
print('    Conexión OK, tablas presentes')
"); then
    echo "ERROR: no se pudo conectar a la base o faltan tablas. Revisa DATABASE_URL en $ENV_FILE."
    exit 1
fi

# ── 6. Frontend: build de producción ─────────────────────────────────────────
# Usa frontend/.env.production (VITE_API_URL=/api)
echo "==> Construyendo el frontend..."
cd "$APP_DIR/frontend"
npm ci --no-audit --no-fund
npm run build

# ── 7. Servir archivos estáticos con nginx ────────────────────────────────────
echo "==> Copiando archivos estáticos a $WEB_ROOT..."
mkdir -p "$WEB_ROOT"
rsync -a --delete "$APP_DIR/frontend/dist/" "$WEB_ROOT/"
chown -R www-data:www-data "$WEB_ROOT"

# ── 8. Certificado SSL ────────────────────────────────────────────────────────
# Se (re)genera si no hay CA interna (certificado autofirmado antiguo) o si vence en menos de 30 días
SSL_DIR="/etc/nginx/ssl"
if [[ ! -f "$SSL_DIR/xkale-ca.crt" || ! -f "$SSL_DIR/$DOMAIN.crt" ]] \
   || ! openssl x509 -checkend 2592000 -noout -in "$SSL_DIR/$DOMAIN.crt" >/dev/null; then
    echo "==> Generando certificados SSL (CA interna)..."
    bash "$REPO_DIR/deployment/gen-ssl.sh"
else
    echo "==> Certificado SSL vigente, omitiendo generación."
fi

# ── 9. Configuración de nginx ─────────────────────────────────────────────────
echo "==> Instalando configuración de nginx..."
cp "$REPO_DIR/deployment/nginx.conf" "/etc/nginx/sites-available/$SERVICE_NAME"
ln -sf "/etc/nginx/sites-available/$SERVICE_NAME" "/etc/nginx/sites-enabled/$SERVICE_NAME"
rm -f /etc/nginx/sites-enabled/default   # su default_server chocaría con el nuestro
nginx -t
systemctl enable nginx
systemctl reload-or-restart nginx

if command -v ufw >/dev/null && ufw status | grep -q "Status: active"; then
    echo "==> Abriendo puertos 80/443 en ufw..."
    ufw allow 'Nginx Full'
fi

# ── 10. Servicio systemd ──────────────────────────────────────────────────────
echo "==> Instalando servicio systemd..."
cp "$REPO_DIR/deployment/xkale-inventory.service" "/etc/systemd/system/$SERVICE_NAME.service"
systemctl daemon-reload
systemctl enable "$SERVICE_NAME"
systemctl restart "$SERVICE_NAME"

# ── 11. Verificación ──────────────────────────────────────────────────────────
echo "==> Verificando..."
for _ in $(seq 1 15); do
    curl -skf https://127.0.0.1/api/ >/dev/null && break
    sleep 1
done
if curl -skf https://127.0.0.1/api/ >/dev/null; then
    echo "    API OK:      $(curl -sk https://127.0.0.1/api/)"
    echo "    Frontend:    HTTP $(curl -sk -o /dev/null -w '%{http_code}' https://127.0.0.1/laptops)"
else
    echo "ERROR: la API no responde. Revisa: journalctl -u $SERVICE_NAME -n 50"
    exit 1
fi

IP=$(hostname -I | awk '{print $1}')
echo ""
echo "==> Despliegue completado."
echo "    https://$DOMAIN  (requiere DNS o /etc/hosts:  $IP  $DOMAIN)"
echo "    https://$IP"
echo "    Docs API: https://$DOMAIN/api/docs"
