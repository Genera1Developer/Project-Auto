import React, { useState, useRef, useEffect } from 'react';

function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');
    const searchInputRef = useRef(null);
    const autoCompleteEnabled = localStorage.getItem('autoComplete') === 'true' || true;

    useEffect(() => {
        if (autoCompleteEnabled) {
            const storedQuery = localStorage.getItem('lastQuery');
            if (storedQuery) {
                setQuery(storedQuery);
            }
        }
    }, [autoCompleteEnabled]);

    const handleChange = (event) => {
        const newQuery = event.target.value;
        setQuery(newQuery);
        if (autoCompleteEnabled) {
            localStorage.setItem('lastQuery', newQuery);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(query);
    };

    const handleClear = () => {
        setQuery('');
        localStorage.removeItem('lastQuery');
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
        onSearch('');
    };

    return (
        <form onSubmit={handleSubmit} className="search-bar">
            <input
                type="text"
                placeholder="Enter URL"
                value={query}
                onChange={handleChange}
                ref={searchInputRef}
                className="search-input"
                aria-label="Search the web"
            />
            <div className="search-buttons">
                <button type="submit" className="search-button">Go</button>
                {query && (
                    <button type="button" onClick={handleClear} className="clear-button">
                        Clear
                    </button>
                )}
            </div>
        </form>
    );
}

export default SearchBar;