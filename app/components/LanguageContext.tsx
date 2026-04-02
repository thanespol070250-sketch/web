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
    step2Title: 'Choose Your Path & Ask Your Question',
    step2Subtitle: 'Select your destiny topic and share what you seek to know',
    step2Greeting: 'Welcome',
    step2TopicLabel: 'Select Your Destiny Topic',
    modeSelectionLabel: 'Choose how you would like to receive your prediction',
    modeTopicTitle: 'Choose What to Predict',
    modeTopicDesc: 'Select a topic and draw an oracle card for mystical guidance',
    modeQuestionTitle: 'Ask a Question',
    modeQuestionDesc: 'Ask any question and receive wisdom directly from the oracle',
    prophecyLifeTitle: 'Prophetic Life Guidance',
    prophecyLifeDesc: 'Receive sacred wisdom on how to live your life according to destiny',
    prophecyLifeBtn: 'Seek Life Prophecy',
    prophecyLifePlaceholder: 'What aspects of life would you like prophetic guidance on? (e.g., relationships, career path, inner peace...)',
    directQuestionLabel: 'Share your question with the oracle for direct guidance',
    yourQuestionLabel: 'Your Question',
    directQuestionPlaceholder: 'What would you like to know? Ask anything...',
    askOracleBtn: 'Ask the Oracle',
    oracleAnswerTitle: 'The Oracle Speaks',
    yourQuestionWas: 'You asked',
    askAnotherBtn: 'Ask Another Question',
    backToModeBtn: 'Choose Different Mode',
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
    step2Title: 'เลือกเส้นทางและถามคำถาม',
    step2Subtitle: 'เลือกหัวข้อชะตาชีวิตและแบ่งปันสิ่งที่คุณต้องการรู้',
    step2Greeting: 'ยินดีต้อนรับ',
    step2TopicLabel: 'เลือกหัวข้อชะตาชีวิต',
    modeSelectionLabel: 'เลือกวิธีที่คุณต้องการรับคำทำนาย',
    modeTopicTitle: 'เลือกสิ่งที่ต้องการทำนาย',
    modeTopicDesc: 'เลือกหัวข้อและหยิบไพ่โอราเคิลเพื่อรับคำแนะนำอันศักดิ์สิทธิ์',
    modeQuestionTitle: 'ถามคำถาม',
    modeQuestionDesc: 'ถามคำถามใดๆ และรับคำตอบโดยตรงจากผู้ทำนาย',
    prophecyLifeTitle: 'คำทำนายเส้นทางชีวิต',
    prophecyLifeDesc: 'รับภูมิปัญญาอันศักดิ์สิทธิ์เกี่ยวกับการดำเนินชีวิตตามชะตา',
    prophecyLifeBtn: 'ขอคำทำนายชีวิต',
    prophecyLifePlaceholder: 'ด้านใดของชีวิตที่คุณต้องการคำแนะนำ? (เช่น ความสัมพันธ์, เส้นทางอาชีพ, สันติภายใน...)',
    directQuestionLabel: 'แบ่งปันคำถามของคุณกับผู้ทำนาย',
    yourQuestionLabel: 'คำถามของคุณ',
    directQuestionPlaceholder: 'คุณต้องการรู้อะไร? ถามได้ทุกสิ่ง...',
    askOracleBtn: 'ถามผู้ทำนาย',
    oracleAnswerTitle: 'ผู้ทำนายตอบ',
    yourQuestionWas: 'คุณถามว่า',
    askAnotherBtn: 'ถามคำถามอื่น',
    backToModeBtn: 'เลือกโหมดอื่น',
    loveTitle: 'ความรักและความสัมพันธ์',
    loveDesc: 'ความรัก, คู่แท้, ความเชื่อมโยงของหัวใจ, และคำแนะนำเกี่ยวกับความสัมพันธ์',
    studiesTitle: 'อาชีพและการศึกษา',
    studiesDesc: 'การศึกษา, การเติบโตในอาชีพ, ความรู้, และเป้าหมายในชีวิต',
    personalityTitle: 'การเติบโตส่วนบุคคลและอนาคต',
    personalityDesc: 'การค้นพบตนเอง, การพัฒนาบุคลิกภาพ, และความเข้าใจเส้นทางชีวิต',
    questionLabel: 'คำถามของคุณถึงผู้ทำนาย',
    questionPlaceholder: 'ความลับใดที่คุณต้องการให้ผู้ทำนายเปิดเผย?',
    questionHint: 'ระบุสิ่งที่คุณต้องการคำแนะนำ...',
    submitBtn: 'ขอคำทำนาย',
    backBtn: 'กลับไปหน้าแรก',

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
    healthTitle: 'สุขภาพและความเป็นอยู่ที่ดี',
    healthDesc: 'พลังกาย, สันติจิต, และความสมดุลของวิญญาณ',
    financeTitle: 'การเงินและความมั่งคั่ง',
    financeDesc: 'ความมั่งคั่ง, ความอุดมสมบูรณ์, และโอกาสทางวัตถุ',
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