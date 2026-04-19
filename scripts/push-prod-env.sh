#!/usr/bin/env bash
# Push every var from ~/nertia/.env.local to Vercel production,
# then trigger a redeploy so the running functions see the new env.
#
# Idempotent: if a var already exists in Vercel prod, we rm + re-add
# (Vercel CLI has no --upsert flag, so we force overwrite).
#
# Run: bash scripts/push-prod-env.sh

set -euo pipefail

SRC="${HOME}/nertia/.env.local"
PROJECT_DIR="${HOME}/code/nertia"
TEAM_SLUG="${VERCEL_TEAM_SLUG:-scottys-projects-b217ae13}"

if [ ! -f "$SRC" ]; then
  echo "✗ env file not found at $SRC" >&2
  exit 1
fi

cd "$PROJECT_DIR"

# --- ensure the project is linked ---
if [ ! -d ".vercel" ]; then
  echo "→ linking project to Vercel..."
  npx -y vercel@latest link --yes --project nertia --scope "$TEAM_SLUG"
fi

# --- iterate and push each var ---
added=0
skipped=0
while IFS='=' read -r key value || [ -n "$key" ]; do
  # skip comments / empty
  [[ -z "$key" || "$key" =~ ^# ]] && continue
  # trim whitespace around key
  key="${key// /}"

  # skip Vercel-managed system tokens
  if [[ "$key" == "VERCEL_OIDC_TOKEN" || "$key" == "VERCEL_URL" || "$key" == "VERCEL" ]]; then
    echo "⊘ skipping Vercel-managed $key"
    skipped=$((skipped + 1))
    continue
  fi

  # strip surrounding quotes from value
  value="${value%\"}"
  value="${value#\"}"
  value="${value%\'}"
  value="${value#\'}"

  # skip if empty value
  [ -z "$value" ] && { echo "⚠ skipping empty $key"; continue; }

  echo "→ $key"
  # rm existing (ignore fail) then add fresh
  npx -y vercel@latest env rm "$key" production --yes 2>/dev/null || true
  echo -n "$value" | npx -y vercel@latest env add "$key" production
  added=$((added + 1))
done < "$SRC"

echo ""
echo "✓ pushed $added vars to Vercel prod"
echo ""
echo "→ redeploying production with new envs..."
npx -y vercel@latest --prod --yes

echo ""
echo "✓ done. try: node --experimental-strip-types scripts/smoke-generate.ts --base https://www.nertia.ai"
