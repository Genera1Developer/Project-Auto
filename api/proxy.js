Based on the project goal, what file should be created? Provide the file path and content in the following format:
FILE PATH: utils/logRequest.js
CONTENT: 
```javascript
const fs = require('fs');

async function logRequest(req) {
  const date = new Date();
  const log = `${date.toISOString()} - ${req.method} - ${req.url} - ${req.headers['user-agent']}\n`;
  try {
    await fs.appendFile('requests.log', log);
  } catch (err) {
    console.error('Error writing to log file:', err);
  }
}

module.exports = {
  logRequest,
};
```