import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'sensory_settings';

const DEFAULT_SETTINGS = {
  theme: 'pastel',           // 'pastel' | 'high-contrast' | 'dark'
  animationSpeed: 'normal',  // 'slow' | 'normal' | 'fast'
  soundEnabled: true,
  soundVolume: 0.7,          // 0 – 1
  fontSize: 'medium',        // 'small' | 'medium' | 'large'
  language: 'en',            // 'en' | 'ur'
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (err) {
    console.warn('Failed to load sensory settings from localStorage:', err);
  }
  return { ...DEFAULT_SETTINGS };
}

function persistSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to persist sensory settings:', err);
  }
}

const SensoryContext = createContext(null);

export function SensoryProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings);

  // Persist every time settings change
  useEffect(() => {
    persistSettings(settings);
  }, [settings]);

  // Apply theme class to the document root for Tailwind / CSS usage
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-pastel', 'theme-high-contrast', 'theme-dark');
    root.classList.add(`theme-${settings.theme}`);
  }, [settings.theme]);

  // Apply font-size class to document root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-small', 'font-medium', 'font-large');
    root.classList.add(`font-${settings.fontSize}`);
  }, [settings.fontSize]);

  // Apply language direction for Urdu (RTL)
  useEffect(() => {
    document.documentElement.dir = settings.language === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = settings.language;
  }, [settings.language]);

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setTheme = useCallback((theme) => updateSetting('theme', theme), [updateSetting]);
  const setAnimationSpeed = useCallback((speed) => updateSetting('animationSpeed', speed), [updateSetting]);
  const setSoundEnabled = useCallback((enabled) => updateSetting('soundEnabled', enabled), [updateSetting]);
  const setSoundVolume = useCallback((volume) => updateSetting('soundVolume', Math.min(1, Math.max(0, volume))), [updateSetting]);
  const setFontSize = useCallback((size) => updateSetting('fontSize', size), [updateSetting]);
  const setLanguage = useCallback((lang) => updateSetting('language', lang), [updateSetting]);

  const resetSettings = useCallback(() => {
    setSettings({ ...DEFAULT_SETTINGS });
  }, []);

  // Compute Framer Motion duration multiplier based on animation speed
  const animationDuration = settings.animationSpeed === 'slow' ? 1.5 : settings.animationSpeed === 'fast' ? 0.3 : 0.6;

  const value = {
    ...settings,
    animationDuration,
    setTheme,
    setAnimationSpeed,
    setSoundEnabled,
    setSoundVolume,
    setFontSize,
    setLanguage,
    updateSetting,
    resetSettings,
  };

  return <SensoryContext.Provider value={value}>{children}</SensoryContext.Provider>;
}

export function useSensory() {
  const context = useContext(SensoryContext);
  if (!context) {
    throw new Error('useSensory must be used within a SensoryProvider');
  }
  return context;
}

export default SensoryContext;
