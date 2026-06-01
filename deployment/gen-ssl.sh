#!/usr/bin/env bash
# Genera un certificado autofirmado para xkale.inventory.
# Los navegadores modernos requieren SAN (Subject Alternative Name).
# Ejecutar en el servidor como root:  bash gen-ssl.sh
set -euo pipefail

DOMAIN="xkale.inventory"
DAYS=3650
OUT_DIR="/etc/nginx/ssl"

mkdir -p "$OUT_DIR"

openssl req -x509 -nodes -days "$DAYS" \
    -newkey rsa:2048 \
    -keyout "$OUT_DIR/$DOMAIN.key" \
    -out    "$OUT_DIR/$DOMAIN.crt" \
    -subj   "/C=CO/ST=Colombia/O=Xkale/CN=$DOMAIN" \
    -addext "subjectAltName=DNS:$DOMAIN"

chmod 600 "$OUT_DIR/$DOMAIN.key"
chmod 644 "$OUT_DIR/$DOMAIN.crt"

echo ""
echo "Certificado generado en $OUT_DIR/"
echo ""
echo "Para que los navegadores confíen en el certificado sin advertencias,"
echo "instala $OUT_DIR/$DOMAIN.crt en cada equipo cliente:"
echo "  - Windows: doble clic → Instalar certificado → Almacén: Entidades de certificación raíz de confianza"
echo "  - Ubuntu/Debian:"
echo "      cp $OUT_DIR/$DOMAIN.crt /usr/local/share/ca-certificates/"
echo "      update-ca-certificates"
