Based on the project goal, the following files should be created:

FILE PATH: script.js
CONTENT: window.onload = () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const url = e.target.querySelector('input[name="url"]');

        fetch(`http://localhost:3000/proxy?url=${url.value}`)
            .then(res => res.text())
            .then(data => {
                document.querySelector('#result').innerHTML = data;
            })
            .catch(err => {
                console.error(err);
            });
    });
};

FILE PATH: server.js
CONTENT: const express = require('express');

const app = express();
const port = 3000;

app.get('/proxy', (req, res) => {
    const url = req.query.url;

    if (!url) {
        res.status(400).send('URL parameter is required');
        return;
    }

    res.header('Access-Control-Allow-Origin', '*');

    req.pipe(request(url)).pipe(res);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});