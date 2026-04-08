#!/usr/bin/env bash
# Recreate the dev symlink after plugin install/update overwrites the cache
rm -rf ~/.claude/plugins/cache/powers4all-dev/pa/0.1.0
ln -s "$(cd "$(dirname "$0")" && pwd)" ~/.claude/plugins/cache/powers4all-dev/pa/0.1.0
echo "Symlink recreated → $(ls -la ~/.claude/plugins/cache/powers4all-dev/pa/0.1.0)"
