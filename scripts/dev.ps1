param(
  [ValidateSet("w", "d")]
  [string]$Mode = "w",
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$ExtraArgs
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = (Resolve-Path (Join-Path $scriptDir "..")).Path

Push-Location $repoRoot
try {
  & node (Join-Path $scriptDir "dev.mjs") $Mode @ExtraArgs
  exit $LASTEXITCODE
} finally {
  Pop-Location
}
