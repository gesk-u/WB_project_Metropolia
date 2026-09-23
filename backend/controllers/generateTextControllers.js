
const { getAiGeneratedText } = require('../models/generateService');

// Clean word
const cleanWord = (raw) => {
  if (typeof raw !== 'string') return null;
  const word = raw.trim().toLowerCase();
  if (!word || word.length > 50) return null;
  if (!/^[a-zåäö][a-zåäö'\- ]*$/i.test(word)) return null;
  return word;
};

const handleError = (res, err) => {
  console.error('AI controller error:', err);
  if (err.status === 429) {
    return res.status(429).json({ error: 'Rate limit reached, try again in a minute.' });
  }
  return res.status(500).json({ error: 'Failed to generate response.' });
};

const generateAiText = async (req, res) => {
  const word = cleanWord(req.body?.word);
  if (!word) {
    return res.status(400).json({ error: 'Please provide a valid word.' });
  }

  try {
    const info = await getAiGeneratedText(word);
    if (info.error) {
      return res.status(404).json({ error: `"${word}" was not recognized as a Finnish word.` });
    }
    res.json(info);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = { generateAiText };