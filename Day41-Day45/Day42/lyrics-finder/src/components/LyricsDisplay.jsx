import React from 'react';

const LyricsDisplay = ({ isLoading, error, lyrics }) => {
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return <pre>{lyrics}</pre>;
};

export default LyricsDisplay;