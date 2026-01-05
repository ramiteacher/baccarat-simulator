import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface InitialBalanceDialogProps {
  onConfirm: (balance: number) => void;
  isOpen: boolean;
}

const PRESET_AMOUNTS = [100000, 500000, 1000000, 5000000, 10000000];

export function InitialBalanceDialog({ onConfirm, isOpen }: InitialBalanceDialogProps) {
  const [input, setInput] = useState('1000000');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    const amount = parseInt(input.replace(/,/g, ''), 10);
    
    if (isNaN(amount) || amount <= 0) {
      setError('유효한 금액을 입력해주세요');
      return;
    }
    
    if (amount > 100000000) {
      setError('최대 1억원까지만 설정 가능합니다');
      return;
    }
    
    onConfirm(amount);
  };

  const handlePreset = (amount: number) => {
    setInput(amount.toLocaleString());
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (/^\d*$/.test(value)) {
      setInput(value ? parseInt(value).toLocaleString() : '');
      setError('');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl"
      >
        <h2 className="text-3xl font-black text-center mb-2 tracking-wider">
          시작 자금 설정
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-6">
          게임을 시작할 초기 자금을 입력해주세요
        </p>

        {/* Input Field */}
        <div className="mb-6">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-yellow-400">₩</span>
            <Input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="금액 입력"
              className={cn(
                "pl-8 text-xl font-mono font-bold text-center bg-black/50 border-2 transition-all",
                error 
                  ? "border-red-500 focus:border-red-400" 
                  : "border-white/20 focus:border-blue-400"
              )}
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
          )}
        </div>

        {/* Preset Buttons */}
        <div className="mb-8">
          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-widest">빠른 선택</p>
          <div className="grid grid-cols-2 gap-2">
            {PRESET_AMOUNTS.map(amount => (
              <button
                key={amount}
                onClick={() => handlePreset(amount)}
                className={cn(
                  "py-2 px-3 rounded-lg border-2 text-sm font-bold transition-all",
                  input === amount.toLocaleString()
                    ? "bg-blue-900/50 border-blue-400 text-blue-200"
                    : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20"
                )}
              >
                {(amount / 1000000).toFixed(amount % 1000000 === 0 ? 0 : 1)}M
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-bold text-lg hover:scale-105 transition-transform"
          >
            시작하기
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          게임 중 언제든 리셋 버튼으로 초기화할 수 있습니다
        </p>
      </motion.div>
    </motion.div>
  );
}
