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
    title: 'Fortune Oracle',
    subtitle: 'Unlock the secrets of your destiny through mystical wisdom',

    // Language
    languageEn: 'English',
    languageTh: 'Thai',

    // Step 1 - User Info
    step1Title: 'Welcome Seeker',
    step1Subtitle: 'Begin your journey into the mystical realm',
    nameLabel: 'Your Name',
    namePlaceholder: 'Enter your name...',
    dobLabel: 'Date of Birth',
    continueBtn: 'Begin Your Journey',
    errorFill: 'Please fill in all fields',

    // Step 2 - Topic & Question
    step2Title: 'Choose Your Reading',
    step2Subtitle: 'Select a topic and ask your question',
    step2Greeting: 'Welcome',
    step2TopicLabel: 'Select Your Topic',
    modeSelectionLabel: 'How would you like your reading?',
    modeTopicTitle: 'Topic + Card',
    modeTopicDesc: 'Pick a topic and draw a card',
    modeQuestionTitle: 'Ask Anything',
    modeQuestionDesc: 'Get direct answers from the oracle',
    prophecyLifeTitle: 'Life Guidance',
    prophecyLifeDesc: 'Get wisdom for your life path',
    prophecyLifeBtn: 'Seek Guidance',
    prophecyLifePlaceholder: 'What life guidance do you need?',
    directQuestionLabel: 'Ask your question below',
    yourQuestionLabel: 'Your Question',
    directQuestionPlaceholder: 'What do you want to know?',
    askOracleBtn: 'Ask Oracle',
    oracleAnswerTitle: 'Oracle Answer',
    yourQuestionWas: 'You asked',
    askAnotherBtn: 'Ask Another',
    backToModeBtn: 'Back',
    loveTitle: 'Love',
    loveDesc: 'Romance & relationships',
    studiesTitle: 'Career',
    studiesDesc: 'Work & education',
    personalityTitle: 'Future',
    personalityDesc: 'Self & life path',
    questionLabel: 'Your Question',
    questionPlaceholder: 'What do you want to know?',
    questionHint: 'Be specific...',
    submitBtn: 'Get Fortune',
    backBtn: 'Back',

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
    healthTitle: 'Health',
    healthDesc: 'Body & mind balance',
    financeTitle: 'Finance',
    financeDesc: 'Money & wealth',

    // Step indicator
    stepIndicator: 'Step',
    stepOf: 'of',

    // Error messages
    errorEnterQuestion: 'Please enter your question',
    errorSelectTopic: 'Please select a topic',
    errorEnterGuidance: 'Please enter what guidance you seek',

    // Love description
    loveDesc: 'Romance & relationships',
  },
  th: {
    // Header
    title: 'ผู้ทำนายโชคชะตา',
    subtitle: 'เปิดเผยความลับของชะตาชีวิตผ่านภูมิปัญญาอันศักดิ์สิทธิ์',

    // Language
    languageEn: 'อังกฤษ',
    languageTh: 'ไทย',

    // Step 1 - User Info
    step1Title: 'ยินดีต้อนรับผู้แสวงหา',
    step1Subtitle: 'เริ่มต้นการเดินทางเข้าสู่โลกแห่งความศักดิ์สิทธิ์',
    nameLabel: 'ชื่อของคุณ',
    namePlaceholder: 'กรอกชื่อของคุณ...',
    dobLabel: 'วันเกิด',
    continueBtn: 'เริ่มต้นการเดินทาง',
    errorFill: 'กรุณากรอกข้อมูลให้ครบถ้วน',

    // Step 2 - Topic & Question
    step2Title: 'เลือกการทำนาย',
    step2Subtitle: 'เลือกหัวข้อและถามคำถาม',
    step2Greeting: 'ยินดีต้อนรับ',
    step2TopicLabel: 'เลือกหัวข้อ',
    modeSelectionLabel: 'ต้องการทำนายแบบไหน?',
    modeTopicTitle: 'ทำนายตามหัวข้อ',
    modeTopicDesc: 'เลือกหัวข้อและหยิบไพ่',
    modeQuestionTitle: 'ถามคำถาม',
    modeQuestionDesc: 'รับคำตอบจากผู้ทำนาย',
    prophecyLifeTitle: 'คำแนะนำชีวิต',
    prophecyLifeDesc: 'รับคำแนะนำเส้นทางชีวิต',
    prophecyLifeBtn: 'ขอคำแนะนำ',
    prophecyLifePlaceholder: 'ต้องการคำแนะนำเรื่องอะไร?',
    directQuestionLabel: 'ถามคำถามของคุณ',
    yourQuestionLabel: 'คำถาม',
    directQuestionPlaceholder: 'อยากรู้อะไร?',
    askOracleBtn: 'ถามผู้ทำนาย',
    oracleAnswerTitle: 'คำตอบ',
    yourQuestionWas: 'คุณถาม',
    askAnotherBtn: 'ถามอีก',
    backToModeBtn: 'กลับ',
    loveTitle: 'ความรัก',
    loveDesc: 'ความสัมพันธ์',
    studiesTitle: 'อาชีพ',
    studiesDesc: 'งานและการศึกษา',
    personalityTitle: 'อนาคต',
    personalityDesc: 'ตนเองและเส้นทาง',
    questionLabel: 'คำถาม',
    questionPlaceholder: 'อยากรู้อะไร?',
    questionHint: 'ระบุให้ชัดเจน...',
    submitBtn: 'ทำนาย',
    backBtn: 'กลับ',

    // Step 3 - Cards
    step3Title: 'หยิบไพ่โอราเคิล',
    step3Subtitle: 'ให้ชะตานำพามือของคุณขณะหยิบไพ่เพื่อ',
    step3Reading: 'การทำนาย',
    fortuneTitle: 'คำทำนายของคุณ',
    drawAnotherBtn: 'หยิบไพ่อีกครั้ง',
    startNewBtn: 'เริ่มการทำนายใหม่',
    backTopicBtn: 'กลับไปคำถาม',
    shuffling: 'ไพ่กำลังถูกอวมอง...',
    clickCard: 'แตะไพ่เพื่อเปิดเผยชะตาของคุณ...',
    consulting: 'ผู้ทำนายกำลังส่งคำทำนาย...',
    cardReveal: 'ไพ่ที่คุณเลือกเปิดเผย...',

    // Footer
    footer: 'ภูมิปัญญาอันศักดิ์สิทธิ์รอคอยผู้ที่แสวงหาด้วยหัวใจที่เปิดกว้าง',

    // Error
    errorConnect: 'ไม่สามารถติดต่อผู้ทำนายได้ในขณะนี้',
    errorFortune: 'ไม่สามารถรับคำทำนายได้',

    // Card Deck Button
    drawCardBtn: 'หยิบไพ่อีกครั้ง',

    // Additional fortune topics
    healthTitle: 'สุขภาพ',
    healthDesc: 'กายและจิต',
    financeTitle: 'การเงิน',
    financeDesc: 'เงินและความมั่งคั่ง',

    // Step indicator
    stepIndicator: 'ขั้นตอน',
    stepOf: 'ของ',

    // Error messages
    errorEnterQuestion: 'กรุณากรอกคำถาม',
    errorSelectTopic: 'กรุณาเลือกหัวข้อ',
    errorEnterGuidance: 'กรุณากรอกคำแนะนำที่ต้องการ',

    // Love description
    loveDesc: 'ความสัมพันธ์',
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