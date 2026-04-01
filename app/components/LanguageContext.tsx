'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'th';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    title: 'Fortune Teller',
    subtitle: 'Discover your destiny through ancient wisdom',

    // Step 1 - User Info
    step1Title: 'Tell us about yourself',
    nameLabel: 'Your Name',
    namePlaceholder: 'Enter your name...',
    dobLabel: 'Date of Birth',
    questionLabel: 'Your Question to the Oracle',
    questionPlaceholder: 'What would you like to know about your future?',
    continueBtn: 'Continue to Choose Your Path',
    errorFill: 'Please fill in all fields',

    // Step 2 - Topic Selection
    step2Title: 'Choose Your Destiny Topic',
    step2Subtitle: 'Select the area of life you seek guidance for',
    loveTitle: 'Love',
    loveDesc: 'Romance, relationships, and matters of the heart',
    studiesTitle: 'Studies',
    studiesDesc: 'Education, knowledge, and intellectual growth',
    personalityTitle: 'Personality & Future',
    personalityDesc: 'Self-discovery, character, and life path',
    backBtn: 'Back to Personal Info',

    // Step 3 - Cards
    step3Title: 'Draw Your Oracle Card',
    step3Subtitle: 'Let fate guide your hand as you draw a card for your',
    step3Reading: 'reading',
    fortuneTitle: 'Your Fortune Reading',
    drawAnotherBtn: 'Draw Another Card',
    startNewBtn: 'Start New Reading',
    backTopicBtn: 'Back to Topic Selection',
    shuffling: 'Shuffling the cards...',
    clickCard: 'Click a card to reveal your destiny...',
    consulting: 'Consulting the oracle...',

    // Footer
    footer: 'Mystical wisdom powered by ancient algorithms',

    // Error
    errorConnect: 'Failed to connect to the oracle',
    errorFortune: 'Failed to get fortune',

    // Card Deck Button
    drawCardBtn: 'Draw Another Card',
  },
  th: {
    // Header
    title: 'ผู้ทำนายอนาคต',
    subtitle: 'ค้นพบโชคชะตาของคุณผ่านความรู้โบราณ',

    // Step 1 - User Info
    step1Title: 'บอกข้อมูลเกี่ยวกับคุณ',
    nameLabel: 'ชื่อของคุณ',
    namePlaceholder: 'กรอกชื่อของคุณ...',
    dobLabel: 'วันเกิด',
    questionLabel: 'คำถามที่คุณต้องการถามผู้ทำนาย',
    questionPlaceholder: 'สิ่งที่คุณอยากรู้เกี่ยวกับอนาคตของคุณ?',
    continueBtn: 'ดำเนินการเลือกเส้นทางของคุณ',
    errorFill: 'กรุณากรอกข้อมูลทั้งหมด',

    // Step 2 - Topic Selection
    step2Title: 'เลือกหัวข้อโชคชะตา',
    step2Subtitle: 'เลือกด้านชีวิตที่คุณต้องการคำแนะนำ',
    loveTitle: 'ความรัก',
    loveDesc: 'ความสัมพันธ์ หัวใจ และเรื่องราวของความรัก',
    studiesTitle: 'การศึกษา',
    studiesDesc: 'ความรู้ การเรียน และการพัฒนาทางปัญญา',
    personalityTitle: 'บุคลิก & อนาคต',
    personalityDesc: 'การค้นพบตัวเอง บุคลิกลักษณ์ และเส้นทางชีวิต',
    backBtn: 'กลับไปกรอกข้อมูลส่วนตัว',

    // Step 3 - Cards
    step3Title: 'หยิบไพ่ผู้ทำนาย',
    step3Subtitle: 'ให้โชคชะตานำมือคุณหยิบไพ่สำหรับการทำนาย',
    step3Reading: 'ของคุณ',
    fortuneTitle: 'การทำนายอนาคตของคุณ',
    drawAnotherBtn: 'หยิบไพ่ใบอื่น',
    startNewBtn: 'เริ่มการทำนายใหม่',
    backTopicBtn: 'กลับไปเลือกหัวข้อ',
    shuffling: 'กำลังสับไพ่...',
    clickCard: 'คลิกไพ่เพื่อเปิดโชคชะตาของคุณ...',
    consulting: 'กำลังปรึกษาผู้ทำนาย...',

    // Footer
    footer: 'ความรู้ลึกลับจากอัลกอริทึมโบราณ',

    // Error
    errorConnect: 'ไม่สามารถเชื่อมต่อกับผู้ทำนาย',
    errorFortune: 'ไม่สามารถทำนายได้',

    // Card Deck Button
    drawCardBtn: 'หยิบไพ่ใบอื่น',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Check localStorage for saved language preference
    const savedLang = localStorage.getItem('fortune-language');
    if (savedLang === 'en' || savedLang === 'th') {
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