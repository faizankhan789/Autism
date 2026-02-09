import React from 'react';
import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  onClick,
  hoverable = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={
        hoverable
          ? { y: -6, boxShadow: '0 20px 40px rgba(168, 85, 247, 0.15)' }
          : {}
      }
      onClick={onClick}
      className={`
        bg-white rounded-3xl shadow-lg
        p-6
        ${hoverable ? 'cursor-pointer transition-shadow duration-300' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
