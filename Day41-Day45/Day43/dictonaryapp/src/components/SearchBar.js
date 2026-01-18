import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [word, setWord] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(word);
    };

    return (
        <form onSubmit={handleSubmit} className="search-bar">
            <input
                type="text"
                placeholder="Search for a word"
                value={word}
                onChange={(e) => setWord(e.target.value)}
            />
            <button type="submit">Search</button>
        </form>
    );
};

export default SearchBar;