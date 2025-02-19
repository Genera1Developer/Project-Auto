Based on the project goal, what file should be created? Provide the file path and content in the following format:

FILE PATH: client.js
CONTENT: const form = document.getElementById('form');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const url = document.getElementById('url').value;

    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById('result').innerHTML = data;
    })
    .catch(error => {
        console.error('Error querying API: ', error);
    });
});