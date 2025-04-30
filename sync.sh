#!/usr/bin/env bash
set -Eeuo pipefail

echo "▶  Sync main to vibany-next …"
git push sync main --force-with-lease

echo "▶  Sync tags to vibany-next …"
git push sync --tags --force-with-lease

echo "✓   Done!"
