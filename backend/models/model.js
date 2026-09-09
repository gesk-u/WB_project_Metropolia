let words = [];
let nextId = 1;

const getWord = (word) => {
    if (!word) {
        return false
    };

    const newWord = {
        id: nextId++,
        word
    }

    words.push(word);
    return newWord;
}

