window.showMsg = function(id, text, type) {
  const element = document.getElementById(id);
  if (!element) return;
  
  element.textContent = text;
  element.className = `message visible ${type}`;
};

window.resetAll = function() {
  location.reload();
};
