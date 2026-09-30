const SIZES = {
    lg: { head: 'h-[78px] w-[72px] sm:h-[122px] sm:w-28', text: 'text-[48px] sm:text-[78px]', gap: 'gap-2 sm:gap-4' },
    sm: { head: 'h-[52px] w-12', text: 'text-[26px]', gap: 'gap-2' },
};

const DARK = '#2E2B27';

export function SanaHead({ className = '' }) {
    return (
        <svg viewBox="-56 -76 112 122" className={className} aria-hidden="true">
            {/* birch-bark horns */}
            <path d="M-20 -36 C-26 -52 -24 -62 -16 -70 C-14 -60 -10 -50 -8 -42 Z" fill="#EFE9DC" stroke={DARK} strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M14 -40 C16 -54 22 -62 32 -66 C28 -56 26 -46 26 -36 Z" fill="#EFE9DC" stroke={DARK} strokeWidth="2.5" strokeLinejoin="round" />
            <g stroke={DARK} strokeWidth="2" strokeLinecap="round">
                <line x1="-21" y1="-50" x2="-17" y2="-51" />
                <line x1="-18" y1="-60" x2="-15" y2="-60" />
                <line x1="20" y1="-50" x2="24" y2="-51" />
                <line x1="24" y1="-58" x2="27" y2="-59" />
            </g>

            {/* shaggy head */}
            <path
                d="M40 0 Q44.6 6.7 38 11.7 Q40.3 19.5 32.4 22.3 Q32 30.4 23.5 30.7 Q20.5 38.3 12.4 36.1 Q7.1 42.4 0 38 Q-7.1 42.4 -12.4 36.1 Q-20.5 38.3 -23.5 30.7 Q-32 30.4 -32.4 22.3 Q-40.3 19.5 -38 11.7 Q-44.6 6.7 -40 0 Q-44.6 -6.7 -38 -11.7 Q-40.3 -19.5 -32.4 -22.3 Q-32 -30.4 -23.5 -30.7 Q-20.5 -38.3 -12.4 -36.1 Q-7.1 -42.4 0 -38 Q7.1 -42.4 12.4 -36.1 Q20.5 -38.3 23.5 -30.7 Q32 -30.4 32.4 -22.3 Q40.3 -19.5 38 -11.7 Q44.6 -6.7 40 0 Z"
                fill="#7A9E8E"
                stroke={DARK}
                strokeWidth="2.5"
                strokeLinejoin="round"
            />
            <g fill="none" stroke="#5F8674" strokeWidth="2.2" strokeLinecap="round">
                <path d="M-30 12 q4 3 8 0" />
                <path d="M22 20 q4 3 8 0" />
            </g>

            {/* lingonberry sprig */}
            <path d="M27 -52 q6 -4 10 -1" fill="none" stroke="#5F8674" strokeWidth="2" strokeLinecap="round" />
            <ellipse cx="34" cy="-56" rx="4" ry="2.4" fill="#5F8674" transform="rotate(-25 34 -56)" />
            <circle cx="37" cy="-48" r="3.2" fill="#B5412F" stroke={DARK} strokeWidth="1.5" />
            <circle cx="32" cy="-46" r="3" fill="#B5412F" stroke={DARK} strokeWidth="1.5" />

            {/* face */}
            <g transform="translate(0 2)">
                <path d="M-16 -16 l7 4 l-7 4" fill="none" stroke={DARK} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10" cy="-13" r="9" fill="#fff" stroke={DARK} strokeWidth="2.5" />
                <circle cx="14" cy="-12" r="4" fill={DARK} />
                <circle cx="15.5" cy="-13.5" r="1.3" fill="#fff" />
                <path d="M-19 -24 l9 3" stroke={DARK} strokeWidth="2.6" strokeLinecap="round" />
                <path d="M4 -27 q6 -4 13 -1" fill="none" stroke={DARK} strokeWidth="2.6" strokeLinecap="round" />
                <rect x="-12" y="0" width="22" height="10" rx="5" fill={DARK} />
                <rect x="-9" y="2.2" width="16" height="5.6" rx="1.8" fill="#fff" />
                <line x1="-4" y1="2.2" x2="-4" y2="7.8" stroke={DARK} strokeWidth="1.3" />
                <line x1="1" y1="2.2" x2="1" y2="7.8" stroke={DARK} strokeWidth="1.3" />
                <ellipse cx="-21" cy="1" rx="5" ry="3" fill="#E6A69B" />
                <ellipse cx="21" cy="3" rx="5" ry="3" fill="#E6A69B" />
            </g>
        </svg>
    );
}

export default function Logo({ size = 'lg' }) {
    const s = SIZES[size];

    return (
        <span className={`inline-flex items-center ${s.gap} font-['Fraunces'] font-normal leading-none tracking-[-0.02em] text-[#2E2B27] ${s.text}`}>
            <SanaHead className={`shrink-0 ${s.head}`} />
            <span>
                sana<span className="text-[#4A775F]">haku</span>
            </span>
        </span>
    );
}