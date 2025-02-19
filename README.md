FILE PATH: client.js
CONTENT: const socket = io();

socket.on('connect', () => {
  console.log('Connected to the proxy server.');
});

socket.on('data', (data) => {
  console.log(data);
});

document.getElementById('form').addEventListener('submit', (e) => {
  e.preventDefault();

  const url = document.getElementById('url').value;
  socket.emit('url', url);
});