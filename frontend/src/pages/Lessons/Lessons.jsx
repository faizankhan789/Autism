import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaComments,
  FaUsers,
  FaSmile,
  FaHome,
  FaStar,
  FaClock,
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaTimes,
  FaTrophy,
  FaBookOpen,
} from "react-icons/fa";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import RewardAnimation from "../../components/common/RewardAnimation";
import useTranslation from '../../hooks/useTranslation';

// ─── Sample Data ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "all", label: "All", labelUr: "سب", icon: FaBookOpen, color: "from-purple-400 to-indigo-500" },
  { id: "communication", label: "Communication", labelUr: "بات چیت", icon: FaComments, color: "from-blue-400 to-cyan-500" },
  { id: "social", label: "Social Skills", labelUr: "سماجی مہارتیں", icon: FaUsers, color: "from-green-400 to-emerald-500" },
  { id: "emotions", label: "Emotions", labelUr: "جذبات", icon: FaSmile, color: "from-yellow-400 to-orange-500" },
  { id: "daily", label: "Daily Life", labelUr: "روزمرہ زندگی", icon: FaHome, color: "from-pink-400 to-rose-500" },
];

const DIFFICULTY_MAP = {
  easy: { label: "Easy", labelUr: "آسان", color: "bg-green-400 text-green-900" },
  medium: { label: "Medium", labelUr: "درمیانہ", color: "bg-yellow-400 text-yellow-900" },
  hard: { label: "Hard", labelUr: "مشکل", color: "bg-red-400 text-red-900" },
};

