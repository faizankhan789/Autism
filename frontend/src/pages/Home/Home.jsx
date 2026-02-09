import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBook, FaGamepad, FaBookOpen, FaChartBar, FaStar, FaHeart, FaCloud } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useSensory } from '../../context/SensoryContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

/* ---------- Lazy-safe Avatar import ---------- */
let AvatarWithSpeech = null;
try {
  AvatarWithSpeech = require('../../components/Avatar/AvatarWithSpeech').default;
} catch {
  AvatarWithSpeech = null;
}

/* ============================================================
   Animated floating decorative elements
   ============================================================ */
const FLOATING_SHAPES = [
  { id: 1, icon: FaStar, color: 'text-yellow-300', size: 'text-2xl', x: '10%', y: '15%', duration: 6 },
  { id: 2, icon: FaStar, color: 'text-pink-300', size: 'text-xl', x: '85%', y: '10%', duration: 7 },
  { id: 3, icon: FaHeart, color: 'text-red-300', size: 'text-lg', x: '75%', y: '70%', duration: 5 },
  { id: 4, icon: FaCloud, color: 'text-white/40', size: 'text-4xl', x: '20%', y: '60%', duration: 9 },
  { id: 5, icon: FaStar, color: 'text-amber-200', size: 'text-sm', x: '50%', y: '20%', duration: 8 },
  { id: 6, icon: FaHeart, color: 'text-pink-200', size: 'text-xl', x: '30%', y: '80%', duration: 6.5 },
  { id: 7, icon: FaCloud, color: 'text-blue-200/50', size: 'text-3xl', x: '65%', y: '35%', duration: 10 },
  { id: 8, icon: FaStar, color: 'text-purple-200', size: 'text-lg', x: '90%', y: '55%', duration: 7.5 },
];

