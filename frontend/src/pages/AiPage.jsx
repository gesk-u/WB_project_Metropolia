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

const AiPage = ({ word }) => {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        if (!word) return;

        const fetchWord = async() => {
            setIsPending(true);
            setError(null)
            try {
                const response = await fetch(`/api/ai?word=${encodeURIComponent(word)}`);
                if (!response.ok) throw new Error("Could not fetch ai response");
                const data = await response.json();
                setResult(data);
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
                <div className="py-6 text-center text-sm italic text-stone-400">Loading…</div>
            )}
            {result && <WordData word={result} />}
        </div>
    );
}

export default AiPage