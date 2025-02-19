FILE PATH: server.js
CONTENT: const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/', async (req, res) => {
    const url = req.body.url;

    try {
        const response = await axios.get(url);
        res.send(response.data);
    } catch (error) {
        res.status(500).send('Error fetching URL');
    }
});

app.listen(3000);