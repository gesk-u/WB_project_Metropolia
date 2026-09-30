import SavedWordCard from "./SavedWordCard";

export default function SavedWordsList({ words, onRemove }) {
    return (
        <ul className="flex flex-col gap-3">
            {words.map((w) => (
                <SavedWordCard key={w._id} word={w} onRemove={() => onRemove(w._id)} />
            ))}
        </ul>
    );
}