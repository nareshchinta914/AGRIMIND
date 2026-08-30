@echo off
title AGRIMIND - Auto Deploy to Vercel & GitHub
color 0A
cls
echo =======================================================================
echo          🌾 AGRIMIND - AUTOMATED GITHUB & VERCEL DEPLOYMENT
echo =======================================================================
echo.
echo [1/4] Detecting Git...

set GIT_CMD=git
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    if exist "E:\Tools\MinGit\cmd\git.exe" (
        set GIT_CMD=E:\Tools\MinGit\cmd\git.exe
    ) else if exist "C:\Program Files\Git\cmd\git.exe" (
        set GIT_CMD="C:\Program Files\Git\cmd\git.exe"
    ) else (
        echo [ERROR] Git could not be found. Please ensure Git is installed.
        pause
        exit /b 1
    )
)

echo Git found: %GIT_CMD%
echo.

echo [2/4] Checking repository status & staging files...
%GIT_CMD% add -A
%GIT_CMD% status --short

echo.
set /p COMMIT_MSG="Enter commit description (Press ENTER for auto timestamp): "

if "%COMMIT_MSG%"=="" (
    for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
    set COMMIT_MSG=Auto-Deploy: %datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2% %datetime:~8,2%:%datetime:~10,2%
)

echo.
echo [3/4] Creating commit: "%COMMIT_MSG%"
%GIT_CMD% commit -m "%COMMIT_MSG%"

echo.
echo [4/4] Pushing to GitHub (origin main)...
%GIT_CMD% push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =======================================================================
    echo    🚀 SUCCESS! Pushed to GitHub (nareshchinta914/AGRIMIND)
    echo    ⚡ Vercel has automatically detected the push and started building!
    echo    🌐 Check your deployment: https://vercel.com/dashboard
    echo    📦 GitHub Repository:    https://github.com/nareshchinta914/AGRIMIND
    echo =======================================================================
) else (
    echo.
    echo [WARNING] Push encountered an issue. Check your internet connection or Git credentials.
)

echo.
echo Press any key to exit.
pause >nul
