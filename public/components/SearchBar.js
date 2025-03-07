import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

function SearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');
    const searchInputRef = useRef(null);
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const storedAutoComplete = localStorage.getItem('autoComplete');
        const autoCompleteEnabled = storedAutoComplete === null || storedAutoComplete === 'true';

        if (autoCompleteEnabled && searchTerm.length > 2) {
            setIsLoading(true);
            fetchSuggestions(searchTerm)
                .then(data => {
                    setSuggestions(data);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching suggestions:', error);
                    setIsLoading(false);
                });
        } else {
            setSuggestions([]);
            setIsLoading(false);
        }
    }, [searchTerm]);

    const fetchSuggestions = async (term) => {
        // Placeholder for suggestion fetching logic.  Replace with actual API endpoint.
        // Simulate network latency
        await new Promise(resolve => setTimeout(resolve, 250));
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
        if (searchTerm.trim() !== "") {
            onSearch(searchTerm);
            searchInputRef.current.blur(); // Remove focus after search
            setSuggestions([]); // Clear suggestions after search
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        onSearch(suggestion);
        setSuggestions([]);
    };

    return (
        <form onSubmit={handleSubmit} className="search-bar">
            <div className="search-input-container">
                <input
                    type="text"
                    ref={searchInputRef}
                    placeholder="Enter URL or search term"
                    value={searchTerm}
                    onChange={handleChange}
                    className="search-input"
                    autoComplete="off"
                />
                {isLoading && <div className="spinner">Loading...</div>}
            </div>
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

SearchBar.propTypes = {
    onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
content: