#!/usr/bin/env bash
set -e

echo "=========================================="
echo "⚡ ABRAXAS OS — GITHUB TERMINAL CONTROLLER"
echo "=========================================="

# 1. Build latest status assets
echo "📦 [1/4] Rebuilding status website..."
node apps/public-status/scripts/generate-multipage.mjs
pnpm --dir apps/public-status build
cp -r apps/public-status/dist/assets/* docs/assets/ 2>/dev/null || true
cp -r docs/abraxas-os-status/* docs/ 2>/dev/null || true
touch docs/.nojekyll

# 2. Sync to main repo (LordJeferies/ABRAXAS_OS)
echo "🔒 [2/4] Syncing to private core repository (LordJeferies/ABRAXAS_OS)..."
git add -A
if ! git diff --cached --quiet; then
  git commit -m "feat(sync): automated terminal deployment $(date -u +'%Y-%m-%dT%H:%M:%SZ')"
  git push origin main
  echo "✅ Core repository updated."
else
  echo "ℹ️ Core repository already up to date."
fi

# 3. Sync to public GitHub Pages repo (LordJeferies/ABRAXAS_OS_STATUS)
echo "🌐 [3/4] Syncing to public GitHub Pages repository (LordJeferies/ABRAXAS_OS_STATUS)..."
TEMP_DIR=$(mktemp -d)
git clone --depth 1 https://github.com/LordJeferies/ABRAXAS_OS_STATUS.git "$TEMP_DIR" >/dev/null 2>&1
cp -r docs/* "$TEMP_DIR/"
cp docs/.nojekyll "$TEMP_DIR/"
cd "$TEMP_DIR"
git add -A
if ! git diff --cached --quiet; then
  git commit -m "deploy: automated public status update $(date -u +'%Y-%m-%dT%H:%M:%SZ')"
  git push origin main
  echo "✅ Public status repository updated and deployed."
else
  echo "ℹ️ Public status repository already up to date."
fi
rm -rf "$TEMP_DIR"

# 4. Verify live deployment status
echo "🔍 [4/4] Verifying live GitHub Pages URL..."
HTTP_STATUS=$(curl -o /dev/null -s -w "%{http_code}\n" https://lordjeferies.github.io/ABRAXAS_OS_STATUS/es/index.html)
echo "🚀 Status URL: https://lordjeferies.github.io/ABRAXAS_OS_STATUS/es/index.html [HTTP $HTTP_STATUS]"
echo "=========================================="
echo "✨ All repositories synced successfully from terminal!"
echo "=========================================="
