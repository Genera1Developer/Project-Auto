FILE PATH: server.js
CONTENT: const http = require('http');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/proxy', (req, res) => {
  const url = req.body.url;

  if (!url) {
    return res.status(400).send('No URL provided');
  }

  const agent = url.startsWith('https') ? https : http;

  agent.get(url, (response) => {
    response.pipe(res);
  });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});