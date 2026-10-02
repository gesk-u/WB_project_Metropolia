import Logo from './Logo';

export default function HomeHero() {
    return (
        <div className="flex flex-col items-center text-center">
            <h1>
                <Logo size="lg" />
            </h1>
            <p className="mt-4 font-['Fraunces'] text-[19px] italic text-[#5A5550] sm:mt-5 sm:text-2xl">
                Hear any Finnish word, spoken by real people.
            </p>
        </div>
    );
}