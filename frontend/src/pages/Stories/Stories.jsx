import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaTimes, FaBookOpen } from 'react-icons/fa';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useSensory } from '../../context/SensoryContext';

const STORIES = [
  {
    id: 1,
    title: 'Going to School',
    title_ur: 'سکول جانا',
    gradient: 'from-yellow-400 to-orange-400',
    emoji: '🏫',
    scenes: [
      {
        text: 'I wake up in the morning. The sun is shining bright!',
        text_ur: 'میں صبح اٹھتا ہوں۔ سورج چمک رہا ہے!',
        emoji: '🌅',
        bg: 'from-amber-300 to-yellow-500',
      },
      {
        text: 'I get dressed and put on my favorite clothes.',
        text_ur: 'میں تیار ہوتا ہوں اور اپنے پسندیدہ کپڑے پہنتا ہوں۔',
        emoji: '👕',
        bg: 'from-sky-300 to-blue-500',
      },
      {
        text: 'The school bus comes to pick me up. I climb on board!',
        text_ur: 'سکول بس مجھے لینے آتی ہے۔ میں بس میں چڑھتا ہوں!',
        emoji: '🚌',
        bg: 'from-yellow-400 to-amber-500',
      },
      {
        text: 'I meet my friends at school. We wave and say hello!',
        text_ur: 'میں سکول میں اپنے دوستوں سے ملتا ہوں۔ ہم ہاتھ ہلاتے اور سلام کرتے ہیں!',
        emoji: '👋',
        bg: 'from-green-300 to-emerald-500',
      },
    ],
  },
  {
    id: 2,
    title: 'Making Friends',
    title_ur: 'دوست بنانا',
    gradient: 'from-pink-400 to-purple-400',
    emoji: '🤝',
    scenes: [
      {
        text: 'I go to the playground. There are other children playing!',
        text_ur: 'میں کھیل کے میدان میں جاتا ہوں۔ وہاں اور بچے کھیل رہے ہیں!',
        emoji: '🏃',
        bg: 'from-lime-300 to-green-500',
      },
      {
        text: 'I walk up to someone and say "Hello! My name is..."',
        text_ur: 'میں کسی کے پاس جاتا ہوں اور کہتا ہوں "ہیلو! میرا نام ہے..."',
        emoji: '👋',
        bg: 'from-cyan-300 to-teal-500',
      },
      {
        text: 'We share our toys with each other. Sharing is caring!',
        text_ur: 'ہم ایک دوسرے کے ساتھ کھلونے بانٹتے ہیں۔ بانٹنا اچھی بات ہے!',
        emoji: '🧸',
        bg: 'from-rose-300 to-pink-500',
      },
      {
        text: 'Now we play together and have so much fun!',
        text_ur: 'اب ہم ساتھ کھیلتے ہیں اور بہت مزے کرتے ہیں!',
        emoji: '⚽',
        bg: 'from-violet-300 to-purple-500',
      },
    ],
  },
  {
    id: 3,
    title: 'Visiting Doctor',
    title_ur: 'ڈاکٹر کے پاس',
    gradient: 'from-teal-400 to-cyan-400',
    emoji: '🩺',
    scenes: [
      {
        text: 'Today we are going to the doctor\'s clinic. It will be okay!',
        text_ur: 'آج ہم ڈاکٹر کے کلینک جا رہے ہیں۔ سب ٹھیک ہو گا!',
        emoji: '🏥',
        bg: 'from-blue-300 to-indigo-500',
      },
      {
        text: 'We sit in the waiting room. I can read a book or play quietly.',
        text_ur: 'ہم انتظار کے کمرے میں بیٹھتے ہیں۔ میں کتاب پڑھ سکتا ہوں یا خاموشی سے کھیل سکتا ہوں۔',
        emoji: '🪑',
        bg: 'from-amber-200 to-orange-400',
      },
      {
        text: 'The doctor checks me. They are very gentle and kind.',
        text_ur: 'ڈاکٹر مجھے چیک کرتے ہیں۔ وہ بہت نرم اور مہربان ہیں۔',
        emoji: '👨‍⚕️',
        bg: 'from-teal-300 to-cyan-500',
      },
      {
        text: 'I was very brave! I get a shiny star sticker!',
        text_ur: 'میں بہت بہادر تھا! مجھے ایک چمکدار ستارہ اسٹیکر ملتا ہے!',
        emoji: '⭐',
        bg: 'from-yellow-300 to-amber-500',
      },
    ],
  },
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 600 : -600,
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
  exit: (direction) => ({
    x: direction > 0 ? -600 : 600,
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.35, ease: 'easeIn' },
  }),
};

