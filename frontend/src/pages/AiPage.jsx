const example = {
  "word": "kissa",
  "transcription": "/ˈkisːɑ/",
  "definition": "A cat. A small furry animal that many people keep as a pet at home.",
  "sentences": [
    "Minulla on kissa.",
    "Kissa nukkuu sohvalla.",
    "Naapurin kissa on hyvin ystävällinen."
  ]
}


import { useState, useEffect } from "react";
import WordData from "../components/WordData.jsx";
import Loader from '../components/Loader.jsx';

const AiPage = ({ word }) => {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        if (!word) return;

        const cacheKey = `ai:${word.toLowerCase()}`;

        try {
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
                setResult(JSON.parse(cached));
                setError(null);
                return;
            }
        } catch {
        // storage unavailable or corrupt data: just fetch normally
        }

        const fetchWord = async() => {
            setIsPending(true);
            setError(null)
            try {
                const response = await fetch(`/api/ai`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json"},
                    body: JSON.stringify({ word }) 
                });
                if (!response.ok) throw new Error("Could not fetch ai response");
                const data = await response.json();
                setResult(data);
                try {
                    sessionStorage.setItem(cacheKey, JSON.stringify(data));
                } catch {
                // storage full or blocked: not critical
                }
                //setWord(example);
            } catch (e) {
                setError(e.message);
            } finally {
                setIsPending(false); 
            }
    };
    fetchWord();
    }, [word]);

    return (
        <div className="mx-auto mt-4 w-full max-w-[720px] font-serif">
            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}
            {isPending && (
                <Loader word={word} />
            )}
            {result && <WordData word={result} />}
        </div>
    );
}

export default AiPage