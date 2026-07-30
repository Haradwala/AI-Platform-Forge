# Rebuild native modules (node-pty) against the installed Electron version.
# Required after: Electron version upgrades, node-pty updates, or fresh installs.
# Run from monorepo root.

Write-Host "Rebuilding native modules for Electron..." -ForegroundColor Yellow

$electronVersion = node -e "console.log(require('./apps/forge-desktop/node_modules/electron/package.json').version)"
Write-Host "Target Electron version: $electronVersion" -ForegroundColor Cyan

pnpm --filter @forge/desktop exec electron-rebuild -f -w node-pty

Write-Host "Native rebuild complete." -ForegroundColor Green
