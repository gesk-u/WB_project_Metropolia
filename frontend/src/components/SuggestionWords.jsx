import React from 'react';
//import './SuggestionWords.css';

function SuggestionWords({ words = [], onWordClick }) {
  
    return (
    <div className="suggestion-words">
      <span className="suggestion-words-start">KOKEILE NÄITÄ:</span>
      <div className="suggestion-words-list">
        {words.map((word) => (
          <button
            key={word}
            className="suggestion-words-item"
            onClick={() => {
                if (onWordClick) {
                    onWordClick(word);
                }   
            }}
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SuggestionWords;