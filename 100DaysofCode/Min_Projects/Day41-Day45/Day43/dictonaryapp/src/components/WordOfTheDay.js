import React from 'react';

const WordOfTheDay = ({ wordData }) => {
    if (!wordData) return null;

    const { word, meanings } = wordData[0];

    return (
        <div className="word-of-the-day">
            <h2>Word of the Day: {word}</h2>
            {meanings.map((meaning, index) => (
                <div key={index}>
                    <h3>{meaning.partOfSpeech}</h3>
                    <ul>
                        {meaning.definitions.map((definition, idx) => (
                            <li key={idx}>{definition.definition}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default WordOfTheDay;