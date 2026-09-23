//uncomment when needed
import SearchBox from './components/SearchBox';
import Header from './components/Header';
import SuggestionWords from './components/SuggestionWords';
import {BrowserRouter as Router, Route, Routes, Link, NavLink} from 'react-router-dom';
import Results from './components/Results';
import AiPage from './pages/AiPage';

function App() {
  // API called when the user submits a search query
  const handleSearch = (query) => {
    console.log('Searching for:', query);
  }; 

  return (
    <div>
    <Router> 
    
    <main className="flex flex-col items-center p-0 w-full min-h-screen bg-[#F4F1EC] flex-none order-none self-center grow-0">
      <Header />
        <Routes>
            <Route path="/WB_project_Metropolia/" element={
              <>

              <SearchBox onSearch={handleSearch} /> 
              <SuggestionWords
                onWordClick={handleSearch}/>
              </>
              }
            />
            <Route path="/WB_project_Metropolia/results/:word" element={<Results />} /> 
        </Routes>    
      </main>
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