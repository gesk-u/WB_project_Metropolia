import { useState } from 'react';

const focusRing =
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A775F]';

    // 63.4 → "1:03"
function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
}

// Wraps the saved word inside the sentence in <mark>
function Highlighted({ sentence, match }) {
    const i = sentence.toLowerCase().indexOf(match.toLowerCase());
    if (i === -1) return sentence;
    return (
        <>
            {sentence.slice(0, i)}
            <mark className="rounded-sm bg-[#EEDFB8] px-0.5 text-[#2E2B27]">
                {sentence.slice(i, i + match.length)}
            </mark>
            {sentence.slice(i + match.length)}
        </>
    );
}

export default function SavedWordCard({ word, onRemove }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const start = Math.floor(word.start);
    const link = `https://www.youtube.com/watch?v=${word.videoId}&t=${start}s`;
    const time = formatTime(word.start);
    const title = word.videoTitle || 'YouTube video';

    return (
        <li className="grid grid-cols-[48px_minmax(0,1fr)_auto] gap-x-5 gap-y-3 rounded-md border border-[#DEDAD2] bg-[#FBFAF7] p-5 md:p-6">
            {/* Play / hide the clip */}
            <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                aria-label={`${isPlaying ? 'Hide' : 'Play'} clip for ${word.word}`}
                aria-expanded={isPlaying}
                className={`flex h-12 w-12 items-center justify-center rounded-full border ${focusRing} ${
                    isPlaying
                        ? 'border-[#4A775F] bg-[#4A775F] text-white'
                        : 'border-[#CFC9BE] bg-white pl-[3px] text-[#4A775F] hover:border-[#4A775F]'
                }`}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    {isPlaying ? <path d="M6.5 5h4v14h-4zM13.5 5h4v14h-4z" /> : <path d="M7 4.8v14.4l12-7.2z" />}
                </svg>
            </button>

            {/* Word, sentence, video */}
            <div className="min-w-0 space-y-2.5">
                <h2 className="font-serif text-[28px] leading-tight text-[#2E2B27]">{word.word}</h2>

                <p className="font-sans text-base leading-relaxed text-[#3B3833]">
                    “<Highlighted sentence={word.sentence} match={word.matchedForm || word.word} />”
                </p>

                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-sans text-[13px] text-[#6A655D]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="5.5" width="18" height="13" rx="3" />
                        <path d="M10.5 9.5l4 2.5-4 2.5z" />
                    </svg>
                    <span>{title}</span>
                    <span aria-hidden="true">·</span>
                    <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className={`text-[#4A775F] underline underline-offset-4 hover:text-[#365A47] ${focusRing}`}
                    >
                        Open on YouTube at {time}
                    </a>
                </div>
            </div>

            {/* Saved: click to remove */}
            <button
                type="button"
                onClick={onRemove}
                aria-label={`Remove ${word.word} from saved words`}
                title="Remove from saved words"
                className={`-mr-2 -mt-2 flex h-11 w-11 items-center justify-center rounded text-[#4A775F] hover:bg-[#ECE7DF] ${focusRing}`}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
                    <path d="M6 3.5h12v17l-6-4.2-6 4.2z" />
                </svg>
            </button>

            {/* The clip, starting at the saved moment */}
            {isPlaying && (
                <div className="col-span-full aspect-video overflow-hidden rounded bg-black">
                    <iframe
                        className="h-full w-full"
                        src={`https://www.youtube-nocookie.com/embed/${word.videoId}?start=${start}&autoplay=1`}
                        title={`${title} at ${time}`}
                        allow="autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            )}
        </li>
    );
}