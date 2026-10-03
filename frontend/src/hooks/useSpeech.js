import { useState, useEffect, useCallback } from "react";

const PREFERRED_VOICES = {
  "fi-FI": ["Google Suomi (Natural)", "Chrome OS Suomi", "Satu"],
};

export const useSpeech = () => {
  const [voices, setVoices] = useState([]);
  const [speakingId, setSpeakingId] = useState(null);

  useEffect(() => {
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = useCallback(
    (text, { lang = "fi-FI", rate = 0.9, id = null } = {}) => {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;

      // fetch the voice list fresh at call time, instead of relying on state,
      // since speechSynthesis.getVoices() can be inconsistent right after onvoiceschanged
      const currentVoices = window.speechSynthesis.getVoices();
      const preferredNames = PREFERRED_VOICES[lang] || [];
      const voice =
        preferredNames
          .map((name) => currentVoices.find((v) => v.name === name))
          .find(Boolean) ||
        currentVoices.find((v) => v.lang === lang) ||
        currentVoices.find((v) => v.lang.startsWith(lang.split("-")[0]));

      // debug logs, remove once voice selection is confirmed working
      console.log(
        "Available fi-FI voices:",
        currentVoices.filter((v) => v.lang === "fi-FI").map((v) => v.name),
      );
      console.log("Selected voice:", voice?.name);

      if (voice) utterance.voice = voice;

      utterance.onstart = () => setSpeakingId(id);
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);

      window.speechSynthesis.speak(utterance);
    },
    [],
  );

  return { speak, speakingId, voicesReady: voices.length > 0 };
};
