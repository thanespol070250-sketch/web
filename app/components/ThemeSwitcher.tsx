'use client';

import { useTheme } from './ThemeContext';

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
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
          <span className="text-sm text-[#a29bfe]">Night</span>
        </>
      ) : (
        <>
          <span className="text-lg">☀️</span>
          <span className="text-sm text-[#f8b739]">Day</span>
        </>
      )}
    </button>
  );
}