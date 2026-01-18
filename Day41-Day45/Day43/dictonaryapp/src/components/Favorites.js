import React from 'react';

const Favorites = ({ favorites }) => {
    if (!favorites.length) return null;

    return (
        <div className="favorites">
            <h2>Favorites:</h2>
            <ul>
                {favorites.map((favorite, index) => (
                    <li key={index}>{favorite}</li>
                ))}
            </ul>
        </div>
    );
};

export default Favorites;