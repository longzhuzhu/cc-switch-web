param(
  [ValidateSet("w", "d")]
  [string]$Mode = "w",
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$ExtraArgs
)

. (Join-Path $PSScriptRoot "lib\entry.ps1")

exit (Invoke-RepoNodeScript -ScriptPath 'scripts/dev.mjs' -Arguments @($Mode) + $ExtraArgs)
