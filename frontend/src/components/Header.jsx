import {BrowserRouter as Router, Route, Routes, Link, NavLink} from 'react-router-dom';

function Header() {
  return (
    <>
      <header className="box-border flex flex-row justify-start items-center
       py-5 px-8 w-full h-[73px] bg-[#F4F1EC] border-b border-[#DDD8D0]
        flex-none">
          <nav className="flex flex-row items-center gap-3">
              <Link to="/WB_project_Metropolia/">
                  <button className="font-['JetBrains_Mono'] font-normal not-italic text-[20px] leading-[16px] 
                      text-center tracking-[0.88px] uppercase text-[#7A9E8E] 
                      flex-none order-none grow-0 
                      border border-transparent hover:border-[#DDD8D0] hover:text-[#2E2B27] 
                      transition-colors rounded-sm px-2 py-1">
                      Sanahaku
                  </button>
              </Link>

              <span className="text-[#DDD8D0] select-none text-xl">|</span>
 
              <div className="flex flex-row items-center p-0 gap-3 h-[17px] flex-none order-none grow-0
                  font-['JetBrains_Mono'] font-normal not-italic text-[20px] text-[#8C8680]">
                Finnish pronunciation finder
              </div>
          </nav> 
      </header>

      <p className="h-[17px] font-['JetBrains_Mono'] font-normal not-italic text-[20px] leading-[16.5px] text-center tracking-[0.66px] text-[#C4BFB8] w-full py-6">
        Uses YouTube subtitles to find real pronunciation in context
      </p>
    </>
  );
}

export default Header;