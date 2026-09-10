#!/bin/sh
# Jetable : démarre le build SSR (docs), récupère la page btn-dropdown, vérifie la résolution.
cd "$(dirname "$0")/../docs"
PORT=3000
node .output/server/index.mjs > /tmp/nitro-check.log 2>&1 &
PID=$!
sleep 3
curl -s "http://127.0.0.1:${PORT}/docs/components/btn-dropdown" -o /tmp/btnpage.html
kill "$PID" 2>/dev/null
if [ ! -s /tmp/btnpage.html ]; then echo "!! page vide — log serveur :"; tail -20 /tmp/nitro-check.log; exit 1; fi
echo "=== 'Jane Cooper' présent (trigger résolu) ==="
grep -c "Jane Cooper" /tmp/btnpage.html || true
echo "=== occurrences 'q-btn-actions' / 'q-btn' ==="
grep -c "q-btn-actions" /tmp/btnpage.html || true
grep -c "q-btn__label" /tmp/btnpage.html || true
