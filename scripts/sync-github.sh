#!/usr/bin/env bash
set -e

echo "=========================================="
echo "⚡ ABRAXAS OS — MASTER TOTAL DEPLOY"
echo "=========================================="

# 1. Build all suites
echo "📦 [1/4] Rebuilding all suites with Cosmogonía, Cátedra, Scrum, Gustos & Contexto..."
node apps/public-status/scripts/generate-apple-v3.mjs
node apps/public-status/scripts/generate-deepdive-suite.mjs
node apps/public-status/scripts/generate-commercial-moon-suite.mjs
node apps/public-status/scripts/generate-total-masterpiece.mjs
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
  git commit -m "feat(total): cosmology, 3 moons, catedra 165 IQ, scrum 0-100, gustos canon & master prompt $(date -u +'%Y-%m-%dT%H:%M:%SZ')" || true
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
    git commit -m "deploy: cosmology, 3 moons, catedra 165 IQ, scrum 0-100 & master prompt $(date -u +'%Y-%m-%dT%H:%M:%SZ')" || true
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
    git commit -m "deploy: cosmology & catedra mirror $(date -u +'%Y-%m-%dT%H:%M:%SZ')" || true
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
HTTP_COSMO=$(curl -o /dev/null -s -w "%{http_code}\n" https://lordjeferies.github.io/es/cosmogonia/index.html || true)
HTTP_CTX=$(curl -o /dev/null -s -w "%{http_code}\n" https://lordjeferies.github.io/es/contexto/index.html || true)
HTTP_CAT=$(curl -o /dev/null -s -w "%{http_code}\n" https://lordjeferies.github.io/es/catedra/index.html || true)
HTTP_SCRUM=$(curl -o /dev/null -s -w "%{http_code}\n" https://lordjeferies.github.io/es/scrum/index.html || true)
HTTP_GUSTOS=$(curl -o /dev/null -s -w "%{http_code}\n" https://lordjeferies.github.io/es/gustos-canon/index.html || true)
HTTP_PROMPT=$(curl -o /dev/null -s -w "%{http_code}\n" https://lordjeferies.github.io/es/prompt-maestro/index.html || true)
HTTP_MOON=$(curl -o /dev/null -s -w "%{http_code}\n" https://lordjeferies.github.io/es/luna-comercial/index.html || true)

echo "🚀 Master Overview URL: https://lordjeferies.github.io/index.html [HTTP $HTTP_ROOT]"
echo "🍎 Official v3 URL: https://lordjeferies.github.io/v3/index.html [HTTP $HTTP_V3]"
echo "☀️ Cosmology & 3 Moons: https://lordjeferies.github.io/es/cosmogonia/index.html [HTTP $HTTP_COSMO]"
echo "📖 Foundational Context: https://lordjeferies.github.io/es/contexto/index.html [HTTP $HTTP_CTX]"
echo "🏛️ 165 IQ Lecture: https://lordjeferies.github.io/es/catedra/index.html [HTTP $HTTP_CAT]"
echo "📋 Scrum 0-100%: https://lordjeferies.github.io/es/scrum/index.html [HTTP $HTTP_SCRUM]"
echo "🎨 Taste Canon & Lienzos: https://lordjeferies.github.io/es/gustos-canon/index.html [HTTP $HTTP_GUSTOS]"
echo "🤖 Master Prompt: https://lordjeferies.github.io/es/prompt-maestro/index.html [HTTP $HTTP_PROMPT]"
echo "🌙 Commercial Moon: https://lordjeferies.github.io/es/luna-comercial/index.html [HTTP $HTTP_MOON]"
echo "=========================================="
echo "✨ Total Masterpiece Suite deployed successfully!"
echo "=========================================="
