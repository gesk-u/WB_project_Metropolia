//beforeworking with it : npm install @google/genai
const { GoogleGenAI } = require('@google/genai')

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })


// to test:
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set");
}

//check the model of gemini
// https://ai.google.dev/gemini-api/docs/models


// GoogleGenerativeAI setup
const MODEL_NAME = "models/gemini-3.5-flash-lite";

const model = async (prompt, options = {}) => {
  const contents = [{ role: "user", parts: [{ text: prompt }] }];

  try {
    const response = await genAI.models.generateContent({
      model: MODEL_NAME,
      contents,
      // You can adjust the temperature for more or less randomness in the output
      config: { temperature: 0.1, ...options },
    });

    if (process.env.DEBUG_GEMINI === "true") {
      console.log("🔍 FULL Gemini SDK response object:", JSON.stringify(response, null, 2));

      if (response?.text) {
        console.log("Gemini .text property:", response.text);
      } else {
        console.warn("No .text property found on Gemini response");
      }
    }

    return response.text; // return the full object so service can do result.text
  } catch (err) {
    console.error("Gemini API error:", err);
    throw err;
  }
};

module.exports = model;