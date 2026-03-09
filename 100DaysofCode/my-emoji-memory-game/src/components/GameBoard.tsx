// src/components/GameBoard.tsx
'use client'; // This is a client component

import React, { useState, useEffect, useCallback } from 'react';
import Card from './Card';
import { shuffleArray, gameEmojis } from '../lib/utils'; // Adjust path if needed

interface GameCard {
  id: number; // Unique ID for each card instance
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const GameBoard: React.FC = () => {
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]); // IDs of currently flipped cards
  const [matchesFound, setMatchesFound] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const initializeGame = useCallback(() => {
    const duplicatedEmojis = [...gameEmojis,...gameEmojis]; // Create pairs
    const shuffledEmojis = shuffleArray(duplicatedEmojis);

    const initialCards: GameCard[] = shuffledEmojis.map((emoji, index) => ({
      id: index, // Unique ID for each physical card
      emoji,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(initialCards);
    setFlippedCards([]);
    setMatchesFound(0);
    setMoves(0);
    setGameStarted(false);
    setGameWon(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Handle game win condition
  useEffect(() => {
    if (matchesFound * 2 === cards.length && cards.length > 0) {
      setGameWon(true);
    }
  }, [matchesFound, cards.length]);

  const handleCardClick = (id: number) => {
    if (!gameStarted) {
      setGameStarted(true);
    }

    // If two cards are already flipped, ignore clicks until they resolve
    if (flippedCards.length === 2) {
      return;
    }

    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id? {...card, isFlipped: true } : card
      )
    );
    setFlippedCards((prevFlipped) => [...prevFlipped, id]);
  };

  // Logic to check for matches after two cards are flipped
  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves((prevMoves) => prevMoves + 1); // Increment moves when two cards are flipped
      const [firstCardId, secondCardId] = flippedCards;
      const firstCard = cards.find((card) => card.id === firstCardId);
      const secondCard = cards.find((card) => card.id === secondCardId);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // It's a match!
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === firstCardId || card.id === secondCardId
             ? {...card, isMatched: true, isFlipped: true }
              : card
          )
        );
        setMatchesFound((prevMatches) => prevMatches + 1);
        setFlippedCards([]); // Clear flipped cards immediately for matched ones
      } else {
        // Not a match, flip them back after a delay
        const timeout = setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstCardId || card.id === secondCardId
               ? {...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000); // Keep them open for 1 second

        return () => clearTimeout(timeout); // Cleanup timeout
      }
    }
  }, [flippedCards, cards]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
        Emoji Memory Match!
      </h1>

      <div className="text-xl sm:text-2xl mb-4 font-semibold">
        Moves: {moves}
      </div>

      {gameWon && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-10">
          <h2 className="text-5xl sm:text-6xl font-extrabold text-green-400 mb-6 animate-pulse">
            You Won! 🎉
          </h2>
          <p className="text-2xl sm:text-3xl text-gray-200 mb-8">
            Total Moves: {moves}
          </p>
          <button
            onClick={initializeGame}
            className="px-8 py-4 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-full shadow-lg transition-all duration-300 text-xl"
          >
            Play Again!
          </button>
        </div>
      )}

      <div className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 max-w-4xl">
        {cards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            emoji={card.emoji}
            isFlipped={card.isFlipped}
            isMatched={card.isMatched}
            onClick={handleCardClick}
          />
        ))}
      </div>
      <button
        onClick={initializeGame}
        className="mt-8 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full shadow-md transition-all duration-300"
      >
        Reset Game
      </button>
    </div>
  );
};

export default GameBoard;