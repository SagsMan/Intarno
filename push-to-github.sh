#!/usr/bin/env bash
# =========================================================
# push-to-github.sh
# Run this script locally after downloading the project.
# It initialises git, creates the remote repo, and pushes.
#
# Usage:
#   chmod +x push-to-github.sh
#   GH_PAT=ghp_xxxxx ./push-to-github.sh
#
# The script NEVER stores your PAT in any file.
# =========================================================

set -euo pipefail

REPO_NAME="intarno"
GH_USER=""   # auto-detected from token

if [ -z "${GH_PAT:-}" ]; then
  echo "❌  Error: GH_PAT environment variable is not set."
  echo "    Usage: GH_PAT=ghp_xxx ./push-to-github.sh"
  exit 1
fi

echo "🔍 Detecting GitHub username..."
GH_USER=$(curl -sf -H "Authorization: token ${GH_PAT}" \
  https://api.github.com/user | python3 -c "import sys,json; print(json.load(sys.stdin)['login'])")
echo "   Username: ${GH_USER}"

echo "📦 Creating GitHub repository '${REPO_NAME}'..."
HTTP_CODE=$(curl -s -o /tmp/gh_create_response.json -w "%{http_code}" \
  -X POST \
  -H "Authorization: token ${GH_PAT}" \
  -H "Content-Type: application/json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"${REPO_NAME}\",\"description\":\"Intarno – Contemporary furniture & interior design store\",\"private\":false}")

if [ "$HTTP_CODE" = "422" ]; then
  echo "   ⚠️  Repository already exists — skipping creation."
elif [ "$HTTP_CODE" != "201" ]; then
  echo "   ❌ Failed to create repo (HTTP $HTTP_CODE):"
  cat /tmp/gh_create_response.json
  exit 1
else
  echo "   ✅ Repository created."
fi

REMOTE_URL="https://${GH_USER}:${GH_PAT}@github.com/${GH_USER}/${REPO_NAME}.git"

echo "🔧 Initialising git..."
git init
git config user.email "intarno@build.com"
git config user.name "Intarno Build"

echo "📂 Staging all files..."
git add -A

echo "💬 Creating initial commit..."
git commit -m "feat: initial Intarno storefront — React + TypeScript + Tailwind

Full implementation of the Intarno furniture store:
- Sticky header with desktop mega-menu + mobile drawer
- Home page: hero, category grid, featured products, room inspiration
- Shop page with sort, filter, category pills
- Product detail page with image gallery, colour swatches, accordion
- Collections, Rooms, Inspiration, Contact, About pages
- Full-screen search overlay with live filtering
- Footer with newsletter, social links, legal
- Fully responsive (mobile / tablet / desktop)
- CSS animations: fade-up, slide-down, img-reveal
- Accessible, semantic HTML throughout"

echo "🔗 Setting remote origin..."
git remote remove origin 2>/dev/null || true
git remote add origin "${REMOTE_URL}"

echo "🚀 Pushing to GitHub..."
git branch -M main
git push -u origin main --force

# Print summary — do NOT echo the PAT
echo ""
echo "=================================================="
echo "✅  Done! Repository pushed successfully."
echo "    🔗 https://github.com/${GH_USER}/${REPO_NAME}"
echo ""
echo "Next steps:"
echo "  1. Deploy to Vercel: https://vercel.com/new → Import '${REPO_NAME}'"
echo "  2. Or deploy to Netlify: https://app.netlify.com/start"
echo "  3. Or run locally: npm install && npm run dev"
echo "=================================================="
