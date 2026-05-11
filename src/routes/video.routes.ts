import { Router } from 'express';
import { upload } from '../middlewares/upload';
import { convertVideo, transcribeVideo, transcribeProgress, generateMarkdown, downloadFile } from '../controllers/videoController';

const router = Router();

router.post('/api/convert', upload.single('file'), convertVideo);
router.post('/api/transcribe', transcribeVideo);
router.get('/api/transcribe-progress', transcribeProgress);
router.post('/api/generate-markdown', generateMarkdown);
router.get('/download/:filename', downloadFile);

export default router;
