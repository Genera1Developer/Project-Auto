const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { encrypt, decrypt } = require('./encryption'); // Import encryption functions

router.get('/', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.text();

        // Encrypt the data
        const encryptedData = encrypt(data);

        // Send the encrypted data back to the client
        res.send(encryptedData);

    } catch (error) {
        console.error('Error fetching or encrypting data:', error);
        res.status(500).send(`Proxy Error: ${error.message}`);
    }
});

module.exports = router;