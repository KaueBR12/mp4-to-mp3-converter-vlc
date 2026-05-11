import path from 'path';
import fs from 'fs';

export const VLC_PATH = process.env.VLC_PATH || 'C:\\Program Files\\VideoLAN\\VLC\\vlc.exe';

export const WHISPER_CLI_PATH = path.join(__dirname, '../../Release/whisper-cli.exe');
export const WHISPER_MODEL_PATH = path.join(__dirname, '../../ggml-small.bin');

export const uploadsDir = path.join(__dirname, '../../uploads');
export const downloadsDir = path.join(__dirname, '../../downloads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}
