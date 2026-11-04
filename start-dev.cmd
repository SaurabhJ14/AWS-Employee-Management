@echo off
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File ".\clear-ports.ps1"
npm.cmd run dev
