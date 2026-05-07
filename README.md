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
2.  **VLC Media Player** (Default path: `C:\Program Files\VideoLAN\VLC\vlc.exe`)

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

