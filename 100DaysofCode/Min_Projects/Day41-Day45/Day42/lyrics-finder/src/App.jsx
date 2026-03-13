import './App.css';
import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import LyricsDisplay from './components/LyricsDisplay';

function App() {
  const [artist, setArtist] = useState("");
  const [song, setSong] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchLyrics = async (artist, song) => {
    if (artist === "" || song === "") {
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`);
      const data = await res.json();
      if (data.error) {
        setError("Lyrics not found 😔");
      } else {
        setLyrics(data.lyrics);
      }
    } catch {
      setError("An error occurred 😔");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Lyrics Finder 😊</h1>
      <SearchBar
        artist={artist}
        song={song}
        setArtist={setArtist}
        setSong={setSong}
        searchLyrics={searchLyrics}
      />
      <LyricsDisplay
        isLoading={isLoading}
        error={error}
        lyrics={lyrics}
      />
    </div>
  );
}

export default App;