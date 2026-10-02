import { SanaHead } from './Logo';

export default function Loader({ word, type = 'videos' }) {
    const message =
        type === 'videos'
            ? `Sana is rolling through YouTube looking for “${word}”`
            : `Sana does its best...`;

    return (
        <div role="status" aria-live="polite" className="flex flex-col items-center gap-6 px-4 py-16 text-center">
            <div className="sana-track">
                <div className="sana-shadow" />
                <div className="sana-bump">
                    <div className="sana-roll">
                        <SanaHead className="h-full w-full" />
                    </div>
                </div>
            </div>
            <p className="font-['Fraunces'] text-xl italic text-[#5A5550]">
                {message}
                <span className="sana-dots" aria-hidden="true">
                    <span>.</span><span>.</span><span>.</span>
                </span>
            </p>
        </div>
    );
}