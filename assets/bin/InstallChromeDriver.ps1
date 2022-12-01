[CmdletBinding()]
param (
    [Parameter(Mandatory = $true)]
    [string]
    $ChromeDriverOutputPath,    
    [Parameter(Mandatory = $false)]
    [string]
    $ChromeVersion, 
    [Parameter(Mandatory = $false)]
    [Switch]
    $ForceDownload
)

# Force update chromedriver
#  .\InstallChromeDriver.ps1 -ChromeDriverOutputPath .\chromedriver.exe -ForceDownload
# Only install
#  .\InstallChromeDriver.ps1 -ChromeDriverOutputPath .\chromedriver.exe

# https://swimburger.net/blog/powershell/download-the-right-chromedriver-on-windows-linux-macos-using-powershell
# Add variables to path of user
$curDir = Get-Location
Write-Host "Adicionando às variáveis path o caminho: $curDir para o usuário $env:UserName"

$currUserEnv = [Environment]::GetEnvironmentVariable('Path', [EnvironmentVariableTarget]::User)
Write-Host "Path: $currUserEnv"

[Environment]::SetEnvironmentVariable("Path",$currUserEnv + $curDir, [EnvironmentVariableTarget]::User)
# Ending of Add variables to path of user

# store original preference to revert back later
$OriginalProgressPreference = $ProgressPreference;
# setting progress preference to silently continue will massively increase the performance of downloading the ChromeDriver
$ProgressPreference = 'SilentlyContinue';

Function Get-ChromeVersion {
    # $IsWindows will PowerShell Core but not on PowerShell 5 and below, but $Env:OS does
    # this way you can safely check whether the current machine is running Windows pre and post PowerShell Core
    If ($IsWindows -or $Env:OS) {
        Try {
            (Get-Item (Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe' -ErrorAction Stop).'(Default)').VersionInfo.FileVersion;
        }
        Catch {
            Throw "Google Chrome not found in registry";
        }
    }
    ElseIf ($IsLinux) {
        Try {
            # this will check whether google-chrome command is available
            Get-Command google-chrome -ErrorAction Stop | Out-Null;
            google-chrome --product-version;
        }
        Catch {
            Throw "'google-chrome' command not found";
        }
    }
    ElseIf ($IsMacOS) {
        $ChromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
        If (Test-Path $ChromePath) {
            $Version = & $ChromePath --version;
            $Version = $Version.Replace("Google Chrome ", "");
            $Version;
        }
        Else {
            Throw "Google Chrome not found on your MacOS machine";
        }
    }
    Else {
        Throw "Your operating system is not supported by this script.";
    }
}

# Instructions from https://chromedriver.chromium.org/downloads/version-selection
#   First, find out which version of Chrome you are using. Let's say you have Chrome 72.0.3626.81.
If ([string]::IsNullOrEmpty($ChromeVersion)) {
    $ChromeVersion = Get-ChromeVersion -ErrorAction Stop;
    Write-Output "Google Chrome version $ChromeVersion found on machine";
}

#   Take the Chrome version number, remove the last part, 
$ChromeVersion = $ChromeVersion.Substring(0, $ChromeVersion.LastIndexOf("."));
#   and append the result to URL "https://chromedriver.storage.googleapis.com/LATEST_RELEASE_". 
#   For example, with Chrome version 72.0.3626.81, you'd get a URL "https://chromedriver.storage.googleapis.com/LATEST_RELEASE_72.0.3626".
$ChromeDriverVersion = (Invoke-WebRequest "https://chromedriver.storage.googleapis.com/LATEST_RELEASE_$ChromeVersion").Content;
Write-Output "Latest matching version of Chrome Driver is $ChromeDriverVersion";

If (($ForceDownload -eq $False) -and ($ChromeDriverOutputPath)) {
    #ChromeDriver 88.0.4324.96 (68dba2d8a0b149a1d3afac56fa74648032bcf46b-refs/branch-heads/4324@{#1784})
    $ExistingChromeDriverVersion = & $ChromeDriverOutputPath --version;
    $ExistingChromeDriverVersion = $ExistingChromeDriverVersion.Split(" ")[1];
    If ($ChromeDriverVersion -eq $ExistingChromeDriverVersion) {
        Write-Output "Chromedriver on machine is already latest version. Skipping.";
        Write-Output "Use -ForceDownload to reinstall regardless";
        Exit;
    }
}

$TempFilePath = [System.IO.Path]::GetTempFileName();
$TempZipFilePath = $TempFilePath.Replace(".tmp", ".zip");
Rename-Item -Path $TempFilePath -NewName $TempZipFilePath;
$TempFileUnzipPath = $TempFilePath.Replace(".tmp", "");
#   Use the URL created in the last step to retrieve a small file containing the version of ChromeDriver to use. For example, the above URL will get your a file containing "72.0.3626.69". (The actual number may change in the future, of course.)
#   Use the version number retrieved from the previous step to construct the URL to download ChromeDriver. With version 72.0.3626.69, the URL would be "https://chromedriver.storage.googleapis.com/index.html?path=72.0.3626.69/".

If ($IsWindows -or $Env:OS) {
    Invoke-WebRequest "https://chromedriver.storage.googleapis.com/$ChromeDriverVersion/chromedriver_win32.zip" -OutFile $TempZipFilePath;
    Expand-Archive $TempZipFilePath -DestinationPath $TempFileUnzipPath;
    Move-Item "$TempFileUnzipPath/chromedriver.exe" -Destination $ChromeDriverOutputPath -Force;
}
ElseIf ($IsLinux) {
    Invoke-WebRequest "https://chromedriver.storage.googleapis.com/$ChromeDriverVersion/chromedriver_linux64.zip" -OutFile $TempZipFilePath;
    Expand-Archive $TempZipFilePath -DestinationPath $TempFileUnzipPath;
    Move-Item "$TempFileUnzipPath/chromedriver" -Destination $ChromeDriverOutputPath -Force;
}
ElseIf ($IsMacOS) {
    Invoke-WebRequest "https://chromedriver.storage.googleapis.com/$ChromeDriverVersion/chromedriver_mac64.zip" -OutFile $TempZipFilePath;
    Expand-Archive $TempZipFilePath -DestinationPath $TempFileUnzipPath;
    Move-Item "$TempFileUnzipPath/chromedriver" -Destination $ChromeDriverOutputPath -Force;
}
Else {
    Throw "Your operating system is not supported by this script.";
}

#   After the initial download, it is recommended that you occasionally go through the above process again to see if there are any bug fix releases.

# Clean up temp files
Remove-Item $TempZipFilePath;
Remove-Item $TempFileUnzipPath -Recurse;

# reset back to original Progress Preference
$ProgressPreference = $OriginalProgressPreference;