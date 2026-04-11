param(
  [ValidateSet("w", "d")]
  [string]$Mode = "w"
)

. (Join-Path $PSScriptRoot "lib\entry.ps1")

exit (Invoke-RepoNodeScript -ScriptPath 'scripts/build.mjs' -Arguments @($Mode))
