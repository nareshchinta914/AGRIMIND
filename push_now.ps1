$env:PATH = "E:\Tools\MinGit\cmd;E:\Tools\gh\bin;" + $env:PATH
$token = (& "E:\Tools\gh\bin\gh.exe" auth token).Trim()
Write-Host "Authenticated as user with valid token."

$repoUrl = "https://nareshchinta914:$token@github.com/nareshchinta914/AGRIMIND.git"
Write-Host "Pushing AGRIMIND codebase to GitHub repository..."
& "E:\Tools\MinGit\cmd\git.exe" push $repoUrl main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS! Code pushed to https://github.com/nareshchinta914/AGRIMIND"
} else {
    Write-Host "Attempting push to https://github.com/nareshchinta914/Agrimind.git ..."
    $repoUrl2 = "https://nareshchinta914:$token@github.com/nareshchinta914/Agrimind.git"
    & "E:\Tools\MinGit\cmd\git.exe" push $repoUrl2 main --force
}
