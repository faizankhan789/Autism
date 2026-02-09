import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from './Avatar';
import { useSpeech } from '../../hooks/useSpeech';
import { useSensory } from '../../context/SensoryContext';

export default function AvatarWithSpeech({
  message = '',
  messageUrdu = '',
  mood = 'happy',
}) {
  const { speak, isSpeaking, stop } = useSpeech();
  const { settings } = useSensory();
  const [showBubble, setShowBubble] = useState(false);

  const isUrdu = settings?.language === 'ur';
  const displayMessage = isUrdu && messageUrdu ? messageUrdu : message;

  useEffect(() => {
    if (displayMessage) {
      setShowBubble(true);

      if (settings?.soundEnabled !== false) {
        speak(displayMessage, isUrdu ? 'ur' : 'en');
      }
    }

    return () => {
      stop();
    };
  }, [displayMessage]);

  const handleAvatarClick = () => {
    if (isSpeaking) {
      stop();
      setShowBubble(false);
    } else if (displayMessage) {
      setShowBubble(true);
      if (settings?.soundEnabled !== false) {
        speak(displayMessage, isUrdu ? 'ur' : 'en');
      }
    }
  };

  return (
    <div className="flex items-end gap-3">
      {/* Avatar */}
      <div
        onClick={handleAvatarClick}
        className="cursor-pointer flex-shrink-0"
        role="button"
        tabIndex={0}
        aria-label="Virtual assistant"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleAvatarClick();
        }}
      >
        <Avatar isSpeaking={isSpeaking} mood={mood} size="md" />
      </div>

      {/* Speech Bubble */}
      <AnimatePresence>
        {showBubble && displayMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative max-w-xs"
          >
            {/* Bubble tail */}
            <div className="absolute left-0 bottom-4 -translate-x-2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-white border-b-8 border-b-transparent" />

            {/* Bubble body */}
            <div
              className={`
                bg-white rounded-2xl shadow-lg px-5 py-4
                border-2 border-purple-100
                ${isUrdu ? 'text-right font-urdu' : 'text-left'}
              `}
              dir={isUrdu ? 'rtl' : 'ltr'}
            >
              <p className="text-gray-700 text-base leading-relaxed">
                {displayMessage}
              </p>

              {/* Speaking indicator */}
              {isSpeaking && (
                <div className="flex items-center gap-1 mt-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 bg-purple-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                  <span className="text-xs text-purple-400 ml-1">
                    {isUrdu ? 'بول رہا ہے...' : 'Speaking...'}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
