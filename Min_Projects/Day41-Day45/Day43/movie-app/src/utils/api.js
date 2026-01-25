import axios from 'axios';

const API_KEY = process.env.REACT_APP_OMDB_API_KEY;
const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';
const TMDB_BASE_URL = 'https://api.tmvdb.org/3/';

const omdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    apikey: API_KEY,
  },
});

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const fetchMovieDetails = async (title) => {
  const response = await omdbApi.get('', {
    params: {
      t: title,
    },
  });
  return response.data;
};

export const fetchMovieTrailer = async (title) => {
  const response = await tmdbApi.get('search/movie', {
    params: {
      query: title,
    },
  });
  const movieId = response.data.results[0].id;
  const trailerResponse = await tmdbApi.get(`movie/${movieId}/videos`);
  const trailerUrl = `https://www.youtube.com/watch?v=${trailerResponse.data.results[0].key}`;
  return trailerUrl;
};