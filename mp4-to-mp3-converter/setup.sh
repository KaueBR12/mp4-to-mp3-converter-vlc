#!/bin/bash

echo "🎵 MP4 to MP3 Converter - Setup"
echo "================================"

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Instale em: https://nodejs.org"
    exit 1
fi

# Verificar se FFmpeg está instalado
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ FFmpeg não está instalado."
    echo "Instale com:"
    echo "  Ubuntu/Debian: sudo apt-get install ffmpeg"
    echo "  macOS: brew install ffmpeg"
    echo "  Windows: choco install ffmpeg"
    exit 1
fi

echo "✅ Node.js: $(node -v)"
echo "✅ FFmpeg: $(ffmpeg -version | head -n 1)"

echo ""
echo "📦 Instalando dependências..."
npm install

echo ""
echo "✨ Setup concluído!"
echo ""
echo "Para iniciar:"
echo "  npm run dev    (desenvolvimento)"
echo "  npm start      (produção - precisa 'npm run build' antes)"
echo ""
echo "Acesse: http://localhost:3000"
