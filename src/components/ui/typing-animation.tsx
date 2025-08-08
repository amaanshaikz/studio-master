'use client';

import React, { useState, useEffect } from 'react';

interface TypingAnimationProps {
  text: string;
  speed?: number; // milliseconds per character
  onComplete?: () => void;
  className?: string;
}

export function TypingAnimation({ 
  text, 
  speed = 15, 
  onComplete, 
  className = "" 
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text || typeof text !== 'string') return;

    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= text.length) {
          setIsComplete(true);
          onComplete?.();
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  useEffect(() => {
    if (typeof text === 'string') {
      setDisplayedText(text.slice(0, currentIndex));
    }
  }, [currentIndex, text]);

  if (!text || typeof text !== 'string') {
    return <div className={className}>No content to display</div>;
  }

  return (
    <div className={className}>
      <span className="whitespace-pre-wrap">{displayedText}</span>
      {!isComplete && (
        <span className="inline-block w-0.5 h-4 bg-primary animate-pulse ml-0.5" />
      )}
    </div>
  );
}
