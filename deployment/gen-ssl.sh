#!/usr/bin/env bash
# Certificados para xkale.inventory con una CA interna propia.
#
#   xkale-ca.crt            CA raíz (10 años). Es lo ÚNICO que se instala en los equipos cliente
#                           (Intune → perfil "Certificado de confianza", o a mano).
#   xkale.inventory.crt     Certificado del servidor firmado por la CA (825 días, límite de macOS).
#                           Se puede renovar sin tocar los clientes: basta volver a ejecutar este script.
#
# Ejecutar en el servidor como root:  bash gen-ssl.sh
# Si la CA ya existe se reutiliza y solo se reemite el certificado del servidor.
set -euo pipefail

DOMAIN="xkale.inventory"
OUT_DIR="/etc/nginx/ssl"
SERVER_IP="${SERVER_IP:-$(hostname -I | awk '{print $1}')}"

mkdir -p "$OUT_DIR"
cd "$OUT_DIR"

# ── CA interna (solo la primera vez) ──────────────────────────────────────────
if [[ ! -f xkale-ca.key || ! -f xkale-ca.crt ]]; then
    echo "==> Creando CA interna de Xkale..."
    openssl req -x509 -new -nodes -sha256 -days 3650 \
        -newkey rsa:4096 -keyout xkale-ca.key -out xkale-ca.crt \
        -subj "/C=EC/O=Xkale/CN=Xkale Internal CA" \
        -addext "basicConstraints=critical,CA:TRUE,pathlen:0" \
        -addext "keyUsage=critical,keyCertSign,cRLSign"
    chmod 600 xkale-ca.key
fi
chmod 644 xkale-ca.crt

# ── Certificado del servidor ──────────────────────────────────────────────────
echo "==> Emitiendo certificado para $DOMAIN (IP $SERVER_IP)..."
cat > server.ext <<EOF
basicConstraints=critical,CA:FALSE
keyUsage=critical,digitalSignature,keyEncipherment
extendedKeyUsage=serverAuth
subjectAltName=DNS:$DOMAIN,IP:$SERVER_IP
EOF
openssl req -new -nodes -newkey rsa:2048 \
    -keyout "$DOMAIN.key" -out "$DOMAIN.csr" \
    -subj "/C=EC/O=Xkale/CN=$DOMAIN"
openssl x509 -req -sha256 -days 825 \
    -in "$DOMAIN.csr" -CA xkale-ca.crt -CAkey xkale-ca.key -CAcreateserial \
    -out "$DOMAIN.crt" -extfile server.ext
rm -f "$DOMAIN.csr" server.ext
chmod 600 "$DOMAIN.key"
chmod 644 "$DOMAIN.crt"

openssl verify -CAfile xkale-ca.crt "$DOMAIN.crt"
echo ""
echo "Certificado del servidor válido hasta: $(openssl x509 -enddate -noout -in "$DOMAIN.crt" | cut -d= -f2)"
echo "Instala en los clientes SOLO la CA:  $OUT_DIR/xkale-ca.crt"
echo "  (también se descarga en  http://$SERVER_IP/xkale-ca.crt)"
