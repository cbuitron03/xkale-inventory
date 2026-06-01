#!/usr/bin/env bash
# Despliegue de xkale-inventory en Ubuntu/Debian.
# Ejecutar en el servidor como root desde la raíz del repositorio:
#   bash deployment/deploy.sh
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
APP_DIR="/opt/xkale-inventory"
WEB_ROOT="/var/www/xkale-inventory"
SERVICE_NAME="xkale-inventory"
DOMAIN="xkale.inventory"
APP_USER="xkale"

# ── 1. Dependencias del sistema ───────────────────────────────────────────────
echo "==> Instalando dependencias del sistema..."
apt-get update -q
apt-get install -y nginx python3 python3-venv python3-pip nodejs npm openssl

# ── 2. Usuario de servicio ────────────────────────────────────────────────────
if ! id "$APP_USER" &>/dev/null; then
    useradd --system --no-create-home --shell /sbin/nologin "$APP_USER"
    echo "==> Usuario '$APP_USER' creado."
fi

# ── 3. Copiar código de la aplicación ─────────────────────────────────────────
echo "==> Copiando código a $APP_DIR..."
mkdir -p "$APP_DIR"
rsync -a --delete \
    --exclude '.git' \
    --exclude 'frontend/node_modules' \
    --exclude 'backend/venv' \
    --exclude 'backend/__pycache__' \
    "$REPO_DIR/" "$APP_DIR/"

# ── 4. Backend: entorno virtual e instalación ─────────────────────────────────
echo "==> Configurando entorno virtual Python..."
python3 -m venv "$APP_DIR/backend/venv"
"$APP_DIR/backend/venv/bin/pip" install --quiet --upgrade pip
"$APP_DIR/backend/venv/bin/pip" install --quiet -r "$APP_DIR/backend/requirements.txt"

chown -R "$APP_USER:$APP_USER" "$APP_DIR/backend"

# ── 5. Backend: verificar .env ────────────────────────────────────────────────
# El .env del repositorio (DATABASE_URL + SECRET_KEY) se copia por rsync en el
# paso 3. Solo se comprueba que el archivo llegó correctamente.
ENV_FILE="$APP_DIR/backend/.env"
if [[ ! -f "$ENV_FILE" ]]; then
    echo "ERROR: no se encontró $ENV_FILE. Asegúrate de que backend/.env existe en el repositorio."
    exit 1
fi

# ── 6. Frontend: build de producción ─────────────────────────────────────────
echo "==> Construyendo el frontend..."
cd "$APP_DIR/frontend"
npm ci --silent
npm run build

# ── 7. Servir archivos estáticos con nginx ────────────────────────────────────
echo "==> Copiando archivos estáticos a $WEB_ROOT..."
mkdir -p "$WEB_ROOT"
rsync -a --delete "$APP_DIR/frontend/dist/" "$WEB_ROOT/"
chown -R www-data:www-data "$WEB_ROOT"

# ── 8. Certificado SSL ────────────────────────────────────────────────────────
if [[ ! -f "/etc/nginx/ssl/$DOMAIN.crt" ]]; then
    echo "==> Generando certificado SSL autofirmado..."
    bash "$REPO_DIR/deployment/gen-ssl.sh"
else
    echo "==> Certificado SSL ya existe, omitiendo generación."
fi

# ── 9. Configuración de nginx ─────────────────────────────────────────────────
echo "==> Instalando configuración de nginx..."
cp "$REPO_DIR/deployment/nginx.conf" "/etc/nginx/sites-available/$SERVICE_NAME"
ln -sf "/etc/nginx/sites-available/$SERVICE_NAME" "/etc/nginx/sites-enabled/$SERVICE_NAME"
# Deshabilitar sitio por defecto si existe
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

# ── 10. Servicio systemd ──────────────────────────────────────────────────────
echo "==> Instalando servicio systemd..."
cp "$REPO_DIR/deployment/xkale-inventory.service" "/etc/systemd/system/$SERVICE_NAME.service"
systemctl daemon-reload
systemctl enable "$SERVICE_NAME"
systemctl restart "$SERVICE_NAME"

# ── 11. Estado final ──────────────────────────────────────────────────────────
echo ""
echo "==> Despliegue completado."
echo ""
systemctl --no-pager status "$SERVICE_NAME"
echo ""
echo "Verifica que la app responde:"
echo "  curl -k https://$DOMAIN"
echo ""
echo "Si el DNS interno aún no apunta a este servidor, añade la entrada:"
echo "  <IP_DEL_SERVIDOR>  $DOMAIN"
echo "en el servidor DNS de la LAN o en /etc/hosts de cada cliente."
