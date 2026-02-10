import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/common/Button';
import RewardAnimation from '../../../components/common/RewardAnimation';
import useTranslation from '../../../hooks/useTranslation';

const scenarios = [
  { scenario: 'Your friend shares their toy with you', scenario_ur: 'آپ کا دوست آپ کے ساتھ کھلونا شیئر کرتا ہے', correct: 'happy', options: ['happy', 'sad', 'angry', 'surprised'] },
  { scenario: 'You lost your favorite toy', scenario_ur: 'آپ کا پسندیدہ کھلونا کھو گیا', correct: 'sad', options: ['happy', 'sad', 'angry', 'scared'] },
  { scenario: 'Someone takes your turn in line', scenario_ur: 'کوئی آپ کی باری لے لیتا ہے', correct: 'angry', options: ['happy', 'sad', 'angry', 'surprised'] },
  { scenario: 'You hear a very loud thunder', scenario_ur: 'آپ کو زور سے گرج سنائی دیتی ہے', correct: 'scared', options: ['happy', 'sad', 'angry', 'scared'] },
  { scenario: 'Mom gives you a big warm hug', scenario_ur: 'امی آپ کو گلے لگاتی ہیں', correct: 'loved', options: ['happy', 'loved', 'sad', 'surprised'] },
  { scenario: 'Your birthday cake has extra candles!', scenario_ur: 'آپ کے کیک پر اضافی موم بتیاں ہیں!', correct: 'surprised', options: ['happy', 'surprised', 'sad', 'angry'] },
  { scenario: 'You draw a beautiful picture', scenario_ur: 'آپ ایک خوبصورت تصویر بناتے ہیں', correct: 'happy', options: ['happy', 'sad', 'surprised', 'loved'] },
  { scenario: 'Your pet is not feeling well', scenario_ur: 'آپ کا پالتو جانور بیمار ہے', correct: 'sad', options: ['happy', 'sad', 'angry', 'scared'] },
];

const emotionEmojis = {
  happy: '😊', sad: '😢', angry: '😠', scared: '😨', surprised: '😮', loved: '🥰',
};

const emotionColors = {
  happy: 'bg-yellow-100 border-yellow-400',
  sad: 'bg-blue-100 border-blue-400',
  angry: 'bg-red-100 border-red-400',
  scared: 'bg-purple-100 border-purple-400',
  surprised: 'bg-green-100 border-green-400',
  loved: 'bg-pink-100 border-pink-400',
};

export default function EmotionGame() {
  const { t, isUrdu } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const current = scenarios[currentIndex];

  const handleSelect = (emotion) => {
    if (selected) return;
    setSelected(emotion);
    const correct = emotion === current.correct;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);

    setTimeout(() => {
      if (currentIndex < scenarios.length - 1) {
        setCurrentIndex(i => i + 1);
        setSelected(null);
        setIsCorrect(null);
      } else {
        setGameOver(true);
        setShowReward(true);
      }
    }, correct ? 1500 : 2000);
  };

  const restart = () => {
    setCurrentIndex(0); setSelected(null); setIsCorrect(null);
    setScore(0); setGameOver(false); setShowReward(false);
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 pt-24 flex items-center justify-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-10 shadow-2xl text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-extrabold text-purple-600 mb-2">{t('common.greatJob')}</h2>
          <p className="text-xl text-gray-600 mb-1">{t('emotion.youScored')}</p>
          <p className="text-5xl font-extrabold text-pink-500 mb-4">{score}/{scenarios.length}</p>
          <Button variant="primary" onClick={restart}>{t('common.playAgain')}</Button>
        </motion.div>
        <RewardAnimation type="trophy" show={showReward} onComplete={() => setShowReward(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 pt-24">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800">😊 {t('emotion.title')}</h1>
        </motion.div>

        <div className="flex justify-between items-center mb-6">
          <span className="bg-white px-4 py-2 rounded-xl shadow-sm font-semibold text-sm">
            {t('emotion.question')} {currentIndex + 1}/{scenarios.length}
          </span>
          <span className="bg-white px-4 py-2 rounded-xl shadow-sm font-semibold text-sm">
            {t('common.score')}: {score}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <motion.div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
            animate={{ width: `${((currentIndex + 1) / scenarios.length) * 100}%` }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={currentIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <div className="bg-white rounded-3xl p-8 shadow-lg mb-6 text-center">
              <p className="text-xl font-bold text-gray-700 mb-2">{isUrdu ? current.scenario_ur : current.scenario}</p>
              <p className="text-purple-500 font-semibold mt-4">{t('emotion.howWouldYouFeel')}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {current.options.map((opt) => {
                let borderClass = 'border-2 border-transparent';
                if (selected === opt && isCorrect) borderClass = 'border-4 border-green-500 scale-105';
                if (selected === opt && !isCorrect) borderClass = 'border-4 border-red-400 animate-pulse';
                if (selected && opt === current.correct && !isCorrect) borderClass = 'border-4 border-green-500';

                return (
                  <motion.button key={opt} onClick={() => handleSelect(opt)}
                    whileHover={!selected ? { scale: 1.05 } : {}} whileTap={!selected ? { scale: 0.95 } : {}}
                    className={`${emotionColors[opt]} ${borderClass} rounded-3xl p-6 text-center transition-all shadow-sm`}>
                    <div className="text-5xl mb-2">{emotionEmojis[opt]}</div>
                    <div className="font-bold text-gray-700">{t(`emotion.${opt}`)}</div>
                  </motion.button>
                );
              })}
            </div>

            {selected && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`text-center mt-4 p-3 rounded-xl font-bold ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-500'}`}>
                {isCorrect ? `⭐ ${t('common.correct')}` : `${t('emotion.notQuite').replace('{emotion}', t(`emotion.${current.correct}`)).replace('{emoji}', emotionEmojis[current.correct])}`}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
