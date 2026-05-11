window.showMsg = function(id, text, type) {
  const element = document.getElementById(id);
  if (!element) return;
  
  element.textContent = text;
  element.className = `message visible ${type}`;
};

window.resetAll = function() {
  location.reload();
};

window.switchTab = function(tabName) {
  // Update buttons
  document.getElementById('tabVideo').classList.remove('active');
  document.getElementById('tabPdf').classList.remove('active');
  
  if (tabName === 'video') {
    document.getElementById('tabVideo').classList.add('active');
  } else {
    document.getElementById('tabPdf').classList.add('active');
  }

  // Update views
  document.getElementById('videoView').classList.remove('active');
  document.getElementById('pdfView').classList.remove('active');

  if (tabName === 'video') {
    document.getElementById('videoView').classList.add('active');
  } else {
    document.getElementById('pdfView').classList.add('active');
  }
};

