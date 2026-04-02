'use client';

import { useTheme } from './ThemeContext';
import { useLanguage } from './LanguageContext';

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-3">
      {/* Language Switcher */}
      <div
        className="flex items-center gap-1 px-2 py-1.5 rounded-full transition-all duration-300"
        style={{
          background: theme === 'night'
            ? 'rgba(26, 26, 58, 0.6)'
            : 'rgba(255, 255, 255, 0.6)',
          border: theme === 'night'
            ? '1px solid rgba(162, 155, 254, 0.3)'
            : '1px solid rgba(248, 183, 57, 0.3)',
        }}
      >
        <button
          onClick={() => setLanguage('en')}
          className={`px-2 py-0.5 rounded-full text-sm transition-all duration-300 ${
            language === 'en' ? 'font-semibold' : ''
          }`}
          style={{
            background: language === 'en'
              ? theme === 'night'
                ? 'rgba(255, 234, 167, 0.3)'
                : 'rgba(255, 159, 67, 0.3)'
              : 'transparent',
            color: language === 'en'
              ? theme === 'night' ? '#ffeaa7' : '#ff9f43'
              : theme === 'night' ? '#a29bfe' : '#4a5568',
          }}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage('th')}
          className={`px-2 py-0.5 rounded-full text-sm transition-all duration-300 ${
            language === 'th' ? 'font-semibold' : ''
          }`}
          style={{
            background: language === 'th'
              ? theme === 'night'
                ? 'rgba(255, 234, 167, 0.3)'
                : 'rgba(255, 159, 67, 0.3)'
              : 'transparent',
            color: language === 'th'
              ? theme === 'night' ? '#ffeaa7' : '#ff9f43'
              : theme === 'night' ? '#a29bfe' : '#4a5568',
          }}
        >
          TH
        </button>
      </div>

      {/* Theme Switcher */}
      <button
        onClick={toggleTheme}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 hover:scale-105"
        style={{
          background: theme === 'night'
            ? 'rgba(26, 26, 58, 0.6)'
            : 'rgba(255, 255, 255, 0.6)',
          border: theme === 'night'
            ? '1px solid rgba(162, 155, 254, 0.3)'
            : '1px solid rgba(248, 183, 57, 0.3)',
        }}
      >
        {theme === 'night' ? (
          <>
            <span className="text-lg">🌙</span>
            <span className="text-sm text-[#a29bfe]">{language === 'th' ? 'กลางคืน' : 'Night'}</span>
          </>
        ) : (
          <>
            <span className="text-lg">☀️</span>
            <span className="text-sm text-[#f8b739]">{language === 'th' ? 'กลางวัน' : 'Day'}</span>
          </>
        )}
      </button>
    </div>
  );
}