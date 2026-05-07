# 🎵 MP4 to MP3 Converter + AI Transcription (Whisper)

A robust application to convert MP4 videos into MP3 audio and generate high-precision automatic transcriptions using local Artificial Intelligence (**OpenAI Whisper**).

## ✨ Features

- ✅ **High-Speed Conversion:** Uses VLC Media Player for high-fidelity audio extraction.
- ✅ **Local AI Transcription:** Integration with `whisper.cpp` to transform audio into text without sending data to the cloud.
- ✅ **Real-Time Progress:** Track the transcription process step-by-step via Server-Sent Events (SSE).
- ✅ **Markdown Reports:** Automatically generates a `.md` file with the formatted transcription.
- ✅ **Modern Interface:** Clean, responsive, and intuitive design.

## 📋 Prerequisites

Before you begin, you will need:

1.  **Node.js** (v16 or higher)
2.  **VLC Media Player** 

### 📥 How to Install VLC

VLC is required to handle the audio conversion. Follow the steps for your operating system:

**Windows:**
1. Go to the official website: [videolan.org/vlc](https://www.videolan.org/vlc/)
2. Click the **"Download VLC"** button.
3. Run the installer and follow the default instructions.
4. (Optional) If you installed it in a custom path, update the `VLC_PATH` in `src/server.ts`.

**macOS:**
```bash
brew install vlc
````

## 🚀 Environment Setup

Since heavy binary files and AI models are not uploaded to GitHub, you must set them up manually:

### 1. Whisper Binaries
Download the correct `whisper-cli` version for your system:
- Go to [whisper.cpp Releases](https://github.com/ggerganov/whisper.cpp/releases).
- If you **DO NOT** have an NVIDIA GPU: Download `whisper-bin-x64.zip`.
- If you **DO** have an NVIDIA GPU: Download `whisper-cublas-12.4.0-bin-x64.zip`.
- Extract the contents into the `mp4-to-mp3-converter/Release/` folder.
- Ensure the executable is named `whisper-cli.exe`.

### 2. Language Model
- Download the `ggml-medium.bin` model (or any other of your choice) from: [Hugging Face Whisper Models](https://huggingface.co/ggerganov/whisper.cpp/tree/main).
- Place the `.bin` file in the root of the `mp4-to-mp3-converter/` folder.

### 3. Visual C++ Redistributable
- Install [Microsoft Visual C++ 2015-2022](https://aka.ms/vs/17/release/vc_redist.x64.exe) (required to run binaries on Windows).

## 🛠️ Installation and Usage

1.  **Install Node dependencies:**
    ```bash
    cd mp4-to-mp3-converter
    npm install
    ```

2.  **Start the server:**
    ```bash
    npm run dev
    ```

3.  **Access in your browser:**
    `http://localhost:3001`

## 📁 Project Structure

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


## ⚙️ Environment Variables

If your VLC is installed in a different path, you can set the `VLC_PATH` environment variable in your system or edit it directly in `server.ts`.

## 🔒 Security and Cleanup
- The application only validates `.mp4` files.
- Files are automatically removed from the server 1 second after download to save disk space.

---
Developed for maximum privacy and local performance. 🚀

