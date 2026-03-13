import React from 'react';

const SearchHistory = ({ searchHistory }) => {
    if (!searchHistory.length) return null;

    return (
        <div className="search-history">
            <h2>Search History:</h2>
            <ul>
                {searchHistory.map((history, index) => (
                    <li key={index}>{history}</li>
                ))}
            </ul>
        </div>
    );
};

export default SearchHistory;