import React, { useState, useRef } from 'react';

function ProxyForm() {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [responseText, setResponseText] = useState('');
    const responseRef = useRef(null);
    const inputRef = useRef(null);

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

            const contentType = response.headers.get("content-type");
            let responseData;
            if (contentType && contentType.includes("application/json")) {
                responseData = JSON.stringify(await response.json(), null, 2); // Pretty print JSON
            } else {
                responseData = await response.text();
            }
            setResponseText(responseData);


        } catch (error) {
            setErrorMessage(error.message);
            console.error('Error submitting URL:', error);
        } finally {
            setIsLoading(false);
            if (responseRef.current) {
                responseRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const handleClear = () => {
        setUrl('');
        setResponseText('');
        setErrorMessage('');
        if (inputRef.current) {
            inputRef.current.focus();
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
                        style={{ width: '300px' }}
                        ref={inputRef}
                    />
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Go'}
                </button>
                <button type="button" onClick={handleClear} disabled={isLoading}>
                    Clear
                </button>
                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            </form>
            {responseText && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Response:</h3>
                    <pre
                        ref={responseRef}
                        style={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            overflow: 'auto',
                            maxHeight: '300px',
                            border: '1px solid #ccc',
                            padding: '10px',
                        }}
                    >{responseText}</pre>
                </div>
            )}
        </div>
    );
}

export default ProxyForm;