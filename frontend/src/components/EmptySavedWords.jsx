import { Link } from 'react-router-dom';

const SUGGESTIONS = ['ruoka', 'ystävä', 'kirja', 'sade', 'päivä'];

const STEPS = [
    { title: 'Search a word', text: 'Type any Finnish word and pick a clip where it is spoken.' },
    { title: 'Save the clip', text: 'The word, the sentence and the timestamp are kept together.' },
    { title: 'Listen again', text: 'Come back here to replay each word in the moment it was spoken.' },
];

const focusRing =
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A775F]';

export default function EmptySavedWords() {
    return (
        <div className="flex flex-col gap-7">
            <section className="flex flex-col items-center gap-5 rounded-md border border-[#DDD8D0] bg-[#FBFAF7] px-8 py-14 text-center">
                <div aria-hidden="true" className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#EEF3EF] text-[#4A775F]">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
                        <path d="M6 3.5h12v17l-6-4.2-6 4.2z" />
                    </svg>
                </div>

                <div className="flex flex-col items-center gap-2.5">
                    <h2 className="font-['Fraunces'] text-[28px] text-[#2E2B27]">No saved words yet</h2>
                    <p className="max-w-[520px] leading-relaxed text-[#5A5550]">
                        When you find a word in a video, press the bookmark next to the clip. It will show up here
                        together with the exact moment it is spoken.
                    </p>
                </div>

                <Link
                    to="/"
                    className={`inline-flex h-[46px] items-center rounded-[3px] bg-[#4A775F] px-6 font-['JetBrains_Mono'] text-sm uppercase tracking-[0.1em] text-white hover:bg-[#3F6852] ${focusRing}`}
                >
                    Search a word
                </Link>

                <div className="flex flex-col items-center gap-3.5 pt-3.5">
                    <p className="font-['JetBrains_Mono'] text-[15px] uppercase tracking-[0.1em] text-[#3B3833]">Kokeile näitä:</p>
                    <ul className="flex flex-wrap justify-center gap-2">
                        {SUGGESTIONS.map((w) => (
                            <li key={w}>
                                <Link
                                    to={`/results/${encodeURIComponent(w)}`}
                                    className={`inline-flex h-11 items-center rounded-[3px] border border-[#DDD8D0] bg-white px-3.5 text-[17px] text-[#3B3833] hover:border-[#7A9E8E] ${focusRing}`}
                                >
                                    {w}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <ol className="grid gap-4 sm:grid-cols-3">
                {STEPS.map((step, i) => (
                    <li key={step.title} className="flex items-start gap-3.5">
                        <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#CFC9BE] text-sm text-[#3B3833]">
                            {i + 1}
                        </span>
                        <div>
                            <p className="font-['Fraunces'] text-[17px] text-[#2E2B27]">{step.title}</p>
                            <p className="mt-1 text-sm leading-normal text-[#6A655D]">{step.text}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}