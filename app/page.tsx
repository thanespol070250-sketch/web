'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useLanguage } from './components/LanguageContext';
import { useTheme } from './components/ThemeContext';
import ThemeSwitcher from './components/ThemeSwitcher';

type Topic = 'love' | 'studies' | 'personality' | 'health' | 'finance';
type PredictionMode = 'topic' | 'question' | 'prophecy' | null;

// Import type separately
import type { OracleCard } from './components/OracleCardDeck';

// Dynamic import to prevent SSR for the card deck
const OracleCardDeck = dynamic(() => import('./components/OracleCardDeck'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin w-8 h-8 border-2 border-[#ffeaa7] border-t-transparent rounded-full"></div>
    </div>
  ),
});

// Dynamic import to prevent SSR for stars (uses Math.random)
const Stars = dynamic(() => import('./components/Stars'), {
  ssr: false,
});

const topicLabels: Record<Topic, string> = {
  love: 'Love & Relationships',
  studies: 'Career & Studies',
  personality: 'Personal Growth & Future',
  health: 'Health & Wellness',
  finance: 'Finance & Prosperity',
};

const topicIcons: Record<Topic, string> = {
  love: '💕',
  studies: '📚',
  personality: '🌟',
  health: '🌿',
  finance: '💰',
};

export default function FortuneTellerPage() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const isNight = theme === 'night';
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
  });
  const [predictionMode, setPredictionMode] = useState<PredictionMode>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [question, setQuestion] = useState('');
  const [selectedCard, setSelectedCard] = useState<OracleCard | null>(null);
  const [fortune, setFortune] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deckKey, setDeckKey] = useState(0);

  // Step 1: Basic Info Submit
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.name && formData.dateOfBirth) {
      setStep(2);
      setError(null);
    } else {
      setError(t('errorFill'));
    }
  };

  // Step 2: Mode selection
  const handleModeSelect = (mode: PredictionMode) => {
    setPredictionMode(mode);
    setError(null);
  };

  // Direct question submission (for 'question' mode)
  const handleDirectQuestionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Please enter your question');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          dateOfBirth: formData.dateOfBirth,
          question: question,
          mode: 'direct',
          language: language,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setFortune(data.fortune);
      } else {
        setError(data.error || 'Failed to get fortune');
      }
    } catch {
      setError(t('errorConnect'));
    } finally {
      setIsLoading(false);
    }
  };

  // Prophecy Life Guidance submission
  const handleProphecySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Please enter what guidance you seek');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          dateOfBirth: formData.dateOfBirth,
          question: question,
          mode: 'prophecy',
          language: language,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setFortune(data.fortune);
      } else {
        setError(data.error || 'Failed to receive prophecy');
      }
    } catch {
      setError(t('errorConnect'));
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Topic selection (visual only, stores the topic)
  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic);
  };

  // Step 2: Question submission to proceed to card selection
  const handleQuestionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedTopic && question.trim()) {
      setStep(3);
      setError(null);
    } else {
      setError(selectedTopic ? 'Please enter your question' : 'Please select a topic');
    }
  };

  // Step 3: Card selection and API call
  const handleCardSelect = async (card: OracleCard) => {
    setSelectedCard(card);
    setIsLoading(true);

    try {
      const response = await fetch('/api/fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          dateOfBirth: formData.dateOfBirth,
          question: question,
          topic: selectedTopic,
          card: card,
          language: language,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setFortune(data.fortune);
      } else {
        setError(data.error || 'Failed to get fortune');
      }
    } catch {
      setError(t('errorConnect'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setFormData({ name: '', dateOfBirth: '' });
    setPredictionMode(null);
    setSelectedTopic(null);
    setQuestion('');
    setSelectedCard(null);
    setFortune(null);
    setError(null);
    setDeckKey(prev => prev + 1);
  };

  const handleDrawAnother = () => {
    setSelectedCard(null);
    setFortune(null);
    setDeckKey(prev => prev + 1);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-700"
      style={{
        background: isNight
          ? 'linear-gradient(to bottom, #0a0a1a, #1a1a3a, #0d0d2a)'
          : 'linear-gradient(to bottom, #1a1a2e 0%, #2d1b4e 15%, #4a2c5a 30%, #7b4a6b 45%, #c17f59 60%, #daa06d 75%, #f4c67a 90%, #ffecd2 100%)',
        color: isNight ? '#ededed' : '#4a3f35',
      }}
      suppressHydrationWarning
    >
      {/* Celestial overlay with sun/moon */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" suppressHydrationWarning>
        {isNight ? (
          <>
            {/* Stars background */}
            <Stars />
            {/* Moon glow */}
            <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-gradient-radial from-[#ffeaa7]/20 via-[#ffeaa7]/10 to-transparent blur-3xl animate-pulse"></div>
            {/* Moon */}
            <div className="absolute top-20 right-20 w-16 h-16 rounded-full bg-gradient-to-br from-[#ffeaa7] to-[#f5cd79] shadow-[0_0_40px_rgba(255,234,167,0.4)]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1a1a3a]/40 to-transparent"></div>
            </div>
          </>
        ) : (
          <>
            {/* Golden Hour Sun - soft and mystical */}
            <div className="absolute top-5 right-5 w-96 h-96 rounded-full bg-gradient-radial from-[#ffecd2]/40 via-[#daa06d]/20 to-transparent blur-3xl animate-pulse"></div>
            <div className="absolute top-8 right-8 w-72 h-72 rounded-full bg-gradient-radial from-[#f4c67a]/30 via-[#c17f59]/15 to-transparent blur-2xl"></div>
            {/* Sun - soft golden orb */}
            <div className="absolute top-16 right-16 w-32 h-32 rounded-full bg-gradient-to-br from-[#ffecd2] via-[#f4c67a] to-[#daa06d] shadow-[0_0_120px_rgba(244,198,122,0.6),0_0_60px_rgba(199,127,89,0.4)]">
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#fff8f0] to-[#f4c67a] opacity-90"></div>
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-[#fffaf5] to-[#ffecd2]"></div>
            </div>

            {/* Mystical Mist Layers */}
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#ffecd2]/60 via-[#f4c67a]/30 to-transparent blur-xl"></div>
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#daa06d]/40 via-[#c17f59]/20 to-transparent blur-2xl"></div>
            <div className="absolute top-1/3 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-[#7b4a6b]/15 to-[#c17f59]/10 blur-lg"></div>

            {/* Ethereal Misty Clouds */}
            <div className="absolute animate-cloud-1">
              <div className="relative">
                <div className="w-48 h-16 bg-gradient-to-r from-[#ffecd2]/70 via-[#f4c67a]/60 to-[#daa06d]/50 rounded-full blur-md"></div>
                <div className="absolute -top-4 left-8 w-32 h-12 bg-gradient-to-r from-[#ffecd2]/80 to-[#f4c67a]/70 rounded-full blur-sm"></div>
                <div className="absolute -top-2 left-24 w-24 h-10 bg-gradient-to-r from-[#f4c67a]/60 to-[#c17f59]/50 rounded-full blur-sm"></div>
              </div>
            </div>
            <div className="absolute animate-cloud-2">
              <div className="relative">
                <div className="w-56 h-14 bg-gradient-to-r from-[#daa06d]/60 via-[#f4c67a]/70 to-[#ffecd2]/60 rounded-full blur-md"></div>
                <div className="absolute -top-3 left-12 w-28 h-10 bg-gradient-to-r from-[#c17f59]/50 to-[#f4c67a]/60 rounded-full blur-sm"></div>
                <div className="absolute -top-1 left-32 w-20 h-8 bg-gradient-to-r from-[#f4c67a]/50 to-[#ffecd2]/40 rounded-full blur-sm"></div>
              </div>
            </div>
            <div className="absolute animate-cloud-3">
              <div className="relative">
                <div className="w-40 h-12 bg-gradient-to-r from-[#7b4a6b]/40 via-[#c17f59]/50 to-[#f4c67a]/40 rounded-full blur-lg"></div>
                <div className="absolute -top-2 left-6 w-24 h-8 bg-gradient-to-r from-[#7b4a6b]/30 to-[#c17f59]/40 rounded-full blur-md"></div>
                <div className="absolute top-0 left-20 w-16 h-6 bg-gradient-to-r from-[#c17f59]/30 to-[#daa06d]/30 rounded-full blur-sm"></div>
              </div>
            </div>
            <div className="absolute animate-cloud-4">
              <div className="relative">
                <div className="w-44 h-10 bg-gradient-to-r from-[#4a2c5a]/30 via-[#7b4a6b]/40 to-[#c17f59]/30 rounded-full blur-lg"></div>
                <div className="absolute -top-2 left-10 w-20 h-7 bg-gradient-to-r from-[#4a2c5a]/25 to-[#7b4a6b]/35 rounded-full blur-md"></div>
              </div>
            </div>

            {/* Floating Light Particles - magical dust */}
            <div className="absolute w-3 h-3 rounded-full top-[10%] left-[15%] animate-float" style={{ background: 'rgba(244, 198, 122, 0.5)', boxShadow: '0 0 10px rgba(244, 198, 122, 0.3)' }}></div>
            <div className="absolute w-2 h-2 rounded-full top-[20%] right-[25%] animate-float-slow" style={{ background: 'rgba(255, 236, 210, 0.6)', boxShadow: '0 0 8px rgba(255, 236, 210, 0.4)' }}></div>
            <div className="absolute w-4 h-4 rounded-full top-[35%] left-[8%] animate-float" style={{ background: 'rgba(199, 127, 89, 0.4)', boxShadow: '0 0 12px rgba(199, 127, 89, 0.3)' }}></div>
            <div className="absolute w-2 h-2 rounded-full bottom-[40%] right-[10%] animate-float-slow" style={{ background: 'rgba(218, 160, 106, 0.5)', boxShadow: '0 0 6px rgba(218, 160, 106, 0.3)' }}></div>
            <div className="absolute w-3 h-3 rounded-full bottom-[25%] left-[30%] animate-float" style={{ background: 'rgba(244, 198, 122, 0.45)', boxShadow: '0 0 10px rgba(244, 198, 122, 0.3)' }}></div>

            {/* Floating Aladdin - Magical flying characters */}
            <div style={{ animation: 'aladdin-1 28s ease-in-out infinite' }}>
              <img
                src="/alardin.png"
                alt="Aladdin"
                className="w-24 h-24 md:w-32 md:h-32 object-contain transition-all duration-700 hover:scale-110"
                style={{
                  opacity: 0.9,
                  filter: 'drop-shadow(0 0 15px rgba(244, 198, 122, 0.4))',
                }}
              />
            </div>
            <div style={{ animation: 'aladdin-2 35s ease-in-out infinite', animationDelay: '-7s' }}>
              <img
                src="/alardin.png"
                alt="Aladdin"
                className="w-20 h-20 md:w-28 md:h-28 object-contain transition-all duration-700 hover:scale-110"
                style={{
                  opacity: 0.85,
                  filter: 'drop-shadow(0 0 12px rgba(218, 160, 106, 0.35))',
                }}
              />
            </div>
            <div style={{ animation: 'aladdin-3 32s ease-in-out infinite', animationDelay: '-15s' }}>
              <img
                src="/alardin.png"
                alt="Aladdin"
                className="w-28 h-28 md:w-36 md:h-36 object-contain transition-all duration-700 hover:scale-110"
                style={{
                  opacity: 0.8,
                  filter: 'drop-shadow(0 0 18px rgba(199, 127, 89, 0.3))',
                }}
              />
            </div>
            <div style={{ animation: 'aladdin-4 40s ease-in-out infinite', animationDelay: '-20s' }}>
              <img
                src="/alardin.png"
                alt="Aladdin"
                className="w-16 h-16 md:w-24 md:h-24 object-contain transition-all duration-700 hover:scale-110"
                style={{
                  opacity: 0.75,
                  filter: 'drop-shadow(0 0 10px rgba(255, 236, 210, 0.3))',
                }}
              />
            </div>
            <div style={{ animation: 'aladdin-5 25s ease-in-out infinite', animationDelay: '-3s' }}>
              <img
                src="/alardin.png"
                alt="Aladdin"
                className="w-20 h-20 md:w-28 md:h-28 object-contain transition-all duration-700 hover:scale-110"
                style={{
                  opacity: 0.7,
                  filter: 'drop-shadow(0 0 14px rgba(244, 198, 122, 0.25))',
                }}
              />
            </div>
          </>
        )}

        {/* Floating Witches - Only visible at night */}
        {isNight && (
          <>
            <div
              className="absolute"
              style={{ animation: 'witch-1 25s ease-in-out infinite' }}
            >
              <img
                src="/littlewitch.png"
                alt="Mystical Witch"
                className="w-20 h-20 md:w-28 md:h-28 object-contain transition-all duration-500 hover:opacity-100"
                style={{
                  opacity: 0.7,
                  filter: 'drop-shadow(0 0 15px rgba(255,234,167,0.3))',
                  WebkitMaskImage: 'radial-gradient(ellipse 45% 45% at center, black 50%, transparent 100%)',
                  maskImage: 'radial-gradient(ellipse 45% 45% at center, black 50%, transparent 100%)',
                }}
              />
            </div>
            <div
              className="absolute"
              style={{ animation: 'witch-2 30s ease-in-out infinite', animationDelay: '-5s' }}
            >
              <img
                src="/littlewitch.png"
                alt="Mystical Witch"
                className="w-16 h-16 md:w-24 md:h-24 object-contain transition-all duration-500 hover:opacity-100"
                style={{
                  opacity: 0.6,
                  filter: 'drop-shadow(0 0 15px rgba(162,155,254,0.3))',
                  WebkitMaskImage: 'radial-gradient(ellipse 40% 40% at center, black 50%, transparent 100%)',
                  maskImage: 'radial-gradient(ellipse 40% 40% at center, black 50%, transparent 100%)',
                }}
              />
            </div>
            <div
              className="absolute"
              style={{ animation: 'witch-3 35s ease-in-out infinite', animationDelay: '-12s' }}
            >
              <img
                src="/littlewitch.png"
                alt="Mystical Witch"
                className="w-24 h-24 md:w-32 md:h-32 object-contain transition-all duration-500 hover:opacity-100"
                style={{
                  opacity: 0.65,
                  filter: 'drop-shadow(0 0 20px rgba(253,121,168,0.3))',
                  WebkitMaskImage: 'radial-gradient(ellipse 42% 42% at center, black 50%, transparent 100%)',
                  maskImage: 'radial-gradient(ellipse 42% 42% at center, black 50%, transparent 100%)',
                }}
              />
            </div>
            <div
              className="absolute"
              style={{ animation: 'witch-4 22s ease-in-out infinite', animationDelay: '-8s' }}
            >
              <img
                src="/littlewitch.png"
                alt="Mystical Witch"
                className="w-14 h-14 md:w-20 md:h-20 object-contain transition-all duration-500 hover:opacity-100"
                style={{
                  opacity: 0.55,
                  filter: 'drop-shadow(0 0 12px rgba(255,234,167,0.4))',
                  WebkitMaskImage: 'radial-gradient(ellipse 38% 38% at center, black 50%, transparent 100%)',
                  maskImage: 'radial-gradient(ellipse 38% 38% at center, black 50%, transparent 100%)',
                }}
              />
            </div>
          </>
        )}

        {/* Floating particles */}
        <div className="absolute inset-0">
          <div
            className="absolute w-2 h-2 rounded-full top-[15%] left-[10%] animate-float"
            suppressHydrationWarning
            style={{
              background: isNight ? 'rgba(255, 234, 167, 0.3)' : 'rgba(244, 198, 122, 0.5)',
              boxShadow: isNight ? 'none' : '0 0 8px rgba(244, 198, 122, 0.4)',
            }}
          ></div>
          <div
            className="absolute w-3 h-3 rounded-full top-[25%] right-[20%] animate-float-slow"
            suppressHydrationWarning
            style={{
              background: isNight ? 'rgba(162, 155, 254, 0.2)' : 'rgba(255, 236, 210, 0.5)',
              boxShadow: isNight ? 'none' : '0 0 10px rgba(255, 236, 210, 0.3)',
            }}
          ></div>
          <div
            className="absolute w-2 h-2 rounded-full bottom-[30%] left-[25%] animate-float"
            suppressHydrationWarning
            style={{
              background: isNight ? 'rgba(253, 121, 168, 0.25)' : 'rgba(199, 127, 89, 0.4)',
              boxShadow: isNight ? 'none' : '0 0 6px rgba(199, 127, 89, 0.3)',
            }}
          ></div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* Header */}
        <header className="text-center mb-12 relative z-10">
          <div className="flex justify-between items-center mb-4">
            <ThemeSwitcher />
            <div className="text-sm" style={{ color: isNight ? '#ffeaa7' : '#7b4a6b' }}>
              Step {step} of 3
            </div>
          </div>
          <h1
            className="magic-title text-5xl font-bold text-transparent bg-clip-text mb-4 transition-all duration-500"
            style={{
              backgroundImage: isNight
                ? 'linear-gradient(to right, #ffeaa7, #f8b739, #ffeaa7)'
                : 'linear-gradient(to right, #f4c67a, #daa06d, #c17f59, #f4c67a)',
            }}
          >
            {t('title')}
          </h1>
          <p
            className="text-lg italic transition-all duration-500"
            style={{ color: isNight ? '#a29bfe' : '#7b4a6b' }}
          >
            {t('subtitle')}
          </p>
        </header>

        {/* Step 1: User Info (Name & DOB only) */}
        {step === 1 && (
          <section
            className="backdrop-blur-md rounded-xl p-8 shadow-2xl transition-all duration-500"
            style={{
              background: isNight ? 'rgba(26, 26, 58, 0.4)' : 'rgba(255, 236, 210, 0.5)',
              border: isNight ? '1px solid rgba(255, 234, 167, 0.2)' : '1px solid rgba(199, 127, 89, 0.3)',
            }}
          >
            <h2
              className="text-2xl font-semibold mb-2 text-center transition-all duration-500"
              style={{ color: isNight ? '#ffeaa7' : '#4a2c5a' }}
            >
              {t('step1Title')}
            </h2>
            <p
              className="text-center mb-6 transition-all duration-500"
              style={{ color: isNight ? '#a29bfe' : '#7b4a6b' }}
            >
              {t('step1Subtitle')}
            </p>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 transition-all duration-500"
                  style={{ color: isNight ? '#a29bfe' : '#7b4a6b' }}
                >
                  {t('nameLabel')}
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg backdrop-blur-sm focus:outline-none transition-all duration-300"
                  style={{
                    background: isNight ? 'rgba(10, 10, 26, 0.6)' : 'rgba(255, 236, 210, 0.6)',
                    border: isNight ? '1px solid rgba(162, 155, 254, 0.3)' : '1px solid rgba(199, 127, 89, 0.4)',
                    color: isNight ? '#ffffff' : '#4a3f35',
                  }}
                  placeholder={t('namePlaceholder')}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="dob"
                  className="block mb-2 transition-all duration-500"
                  style={{ color: isNight ? '#a29bfe' : '#7b4a6b' }}
                >
                  {t('dobLabel')}
                </label>
                <input
                  type="date"
                  id="dob"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg backdrop-blur-sm focus:outline-none transition-all duration-300"
                  style={{
                    background: isNight ? 'rgba(10, 10, 26, 0.6)' : 'rgba(255, 236, 210, 0.6)',
                    border: isNight ? '1px solid rgba(162, 155, 254, 0.3)' : '1px solid rgba(199, 127, 89, 0.4)',
                    color: isNight ? '#ffffff' : '#4a3f35',
                  }}
                  required
                />
              </div>
              {error && (
                <p className="text-[#e84393] text-center">{error}</p>
              )}
              <button
                type="submit"
                className="w-full py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: isNight
                    ? 'linear-gradient(to right, #ffeaa7, #f8b739)'
                    : 'linear-gradient(to right, #f4c67a, #c17f59)',
                  color: isNight ? '#0a0a1a' : '#ffecd2',
                  boxShadow: isNight ? '0 10px 40px rgba(255, 234, 167, 0.2)' : '0 10px 40px rgba(199, 127, 89, 0.3)',
                }}
              >
                {t('continueBtn')}
              </button>
            </form>
          </section>
        )}

        {/* Step 2: Mode Selection & Prediction */}
        {step === 2 && (
          <section
            className="backdrop-blur-md rounded-xl p-8 shadow-2xl transition-all duration-500"
            style={{
              background: isNight ? 'rgba(26, 26, 58, 0.4)' : 'rgba(255, 236, 210, 0.5)',
              border: isNight ? '1px solid rgba(255, 234, 167, 0.2)' : '1px solid rgba(199, 127, 89, 0.3)',
            }}
          >
            <h2
              className="text-2xl font-semibold mb-2 text-center transition-all duration-500"
              style={{ color: isNight ? '#ffeaa7' : '#4a2c5a' }}
            >
              {t('step2Title')}
            </h2>
            <p
              className="text-center mb-6 transition-all duration-500"
              style={{ color: isNight ? '#a29bfe' : '#7b4a6b' }}
            >
              {t('step2Greeting')}, <span style={{ fontWeight: 600 }}>{formData.name}</span>! {t('step2Subtitle')}
            </p>

            {/* Mode Selection - Show if no mode selected */}
            {!predictionMode && (
              <div className="space-y-4">
                <p
                  className="text-center mb-6 transition-all duration-500"
                  style={{ color: isNight ? '#a29bfe' : '#7b4a6b' }}
                >
                  {t('modeSelectionLabel')}
                </p>

                {/* Three Mode Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Mode 1: Topic Selection */}
                  <button
                    onClick={() => handleModeSelect('topic')}
                    className="group p-6 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
                    style={{
                      background: isNight ? 'rgba(255, 234, 167, 0.2)' : 'rgba(244, 198, 122, 0.4)',
                      border: isNight ? '1px solid rgba(255, 234, 167, 0.4)' : '1px solid rgba(199, 127, 89, 0.4)',
                    }}
                  >
                    <div className="text-4xl mb-4">🔮</div>
                    <h3
                      className="text-xl font-semibold mb-2 transition-all duration-300"
                      style={{ color: isNight ? '#ffeaa7' : '#4a2c5a' }}
                    >
                      {t('modeTopicTitle')}
                    </h3>
                    <p
                      className="text-sm transition-all duration-300"
                      style={{ color: isNight ? '#a29bfe' : '#7b4a6b' }}
                    >
                      {t('modeTopicDesc')}
                    </p>
                  </button>

                  {/* Mode 2: Direct Question */}
                  <button
                    onClick={() => handleModeSelect('question')}
                    className="group p-6 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
                    style={{
                      background: isNight ? 'rgba(162, 155, 254, 0.2)' : 'rgba(123, 74, 107, 0.4)',
                      border: isNight ? '1px solid rgba(162, 155, 254, 0.4)' : '1px solid rgba(74, 44, 90, 0.4)',
                    }}
                  >
                    <div className="text-4xl mb-4">💬</div>
                    <h3
                      className="text-xl font-semibold mb-2 transition-all duration-300"
                      style={{ color: isNight ? '#a29bfe' : '#4a2c5a' }}
                    >
                      {t('modeQuestionTitle')}
                    </h3>
                    <p
                      className="text-sm transition-all duration-300"
                      style={{ color: isNight ? '#a29bfe' : '#7b4a6b' }}
                    >
                      {t('modeQuestionDesc')}
                    </p>
                  </button>

                  {/* Mode 3: Prophecy Life Guidance */}
                  <button
                    onClick={() => handleModeSelect('prophecy')}
                    className="group p-6 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
                    style={{
                      background: isNight ? 'rgba(253, 121, 168, 0.2)' : 'rgba(199, 127, 89, 0.35)',
                      border: isNight ? '1px solid rgba(253, 121, 168, 0.4)' : '1px solid rgba(193, 127, 89, 0.4)',
                    }}
                  >
                    <div className="text-4xl mb-4">📜</div>
                    <h3
                      className="text-xl font-semibold mb-2 transition-all duration-300"
                      style={{ color: isNight ? '#fd79a8' : '#c17f59' }}
                    >
                      {t('prophecyLifeTitle')}
                    </h3>
                    <p
                      className="text-sm transition-all duration-300"
                      style={{ color: isNight ? '#a29bfe' : '#7b4a6b' }}
                    >
                      {t('prophecyLifeDesc')}
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Topic Mode: Show topic grid + question form */}
            {predictionMode === 'topic' && !fortune && (
              <>
                {/* Topic Label */}
                <p
                  className="text-center mb-4 transition-all duration-500"
                  style={{ color: isNight ? '#a29bfe' : '#7b4a6b' }}
                >
                  {t('step2TopicLabel')}
                </p>

                {/* 5 Topics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                  {/* Love */}
                  <button
                    onClick={() => handleTopicClick('love')}
                    className={`group p-4 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                      selectedTopic === 'love' ? 'ring-2 ring-pink-400 ring-offset-2' : ''
                    }`}
                    style={{
                      background: isNight ? 'rgba(232, 67, 147, 0.2)' : 'rgba(199, 127, 89, 0.4)',
                      border: selectedTopic === 'love'
                        ? `2px solid ${isNight ? '#fd79a8' : '#c17f59'}`
                        : isNight ? '1px solid rgba(253, 121, 168, 0.3)' : '1px solid rgba(193, 127, 89, 0.4)',
                    }}
                  >
                    <div className="text-3xl mb-2">💕</div>
                    <h3
                      className="text-sm font-semibold transition-all duration-300"
                      style={{ color: isNight ? '#fd79a8' : '#c17f59' }}
                    >
                      {t('loveTitle')}
                    </h3>
                  </button>

                  {/* Studies */}
                  <button
                    onClick={() => handleTopicClick('studies')}
                    className={`group p-4 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                      selectedTopic === 'studies' ? 'ring-2 ring-blue-400 ring-offset-2' : ''
                    }`}
                    style={{
                      background: isNight ? 'rgba(162, 155, 254, 0.2)' : 'rgba(123, 74, 107, 0.35)',
                      border: selectedTopic === 'studies'
                        ? `2px solid ${isNight ? '#a29bfe' : '#4a2c5a'}`
                        : isNight ? '1px solid rgba(162, 155, 254, 0.3)' : '1px solid rgba(74, 44, 90, 0.4)',
                    }}
                  >
                    <div className="text-3xl mb-2">📚</div>
                    <h3
                      className="text-sm font-semibold transition-all duration-300"
                      style={{ color: isNight ? '#a29bfe' : '#4a2c5a' }}
                    >
                      {t('studiesTitle')}
                    </h3>
                  </button>

                  {/* Personality */}
                  <button
                    onClick={() => handleTopicClick('personality')}
                    className={`group p-4 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                      selectedTopic === 'personality' ? 'ring-2 ring-yellow-400 ring-offset-2' : ''
                    }`}
                    style={{
                      background: isNight ? 'rgba(255, 234, 167, 0.2)' : 'rgba(244, 198, 122, 0.45)',
                      border: selectedTopic === 'personality'
                        ? `2px solid ${isNight ? '#ffeaa7' : '#daa06d'}`
                        : isNight ? '1px solid rgba(255, 234, 167, 0.3)' : '1px solid rgba(218, 160, 106, 0.4)',
                    }}
                  >
                    <div className="text-3xl mb-2">🌟</div>
                    <h3
                      className="text-sm font-semibold transition-all duration-300"
                      style={{ color: isNight ? '#ffeaa7' : '#daa06d' }}
                    >
                      {t('personalityTitle')}
                    </h3>
                  </button>

                  {/* Health */}
                  <button
                    onClick={() => handleTopicClick('health')}
                    className={`group p-4 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                      selectedTopic === 'health' ? 'ring-2 ring-green-400 ring-offset-2' : ''
                    }`}
                    style={{
                      background: isNight ? 'rgba(46, 204, 113, 0.2)' : 'rgba(123, 74, 107, 0.3)',
                      border: selectedTopic === 'health'
                        ? `2px solid ${isNight ? '#2ecc71' : '#7b4a6b'}`
                        : isNight ? '1px solid rgba(46, 204, 113, 0.3)' : '1px solid rgba(74, 44, 90, 0.35)',
                    }}
                  >
                    <div className="text-3xl mb-2">🌿</div>
                    <h3
                      className="text-sm font-semibold transition-all duration-300"
                      style={{ color: isNight ? '#2ecc71' : '#7b4a6b' }}
                    >
                      {t('healthTitle')}
                    </h3>
                  </button>

                  {/* Finance */}
                  <button
                    onClick={() => handleTopicClick('finance')}
                    className={`group p-4 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                      selectedTopic === 'finance' ? 'ring-2 ring-amber-400 ring-offset-2' : ''
                    }`}
                    style={{
                      background: isNight ? 'rgba(255, 215, 0, 0.2)' : 'rgba(244, 198, 122, 0.4)',
                      border: selectedTopic === 'finance'
                        ? `2px solid ${isNight ? '#ffd700' : '#f4c67a'}`
                        : isNight ? '1px solid rgba(255, 215, 0, 0.3)' : '1px solid rgba(244, 198, 122, 0.4)',
                    }}
                  >
                    <div className="text-3xl mb-2">💰</div>
                    <h3
                      className="text-sm font-semibold transition-all duration-300"
                      style={{ color: isNight ? '#ffd700' : '#f4c67a' }}
                    >
                      {t('financeTitle')}
                    </h3>
                  </button>
                </div>

                {/* Question Form */}
                <form onSubmit={handleQuestionSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="question"
                      className="block mb-2 transition-all duration-500"
                      style={{ color: isNight ? '#a29bfe' : '#7b4a6b' }}
                    >
                      {t('questionLabel')}
                    </label>
                    <textarea
                      id="question"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg backdrop-blur-sm focus:outline-none resize-none transition-all duration-300"
                      style={{
                        background: isNight ? 'rgba(10, 10, 26, 0.6)' : 'rgba(255, 236, 210, 0.6)',
                        border: isNight ? '1px solid rgba(162, 155, 254, 0.3)' : '1px solid rgba(199, 127, 89, 0.4)',
                        color: isNight ? '#ffffff' : '#4a3f35',
                      }}
                      placeholder={t('questionPlaceholder')}
                      rows={3}
                      required
                    />
                    <p
                      className="text-xs mt-1 transition-all duration-500"
                      style={{ color: isNight ? 'rgba(162, 155, 254, 0.5)' : 'rgba(123, 74, 107, 0.5)' }}
                    >
                      {t('questionHint')}
                    </p>
                  </div>

                  {error && (
                    <p className="text-[#e84393] text-center">{error}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      background: isNight
                        ? 'linear-gradient(to right, #ffeaa7, #f8b739)'
                        : 'linear-gradient(to right, #f4c67a, #c17f59)',
                      color: isNight ? '#0a0a1a' : '#ffecd2',
                      boxShadow: isNight ? '0 10px 40px rgba(255, 234, 167, 0.2)' : '0 10px 40px rgba(199, 127, 89, 0.3)',
                    }}
                  >
                    {t('submitBtn')}
                  </button>
                </form>

                <button
                  onClick={() => setPredictionMode(null)}
                  className="mt-4 w-full py-3 rounded-lg transition-all duration-300"
                  style={{
                    border: isNight ? '1px solid rgba(162, 155, 254, 0.3)' : '1px solid rgba(199, 127, 89, 0.4)',
                    color: isNight ? '#a29bfe' : '#7b4a6b',
                    background: 'transparent',
                  }}
                >
                  {t('backToModeBtn')}
                </button>
              </>
            )}

            {/* Question Mode: Direct question input + result */}
            {predictionMode === 'question' && (
              <>
                {!fortune && !isLoading && (
                  <form onSubmit={handleDirectQuestionSubmit} className="space-y-4">
                    <p
                      className="text-center mb-4 transition-all duration-500"
                      style={{ color: isNight ? '#a29bfe' : '#7b4a6b' }}
                    >
                      {t('directQuestionLabel')}
                    </p>
                    <div>
                      <label
                        htmlFor="directQuestion"
                        className="block mb-2 transition-all duration-500"
                        style={{ color: isNight ? '#a29bfe' : '#7b4a6b' }}
                      >
                        {t('yourQuestionLabel')}
                      </label>
                      <textarea
                        id="directQuestion"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg backdrop-blur-sm focus:outline-none resize-none transition-all duration-300"
                        style={{
                          background: isNight ? 'rgba(10, 10, 26, 0.6)' : 'rgba(255, 236, 210, 0.6)',
                          border: isNight ? '1px solid rgba(162, 155, 254, 0.3)' : '1px solid rgba(199, 127, 89, 0.4)',
                          color: isNight ? '#ffffff' : '#4a3f35',
                        }}
                        placeholder={t('directQuestionPlaceholder')}
                        rows={4}
                        required
                      />
                    </div>

                    {error && (
                      <p className="text-[#e84393] text-center">{error}</p>
                    )}

                    <button
                      type="submit"
                      className="w-full py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                      style={{
                        background: isNight
                          ? 'linear-gradient(to right, #a29bfe, #6c5ce7)'
                          : 'linear-gradient(to right, #7b4a6b, #4a2c5a)',
                        color: '#ffecd2',
                        boxShadow: isNight ? '0 10px 40px rgba(162, 155, 254, 0.2)' : '0 10px 40px rgba(74, 44, 90, 0.3)',
                      }}
                    >
                      {t('askOracleBtn')}
                    </button>

                    <button
                      onClick={() => {
                        setPredictionMode(null);
                        setQuestion('');
                        setError(null);
                      }}
                      className="mt-4 w-full py-3 rounded-lg transition-all duration-300"
                      style={{
                        border: isNight ? '1px solid rgba(162, 155, 254, 0.3)' : '1px solid rgba(199, 127, 89, 0.4)',
                        color: isNight ? '#a29bfe' : '#7b4a6b',
                        background: 'transparent',
                      }}
                    >
                      {t('backToModeBtn')}
                    </button>
                  </form>
                )}

                {isLoading && (
                  <div className="text-center">
                    <div
                      className="inline-flex items-center gap-3"
                      style={{ color: isNight ? '#a29bfe' : '#7b4a6b' }}
                    >
                      <div
                        className="animate-spin w-6 h-6 border-2 border-t-transparent rounded-full"
                        style={{ borderColor: isNight ? '#a29bfe' : '#7b4a6b', borderTopColor: 'transparent' }}
                      ></div>
                      {t('consulting')}
                    </div>
                  </div>
                )}

                {fortune && predictionMode === 'question' && (
                  <div className="space-y-6">
                    {/* Oracle Answer */}
                    <div
                      className="p-6 rounded-xl backdrop-blur-sm transition-all duration-500"
                      style={{
                        background: isNight ? 'rgba(10, 10, 26, 0.6)' : 'rgba(255, 236, 210, 0.7)',
                        border: isNight ? '1px solid rgba(162, 155, 254, 0.3)' : '1px solid rgba(199, 127, 89, 0.3)',
                      }}
                    >
                      <h3
                        className="text-xl font-semibold text-center mb-4 transition-all duration-500"
                        style={{ color: isNight ? '#a29bfe' : '#4a2c5a' }}
                      >
                        {t('oracleAnswerTitle')}
                      </h3>
                      <p
                        className="text-sm mb-4 text-center"
                        style={{ color: isNight ? 'rgba(162, 155, 254, 0.6)' : 'rgba(123, 74, 107, 0.6)' }}
                      >
                        {t('yourQuestionWas')}: "{question}"
                      </p>
                      <div
                        className="leading-relaxed whitespace-pre-line transition-all duration-500"
                        style={{ color: isNight ? '#ffffff' : '#4a3f35' }}
                      >
                        {fortune}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={() => {
                          setFortune(null);
                          setQuestion('');
                        }}
                        className="px-6 py-3 rounded-lg transition-all duration-300"
                        style={{
                          border: isNight ? '1px solid rgba(162, 155, 254, 0.5)' : '1px solid rgba(199, 127, 89, 0.5)',
                          color: isNight ? '#a29bfe' : '#4a2c5a',
                          background: 'transparent',
                        }}
                      >
                        {t('askAnotherBtn')}
                      </button>
                      <button
                        onClick={handleReset}
                        className="px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300"
                        style={{
                          background: isNight
                            ? 'linear-gradient(to right, #a29bfe, #6c5ce7)'
                            : 'linear-gradient(to right, #7b4a6b, #4a2c5a)',
                          color: '#ffecd2',
                        }}
                      >
                        {t('startNewBtn')}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Prophecy Mode: Life Guidance */}
            {predictionMode === 'prophecy' && (
              <>
                {!fortune && !isLoading && (
                  <form onSubmit={handleProphecySubmit} className="space-y-4">
                    <p
                      className="text-center mb-4 transition-all duration-500"
                      style={{ color: isNight ? '#fd79a8' : '#c17f59' }}
                    >
                      {t('prophecyLifeDesc')}
                    </p>
                    <div>
                      <label
                        htmlFor="prophecyQuestion"
                        className="block mb-2 transition-all duration-500"
                        style={{ color: isNight ? '#fd79a8' : '#c17f59' }}
                      >
                        {t('yourQuestionLabel')}
                      </label>
                      <textarea
                        id="prophecyQuestion"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg backdrop-blur-sm focus:outline-none resize-none transition-all duration-300"
                        style={{
                          background: isNight ? 'rgba(10, 10, 26, 0.6)' : 'rgba(255, 236, 210, 0.6)',
                          border: isNight ? '1px solid rgba(253, 121, 168, 0.3)' : '1px solid rgba(193, 127, 89, 0.4)',
                          color: isNight ? '#ffffff' : '#4a3f35',
                        }}
                        placeholder={t('prophecyLifePlaceholder')}
                        rows={4}
                        required
                      />
                    </div>

                    {error && (
                      <p className="text-[#e84393] text-center">{error}</p>
                    )}

                    <button
                      type="submit"
                      className="w-full py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                      style={{
                        background: isNight
                          ? 'linear-gradient(to right, #fd79a8, #e84393)'
                          : 'linear-gradient(to right, #c17f59, #daa06d)',
                        color: '#ffecd2',
                        boxShadow: isNight ? '0 10px 40px rgba(253, 121, 168, 0.2)' : '0 10px 40px rgba(199, 127, 89, 0.3)',
                      }}
                    >
                      {t('prophecyLifeBtn')}
                    </button>

                    <button
                      onClick={() => {
                        setPredictionMode(null);
                        setQuestion('');
                        setError(null);
                      }}
                      className="mt-4 w-full py-3 rounded-lg transition-all duration-300"
                      style={{
                        border: isNight ? '1px solid rgba(253, 121, 168, 0.3)' : '1px solid rgba(199, 127, 89, 0.4)',
                        color: isNight ? '#fd79a8' : '#c17f59',
                        background: 'transparent',
                      }}
                    >
                      {t('backToModeBtn')}
                    </button>
                  </form>
                )}

                {isLoading && (
                  <div className="text-center">
                    <div
                      className="inline-flex items-center gap-3"
                      style={{ color: isNight ? '#fd79a8' : '#c17f59' }}
                    >
                      <div
                        className="animate-spin w-6 h-6 border-2 border-t-transparent rounded-full"
                        style={{ borderColor: isNight ? '#fd79a8' : '#c17f59', borderTopColor: 'transparent' }}
                      ></div>
                      {t('consulting')}
                    </div>
                  </div>
                )}

                {fortune && predictionMode === 'prophecy' && (
                  <div className="space-y-6">
                    {/* Prophecy Answer */}
                    <div
                      className="p-6 rounded-xl backdrop-blur-sm transition-all duration-500"
                      style={{
                        background: isNight ? 'rgba(10, 10, 26, 0.6)' : 'rgba(255, 236, 210, 0.7)',
                        border: isNight ? '1px solid rgba(253, 121, 168, 0.3)' : '1px solid rgba(193, 127, 89, 0.4)',
                      }}
                    >
                      <h3
                        className="text-xl font-semibold text-center mb-4 transition-all duration-500"
                        style={{ color: isNight ? '#fd79a8' : '#c17f59' }}
                      >
                        Your Sacred Prophecy
                      </h3>
                      <p
                        className="text-sm mb-4 text-center"
                        style={{ color: isNight ? 'rgba(253, 121, 168, 0.6)' : 'rgba(193, 127, 89, 0.6)' }}
                      >
                        {t('yourQuestionWas')}: "{question}"
                      </p>
                      <div
                        className="leading-relaxed whitespace-pre-line transition-all duration-500"
                        style={{ color: isNight ? '#ffffff' : '#4a3f35' }}
                      >
                        {fortune}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={() => {
                          setFortune(null);
                          setQuestion('');
                        }}
                        className="px-6 py-3 rounded-lg transition-all duration-300"
                        style={{
                          border: isNight ? '1px solid rgba(253, 121, 168, 0.5)' : '1px solid rgba(193, 127, 89, 0.5)',
                          color: isNight ? '#fd79a8' : '#c17f59',
                          background: 'transparent',
                        }}
                      >
                        Seek Another Prophecy
                      </button>
                      <button
                        onClick={handleReset}
                        className="px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300"
                        style={{
                          background: isNight
                            ? 'linear-gradient(to right, #fd79a8, #e84393)'
                            : 'linear-gradient(to right, #c17f59, #daa06d)',
                          color: '#ffecd2',
                        }}
                      >
                        {t('startNewBtn')}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Back to Step 1 (only show when no mode selected or topic mode without fortune) */}
            {(!predictionMode || (predictionMode === 'topic' && !fortune)) && (
              <button
                onClick={() => setStep(1)}
                className="mt-4 w-full py-3 rounded-lg transition-all duration-300"
                style={{
                  border: isNight ? '1px solid rgba(162, 155, 254, 0.3)' : '1px solid rgba(199, 127, 89, 0.4)',
                  color: isNight ? '#a29bfe' : '#7b4a6b',
                  background: 'transparent',
                }}
              >
                {t('backBtn')}
              </button>
            )}
          </section>
        )}

        {/* Step 3: Oracle Cards */}
        {step === 3 && (
          <section
            className="backdrop-blur-md rounded-xl p-8 shadow-2xl transition-all duration-500"
            style={{
              background: isNight ? 'rgba(26, 26, 58, 0.4)' : 'rgba(255, 236, 210, 0.5)',
              border: isNight ? '1px solid rgba(255, 234, 167, 0.2)' : '1px solid rgba(199, 127, 89, 0.3)',
            }}
          >
            <h2
              className="text-2xl font-semibold mb-4 text-center transition-all duration-500"
              style={{ color: isNight ? '#ffeaa7' : '#4a2c5a' }}
            >
              {t('step3Title')}
            </h2>
            <p
              className="text-center mb-2 transition-all duration-500"
              style={{ color: isNight ? '#a29bfe' : '#7b4a6b' }}
            >
              {t('step3Subtitle')} <span style={{ color: isNight ? '#fd79a8' : '#c17f59', fontWeight: 600 }}>{selectedTopic ? topicLabels[selectedTopic] : ''}</span> {t('step3Reading')}
            </p>
            <p
              className="text-center mb-8 text-sm transition-all duration-500"
              style={{ color: isNight ? 'rgba(162, 155, 254, 0.6)' : 'rgba(123, 74, 107, 0.5)' }}
            >
              Your question: "{question}"
            </p>

            <div className="flex justify-center mb-8">
              <OracleCardDeck
                key={deckKey}
                onCardSelect={handleCardSelect}
                onReset={() => {
                  setSelectedCard(null);
                  setFortune(null);
                }}
              />
            </div>

            {/* Fortune Result */}
            {selectedCard && fortune && (
              <div className="mt-8 space-y-6">
                {/* Fortune Reading */}
                <div
                  className="p-6 rounded-xl backdrop-blur-sm transition-all duration-500"
                  style={{
                    background: isNight ? 'rgba(10, 10, 26, 0.6)' : 'rgba(255, 236, 210, 0.7)',
                    border: isNight ? '1px solid rgba(255, 234, 167, 0.3)' : '1px solid rgba(199, 127, 89, 0.4)',
                  }}
                >
                  <h3
                    className="text-xl font-semibold text-center mb-4 transition-all duration-500"
                    style={{ color: isNight ? '#ffeaa7' : '#4a2c5a' }}
                  >
                    {t('fortuneTitle')}
                  </h3>
                  <div
                    className="leading-relaxed whitespace-pre-line transition-all duration-500"
                    style={{ color: isNight ? '#ffffff' : '#4a3f35' }}
                  >
                    {fortune}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleDrawAnother}
                    className="px-6 py-3 rounded-lg transition-all duration-300"
                    style={{
                      border: isNight ? '1px solid rgba(255, 234, 167, 0.5)' : '1px solid rgba(199, 127, 89, 0.5)',
                      color: isNight ? '#ffeaa7' : '#4a2c5a',
                      background: 'transparent',
                    }}
                  >
                    {t('drawAnotherBtn')}
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300"
                    style={{
                      background: isNight
                        ? 'linear-gradient(to right, #ffeaa7, #f8b739)'
                        : 'linear-gradient(to right, #f4c67a, #c17f59)',
                      color: isNight ? '#0a0a1a' : '#ffecd2',
                    }}
                  >
                    {t('startNewBtn')}
                  </button>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="mt-8 text-center">
                <div
                  className="inline-flex items-center gap-3"
                  style={{ color: isNight ? '#a29bfe' : '#7b4a6b' }}
                >
                  <div
                    className="animate-spin w-6 h-6 border-2 border-t-transparent rounded-full"
                    style={{ borderColor: isNight ? '#ffeaa7' : '#c17f59', borderTopColor: 'transparent' }}
                  ></div>
                  {t('consulting')}
                </div>
              </div>
            )}

            {error && (
              <p className="mt-4 text-[#e84393] text-center">{error}</p>
            )}

            <button
              onClick={() => setStep(2)}
              className="mt-4 w-full py-3 rounded-lg transition-all duration-300"
              style={{
                border: isNight ? '1px solid rgba(162, 155, 254, 0.3)' : '1px solid rgba(199, 127, 89, 0.4)',
                color: isNight ? '#a29bfe' : '#7b4a6b',
                background: 'transparent',
              }}
            >
              {t('backTopicBtn')}
            </button>
          </section>
        )}

        {/* Footer */}
        <footer
          className="text-center mt-12 text-sm transition-all duration-500"
          style={{ color: isNight ? 'rgba(162, 155, 254, 0.5)' : 'rgba(123, 74, 107, 0.5)' }}
        >
          {t('footer')}
        </footer>
      </div>
    </div>
  );
}