import React from 'react';
import { motion } from 'framer-motion';

const pastelColors = [
  'bg-pink-400',
  'bg-purple-400',
  'bg-cyan-400',
  'bg-amber-400',
  'bg-emerald-400',
];

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const dotVariants = {
  initial: { y: 0 },
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatDelay: 0.4,
      ease: 'easeInOut',
    },
  },
};

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      <motion.div
        className="flex items-center gap-3"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {pastelColors.map((color, i) => (
          <motion.div
            key={i}
            variants={dotVariants}
            className={`w-5 h-5 rounded-full ${color} shadow-md`}
          />
        ))}
      </motion.div>

      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="text-lg font-semibold text-purple-500"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}
