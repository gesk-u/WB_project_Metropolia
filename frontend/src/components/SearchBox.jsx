import { useState } from 'react';
// will add styling later. 
//import './SearchBox.css';  

function SearchBox({ onSearch }) {
    const [query, setQuery] = useState('');

    const onSubmit = e => {
        e.preventDefault();
        onSearch(query);
    };

    return (
    <div className='search-box'>
      <p className='search-box-description'>
        Type a Finnish word — we find the moment it is spoken on YouTube
      </p>
      <form onSubmit={onSubmit} className='search-box-form'>
        <div>
          <input
            id='query'
            name='query'
            type='text'
            placeholder='kirjoita suomalainen sana...'
            onChange={e => setQuery(e.target.value)}
            value={query}
            className='search-box-input'
          />
        </div>
        <button type='submit' className='search-box-button'>ETSI</button>
      </form>
    </div>
  );
}

export default SearchBox;