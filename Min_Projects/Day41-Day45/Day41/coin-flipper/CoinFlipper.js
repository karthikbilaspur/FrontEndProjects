import React, { useState, useEffect } from 'react';
import './CoinFlipper.css';

function CoinFlipper() {
    const [flipResult, setFlipResult] = useState('');
    const [isHeads, setIsHeads] = useState(true);
    const [flipCount, setFlipCount] = useState(0);
    const [headsCount, setHeadsCount] = useState(0);
    const [tailsCount, setTailsCount] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);

    const updateCounts = (result) => {
        if (result === 'heads') {
            setHeadsCount((prev) => prev + 1);
        } else {
            setTailsCount((prev) => prev + 1);
        }
    };

    const handleFlip = () => {
        setIsFlipping(true);
        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        setFlipResult(result);
        setIsHeads(result === 'heads');
        updateCounts(result);
        setTimeout(() => {
            setFlipCount((prev) => prev + 1);
            setIsFlipping(false);
        }, 500);
    };

    const resetGame = () => {
        setFlipResult('');
        setIsHeads(true);
        setFlipCount(0);
        setHeadsCount(0);
        setTailsCount(0);
    };

    return (
        <div className="container">
            <h1>Coin Flipper</h1>
            <div className={`coin ${isHeads ? '' : 'tails'} ${isFlipping ? 'flipping' : ''}`}>
                <div className="heads">
                    <img src="heads.png" alt="Heads" />
                </div>
                <div className="tails">
                    <img src="tails.png" alt="Tails" />
                </div>
            </div>
            <button onClick={handleFlip} disabled={isFlipping} aria-label="Flip Coin">
                {isFlipping ? 'Flipping...' : 'Flip Coin'}
            </button>
            <p>You got: {flipResult.toUpperCase()}</p>
            <p>Flip Count: {flipCount}</p>
            <p>Heads: {headsCount} | Tails: {tailsCount}</p>
            <button onClick={resetGame} className="reset-button">Reset Game</button>
        </div>
    );
}

export default CoinFlipper;