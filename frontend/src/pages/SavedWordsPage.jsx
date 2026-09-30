import { useEffect, useState } from 'react';
import { getSavedWords, removeSavedWord } from '../api/savedWords';
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

    if (isPending) return <p>Loading...</p>;
    if (error) return <p role="alert">{error}</p>;
    if (words.length === 0) return <p>No words saved yet</p>;

    return <SavedWordsList words={words} onRemove={handleRemove} />;
    
        
} 