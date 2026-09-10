#!/bin/sh
# Reproduit un dev server FRAIS et regarde si le SSR résout <q-btn-dropdown>.
ulimit -n 65536 2>/dev/null
cd "$(dirname "$0")/../docs"
PORT=3212
./node_modules/.bin/nuxt dev --port "$PORT" --host 127.0.0.1 > /tmp/nuxt-dev-check.log 2>&1 &
PID=$!
i=0
while [ "$i" -lt 150 ]; do
  sleep 2
  i=$((i + 1))
  CODE=$(curl -s -o /tmp/btnpage.html -w "%{http_code}" "http://127.0.0.1:${PORT}/docs/components/btn-dropdown" 2>/dev/null)
  if [ "$CODE" = "200" ]; then break; fi
done
kill "$PID" 2>/dev/null
echo "http=$CODE taille=$(wc -c < /tmp/btnpage.html 2>/dev/null)"
echo "=== 'Jane Cooper' (trigger SSR) ==="
grep -c "Jane Cooper" /tmp/btnpage.html || true
echo "=== 'Failed to resolve component' / 'Invalid vnode' dans la page SSR ? ==="
grep -c "q-btn-dropdown" /tmp/btnpage.html || true
echo "=== log (erreurs clés) ==="
grep -iE "failed to resolve|invalid vnode|error|warn" /tmp/nuxt-dev-check.log | grep -vi "deprecat" | head -10 || true
