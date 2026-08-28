@echo off
title AGRIMIND - Push Project to GitHub
color 0A
echo =======================================================================
echo          AGRIMIND - Push Code to GitHub (nareshchinta914/AGRIMIND)
echo =======================================================================
echo.
echo Remote Repository: https://github.com/nareshchinta914/AGRIMIND.git
echo.
echo If you have a GitHub Personal Access Token (from https://github.com/settings/tokens):
echo Paste it below and press Enter.
echo.
echo If you want to use Windows Browser Login / Credential Prompt:
echo Just press Enter directly without typing anything.
echo.
echo =======================================================================
set /p TOKEN="Enter GitHub Token (or press ENTER for direct push): "

if "%TOKEN%"=="" (
    echo.
    echo Pushing directly to https://github.com/nareshchinta914/AGRIMIND.git ...
    E:\Tools\MinGit\cmd\git.exe push -u origin main
) else (
    echo.
    echo Pushing with Token to https://github.com/nareshchinta914/AGRIMIND.git ...
    E:\Tools\MinGit\cmd\git.exe push -u https://nareshchinta914:%TOKEN%@github.com/nareshchinta914/AGRIMIND.git main
)

echo.
if %ERRORLEVEL% EQU 0 (
    echo =======================================================================
    echo    SUCCESS! Project successfully pushed to github.com/nareshchinta914/AGRIMIND
    echo =======================================================================
) else (
    echo.
    echo If push failed, please make sure your Personal Access Token has 'repo' permissions.
)
echo.
echo Press any key to close this window.
pause >nul
