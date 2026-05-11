class PdfConverter {
  constructor() {
    this.elements = {
      fileInput: document.getElementById('fileInputPdf'),
      btnConvert: document.getElementById('btnConvertPdf'),
      btnDownload: document.getElementById('btnDownloadMdPdf'),
      uploadArea: document.getElementById('uploadAreaPdf'),
      fileSelectedInfo: document.getElementById('fileSelectedInfoPdf'),
      progBar: document.getElementById('progPdf'),
      fillBar: document.getElementById('fillPdf'),
      fileNameDisplay: document.getElementById('fileNamePdf'),
      fileSizeDisplay: document.getElementById('fileSizePdf'),
      msgArea: document.getElementById('msgPdf')
    };
    
    this.state = {
      selectedFile: null
    };

    this.msgId = 'msgPdf';
    this.initEventListeners();
  }

  initEventListeners() {
    this.elements.fileInput.addEventListener('change', this.handleFileSelection.bind(this));
    this.elements.btnConvert.addEventListener('click', this.handleConversion.bind(this));
  }

  handleFileSelection(event) {
    const file = event.target.files[0];
    if (!file) return;

    this.state.selectedFile = file;
    this.elements.fileNameDisplay.textContent = file.name;
    this.elements.fileSizeDisplay.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    
    this.elements.uploadArea.style.display = 'none';
    this.elements.fileSelectedInfo.style.display = 'block';
  }

  async handleConversion() {
    if (!this.state.selectedFile) return;

    this.toggleLoadingState(true);
    const formData = new FormData();
    formData.append('file', this.state.selectedFile);

    const progressInterval = this.startFakeProgress();

    try {
      const response = await fetch('/api/pdf-to-md', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao converter o arquivo PDF');
      }

      this.elements.fillBar.style.width = '100%';
      this.showDownloadButton(data);
      window.showMsg(this.msgId, 'PDF convertido para Markdown com sucesso!', 'success');
      
    } catch (error) {
      clearInterval(progressInterval);
      window.showMsg(this.msgId, error.message, 'error');
      this.toggleLoadingState(false);
    }
  }

  startFakeProgress() {
    let progress = 0;
    return setInterval(() => {
      if (progress < 90) progress += 5;
      this.elements.fillBar.style.width = `${progress}%`;
    }, 200);
  }

  toggleLoadingState(isLoading) {
    this.elements.btnConvert.disabled = isLoading;
    this.elements.progBar.style.display = isLoading ? 'block' : 'none';
  }

  showDownloadButton(data) {
    this.elements.btnConvert.style.display = 'none';
    this.elements.btnDownload.style.display = 'block';
    
    this.elements.btnDownload.onclick = () => {
      const link = document.createElement('a');
      link.href = data.url;
      link.download = data.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  }

  reset() {
    this.state.selectedFile = null;
    this.elements.fileInput.value = '';
    this.elements.uploadArea.style.display = 'block';
    this.elements.fileSelectedInfo.style.display = 'none';
    this.elements.msgArea.className = 'message';
    this.elements.progBar.style.display = 'none';
    this.elements.fillBar.style.width = '0%';
    this.elements.btnConvert.disabled = false;
    this.elements.btnConvert.style.display = 'block';
    this.elements.btnDownload.style.display = 'none';
  }
}

// Initialize and expose global reset for inline HTML handler
const pdfConverter = new PdfConverter();
window.resetPdf = () => pdfConverter.reset();
