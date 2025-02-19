FILE PATH: src/proxy.js
CONTENT: 
```
const axios = require('axios');

async function proxyRequest(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        return `Error: ${error.message}`;
    }
}

module.exports = { proxyRequest };
```