import React, { useState, useRef } from 'react';

function ProxyForm() {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [responseText, setResponseText] = useState('');
    const responseRef = useRef(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        setResponseText('');

        try {
            const response = await fetch('/api/proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (jsonError) {
                    errorData = { message: `Failed to parse error response: ${response.status} ${response.statusText}` };
                }
                throw new Error(errorData.message || `Failed to fetch URL: ${response.status} ${response.statusText}`);

            }

            const responseData = await response.text();
            setResponseText(responseData);


        } catch (error) {
            setErrorMessage(error.message);
            console.error('Error submitting URL:', error);
        } finally {
            setIsLoading(false);
            if (responseRef.current) {
                responseRef.current.focus();
            }
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="url">URL:</label>
                    <input
                        type="url"
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter URL"
                        disabled={isLoading}
                        required
                    />
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Go'}
                </button>
                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            </form>
            {responseText && (
                <div>
                    <h3>Response:</h3>
                    <pre ref={responseRef} tabIndex="0">{responseText}</pre>
                </div>
            )}
        </div>
    );
}

export default ProxyForm;