import React from 'react';

function SavedPalettes({ savedPalettes }) {
  return (
    <div className="saved-palettes">
      <h2>Saved Palettes:</h2>
      <ul>
        {savedPalettes.map((palette, index) => (
          <li key={index}>{palette.join(', ')}</li>
        ))}
      </ul>
    </div>
  );
}

export default SavedPalettes;