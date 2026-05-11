import { spawn, execFile } from 'child_process';
import { WHISPER_CLI_PATH, WHISPER_MODEL_PATH } from '../config/paths';
import fs from 'fs';

export class WhisperService {
  /**
   * Transcribes an audio file synchronously and returns the transcribed text.
   */
  static transcribeSync(audioPath: string, outputBase: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const whisperArgs = ['-m', WHISPER_MODEL_PATH, '-f', audioPath, '-l', 'pt', '-otxt', '-of', outputBase];

      execFile(WHISPER_CLI_PATH, whisperArgs, (error) => {
        if (error) return reject(new Error(`Whisper transcription failed: ${error.message}`));

        const txtPath = `${outputBase}.txt`;
        let transcriptionText = '';
        if (fs.existsSync(txtPath)) {
          transcriptionText = fs.readFileSync(txtPath, 'utf8');
          fs.unlinkSync(txtPath);
        }
        resolve(transcriptionText);
      });
    });
  }

  /**
   * Transcribes an audio file using spawn to capture real-time progress.
   * Returns an object containing a kill function for the child process.
   */
  static startTranscriptionStream(
    audioPath: string, 
    outputBase: string, 
    onProgress: (percent: number) => void,
    onComplete: (transcription: string) => void,
    onError: (error: Error) => void
  ): { kill: () => void } {
    const whisperArgs = ['-m', WHISPER_MODEL_PATH, '-f', audioPath, '-l', 'pt', '-pp', '-otxt', '-of', outputBase];
    
    const whisperProcess = spawn(WHISPER_CLI_PATH, whisperArgs);

    whisperProcess.stderr.on('data', (data) => {
      const output = data.toString();
      const progressMatch = output.match(/progress\s*=\s*(\d+)%/);
      if (progressMatch) {
        const percent = parseInt(progressMatch[1], 10);
        // Map 0-100 to 10-95 for better UX feedback during extraction
        const mappedPercent = 10 + Math.floor(percent * 0.85);
        onProgress(mappedPercent);
      }
    });

    whisperProcess.on('close', (code) => {
      if (code !== 0) {
        return onError(new Error(`Whisper process exited with code ${code}`));
      }

      const txtPath = `${outputBase}.txt`;
      let transcriptionText = '';
      if (fs.existsSync(txtPath)) {
        transcriptionText = fs.readFileSync(txtPath, 'utf8');
        fs.unlinkSync(txtPath);
      }

      onComplete(transcriptionText);
    });

    whisperProcess.on('error', (err) => {
      onError(new Error(`Failed to start Whisper process: ${err.message}`));
    });

    return {
      kill: () => whisperProcess.kill()
    };
  }
}
