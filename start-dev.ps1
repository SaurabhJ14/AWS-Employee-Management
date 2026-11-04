Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
cd $PSScriptRoot
& ./clear-ports.ps1
npm.cmd run dev
