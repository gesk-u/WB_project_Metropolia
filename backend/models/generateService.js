const model = require('../config/gemini');

const parseJson = (text) => {
  // strip markdown fences in case the model adds them
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
};

const getAiGeneratedText = async (word) => {
  const prompt = `First part: You are a Finnish dictionary. Give information about the Finnish word "${word}".
  Second part: Write 5 natural example sentences in Finnish language using the Finnish 
  word "${word}".Vary the context.Each sentence should be 5-10 words and contain the word
  exactly as given or a natural inflection of it. 
  Respond ONLY with JSON in this shape:
    {
      "word": "...",
      "transcription": "IPA transcription",
      "definition": "1-2 sentences, simple language",
      "sentences": ["...", "..."]
    }

    If it is not a real Finnish word, respond with {"error": "not_a_word"}.`;

    const text = await model(prompt, {
    //temperature: 0.5,
    responseMimeType: 'application/json',
  });
  return parseJson(text);
};


module.exports = { getAiGeneratedText };