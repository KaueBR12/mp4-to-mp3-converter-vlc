import { spawn, execFile } from 'child_process';
import { VLC_PATH } from '../config/paths';
import fs from 'fs';

export class VlcService {
  /**
   * Converts a video file (MP4) to an MP3 audio file using VLC.
   */
  static convertToMp3(inputPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const vlcArgs = [
        '-I', 'dummy',
        '--no-repeat',
        '--no-loop',
        inputPath,
        `--sout=#transcode{acodec=mp3,ab=192}:standard{access=file,mux=raw,dst="${outputPath}"}`,
        '--play-and-exit'
      ];

      const vlcProcess = spawn(VLC_PATH, vlcArgs);

      vlcProcess.on('close', (code) => {
        if (code !== 0 && code !== 1) {
          return reject(new Error(`VLC conversion failed with exit code ${code}`));
        }

        setTimeout(() => {
          if (!fs.existsSync(outputPath)) {
            return reject(new Error('VLC processing finished but MP3 file was not generated.'));
          }
          resolve();
        }, 800);
      });
      
      vlcProcess.on('error', (err) => reject(new Error(`Failed to start VLC: ${err.message}`)));
    });
  }

  /**
   * Converts an MP3 file to a WAV file specifically formatted for Whisper.
   */
  static convertToWav(inputPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const vlcArgs = [
        '-I', 'dummy',
        inputPath,
        `--sout=#transcode{acodec=s16l,samplerate=16000,channels=1}:standard{access=file,mux=wav,dst='${outputPath}'}`,
        'vlc://quit',
      ];

      execFile(VLC_PATH, vlcArgs, { maxBuffer: 500 * 1024 * 1024 }, (error) => {
        if (error) return reject(new Error(`VLC to WAV conversion failed: ${error.message}`));
        resolve();
      });
    });
  }
}
