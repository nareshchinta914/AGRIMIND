@echo off
title AGRIMIND - One-Click GitHub Login & Push
color 0A
cls
echo =======================================================================
echo              AGRIMIND - ONE-CLICK GITHUB AUTOMATIC PUSH
echo =======================================================================
echo.
echo Target Repository: https://github.com/nareshchinta914/AGRIMIND.git
echo.
echo Step 1: Connecting with your GitHub account...
echo A browser window will open automatically.
echo If a one-time 8-digit code appears on the screen, paste/enter it in your browser.
echo.
echo =======================================================================
pause

E:\Tools\gh\bin\gh.exe auth login -h github.com -p https --git-protocol https -w

echo.
echo Step 2: Configuring Git with your GitHub credentials...
E:\Tools\gh\bin\gh.exe auth setup-git

echo.
echo Step 3: Pushing AGRIMIND codebase to github.com/nareshchinta914/AGRIMIND ...
E:\Tools\MinGit\cmd\git.exe remote set-url origin https://github.com/nareshchinta914/AGRIMIND.git
E:\Tools\MinGit\cmd\git.exe push -u origin main --force

echo.
if %ERRORLEVEL% EQU 0 (
    echo =======================================================================
    echo    SUCCESS! Your project has been pushed to GitHub!
    echo    View your repo: https://github.com/nareshchinta914/AGRIMIND
    echo =======================================================================
) else (
    echo.
    echo Push encountered an issue. Please make sure the AGRIMIND repository is created on github.com/new.
)
echo.
echo Press any key to exit.
pause >nul
