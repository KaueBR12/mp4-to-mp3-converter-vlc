import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { sanitizeFilename } from '../utils/fileUtils';
import { downloadsDir } from '../config/paths';
import { VlcService } from '../services/vlc.service';
import { WhisperService } from '../services/whisper.service';

export const convertVideo = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    const inputPath = req.file.path;
    const originalName = path.parse(req.file.originalname).name;
    const filename = sanitizeFilename(originalName);
    const outputPath = path.join(downloadsDir, `${filename}.mp3`);

    console.log(`Converting with VLC: ${inputPath} -> ${outputPath}`);

    await VlcService.convertToMp3(inputPath, outputPath);

    // Clean up original file
    fs.unlink(inputPath, (err) => {
      if (err) console.error('Error deleting input file:', err);
    });

    const stats = fs.statSync(outputPath);
    console.log(`MP3 gerado com sucesso: ${stats.size} bytes`);

    res.json({
      success: true,
      message: 'File converted successfully',
      filename: `${filename}.mp3`,
      url: `/download/${filename}.mp3`,
    });
  } catch (error: unknown) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Server error', details: error instanceof Error ? error.message : String(error) });
  }
};

export const transcribeVideo = async (req: Request, res: Response) => {
  try {
    const { filename } = req.body;
    if (!filename) return res.status(400).json({ error: 'No filename provided' });

    const mp3Path = path.join(downloadsDir, filename);
    const wavPath = mp3Path.replace('.mp3', '_temp_sync.wav');
    const outputBase = mp3Path.replace('.mp3', '_transcribed_sync');

    if (!fs.existsSync(mp3Path)) return res.status(404).json({ error: 'Audio file not found' });

    console.log(`Transcribing Audio: ${mp3Path}`);

    // Step 1: Convert MP3 to 16kHz WAV format for Whisper
    await VlcService.convertToWav(mp3Path, wavPath);

    // Step 2: Transcribe via Whisper
    const transcriptionText = await WhisperService.transcribeSync(wavPath, outputBase);

    // Clean up temporary WAV file
    if (fs.existsSync(wavPath)) fs.unlinkSync(wavPath);

    res.json({ success: true, transcription: transcriptionText });
  } catch (error: unknown) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: 'Transcription failed', details: error instanceof Error ? error.message : String(error) });
  }
};

export const transcribeProgress = async (req: Request, res: Response) => {
  const { filename } = req.query;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  let heartbeat: NodeJS.Timeout | undefined;

  const sendEvent = (data: Record<string, unknown>) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
    // @ts-ignore
    if (res.flush) res.flush();
  };

  try {
    if (!filename || typeof filename !== 'string') {
      sendEvent({ status: 'error', message: 'No filename provided' });
      return res.end();
    }

    const mp3Path = path.join(downloadsDir, filename);
    if (!fs.existsSync(mp3Path)) {
      sendEvent({ status: 'error', message: 'Audio file not found' });
      return res.end();
    }

    heartbeat = setInterval(() => {
      res.write(': heartbeat\n\n');
      // @ts-ignore
      if (res.flush) res.flush();
    }, 5000);

    const outputBase = path.join(downloadsDir, `${path.parse(filename).name}_transcribed`);
    sendEvent({ status: 'progress', percent: 10, message: 'Iniciando IA (Lendo MP3 diretamente)...' });

    const processRef = WhisperService.startTranscriptionStream(
      mp3Path,
      outputBase,
      (percent) => {
        sendEvent({ status: 'progress', percent, message: `Processando IA: ${percent}%` });
      },
      (transcription) => {
        console.log('Transcrição finalizada com sucesso.');
        sendEvent({ status: 'completed', transcription });
        setTimeout(() => res.end(), 100);
      },
      (error) => {
        console.error('Whisper Stream Error:', error);
        sendEvent({ status: 'error', message: 'Erro na execução da Inteligência Artificial.' });
        res.end();
      }
    );

    req.on('close', () => {
      if (heartbeat) clearInterval(heartbeat);
      processRef.kill();
    });

  } catch (error) {
    if (heartbeat) clearInterval(heartbeat);
    console.error('SSE Error:', error);
    sendEvent({ status: 'error', message: 'Erro interno no servidor' });
    res.end();
  }
};

export const generateMarkdown = async (req: Request, res: Response) => {
  try {
    const { text, filename } = req.body;
    if (!text) return res.status(400).json({ error: 'No text provided' });

    const mdFilename = `${filename || 'transcricao'}.md`;
    const outputPath = path.join(downloadsDir, mdFilename);

    const markdownContent = `# Transcrição do Áudio\n\nData: ${new Date().toLocaleDateString()}\nArquivo Original: ${filename}\n\n---\n\n${text}`;

    fs.writeFileSync(outputPath, markdownContent);

    res.json({ success: true, filename: mdFilename, url: `/download/${mdFilename}` });
  } catch (error) {
    console.error('Markdown generation error:', error);
    res.status(500).json({ error: 'Markdown generation failed' });
  }
};

export const downloadFile = (req: Request, res: Response) => {
  const filepath = path.join(downloadsDir, req.params.filename);

  if (!fs.existsSync(filepath)) return res.status(404).json({ error: 'File not found' });

  res.download(filepath, req.params.filename, (err) => {
    if (err) console.error('Download delivery error:', err);

    setTimeout(() => {
      if (fs.existsSync(filepath)) {
        fs.unlink(filepath, (unlinkErr) => {
          if (unlinkErr) console.error('Error deleting file after download:', unlinkErr);
        });
      }
    }, 1000);
  });
};
