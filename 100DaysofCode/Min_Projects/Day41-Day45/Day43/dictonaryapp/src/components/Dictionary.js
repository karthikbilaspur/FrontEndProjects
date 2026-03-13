import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import WordCard from './WordCard';
import ErrorMessage from './ErrorMessage';
import LoadingIndicator from './LoadingIndicator';
import WordOfTheDay from './WordOfTheDay';
import Favorites from './Favorites';
import SearchHistory from './SearchHistory';
import { getWordMeaning, getWordOfTheDay } from '../api/api';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/localStorage';

const Dictionary = () => {
    const [wordData, setWordData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [wordOfTheDay, setWordOfTheDay] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const storedFavorites = getFromLocalStorage('favorites');
        const storedSearchHistory = getFromLocalStorage('searchHistory');
        const storedDarkMode = getFromLocalStorage('darkMode');

        if (storedFavorites) setFavorites(storedFavorites);
        if (storedSearchHistory) setSearchHistory(storedSearchHistory);
        if (storedDarkMode) setDarkMode(storedDarkMode);

        getWordOfTheDay().then((data) => setWordOfTheDay(data));
    }, []);

    const handleSearch = async (word) => {
        setLoading(true);
        const data = await getWordMeaning(word);
        setLoading(false);

        if (data) {
            setWordData(data);
            setError(null);
            setSearchHistory((prevHistory) => [...prevHistory, word]);
            saveToLocalStorage('searchHistory', [...searchHistory, word]);
        } else {
            setWordData(null);
            setError('Word not found');
        }
    };

    const handleFavorite = (word) => {
        setFavorites((prevFavorites) => [...prevFavorites, word]);
        saveToLocalStorage('favorites', [...favorites, word]);
    };

    const handleDarkModeToggle = () => {
        setDarkMode((prevDarkMode) => !prevDarkMode);
        saveToLocalStorage('darkMode', !darkMode);
    };

    return (
        <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
            <h1>Dictionary App</h1>
            <SearchBar onSearch={handleSearch} />
            {loading && <LoadingIndicator />}
            {error && <ErrorMessage message={error} />}
            <WordCard wordData={wordData} onFavorite={handleFavorite} />
            <WordOfTheDay wordData={wordOfTheDay} />
            <Favorites favorites={favorites} />
            <SearchHistory searchHistory={searchHistory} />
            <button onClick={handleDarkModeToggle}>Toggle Dark Mode</button>
        </div>
    );
};

export default Dictionary;