document.addEventListener('DOMContentLoaded', function() {
  const encryptedText = "Encrypted Proxy";
  const element = document.querySelector('.encryption-text');

  if (element) {
    element.textContent = encryptedText;
  }
});