function FloatingShape({ icon: Icon, color, size, x, y, duration }) {
  return (
    <motion.div
      className={`absolute pointer-events-none ${color} ${size} opacity-60`}
      style={{ left: x, top: y }}
      animate={{
        y: [0, -18, 0, 12, 0],
        x: [0, 10, -8, 6, 0],
        rotate: [0, 15, -10, 5, 0],
      }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Icon />
    </motion.div>
  );
}

/* ============================================================
   Floating circle decorations in the hero
   ============================================================ */
function FloatingCircle({ size, color, x, y, duration }) {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${color}`}
      style={{ width: size, height: size, left: x, top: y }}
      animate={{ y: [0, -20, 0], scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* ============================================================
   Navigation card data
   ============================================================ */
const NAV_CARDS = [
  {
    to: '/lessons',
    icon: FaBook,
    titleEn: 'Lessons',
    titleUr: 'اسباق',
    description: 'Fun learning activities to build new skills!',
    gradient: 'from-purple-400 to-purple-600',
    bgLight: 'bg-purple-50',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-500',
    shadow: 'hover:shadow-purple-200',
  },
  {
    to: '/games',
    icon: FaGamepad,
    titleEn: 'Games',
    titleUr: 'کھیل',
    description: 'Play exciting games while you learn!',
    gradient: 'from-pink-400 to-rose-500',
    bgLight: 'bg-pink-50',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-500',
    shadow: 'hover:shadow-pink-200',
  },
  {
    to: '/stories',
    icon: FaBookOpen,
    titleEn: 'Stories',
    titleUr: 'کہانیاں',
    description: 'Listen to wonderful tales and adventures!',
    gradient: 'from-emerald-400 to-green-500',
    bgLight: 'bg-emerald-50',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-500',
    shadow: 'hover:shadow-emerald-200',
  },
  {
    to: '/dashboard',
    icon: FaChartBar,
    titleEn: 'Dashboard',
    titleUr: 'ڈیش بورڈ',
    description: 'See how much you have learned!',
    gradient: 'from-cyan-400 to-blue-500',
    bgLight: 'bg-cyan-50',
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-500',
    shadow: 'hover:shadow-cyan-200',
  },
];

/* ============================================================
   Stagger animation variants
   ============================================================ */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20 },
  },
};

/* ============================================================
   Home Component
   ============================================================ */
export default function Home() {
  const { isAuthenticated } = useAuth();
  const { animationDuration } = useSensory();

  /* Memoised hero circles so they don't remount on re-render */
  const heroCircles = useMemo(
    () => [
      { size: 120, color: 'bg-white/10', x: '8%', y: '20%', duration: 6 },
      { size: 80, color: 'bg-pink-300/20', x: '78%', y: '15%', duration: 7 },
      { size: 60, color: 'bg-blue-300/15', x: '60%', y: '65%', duration: 5 },
      { size: 100, color: 'bg-purple-300/15', x: '25%', y: '70%', duration: 8 },
      { size: 50, color: 'bg-yellow-200/20', x: '45%', y: '10%', duration: 9 },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50 overflow-hidden relative">
      {/* ---------- Global floating decorations ---------- */}
      {FLOATING_SHAPES.map((s) => (
        <FloatingShape key={s.id} {...s} />
      ))}

      {/* ========================================
          HERO SECTION
          ======================================== */}
      <section className="relative overflow-hidden">
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500"
          animate={{
            background: [
              'linear-gradient(135deg, #8b5cf6, #ec4899, #3b82f6)',
              'linear-gradient(135deg, #a78bfa, #f472b6, #60a5fa)',
              'linear-gradient(135deg, #7c3aed, #db2777, #2563eb)',
              'linear-gradient(135deg, #8b5cf6, #ec4899, #3b82f6)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Floating circles */}
        {heroCircles.map((c, i) => (
          <FloatingCircle key={i} {...c} />
        ))}

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4 py-16 md:py-24 text-center">
          {/* Avatar Section */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="mb-8"
          >
            {AvatarWithSpeech ? (
              <AvatarWithSpeech
                message="Hello! I'm your learning buddy! Let's learn and play together!"
                urduMessage="ہیلو! میں آپ کا سیکھنے کا ساتھی ہوں! آئیے مل کر سیکھتے اور کھیلتے ہیں!"
              />
            ) : (
              /* Fallback avatar if the component hasn't been created yet */
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/40 flex items-center justify-center shadow-2xl">
                <motion.span
                  className="text-6xl md:text-7xl"
                  animate={{ rotate: [0, 14, -14, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  🤗
                </motion.span>
              </div>
            )}
          </motion.div>

          {/* Greeting */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: animationDuration }}
            className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-3 leading-tight"
          >
            Hello! I&apos;m your learning buddy!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: animationDuration }}
            className="text-xl md:text-2xl text-white/90 font-medium mb-2"
          >
            Let&apos;s learn and play together!
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: animationDuration }}
            className="text-lg md:text-xl text-white/80 font-urdu mb-8"
            dir="rtl"
          >
            ہیلو! میں آپ کا سیکھنے کا ساتھی ہوں! آئیے مل کر سیکھتے اور کھیلتے ہیں!
          </motion.p>

          {/* Get Started button (only if not logged in) */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, type: 'spring', stiffness: 300, damping: 18 }}
            >
              <Link to="/login">
                <Button variant="secondary" size="lg" className="text-lg px-10 py-4 shadow-xl">
                  Get Started
                </Button>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0,64 C360,120 1080,0 1440,64 L1440,120 L0,120 Z"
              fill="currentColor"
              className="text-purple-50"
            />
          </svg>
        </div>
      </section>

      {/* ========================================
          NAVIGATION CARDS
          ======================================== */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 py-12 md:py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: animationDuration }}
          className="text-2xl md:text-4xl font-extrabold text-center text-purple-700 mb-4"
        >
          What would you like to do today?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: animationDuration }}
          className="text-center text-purple-400 text-base md:text-lg mb-12 font-urdu"
          dir="rtl"
        >
          آج آپ کیا کرنا چاہیں گے؟
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {NAV_CARDS.map((card) => (
            <motion.div key={card.to} variants={cardVariants}>
              <Link to={card.to} className="block h-full">
                <Card
                  hoverable
                  className={`h-full text-center ${card.bgLight} border-2 border-transparent hover:border-purple-200 ${card.shadow} transition-all duration-300`}
                >
                  {/* Icon circle */}
                  <div className={`mx-auto mb-5 w-20 h-20 rounded-full ${card.iconBg} flex items-center justify-center shadow-md`}>
                    <card.icon className={`text-3xl ${card.iconColor}`} />
                  </div>

                  {/* English title */}
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
                    {card.titleEn}
                  </h3>

                  {/* Urdu title */}
                  <p className="text-sm text-gray-500 font-urdu mb-3" dir="rtl">
                    {card.titleUr}
                  </p>

                  {/* Description */}
                  <p className="text-sm md:text-base text-gray-500 leading-relaxed">
                    {card.description}
                  </p>

                  {/* Coloured accent bar at bottom */}
                  <div className={`mt-5 mx-auto w-16 h-1.5 rounded-full bg-gradient-to-r ${card.gradient}`} />
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ========================================
          BOTTOM MOTIVATIONAL SECTION
          ======================================== */}
      <section className="relative z-10 pb-16 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: animationDuration }}
          className="max-w-2xl mx-auto bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-purple-100"
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-4xl mb-4 inline-block"
          >
            <FaStar className="text-yellow-400" />
          </motion.div>
          <h3 className="text-xl md:text-2xl font-bold text-purple-700 mb-2">
            You are amazing!
          </h3>
          <p className="text-gray-500 mb-1">
            Every step you take is a step towards something wonderful.
          </p>
          <p className="text-gray-400 font-urdu text-sm" dir="rtl">
            آپ بہت شاندار ہیں! آپ کا ہر قدم کامیابی کی طرف ہے۔
          </p>
        </motion.div>
      </section>
    </div>
  );
}
