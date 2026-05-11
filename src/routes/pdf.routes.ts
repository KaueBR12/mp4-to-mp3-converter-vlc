import { Router } from 'express';
import { upload } from '../middlewares/upload';
import { pdfToMarkdown } from '../controllers/pdfController';

const router = Router();

router.post('/api/pdf-to-md', upload.single('file'), pdfToMarkdown);

export default router;
