# 🎵 MP4 to MP3 Converter + Transcrição AI (Whisper)

Uma aplicação robusta para converter vídeos MP4 em áudio MP3 e gerar transcrições automáticas de alta precisão usando inteligência artificial local (**OpenAI Whisper**).

## ✨ Características

- ✅ **Conversão Veloz:** Utiliza o VLC Media Player para extração de áudio de alta fidelidade.
- ✅ **Transcrição AI Local:** Integração com `whisper.cpp` para transformar áudio em texto sem enviar dados para a nuvem.
- ✅ **Progresso em Tempo Real:** Acompanhe a transcrição passo a passo via Server-Sent Events (SSE).
- ✅ **Relatórios Markdown:** Gera automaticamente um arquivo `.md` com a transcrição formatada.
- ✅ **Interface Moderna:** Design limpo, responsivo e intuitivo.

## 📋 Pré-requisitos

Antes de começar, você precisará ter instalado:

1.  **Node.js** (v16 ou superior)
2.  **VLC Media Player** (Padrão: `C:\Program Files\VideoLAN\VLC\vlc.exe`)

## 🚀 Configuração do Ambiente

Como os binários pesados e modelos de IA não são enviados para o GitHub, você deve configurá-los manualmente:

### 1. Binários do Whisper
Baixe a versão correta do `whisper-cli` para o seu sistema:
- Acesse [whisper.cpp Releases](https://github.com/ggerganov/whisper.cpp/releases).
- Se você **NÃO** tem placa NVIDIA: Baixe `whisper-bin-x64.zip`.
- Se você **TEM** placa NVIDIA: Baixe `whisper-cublas-12.4.0-bin-x64.zip`.
- Extraia o conteúdo para a pasta `mp4-to-mp3-converter/Release/`.
- Certifique-se de que o executável se chama `whisper-cli.exe`.

### 2. Modelo de Linguagem
- Baixe o modelo `ggml-medium.bin` (ou outro de sua preferência) em: [Hugging Face Whisper Models](https://huggingface.co/ggerganov/whisper.cpp/tree/main).
- Coloque o arquivo `.bin` na raiz da pasta `mp4-to-mp3-converter/`.

### 3. Visual C++ Redistributable
- Instale o [Microsoft Visual C++ 2015-2022](https://aka.ms/vs/17/release/vc_redist.x64.exe) (necessário para rodar os binários no Windows).

## 🛠️ Instalação e Uso

1.  **Instale as dependências do Node:**
    ```bash
    cd mp4-to-mp3-converter
    npm install
    ```

2.  **Inicie o servidor:**
    ```bash
    npm run dev
    ```

3.  **Acesse no navegador:**
    `http://localhost:3001`

## 📁 Estrutura do Projeto

```
mp4-to-mp3-converter/
├── Release/               # Binários do Whisper (whisper-cli.exe e DLLs)
├── src/
│   └── server.ts          # Servidor Express com lógica VLC e Whisper
├── public/                # Frontend da aplicação
├── uploads/               # Arquivos temporários de vídeo
├── downloads/             # Arquivos MP3 e transcrições geradas
├── ggml-medium.bin        # Modelo da IA (Deve ser baixado manualmente)
└── package.json
```

## ⚙️ Variáveis de Ambiente

Caso seu VLC esteja instalado em um caminho diferente, você pode configurar a variável `VLC_PATH` no seu sistema ou editar diretamente no `server.ts`.

## 🔒 Segurança e Limpeza
- A aplicação valida apenas arquivos `.mp4`.
- Os arquivos são removidos automaticamente do servidor 1 segundo após o download para economizar espaço em disco.

---
Desenvolvido para máxima privacidade e performance local. 🚀