const LESSONS = [
  // ── Communication ──
  {
    id: 1,
    category: "communication",
    title: "Saying Hello",
    titleUr: "سلام کہنا",
    difficulty: "easy",
    duration: 5,
    gradient: "from-blue-400 to-cyan-500",
    emoji: "👋",
    steps: [
      {
        title: "Look at the Person",
        titleUr: "اس شخص کی طرف دیکھیں",
        content: "When you want to say hello, first look at the person. Make gentle eye contact and smile.",
        contentUr: "جب آپ سلام کہنا چاہیں تو پہلے اس شخص کی طرف دیکھیں۔ نرمی سے آنکھ ملائیں اور مسکرائیں۔",
        image: "👀",
      },
      {
        title: "Wave Your Hand",
        titleUr: "اپنا ہاتھ ہلائیں",
        content: "Raise your hand and wave gently. You can give a small wave or a big wave!",
        contentUr: "اپنا ہاتھ اٹھائیں اور آہستہ سے ہلائیں۔ آپ چھوٹا یا بڑا ہاتھ ہلا سکتے ہیں!",
        image: "👋",
      },
      {
        title: "Say Hello!",
        titleUr: "ہیلو کہیں!",
        content: "Now say 'Hello!' or 'Hi!' or 'Assalam-o-Alaikum!' in a friendly voice. Great job!",
        contentUr: "اب دوستانہ آواز میں 'ہیلو!' یا 'ہائی!' یا 'السلام علیکم!' کہیں۔ شاباش!",
        image: "🗣️",
      },
    ],
    quiz: [
      {
        question: "What do you do first when saying hello?",
        questionUr: "سلام کہتے وقت پہلے کیا کریں؟",
        options: [
          { text: "Run away", textUr: "بھاگ جائیں", correct: false },
          { text: "Look at the person", textUr: "شخص کی طرف دیکھیں", correct: true },
          { text: "Close your eyes", textUr: "آنکھیں بند کریں", correct: false },
          { text: "Turn around", textUr: "مڑ جائیں", correct: false },
        ],
      },
      {
        question: "Which is a way to greet someone?",
        questionUr: "کسی کو سلام کرنے کا کیا طریقہ ہے؟",
        options: [
          { text: "Ignore them", textUr: "ان کو نظرانداز کریں", correct: false },
          { text: "Push them", textUr: "دھکا دیں", correct: false },
          { text: "Wave and say Hi!", textUr: "ہاتھ ہلائیں اور ہائی کہیں!", correct: true },
          { text: "Walk away", textUr: "چلے جائیں", correct: false },
        ],
      },
    ],
  },
  {
    id: 2,
    category: "communication",
    title: "Asking for Help",
    titleUr: "مدد مانگنا",
    difficulty: "easy",
    duration: 6,
    gradient: "from-indigo-400 to-blue-500",
    emoji: "🙋",
    steps: [
      {
        title: "Recognize You Need Help",
        titleUr: "پہچانیں کہ آپ کو مدد چاہیے",
        content: "Sometimes things are hard. That's okay! Notice when you feel stuck or confused.",
        contentUr: "کبھی کبھی چیزیں مشکل ہوتی ہیں۔ یہ ٹھیک ہے! جب آپ پھنسا ہوا یا الجھن محسوس کریں تو پہچانیں۔",
        image: "🤔",
      },
      {
        title: "Find a Helper",
        titleUr: "مددگار تلاش کریں",
        content: "Look around for a teacher, parent, or friend who can help you. Walk to them calmly.",
        contentUr: "اپنے ارد گرد ایک استاد، والدین یا دوست تلاش کریں جو مدد کر سکے۔ پرسکون ہو کر ان کے پاس جائیں۔",
        image: "👨‍🏫",
      },
      {
        title: "Ask Politely",
        titleUr: "شائستگی سے پوچھیں",
        content: "Say 'Excuse me, can you help me please?' Use a calm and clear voice. You did it!",
        contentUr: "کہیں 'معاف کیجیے، کیا آپ میری مدد کر سکتے ہیں؟' پرسکون اور واضح آواز استعمال کریں۔ آپ نے کر لیا!",
        image: "🗣️",
      },
    ],
    quiz: [
      {
        question: "What should you do when you feel stuck?",
        questionUr: "جب آپ پھنسا ہوا محسوس کریں تو کیا کریں؟",
        options: [
          { text: "Cry loudly", textUr: "زور سے رویں", correct: false },
          { text: "Ask for help", textUr: "مدد مانگیں", correct: true },
          { text: "Give up", textUr: "ہار مان لیں", correct: false },
          { text: "Throw things", textUr: "چیزیں پھینکیں", correct: false },
        ],
      },
      {
        question: "How should you ask for help?",
        questionUr: "مدد کیسے مانگنی چاہیے؟",
        options: [
          { text: "Shout at someone", textUr: "کسی پر چلائیں", correct: false },
          { text: "Stay silent forever", textUr: "ہمیشہ خاموش رہیں", correct: false },
          { text: "Grab their arm", textUr: "ان کا بازو پکڑیں", correct: false },
          { text: "Say please help me", textUr: "براہ کرم مدد کریں کہیں", correct: true },
        ],
      },
    ],
  },
  // ── Social Skills ──
  {
    id: 3,
    category: "social",
    title: "Taking Turns",
    titleUr: "باری باری کھیلنا",
    difficulty: "medium",
    duration: 7,
    gradient: "from-green-400 to-emerald-500",
    emoji: "🔄",
    steps: [
      {
        title: "Wait for Your Turn",
        titleUr: "اپنی باری کا انتظار کریں",
        content: "When someone else is playing, wait patiently. You can count to 10 while you wait!",
        contentUr: "جب کوئی اور کھیل رہا ہو تو صبر سے انتظار کریں۔ انتظار کرتے ہوئے 10 تک گنیں!",
        image: "⏳",
      },
      {
        title: "Say 'My Turn!'",
        titleUr: "'میری باری!' کہیں",
        content: "When it's your turn, say 'My turn please!' Then play and have fun!",
        contentUr: "جب آپ کی باری ہو تو کہیں 'میری باری!' پھر کھیلیں اور مزے کریں!",
        image: "🙋",
      },
      {
        title: "Pass It Along",
        titleUr: "آگے دیں",
        content: "When your turn is done, give the toy or game to the next person. Say 'Your turn!'",
        contentUr: "جب آپ کی باری ختم ہو تو کھلونا یا کھیل اگلے شخص کو دیں۔ کہیں 'آپ کی باری!'",
        image: "🤝",
      },
    ],
    quiz: [
      {
        question: "What do you do when someone else is playing?",
        questionUr: "جب کوئی اور کھیل رہا ہو تو آپ کیا کریں؟",
        options: [
          { text: "Grab the toy", textUr: "کھلونا چھین لیں", correct: false },
          { text: "Wait patiently", textUr: "صبر سے انتظار کریں", correct: true },
          { text: "Start crying", textUr: "رونا شروع کریں", correct: false },
          { text: "Walk away angry", textUr: "غصے سے چلے جائیں", correct: false },
        ],
      },
      {
        question: "After your turn, what should you do?",
        questionUr: "اپنی باری کے بعد آپ کو کیا کرنا چاہیے؟",
        options: [
          { text: "Keep playing", textUr: "کھیلتے رہیں", correct: false },
          { text: "Hide the toy", textUr: "کھلونا چھپائیں", correct: false },
          { text: "Give it to the next person", textUr: "اگلے شخص کو دیں", correct: true },
          { text: "Break it", textUr: "توڑ دیں", correct: false },
        ],
      },
    ],
  },
  {
    id: 4,
    category: "social",
    title: "Sharing Toys",
    titleUr: "کھلونے بانٹنا",
    difficulty: "medium",
    duration: 6,
    gradient: "from-teal-400 to-green-500",
    emoji: "🧸",
    steps: [
      {
        title: "Notice a Friend Wants to Play",
        titleUr: "دیکھیں کہ دوست کھیلنا چاہتا ہے",
        content: "Look around! If a friend is watching you play, they might want a turn too.",
        contentUr: "ارد گرد دیکھیں! اگر کوئی دوست آپ کو کھیلتے دیکھ رہا ہے تو وہ بھی کھیلنا چاہتا ہے۔",
        image: "👀",
      },
      {
        title: "Offer to Share",
        titleUr: "بانٹنے کی پیشکش کریں",
        content: "Say 'Would you like to play with this?' Sharing makes everyone happy!",
        contentUr: "کہیں 'کیا آپ اس سے کھیلنا چاہیں گے؟' بانٹنے سے سب خوش ہوتے ہیں!",
        image: "🤲",
      },
      {
        title: "Play Together",
        titleUr: "مل کر کھیلیں",
        content: "Now you can both play! Playing together is more fun than playing alone.",
        contentUr: "اب آپ دونوں کھیل سکتے ہیں! ساتھ کھیلنا اکیلے کھیلنے سے زیادہ مزے کا ہے۔",
        image: "🎉",
      },
    ],
    quiz: [
      {
        question: "What should you do if a friend wants your toy?",
        questionUr: "اگر دوست آپ کا کھلونا چاہے تو کیا کریں؟",
        options: [
          { text: "Hide the toy", textUr: "کھلونا چھپائیں", correct: false },
          { text: "Offer to share", textUr: "بانٹنے کی پیشکش کریں", correct: true },
          { text: "Say go away", textUr: "دور جاؤ کہیں", correct: false },
          { text: "Throw the toy", textUr: "کھلونا پھینک دیں", correct: false },
        ],
      },
      {
        question: "Why is sharing good?",
        questionUr: "بانٹنا اچھا کیوں ہے؟",
        options: [
          { text: "It's not good", textUr: "یہ اچھا نہیں ہے", correct: false },
          { text: "It makes everyone happy", textUr: "اس سے سب خوش ہوتے ہیں", correct: true },
          { text: "You lose your toys", textUr: "آپ کے کھلونے ضائع ہوتے ہیں", correct: false },
          { text: "Friends go away", textUr: "دوست چلے جاتے ہیں", correct: false },
        ],
      },
    ],
  },
  // ── Emotions ──
  {
    id: 5,
    category: "emotions",
    title: "Identifying Happy",
    titleUr: "خوشی پہچاننا",
    difficulty: "easy",
    duration: 5,
    gradient: "from-yellow-400 to-orange-500",
    emoji: "😊",
    steps: [
      {
        title: "What Does Happy Look Like?",
        titleUr: "خوشی کیسی لگتی ہے؟",
        content: "When someone is happy, they smile! Their eyes get bright and they might laugh.",
        contentUr: "جب کوئی خوش ہوتا ہے تو وہ مسکراتا ہے! ان کی آنکھیں چمکتی ہیں اور وہ ہنس سکتے ہیں۔",
        image: "😊",
      },
      {
        title: "What Makes You Happy?",
        titleUr: "آپ کو کیا خوش کرتا ہے؟",
        content: "Think about things that make you happy. Maybe playing, eating ice cream, or hugs!",
        contentUr: "ان چیزوں کے بارے میں سوچیں جو آپ کو خوش کرتی ہیں۔ شاید کھیلنا، آئس کریم، یا گلے لگنا!",
        image: "🍦",
      },
      {
        title: "Spread Happiness!",
        titleUr: "خوشی بانٹیں!",
        content: "You can make others happy too! Smile at someone, share a toy, or say something nice.",
        contentUr: "آپ دوسروں کو بھی خوش کر سکتے ہیں! کسی کو مسکراہٹ دیں، کھلونا بانٹیں، یا اچھی بات کہیں۔",
        image: "🌟",
      },
    ],
    quiz: [
      {
        question: "How does a happy person look?",
        questionUr: "خوش شخص کیسا لگتا ہے؟",
        options: [
          { text: "They frown", textUr: "تیوری چڑھاتے ہیں", correct: false },
          { text: "They smile", textUr: "مسکراتے ہیں", correct: true },
          { text: "They cry", textUr: "روتے ہیں", correct: false },
          { text: "They yell", textUr: "چلاتے ہیں", correct: false },
        ],
      },
      {
        question: "How can you make someone happy?",
        questionUr: "آپ کسی کو کیسے خوش کر سکتے ہیں؟",
        options: [
          { text: "Ignore them", textUr: "نظرانداز کریں", correct: false },
          { text: "Take their things", textUr: "ان کی چیزیں لے لیں", correct: false },
          { text: "Smile and be kind", textUr: "مسکرائیں اور مہربان بنیں", correct: true },
          { text: "Be mean", textUr: "برا سلوک کریں", correct: false },
        ],
      },
    ],
  },
  {
    id: 6,
    category: "emotions",
    title: "Dealing with Anger",
    titleUr: "غصے سے نمٹنا",
    difficulty: "hard",
    duration: 8,
    gradient: "from-red-400 to-pink-500",
    emoji: "😤",
    steps: [
      {
        title: "Notice You Are Angry",
        titleUr: "پہچانیں کہ آپ غصے میں ہیں",
        content: "Your face feels hot, your hands make fists, and your tummy feels tight. That means you might be angry.",
        contentUr: "آپ کا چہرہ گرم لگتا ہے، آپ کے ہاتھ مٹھی بنتے ہیں اور پیٹ تنگ لگتا ہے۔ اس کا مطلب ہے آپ غصے میں ہو سکتے ہیں۔",
        image: "😠",
      },
      {
        title: "Take Deep Breaths",
        titleUr: "گہری سانسیں لیں",
        content: "Breathe in slowly... 1, 2, 3. Now breathe out... 1, 2, 3. Do this 5 times!",
        contentUr: "آہستہ آہستہ سانس لیں... 1، 2، 3۔ اب سانس چھوڑیں... 1، 2، 3۔ یہ 5 بار کریں!",
        image: "🌬️",
      },
      {
        title: "Use Your Words",
        titleUr: "الفاظ استعمال کریں",
        content: "Say 'I feel angry because...' Tell someone how you feel. You can also squeeze a pillow or draw!",
        contentUr: "کہیں 'مجھے غصہ آ رہا ہے کیونکہ...' کسی کو بتائیں آپ کیسا محسوس کر رہے ہیں۔ آپ تکیہ بھی دبا سکتے ہیں!",
        image: "💬",
      },
    ],
    quiz: [
      {
        question: "What can you do when you feel angry?",
        questionUr: "جب غصہ آئے تو کیا کر سکتے ہیں؟",
        options: [
          { text: "Hit someone", textUr: "کسی کو ماریں", correct: false },
          { text: "Break things", textUr: "چیزیں توڑیں", correct: false },
          { text: "Take deep breaths", textUr: "گہری سانسیں لیں", correct: true },
          { text: "Scream loudly", textUr: "زور سے چیخیں", correct: false },
        ],
      },
      {
        question: "How do you know you are angry?",
        questionUr: "آپ کو کیسے پتا چلے کہ غصے میں ہیں؟",
        options: [
          { text: "You feel sleepy", textUr: "نیند آتی ہے", correct: false },
          { text: "You feel hungry", textUr: "بھوک لگتی ہے", correct: false },
          { text: "Your face feels hot and hands make fists", textUr: "چہرہ گرم لگے اور ہاتھ مٹھی بنیں", correct: true },
          { text: "You feel happy", textUr: "خوشی محسوس ہو", correct: false },
        ],
      },
    ],
  },
];

