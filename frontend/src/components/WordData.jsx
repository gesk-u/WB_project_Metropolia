const WordData = ({ word }) => {
    return (
        <div className="rounded-md border border-stone-200 bg-white p-6 font-serif shadow-sm">
            <div className="mb-5 border-b border-stone-200 pb-4">
                <div className="flex items-baseline gap-3">
                    <h2 className="text-3xl text-[#7c9a8c]">{word.word}</h2>
                    <span className="text-lg text-stone-400">{word.transcription}</span>
                </div>
                <p className="mt-2 leading-relaxed text-stone-600">{word.definition}</p>
            </div>

            <p className="mb-3 text-xs uppercase tracking-widest text-stone-400">
                Example sentences
            </p>

            <div className="flex flex-col gap-3">
                {word.sentences.map((s, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <p className="flex-1 border-l-4 border-[#7c9a8c] bg-[#f3f0eb] px-4 py-2 text-lg text-stone-700">
                            {s}
                        </p>
                        <span className="rounded bg-[#7c9a8c] px-2 py-1 text-xs font-bold text-white">
                            {index + 1}/{word.sentences.length}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WordData;