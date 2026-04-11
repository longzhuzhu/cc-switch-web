param(
  [Parameter(Mandatory = $true)]
  [string]$Image,
  [string]$ContainerName = 'cc-switch-web-smoke',
  [int]$HostPort = 8890,
  [int]$ContainerPort = 8890,
  [string]$BuildContext = '',
  [switch]$RemoveImageAfterRun
)

$ErrorActionPreference = 'Stop'

function Remove-DockerContainerIfExists {
  param([string]$Name)

  $existing = & docker ps -a --filter ("name=^/{0}$" -f $Name) --format '{{.Names}}'
  if ($LASTEXITCODE -ne 0) {
    throw ('Failed to query Docker containers for ' + $Name)
  }

  if ($existing -contains $Name) {
    & docker rm -f $Name | Out-Null
    if ($LASTEXITCODE -ne 0) {
      throw ('Failed to remove Docker container: ' + $Name)
    }
  }
}

function Remove-DockerImageIfExists {
  param([string]$ImageName)

  & docker image inspect $ImageName 2>$null | Out-Null
  if ($LASTEXITCODE -eq 0) {
    & docker image rm -f $ImageName | Out-Null
    if ($LASTEXITCODE -ne 0) {
      throw ('Failed to remove Docker image: ' + $ImageName)
    }
  }
}

if ($BuildContext) {
  Write-Host ('[docker-smoke] building Docker image: {0}' -f $Image)
  & docker build -t $Image $BuildContext
  if ($LASTEXITCODE -ne 0) {
    throw ('Failed to build Docker image: ' + $Image)
  }
}

Remove-DockerContainerIfExists -Name $ContainerName

try {
  Write-Host ('[docker-smoke] starting container: {0}' -f $ContainerName)
  & docker run -d --name $ContainerName -p "${HostPort}:${ContainerPort}" $Image | Out-Null
  if ($LASTEXITCODE -ne 0) {
    throw ('Failed to start Docker smoke container: ' + $ContainerName)
  }

  $healthUrl = "http://127.0.0.1:${HostPort}/api/health"
  Write-Host ('[docker-smoke] waiting for health endpoint: {0}' -f $healthUrl)
  $passed = $false
  for ($attempt = 1; $attempt -le 30; $attempt++) {
    Write-Host ('[docker-smoke] health attempt {0}/30' -f $attempt)
    try {
      $response = Invoke-WebRequest -Uri $healthUrl -UseBasicParsing -TimeoutSec 3
      if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300) {
        Write-Host ('[docker-smoke] passed: {0}' -f $healthUrl)
        $passed = $true
        break
      }
    } catch {
      # 等待服务完成启动或数据库迁移
    }

    Start-Sleep -Seconds 2
  }

  if ($passed) {
    return
  }

  Write-Host 'health check timeout'
  & docker logs $ContainerName
  throw 'Docker smoke check failed: timeout waiting for /api/health'
} finally {
  Remove-DockerContainerIfExists -Name $ContainerName
  if ($RemoveImageAfterRun) {
    Remove-DockerImageIfExists -ImageName $Image
  }
}
