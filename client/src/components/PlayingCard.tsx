import React from 'react';
import { Card } from '@/lib/baccarat-logic';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface PlayingCardProps {
  card?: Card;
  hidden?: boolean;
  index: number;
  className?: string;
}

export function PlayingCard({ card, hidden, index, className }: PlayingCardProps) {
  // Card dimensions usually 2.5 x 3.5 ratio
  
  const getSuitIcon = (suit: string) => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };

  const isRed = card?.suit === 'hearts' || card?.suit === 'diamonds';

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.2, type: "spring" }}
      className={cn(
        "relative w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-36 rounded-lg shadow-xl border border-white/10 overflow-hidden select-none transform transition-transform hover:scale-105",
        className
      )}
    >
      {hidden ? (
        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/images/card-back.png')" }}>
          {/* Back design */}
        </div>
      ) : card ? (
        <div className="w-full h-full bg-white flex flex-col justify-between p-1 sm:p-2">
          <div className={cn("text-sm sm:text-lg font-bold leading-none", isRed ? "text-red-600" : "text-black")}>
            <div>{card.rank}</div>
            <div>{getSuitIcon(card.suit)}</div>
          </div>
          
          <div className={cn("absolute inset-0 flex items-center justify-center text-4xl sm:text-5xl opacity-20", isRed ? "text-red-600" : "text-black")}>
            {getSuitIcon(card.suit)}
          </div>

          <div className={cn("text-sm sm:text-lg font-bold leading-none rotate-180 self-end text-right", isRed ? "text-red-600" : "text-black")}>
            <div>{card.rank}</div>
            <div>{getSuitIcon(card.suit)}</div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-white/5 border-2 border-dashed border-white/20 rounded-lg" />
      )}
    </motion.div>
  );
}
