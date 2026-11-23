#!/usr/bin/env bash
# Fails if anything that looks like an API key is committed.
# Runs in CI and locally with: npm run check:secrets
set -euo pipefail

PATTERNS='(sk-[A-Za-z0-9_-]{20,}|sk-proj-[A-Za-z0-9_-]{20,}|voc-[A-Za-z0-9]{20,}|sk-ant-[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{30,})'

FILES=$(git ls-files 2>/dev/null || find . -type f -not -path './node_modules/*' -not -path './.git/*')

# shellcheck disable=SC2086
if echo "$FILES" | grep -v -E '^scripts/check-secrets\.sh$' | xargs -r grep -I -n -E "$PATTERNS" 2>/dev/null; then
  echo "ERROR: possible API key found in the files above. Remove it, rotate the key, and use environment variables." >&2
  exit 1
fi

if git ls-files 2>/dev/null | grep -E '(^|/)\.env(\.|$)' | grep -v -E '\.env\.example$'; then
  echo "ERROR: an .env file is committed. Remove it from git and rotate any keys in it." >&2
  exit 1
fi

echo "Secret scan passed: no API keys or .env files committed."
