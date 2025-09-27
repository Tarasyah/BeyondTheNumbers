// src/components/layout/stars-background.tsx
"use client";

import { useState, useEffect, type CSSProperties } from 'react';

type Star = {
  id: number;
  style: CSSProperties;
  className: string;
};

export const StarsBackground = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [showStars, setShowStars] = useState(false);

  useEffect(() => {
    // Only generate stars on the client-side to prevent hydration mismatch
    setShowStars(true);
    const generateStars = () => {
      const newStars: Star[] = [];
      const numStars = 500;

      for (let i = 0; i < numStars; i++) {
        const size = Math.random() * 2 + 1;
        newStars.push({
          id: i,
          style: {
            width: `${size}px`,
            height: `${size}px`,
            top: `${Math.random() * 200}vh`, // Distribute across double the viewport height
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${Math.random() * 20 + 20}s`, // Duration between 20s and 40s
          },
          className: 'animate-move-twinkle',
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, []);

  if (!showStars) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute rounded-full bg-white ${star.className}`}
          style={star.style}
        />
      ))}
    </div>
  );
};
