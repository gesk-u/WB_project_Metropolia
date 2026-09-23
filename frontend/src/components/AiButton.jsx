const AiButton = ({ handler }) => {
    return (
        <button
            onClick={handler}
            className="mx-auto mt-3 block rounded-md border border-[#7c9a8c] px-5 py-2
                       font-serif text-sm uppercase tracking-widest text-[#7c9a8c]
                       transition-colors duration-200 hover:bg-[#7c9a8c] hover:text-white
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7c9a8c]/40"
        >
            ✦ AI Explain
        </button>
    );
};

export default AiButton;