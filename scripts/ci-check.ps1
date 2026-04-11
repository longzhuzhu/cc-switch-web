param(
  [int]$DockerSmokePort = 8890
)

. (Join-Path $PSScriptRoot "lib\entry.ps1")

Write-Host '[ci-check] step 1/2: running static checks'
$checkExitCode = Invoke-RepoPowerShellScript -ScriptPath 'scripts/check.ps1'
if ($checkExitCode -ne 0) {
  exit $checkExitCode
}

$repoRoot = Get-RepoRoot
Write-Host '[ci-check] step 2/2: running Docker smoke check'
exit (Invoke-RepoPowerShellScript -ScriptPath 'scripts/docker-smoke.ps1' -Arguments @(
  '-Image',
  'cc-switch-web:check',
  '-ContainerName',
  'cc-switch-web-check-smoke',
  '-HostPort',
  $DockerSmokePort,
  '-BuildContext',
  $repoRoot,
  '-RemoveImageAfterRun'
))
