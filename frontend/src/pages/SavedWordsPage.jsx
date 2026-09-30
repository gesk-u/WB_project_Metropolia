import { useEffect, useState } from 'react';
import { getSavedWords, removeSavedWord } from '../api/savedWords';
import EmptySavedWords from '../components/EmptySavedWords'
import SavedWordsList from '../components/SavedWordsList';


export function SavedWordsPage() {
    const [words, setWords] = useState([]);
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        const fetchSavedWords = async () => {
            setIsPending(true);
            setError(null);
            try {
                const data = await getSavedWords({ signal: controller.signal });
                setWords(data);
            } catch(e) {
                if (e.name === 'AbortError') return;
                setError(e.message);
            } finally {
                if (!controller.signal.aborted) setIsPending(false);
            }
        };

        fetchSavedWords();
        return () => controller.abort(); 
    }, []);

    
    async function handleRemove(id) {
        const previous = words;
        setWords((ws) => ws.filter((w) => w._id !== id)); // disappears right away
        try {
            await removeSavedWord(id);
        } catch {
            setWords(previous); // put it back if the server failed
            alert('Could not remove the word. Try again.');
        }
    }   

    let content;
    if (isPending) content = <p className="text-[#6A655D]">Loading...</p>;
    else if (error) content = <p role="alert" className="text-[#8F3F1D]">{error}</p>;
    else if (words.length === 0) content = <EmptySavedWords />;
    else content = <SavedWordsList words={words} onRemove={handleRemove} />;

    return (
        <div className="mx-auto w-full max-w-[880px] px-4 pb-20 pt-14">
            <p className="font-['JetBrains_Mono'] text-[13px] uppercase tracking-[0.14em] text-[#6F6A62]">Sanani</p>
            <h1 className="mt-2 font-['Fraunces'] text-[42px] leading-tight text-[#2E2B27]">Saved words</h1>
            <div className="mt-7">{content}</div>
        </div>
);
    
        
} 