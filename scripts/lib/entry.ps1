function Get-RepoRoot {
  $helperDir = Split-Path -Parent $PSScriptRoot
  return (Resolve-Path (Join-Path $helperDir '..')).Path
}

function Invoke-RepoNodeScript {
  param(
    [Parameter(Mandatory = $true)]
    [string]$ScriptPath,
    [object[]]$Arguments = @()
  )

  $repoRoot = Get-RepoRoot

  Push-Location $repoRoot
  try {
    $argumentList = @((Join-Path $repoRoot $ScriptPath)) + $Arguments
    $process = Start-Process -FilePath 'node' `
      -ArgumentList $argumentList `
      -WorkingDirectory $repoRoot `
      -NoNewWindow `
      -Wait `
      -PassThru
    return $process.ExitCode
  } finally {
    Pop-Location
  }
}

function Invoke-RepoPowerShellScript {
  param(
    [Parameter(Mandatory = $true)]
    [string]$ScriptPath,
    [object[]]$Arguments = @()
  )

  $repoRoot = Get-RepoRoot

  Push-Location $repoRoot
  try {
    $argumentList = @(
      '-ExecutionPolicy',
      'Bypass',
      '-File',
      (Join-Path $repoRoot $ScriptPath)
    ) + $Arguments
    $process = Start-Process -FilePath 'powershell' `
      -ArgumentList $argumentList `
      -WorkingDirectory $repoRoot `
      -NoNewWindow `
      -Wait `
      -PassThru
    return $process.ExitCode
  } finally {
    Pop-Location
  }
}
