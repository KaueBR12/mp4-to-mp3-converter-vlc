import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { execFile, spawn } from 'child_process';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
const PORT = 3001;



// Caminho do VLC - ajuste se necessário
const VLC_PATH = process.env.VLC_PATH || 'C:\\Program Files\\VideoLAN\\VLC\\vlc.exe';

// Configuração Whisper Local
const WHISPER_CLI_PATH = path.join(__dirname, '../Release/whisper-cli.exe');
const WHISPER_MODEL_PATH = path.join(__dirname, '../ggml-small.bin');

// Criar diretórios necessários
const uploadsDir = path.join(__dirname, '../uploads');
const downloadsDir = path.join(__dirname, '../downloads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

// Configurar multer para upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // Limite de 500MB por arquivo
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['video/mp4', 'video/mpeg'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only MP4 files are allowed'));
    }
  },
});

app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

// Rota para servir a página HTML
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Função para sanitizar nomes de arquivos (remover acentos e espaços)
const sanitizeFilename = (name: string) => {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w.-]/g, '_')        // Substitui caracteres especiais por underline
    .toLowerCase();
};

// Rota para fazer upload e converter
app.post('/api/convert', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const inputPath = req.file.path;
    const originalName = path.parse(req.file.originalname).name;
    const filename = sanitizeFilename(originalName);
    const outputPath = path.join(downloadsDir, `${filename}.mp3`);

    console.log(`Converting with VLC: ${inputPath} -> ${outputPath}`);

    // Comando VLC para converter
    const vlcArgs = [
      '-I',
      'dummy',
      inputPath,
      `--sout=#transcode{acodec=mp3,ab=192}:standard{access=file,mux=raw,dst='${outputPath}'}`,
      'vlc://quit',
    ];

    execFile(VLC_PATH, vlcArgs, { maxBuffer: 500 * 1024 * 1024 }, (error) => {
      if (error) {
        console.error('VLC error:', error);
        fs.unlink(inputPath, (err) => {
          if (err) console.error('Error deleting input file:', err);
        });
        return res.status(500).json({ error: 'Conversion failed', details: error.message });
      }

      console.log('Conversion finished');

      // Deletar arquivo original
      fs.unlink(inputPath, (err) => {
        if (err) console.error('Error deleting input file:', err);
      });

      res.json({
        success: true,
        message: 'File converted successfully',
        filename: `${filename}.mp3`,
        url: `/download/${filename}.mp3`,
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error', details: String(error) });
  }
});

// Rota para transcrição Real com Whisper Local (Síncrona)
app.post('/api/transcribe', async (req: Request, res: Response) => {
  try {
    const { filename } = req.body;
    if (!filename) {
      return res.status(400).json({ error: 'No filename provided' });
    }

    const mp3Path = path.join(downloadsDir, filename);
    const wavPath = mp3Path.replace('.mp3', '_temp_sync.wav');
    const outputBase = mp3Path.replace('.mp3', '_transcribed_sync');

    if (!fs.existsSync(mp3Path)) {
      return res.status(404).json({ error: 'Audio file not found for transcription' });
    }

    console.log(`Transcribing with Local Whisper: ${mp3Path}`);

    // Converter para WAV 16kHz
    const vlcArgs = [
      '-I', 'dummy',
      mp3Path,
      `--sout=#transcode{acodec=s16l,samplerate=16000,channels=1}:standard{access=file,mux=wav,dst='${wavPath}'}`,
      'vlc://quit',
    ];

    execFile(VLC_PATH, vlcArgs, { maxBuffer: 500 * 1024 * 1024 }, (vlcError) => {
      if (vlcError) {
        return res.status(500).json({ error: 'Failed to convert audio for transcription' });
      }

      const whisperArgs = [
        '-m', WHISPER_MODEL_PATH,
        '-f', wavPath,
        '-l', 'pt',
        '-otxt',
        '-of', outputBase
      ];

      execFile(WHISPER_CLI_PATH, whisperArgs, (whisperError) => {
        if (fs.existsSync(wavPath)) fs.unlinkSync(wavPath);

        if (whisperError) {
          return res.status(500).json({ error: 'Whisper transcription failed', details: whisperError.message });
        }

        const txtPath = `${outputBase}.txt`;
        let transcriptionText = '';
        if (fs.existsSync(txtPath)) {
          transcriptionText = fs.readFileSync(txtPath, 'utf8');
          fs.unlinkSync(txtPath);
        }

        res.json({
          success: true,
          transcription: transcriptionText
        });
      });
    });
  } catch (error: any) {
    console.error('Transcription error:', error);
    res.status(500).json({
      error: 'Transcription failed',
      details: error.message || String(error)
    });
  }
});

// Rota SSE para progresso em tempo real da transcrição
app.get('/api/transcribe-progress', async (req: Request, res: Response) => {
  const { filename } = req.query;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const sendEvent = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  let heartbeat: NodeJS.Timeout | undefined;

  try {
    if (!filename || typeof filename !== 'string') {
      sendEvent({ status: 'error', message: 'No filename provided' });
      return res.end();
    }

    const mp3Path = path.join(downloadsDir, filename);
    const wavPath = mp3Path.replace('.mp3', '_temp.wav');
    const outputBase = mp3Path.replace('.mp3', '_transcribed');

    if (!fs.existsSync(mp3Path)) {
      sendEvent({ status: 'error', message: 'Audio file not found' });
      return res.end();
    }

    // Manter a conexão viva (Heartbeat) a cada 15 segundos
    heartbeat = setInterval(() => {
      res.write(': heartbeat\n\n');
    }, 15000);

    console.log(`Starting real transcription for: ${filename}`);

    // Passo 1: Converter para WAV 16kHz (necessário para Whisper CLI)
    sendEvent({ status: 'progress', percent: 5, message: 'Convertendo áudio...' });

    const vlcArgs = [
      '-I', 'dummy',
      mp3Path,
      `--sout=#transcode{acodec=s16l,samplerate=16000,channels=1}:standard{access=file,mux=wav,dst='${wavPath}'}`,
      'vlc://quit',
    ];

    execFile(VLC_PATH, vlcArgs, { maxBuffer: 500 * 1024 * 1024 }, (vlcError) => {
      if (vlcError) {
        console.error('VLC Conversion Error:', vlcError);
        sendEvent({ status: 'error', message: 'Falha na conversão para WAV' });
        return res.end();
      }

      // Passo 2: Executar Whisper CLI
      const whisperArgs = [
        '-m', WHISPER_MODEL_PATH,
        '-f', wavPath,
        '-l', 'pt', // Forçar português ou usar 'auto'
        '-pp',      // Print progress
        '-otxt',    // Output text file
        '-of', outputBase
      ];

      console.log(`Running Whisper CLI: ${WHISPER_CLI_PATH} ${whisperArgs.join(' ')}`);

      const whisperProcess = spawn(WHISPER_CLI_PATH, whisperArgs);
      let transcriptionText = '';

      whisperProcess.stderr.on('data', (data) => {
        const output = data.toString();
        // Tentar capturar progresso: "whisper_full: progress =  10%"
        const progressMatch = output.match(/progress\s*=\s*(\d+)%/);
        if (progressMatch) {
          const percent = parseInt(progressMatch[1]);
          // Mapear 0-100 do whisper para 10-95 do total (reservando 5% pro início e 5% pro fim)
          const mappedPercent = 10 + Math.floor(percent * 0.85);
          sendEvent({ status: 'progress', percent: mappedPercent });
        }
        console.log(`Whisper output: ${output.trim()}`);
      });

      whisperProcess.on('close', (code) => {
        // Limpar arquivo temporário WAV
        if (fs.existsSync(wavPath)) fs.unlinkSync(wavPath);

        if (code !== 0) {
          sendEvent({ status: 'error', message: `Whisper exited with code ${code}` });
          return res.end();
        }

        // Ler a transcrição do arquivo .txt gerado
        const txtPath = `${outputBase}.txt`;
        if (fs.existsSync(txtPath)) {
          transcriptionText = fs.readFileSync(txtPath, 'utf8');
          fs.unlinkSync(txtPath); // Limpar txt após ler
        }

        sendEvent({ status: 'completed', transcription: transcriptionText });
        res.end();
      });

      req.on('close', () => {
        clearInterval(heartbeat);
        whisperProcess.kill();
        if (fs.existsSync(wavPath)) fs.unlinkSync(wavPath);
      });
    });

  } catch (error) {
    if (heartbeat) clearInterval(heartbeat);
    console.error('SSE Error:', error);
    sendEvent({ status: 'error', message: 'Erro interno no servidor' });
    res.end();
  }
});

// Rota para gerar Markdown
app.post('/api/generate-markdown', async (req: Request, res: Response) => {
  try {
    const { text, filename } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }

    const mdFilename = `${filename || 'transcricao'}.md`;
    const outputPath = path.join(downloadsDir, mdFilename);

    const markdownContent = `# Transcrição do Áudio\n\nData: ${new Date().toLocaleDateString()}\nArquivo Original: ${filename}\n\n---\n\n${text}`;

    fs.writeFileSync(outputPath, markdownContent);

    res.json({
      success: true,
      filename: mdFilename,
      url: `/download/${mdFilename}`
    });
  } catch (error) {
    console.error('Markdown error:', error);
    res.status(500).json({ error: 'Markdown generation failed' });
  }
});

// Rota para download do arquivo convertido
app.get('/download/:filename', (req: Request, res: Response) => {
  const filepath = path.join(downloadsDir, req.params.filename);

  // Verificar se arquivo existe
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.download(filepath, req.params.filename, (err) => {
    if (err) {
      console.error('Download error:', err);
    }

    // Deletar arquivo após download
    setTimeout(() => {
      fs.unlink(filepath, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting file:', unlinkErr);
      });
    }, 1000);
  });
});

app.listen(PORT, () => {
  console.log(`🎵 MP4 to MP3 Converter running at http://localhost:${PORT}`);
  console.log('Uploads directory:', uploadsDir);
  console.log('Downloads directory:', downloadsDir);

  // Verificar se os binários do Whisper estão presentes
  if (!fs.existsSync(WHISPER_CLI_PATH)) {
    console.error(`❌ Whisper CLI não encontrado em: ${WHISPER_CLI_PATH}`);
  } else {
    console.log(`✅ Whisper CLI detectado.`);
  }

  if (!fs.existsSync(WHISPER_MODEL_PATH)) {
    console.error(`❌ Modelo Whisper não encontrado em: ${WHISPER_MODEL_PATH}`);
  } else {
    console.log(`✅ Modelo Whisper detectado.`);
  }
});
