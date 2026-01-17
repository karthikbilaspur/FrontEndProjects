import React from 'react';

const SearchBar = ({ artist, song, setArtist, setSong, searchLyrics }) => {
  const handleSearch = () => {
    searchLyrics(artist, song);
  };

  return (
    <div>
      <input
        className="inp"
        type="text"
        placeholder='Artist name'
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
      />
      <input
        className="inp"
        type="text"
        placeholder='Song name'
        value={song}
        onChange={(e) => setSong(e.target.value)}
      />
      <button className="btn" onClick={handleSearch}>
        🔍 Search
      </button>
    </div>
  );
};

export default SearchBar;