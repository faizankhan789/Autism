import translations from '../i18n/translations';
import { useSensory } from '../context/SensoryContext';

export default function useTranslation() {
  const { language } = useSensory();
  const isUrdu = language === 'ur';

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        // Fallback to English
        let fallback = translations.en;
        for (const fk of keys) {
          if (fallback && fallback[fk] !== undefined) {
            fallback = fallback[fk];
          } else {
            return key;
          }
        }
        return fallback;
      }
    }
    return value;
  };

  return { t, isUrdu, language };
}
