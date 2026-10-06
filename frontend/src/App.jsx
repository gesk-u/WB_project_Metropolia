//uncomment when needed
import SearchBox from './components/SearchBox';
import Header from './components/Header';
import SuggestionWords from './components/SuggestionWords';
import {BrowserRouter as Router, Route, Routes, Link, NavLink} from 'react-router-dom';
import Results from './components/Results';
import TextPage1 from './components/TextPage1';
import { SavedWordsPage } from './pages/SavedWordsPage';
import { useState } from 'react';
import HomeHero from './components/HomeHero';
import TopFooter from './components/TopFooter';

import Signup from "./components/Signup"
import Login from "./components/Login"

function App() {
  // API called when the user submits a search query
  const handleSearch = (query) => {
    console.log('Searching for:', query);
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F1EC]">
    <Router>
    
    <main className="flex w-full flex-grow flex-col items-center">
      <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>
        <Routes>
            <Route path="/" element={
              <div className="flex w-full flex-grow flex-col items-center justify-center px-4 pb-14">  
              <HomeHero />
              <div className="mt-11 w-full max-w-[640px]">
                <SearchBox onSearch={handleSearch} /> 
              </div>
              <SuggestionWords onWordClick={handleSearch}/>
              </div>
              }
            />
            <Route path="/results/:word" element={
              <>
              
              <Results onSearch={handleSearch} />
              </>
              }
            />

            <Route path="/saved" element={<SavedWordsPage />} />

            <Route path="/login" element={
              <Login setIsAuthenticated={setIsAuthenticated}/>
              }
            />
            <Route path="/signup" element={
              <Signup/>
              }
            />
        </Routes>
      </main>
      <TopFooter />
    </Router>
    </div>
  )
}

export default App


  {/* // return (
  //   <div className="flex flex-col items-center p-0 w-full min-h-screen bg-[#F4F1EC] flex-none order-none self-stretch grow-0">
  //     <Header/>
  //     <main>
  //       <SearchBox onSearch={handleSearch} />
        <SuggestionWords
          words={['kiitos', 'talvi', 'koira']}
          onWordClick={handleSearch}
  //       />
  //     </main> 
    
  //   </div>
  // ); */}