import React from 'react';
import { motion } from 'framer-motion';

const variantStyles = {
  primary:
    'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-purple-300',
  secondary:
    'bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-500 hover:to-blue-600 shadow-cyan-300',
  success:
    'bg-gradient-to-r from-emerald-400 to-green-500 text-white hover:from-emerald-500 hover:to-green-600 shadow-emerald-300',
  warning:
    'bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 shadow-amber-300',
  danger:
    'bg-gradient-to-r from-red-400 to-rose-500 text-white hover:from-red-500 hover:to-rose-600 shadow-red-300',
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-3 text-base gap-2',
  lg: 'px-8 py-4 text-lg gap-2.5',
};

const iconSizeStyles = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  icon: Icon,
  type = 'button',
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`
        inline-flex items-center justify-center
        font-bold rounded-2xl
        shadow-lg
        transition-colors duration-200
        focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-purple-300
        ${variantStyles[variant] || variantStyles.primary}
        ${sizeStyles[size] || sizeStyles.md}
        ${disabled ? 'opacity-50 cursor-not-allowed saturate-50' : 'cursor-pointer'}
        ${className}
      `}
    >
      {Icon && (
        <span className={iconSizeStyles[size] || iconSizeStyles.md}>
          {typeof Icon === 'function' ? <Icon /> : Icon}
        </span>
      )}
      {children}
    </motion.button>
  );
}
