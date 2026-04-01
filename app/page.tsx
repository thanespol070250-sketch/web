'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useLanguage } from './components/LanguageContext';
import { useTheme } from './components/ThemeContext';
import LanguageSwitcher from './components/LanguageSwitcher';
import ThemeSwitcher from './components/ThemeSwitcher';

type Topic = 'love' | 'studies' | 'personality';

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

const topicTranslations = {
  love: { en: 'love', th: 'ความรัก' },
  studies: { en: 'studies', th: 'การศึกษา' },
  personality: { en: 'personality', th: 'บุคลิก' },
};

export default function FortuneTellerPage() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const isNight = theme === 'night';
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    question: '',
  });
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedCard, setSelectedCard] = useState<OracleCard | null>(null);
  const [fortune, setFortune] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deckKey, setDeckKey] = useState(0);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.name && formData.dateOfBirth && formData.question) {
      setStep(2);
      setError(null);
    } else {
      setError(t('errorFill'));
    }
  };

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setStep(3);
  };

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
          question: formData.question,
          topic: selectedTopic,
          card: card,
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
    setFormData({ name: '', dateOfBirth: '', question: '' });
    setSelectedTopic(null);
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
          : 'linear-gradient(to bottom, #87CEEB, #E0F6FF, #FFF8E7)',
        color: isNight ? '#ededed' : '#2d3748',
      }}
    >
      {/* Celestial overlay with sun/moon */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {isNight ? (
          <>
            {/* Stars background */}
            <div className="absolute inset-0">
              {/* Twinkling stars layer 1 */}
              {[...Array(50)].map((_, i) => (
                <div
                  key={`star1-${i}`}
                  className="absolute rounded-full animate-twinkle"
                  style={{
                    width: Math.random() * 2 + 1 + 'px',
                    height: Math.random() * 2 + 1 + 'px',
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                    background: 'white',
                    animationDelay: Math.random() * 3 + 's',
                    animationDuration: Math.random() * 2 + 2 + 's',
                  }}
                />
              ))}
              {/* Twinkling stars layer 2 - colored */}
              {[...Array(30)].map((_, i) => (
                <div
                  key={`star2-${i}`}
                  className="absolute rounded-full animate-twinkle"
                  style={{
                    width: Math.random() * 2 + 1 + 'px',
                    height: Math.random() * 2 + 1 + 'px',
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                    background: i % 3 === 0 ? '#ffeaa7' : i % 3 === 1 ? '#a29bfe' : '#fd79a8',
                    animationDelay: Math.random() * 4 + 's',
                    animationDuration: Math.random() * 3 + 3 + 's',
                  }}
                />
              ))}
              {/* Larger bright stars */}
              {[...Array(15)].map((_, i) => (
                <div
                  key={`star3-${i}`}
                  className="absolute animate-twinkle-bright"
                  style={{
                    width: '3px',
                    height: '3px',
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                    background: 'radial-gradient(circle, white 0%, transparent 70%)',
                    boxShadow: '0 0 6px 2px rgba(255, 255, 255, 0.5)',
                    animationDelay: Math.random() * 5 + 's',
                  }}
                />
              ))}
            </div>
            {/* Moon glow */}
            <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-gradient-radial from-[#ffeaa7]/20 via-[#ffeaa7]/10 to-transparent blur-3xl animate-pulse"></div>
            {/* Moon */}
            <div className="absolute top-20 right-20 w-16 h-16 rounded-full bg-gradient-to-br from-[#ffeaa7] to-[#f5cd79] shadow-[0_0_40px_rgba(255,234,167,0.4)]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1a1a3a]/40 to-transparent"></div>
            </div>
          </>
        ) : (
          <>
            {/* Sun glow */}
            <div className="absolute top-5 right-5 w-80 h-80 rounded-full bg-gradient-radial from-[#ffd93d]/30 via-[#ffb347]/15 to-transparent blur-3xl"></div>
            {/* Sun core */}
            <div className="absolute top-12 right-12 w-28 h-28 rounded-full bg-gradient-to-br from-[#fff5cc] via-[#ffd93d] to-[#ff9f43] shadow-[0_0_100px_rgba(255,217,61,0.8)]">
              <div className="absolute inset-3 rounded-full bg-gradient-to-br from-[#fffef5] to-[#ffd93d]"></div>
            </div>

            {/* Animated Clouds */}
            <div className="absolute animate-cloud-1">
              <div className="relative">
                <div className="w-48 h-16 bg-white/80 rounded-full blur-sm"></div>
                <div className="absolute -top-4 left-8 w-32 h-12 bg-white/90 rounded-full blur-sm"></div>
                <div className="absolute -top-2 left-24 w-24 h-10 bg-white/85 rounded-full blur-sm"></div>
              </div>
            </div>
            <div className="absolute animate-cloud-2">
              <div className="relative">
                <div className="w-56 h-14 bg-white/75 rounded-full blur-sm"></div>
                <div className="absolute -top-3 left-12 w-28 h-10 bg-white/80 rounded-full blur-sm"></div>
                <div className="absolute -top-1 left-32 w-20 h-8 bg-white/70 rounded-full blur-sm"></div>
              </div>
            </div>
            <div className="absolute animate-cloud-3">
              <div className="relative">
                <div className="w-40 h-12 bg-white/70 rounded-full blur-sm"></div>
                <div className="absolute -top-2 left-6 w-24 h-8 bg-white/75 rounded-full blur-sm"></div>
                <div className="absolute top-0 left-20 w-16 h-6 bg-white/65 rounded-full blur-sm"></div>
              </div>
            </div>
            <div className="absolute animate-cloud-4">
              <div className="relative">
                <div className="w-44 h-10 bg-white/60 rounded-full blur-sm"></div>
                <div className="absolute -top-2 left-10 w-20 h-7 bg-white/65 rounded-full blur-sm"></div>
              </div>
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
            style={{
              background: isNight ? 'rgba(255, 234, 167, 0.3)' : 'rgba(255, 217, 61, 0.4)',
            }}
          ></div>
          <div
            className="absolute w-3 h-3 rounded-full top-[25%] right-[20%] animate-float-slow"
            style={{
              background: isNight ? 'rgba(162, 155, 254, 0.2)' : 'rgba(135, 206, 235, 0.4)',
            }}
          ></div>
          <div
            className="absolute w-2 h-2 rounded-full bottom-[30%] left-[25%] animate-float"
            style={{
              background: isNight ? 'rgba(253, 121, 168, 0.25)' : 'rgba(255, 159, 67, 0.3)',
            }}
          ></div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* Header */}
        <header className="text-center mb-12 relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <ThemeSwitcher />
            </div>
            <LanguageSwitcher />
          </div>
          <h1
            className="magic-title text-5xl font-bold text-transparent bg-clip-text mb-4 transition-all duration-500"
            style={{
              backgroundImage: isNight
                ? 'linear-gradient(to right, #ffeaa7, #f8b739, #ffeaa7)'
                : 'linear-gradient(to right, #ff9f43, #ffd93d, #ff9f43)',
            }}
          >
            {t('title')}
          </h1>
          <p
            className="text-lg italic transition-all duration-500"
            style={{ color: isNight ? '#a29bfe' : '#4a5568' }}
          >
            {t('subtitle')}
          </p>
        </header>

        {/* Step 1: User Info */}
        {step === 1 && (
          <section
            className="backdrop-blur-md rounded-xl p-8 shadow-2xl transition-all duration-500"
            style={{
              background: isNight ? 'rgba(26, 26, 58, 0.4)' : 'rgba(255, 255, 255, 0.7)',
              border: isNight ? '1px solid rgba(255, 234, 167, 0.2)' : '1px solid rgba(255, 159, 67, 0.3)',
            }}
          >
            <h2
              className="text-2xl font-semibold mb-6 text-center transition-all duration-500"
              style={{ color: isNight ? '#ffeaa7' : '#c05621' }}
            >
              {t('step1Title')}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 transition-all duration-500"
                  style={{ color: isNight ? '#a29bfe' : '#4a5568' }}
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
                    background: isNight ? 'rgba(10, 10, 26, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                    border: isNight ? '1px solid rgba(162, 155, 254, 0.3)' : '1px solid rgba(193, 193, 193, 0.5)',
                    color: isNight ? '#ffffff' : '#2d3748',
                  }}
                  placeholder={t('namePlaceholder')}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="dob"
                  className="block mb-2 transition-all duration-500"
                  style={{ color: isNight ? '#a29bfe' : '#4a5568' }}
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
                    background: isNight ? 'rgba(10, 10, 26, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                    border: isNight ? '1px solid rgba(162, 155, 254, 0.3)' : '1px solid rgba(193, 193, 193, 0.5)',
                    color: isNight ? '#ffffff' : '#2d3748',
                  }}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="question"
                  className="block mb-2 transition-all duration-500"
                  style={{ color: isNight ? '#a29bfe' : '#4a5568' }}
                >
                  {t('questionLabel')}
                </label>
                <textarea
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg backdrop-blur-sm focus:outline-none resize-none transition-all duration-300"
                  style={{
                    background: isNight ? 'rgba(10, 10, 26, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                    border: isNight ? '1px solid rgba(162, 155, 254, 0.3)' : '1px solid rgba(193, 193, 193, 0.5)',
                    color: isNight ? '#ffffff' : '#2d3748',
                  }}
                  placeholder={t('questionPlaceholder')}
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
                    ? 'linear-gradient(to right, #ffeaa7, #f8b739)'
                    : 'linear-gradient(to right, #ff9f43, #ffd93d)',
                  color: isNight ? '#0a0a1a' : '#ffffff',
                  boxShadow: isNight ? '0 10px 40px rgba(255, 234, 167, 0.2)' : '0 10px 40px rgba(255, 159, 67, 0.3)',
                }}
              >
                {t('continueBtn')}
              </button>
            </form>
          </section>
        )}

        {/* Step 2: Topic Selection */}
        {step === 2 && (
          <section
            className="backdrop-blur-md rounded-xl p-8 shadow-2xl transition-all duration-500"
            style={{
              background: isNight ? 'rgba(26, 26, 58, 0.4)' : 'rgba(255, 255, 255, 0.7)',
              border: isNight ? '1px solid rgba(255, 234, 167, 0.2)' : '1px solid rgba(255, 159, 67, 0.3)',
            }}
          >
            <h2
              className="text-2xl font-semibold mb-6 text-center transition-all duration-500"
              style={{ color: isNight ? '#ffeaa7' : '#c05621' }}
            >
              {t('step2Title')}
            </h2>
            <p
              className="text-center mb-8 transition-all duration-500"
              style={{ color: isNight ? '#a29bfe' : '#4a5568' }}
            >
              {t('step2Subtitle')}, {formData.name}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Love */}
              <button
                onClick={() => handleTopicSelect('love')}
                className="group p-6 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
                style={{
                  background: isNight ? 'rgba(232, 67, 147, 0.2)' : 'rgba(255, 182, 193, 0.4)',
                  border: isNight ? '1px solid rgba(253, 121, 168, 0.3)' : '1px solid rgba(255, 105, 180, 0.4)',
                }}
              >
                <div className="text-4xl mb-4">💕</div>
                <h3
                  className="text-xl font-semibold transition-all duration-300"
                  style={{ color: isNight ? '#fd79a8' : '#d53f8c' }}
                >
                  {t('loveTitle')}
                </h3>
                <p
                  className="text-sm mt-2 transition-all duration-300"
                  style={{ color: isNight ? 'rgba(253, 121, 168, 0.7)' : 'rgba(213, 63, 140, 0.7)' }}
                >
                  {t('loveDesc')}
                </p>
              </button>

              {/* Studies */}
              <button
                onClick={() => handleTopicSelect('studies')}
                className="group p-6 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
                style={{
                  background: isNight ? 'rgba(162, 155, 254, 0.2)' : 'rgba(135, 206, 235, 0.4)',
                  border: isNight ? '1px solid rgba(162, 155, 254, 0.3)' : '1px solid rgba(70, 130, 180, 0.4)',
                }}
              >
                <div className="text-4xl mb-4">📚</div>
                <h3
                  className="text-xl font-semibold transition-all duration-300"
                  style={{ color: isNight ? '#a29bfe' : '#3182ce' }}
                >
                  {t('studiesTitle')}
                </h3>
                <p
                  className="text-sm mt-2 transition-all duration-300"
                  style={{ color: isNight ? 'rgba(162, 155, 254, 0.7)' : 'rgba(49, 130, 206, 0.7)' }}
                >
                  {t('studiesDesc')}
                </p>
              </button>

              {/* Personality */}
              <button
                onClick={() => handleTopicSelect('personality')}
                className="group p-6 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
                style={{
                  background: isNight ? 'rgba(255, 234, 167, 0.2)' : 'rgba(255, 217, 61, 0.3)',
                  border: isNight ? '1px solid rgba(255, 234, 167, 0.3)' : '1px solid rgba(255, 159, 67, 0.4)',
                }}
              >
                <div className="text-4xl mb-4">🌟</div>
                <h3
                  className="text-xl font-semibold transition-all duration-300"
                  style={{ color: isNight ? '#ffeaa7' : '#c05621' }}
                >
                  {t('personalityTitle')}
                </h3>
                <p
                  className="text-sm mt-2 transition-all duration-300"
                  style={{ color: isNight ? 'rgba(255, 234, 167, 0.7)' : 'rgba(192, 86, 33, 0.7)' }}
                >
                  {t('personalityDesc')}
                </p>
              </button>
            </div>

            <button
              onClick={() => setStep(1)}
              className="mt-8 w-full py-3 rounded-lg transition-all duration-300"
              style={{
                border: isNight ? '1px solid rgba(162, 155, 254, 0.3)' : '1px solid rgba(193, 193, 193, 0.5)',
                color: isNight ? '#a29bfe' : '#4a5568',
                background: 'transparent',
              }}
            >
              {t('backBtn')}
            </button>
          </section>
        )}

        {/* Step 3: Oracle Cards */}
        {step === 3 && (
          <section
            className="backdrop-blur-md rounded-xl p-8 shadow-2xl transition-all duration-500"
            style={{
              background: isNight ? 'rgba(26, 26, 58, 0.4)' : 'rgba(255, 255, 255, 0.7)',
              border: isNight ? '1px solid rgba(255, 234, 167, 0.2)' : '1px solid rgba(255, 159, 67, 0.3)',
            }}
          >
            <h2
              className="text-2xl font-semibold mb-4 text-center transition-all duration-500"
              style={{ color: isNight ? '#ffeaa7' : '#c05621' }}
            >
              {t('step3Title')}
            </h2>
            <p
              className="text-center mb-8 transition-all duration-500"
              style={{ color: isNight ? '#a29bfe' : '#4a5568' }}
            >
              {t('step3Subtitle')} <span style={{ color: isNight ? '#fd79a8' : '#d53f8c', fontWeight: 600 }}>{selectedTopic ? topicTranslations[selectedTopic][language] : ''}</span> {t('step3Reading')}
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
                    background: isNight ? 'rgba(10, 10, 26, 0.6)' : 'rgba(255, 248, 231, 0.8)',
                    border: isNight ? '1px solid rgba(255, 234, 167, 0.3)' : '1px solid rgba(255, 159, 67, 0.3)',
                  }}
                >
                  <h3
                    className="text-xl font-semibold text-center mb-4 transition-all duration-500"
                    style={{ color: isNight ? '#ffeaa7' : '#c05621' }}
                  >
                    {t('fortuneTitle')}
                  </h3>
                  <div
                    className="leading-relaxed whitespace-pre-line transition-all duration-500"
                    style={{ color: isNight ? '#ffffff' : '#2d3748' }}
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
                      border: isNight ? '1px solid rgba(255, 234, 167, 0.5)' : '1px solid rgba(255, 159, 67, 0.5)',
                      color: isNight ? '#ffeaa7' : '#c05621',
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
                        : 'linear-gradient(to right, #ff9f43, #ffd93d)',
                      color: isNight ? '#0a0a1a' : '#ffffff',
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
                  style={{ color: isNight ? '#a29bfe' : '#4a5568' }}
                >
                  <div
                    className="animate-spin w-6 h-6 border-2 border-t-transparent rounded-full"
                    style={{ borderColor: isNight ? '#ffeaa7' : '#ff9f43', borderTopColor: 'transparent' }}
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
                border: isNight ? '1px solid rgba(162, 155, 254, 0.3)' : '1px solid rgba(193, 193, 193, 0.5)',
                color: isNight ? '#a29bfe' : '#4a5568',
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
          style={{ color: isNight ? 'rgba(162, 155, 254, 0.5)' : 'rgba(74, 85, 104, 0.5)' }}
        >
          {t('footer')}
        </footer>
      </div>
    </div>
  );
}