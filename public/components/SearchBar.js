import React, { useState, useRef, useEffect, useCallback } from 'react';

function SearchBar({ onSearch, autoComplete }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const searchInputRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);

    const updateSearchHistory = useCallback((term) => {
        if (!term.trim()) return;
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        if (!searchHistory.includes(term)) {
            searchHistory = [term, ...searchHistory].slice(0, 10);
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        }
    }, []);

    useEffect(() => {
        if (autoComplete && isFocused) {
            const storedSearches = JSON.parse(localStorage.getItem('searchHistory') || '[]');
            const filteredSuggestions = storedSearches.filter(item =>
                item.toLowerCase().startsWith(searchTerm.toLowerCase()) && item !== searchTerm
            );
            setSuggestions(filteredSuggestions.slice(0, 5));
        } else {
            setSuggestions([]);
        }
    }, [searchTerm, autoComplete, isFocused]);

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
        searchInputRef.current?.blur();
    };

    const handleInputFocus = () => {
        setIsFocused(true);
    };

    const handleInputBlur = () => {
        setTimeout(() => {
            setIsFocused(false);
        }, 100); // Add a small delay to allow click on suggestion to register
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
                    autoComplete="off"
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                />
                <button type="submit">Search</button>
            </form>
            {suggestions.length > 0 && isFocused && (
                <ul className="suggestions">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            tabIndex="0"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleSuggestionClick(suggestion);
                                    e.preventDefault();
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