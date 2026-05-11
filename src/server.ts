import fs from 'fs';
import app from './app';
import { uploadsDir, downloadsDir, WHISPER_CLI_PATH, WHISPER_MODEL_PATH } from './config/paths';

const PORT = 3001;

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
