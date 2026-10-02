import { Link, NavLink, useMatch, useNavigate } from 'react-router-dom';

const navBase =
  "inline-flex min-h-11 items-center rounded-sm border border-transparent px-2 font-['JetBrains_Mono'] text-[17px] uppercase tracking-[0.88px] transition-colors hover:border-[#DDD8D0] hover:text-[#2E2B27]";
const navItem = `${navBase} text-[#5A5550]`;
const navLinkClass = ({ isActive }) =>
  `${navBase} ${isActive ? 'text-[#2E2B27] underline decoration-[#7A9E8E] decoration-2 underline-offset-8' : 'text-[#5A5550]'}`;

function Header({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();
  const resultsMatch = useMatch('/results/:word'); // null when not on a results page
  const word = resultsMatch?.params.word;

  function handleLogout() {
    // also clear your token / call your logout endpoint here
    setIsAuthenticated(false);
    navigate('/');
  }

  return (
    <header className="flex h-18.25 w-full items-center border-b border-[#DDD8D0] bg-[#F4F1EC] px-8">
      <nav aria-label="Main" className="grid w-full grid-cols-3 items-center">
        <div className="flex items-center gap-3 justify-self-start">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center rounded-sm border border-transparent px-2 font-['JetBrains_Mono'] text-[20px] uppercase tracking-[0.88px] text-[#7A9E8E] transition-colors hover:border-[#DDD8D0] hover:text-[#2E2B27]"
          >
            Sanahaku
          </Link>
          <span aria-hidden="true" className="select-none text-xl text-[#DDD8D0]">|</span>
          {!word && (
            <span className="font-['JetBrains_Mono'] text-[20px] text-[#5A5550]">Finnish pronunciation finder</span>
          )}
        </div>

        <div className="justify-self-center">
          {word && (
            <p className="whitespace-nowrap font-['Fraunces'] text-[24px] italic leading-[31.2px] text-[#5A5550]">
              "{word}"
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 justify-self-end">
          <NavLink to="/saved" className={navLinkClass}>Saved</NavLink>
          {isAuthenticated ? (
            <>
              <span className="font-['JetBrains_Mono'] text-[17px] text-[#5A5550]">Welcome</span>
              <button type="button" onClick={handleLogout} className={navItem}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/signup" className={navItem}>Sign up</Link>
              <Link to="/login" className={navItem}>Login</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;