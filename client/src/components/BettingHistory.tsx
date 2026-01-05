import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Winner } from '@/lib/baccarat-logic';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface BetRecord {
  id: string;
  playerBet: number;
  bankerBet: number;
  tieBet: number;
  winner: Winner;
  payout: number;
  totalBet: number;
}

interface BettingHistoryProps {
  records: BetRecord[];
  maxRecords?: number;
}

export function BettingHistory({ records, maxRecords = 10 }: BettingHistoryProps) {
  const displayRecords = records.slice(-maxRecords).reverse();

  const getWinnerColor = (winner: Winner) => {
    switch (winner) {
      case 'player':
        return 'text-blue-400 bg-blue-900/20';
      case 'banker':
        return 'text-red-400 bg-red-900/20';
      case 'tie':
        return 'text-green-400 bg-green-900/20';
      default:
        return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getWinnerLabel = (winner: Winner) => {
    switch (winner) {
      case 'player':
        return 'Player';
      case 'banker':
        return 'Banker';
      case 'tie':
        return 'Tie';
      default:
        return '-';
    }
  };

  const calculateProfit = (record: BetRecord) => {
    return record.payout - record.totalBet;
  };

  const totalProfit = displayRecords.reduce((sum, record) => sum + calculateProfit(record), 0);
  const winCount = displayRecords.filter(r => calculateProfit(r) > 0).length;
  const loseCount = displayRecords.filter(r => calculateProfit(r) < 0).length;

  return (
    <div className="w-full h-full flex flex-col bg-black/40 backdrop-blur-md rounded-lg border border-white/10 overflow-hidden">
      {/* 헤더 */}
      <div className="px-3 py-2 border-b border-white/10 bg-black/60">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">배팅 내역</h3>
        <div className="flex items-center justify-between mt-1 text-xs">
          <span className="text-green-400 font-mono">
            {displayRecords.length} 게임
          </span>
          <div className="flex gap-2">
            <span className={cn("font-mono", totalProfit >= 0 ? 'text-green-400' : 'text-red-400')}>
              {totalProfit >= 0 ? '+' : ''}{totalProfit.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 통계 */}
      <div className="px-3 py-2 border-b border-white/10 bg-black/40 grid grid-cols-3 gap-2 text-[10px]">
        <div className="text-center">
          <div className="text-green-400 font-bold">{winCount}</div>
          <div className="text-muted-foreground">승</div>
        </div>
        <div className="text-center">
          <div className="text-red-400 font-bold">{loseCount}</div>
          <div className="text-muted-foreground">패</div>
        </div>
        <div className="text-center">
          <div className={cn("font-bold", totalProfit >= 0 ? 'text-green-400' : 'text-red-400')}>
            {((winCount / (winCount + loseCount)) * 100 || 0).toFixed(0)}%
          </div>
          <div className="text-muted-foreground">승률</div>
        </div>
      </div>

      {/* 기록 리스트 */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <AnimatePresence mode="popLayout">
          {displayRecords.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
              아직 게임 기록이 없습니다
            </div>
          ) : (
            displayRecords.map((record, idx) => {
              const profit = calculateProfit(record);
              const isWin = profit > 0;

              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="px-3 py-2 border-b border-white/5 hover:bg-white/5 transition-colors text-[11px]"
                >
                  <div className="flex items-center justify-between gap-2">
                    {/* 순번 */}
                    <span className="text-muted-foreground w-4">#{displayRecords.length - idx}</span>

                    {/* 결과 */}
                    <div className={cn("px-2 py-1 rounded font-bold flex-1 text-center", getWinnerColor(record.winner))}>
                      {getWinnerLabel(record.winner)}
                    </div>

                    {/* 베팅 정보 */}
                    <div className="text-xs text-muted-foreground">
                      {record.playerBet > 0 && <span className="text-blue-400">P:{record.playerBet}</span>}
                      {record.bankerBet > 0 && <span className="text-red-400"> B:{record.bankerBet}</span>}
                      {record.tieBet > 0 && <span className="text-green-400"> T:{record.tieBet}</span>}
                    </div>

                    {/* 수익 */}
                    <div className={cn(
                      "font-mono font-bold w-16 text-right flex items-center justify-end gap-1",
                      isWin ? 'text-green-400' : 'text-red-400'
                    )}>
                      {isWin ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {isWin ? '+' : ''}{profit.toLocaleString()}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
