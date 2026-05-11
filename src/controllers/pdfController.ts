import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
const pdf = require('pdf-parse');
import { sanitizeFilename } from '../utils/fileUtils';
import { downloadsDir } from '../config/paths';

export const pdfToMarkdown = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    const inputPath = req.file.path;
    const originalName = path.parse(req.file.originalname).name;
    const filename = sanitizeFilename(originalName);
    const mdFilename = `${filename}.md`;
    const outputPath = path.join(downloadsDir, mdFilename);

    console.log(`Converting PDF to MD: ${inputPath} -> ${outputPath}`);

    const dataBuffer = fs.readFileSync(inputPath);
    
    // De acordo com o debug, esta versão usa a classe PDFParse
    const { PDFParse } = pdf;
    
    if (!PDFParse) {
      throw new Error('Classe PDFParse não encontrada no módulo. Verifique a versão da biblioteca.');
    }

    const parser = new PDFParse({ data: dataBuffer });
    const data = await parser.getText();
    
    // O conteúdo extraído fica em data.text
    const markdownContent = data.text || '';

    fs.writeFileSync(outputPath, markdownContent);

    // Limpar arquivo temporário de upload
    fs.unlink(inputPath, (err) => {
      if (err) console.error('Error deleting input file:', err);
    });

    res.json({
      success: true,
      message: 'PDF converted successfully',
      filename: mdFilename,
      url: `/download/${mdFilename}`,
    });
  } catch (error) {
    console.error('PDF to MD error:', error);
    res.status(500).json({ error: 'PDF conversion failed', details: String(error) });
  }
};
