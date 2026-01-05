import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ChipProps {
  value: number;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Chip({ value, onClick, selected, disabled, className }: ChipProps) {
  const getChipImage = (val: number) => {
    switch (val) {
      case 1000: return '/images/chip-1000.png';
      case 5000: return '/images/chip-5000.png';
      case 10000: return '/images/chip-10000.png';
      case 50000: return '/images/chip-50000.png';
      case 100000: return '/images/chip-100000.png';
      case 500000: return '/images/chip-500000.png';
      default: return '/images/chip-1000.png';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative rounded-full transition-all duration-200 focus:outline-none",
        selected && "ring-4 ring-white ring-offset-2 ring-offset-black",
        disabled && "opacity-50 cursor-not-allowed grayscale",
        className
      )}
    >
      <img 
        src={getChipImage(value)} 
        alt={`${value} Chip`} 
        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 drop-shadow-lg"
      />
      {/* Value Label for accessibility/clarity */}
      <span className="sr-only">{value.toLocaleString()}</span>
    </motion.button>
  );
}
