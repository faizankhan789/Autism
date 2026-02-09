import React from 'react';
import { motion } from 'framer-motion';

const sizeMap = {
  sm: { width: 80, height: 80 },
  md: { width: 140, height: 140 },
  lg: { width: 200, height: 200 },
};

const moodConfig = {
  happy: {
    eyeShape: 'happy',
    mouthCurve: 12,
    bodyColor: '#a78bfa',
    cheekOpacity: 0.6,
  },
  thinking: {
    eyeShape: 'thinking',
    mouthCurve: 4,
    bodyColor: '#60a5fa',
    cheekOpacity: 0.3,
  },
  excited: {
    eyeShape: 'excited',
    mouthCurve: 16,
    bodyColor: '#f472b6',
    cheekOpacity: 0.8,
  },
  waving: {
    eyeShape: 'happy',
    mouthCurve: 10,
    bodyColor: '#34d399',
    cheekOpacity: 0.5,
  },
};

function Eyes({ mood, isSpeaking }) {
  const blinkVariants = {
    open: { scaleY: 1 },
    blink: {
      scaleY: [1, 0.1, 1],
      transition: {
        duration: 0.3,
        repeat: Infinity,
        repeatDelay: 3,
      },
    },
  };

  if (mood === 'thinking') {
    return (
      <>
        {/* Left eye - looking up */}
        <motion.ellipse
          cx="38"
          cy="42"
          rx="7"
          ry="8"
          fill="white"
          stroke="#334155"
          strokeWidth="1.5"
        />
        <motion.circle cx="36" cy="39" r="3.5" fill="#334155" />
        <circle cx="34" cy="37" r="1.2" fill="white" />

        {/* Right eye - looking up */}
        <motion.ellipse
          cx="62"
          cy="42"
          rx="7"
          ry="8"
          fill="white"
          stroke="#334155"
          strokeWidth="1.5"
        />
        <motion.circle cx="60" cy="39" r="3.5" fill="#334155" />
        <circle cx="58" cy="37" r="1.2" fill="white" />
      </>
    );
  }

  if (mood === 'excited') {
    return (
      <>
        {/* Left eye - big sparkly */}
        <motion.ellipse
          cx="38"
          cy="42"
          rx="8"
          ry="9"
          fill="white"
          stroke="#334155"
          strokeWidth="1.5"
          variants={blinkVariants}
          initial="open"
          animate="blink"
        />
        <motion.circle
          cx="38"
          cy="42"
          r="4.5"
          fill="#334155"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
        <circle cx="36" cy="39" r="1.8" fill="white" />
        <circle cx="40" cy="41" r="0.8" fill="white" />

        {/* Right eye - big sparkly */}
        <motion.ellipse
          cx="62"
          cy="42"
          rx="8"
          ry="9"
          fill="white"
          stroke="#334155"
          strokeWidth="1.5"
          variants={blinkVariants}
          initial="open"
          animate="blink"
        />
        <motion.circle
          cx="62"
          cy="42"
          r="4.5"
          fill="#334155"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0.1 }}
        />
        <circle cx="60" cy="39" r="1.8" fill="white" />
        <circle cx="64" cy="41" r="0.8" fill="white" />
      </>
    );
  }

  // Default / happy / waving eyes
  return (
    <>
      {/* Left eye */}
      <motion.ellipse
        cx="38"
        cy="42"
        rx="7"
        ry="8"
        fill="white"
        stroke="#334155"
        strokeWidth="1.5"
        variants={blinkVariants}
        initial="open"
        animate="blink"
      />
      <motion.circle cx="38" cy="42" r="3.5" fill="#334155" />
      <circle cx="36" cy="40" r="1.5" fill="white" />

      {/* Right eye */}
      <motion.ellipse
        cx="62"
        cy="42"
        rx="7"
        ry="8"
        fill="white"
        stroke="#334155"
        strokeWidth="1.5"
        variants={blinkVariants}
        initial="open"
        animate="blink"
      />
      <motion.circle cx="62" cy="42" r="3.5" fill="#334155" />
      <circle cx="60" cy="40" r="1.5" fill="white" />
    </>
  );
}

function Mouth({ mood, isSpeaking }) {
  const config = moodConfig[mood] || moodConfig.happy;

  if (isSpeaking) {
    return (
      <motion.ellipse
        cx="50"
        cy="62"
        rx="8"
        fill="#334155"
        animate={{ ry: [3, 6, 3, 5, 3] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    );
  }

  return (
    <motion.path
      d={`M 40 60 Q 50 ${60 + config.mouthCurve} 60 60`}
      fill="none"
      stroke="#334155"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  );
}

function WavingArm() {
  return (
    <motion.g
      animate={{ rotate: [0, -20, 20, -20, 0] }}
      transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.5 }}
      style={{ originX: '80px', originY: '70px' }}
    >
      <ellipse cx="85" cy="60" rx="6" ry="12" fill="#c4b5fd" stroke="#a78bfa" strokeWidth="1.5" />
      {/* Little hand */}
      <circle cx="85" cy="48" r="5" fill="#fcd34d" />
    </motion.g>
  );
}

export default function Avatar({
  isSpeaking = false,
  mood = 'happy',
  size = 'md',
}) {
  const { width, height } = sizeMap[size] || sizeMap.md;
  const config = moodConfig[mood] || moodConfig.happy;

  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width, height }}
      className="select-none"
    >
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Body / Head - big friendly circle */}
        <motion.circle
          cx="50"
          cy="55"
          r="35"
          fill={config.bodyColor}
          stroke="#e2e8f0"
          strokeWidth="2"
          animate={
            mood === 'excited'
              ? { scale: [1, 1.03, 1] }
              : {}
          }
          transition={{ duration: 0.6, repeat: Infinity }}
        />

        {/* Inner face area */}
        <circle cx="50" cy="52" r="28" fill="#fef3c7" />

        {/* Rosy cheeks */}
        <circle cx="32" cy="54" r="5" fill="#fda4af" opacity={config.cheekOpacity} />
        <circle cx="68" cy="54" r="5" fill="#fda4af" opacity={config.cheekOpacity} />

        {/* Eyes */}
        <Eyes mood={mood} isSpeaking={isSpeaking} />

        {/* Eyebrows */}
        {mood === 'thinking' ? (
          <>
            <motion.line
              x1="31" y1="32" x2="44" y2="30"
              stroke="#334155" strokeWidth="2" strokeLinecap="round"
              animate={{ y1: [32, 30, 32] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <line x1="56" y1="30" x2="69" y2="32" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
          </>
        ) : (
          <>
            <line x1="31" y1="33" x2="44" y2="31" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            <line x1="56" y1="31" x2="69" y2="33" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
          </>
        )}

        {/* Mouth */}
        <Mouth mood={mood} isSpeaking={isSpeaking} />

        {/* Antenna / hair tuft */}
        <motion.g
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '50px 20px' }}
        >
          <line x1="50" y1="22" x2="50" y2="12" stroke={config.bodyColor} strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="10" r="4" fill="#fbbf24" />
        </motion.g>

        {/* Waving arm */}
        {mood === 'waving' && <WavingArm />}

        {/* Speaking indicator - small sound waves */}
        {isSpeaking && (
          <>
            <motion.path
              d="M 72 58 Q 78 55 72 52"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="1.5"
              strokeLinecap="round"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            <motion.path
              d="M 76 60 Q 84 55 76 50"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="1.5"
              strokeLinecap="round"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
            />
          </>
        )}
      </svg>
    </motion.div>
  );
}
