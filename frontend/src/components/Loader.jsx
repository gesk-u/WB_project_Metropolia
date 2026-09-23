const Loader = ({ word, type}) => {
    const letters = "SANAHAKU".split("");

    return (
        <div role="status" className="flex flex-col items-center gap-4 py-16">
            <div className="flex font-serif text-4xl tracking-[0.3em]" aria-hidden="true">
                {letters.map((letter, i) => (
                    <span
                        key={i}
                        className="inline-block animate-wave motion-reduce:animate-none"
                        style={{ animationDelay: `${i * 0.1}s` }}
                    >
                        {letter}
                    </span>
                ))}
            </div>

            <div className="relative h-0.5 w-48 overflow-hidden rounded-full bg-stone-200">
                <div className="absolute inset-y-0 w-1/3 rounded-full bg-[#7c9a8c] animate-scan motion-reduce:animate-none" />
            </div>

            {word && (
                <p className="font-serif text-sm italic text-stone-400">
                    Searching {type} for "{word}"…
                </p>
            )}

            <span className="sr-only">Loading</span>
        </div>
    );
};

export default Loader;