const Stories = () => {
  const { language } = useSensory();
  const isUrdu = language === 'ur';

  const [activeStory, setActiveStory] = useState(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const openStory = useCallback((story) => {
    setActiveStory(story);
    setSceneIndex(0);
    setDirection(0);
  }, []);

  const closeStory = useCallback(() => {
    setActiveStory(null);
    setSceneIndex(0);
    setDirection(0);
  }, []);

  const goNext = useCallback(() => {
    if (!activeStory) return;
    if (sceneIndex < activeStory.scenes.length - 1) {
      setDirection(1);
      setSceneIndex((prev) => prev + 1);
    }
  }, [activeStory, sceneIndex]);

  const goPrev = useCallback(() => {
    if (sceneIndex > 0) {
      setDirection(-1);
      setSceneIndex((prev) => prev - 1);
    }
  }, [sceneIndex]);

  const goToScene = useCallback(
    (index) => {
      setDirection(index > sceneIndex ? 1 : -1);
      setSceneIndex(index);
    },
    [sceneIndex]
  );

  // ─── Story Viewer (Full Screen) ───────────────────────────────
  if (activeStory) {
    const scene = activeStory.scenes[sceneIndex];
    const totalScenes = activeStory.scenes.length;
    const isFirst = sceneIndex === 0;
    const isLast = sceneIndex === totalScenes - 1;

    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200 shrink-0">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800">
              {isUrdu ? activeStory.title_ur : activeStory.title}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isUrdu
                ? `منظر ${sceneIndex + 1} از ${totalScenes}`
                : `Scene ${sceneIndex + 1} of ${totalScenes}`}
            </p>
          </div>
          <button
            onClick={closeStory}
            className="p-3 rounded-full bg-gray-200 hover:bg-red-100 hover:text-red-600 text-gray-600 transition-colors"
            aria-label="Close story"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Scene Area */}
        <div className="flex-1 flex flex-col items-center justify-center relative px-4 py-6 overflow-hidden">
          {/* Left Arrow */}
          {!isFirst && (
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              onClick={goPrev}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Previous scene"
            >
              <FaArrowLeft className="text-xl" />
            </motion.button>
          )}

          {/* Right Arrow */}
          {!isLast && (
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              onClick={goNext}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Next scene"
            >
              <FaArrowRight className="text-xl" />
            </motion.button>
          )}

          {/* Animated Scene */}
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={sceneIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col items-center w-full max-w-2xl"
            >
              {/* Illustration Area */}
              <div
                className={`w-full aspect-[4/3] max-h-[45vh] rounded-3xl bg-gradient-to-br ${scene.bg} flex items-center justify-center shadow-xl mb-8`}
              >
                <span className="text-[8rem] md:text-[10rem] select-none drop-shadow-lg">
                  {scene.emoji}
                </span>
              </div>

              {/* Text */}
              <div className="text-center px-4 space-y-3">
                <p className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed">
                  {scene.text}
                </p>
                <p
                  className="text-xl md:text-2xl font-semibold text-gray-600 leading-relaxed"
                  dir="rtl"
                  lang="ur"
                >
                  {scene.text_ur}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation Dots & Buttons */}
        <div className="shrink-0 px-6 py-5 bg-gray-50 border-t border-gray-200 flex flex-col items-center gap-4">
          {/* Dots */}
          <div className="flex items-center gap-3">
            {activeStory.scenes.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToScene(idx)}
                aria-label={`Go to scene ${idx + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  idx === sceneIndex
                    ? 'w-10 h-4 bg-indigo-500'
                    : 'w-4 h-4 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Nav Buttons */}
          <div className="flex items-center gap-4">
            <Button
              onClick={goPrev}
              disabled={isFirst}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                isFirst
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:scale-105'
              }`}
            >
              {isUrdu ? 'پچھلا' : 'Previous'}
            </Button>

            {isLast ? (
              <Button
                onClick={closeStory}
                className="px-8 py-2 rounded-xl font-bold bg-green-500 hover:bg-green-600 text-white hover:scale-105 transition-all"
              >
                {isUrdu ? 'ختم کریں' : 'Finish'}
              </Button>
            ) : (
              <Button
                onClick={goNext}
                className="px-8 py-2 rounded-xl font-bold hover:scale-105 transition-all"
              >
                {isUrdu ? 'اگلا' : 'Next'}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── Stories Grid ─────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50 px-4 py-8 md:px-8"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg mb-4"
        >
          <FaBookOpen className="text-3xl text-white" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
          {isUrdu ? 'سماجی کہانیاں' : 'Social Stories'}
        </h1>
        <p className="text-lg text-gray-500 mt-2" dir={isUrdu ? 'rtl' : 'ltr'}>
          {isUrdu
            ? 'ایک کہانی منتخب کریں اور پڑھنا شروع کریں!'
            : 'Choose a story and start reading!'}
        </p>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {STORIES.map((story, idx) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * idx, duration: 0.4 }}
          >
            <Card
              className="cursor-pointer group hover:shadow-2xl transition-shadow duration-300 rounded-3xl overflow-hidden border-0"
              onClick={() => openStory(story)}
            >
              {/* Thumbnail */}
              <div
                className={`w-full h-48 bg-gradient-to-br ${story.gradient} flex items-center justify-center relative overflow-hidden`}
              >
                <motion.span
                  className="text-7xl select-none drop-shadow-md"
                  whileHover={{ scale: 1.2, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  {story.emoji}
                </motion.span>
                {/* Decorative circles */}
                <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/20" />
                <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white/15" />
                <div className="absolute top-6 right-6 w-5 h-5 rounded-full bg-white/25" />
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">
                  {story.title}
                </h3>
                <p className="text-lg font-semibold text-gray-500 mb-3" dir="rtl" lang="ur">
                  {story.title_ur}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400 font-medium">
                    {isUrdu
                      ? `${story.scenes.length} مناظر`
                      : `${story.scenes.length} scenes`}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-500 group-hover:text-indigo-700 transition-colors">
                    {isUrdu ? 'پڑھیں' : 'Read'}
                    <FaArrowRight className="text-xs" />
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Stories;
