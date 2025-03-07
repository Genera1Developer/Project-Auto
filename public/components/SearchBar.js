import React, { useState, useRef, useEffect } from 'react';

function SearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');
    const searchInputRef = useRef(null);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        const storedAutoComplete = localStorage.getItem('autoComplete');
        const autoCompleteEnabled = storedAutoComplete === null || storedAutoComplete === 'true';

        if (autoCompleteEnabled && searchTerm.length > 2) {
            // Simulate fetching suggestions (replace with actual API call)
            fetchSuggestions(searchTerm)
                .then(data => setSuggestions(data))
                .catch(error => console.error('Error fetching suggestions:', error));
        } else {
            setSuggestions([]);
        }
    }, [searchTerm]);

    const fetchSuggestions = async (term) => {
        // Placeholder for suggestion fetching logic.  Replace with actual API endpoint.
        const suggestionList = [
            `https://www.${term}.com`,
            `https://${term}.org`,
            `https://search.example.com/?q=${term}`,
            `https://${term}.net`,
        ];
        return suggestionList.filter(s => s.includes(term)).slice(0, 5); // Limit to 5 suggestions
    };

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(searchTerm);
        searchInputRef.current.blur(); // Remove focus after search
        setSuggestions([]); // Clear suggestions after search
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        onSearch(suggestion);
        setSuggestions([]);
    };

    return (
        <form onSubmit={handleSubmit} className="search-bar">
            <input
                type="text"
                ref={searchInputRef}
                placeholder="Enter URL or search term"
                value={searchTerm}
                onChange={handleChange}
                className="search-input"
                autoComplete="off"
            />
            <button type="submit" className="search-button">
                Search
            </button>
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </form>
    );
}

export default SearchBar;