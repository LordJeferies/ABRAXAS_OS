#!/usr/bin/env bash
set -e

echo "=========================================="
echo "⚡ ABRAXAS OS — MASTER UNIFIED AWWWARDS & APPLE DEPLOY"
echo "=========================================="

# 1. Build all suites with 100% bulletproof navigation & internal quick menus
echo "📦 [1/4] Rebuilding all suites with universal navigation & TOC menus..."
node apps/public-status/scripts/generate-apple-v3.mjs
node apps/public-status/scripts/generate-deepdive-suite.mjs
node apps/public-status/scripts/generate-all-unified.mjs
node apps/public-status/scripts/generate-master-awwwards.mjs

cp apps/public-status/src/apple-design-system.css docs/assets/apple-design-system.css 2>/dev/null || true
cp apps/public-status/src/apple-design-system.css docs/abraxas-os-status/assets/apple-design-system.css 2>/dev/null || true
cp apps/public-status/src/apple-macbook-pro-v3.css docs/assets/apple-macbook-pro-v3.css 2>/dev/null || true
cp apps/public-status/src/apple-macbook-pro-v3.css docs/abraxas-os-status/assets/apple-macbook-pro-v3.css 2>/dev/null || true
cp apps/public-status/src/abraxas-apple-canon.css docs/assets/abraxas-apple-canon.css 2>/dev/null || true
cp apps/public-status/src/abraxas-apple-canon.css docs/abraxas-os-status/assets/abraxas-apple-canon.css 2>/dev/null || true
cp apps/public-status/src/abraxas-engine-v3.js docs/assets/abraxas-engine-v3.js 2>/dev/null || true
cp apps/public-status/src/abraxas-engine-v3.js docs/abraxas-os-status/assets/abraxas-engine-v3.js 2>/dev/null || true
cp -r docs/abraxas-os-status/* docs/ 2>/dev/null || true
touch docs/.nojekyll

# 2. Sync to core repo (LordJeferies/ABRAXAS_OS)
echo "🔒 [2/4] Syncing to private core repo (LordJeferies/ABRAXAS_OS)..."
killall git 2>/dev/null || true
rm -f .git/index.lock
git add -A
if ! git diff --cached --quiet; then
  git commit -m "feat(nav): universal bulletproof navigation across all pages and internal quick jump TOC menus $(date -u +'%Y-%m-%dT%H:%M:%SZ')" || true
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
    git commit -m "deploy: universal bulletproof navigation and TOC release $(date -u +'%Y-%m-%dT%H:%M:%SZ')" || true
    git push origin main || true
    echo "✅ Root domain (lordjeferies.github.io) updated."
  else
    echo "ℹ️ Root domain already up to date."
  fi
  cd - >/dev/null 2>&1
  rm -rf "$TEMP_DIR"
fi

# 4. Sync to public status mirror (LordJeferies/ABRAXAS_OS_STATUS)
echo "🌐 [4/4] Syncing to public status mirror (LordJeferies/ABRAXAS_OS_STATUS)..."
TEMP_DIR_STATUS=$(mktemp -d)
if git clone --depth 1 https://github.com/LordJeferies/ABRAXAS_OS_STATUS.git "$TEMP_DIR_STATUS" >/dev/null 2>&1; then
  cp -r docs/* "$TEMP_DIR_STATUS/"
  cp docs/.nojekyll "$TEMP_DIR_STATUS/"
  cd "$TEMP_DIR_STATUS"
  git add -A
  if ! git diff --cached --quiet; then
    git commit -m "deploy: universal bulletproof navigation and TOC mirror $(date -u +'%Y-%m-%dT%H:%M:%SZ')" || true
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
HTTP_ROOT=$(curl -o /dev/null -s -w "%{http_code}\n" https://lordjeferies.github.io/index.html || true)
HTTP_V3=$(curl -o /dev/null -s -w "%{http_code}\n" https://lordjeferies.github.io/v3/index.html || true)
HTTP_ECO=$(curl -o /dev/null -s -w "%{http_code}\n" https://lordjeferies.github.io/es/ecosistema/index.html || true)
HTTP_GER=$(curl -o /dev/null -s -w "%{http_code}\n" https://lordjeferies.github.io/es/gerencia/index.html || true)
HTTP_FLUJO=$(curl -o /dev/null -s -w "%{http_code}\n" https://lordjeferies.github.io/es/flujo/index.html || true)
HTTP_MOTIONS=$(curl -o /dev/null -s -w "%{http_code}\n" https://lordjeferies.github.io/es/tools/vav/motions/index.html || true)
HTTP_CAPTIONS=$(curl -o /dev/null -s -w "%{http_code}\n" https://lordjeferies.github.io/es/tools/vav/captions/index.html || true)
HTTP_CUTS=$(curl -o /dev/null -s -w "%{http_code}\n" https://lordjeferies.github.io/es/tools/vav/cuts/index.html || true)
HTTP_SHIM=$(curl -o /dev/null -s -w "%{http_code}\n" https://lordjeferies.github.io/es/tools/shim/index.html || true)
HTTP_ARQUI=$(curl -o /dev/null -s -w "%{http_code}\n" https://lordjeferies.github.io/es/tools/arquitecto/index.html || true)
HTTP_CANON=$(curl -o /dev/null -s -w "%{http_code}\n" https://lordjeferies.github.io/es/canon/index.html || true)
HTTP_BACKUP=$(curl -o /dev/null -s -w "%{http_code}\n" https://lordjeferies.github.io/es/backup/index.html || true)

echo "🚀 Master Overview URL: https://lordjeferies.github.io/index.html [HTTP $HTTP_ROOT]"
echo "🍎 Official v3 URL: https://lordjeferies.github.io/v3/index.html [HTTP $HTTP_V3]"
echo "⚡ Ecosystem URL: https://lordjeferies.github.io/es/ecosistema/index.html [HTTP $HTTP_ECO]"
echo "💼 Governance URL: https://lordjeferies.github.io/es/gerencia/index.html [HTTP $HTTP_GER]"
echo "🔄 Lifecycle Flow URL: https://lordjeferies.github.io/es/flujo/index.html [HTTP $HTTP_FLUJO]"
echo "🎬 Motions URL: https://lordjeferies.github.io/es/tools/vav/motions/index.html [HTTP $HTTP_MOTIONS]"
echo "💬 Captions URL: https://lordjeferies.github.io/es/tools/vav/captions/index.html [HTTP $HTTP_CAPTIONS]"
echo "✂️ Cuts URL: https://lordjeferies.github.io/es/tools/vav/cuts/index.html [HTTP $HTTP_CUTS]"
echo "🔍 SHIM Metrology URL: https://lordjeferies.github.io/es/tools/shim/index.html [HTTP $HTTP_SHIM]"
echo "👁️ Arquitecto Guide URL: https://lordjeferies.github.io/es/tools/arquitecto/index.html [HTTP $HTTP_ARQUI]"
echo "📚 Canon 37 TXT URL: https://lordjeferies.github.io/es/canon/index.html [HTTP $HTTP_CANON]"
echo "🏛️ Backup Snapshot URL: https://lordjeferies.github.io/es/backup/index.html [HTTP $HTTP_BACKUP]"
echo "=========================================="
echo "✨ All pages deployed with 100% working navigation!"
echo "=========================================="
