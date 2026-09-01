#!/usr/bin/env bash
set -e

echo "=========================================="
echo "⚡ ABRAXAS OS — MASTER DEPLOY CONTROLLER"
echo "=========================================="

# 1. Build latest status website & Canon 37 TXT library
echo "📦 [1/4] Rebuilding master cinematic website & Canon 37 TXT library..."
node apps/public-status/scripts/project-public-data.mjs
pnpm --dir apps/public-status build
node apps/public-status/scripts/generate-multipage.mjs
cp -r apps/public-status/dist/assets/* docs/assets/ 2>/dev/null || true
cp -r docs/abraxas-os-status/* docs/ 2>/dev/null || true
touch docs/.nojekyll

# 2. Sync to core repo (LordJeferies/ABRAXAS_OS)
echo "🔒 [2/4] Syncing to private core repo (LordJeferies/ABRAXAS_OS)..."
git add -A
if ! git diff --cached --quiet; then
  git commit -m "feat(sync): master cinematic release with multi-channel ecosystem and executive governance $(date -u +'%Y-%m-%dT%H:%M:%SZ')" || true
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
    git commit -m "deploy: master cinematic website release $(date -u +'%Y-%m-%dT%H:%M:%SZ')" || true
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
    git commit -m "deploy: master cinematic website mirror $(date -u +'%Y-%m-%dT%H:%M:%SZ')" || true
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

echo "🚀 Master URL: https://lordjeferies.github.io/es/index.html [HTTP $HTTP_ROOT]"
echo "📚 Canon Library URL: https://lordjeferies.github.io/es/canon/index.html [HTTP $HTTP_CANON]"
echo "=========================================="
echo "✨ All repositories & root domain deployed successfully!"
echo "=========================================="
