import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPalette, FaVolumeUp, FaVolumeMute, FaFont, FaLanguage, FaCog } from 'react-icons/fa';
import { useSensory } from '../../context/SensoryContext';

const themes = [
  { id: 'pastel', label: 'Pastel', colors: ['#fce7f3', '#e9d5ff', '#cffafe', '#fef9c3'] },
  { id: 'high-contrast', label: 'High Contrast', colors: ['#000000', '#ffffff', '#ffff00', '#00ff00'] },
  { id: 'dark', label: 'Dark', colors: ['#1e1b4b', '#312e81', '#3730a3', '#4338ca'] },
];

function ToggleGroup({ options, value, onChange }) {
  return (
    <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
            value === opt.id
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
              : 'text-gray-500 hover:bg-gray-200'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function SensoryPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, animationSpeed, soundEnabled, soundVolume, fontSize, language, setTheme, setAnimationSpeed, setSoundEnabled, setSoundVolume, setFontSize, setLanguage, resetSettings } = useSensory();

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center text-white text-xl"
      >
        <FaCog />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-50"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-80 max-w-[90vw] bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-4 flex items-center justify-between">
                <h2 className="text-white font-extrabold text-lg">Sensory Settings</h2>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-full bg-white/20 text-white">
                  <FaTimes />
                </button>
              </div>

              <div className="p-5 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FaPalette className="text-purple-500" />
                    <h3 className="font-bold text-gray-700 text-sm uppercase">Theme</h3>
                  </div>
                  <div className="space-y-2">
                    {themes.map((t) => (
                      <button key={t.id} onClick={() => setTheme(t.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                          theme === t.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                        }`}>
                        <div className="flex gap-1">
                          {t.colors.map((c, i) => (
                            <div key={i} className="w-5 h-5 rounded-full border" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                        <span className="font-semibold text-gray-700 text-sm">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-700 text-sm uppercase mb-2">Animation Speed</h3>
                  <ToggleGroup
                    options={[{ id: 'slow', label: 'Slow' }, { id: 'normal', label: 'Normal' }, { id: 'fast', label: 'Fast' }]}
                    value={animationSpeed} onChange={(v) => setAnimationSpeed(v)}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {soundEnabled ? <FaVolumeUp className="text-purple-500" /> : <FaVolumeMute className="text-gray-400" />}
                    <h3 className="font-bold text-gray-700 text-sm uppercase">Sound</h3>
                  </div>
                  <button onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`relative w-14 h-8 rounded-full transition-colors ${soundEnabled ? 'bg-purple-500' : 'bg-gray-300'}`}>
                    <motion.div className="absolute top-1 w-6 h-6 bg-white rounded-full shadow"
                      animate={{ left: soundEnabled ? 30 : 4 }} />
                  </button>
                  {soundEnabled && (
                    <div className="mt-3">
                      <input type="range" min="0" max="1" step="0.1" value={soundVolume}
                        onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                        className="w-full accent-purple-500" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FaFont className="text-purple-500" />
                    <h3 className="font-bold text-gray-700 text-sm uppercase">Font Size</h3>
                  </div>
                  <ToggleGroup
                    options={[{ id: 'small', label: 'Small' }, { id: 'medium', label: 'Medium' }, { id: 'large', label: 'Large' }]}
                    value={fontSize} onChange={(v) => setFontSize(v)}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FaLanguage className="text-purple-500" />
                    <h3 className="font-bold text-gray-700 text-sm uppercase">Language</h3>
                  </div>
                  <ToggleGroup
                    options={[{ id: 'en', label: 'English' }, { id: 'ur', label: 'اردو' }]}
                    value={language} onChange={(v) => setLanguage(v)}
                  />
                </div>
              </div>

              <div className="p-5 border-t">
                <button onClick={() => resetSettings()}
                  className="w-full py-2 text-sm font-semibold text-purple-500 hover:text-purple-700">
                  Reset to Defaults
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
