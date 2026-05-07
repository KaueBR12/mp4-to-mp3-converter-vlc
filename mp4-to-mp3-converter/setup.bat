@echo off
echo 🎵 MP4 to MP3 Converter - Setup
echo ================================

REM Verificar Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js nao esta instalado. Instale em: https://nodejs.org
    pause
    exit /b 1
)

REM Verificar FFmpeg
where ffmpeg >nul 2>nul
if errorlevel 1 (
    echo ❌ FFmpeg nao esta instalado.
    echo Instale com: choco install ffmpeg
    echo ou baixe em: https://ffmpeg.org/download.html
    pause
    exit /b 1
)

echo ✅ Node.js: 
node -v
echo ✅ FFmpeg: 
ffmpeg -version | findstr /C:"ffmpeg version"

echo.
echo 📦 Instalando dependencias...
call npm install

echo.
echo ✨ Setup concluido!
echo.
echo Para iniciar:
echo   npm run dev    (desenvolvimento)
echo   npm start      (producao - precisa 'npm run build' antes)
echo.
echo Acesse: http://localhost:3000
echo.
pause
