import { useNavigate } from 'react-router-dom';
import SearchBox from './SearchBox.jsx';

function NoResults({word, onSearch}) {
    const navigate = useNavigate();

    return (
        <div className="text-[20px] text-[#4A453F] flex flex-col items-center gap-4 p-6 w-[720px] flex-none order-1 self-center grow-0">
            <p>No results found for "{word}"</p>

            <button 
                onClick={() => navigate('/WB_project_Metropolia/ai')}
                className="px-6 py-3 bg-[#EDE9E3] rounded hover:bg-[#DDD8D0] transition-colors cursor-pointer"
            >
                Go to AI page to practce
            </button>

            <p className="text-[20px] text-[#4A453F] mt-5">
                Or make a new search for word or phrase:
            </p>

            <SearchBox onSearch={onSearch} />
        </div>
    );
}

export default NoResults;

