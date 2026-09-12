import SearchBox from './components/SearchBox';

//////
import Results from './components/Results';

 
function App() {
  // API called when the user submits a search query
  // const handleSearch = (query) => {
  //   console.log('Searching for:', query);
  // }; 


   return (
    <div className="flex flex-col items-start p-0 w-full min-h-screen
            bg-[#F4F1EC] flex-none 
            order-none self-stretch grow-0">
      
      <Results/>
    </div>
  );


}

export default App
