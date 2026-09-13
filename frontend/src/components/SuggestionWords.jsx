import React from 'react';
//import './SuggestionWords.css';

function SuggestionWords({ words = [], onWordClick }) {
  
    return (
    <div className="flex flex-col items-start pt-8 w-[672px] h-[95.19px] flex-none order-2 grow-0">

      <span className=" h-[17px] font-['JetBrains_Mono'] font-normal not-italic text-[11px] leading-[16px] tracking-[1.1px] uppercase text-[#8C8680] flex-none order-none grow-0 text-[15px]">
        KOKEILE NÄITÄ:</span>
      
      <div className="flex flex-row items-start gap-2 pt-3 w-[672px] h-[46.19px] flex-none order-1 grow-0">
        {words.map((word) => (
          <button 
            key={word}
            className="box-border flex flex-col text-[#8C8680] justify-center items-center px-[13.6px] py-[5.6px] w-[61.2px] h-[34.19px] border border-[#DDD8D0] rounded-sm flex-none order-none self-stretch grow-0 hover:border-[#C4BFB8] hover:text-[#2E2B27] transition-colors cursor-pointer"
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