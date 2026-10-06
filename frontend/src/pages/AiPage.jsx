import { useState, useEffect, useRef } from "react";
import WordData from "../components/WordData.jsx";
import Loader from "../components/Loader.jsx";

const AiPage = ({ word }) => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const resultRef = useRef(null);

  useEffect(() => {
    if (!word) return;

    const controller = new AbortController();
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

    const fetchWord = async () => {
      setIsPending(true);
      setError(null);
      setResult(null);

      try {
        const response = await fetch(`/api/ai`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ word }),
          signal: controller.signal,
        });
        if (!response.ok)
          throw new Error(`Could not fetch AI response (${response.status})`);
        const data = await response.json();
        setResult(data);
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(data));
        } catch {
          // storage full or blocked: not critical
        }
      } catch (e) {
        if (e.name === "AbortError") return;
        setError(e.message);
      } finally {
        if (!controller.signal.aborted) setIsPending(false);
      }
    };
    fetchWord();
    return () => controller.abort();
  }, [word]);

  // scroll to result once it's ready
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  return (
    <div ref={resultRef} className="mx-auto mt-4 w-full max-w-180 font-serif">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {isPending && <Loader word={word} type="" />}
      {result && <WordData word={result} />}
    </div>
  );
};

export default AiPage;
