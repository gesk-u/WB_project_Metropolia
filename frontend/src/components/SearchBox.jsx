import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

function SearchBox({ onSearch }) {
    const [query, setQuery] = useState('');
    const navigate= useNavigate();   // TO NAVIGATE TO RESULTS PAGE WHEN CLICK "ETSI"

    const onSubmit = e => {
        e.preventDefault();
        onSearch(query);
        console.log('Searching for:', query);
        navigate(`/WB_project_Metropolia/results/${query}`);
      };  

    return (
      
      <div className="flex flex-col items-center w-[720px] max-w-[768px]  mx-auto flex-none order-none grow-0">
        <div className="flex flex-col items-center pb-8 w-full h-[49px] flex-none order-0 grow-0">

      </div> 

      <form onSubmit={onSubmit}>
        <div className="box-border flex flex-row items-start p-0 w-[720px] h-[65.78px] bg-white border-[1.5px] border-[#DDD8D0] shadow-[0px_1px_3px_rgba(0,0,0,0.04)] rounded flex-none order-none grow-0"> 
          <input
            id='query'
            name='query'
            type='text'
            placeholder='kirjoita suomalainen sana...'
            onChange={e => setQuery(e.target.value)}
            required
            value={query}
            className='flex-1 py-[17.6px] px-[22.4px] outline-none text-[17px]'
          />
        
        <button type='submit' className='flex flex-col justify-center items-center px-[25.6px] py-0 w-[101.2px] h-[62.78px] bg-[#EDE9E3] flex-none order-1 self-stretch grow-0 hover:bg-[#DDD8D0] transition-colors cursor-pointer'>
          ETSI</button> 
          </div>
      </form>
    </div>
  );
}

export default SearchBox;