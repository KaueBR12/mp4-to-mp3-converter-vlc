# 🎵 Instalando VLC para o Conversor MP4 → MP3

O VLC é **muito mais fácil** de instalar que FFmpeg!

## 📥 Passo 1: Baixar VLC

### Windows:
1. Acesse: https://www.videolan.org/vlc/
2. Clique em **"Download VLC"** (botão laranja)
3. Execute o instalador

### macOS:
```bash
brew install vlc
```

### Linux:
```bash
sudo apt-get install vlc
```

---

## ✅ Passo 2: Verificar instalação

Depois de instalar, **reinicie o PowerShell** e execute:

```powershell
vlc --version
```

Se aparecer a versão, está instalado corretamente!

---

## 🚀 Passo 3: Iniciar o conversor

No seu projeto, execute:

```bash
npm install
npm run dev
```

E acesse: **http://localhost:3001**

---

## ⚙️ Se VLC estiver em local diferente:

Se a aplicação disser que não encontrou VLC, você pode especificar o caminho manualmente.

**No Windows**, abra PowerShell e procure:
```powershell
Get-Command vlc
```

Se aparecer algo como `C:\Program Files\VideoLAN\VLC\vlc.exe`, copie esse caminho.

Depois, antes de iniciar o servidor, execute:
```powershell
$env:VLC_PATH="C:\Program Files\VideoLAN\VLC\vlc.exe"
npm run dev
```

---

## 🎉 Pronto!

Agora é só usar a interface web para converter seus vídeos! 🎵

---

**Dúvidas?** A maioria dos PCs já tem VLC instalado, então pode ser que você nem precise instalar nada!
