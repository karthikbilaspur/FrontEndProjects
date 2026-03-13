import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import movieTrailer from 'movie-trailer';
import SearchBar from './SearchBar';
import MovieDetails from './MovieDetails';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { logout } from '../utils/auth';

const MovieTrailer = () => {
  const [video, setVideo] = useState("inception");
  const [videoURL, setVideoURL] = useState("");
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [poster, setPoster] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [runtime, setRuntime] = useState("");
  const [plot, setPlot] = useState("");
  const [reviews, setReviews] = useState([]);

  const handleSearch = () => {
    movieTrailer(video)
      .then((res) => {
        setVideoURL(res);
        setError(null);
        // Fetch movie details (title, poster, genre, release date, runtime, plot) using OMDB API
        fetch(`http://www.omdbapi.com/?t=${video}&apikey=YOUR_API_KEY`)
          .then((response) => response.json())
          .then((data) => {
            setTitle(data.Title);
            setPoster(data.Poster);
            setGenre(data.Genre);
            setReleaseDate(data.Released);
            setRuntime(data.Runtime);
            setPlot(data.Plot);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => {
        setError("Trailer not found!");
        setVideoURL("");
      });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddReview = (review) => {
    setReviews([...reviews, review]);
  };

  return (
    <div className="movie-trailer">
      <h1>Movie Trailer App</h1>
      <button onClick={handleLogout}>Logout</button>
      <SearchBar video={video} setVideo={setVideo} handleSearch={handleSearch} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {videoURL && (
        <div>
          <MovieDetails title={title} poster={poster} genre={genre} releaseDate={releaseDate} runtime={runtime} plot={plot} />
          <ReactPlayer url={videoURL} controls={true} width="100%" height="500px" />
          <ReviewForm onAddReview={handleAddReview} />
          <ReviewList reviews={reviews} />
        </div>
      )}
    </div>
  );
};

export default MovieTrailer;