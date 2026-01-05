import React, { useEffect, useRef } from 'react';
import { Winner } from '@/lib/baccarat-logic';
import { cn } from '@/lib/utils';

interface RoadmapProps {
  history: Winner[];
  className?: string;
}

export function Roadmap({ history, className }: RoadmapProps) {
  // Bead Plate (Main Road) - Simple grid showing history
  // 6 rows, 동적 열 (게임이 진행되면서 자동 확장)
  const rows = 6;
  
  // 필요한 열 수 계산 (게임 수 / 행 수, 올림)
  const totalGames = history.length;
  const cols = Math.max(20, Math.ceil(totalGames / rows) + 2);
  
  // Create a grid
  const grid = Array(rows).fill(null).map(() => Array(cols).fill(null));
  
  // Fill grid column by column
  history.forEach((winner, index) => {
    const col = Math.floor(index / rows);
    const row = index % rows;
    if (col < cols) {
      grid[row][col] = winner;
    }
  });

  // 스크롤을 최우측으로 자동 이동
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, [totalGames]); // totalGames이 변할 때마다 실행

  return (
    <div className={cn("w-full h-full flex flex-col bg-white/5 border border-white/10 rounded-lg p-2", className)}>
      {/* 헤더 */}
      <div className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">
        본매 (Bead Plate)
      </div>

      {/* 본매 그리드 */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
      >
        <div className="flex flex-col gap-1 min-w-max pb-2 pr-2">
          {grid.map((row, rIndex) => (
            <div key={rIndex} className="flex gap-1 items-center">
              {/* 행 번호 */}
              <div className="text-[9px] text-muted-foreground font-mono w-4 text-center flex-shrink-0 font-bold">
                {rIndex + 1}
              </div>

              {/* 셀들 */}
              {row.map((cell, cIndex) => (
                <div 
                  key={`${rIndex}-${cIndex}`} 
                  className={cn(
                    "w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold border flex-shrink-0 transition-all",
                    cell === 'player' && "bg-blue-500 text-white border-blue-300 shadow-lg shadow-blue-500/50",
                    cell === 'banker' && "bg-red-500 text-white border-red-300 shadow-lg shadow-red-500/50",
                    cell === 'tie' && "bg-green-500 text-white border-green-300 shadow-lg shadow-green-500/50",
                    !cell && "bg-white/5 border-white/10"
                  )}
                  title={cell ? `${cell === 'player' ? 'Player' : cell === 'banker' ? 'Banker' : 'Tie'} - Game #${totalGames - (cols - cIndex - 1) * rows + rIndex + 1}` : ''}
                >
                  {cell === 'player' && 'P'}
                  {cell === 'banker' && 'B'}
                  {cell === 'tie' && 'T'}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 통계 */}
      <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>총 {totalGames} 게임</span>
          <div className="flex gap-3">
            <span className="text-blue-400">
              P: {history.filter(w => w === 'player').length}
            </span>
            <span className="text-red-400">
              B: {history.filter(w => w === 'banker').length}
            </span>
            <span className="text-green-400">
              T: {history.filter(w => w === 'tie').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
