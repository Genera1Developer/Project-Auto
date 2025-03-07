import React, { useState, useRef, useEffect, useCallback } from 'react';

function SearchBar({ onSearch, autoComplete }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const searchInputRef = useRef(null);

    const updateSearchHistory = useCallback((term) => {
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        if (!searchHistory.includes(term)) {
            searchHistory = [term, ...searchHistory].slice(0, 10); // Limit to 10 items
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        }
    }, []);

    useEffect(() => {
        if (autoComplete) {
            const storedSearches = JSON.parse(localStorage.getItem('searchHistory') || '[]');
            const filteredSuggestions = storedSearches.filter(item =>
                item.toLowerCase().startsWith(searchTerm.toLowerCase()) && item !== searchTerm
            );
            setSuggestions(filteredSuggestions.slice(0, 5)); // Limit to 5 suggestions
        } else {
            setSuggestions([]);
        }
    }, [searchTerm, autoComplete]);

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const trimmedSearchTerm = searchTerm.trim();
        if (trimmedSearchTerm) {
            onSearch(trimmedSearchTerm);
            updateSearchHistory(trimmedSearchTerm);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        onSearch(suggestion);
        setSuggestions([]);
        searchInputRef.current.blur();
    };

    return (
        <div className="search-bar">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter URL or search term"
                    value={searchTerm}
                    onChange={handleChange}
                    ref={searchInputRef}
                    autoComplete="off" // Disable browser autocomplete
                />
                <button type="submit">Search</button>
            </form>
            {suggestions.length > 0 && (
                <ul className="suggestions">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            tabIndex="0" // Make the li focusable
                            onKeyDown={(e) => { // Handle keyboard navigation
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleSuggestionClick(suggestion);
                                }
                            }}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchBar;