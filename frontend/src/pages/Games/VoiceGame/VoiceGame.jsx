import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/common/Button';
import RewardAnimation from '../../../components/common/RewardAnimation';
import useTranslation from '../../../hooks/useTranslation';

const words = [
  { en: 'Apple', ur: 'سیب', emoji: '🍎' },
  { en: 'Star', ur: 'ستارہ', emoji: '🌟' },
  { en: 'Cat', ur: 'بلی', emoji: '🐱' },
  { en: 'Sun', ur: 'سورج', emoji: '☀️' },
  { en: 'Moon', ur: 'چاند', emoji: '🌙' },
  { en: 'Fish', ur: 'مچھلی', emoji: '🐟' },
  { en: 'Bird', ur: 'پرندہ', emoji: '🐦' },
  { en: 'Tree', ur: 'درخت', emoji: '🌳' },
  { en: 'Water', ur: 'پانی', emoji: '💧' },
  { en: 'Book', ur: 'کتاب', emoji: '📖' },
];

export default function VoiceGame() {
  const { t, isUrdu } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setSupported(false); return; }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript.toLowerCase().trim();
      setTranscript(text);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    return () => { try { recognition.abort(); } catch {} };
  }, []);

  useEffect(() => {
    if (!transcript) return;
    const current = words[currentIndex];
    const isCorrect = transcript.toLowerCase().includes(current.en.toLowerCase());
    setResult(isCorrect);
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      if (currentIndex < words.length - 1) {
        setCurrentIndex(i => i + 1);
        setTranscript('');
        setResult(null);
      } else {
        setGameOver(true);
        setShowReward(true);
      }
    }, 2000);
  }, [transcript]);

  const startListening = () => {
    if (!recognitionRef.current) return;
    setTranscript('');
    setResult(null);
    setIsListening(true);
    recognitionRef.current.start();
  };

  const restart = () => {
    setCurrentIndex(0); setScore(0); setGameOver(false);
    setTranscript(''); setResult(null); setShowReward(false);
  };

  if (!supported) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4 pt-24">
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center max-w-md">
          <div className="text-5xl mb-4">🎤</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">{t('voice.notAvailable')}</h2>
          <p className="text-gray-500">{t('voice.useChromeOrEdge')}</p>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4 pt-24">
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white rounded-3xl p-10 shadow-2xl text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-extrabold text-blue-600 mb-2">{t('common.wonderful')}</h2>
          <p className="text-5xl font-extrabold text-pink-500 mb-4">{score}/{words.length}</p>
          <p className="text-gray-500 mb-6">{t('voice.greatResult').replace('{score}', score)}</p>
          <Button variant="primary" onClick={restart}>{t('common.playAgain')}</Button>
        </motion.div>
        <RewardAnimation type="star" show={showReward} onComplete={() => setShowReward(false)} />
      </div>
    );
  }

  const current = words[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 p-4 pt-24">
      <div className="max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800">🎤 {t('voice.title')}</h1>
        </motion.div>

        <div className="flex justify-between mb-4 text-sm">
          <span className="bg-white px-4 py-2 rounded-xl shadow-sm font-semibold">{t('voice.word')} {currentIndex + 1}/{words.length}</span>
          <span className="bg-white px-4 py-2 rounded-xl shadow-sm font-semibold">{t('common.score')}: {score}</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <motion.div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            animate={{ width: `${((currentIndex + 1) / words.length) * 100}%` }} />
        </div>

        <motion.div key={currentIndex} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-10 shadow-lg text-center mb-6">
          <div className="text-8xl mb-4">{current.emoji}</div>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-1">{isUrdu ? current.ur : current.en}</h2>
          <p className="text-purple-500 font-semibold mt-4">{t('voice.canYouSay')}</p>
        </motion.div>

        <div className="text-center mb-6">
          <motion.button onClick={startListening} disabled={isListening}
            animate={isListening ? { scale: [1, 1.1, 1], boxShadow: ['0 0 0px rgba(59,130,246,0)', '0 0 30px rgba(59,130,246,0.5)', '0 0 0px rgba(59,130,246,0)'] } : {}}
            transition={isListening ? { repeat: Infinity, duration: 1.5 } : {}}
            className={`w-20 h-20 rounded-full text-white text-3xl shadow-lg transition ${isListening ? 'bg-red-500' : 'bg-blue-500 hover:bg-blue-600'}`}>
            🎤
          </motion.button>
          <p className="text-gray-400 text-sm mt-2">{isListening ? t('voice.listening') : t('voice.tapToSpeak')}</p>
        </div>

        {transcript && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4">
            <p className="text-gray-500 text-sm">{t('voice.youSaid')}</p>
            <p className="text-xl font-bold text-gray-700">"{transcript}"</p>
          </motion.div>
        )}

        {result !== null && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`text-center p-4 rounded-xl font-bold ${result ? 'bg-green-100 text-green-600' : 'bg-orange-50 text-orange-500'}`}>
            {result ? `⭐ ${t('voice.perfect')}` : t('voice.almost')}
          </motion.div>
        )}
      </div>
    </div>
  );
}
