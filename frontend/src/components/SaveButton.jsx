export default function SaveButton({ isSaved, disabled, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={isSaved ? 'Remove from saved words' : 'Save word'}
            className={`inline-flex min-h-11 items-center gap-2 rounded-sm border bg-[#FBFAF7] px-4 font-['JetBrains_Mono'] text-[15px] uppercase tracking-[0.88px] transition-colors hover:text-[#2E2B27] disabled:opacity-60 ${
                isSaved ? 'border-[#7A9E8E] text-[#4A775F]' : 'border-[#DDD8D0] text-[#5A5550] hover:border-[#7A9E8E]'
            }`}
        >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 3.5h12v17l-6-4.2-6 4.2z" />
            </svg>
            {isSaved ? 'Saved' : 'Save word'}
        </button>
    );
}