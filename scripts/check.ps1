param()

. (Join-Path $PSScriptRoot "lib\entry.ps1")

Write-Host '[check.ps1] running static project checks'
exit (Invoke-RepoNodeScript -ScriptPath 'scripts/check.mjs')
