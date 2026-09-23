import {BrowserRouter as Router, Route, Routes, Link, useLocation} from 'react-router-dom';



function Header({isAuthenticated, setIsAuthenticated}) {
    const location = useLocation();
    const word = decodeURIComponent(location.pathname.split('/').pop());
    const isResultsPage = location.pathname.includes('/results/');
    console.log('Current word:', word);

    return (
    <>
      <header className="box-border flex flex-row justify-start items-center py-5 px-8 w-full h-[73px] bg-[#F4F1EC] border-b border-[#DDD8D0] flex-none">
          <nav className="grid grid-cols-4 items-center w-full">

              <div className="flex flex-row items-center gap-3 justify-self-start">
                  <Link to="/WB_project_Metropolia/">
                      <button className="font-['JetBrains_Mono'] font-normal not-italic text-[20px] leading-[16px] text-center tracking-[0.88px] uppercase text-[#7A9E8E] flex-none order-none grow-0 border border-transparent hover:border-[#DDD8D0] hover:text-[#2E2B27] transition-colors rounded-sm px-2 py-1">
                          Sanahaku
                      </button>
                  </Link>
                <span className="text-[#DDD8D0] select-none text-xl">|</span>
                {!isResultsPage && (
                    
                    <div className="flex flex-row items-center p-0 gap-3 h-[17px] flex-none order-none grow-0 font-['JetBrains_Mono'] font-normal not-italic text-[20px] text-[#5A5550]">
                        Finnish pronunciation finder
                    </div>
                )}
              </div>

            {isResultsPage && (
                <div className="flex flex-col items-start p-0 h-[32px] flex-none order-0 grow-0 justify-self-center">
                    <p className="font-['Fraunces'] italic font-normal text-[24px] leading-[31.2px] tracking-[0px] text-[#5A5550] whitespace-nowrap">
                        "{word}"</p>
                </div>
            )}


            {!isResultsPage && <div />}

            <div className="flex flex-row items-center gap-2 justify-self-end">
              {!isAuthenticated && (
                <>
                  <Link to="/WB_project_Metropolia/signup">
                      <button className="font-['JetBrains_Mono'] font-normal not-italic text-[17px] leading-[16px] text-center tracking-[0.88px] uppercase text-[#5A5550] flex-none order-none grow-0 border border-transparent hover:border-[#DDD8D0] hover:text-[#2E2B27] transition-colors rounded-sm px-2 py-1">
                          Sign Up
                      </button>
                  </Link>
                  <Link to="/WB_project_Metropolia/login">
                      <button className="font-['JetBrains_Mono'] font-normal not-italic text-[17px] leading-[16px] text-center tracking-[0.88px] uppercase text-[#5A5550] flex-none order-none grow-0 border border-transparent hover:border-[#DDD8D0] hover:text-[#2E2B27] transition-colors rounded-sm px-1 py-1">
                          Login
                      </button>
                  </Link>
                </>
              )}

              {isAuthenticated && (
                  <>
                  <span>Welcome</span>
                  <button onClick={handleClick} className="font-['JetBrains_Mono'] font-normal not-italic text-[17px] leading-[16px] text-center tracking-[0.88px] uppercase text-[#5A5550] flex-none order-none grow-0 border border-transparent hover:border-[#DDD8D0] hover:text-[#2E2B27] transition-colors rounded-sm px-3 py-1">
                      Log out</button>
                  </>
              )}
            </div>

            <div className="justify-self-end">
                {isResultsPage && (
                    <Link to="/WB_project_Metropolia/ai">
                    <button className="font-['JetBrains_Mono'] font-normal not-italic text-[20px] leading-[16px] text-center tracking-[0.88px] uppercase text-[#5A5550] bg-[#EDE9E3] border border-[#DDD8D0] hover:bg-[#DDD8D0] hover:text-[#2E2B27] transition-colors rounded-sm px-8 py-2 ">
                        <p>AI practice</p>
                    </button>
                    </Link>
                )}
            </div>

          </nav> 
      </header>

    </>
  );
}

export default Header;