@echo off
setlocal

cd /d "%~dp0"

if exist ".next" rmdir /s /q ".next"

set "READORA_PORT=3000"

:find_available_port
set "PORT_IN_USE="
for /f "tokens=5" %%P in ('netstat -ano ^| findstr ":%READORA_PORT% " ^| findstr "LISTENING"') do set "PORT_IN_USE=1"
if defined PORT_IN_USE (
  set /a READORA_PORT+=1
  goto find_available_port
)

echo Starting Readora on port %READORA_PORT%...
start "Readora Dev Server" cmd /k "npm.cmd run dev -- -p %READORA_PORT%"
timeout /t 10 /nobreak >nul
start "" "http://localhost:%READORA_PORT%"

endlocal
