'use client';

import { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import { useLanguage } from './LanguageContext';

interface OracleCardDeckProps {
  onCardSelect: (card: OracleCard) => void;
  onReset?: () => void;
  onShuffle?: () => void;
}

export interface OracleCard {
  id: number;
  name: string;
  nameTh: string;
  symbol: string;
  meaning: string;
  meaningTh: string;
}

const oracleCards: OracleCard[] = [
  {
    id: 1,
    name: 'The Moon',
    nameTh: 'พระจันทร์',
    symbol: '🌙',
    meaning: 'The Moon illuminates the shadows of your soul. Trust your intuition and embrace the mysteries that lie beneath the surface. Hidden truths are waiting to be discovered in the quiet moments of reflection.',
    meaningTh: 'พระจันทร์ส่องแสงในเงามืดของจิตใจคุณ เชื่อมั่นในสัญชาณญาณและยอมรับความลึกลับที่อยู่ใต้ผิวหน้า ความจริงที่ซ่อนอยู่รอการค้นพบในช่วงเวลาแห่งการสะท้อนคิด',
  },
  {
    id: 2,
    name: 'The Sun',
    nameTh: 'พระอาทิตย์',
    symbol: '☀️',
    meaning: 'The Sun shines brightly upon your path, bringing warmth, joy, and abundant energy. Success and vitality flow toward you. Embrace optimism and let your authentic self radiate with confidence.',
    meaningTh: 'พระอาทิตย์ส่องแสงสว่างบนเส้นทางของคุณ นำความอบอุ่น ความสุข และพลังงานมากมาย ความสำเร็จและพลังชีวิตไหลมาหาคุณ ยอมรับความคิดบวกและปล่อยให้ตัวตนของคุณเปล่งประกายด้วยความมั่นใจ',
  },
  {
    id: 3,
    name: 'The Star',
    nameTh: 'ดาว',
    symbol: '⭐',
    meaning: 'The Star guides you toward hope and inspiration. You are being called to trust in the universe\'s plan for you. Spiritual guidance is available—keep faith in your dreams and reach for the stars.',
    meaningTh: 'ดาวนำทางคุณไปสู่ความหวังและแรงบันดาลใจ คุณถูกเรียกร้องให้เชื่อมั่นในแผนการของจักรวาล คำแนะนำทางจิตวิญญาณมีอยู่—รักษาความเชื่อมั่นในความฝันและมุ่งสู่ดาว',
  },
  {
    id: 4,
    name: 'The Heart',
    nameTh: 'หัวใจ',
    symbol: '❤️',
    meaning: 'The Heart pulses with love and deep emotional connections. Open yourself to compassion, both giving and receiving. Relationships flourish when nurtured with authenticity and vulnerability.',
    meaningTh: 'หัวใจเต้นระรัวด้วยความรักและการเชื่อมโยงอารมณ์ลึกซึ้ง เปิดรับความเมตตา ทั้งการให้และการรับ ความสัมพันธ์เบ่งบานเมื่อได้รับการดูแลด้วยความจริงใจและความเปิดเผย',
  },
  {
    id: 5,
    name: 'The Key',
    nameTh: 'กุญแจ',
    symbol: '🔑',
    meaning: 'The Key appears to unlock doors that have long been closed. Solutions to your challenges are within reach. Trust that the universe is providing opportunities for growth and transformation.',
    meaningTh: 'กุญแจปรากฏเพื่อเปิดประตูที่ปิดมานาน ทางแก้ไขปัญหาของคุณอยู่ใกล้แค่เอื้อม เชื่อมั่นว่าจักรวาลกำลังมอบโอกาสแห่งการเติบโตและการเปลี่ยนแปลง',
  },
  {
    id: 6,
    name: 'The Book',
    nameTh: 'ตำรา',
    symbol: '📖',
    meaning: 'The Book holds ancient wisdom and secrets waiting to be revealed. Knowledge comes to those who seek it with an open mind. Pay attention to signs and messages from unexpected sources.',
    meaningTh: 'ตำราเก็บความรู้โบราณและความลับที่รอการเปิดเผย ความรู้จะมาหาผู้ที่แสวงหาด้วยจิตใจที่เปิดกว้าง ใส่ใจกับสัญญาณและข้อความจากแหล่งที่ไม่คาดคิด',
  },
  {
    id: 7,
    name: 'The Path',
    nameTh: 'เส้นทาง',
    symbol: '🛤️',
    meaning: 'The Path unfolds before you, winding through destiny\'s landscape. Your journey is unique and sacred. Each step brings you closer to your true purpose—walk with courage and intention.',
    meaningTh: 'เส้นทางเปิดออกก่อนคุณ ไต่เตาะไปตามภูมิประเทศแห่งชะตา การเดินทางของคุณมีเอกลักษณ์และศักดิ์สิทธิ์ ทุกก้าวนำคุณใกล้ชิดกับจุดประสงค์ที่แท้จริง—เดินด้วยความกล้าหาญและความตั้งใจ',
  },
  {
    id: 8,
    name: 'The Candle',
    nameTh: 'เทียน',
    symbol: '🕯️',
    meaning: 'The Candle illuminates the darkness, revealing what was once hidden. Inner wisdom burns bright within you. Trust your inner light to guide you through uncertain times and illuminate your way.',
    meaningTh: 'เทียนส่องแสงในความมืด เปิดเผยสิ่งที่ซ่อนอยู่ ความรู้ภายในเผยผลาบในตัวคุณ เชื่อมั่นในแสงสว่างภายในที่จะนำทางคุณผ่านช่วงเวลาที่ไม่แน่นอนและส่องทางของคุณ',
  },
  {
    id: 9,
    name: 'The Anchor',
    nameTh: 'ทุ่น',
    symbol: '⚓',
    meaning: 'The Anchor grounds you in stability and strength. In times of turbulence, remain steadfast in your values. You have the resilience to weather any storm—find peace in your inner foundation.',
    meaningTh: 'ทุ่นยึดคุณให้มั่นคงและแข็งแกร่ง ในช่วงเวลาแห่งความวุ่นวาย ยึดมั่นในคุณค่าของคุณ คุณมีความแข็งแกร่งที่จะฝ่าพายุใดๆ—หาความสงบในรากฐานภายในของคุณ',
  },
  {
    id: 10,
    name: 'The Tower',
    nameTh: 'ปราสาท',
    symbol: '🏛️',
    meaning: 'The Tower stands as a testament to your achievements and ambitions. You are building something lasting and meaningful. Reach for new heights while honoring the foundations you\'ve established.',
    meaningTh: 'ปราสาทยืนหยัดเป็นสัญลักษณ์ของความสำเร็จและความมุ่งมั่นของคุณ คุณกำลังสร้างสิ่งที่ยั่งยืนและมีความหมาย มุ่งสู่ความสูงใหม่ในขณะที่ยกย่องรากฐานที่คุณสร้างไว้',
  },
  {
    id: 11,
    name: 'The Butterfly',
    nameTh: 'ผีเสื้อ',
    symbol: '🦋',
    meaning: 'The Butterfly emerges from its cocoon, symbolizing beautiful transformation. Change is not to be feared but embraced. You are evolving into a more magnificent version of yourself—spread your wings.',
    meaningTh: 'ผีเสื้อโผล่ออกจากดักแมลง สื่อถึงการเปลี่ยนแปลงที่สวยงาม การเปลี่ยนแปลงไม่ควรกลัวแต่ควรยอมรับ คุณกำลังเปลี่ยนเป็นเวอร์ชันที่ยิ่งใหญ่กว่าของตัวเอง—กางปีกออก',
  },
  {
    id: 12,
    name: 'The Lotus',
    nameTh: 'ดอกบัว',
    symbol: '🪷',
    meaning: 'The Lotus rises pure and beautiful from muddy waters. Spiritual awakening and inner peace await you. Through adversity comes growth—embrace your journey toward enlightenment and serenity.',
    meaningTh: 'ดอกบัวผุดบริสุทธิ์และสวยงามจากน้ำที่ขุ่นมัว การตื่นรู้ทางจิตวิญญาณและความสงบภายในรอคุณอยู่ ผ่านความยากลำบากจะได้รับการเติบโต—ยอมรับการเดินทางของคุณไปสู่ความรู้แจ้งและความสงบ',
  },
];

export default function OracleCardDeck({ onCardSelect, onReset, onShuffle }: OracleCardDeckProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isNight = theme === 'night';
  const isThai = language === 'th';
  const [cards, setCards] = useState<OracleCard[]>(() =>
    [...oracleCards].sort(() => Math.random() - 0.5)
  );
  const [isShuffling, setIsShuffling] = useState(true);
  const [selectedCard, setSelectedCard] = useState<OracleCard | null>(null);
  const [revealedCard, setRevealedCard] = useState<OracleCard | null>(null);
  const [showDeck, setShowDeck] = useState(true);
  const [cardRotations, setCardRotations] = useState<number[]>(() =>
    oracleCards.map(() => Math.random() * 20 - 10)
  );

  // Helper to get localized card content (names always in English)
  const getCardName = (card: OracleCard) => card.name; // Always English
  const getCardMeaning = (card: OracleCard) => isThai ? card.meaningTh : card.meaning;

  // Initial shuffle on mount (client-side only)
  useEffect(() => {
    const timer = setTimeout(() => setIsShuffling(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleShuffle = () => {
    setIsShuffling(true);
    setSelectedCard(null);
    setRevealedCard(null);
    setShowDeck(true);
    onReset?.();
    onShuffle?.();

    const shuffled = [...oracleCards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    // Generate new random rotations
    const rotations = shuffled.map(() => Math.random() * 20 - 10);
    setCardRotations(rotations);
    setTimeout(() => setIsShuffling(false), 1500);
  };

  const handleCardClick = (card: OracleCard) => {
    if (isShuffling || selectedCard) return;
    setSelectedCard(card);
    setTimeout(() => {
      setRevealedCard(card);
      setShowDeck(false);
      onCardSelect(card);
    }, 800);
  };

  if (revealedCard) {
    return (
      <div className="relative w-80 h-[32rem] perspective-1500 z-50">
        {/* Subtle glow */}
        <div
          className="absolute inset-0 rounded-xl blur-2xl scale-110 transition-all duration-500"
          style={{
            background: isNight ? 'rgba(255, 234, 167, 0.1)' : 'rgba(255, 159, 67, 0.15)',
          }}
        ></div>

        {/* Main card */}
        <div
          className="absolute inset-0 rounded-xl flex flex-col card-revealed border-2 overflow-hidden transition-all duration-500"
          style={{
            background: isNight
              ? 'linear-gradient(to bottom right, #1a1a3a, #2d2d5a, #1a1a3a)'
              : 'linear-gradient(to bottom right, #fff8e7, #ffffff, #fff8e7)',
            borderColor: isNight ? 'rgba(255, 234, 167, 0.5)' : 'rgba(255, 159, 67, 0.5)',
            boxShadow: isNight
              ? '0 20px 40px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 234, 167, 0.15)'
              : '0 20px 40px -12px rgba(0, 0, 0, 0.15), 0 0 40px rgba(255, 159, 67, 0.2)',
          }}
        >
          {/* Decorative top border */}
          <div
            className="absolute top-0 left-0 right-0 h-2"
            style={{
              background: isNight
                ? 'linear-gradient(to right, #ffeaa7, #a29bfe, #ffeaa7)'
                : 'linear-gradient(to right, #ff9f43, #ffd93d, #ff9f43)',
            }}
          ></div>

          {/* Symbol */}
          <div className="flex items-center justify-center pt-6 pb-4">
            <span className="text-7xl">{revealedCard.symbol}</span>
          </div>

          {/* Name */}
          <h3
            className="text-2xl font-bold tracking-wide text-center px-4 transition-all duration-500"
            style={{ color: isNight ? '#ffeaa7' : '#c05621' }}
          >
            {getCardName(revealedCard)}
          </h3>

          {/* Divider */}
          <div
            className="w-11/12 mx-auto h-px my-3"
            style={{
              background: isNight
                ? 'linear-gradient(to right, transparent, rgba(162, 155, 254, 0.6), transparent)'
                : 'linear-gradient(to right, transparent, rgba(255, 159, 67, 0.4), transparent)',
            }}
          ></div>

          {/* Meaning */}
          <div className="flex-1 overflow-y-auto px-5 pb-8">
            <p
              className="text-base text-center leading-relaxed transition-all duration-500"
              style={{ color: isNight ? '#ffffff' : '#2d3748' }}
            >
              {getCardMeaning(revealedCard)}
            </p>
          </div>

          {/* Decorative bottom border */}
          <div
            className="absolute bottom-0 left-0 right-0 h-2"
            style={{
              background: isNight
                ? 'linear-gradient(to right, #ffeaa7, #a29bfe, #ffeaa7)'
                : 'linear-gradient(to right, #ff9f43, #ffd93d, #ff9f43)',
            }}
          ></div>

          {/* Corner decorations */}
          <div
            className="absolute top-3 left-3 text-lg"
            style={{ color: isNight ? 'rgba(255, 234, 167, 0.4)' : 'rgba(255, 159, 67, 0.5)' }}
          >
            {isNight ? '☽' : '☀'}
          </div>
          <div
            className="absolute top-3 right-3 text-lg"
            style={{ color: isNight ? 'rgba(255, 234, 167, 0.4)' : 'rgba(255, 159, 67, 0.5)' }}
          >
            {isNight ? '☾' : '☀'}
          </div>
          <div
            className="absolute bottom-3 left-3 text-lg"
            style={{ color: isNight ? 'rgba(162, 155, 254, 0.4)' : 'rgba(255, 217, 61, 0.5)' }}
          >
            ✧
          </div>
          <div
            className="absolute bottom-3 right-3 text-lg"
            style={{ color: isNight ? 'rgba(162, 155, 254, 0.4)' : 'rgba(255, 217, 61, 0.5)' }}
          >
            ✧
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="relative">
        {isShuffling && (
          <div
            className="text-xl mb-4 animate-pulse text-center transition-all duration-500"
            style={{ color: isNight ? '#ffeaa7' : '#c05621' }}
          >
            {isThai ? 'ไพ่กำลังถูกอวมอง...' : 'The cards are being blessed...'}
          </div>
        )}
        <div className={`grid grid-cols-4 md:grid-cols-6 gap-3 ${isShuffling ? 'shuffle-animation' : ''}`}>
          {showDeck && cards.map((card, index) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={`relative w-16 h-24 md:w-14 md:h-20 cursor-pointer transition-all duration-300 hover:scale-110 hover:-translate-y-2 ${
                selectedCard?.id === card.id ? 'card-selected' : ''
              } ${isShuffling ? 'shuffling' : ''}`}
              style={{
                animationDelay: `${index * 0.05}s`,
                transform: isShuffling && cardRotations[index] !== undefined
                  ? `rotate(${cardRotations[index]}deg) translateX(${(cardRotations[index] || 0) * 0.5}px)`
                  : 'rotate(0deg)',
              }}
            >
              <div
                className="absolute inset-0 rounded-lg shadow-md flex items-center justify-center transition-all duration-300"
                style={{
                  background: isNight
                    ? 'linear-gradient(to bottom right, #1a1a3a, #2d2d5a)'
                    : 'linear-gradient(to bottom right, #fff8e7, #ffffff)',
                  border: isNight
                    ? '1px solid rgba(162, 155, 254, 0.3)'
                    : '1px solid rgba(255, 159, 67, 0.3)',
                }}
              >
                <div
                  className="w-10 h-12 rounded flex items-center justify-center"
                  style={{
                    background: isNight
                      ? 'linear-gradient(to bottom right, #2d2d5a, #1a1a3a)'
                      : 'linear-gradient(to bottom right, #ffffff, #fff8e7)',
                  }}
                >
                  <span
                    className="text-lg"
                    style={{ color: isNight ? '#ffeaa7' : '#c05621' }}
                  >
                    {isNight ? '☽' : '☀'}
                  </span>
                </div>
              </div>
              {selectedCard?.id === card.id && (
                <div
                  className="absolute inset-0 rounded-lg shadow-lg animate-pulse flex items-center justify-center"
                  style={{
                    background: isNight
                      ? 'linear-gradient(to bottom right, #ffeaa7, #f8b739)'
                      : 'linear-gradient(to bottom right, #ff9f43, #ffd93d)',
                  }}
                >
                  <span style={{ color: isNight ? '#0a0a1a' : '#ffffff' }} className="text-2xl">{card.symbol}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {!isShuffling && !selectedCard && (
        <p
          className="text-sm animate-pulse text-center transition-all duration-500"
          style={{ color: isNight ? '#a29bfe' : '#4a5568' }}
        >
          {isThai ? 'แตะไพ่เพื่อเปิดเผยชะตาของคุณ...' : 'Touch a card to reveal your destiny...'}
        </p>
      )}
    </div>
  );
}