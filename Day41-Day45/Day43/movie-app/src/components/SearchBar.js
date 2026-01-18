import React from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ video, setVideo, handleSearch }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={video}
        onChange={(e) => setVideo(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Search for a movie..."
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;