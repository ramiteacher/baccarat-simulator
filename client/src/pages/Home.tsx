import React, { useState } from 'react';
import { useBaccaratGame } from '@/hooks/useBaccaratGame';
import { PlayingCard } from '@/components/PlayingCard';
import { Chip } from '@/components/Chip';
import { Roadmap } from '@/components/Roadmap';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Trophy, AlertCircle } from 'lucide-react';

export default function Home() {
  const {
    playerHand,
    bankerHand,
    playerScore,
    bankerScore,
    gameStatus,
    winner,
    history,
    balance,
    currentBets,
    lastWinAmount,
    placeBet,
    clearBets,
    startGame,
    resetGame
  } = useBaccaratGame();

  const [selectedChip, setSelectedChip] = useState(1000);
  const chipValues = [1000, 5000, 10000, 50000, 100000, 500000];

  const handleBet = (type: 'player' | 'banker' | 'tie') => {
    placeBet(type, selectedChip);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-hidden font-sans">
      {/* Header */}
      <header className="h-14 bg-black/50 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center font-bold text-black">B</div>
          <h1 className="font-bold text-lg tracking-wider hidden sm:block">BACCARAT <span className="text-primary font-light">SIMULATOR</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Balance</span>
            <span className="font-mono font-bold text-lg text-yellow-400">₩ {balance.toLocaleString()}</span>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col relative">
        
        {/* Table Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 pb-32 sm:pb-40 relative">
          
          {/* Dealer / Result Message */}
          <div className="absolute top-4 sm:top-8 z-20 text-center w-full pointer-events-none">
            <AnimatePresence>
              {winner && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "inline-block px-8 py-3 rounded-full border-2 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-xl",
                    winner === 'player' ? "bg-blue-900/80 border-blue-500 text-blue-100" :
                    winner === 'banker' ? "bg-red-900/80 border-red-500 text-red-100" :
                    "bg-green-900/80 border-green-500 text-green-100"
                  )}
                >
                  <div className="flex items-center gap-2 text-2xl font-black uppercase tracking-widest">
                    <Trophy className="w-6 h-6" />
                    {winner === 'tie' ? 'TIE GAME' : `${winner.toUpperCase()} WINS`}
                  </div>
                  {lastWinAmount > 0 && (
                    <div className="text-sm font-mono mt-1 text-yellow-300">
                      + ₩ {lastWinAmount.toLocaleString()}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cards Layout */}
          <div className="w-full max-w-4xl grid grid-cols-2 gap-8 sm:gap-16 mb-8">
            
            {/* Player Side */}
            <div className="flex flex-col items-center">
              <div className={cn(
                "mb-4 text-2xl sm:text-4xl font-black tracking-widest uppercase transition-all duration-300",
                winner === 'player' ? "text-blue-400 neon-text-player scale-110" : "text-blue-500/50"
              )}>
                Player
                <span className="block text-sm sm:text-lg font-mono text-center mt-1 opacity-80">
                  {playerScore}
                </span>
              </div>
              <div className="flex justify-center -space-x-8 sm:-space-x-12">
                {playerHand.map((card, i) => (
                  <PlayingCard key={card.id} card={card} index={i} />
                ))}
                {playerHand.length === 0 && (
                  <>
                    <div className="w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-36 border-2 border-dashed border-blue-500/20 rounded-lg" />
                    <div className="w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-36 border-2 border-dashed border-blue-500/20 rounded-lg -ml-8 sm:-ml-12" />
                  </>
                )}
              </div>
            </div>

            {/* Banker Side */}
            <div className="flex flex-col items-center">
              <div className={cn(
                "mb-4 text-2xl sm:text-4xl font-black tracking-widest uppercase transition-all duration-300",
                winner === 'banker' ? "text-red-400 neon-text-banker scale-110" : "text-red-500/50"
              )}>
                Banker
                <span className="block text-sm sm:text-lg font-mono text-center mt-1 opacity-80">
                  {bankerScore}
                </span>
              </div>
              <div className="flex justify-center -space-x-8 sm:-space-x-12">
                {bankerHand.map((card, i) => (
                  <PlayingCard key={card.id} card={card} index={i} />
                ))}
                {bankerHand.length === 0 && (
                  <>
                    <div className="w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-36 border-2 border-dashed border-red-500/20 rounded-lg" />
                    <div className="w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-36 border-2 border-dashed border-red-500/20 rounded-lg -ml-8 sm:-ml-12" />
                  </>
                )}
              </div>
            </div>

          </div>

          {/* Betting Areas */}
          <div className="w-full max-w-2xl grid grid-cols-3 gap-2 sm:gap-4 mt-auto">
            
            {/* Player Bet */}
            <button
              onClick={() => handleBet('player')}
              disabled={gameStatus !== 'betting'}
              className={cn(
                "relative h-24 sm:h-32 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-200 group overflow-hidden",
                "bg-blue-900/20 border-blue-500/30 hover:bg-blue-900/40 hover:border-blue-400",
                currentBets.player > 0 && "bg-blue-900/50 border-blue-400 neon-box-player",
                winner === 'player' && "ring-4 ring-blue-400 ring-offset-2 ring-offset-black"
              )}
            >
              <span className="text-blue-300 font-bold tracking-wider mb-1">PLAYER</span>
              <span className="text-xs text-blue-400/60 mb-2">1 : 1</span>
              {currentBets.player > 0 && (
                <div className="bg-black/60 px-3 py-1 rounded-full border border-blue-500/50">
                  <span className="text-blue-200 font-mono font-bold">₩ {currentBets.player.toLocaleString()}</span>
                </div>
              )}
            </button>

            {/* Tie Bet */}
            <button
              onClick={() => handleBet('tie')}
              disabled={gameStatus !== 'betting'}
              className={cn(
                "relative h-24 sm:h-32 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-200 group overflow-hidden",
                "bg-green-900/20 border-green-500/30 hover:bg-green-900/40 hover:border-green-400",
                currentBets.tie > 0 && "bg-green-900/50 border-green-400 shadow-[0_0_15px_rgba(0,255,0,0.2)]",
                winner === 'tie' && "ring-4 ring-green-400 ring-offset-2 ring-offset-black"
              )}
            >
              <span className="text-green-300 font-bold tracking-wider mb-1">TIE</span>
              <span className="text-xs text-green-400/60 mb-2">1 : 9</span>
              {currentBets.tie > 0 && (
                <div className="bg-black/60 px-3 py-1 rounded-full border border-green-500/50">
                  <span className="text-green-200 font-mono font-bold">₩ {currentBets.tie.toLocaleString()}</span>
                </div>
              )}
            </button>

            {/* Banker Bet */}
            <button
              onClick={() => handleBet('banker')}
              disabled={gameStatus !== 'betting'}
              className={cn(
                "relative h-24 sm:h-32 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-200 group overflow-hidden",
                "bg-red-900/20 border-red-500/30 hover:bg-red-900/40 hover:border-red-400",
                currentBets.banker > 0 && "bg-red-900/50 border-red-400 neon-box-banker",
                winner === 'banker' && "ring-4 ring-red-400 ring-offset-2 ring-offset-black"
              )}
            >
              <span className="text-red-300 font-bold tracking-wider mb-1">BANKER</span>
              <span className="text-xs text-red-400/60 mb-2">1 : 0.95</span>
              {currentBets.banker > 0 && (
                <div className="bg-black/60 px-3 py-1 rounded-full border border-red-500/50">
                  <span className="text-red-200 font-mono font-bold">₩ {currentBets.banker.toLocaleString()}</span>
                </div>
              )}
            </button>

          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 p-4 pb-6 z-30">
          <div className="max-w-5xl mx-auto flex flex-col gap-4">
            
            {/* Chips Selector */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {chipValues.map(val => (
                <Chip
                  key={val}
                  value={val}
                  selected={selectedChip === val}
                  onClick={() => setSelectedChip(val)}
                  disabled={gameStatus !== 'betting'}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearBets}
                  disabled={gameStatus !== 'betting' || (currentBets.player === 0 && currentBets.banker === 0 && currentBets.tie === 0)}
                  className="border-red-500/50 text-red-400 hover:bg-red-950/50"
                >
                  Clear
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={resetGame}
                  disabled={gameStatus === 'dealing'}
                  className="border-white/20 text-white/70 hover:bg-white/10"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>

              <Button
                size="lg"
                onClick={startGame}
                disabled={gameStatus !== 'betting' || (currentBets.player === 0 && currentBets.banker === 0 && currentBets.tie === 0)}
                className={cn(
                  "w-full max-w-xs font-bold text-lg tracking-widest transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]",
                  gameStatus === 'betting' 
                    ? "bg-gradient-to-r from-yellow-600 to-yellow-400 text-black hover:scale-105" 
                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
                )}
              >
                {gameStatus === 'dealing' ? 'DEALING...' : 'DEAL'}
              </Button>

              <div className="w-[100px] hidden sm:block" /> {/* Spacer for centering */}
            </div>
          </div>
        </div>

        {/* Roadmap Overlay (Desktop: Right Side, Mobile: Top/Modal? Let's put it floating top right for now or inline) */}
        {/* Let's put it as a floating panel on desktop, or collapsible */}
        <div className="absolute top-20 right-4 z-10 hidden lg:block w-64">
          <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-2">
            <h3 className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">Roadmap (Bead Plate)</h3>
            <Roadmap history={history} />
          </div>
        </div>

      </main>
    </div>
  );
}
