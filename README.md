# 🎬 MP4 to MP3 & PDF to Markdown Converter

Uma aplicação web modular, completa e de alto desempenho que oferece duas ferramentas essenciais em uma única interface:
1. **Vídeo para Texto**: Converte vídeos MP4 locais em MP3 usando VLC e depois transcreve o áudio para texto (Markdown) localmente utilizando a Inteligência Artificial do Whisper.
2. **PDF para Markdown**: Converte arquivos PDF em texto bruto (formato Markdown) de forma extremamente rápida.

---

## 🚀 Tecnologias Utilizadas
- **Back-end:** Node.js, Express, TypeScript, Multer (para uploads seguros).
- **Front-end:** HTML5, CSS3, JavaScript Vanilla Orientado a Objetos (ES6 Classes).
- **Motores Locais:** VLC Media Player (para decodificação de mídia) e Whisper CLI (IA para transcrição de áudio).
- **Processamento de PDF:** `pdf-parse` e `pdfjs-dist`.

---

## ⚠️ Pré-requisitos (MUITO IMPORTANTE)

Para que o projeto rode perfeitamente no seu computador (ou no de outra pessoa), **você precisa ter as seguintes ferramentas instaladas**:

1. **Node.js (Versão v20.x ou v22.x LTS)**
   - **Crucial:** O projeto utiliza bibliotecas modernas de PDF (`pdfjs-dist` versão 4+) que exigem nativamente funções modernas do Node.js (como o `DOMMatrix` e `getBuiltinModule`).
   - Se você estiver usando o Node v18 ou inferior, o projeto **vai apresentar erros**. Baixe a versão mais nova em [nodejs.org](https://nodejs.org/).

2. **VLC Media Player**
   - O projeto utiliza os motores do VLC de forma oculta para converter vídeos rapidamente.
   - O VLC deve estar instalado no caminho padrão do Windows: `C:\Program Files\VideoLAN\VLC\vlc.exe`.

3. **Arquivos do Whisper (Inteligência Artificial)**
   - Os binários do `whisper-cli.exe` devem estar presentes na pasta base do projeto (`/Release/whisper-cli.exe`).
   - O modelo de linguagem do Whisper (`ggml-small.bin`) também deve estar na pasta raiz apropriada.

---

## 💻 Instalação

Abra o seu terminal na pasta do projeto e execute os comandos abaixo:

```bash
# 1. Instale todas as dependências do projeto
npm install

# 2. Verifique se não há erros na instalação
```

---

## 🏃 Como Rodar o Projeto

Com as dependências instaladas, basta iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

Você verá as seguintes mensagens de sucesso no seu terminal se tudo estiver correto:
```text
🎵 MP4 to MP3 Converter running at http://localhost:3001
✅ Whisper CLI detectado.
✅ Modelo Whisper detectado.
```

Abra seu navegador e acesse: **[http://localhost:3001](http://localhost:3001)**

---

## 📁 Estrutura do Projeto (Clean Code)

O projeto foi refatorado utilizando as melhores práticas de Clean Code, MVC e SOLID:

```text
📂 src/
 ┣ 📂 config/
 ┃ ┗ 📜 paths.ts          # Mapeamento de todos os caminhos do sistema
 ┣ 📂 controllers/
 ┃ ┣ 📜 pdfController.ts  # Gerencia as requisições de PDF
 ┃ ┗ 📜 videoController.ts# Gerencia as requisições de Vídeo e Transcrição
 ┣ 📂 middlewares/
 ┃ ┗ 📜 upload.ts         # Regras de segurança para os arquivos enviados
 ┣ 📂 routes/
 ┃ ┣ 📜 pdf.routes.ts
 ┃ ┗ 📜 video.routes.ts
 ┣ 📂 services/
 ┃ ┣ 📜 vlc.service.ts    # Lógica isolada dos processos do VLC
 ┃ ┗ 📜 whisper.service.ts# Lógica isolada da Inteligência Artificial
 ┣ 📜 app.ts              # Configuração limpa do Express
 ┗ 📜 server.ts           # Ponto de entrada (Entry point)

📂 public/                # Front-end (UI e Estilos)
 ┣ 📂 css/
 ┃ ┗ 📜 style.css
 ┣ 📂 js/
 ┃ ┣ 📜 pdfFlow.js        # Classe responsável pelo conversor de PDF
 ┃ ┣ 📜 videoFlow.js      # Classe responsável pela conversão e eventos SSE (progresso)
 ┃ ┗ 📜 utils.js          # Funções globais utilitárias
 ┗ 📜 index.html          # Estrutura visual modularizada e paginada
```

---

## 💡 Informações Adicionais
- **Privacidade e Segurança:** O projeto processa tudo **localmente**. Seus arquivos e documentos não são enviados para nenhuma nuvem externa.
- **Limpeza Automática:** Todos os arquivos de conversão temporários (MP3s, WAVs e MDs) criados na pasta `/downloads` são **apagados automaticamente do sistema** 1 segundo após o navegador confirmar o término do download, garantindo que o HD não fique cheio de lixo residual.
