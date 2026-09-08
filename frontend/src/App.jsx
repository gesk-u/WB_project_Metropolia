import SearchBox from './components/SearchBox';

function App() {
  // API called when the user submits a search query

  const handleSearch = (query) => {
    console.log('Searching for:', query);
  };


   return (
    <div className="app">
      // Add other components here
      <SearchBox onSearch={handleSearch} />
    </div>
  );


}

export default App
