'use client';

import { useState, useEffect } from 'react';

interface Star {
  id: string;
  width: number;
  height: number;
  top: number;
  left: number;
  color: string;
  animationDelay: number;
  animationDuration: number;
  isBright?: boolean;
}

export default function Stars() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate stars only on client side
    const generatedStars: Star[] = [];

    // Layer 1 - white twinkling stars
    for (let i = 0; i < 50; i++) {
      generatedStars.push({
        id: `star1-${i}`,
        width: Math.random() * 2 + 1,
        height: Math.random() * 2 + 1,
        top: Math.random() * 100,
        left: Math.random() * 100,
        color: 'white',
        animationDelay: Math.random() * 3,
        animationDuration: Math.random() * 2 + 2,
      });
    }

    // Layer 2 - colored twinkling stars
    for (let i = 0; i < 30; i++) {
      const colors = ['#ffeaa7', '#a29bfe', '#fd79a8'];
      generatedStars.push({
        id: `star2-${i}`,
        width: Math.random() * 2 + 1,
        height: Math.random() * 2 + 1,
        top: Math.random() * 100,
        left: Math.random() * 100,
        color: colors[i % 3],
        animationDelay: Math.random() * 4,
        animationDuration: Math.random() * 3 + 3,
      });
    }

    // Layer 3 - larger bright stars
    for (let i = 0; i < 15; i++) {
      generatedStars.push({
        id: `star3-${i}`,
        width: 3,
        height: 3,
        top: Math.random() * 100,
        left: Math.random() * 100,
        color: 'white',
        animationDelay: Math.random() * 5,
        animationDuration: 3,
        isBright: true,
      });
    }

    setStars(generatedStars);
  }, []);

  return (
    <div className="absolute inset-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute rounded-full ${star.isBright ? 'animate-twinkle-bright' : 'animate-twinkle'}`}
          style={{
            width: `${star.width}px`,
            height: `${star.height}px`,
            top: `${star.top}%`,
            left: `${star.left}%`,
            background: star.isBright
              ? 'radial-gradient(circle, white 0%, transparent 70%)'
              : star.color,
            boxShadow: star.isBright ? '0 0 6px 2px rgba(255, 255, 255, 0.5)' : undefined,
            animationDelay: `${star.animationDelay}s`,
            animationDuration: `${star.animationDuration}s`,
          }}
        />
      ))}
    </div>
  );
}