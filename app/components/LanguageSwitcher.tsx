'use client';

import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const { theme } = useTheme();
  const isNight = theme === 'night';

  return (
    <div
      className="flex gap-2 backdrop-blur-sm rounded-full p-1 transition-all duration-300"
      style={{
        background: isNight ? 'rgba(26, 26, 58, 0.6)' : 'rgba(255, 255, 255, 0.6)',
        border: isNight ? '1px solid rgba(162, 155, 254, 0.3)' : '1px solid rgba(193, 193, 193, 0.3)',
      }}
    >
      <button
        onClick={() => setLanguage('en')}
        className="px-3 py-1 rounded-full text-sm font-medium transition-all duration-300"
        style={{
          background: language === 'en'
            ? (isNight ? 'linear-gradient(to right, #ffeaa7, #f8b739)' : 'linear-gradient(to right, #ff9f43, #ffd93d)')
            : 'transparent',
          color: language === 'en'
            ? (isNight ? '#0a0a1a' : '#ffffff')
            : (isNight ? '#a29bfe' : '#4a5568'),
        }}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('th')}
        className="px-3 py-1 rounded-full text-sm font-medium transition-all duration-300"
        style={{
          background: language === 'th'
            ? (isNight ? 'linear-gradient(to right, #ffeaa7, #f8b739)' : 'linear-gradient(to right, #ff9f43, #ffd93d)')
            : 'transparent',
          color: language === 'th'
            ? (isNight ? '#0a0a1a' : '#ffffff')
            : (isNight ? '#a29bfe' : '#4a5568'),
        }}
      >
        TH
      </button>
    </div>
  );
}