// ─── Difficulty Badge ──────────────────────────────────────────────────────────

function DifficultyBadge({ difficulty, isUrdu }) {
  const info = DIFFICULTY_MAP[difficulty];
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-bold ${info.color}`}>
      {isUrdu ? info.labelUr : info.label}
    </span>
  );
}

// ─── Lesson Card ───────────────────────────────────────────────────────────────

function LessonCard({ lesson, isUrdu, onClick }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-shadow duration-300">
        {/* Gradient header */}
        <div className={`bg-gradient-to-br ${lesson.gradient} p-6 text-white relative overflow-hidden`}>
          <div className="absolute -top-4 -right-4 text-7xl opacity-20 select-none">
            {lesson.emoji}
          </div>
          <span className="text-5xl mb-3 block">{lesson.emoji}</span>
          <h3 className="text-xl font-extrabold leading-tight">
            {isUrdu ? lesson.titleUr : lesson.title}
          </h3>
        </div>
        {/* Footer info */}
        <div className="p-4 flex items-center justify-between bg-white">
          <DifficultyBadge difficulty={lesson.difficulty} isUrdu={isUrdu} />
          <span className="flex items-center gap-1 text-gray-500 font-semibold text-sm">
            <FaClock className="text-gray-400" />
            {lesson.duration} {isUrdu ? "منٹ" : "min"}
          </span>
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Step View ─────────────────────────────────────────────────────────────────

function StepView({ step, stepIndex, totalSteps, isUrdu, onNext, onPrev, t }) {
  return (
    <motion.div
      key={stepIndex}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl mx-auto"
    >
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-3 mb-6">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-3 rounded-full transition-all duration-300 ${
              i === stepIndex ? "w-10 bg-indigo-500" : i < stepIndex ? "w-3 bg-indigo-300" : "w-3 bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Step number */}
      <p className="text-center text-indigo-400 font-bold text-sm mb-2 uppercase tracking-wider">
        {t('lessons.stepOf').replace('{current}', stepIndex + 1).replace('{total}', totalSteps)}
      </p>

      {/* Emoji illustration */}
      <div className="text-center text-8xl my-6 select-none">{step.image}</div>

      {/* Title */}
      <h3 className="text-2xl font-extrabold text-gray-800 text-center mb-4">
        {isUrdu ? step.titleUr : step.title}
      </h3>

      {/* Content */}
      <p
        className="text-lg text-gray-600 text-center leading-relaxed mb-8 max-w-md mx-auto"
        dir={isUrdu ? "rtl" : "ltr"}
      >
        {isUrdu ? step.contentUr : step.content}
      </p>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          onClick={onPrev}
          disabled={stepIndex === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-lg transition-all ${
            stepIndex === 0
              ? "opacity-30 cursor-not-allowed bg-gray-200 text-gray-400"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <FaArrowLeft /> {t('lessons.back')}
        </Button>

        <Button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg transition-all"
        >
          {stepIndex === totalSteps - 1 ? t('lessons.startQuiz') : t('common.next')}{" "}
          <FaArrowRight />
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Quiz View ─────────────────────────────────────────────────────────────────

function QuizView({ quiz, quizIndex, totalQuiz, isUrdu, onAnswer, selectedAnswer, isCorrect, t }) {
  const question = quiz[quizIndex];

  return (
    <motion.div
      key={`quiz-${quizIndex}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl mx-auto"
    >
      {/* Quiz progress */}
      <div className="flex items-center justify-center gap-3 mb-4">
        {Array.from({ length: totalQuiz }).map((_, i) => (
          <div
            key={i}
            className={`h-3 rounded-full transition-all duration-300 ${
              i === quizIndex ? "w-10 bg-orange-500" : i < quizIndex ? "w-3 bg-orange-300" : "w-3 bg-gray-200"
            }`}
          />
        ))}
      </div>

      <p className="text-center text-orange-400 font-bold text-sm mb-2 uppercase tracking-wider">
        {t('lessons.questionOf').replace('{current}', quizIndex + 1).replace('{total}', totalQuiz)}
      </p>

      {/* Star decoration */}
      <div className="text-center text-5xl my-4 select-none">❓</div>

      {/* Question */}
      <h3
        className="text-xl font-extrabold text-gray-800 text-center mb-8"
        dir={isUrdu ? "rtl" : "ltr"}
      >
        {isUrdu ? question.questionUr : question.question}
      </h3>

      {/* Options grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === idx;
          const showCorrect = isSelected && isCorrect === true;
          const showWrong = isSelected && isCorrect === false;

          return (
            <motion.button
              key={idx}
              onClick={() => onAnswer(idx, option.correct)}
              disabled={isCorrect === true}
              whileHover={isCorrect !== true ? { scale: 1.03 } : {}}
              whileTap={isCorrect !== true ? { scale: 0.96 } : {}}
              animate={
                showWrong
                  ? { x: [0, -12, 12, -8, 8, -4, 4, 0] }
                  : showCorrect
                  ? { scale: [1, 1.1, 1] }
                  : {}
              }
              transition={{ duration: 0.5 }}
              className={`p-5 rounded-2xl text-left font-bold text-lg border-3 transition-all duration-300 ${
                showCorrect
                  ? "bg-green-100 border-green-500 text-green-800 shadow-lg shadow-green-200"
                  : showWrong
                  ? "bg-red-100 border-red-400 text-red-700"
                  : "bg-gray-50 border-gray-200 text-gray-700 hover:border-indigo-400 hover:bg-indigo-50"
              }`}
              dir={isUrdu ? "rtl" : "ltr"}
            >
              <span className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-sm font-extrabold text-gray-500 flex-shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{isUrdu ? option.textUr : option.text}</span>
                {showCorrect && <FaCheckCircle className="text-green-500 ml-auto text-2xl" />}
                {showWrong && <FaTimes className="text-red-400 ml-auto text-2xl" />}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Feedback messages */}
      <AnimatePresence>
        {isCorrect === true && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <p className="text-2xl font-extrabold text-green-600">
              🎉 {t('lessons.lessonCorrect')}
            </p>
          </motion.div>
        )}
        {isCorrect === false && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <p className="text-xl font-bold text-orange-500">
              {t('lessons.tryAgain')} 💪
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Completion Screen ─────────────────────────────────────────────────────────

function CompletionScreen({ lesson, isUrdu, onBack, t }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg mx-auto text-center"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: 1 }}
        className="text-8xl mb-6"
      >
        <FaTrophy className="text-yellow-400 mx-auto" />
      </motion.div>

      <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
        {t('lessons.congratulations')}
      </h2>
      <p className="text-lg text-gray-500 mb-2">
        {t('lessons.youCompleted').replace('{title}', isUrdu ? lesson.titleUr : lesson.title)}
      </p>

      <div className="flex items-center justify-center gap-2 my-6">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.2 }}
          >
            <FaStar className="text-yellow-400 text-4xl" />
          </motion.div>
        ))}
      </div>

      <p className="text-gray-400 mb-8">
        {t('lessons.amazingLearner')}
      </p>

      <Button
        onClick={onBack}
        className="px-8 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg transition-all"
      >
        {t('lessons.moreLessons')}
      </Button>
    </motion.div>
  );
}

