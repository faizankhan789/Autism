import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const confettiColors = [
  '#f472b6', '#a78bfa', '#60a5fa', '#34d399',
  '#fbbf24', '#fb923c', '#f87171', '#38bdf8',
  '#a3e635', '#e879f9',
];

function ConfettiPiece({ color, delay, startX, startY }) {
  const endX = startX + (Math.random() - 0.5) * 300;
  const endY = startY + Math.random() * 200 + 100;
  const rotation = Math.random() * 720 - 360;
  const size = Math.random() * 10 + 6;

  return (
    <motion.div
      initial={{ x: startX, y: startY, opacity: 1, scale: 0, rotate: 0 }}
      animate={{
        x: endX,
        y: endY,
        opacity: 0,
        scale: [0, 1.5, 1, 0.5],
        rotate: rotation,
      }}
      transition={{ duration: 1.5, delay, ease: 'easeOut' }}
      style={{ backgroundColor: color, width: size, height: size }}
      className="absolute rounded-full"
    />
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
    </svg>
  );
}

function BadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
    </svg>
  );
}

const typeConfig = {
  star: { Icon: StarIcon, color: 'text-yellow-400', label: 'Star' },
  badge: { Icon: BadgeIcon, color: 'text-emerald-400', label: 'Badge' },
  trophy: { Icon: TrophyIcon, color: 'text-amber-500', label: 'Trophy' },
};

export default function RewardAnimation({
  type = 'star',
  show = false,
  onComplete,
}) {
  const [confetti, setConfetti] = useState([]);
  const config = typeConfig[type] || typeConfig.star;

  useEffect(() => {
    if (show) {
      const pieces = Array.from({ length: 24 }, (_, i) => ({
        id: i,
        color: confettiColors[i % confettiColors.length],
        delay: Math.random() * 0.4,
        startX: 0,
        startY: 0,
      }));
      setConfetti(pieces);

      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setConfetti([]);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          {/* Backdrop glow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black"
          />

          {/* Confetti */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            {confetti.map((piece) => (
              <ConfettiPiece
                key={piece.id}
                color={piece.color}
                delay={piece.delay}
                startX={piece.startX}
                startY={piece.startY}
              />
            ))}
          </div>

          {/* Main reward icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{
              scale: [0, 1.3, 1],
              rotate: [-180, 20, 0],
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: 0.8,
              ease: 'easeOut',
            }}
            className={`relative z-10 w-32 h-32 ${config.color} drop-shadow-2xl`}
          >
            <config.Icon />

            {/* Pulsing ring */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{
                scale: [0.8, 1.6, 2],
                opacity: [0.8, 0.3, 0],
              }}
              transition={{
                duration: 1.2,
                repeat: 2,
                ease: 'easeOut',
              }}
              className="absolute inset-0 rounded-full border-4 border-yellow-300"
            />
          </motion.div>

          {/* Celebration text */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute bottom-1/3 text-3xl font-extrabold text-white drop-shadow-lg"
          >
            Great Job!
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
