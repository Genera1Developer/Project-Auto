FILE PATH: src/proxy.js
CONTENT: 
```js
const axios = require('axios');

async function proxyRequest(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    proxyRequest
};
```