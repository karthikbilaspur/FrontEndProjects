import React, { useState } from 'react';
import './CoinFlipper.css';

function CoinFlipper() {
    const [flipResult, setFlipResult] = useState('');
    const [isHeads, setIsHeads] = useState(true);
    const [flipCount, setFlipCount] = useState(0);
    const [headsCount, setHeadsCount] = useState(0);
    const [tailsCount, setTailsCount] = useState(0);

    const handleFlip = () => {
        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        setFlipResult(result);
        setIsHeads(result === 'heads');
        setFlipCount(flipCount + 1);
        if (result === 'heads') {
            setHeadsCount(headsCount + 1);
        } else {
            setTailsCount(tailsCount + 1);
        }
    };

    return (
        <div className="container">
            <h1>Coin Flipper</h1>
            <div className={`coin ${isHeads ? '' : 'tails'}`}>
                <div className="heads">
                    <img src="heads.png" alt="Heads" />
                </div>
                <div className="tails">
                    <img src="tails.png" alt="Tails" />
                </div>
            </div>
            <button onClick={handleFlip}>Flip Coin</button>
            <p>You got: {flipResult.toUpperCase()}</p>
            <p>Flip Count: {flipCount}</p>
            <p>Heads: {headsCount} | Tails: {tailsCount}</p>
        </div>
    );
}

export default CoinFlipper;