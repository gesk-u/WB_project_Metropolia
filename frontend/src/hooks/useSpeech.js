import { useState, useEffect, useCallback } from "react";

const PREFERRED_VOICES = {
  "fi-FI": ["Google Suomi (Natural)", "Chrome OS Suomi", "Satu"],
};

//checks once whether the browser supports speech synthesis at all
const isSupported =
  typeof window !== "undefined" && "speechSynthesis" in window;

const findVoice = (voices, lang) => {
  const preferredNames = PREFERRED_VOICES[lang] || [];
  return (
    preferredNames
      .map((name) => voices.find((v) => v.name === name))
      .find(Boolean) ||
    voices.find((v) => v.lang.replace("_", "-") === lang) ||
    voices.find((v) => v.lang.toLowerCase().startsWith(lang.split("-")[0]))
  );
};

// the hook now takes the language as an argument
export const useSpeech = (lang = "fi-FI") => {
  const [voices, setVoices] = useState([]);
  const [speakingId, setSpeakingId] = useState(null);

  useEffect(() => {
    // do nothing if the browser has no speechSynthesis
    if (!isSupported) return;

    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();

    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  const speak = useCallback(
    (text, { lang: l = lang, rate = 0.9, id = null } = {}) => {
      // ADDED: guard for unsupported browsers
      if (!isSupported) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = l;
      utterance.rate = rate;

      const voice = findVoice(window.speechSynthesis.getVoices(), l);
      if (voice) utterance.voice = voice;

      utterance.onstart = () => setSpeakingId(id);
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);

      window.speechSynthesis.speak(utterance);
    },
    [lang],
  );

  // true only if the browser supports speech AND a matching voice exists
  const canSpeak = isSupported && !!findVoice(voices, lang);

  return { speak, speakingId, canSpeak };
};
