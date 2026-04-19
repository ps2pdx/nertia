#!/usr/bin/env bash
# Pre-retirement reference check for old-thesis code.
#
# For each deletion candidate listed in Task 18 of the MVP plan, search the
# rest of src/ for inbound references (imports, route literals). Prints a
# report and exits non-zero if any candidate still has live references
# outside its own subtree.
#
# Usage:
#   bash scripts/pre-retirement-check.sh
#   bash scripts/pre-retirement-check.sh --json     # machine-readable output

set -u

REPO="${REPO:-$(cd "$(dirname "$0")/.." && pwd)}"
JSON=0
[[ "${1:-}" == "--json" ]] && JSON=1

CANDIDATES=(
  "src/app/brand-system"
  "src/app/butterfly-test"
  "src/app/design-system"
  "src/app/generator"
  "src/app/admin/generations"
  "src/app/admin/golden-examples"
  "src/app/api/generate-tokens"
  "src/app/api/generations"
  "src/app/api/discover-website"
  "src/components/ButterflyRingParticles.tsx"
  "instructions"
  "SCHEMA_V2_INSTRUCTIONS.md"
)

USE_RG=0
if command -v rg >/dev/null 2>&1 && [[ -x "$(command -v rg)" ]]; then
  USE_RG=1
fi

# Search for inbound references to a candidate from outside its own subtree.
# Anchors on the path-suffix unique to this candidate to avoid collisions
# with similarly-named modules elsewhere (e.g. src/app/generator vs.
# src/lib/generator). Strips a trailing .tsx/.ts/.md extension so files
# like ButterflyRingParticles.tsx match `ButterflyRingParticles` imports.
report_candidate() {
  local candidate="$1"
  local rel suffix pattern is_file=0

  if [[ -f "$REPO/$candidate" ]]; then
    is_file=1
  fi

  rel="${candidate#src/}"
  suffix="${rel%.tsx}"
  suffix="${suffix%.ts}"
  suffix="${suffix%.md}"

  if [[ $is_file -eq 1 ]]; then
    # Files: bare ref ends with quote, slash (rare), or extension dot
    pattern="(['\"/])${suffix}([\"'/.])"
  else
    # Directories: ref must include trailing slash to be a real path
    pattern="(['\"/])${suffix}/"
  fi

  local hits
  if [[ $USE_RG -eq 1 ]]; then
    hits=$(
      rg -n --no-heading --hidden \
         -g '!node_modules' -g '!.next' -g '!.git' -g '!docs/**' -g '!scripts/pre-retirement-check.sh' \
         -e "$pattern" \
         -- "$REPO" 2>/dev/null
    )
  else
    hits=$(
      grep -rnE "$pattern" \
        --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git --exclude-dir=docs \
        --exclude=pre-retirement-check.sh \
        "$REPO" 2>/dev/null
    )
  fi

  # Build a regex of "this candidate's own subtree" + "all other candidate subtrees"
  # so refs from one to-be-deleted file to another don't count as blockers.
  printf '%s' "$hits" | awk -v c="$REPO/$candidate" -v others="$OTHERS_PATTERN" -F: '
    BEGIN {
      n = split(others, arr, "|")
    }
    {
      file=$1
      if (index(file, c) == 1) next
      for (i = 1; i <= n; i++) {
        if (arr[i] != "" && index(file, arr[i]) == 1) next
      }
      print $0
    }'
}

CLEAN_COUNT=0
DIRTY_COUNT=0
COUNTS=()
SAMPLES=()

# Build a "|"-separated list of every candidate path. The awk filter inside
# report_candidate strips matches whose file lives in any candidate subtree
# (mutual to-be-deleted refs don't count as blockers).
OTHERS_PATTERN=""
for c in "${CANDIDATES[@]}"; do
  OTHERS_PATTERN+="${REPO}/${c}|"
done
export OTHERS_PATTERN

for candidate in "${CANDIDATES[@]}"; do
  if [[ ! -e "$REPO/$candidate" ]]; then
    COUNTS+=("-")
    SAMPLES+=("(absent)")
    CLEAN_COUNT=$((CLEAN_COUNT + 1))
    continue
  fi

  hits=$(report_candidate "$candidate")
  if [[ -z "$hits" ]]; then
    COUNTS+=("0")
    SAMPLES+=("")
    CLEAN_COUNT=$((CLEAN_COUNT + 1))
  else
    count=$(printf '%s\n' "$hits" | grep -c .)
    COUNTS+=("$count")
    SAMPLES+=("$(printf '%s\n' "$hits" | head -5)")
    DIRTY_COUNT=$((DIRTY_COUNT + 1))
  fi
done

if [[ $JSON -eq 1 ]]; then
  printf '{\n  "candidates": [\n'
  first=1
  for i in "${!CANDIDATES[@]}"; do
    [[ $first -eq 0 ]] && printf ',\n'
    first=0
    printf '    {"path": "%s", "refs": "%s"}' "${CANDIDATES[$i]}" "${COUNTS[$i]}"
  done
  printf '\n  ],\n  "clean": %d,\n  "dirty": %d\n}\n' "$CLEAN_COUNT" "$DIRTY_COUNT"
else
  printf '\n=== Pre-retirement reference check ===\n\n'
  printf '%-44s %s\n' "candidate" "inbound refs"
  printf '%-44s %s\n' "---------" "------------"
  for i in "${!CANDIDATES[@]}"; do
    printf '%-44s %s\n' "${CANDIDATES[$i]}" "${COUNTS[$i]}"
  done

  if [[ $DIRTY_COUNT -gt 0 ]]; then
    printf '\n--- Sample inbound references (first 5 per candidate) ---\n'
    for i in "${!CANDIDATES[@]}"; do
      [[ "${COUNTS[$i]}" == "0" || "${COUNTS[$i]}" == "-" ]] && continue
      printf '\n# %s (%s refs)\n' "${CANDIDATES[$i]}" "${COUNTS[$i]}"
      printf '%s\n' "${SAMPLES[$i]}"
    done
  fi

  printf '\n%d clean / %d with refs\n' "$CLEAN_COUNT" "$DIRTY_COUNT"
fi

[[ $DIRTY_COUNT -eq 0 ]]
