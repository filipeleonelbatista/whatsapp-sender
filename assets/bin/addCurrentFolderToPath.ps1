$curDir = Get-Location
Write-Host "Adicionando às variáveis path o caminho: $curDir para o usuário $env:UserName"

$currUserEnv = [Environment]::GetEnvironmentVariable('Path', [EnvironmentVariableTarget]::User)
Write-Host "Path: $currUserEnv"

[Environment]::SetEnvironmentVariable("Path",$currUserEnv + $curDir, [EnvironmentVariableTarget]::User)

# C:\Users\BMA0142\AppData\Local\Microsoft\WindowsApps;C:\Program Files (x86)\Java\jre1.8.0_341\bin\keytool.exe;C:\Users\BMA0142\AppData\Local\Android\Sdk\plataform-tools;C:\Users\BMA0142\AppData\Local\Android\Sdk\emulator;C:\Users\BMA0142\AppData\Local\Android\Sdk\tools\bin;C:\BMA0142\AppData\Local\Programs\Microsoft VS Code\bin;