// ─── Main Lessons Component ────────────────────────────────────────────────────

export default function Lessons() {
  const { t, isUrdu } = useTranslation();

  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [phase, setPhase] = useState("browse"); // browse | steps | quiz | complete
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showReward, setShowReward] = useState(false);

  const filteredLessons =
    activeCategory === "all"
      ? LESSONS
      : LESSONS.filter((l) => l.category === activeCategory);

  const openLesson = useCallback((lesson) => {
    setSelectedLesson(lesson);
    setPhase("steps");
    setCurrentStep(0);
    setCurrentQuiz(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, []);

  const goBack = useCallback(() => {
    setSelectedLesson(null);
    setPhase("browse");
    setCurrentStep(0);
    setCurrentQuiz(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, []);

  const handleStepNext = useCallback(() => {
    if (selectedLesson && currentStep < selectedLesson.steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      // Move to quiz
      setPhase("quiz");
      setCurrentQuiz(0);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  }, [selectedLesson, currentStep]);

  const handleStepPrev = useCallback(() => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }, [currentStep]);

  const handleQuizAnswer = useCallback(
    (answerIdx, correct) => {
      if (isCorrect === true) return; // already answered correctly

      setSelectedAnswer(answerIdx);
      setIsCorrect(correct);

      if (correct) {
        // After a short delay, advance
        setTimeout(() => {
          if (selectedLesson && currentQuiz < selectedLesson.quiz.length - 1) {
            setCurrentQuiz((q) => q + 1);
            setSelectedAnswer(null);
            setIsCorrect(null);
          } else {
            // Lesson complete!
            setPhase("complete");
            setShowReward(true);
            setTimeout(() => setShowReward(false), 3500);
          }
        }, 1200);
      } else {
        // Reset after shake so they can try again
        setTimeout(() => {
          setSelectedAnswer(null);
          setIsCorrect(null);
        }, 900);
      }
    },
    [isCorrect, selectedLesson, currentQuiz]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50 pb-12">
      {/* Reward overlay */}
      {showReward && <RewardAnimation />}

      {/* Header */}
      <div className="pt-8 pb-4 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        >
          {t('lessons.title')}
        </motion.h1>
        <p className="text-gray-500 mt-2 text-lg max-w-md mx-auto" dir={isUrdu ? 'rtl' : 'ltr'}>
          {t('lessons.letLearn')}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* ── Browse Phase ── */}
        {phase === "browse" && (
          <motion.div
            key="browse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Category Tabs */}
            <div className="px-4 mb-8">
              <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCategory === cat.id;
                  return (
                    <motion.button
                      key={cat.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-base transition-all duration-300 ${
                        isActive
                          ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                          : "bg-white text-gray-600 shadow-md hover:shadow-lg border border-gray-100"
                      }`}
                    >
                      <Icon className="text-lg" />
                      <span>{isUrdu ? cat.labelUr : cat.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Lesson Grid */}
            <div className="px-4 max-w-6xl mx-auto">
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredLessons.map((lesson) => (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      isUrdu={isUrdu}
                      onClick={() => openLesson(lesson)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>

              {filteredLessons.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-2xl text-gray-300 font-bold">
                    {t('lessons.noLessonsFound')}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Steps Phase ── */}
        {phase === "steps" && selectedLesson && (
          <motion.div
            key="steps"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4"
          >
            {/* Back button */}
            <div className="max-w-2xl mx-auto mb-6">
              <Button
                onClick={goBack}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white shadow text-gray-600 font-bold hover:bg-gray-50 transition-all"
              >
                <FaArrowLeft /> {t('lessons.back')}
              </Button>
            </div>

            {/* Lesson title */}
            <div className="text-center mb-6">
              <span className="text-5xl">{selectedLesson.emoji}</span>
              <h2 className="text-2xl font-extrabold text-gray-800 mt-2">
                {isUrdu ? selectedLesson.titleUr : selectedLesson.title}
              </h2>
            </div>

            <AnimatePresence mode="wait">
              <StepView
                key={currentStep}
                step={selectedLesson.steps[currentStep]}
                stepIndex={currentStep}
                totalSteps={selectedLesson.steps.length}
                isUrdu={isUrdu}
                onNext={handleStepNext}
                onPrev={handleStepPrev}
                t={t}
              />
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Quiz Phase ── */}
        {phase === "quiz" && selectedLesson && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4"
          >
            {/* Back button */}
            <div className="max-w-2xl mx-auto mb-6">
              <Button
                onClick={goBack}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white shadow text-gray-600 font-bold hover:bg-gray-50 transition-all"
              >
                <FaArrowLeft /> {t('lessons.back')}
              </Button>
            </div>

            {/* Quiz header */}
            <div className="text-center mb-6">
              <span className="text-5xl">🧠</span>
              <h2 className="text-2xl font-extrabold text-gray-800 mt-2">
                {t('lessons.quizTime')}
              </h2>
              <p className="text-gray-400 mt-1">
                {t('lessons.letsSeeLearned')}
              </p>
            </div>

            <AnimatePresence mode="wait">
              <QuizView
                key={currentQuiz}
                quiz={selectedLesson.quiz}
                quizIndex={currentQuiz}
                totalQuiz={selectedLesson.quiz.length}
                isUrdu={isUrdu}
                onAnswer={handleQuizAnswer}
                selectedAnswer={selectedAnswer}
                isCorrect={isCorrect}
                t={t}
              />
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Completion Phase ── */}
        {phase === "complete" && selectedLesson && (
          <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 pt-8"
          >
            <CompletionScreen lesson={selectedLesson} isUrdu={isUrdu} onBack={goBack} t={t} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
