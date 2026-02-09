import { useState, useCallback, useEffect, useRef } from 'react';
import { useSensory } from '../context/SensoryContext';

/**
 * Custom hook for Web Speech API Text-to-Speech.
 * Supports English ('en-US') and Urdu ('ur-PK').
 * Respects the sensory context's soundEnabled and soundVolume settings.
 */
export default function useSpeech() {
  const { soundEnabled, soundVolume } = useSensory();
  const [isSpeaking, setSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  const LANG_MAP = {
    en: 'en-US',
    ur: 'ur-PK',
    'en-US': 'en-US',
    'ur-PK': 'ur-PK',
  };

  // Cancel any ongoing speech when the component unmounts
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  /**
   * Speak the given text in the specified language.
   * @param {string} text   - The text to read aloud.
   * @param {string} [lang] - Language code: 'en', 'ur', 'en-US', or 'ur-PK'. Defaults to 'en-US'.
   */
  const speak = useCallback(
    (text, lang = 'en') => {
      if (!window.speechSynthesis) {
        console.warn('Web Speech API is not supported in this browser.');
        return;
      }

      if (!soundEnabled) {
        return;
      }

      // Cancel any current speech before starting a new one
      window.speechSynthesis.cancel();

      const resolvedLang = LANG_MAP[lang] || 'en-US';

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = resolvedLang;
      utterance.volume = soundVolume;
      utterance.rate = 0.9; // slightly slower for clarity (helpful for children)
      utterance.pitch = 1.1; // slightly higher pitch, friendlier tone

      // Try to pick a voice that matches the requested language
      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find((v) => v.lang === resolvedLang) ||
        voices.find((v) => v.lang.startsWith(resolvedLang.split('-')[0]));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = (e) => {
        // 'interrupted' and 'canceled' are normal when we call cancel() before a new speak
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.error('Speech synthesis error:', e.error);
        }
        setSpeaking(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [soundEnabled, soundVolume]
  );

  /**
   * Stop any ongoing speech immediately.
   */
  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking };
}
