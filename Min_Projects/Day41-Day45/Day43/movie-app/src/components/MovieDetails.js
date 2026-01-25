import React from 'react';

const MovieDetails = ({ title, poster, genre, releaseDate, runtime, plot }) => {
  return (
    <div className="movie-details">
      <h2>{title}</h2>
      <img src={poster} alt={title} />
      <p>
        <strong>Genre:</strong> {genre}
      </p>
      <p>
        <strong>Release Date:</strong> {releaseDate}
      </p>
      <p>
        <strong>Runtime:</strong> {runtime}
      </p>
      <p>{plot}</p>
    </div>
  );
};

export default MovieDetails;