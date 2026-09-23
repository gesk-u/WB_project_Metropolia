import { useNavigate } from 'react-router-dom';
import SearchBox from './SearchBox.jsx';

function NoResults({word, onSearch}) {

    return (
        <div className="text-[20px] text-[#4A453F] flex flex-col items-center gap-4 p-6 w-180 flex-none order-1 self-center grow-0">
            <p>No video results found for "{word}"</p>


            <p className="text-[20px] text-[#4A453F] mt-5">
                Make a new search for word or phrase:
            </p>

            <SearchBox onSearch={onSearch} />
        </div>
    );
}

export default NoResults;

