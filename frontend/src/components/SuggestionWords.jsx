import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SuggestionWords() {

  const SuggestionList = [
  'päivä', 'koira', 'kissa', 'kiitos', 'kirja',
  'talo', 'auto', 'vesi', 'ystävä', 'ruoka',
  'aurinko', 'sade', 'kello', 'ikkuna', 'metsä',
  'järvi', 'kesä', 'talvi', 'lapsi', 'opettaja'
]; // to suggest words to the user on the first page. 

  const navigate = useNavigate();
  const [randomWords, setRandomWords] = useState([]);

  useEffect(() => {
        const shuffled = [...SuggestionList].sort(() => 0.5 - Math.random());
        setRandomWords(shuffled.slice(0, 7));
    }, []); //shiffling the words to show rundom from the list. 
  
  const handleWordClick = (word) => {
        navigate(`/WB_project_Metropolia/results/${word}`);
    };
    return (
    <div className="flex flex-col items-center pt-8 w-[672px] h-[95.19px] flex-none order-2 grow-0">

      <span className=" h-[17px] font-['JetBrains_Mono'] font-normal not-italic text-[11px] leading-[16px] tracking-[1.1px] uppercase text-[#5A5550] flex-none order-none grow-0 text-[15px]">
        KOKEILE NÄITÄ:</span>
      
      <div className="flex flex-row items-center gap-2 pt-3 w-[672px] h-[46.19px] flex-none order-1 grow-0">
        {randomWords.map((word) => (
          <button 
            key={word}
            className="box-border text-[20px] flex flex-col text-[#5A5550] justify-center items-center px-[13.6px] py-[5.6px] h-[40.19px] border border-[#DDD8D0] rounded-sm flex-none order-none self-stretch grow-0 hover:border-[#C4BFB8] hover:text-[#2E2B27] transition-colors cursor-pointer"
            onClick={() => handleWordClick(word)}
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SuggestionWords;