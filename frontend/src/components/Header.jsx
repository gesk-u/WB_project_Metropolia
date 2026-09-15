
import {BrowserRouter as Router, Route, Routes, Link, NavLink} from 'react-router-dom';

function Header() {
  return (
    <header className="box-border flex flex-row justify-between items-center
     py-5 px-8 w-[1325px] h-[73px] bg-[#F4F1EC] border-b border-[#DDD8D0]
      flex-none order-none self-stretch grow-0">
        <nav>
            
         
        <Link to="/">
            <button className="font-['JetBrains_Mono'] font-normal not-italic text-[15px] leading-[16px] 
                text-center tracking-[0.88px] uppercase text-[#8C8680] 
                flex-none order-none grow-0 
                border border-transparent hover:border-[#DDD8D0] hover:text-[#2E2B27] 
                transition-colors rounded-sm px-2 py-1">
                Sanahaku
            </button>
        </Link>

        <div className="flex flex-row items-center p-0 gap-3 w-[297px] h-[17px] flex-none order-none grow-0">
            Finnish pronunciation finder
        </div>

        </nav> 
    </header>
  );
}

export default Header;