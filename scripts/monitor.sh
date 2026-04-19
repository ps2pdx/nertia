#!/usr/bin/env bash
# Nertia session dashboard — live status for autonomous Claude work.
#
# Run in a dedicated terminal pane:
#   bash ~/code/nertia/scripts/monitor.sh
#
# Refreshes every 3 seconds. Ctrl-C to stop.

set -u

REPO="$HOME/code/nertia"
DEV_LOG="/tmp/nertia-dev.log"

clear_line() { printf '\033[2K\r'; }
bold()       { printf '\033[1m%s\033[0m' "$1"; }
dim()        { printf '\033[2m%s\033[0m' "$1"; }
green()      { printf '\033[32m%s\033[0m' "$1"; }
yellow()     { printf '\033[33m%s\033[0m' "$1"; }
red()        { printf '\033[31m%s\033[0m' "$1"; }
cyan()       { printf '\033[36m%s\033[0m' "$1"; }
magenta()    { printf '\033[35m%s\033[0m' "$1"; }

render() {
  clear
  local now branch ahead_behind changes_count commits devstatus last_change
  now=$(date '+%H:%M:%S')
  branch=$(git -C "$REPO" branch --show-current 2>/dev/null || echo "?")
  ahead_behind=$(git -C "$REPO" rev-list --left-right --count main...HEAD 2>/dev/null | awk '{print "behind "$1" / ahead "$2}')
  changes_count=$(git -C "$REPO" status --porcelain 2>/dev/null | wc -l | tr -d ' ')

  # Header
  printf '%s %s   %s\n' "$(cyan '◆')" "$(bold 'nertia.ai · zero-point session monitor')" "$(dim "[$now]")"
  echo   "════════════════════════════════════════════════════════════════"

  # Git state
  printf '%s %s  (%s)  %s\n' \
    "$(bold 'branch')" "$(magenta "$branch")" \
    "$ahead_behind" \
    "$([[ $changes_count -eq 0 ]] && green 'clean' || yellow "$changes_count uncommitted")"

  # Dev server
  if lsof -iTCP:3000 -sTCP:LISTEN -n -P >/dev/null 2>&1; then
    devstatus=$(green '● running')
    printf '%s %s  %s  %s\n' \
      "$(bold 'dev   ')" "$devstatus" \
      "$(cyan 'http://localhost:3000')" \
      "$(dim 'log: /tmp/nertia-dev.log')"
  else
    printf '%s %s  %s\n' \
      "$(bold 'dev   ')" "$(red '○ not running')" \
      "$(dim 'start with: npm run dev &> /tmp/nertia-dev.log &')"
  fi

  # Directions built
  echo
  echo "$(bold 'directions')  $(dim '(src/directions/)')"
  if [[ -d "$REPO/src/directions" ]]; then
    for d in "$REPO"/src/directions/*/; do
      [[ -d "$d" ]] || continue
      name=$(basename "$d")
      [[ "$name" == "types" ]] && continue
      if [[ -f "$d/Layout.tsx" ]]; then
        echo "  $(green '✓') $name"
      else
        echo "  $(yellow '○') $name $(dim '(no Layout.tsx)')"
      fi
    done
  else
    echo "  $(dim 'src/directions/ not yet created')"
  fi

  # MVP checklist
  echo
  echo "$(bold 'MVP progress')"
  check_file() {
    local label=$1 path=$2
    if [[ -e "$REPO/$path" ]]; then
      echo "  $(green '✓') $label $(dim "→ $path")"
    else
      echo "  $(dim '○') $label $(dim "→ $path")"
    fi
  }
  check_file "site renderer"       "src/app/hosted/[slug]/page.tsx"
  check_file "intake form"         "src/app/generate/page.tsx"
  check_file "generator API"       "src/app/api/generate/route.ts"
  check_file "subdomain middleware" "middleware.ts"
  check_file "zero-point direction" "src/directions/zero-point/Layout.tsx"
  check_file "humanize lib"        "src/lib/humanize.ts"
  check_file "direction types"     "src/directions/types.ts"

  # Recent commits
  echo
  echo "$(bold 'recent commits')"
  git -C "$REPO" log --oneline -5 2>/dev/null | sed 's/^/  /'

  # Working tree changes (if any)
  if [[ $changes_count -gt 0 ]]; then
    echo
    echo "$(bold 'working tree')  $(yellow "$changes_count pending")"
    git -C "$REPO" status --short 2>/dev/null | head -10 | sed 's/^/  /'
  fi

  echo
  echo "$(dim '[refresh 3s · ctrl-c to stop]')"
}

# Initial log message if dev server not running
if ! lsof -iTCP:3000 -sTCP:LISTEN -n -P >/dev/null 2>&1; then
  :
fi

while true; do
  render
  sleep 3
done
