# 🎵 MP4 to MP3 Converter

Uma aplicação web elegante para converter arquivos MP4 em MP3 com interface intuitiva.

## ✨ Características

- ✅ Interface web limpa e responsiva
- ✅ Drag & drop para upload
- ✅ Conversão rápida com FFmpeg
- ✅ Barra de progresso em tempo real
- ✅ Download automático após conversão
- ✅ Limpeza automática de arquivos

## 📋 Pré-requisitos

- Node.js (v16+)
- FFmpeg instalado no sistema

### Instalar FFmpeg

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

**macOS (com Homebrew):**
```bash
brew install ffmpeg
```

**Windows:**
Baixe em: https://ffmpeg.org/download.html
Ou use: `choco install ffmpeg`

## 🚀 Instalação e Uso

### 1. Clonar ou copiar os arquivos
```bash
cd mp4-to-mp3-converter
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Compilar TypeScript (opcional, necessário para produção)
```bash
npm run build
```

### 4. Iniciar o servidor em desenvolvimento
```bash
npm run dev
```

Ou em produção:
```bash
npm run build
npm start
```

### 5. Abrir no navegador
```
http://localhost:3000
```

## 📁 Estrutura do Projeto

```
mp4-to-mp3-converter/
├── src/
│   └── server.ts          # Servidor Express em TypeScript
├── public/
│   └── index.html         # Interface web
├── uploads/               # Pasta para arquivos sendo processados
├── downloads/             # Pasta para arquivos convertidos
├── package.json
├── tsconfig.json
└── README.md
```

## 🎯 Como Usar

1. Abra http://localhost:3000 no navegador
2. Clique no área ou arraste um arquivo MP4
3. Clique em "Converter"
4. Aguarde a conversão
5. Clique em "Baixar MP3"

## ⚙️ Configurações

### Qualidade do Áudio

Você pode ajustar a qualidade do áudio no arquivo `src/server.ts`:

```typescript
.audioBitrate('192k')        // 128k, 192k, 256k, 320k
.audioFrequency(44100)       // 44100, 48000
.audioChannels(2)            // 1 (mono), 2 (stereo)
```

## 🔒 Segurança

- ✅ Validação de tipo de arquivo
- ✅ Limite de upload (ajustável)
- ✅ Limpeza automática de arquivos
- ✅ CORS habilitado

## 📝 Notas

- Máximo recomendado: 500MB
- Arquivos são deletados automaticamente após download
- Suporta apenas MP4 no momento (fácil adicionar mais formatos)

## 🐛 Solução de Problemas

**Erro: "ffmpeg: command not found"**
- FFmpeg não está instalado. Veja pré-requisitos acima.

**Erro: "ENOENT: no such file or directory"**
- Certifique-se que os diretórios `uploads/` e `downloads/` existem.

**Conversão lenta**
- Arquivos muito grandes demoram mais. Considere comprimir antes.

## 📄 Licença

MIT

---

Desenvolvido com ❤️ em TypeScript + Node.js
