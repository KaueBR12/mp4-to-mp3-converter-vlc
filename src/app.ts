import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';

import videoRoutes from './routes/video.routes';
import pdfRoutes from './routes/pdf.routes';

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

app.use(videoRoutes);
app.use(pdfRoutes);

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

export default app;
