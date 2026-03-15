# Deploy to GitHub Pages: build, sync dist to root, commit, push.
# Run from project root: .\deploy.ps1 ["optional commit message"]

$ErrorActionPreference = "Stop"
$repoRoot = $PSScriptRoot

Push-Location $repoRoot

try {
    Write-Host "Building..." -ForegroundColor Cyan
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Build failed" }

    Write-Host "Syncing dist to repo root..." -ForegroundColor Cyan
    Copy-Item -Path "dist\index.html" -Destination "index.html" -Force
    Copy-Item -Path "dist\vite.svg" -Destination "vite.svg" -Force
    Remove-Item -Path "assets\*" -Recurse -Force -ErrorAction SilentlyContinue
    Copy-Item -Path "dist\assets\*" -Destination "assets\" -Recurse -Force

    Write-Host "Staging changes..." -ForegroundColor Cyan
    git add index.html vite.svg assets/
    git add -u armor-images/
    git status --short

    $msg = if ($args.Count -gt 0) { $args[0] } else { "Deploy: rare armor tracker update" }
    git commit -m $msg

    Write-Host "Pushing to origin..." -ForegroundColor Cyan
    git push origin main
    Write-Host "Done. Site: https://stevew00dy.github.io/star-citizen-rare-armor/" -ForegroundColor Green
} finally {
    Pop-Location
}
