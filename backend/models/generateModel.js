const model = require('../config/gemini');

const parseJson = (text) => {
  // strip markdown fences in case the model adds them
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
};

const getWordInfo = async (word) => {
  const prompt = `You are a Finnish dictionary. Give information about the Finnish word "${word}".

Respond ONLY with JSON in exactly this shape:
{
  "word": "...",
  "transcription": "IPA transcription",
  "definition": "1-2 sentences, simple language",
}

If it is not a real Finnish word, respond with {"error": "not_a_word"}.`;

  const text = await model(prompt, {
    //temperature: 0.1,
    responseMimeType: 'application/json',
  });
  return parseJson(text);
};

const getWordExamples = async (word) => {

  const prompt = `Write 5 natural example sentences in Finnish language using the Finnish 
  word "${word}".Vary the context.
  Each sentence should be 5-10 words and contain the word
  exactly as given or a natural inflection of it.
  Respond ONLY with JSON in this shape:
  { "sentences": ["...", "..."] }`;

  const text = await model(prompt, {
   // temperature: 0.8,
    responseMimeType: 'application/json',
  });
  const data = parseJson(text);
  return data.sentences;
};

module.exports = { getWordInfo, getWordExamples };