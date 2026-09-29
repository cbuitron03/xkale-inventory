#!/usr/bin/env bash
# Despliegue automático: si origin/master tiene un commit que aún no se desplegó, hace
# git pull y ejecuta deploy.sh. Lo lanza el timer systemd xkale-autodeploy cada 2 minutos.
#
# Logs:        journalctl -u xkale-autodeploy
# Desactivar:  sudo systemctl disable --now xkale-autodeploy.timer
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
STATE_DIR="/var/lib/xkale-inventory"
BRANCH="master"
OWNER="$(stat -c %U "$REPO_DIR")"   # git se ejecuta como el dueño del clon, no como root

git_owner() { sudo -u "$OWNER" -H git -C "$REPO_DIR" "$@"; }

# Si hay un deploy manual en curso, esperar al próximo ciclo (no tocar el clon a mitad)
if ! flock -n /run/xkale-deploy.lock true 2>/dev/null; then
    exit 0
fi

mkdir -p "$STATE_DIR"
git_owner fetch --quiet origin "$BRANCH"
remoto="$(git_owner rev-parse "origin/$BRANCH")"
desplegado="$(cat "$STATE_DIR/deployed-commit" 2>/dev/null || true)"
fallido="$(cat "$STATE_DIR/failed-commit" 2>/dev/null || true)"

[[ "$remoto" == "$desplegado" ]] && exit 0
if [[ "$remoto" == "$fallido" ]]; then
    # Ya falló con este commit: no reintentar en cada ciclo; se reintenta con el próximo push
    exit 0
fi

echo "==> Nuevo commit en $BRANCH: ${desplegado:0:7} -> ${remoto:0:7}"
git_owner log --oneline "${desplegado:-$remoto~1}..$remoto" 2>/dev/null | sed 's/^/    /' || true

if ! git_owner merge --ff-only --quiet "origin/$BRANCH"; then
    echo "ERROR: no se pudo actualizar $REPO_DIR (¿cambios locales en el clon del servidor?)."
    echo "$remoto" > "$STATE_DIR/failed-commit"
    exit 1
fi

if bash "$REPO_DIR/deployment/deploy.sh"; then
    rm -f "$STATE_DIR/failed-commit"
    echo "==> Desplegado ${remoto:0:7}"
else
    echo "$remoto" > "$STATE_DIR/failed-commit"
    echo "ERROR: deploy.sh falló con ${remoto:0:7}. Se reintentará con el próximo commit"
    echo "       (o a mano: sudo bash $REPO_DIR/deployment/deploy.sh)."
    exit 1
fi
