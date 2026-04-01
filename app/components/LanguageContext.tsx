'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    title: 'Fortune Oracle',
    subtitle: 'Unlock the secrets of your destiny through mystical wisdom',

    // Step 1 - User Info
    step1Title: 'Welcome Seeker',
    step1Subtitle: 'Begin your journey into the mystical realm',
    nameLabel: 'Your Name',
    namePlaceholder: 'Enter your name...',
    dobLabel: 'Date of Birth',
    continueBtn: 'Begin Your Journey',
    errorFill: 'Please fill in all fields',

    // Step 2 - Topic & Question
    step2Title: 'Choose Your Path & Ask Your Question',
    step2Subtitle: 'Select your destiny topic and share what you seek to know',
    step2Greeting: 'Welcome',
    step2TopicLabel: 'Select Your Destiny Topic',
    loveTitle: 'Love & Relationships',
    loveDesc: 'Romance, soulmates, heart connections, and relationship guidance',
    studiesTitle: 'Career & Studies',
    studiesDesc: 'Education, professional growth, knowledge, and life goals',
    personalityTitle: 'Personal Growth & Future',
    personalityDesc: 'Self-discovery, character development, and life path insights',
    questionLabel: 'Your Question to the Oracle',
    questionPlaceholder: 'What mysteries would you like the oracle to reveal for you?',
    questionHint: 'Be specific about what guidance you seek...',
    submitBtn: 'Seek Your Fortune',
    backBtn: 'Return to Introduction',

    // Step 3 - Cards
    step3Title: 'Draw Your Oracle Card',
    step3Subtitle: 'Let fate guide your hand as you draw a card for your',
    step3Reading: 'reading',
    fortuneTitle: 'Your Fortune Reading',
    drawAnotherBtn: 'Draw Another Card',
    startNewBtn: 'Begin New Reading',
    backTopicBtn: 'Return to Question',
    shuffling: 'The cards are being blessed...',
    clickCard: 'Touch a card to reveal your destiny...',
    consulting: 'The oracle is channeling your fortune...',
    cardReveal: 'Your chosen card reveals...',

    // Footer
    footer: 'Mystical wisdom awaits those who seek with an open heart',

    // Error
    errorConnect: 'The oracle cannot be reached at this moment',
    errorFortune: 'Failed to receive fortune guidance',

    // Card Deck Button
    drawCardBtn: 'Draw Another Card',

    // Additional fortune topics
    healthTitle: 'Health & Wellness',
    healthDesc: 'Physical vitality, mental peace, and spiritual balance',
    financeTitle: 'Finance & Prosperity',
    financeDesc: 'Wealth, abundance, and material opportunities',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Check localStorage for saved language preference
    const savedLang = localStorage.getItem('fortune-language');
    if (savedLang === 'en') {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('fortune-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}