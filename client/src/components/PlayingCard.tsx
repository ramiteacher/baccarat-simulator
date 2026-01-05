import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/lib/baccarat-logic';
import { motion } from 'framer-motion';
import { soundManager } from '@/lib/sounds';
import { cn } from '@/lib/utils';

interface PlayingCardProps {
  card: Card;
  index: number;
  onSqueezeComplete?: () => void;
}

const SUIT_SYMBOLS = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠'
};

const SUIT_COLORS = {
  hearts: 'text-red-500',
  diamonds: 'text-red-500',
  clubs: 'text-black',
  spades: 'text-black'
};

export function PlayingCard({ card, index, onSqueezeComplete }: PlayingCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isSqueezing, setIsSqueezing] = useState(false);
  const [squeezeProgress, setSqueezeProgress] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const lastSoundTime = useRef(0);

  // 카드 자동 공개
  useEffect(() => {
    const delay = index * 300 + 500;
    const timer = setTimeout(() => {
      setIsRevealed(true);
      soundManager.cardFlip();
    }, delay);
    return () => clearTimeout(timer);
  }, [index]);

  // 마우스 또는 터치로 카드 쪼기
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isRevealed || !cardRef.current) return;
    touchStartY.current = e.clientY;
    setIsSqueezing(true);
    soundManager.squeezeStart();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isRevealed || !cardRef.current) return;
    touchStartY.current = e.touches[0].clientY;
    setIsSqueezing(true);
    soundManager.squeezeStart();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSqueezing || isRevealed) return;
    const delta = Math.abs(e.clientY - touchStartY.current);
    const progress = Math.min(delta / 100, 1);
    setSqueezeProgress(progress);

    // 진행 중 사운드 (0.3 이상일 때만)
    if (progress > 0.3) {
      const now = Date.now();
      if (now - lastSoundTime.current > 150) {
        soundManager.squeezeProgress();
        lastSoundTime.current = now;
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSqueezing || isRevealed) return;
    const delta = Math.abs(e.touches[0].clientY - touchStartY.current);
    const progress = Math.min(delta / 100, 1);
    setSqueezeProgress(progress);

    // 진행 중 사운드 (0.3 이상일 때만)
    if (progress > 0.3) {
      const now = Date.now();
      if (now - lastSoundTime.current > 150) {
        soundManager.squeezeProgress();
        lastSoundTime.current = now;
      }
    }
  };

  const handleMouseUp = () => {
    if (!isSqueezing) return;
    
    if (squeezeProgress > 0.5) {
      setIsRevealed(true);
      soundManager.squeezeComplete();
      onSqueezeComplete?.();
    } else {
      setSqueezeProgress(0);
    }
    setIsSqueezing(false);
  };

  const handleTouchEnd = () => {
    if (!isSqueezing) return;
    
    if (squeezeProgress > 0.5) {
      setIsRevealed(true);
      soundManager.squeezeComplete();
      onSqueezeComplete?.();
    } else {
      setSqueezeProgress(0);
    }
    setIsSqueezing(false);
  };

  useEffect(() => {
    if (isSqueezing) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove as any);
      document.addEventListener('touchend', handleTouchEnd);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove as any);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isSqueezing, squeezeProgress]);

  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: -50, scale: 0.8, rotateY: 180 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isSqueezing ? 0.95 : 1,
        rotateY: isRevealed ? 0 : 180
      }}
      transition={{ duration: 0.4, delay: index * 0.2, type: "spring" }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      className={cn(
        "w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-36 rounded-lg relative flex items-center justify-center font-bold",
        "select-none transition-all shadow-xl border border-white/10",
        isSqueezing && "cursor-grabbing",
        !isRevealed && "cursor-grab hover:scale-105"
      )}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* 카드 뒷면 */}
      <motion.div
        className={cn(
          "absolute inset-0 rounded-lg flex items-center justify-center",
          "bg-cover bg-center border border-white/10"
        )}
        style={{ backgroundImage: "url('/images/card-back.png')" }}
        animate={{
          opacity: isRevealed ? 0 : 1,
          pointerEvents: isRevealed ? 'none' : 'auto'
        }}
      >
        {/* 쪼기 힌트 */}
        {!isSqueezing && (
          <motion.div
            className="absolute bottom-2 text-[10px] text-white/60 font-bold text-center px-1"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            쪼기
          </motion.div>
        )}
      </motion.div>

      {/* 카드 앞면 */}
      <motion.div
        className={cn(
          "absolute inset-0 rounded-lg flex flex-col justify-between p-1 sm:p-2",
          "bg-white border border-gray-300 shadow-lg",
          isRed ? "text-red-600" : "text-black"
        )}
        animate={{
          opacity: isRevealed ? 1 : 0,
          pointerEvents: isRevealed ? 'auto' : 'none'
        }}
      >
        {/* 쪼기 진행 표시 */}
        {isSqueezing && squeezeProgress > 0 && (
          <motion.div
            className="absolute inset-0 bg-yellow-300/20 rounded-lg"
            animate={{ opacity: squeezeProgress }}
          />
        )}

        {/* 왼쪽 위 */}
        <div className="text-xs sm:text-sm font-bold leading-none">
          <div>{card.rank}</div>
          <div>{SUIT_SYMBOLS[card.suit]}</div>
        </div>

        {/* 중앙 큰 심볼 */}
        <div className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl opacity-20">
          {SUIT_SYMBOLS[card.suit]}
        </div>

        {/* 오른쪽 아래 (회전) */}
        <div className="text-xs sm:text-sm font-bold leading-none rotate-180 self-end text-right">
          <div>{card.rank}</div>
          <div>{SUIT_SYMBOLS[card.suit]}</div>
        </div>

        {/* 쪼기 진행률 표시 */}
        {isSqueezing && squeezeProgress > 0 && (
          <motion.div
            className="absolute bottom-1 text-[10px] font-bold text-blue-600 bg-white/80 px-1 rounded"
            animate={{ opacity: [0.5, 1] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          >
            {Math.round(squeezeProgress * 100)}%
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
