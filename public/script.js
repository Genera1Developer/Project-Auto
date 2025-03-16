const apiKey = "YOUR_API_KEY"; //CHANGE THIS
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

function callAPI(endpoint, method = 'POST', body = null) {
    const url = `/api/${endpoint}`;

    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey
        },
        body: body ? JSON.stringify(body) : null
    };

    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('API call failed:', error);
            throw error;
        });
}
function browseSecurely(url) {
    callAPI('generateKey')
        .then(data => {
            const key = data.key;
            setCookie('encryptionKey', key, 1);

            return callAPI('encrypt', 'POST', { data: url, key: key });
        })
        .then(data => {
            const encryptedURL = data.encryptedData;
            window.location.href = '/uv/#' + encryptedURL;
        })
        .catch(error => {
            console.error('Secure browsing failed:', error);
            alert('Secure browsing failed. Check console for details.');
        });
}
document.addEventListener('DOMContentLoaded', () => {
    const browseButton = document.getElementById('browseButton');
    const urlInput = document.getElementById('urlInput');

    browseButton.addEventListener('click', () => {
        const url = urlInput.value;
        if (url) {
            browseSecurely(url);
        } else {
            alert('Please enter a URL.');
        }
    });
});