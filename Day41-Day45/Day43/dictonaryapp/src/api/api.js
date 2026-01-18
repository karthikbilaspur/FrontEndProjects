import axios from 'axios';

const API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
const WORD_OF_THE_DAY_API = 'https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key=YOUR_API_KEY';

export const getWordMeaning = async (word) => {
    try {
        const response = await axios.get(`${API_URL}${word}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getWordOfTheDay = async () => {
    try {
        const response = await axios.get(WORD_OF_THE_DAY_API);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};