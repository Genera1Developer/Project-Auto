import React, { useState } from 'react';

function ProxyForm() {
    const [url, setUrl] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission logic here, e.g., sending the URL to the proxy server
        console.log('URL submitted:', url);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL"
            />
            <button type="submit">Go</button>
        </form>
    );
}

export default ProxyForm;