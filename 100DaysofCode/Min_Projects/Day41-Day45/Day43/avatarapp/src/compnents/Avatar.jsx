import React, { useState } from 'react';
import '../Styles/Avatar.css';
import Axios from 'axios';

// Constants
const MAX_FAVORITES = 10;
const SEED_MAX = 1000;
const DOWNLOAD_DELAY = 200;

const Avatar = () => {
  const [sprite, setSprite] = useState("bottts");
  const [seed, setSeed] = useState(Math.floor(Math.random() * SEED_MAX));
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to set the current sprite type
  const handleSprite = (spritetype) => {
    setSprite(spritetype);
  };

  // Function to generate random seeds for the API
  const handleGenerate = () => {
    const newSeed = Math.floor(Math.random() * SEED_MAX);
    setSeed(newSeed);
  };

  // Function to download image and save it in our computer
  const downloadImage = async () => {
    setLoading(true);
    try {
      const response = await Axios({
        method: "get",
        url: getImageUrl(sprite, seed),
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "image/svg+xml" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `${seed}.svg`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => window.URL.revokeObjectURL(url), DOWNLOAD_DELAY);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to add avatar to favorites
  const addFavorite = () => {
    if (favorites.length >= MAX_FAVORITES) {
      alert(`You can only have ${MAX_FAVORITES} favorites.`);
      return;
    }
    const favoriteAvatar = {
      sprite,
      seed,
      id: Math.random()
    };
    setFavorites([...favorites, favoriteAvatar]);
  };

  // Function to remove avatar from favorites
  const removeFavorite = (id) => {
    setFavorites(favorites.filter((favorite) => favorite.id !== id));
  };

  // Function to handle search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Get image URL
  const getImageUrl = (sprite, seed) => `https://www.dicebear.com/api/${sprite}/${seed}.svg`;

  // Filter favorites based on search term
  const filteredFavorites = favorites.filter((favorite) =>
    favorite.sprite.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <div className="nav">
        <p>Random Avatar Generator</p>
      </div>
      <div className="home">
        <input
          type="text"
          placeholder="Search for avatars..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="btns">
          <button onClick={() => handleSprite("avataaars")}>Human</button>
          <button onClick={() => handleSprite("human")}>Pixel</button>
          <button onClick={() => handleSprite("bottts")}>Bots</button>
          <button onClick={() => handleSprite("jdenticon")}>Vector</button>
          <button onClick={() => handleSprite("identicon")}>Identi</button>
          <button onClick={() => handleSprite("gridy")}>Alien</button>
          <button onClick={() => handleSprite("micah")}>Avatars</button>
        </div>
        <div className="avatar">
          <img src={getImageUrl(sprite, seed)} alt="Avatar" />
        </div>
        <div className="generate">
          <button id="gen" onClick={handleGenerate}>Next</button>
          <button id="down" onClick={downloadImage} disabled={loading}>
            {loading ? "Downloading..." : "Download"}
          </button>
          <button id="fav" onClick={addFavorite}>Favorite</button>
        </div>
        <div className="favorites">
          <h2>Favorites:</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <ul>
            {filteredFavorites.map((favorite) => (
              <li key={favorite.id}>
                <img src={getImageUrl(favorite.sprite, favorite.seed)} alt="Favorite Avatar" />
                <button onClick={() => removeFavorite(favorite.id)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Avatar;