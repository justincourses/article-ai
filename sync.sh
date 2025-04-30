#!/usr/bin/env bash
set -Eeuo pipefail

echo "▶  Sync main to article-ai …"
git push sync main --force-with-lease

echo "▶  Sync tags to article-ai …"
git push sync --tags --force-with-lease

echo "✓   Done!"
