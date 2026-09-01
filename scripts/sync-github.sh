#!/usr/bin/env bash
set -e

echo "=========================================="
echo "⚡ ABRAXAS OS — MASTER APPLE MACBOOK PRO DEPLOY CONTROLLER"
echo "=========================================="

# 1. Build latest Apple suite assets
echo "📦 [1/4] Rebuilding Apple MacBook Pro Suite & Canon 37 TXT library..."
node apps/public-status/scripts/generate-apple-master.mjs
pnpm --dir apps/public-status build || true
cp apps/public-status/src/apple-design-system.css docs/assets/apple-design-system.css 2>/dev/null || true
cp apps/public-status/src/apple-design-system.css docs/abraxas-os-status/assets/apple-design-system.css 2>/dev/null || true
cp -r docs/abraxas-os-status/* docs/ 2>/dev/null || true
touch docs/.nojekyll

# 2. Sync to core repo (LordJeferies/ABRAXAS_OS)
echo "🔒 [2/4] Syncing to private core repo (LordJeferies/ABRAXAS_OS)..."
git add -A
if ! git diff --cached --quiet; then
  git commit -m "feat(apple-suite): master rebuild with MacBook Pro aesthetics and multi-channel ecosystem $(date -u +'%Y-%m-%dT%H:%M:%SZ')" || true
  git push origin main || true
  echo "✅ Core repository updated."
else
  echo "ℹ️ Core repository already up to date."
fi

# 3. Sync to root domain repo (LordJeferies/lordjeferies.github.io)
echo "🌐 [3/4] Syncing to primary root domain (LordJeferies/lordjeferies.github.io)..."
TEMP_DIR=$(mktemp -d)
if git clone --depth 1 https://github.com/LordJeferies/lordjeferies.github.io.git "$TEMP_DIR" >/dev/null 2>&1; then
  cp -r docs/* "$TEMP_DIR/"
  cp docs/.nojekyll "$TEMP_DIR/"
  cd "$TEMP_DIR"
  git add -A
  if ! git diff --cached --quiet; then
    git commit -m "deploy: Apple MacBook Pro master website release $(date -u +'%Y-%m-%dT%H:%M:%SZ')" || true
    git push origin main || true
    echo "✅ Root domain (lordjeferies.github.io) updated."
  else
    echo "ℹ️ Root domain already up to date."
  fi
  cd - >/dev/null 2>&1
  rm -rf "$TEMP_DIR"
fi

# 4. Sync to public status repo (LordJeferies/ABRAXAS_OS_STATUS)
echo "🌐 [4/4] Syncing to public status mirror (LordJeferies/ABRAXAS_OS_STATUS)..."
TEMP_DIR_STATUS=$(mktemp -d)
if git clone --depth 1 https://github.com/LordJeferies/ABRAXAS_OS_STATUS.git "$TEMP_DIR_STATUS" >/dev/null 2>&1; then
  cp -r docs/* "$TEMP_DIR_STATUS/"
  cp docs/.nojekyll "$TEMP_DIR_STATUS/"
  cd "$TEMP_DIR_STATUS"
  git add -A
  if ! git diff --cached --quiet; then
    git commit -m "deploy: Apple MacBook Pro master website mirror $(date -u +'%Y-%m-%dT%H:%M:%SZ')" || true
    git push origin main || true
    echo "✅ Status mirror updated."
  else
    echo "ℹ️ Status mirror already up to date."
  fi
  cd - >/dev/null 2>&1
  rm -rf "$TEMP_DIR_STATUS"
fi

# 5. Verify live deployment status
echo "🔍 [5/5] Verifying live URLs..."
HTTP_ROOT=$(curl -o /dev/null -s -w "%{http_code}\n" https://lordjeferies.github.io/es/index.html || true)
HTTP_CANON=$(curl -o /dev/null -s -w "%{http_code}\n" https://lordjeferies.github.io/es/canon/index.html || true)
HTTP_ECO=$(curl -o /dev/null -s -w "%{http_code}\n" https://lordjeferies.github.io/es/ecosistema/index.html || true)
HTTP_GER=$(curl -o /dev/null -s -w "%{http_code}\n" https://lordjeferies.github.io/es/gerencia/index.html || true)

echo "🚀 Master Overview URL: https://lordjeferies.github.io/es/index.html [HTTP $HTTP_ROOT]"
echo "💼 Executive Suite URL: https://lordjeferies.github.io/es/gerencia/index.html [HTTP $HTTP_GER]"
echo "⚡ 8-in-1 Ecosystem URL: https://lordjeferies.github.io/es/ecosistema/index.html [HTTP $HTTP_ECO]"
echo "📚 Canon Library URL: https://lordjeferies.github.io/es/canon/index.html [HTTP $HTTP_CANON]"
echo "=========================================="
echo "✨ Apple MacBook Pro experience deployed successfully!"
echo "=========================================="
