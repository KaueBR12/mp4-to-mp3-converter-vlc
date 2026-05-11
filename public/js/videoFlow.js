class VideoTranscriber {
  constructor() {
    this.elements = {
      fileInput: document.getElementById('fileInput'),
      btnConvert: document.getElementById('btnConvert'),
      btnTranscribe: document.getElementById('btnTranscribe'),
      btnSaveMd: document.getElementById('btnSaveMd'),
      btnDownloadMp3: document.getElementById('btnDownloadMp3'),
      btnFinish: document.getElementById('btnFinish'),
      transcriptionText: document.getElementById('transcriptionText'),
      mdPreview: document.getElementById('mdPreview'),
      
      cards: {
        step1: document.getElementById('card1'),
        step2: document.getElementById('card2'),
        step3: document.getElementById('card3')
      },
      
      progress: {
        container1: document.getElementById('prog1'),
        fill1: document.getElementById('fill1'),
        container2: document.getElementById('prog2'),
        fill2: document.getElementById('fill2'),
        text2: document.getElementById('progText2')
      },
      
      uploadArea: document.getElementById('uploadArea'),
      fileInfo: document.getElementById('fileSelectedInfo'),
      fileName: document.getElementById('fileName'),
      fileSize: document.getElementById('fileSize')
    };

    this.state = {
      selectedFile: null,
      convertedFilename: null,
      transcription: ""
    };

    this.initEventListeners();
  }

  initEventListeners() {
    this.elements.fileInput.addEventListener('change', this.handleFileSelection.bind(this));
    this.elements.btnConvert.addEventListener('click', this.handleConversion.bind(this));
    this.elements.btnTranscribe.addEventListener('click', this.handleTranscription.bind(this));
    this.elements.btnSaveMd.addEventListener('click', this.handleMarkdownGeneration.bind(this));
  }

  handleFileSelection(event) {
    const file = event.target.files[0];
    if (!file) return;

    this.state.selectedFile = file;
    this.elements.fileName.textContent = file.name;
    this.elements.fileSize.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    
    this.elements.uploadArea.style.display = 'none';
    this.elements.fileInfo.style.display = 'block';
  }

  async handleConversion() {
    if (!this.state.selectedFile) return;

    this.elements.btnConvert.disabled = true;
    this.elements.progress.container1.style.display = 'block';

    const formData = new FormData();
    formData.append('file', this.state.selectedFile);

    let progress = 0;
    const progressInterval = setInterval(() => {
      if (progress < 90) progress += 5;
      this.elements.progress.fill1.style.width = `${progress}%`;
    }, 200);

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      clearInterval(progressInterval);

      if (!response.ok) throw new Error(data.error || 'Erro na conversão do vídeo');

      this.elements.progress.fill1.style.width = '100%';
      this.state.convertedFilename = data.filename;

      this.setupMp3Download(data.url);
      this.advanceToStep(2);

      window.showMsg('msg1', 'Convertido para MP3 com sucesso!', 'success');
    } catch (error) {
      clearInterval(progressInterval);
      window.showMsg('msg1', error.message, 'error');
      this.elements.btnConvert.disabled = false;
    }
  }

  setupMp3Download(url) {
    this.elements.btnDownloadMp3.style.display = 'block';
    this.elements.btnDownloadMp3.onclick = () => {
      window.location.href = url;
    };
  }

  handleTranscription() {
    if (!this.state.convertedFilename) return;

    this.elements.btnTranscribe.disabled = true;
    this.elements.progress.container2.style.display = 'block';

    const eventSource = new EventSource(`/api/transcribe-progress?filename=${this.state.convertedFilename}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.status) {
        case 'progress':
          this.elements.progress.fill2.style.width = `${data.percent}%`;
          this.elements.progress.text2.textContent = data.message || `Transcrevendo: ${data.percent}%`;
          break;
        
        case 'completed':
          eventSource.close();
          this.finalizeTranscription(data.transcription);
          break;
          
        case 'error':
          eventSource.close();
          window.showMsg('msg2', data.message, 'error');
          this.elements.btnTranscribe.disabled = false;
          this.elements.progress.container2.style.display = 'none';
          break;
      }
    };

    eventSource.onerror = () => eventSource.close();
  }

  finalizeTranscription(text) {
    this.state.transcription = text;
    this.elements.transcriptionText.value = text;
    this.elements.progress.container2.style.display = 'none';

    this.advanceToStep(3);
    this.elements.mdPreview.innerHTML = `<pre># Transcrição\n\n${text.substring(0, 100)}...</pre>`;
  }

  async handleMarkdownGeneration() {
    const text = this.elements.transcriptionText.value;
    if (!text) return;

    this.elements.btnSaveMd.disabled = true;

    try {
      const response = await fetch('/api/generate-markdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text, 
          filename: this.state.convertedFilename 
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao gerar o arquivo Markdown');

      this.triggerFileDownload(data.url, data.filename);
      
      window.showMsg('msg3', 'Arquivo Markdown gerado e baixado com sucesso!', 'success');
      this.elements.cards.step3.classList.add('completed');
      
      this.elements.btnFinish.style.display = 'block';
      this.elements.btnSaveMd.style.display = 'none';
    } catch (error) {
      window.showMsg('msg3', error.message, 'error');
      this.elements.btnSaveMd.disabled = false;
    }
  }

  triggerFileDownload(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  advanceToStep(stepNumber) {
    if (stepNumber === 2) {
      this.elements.cards.step1.classList.remove('active');
      this.elements.cards.step1.classList.add('completed');
      this.elements.cards.step2.classList.add('active');
      this.elements.btnTranscribe.disabled = false;
    } else if (stepNumber === 3) {
      this.elements.cards.step2.classList.remove('active');
      this.elements.cards.step2.classList.add('completed');
      this.elements.cards.step3.classList.add('active');
      this.elements.btnSaveMd.disabled = false;
    }
  }
}

// Initialize the flow controller
new VideoTranscriber();
