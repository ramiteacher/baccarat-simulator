import React from 'react';
import { Winner } from '@/lib/baccarat-logic';
import { cn } from '@/lib/utils';

interface RoadmapProps {
  history: Winner[];
  className?: string;
}

export function Roadmap({ history, className }: RoadmapProps) {
  // Bead Plate (Main Road) - Simple grid showing history
  // Usually 6 rows by many columns
  const rows = 6;
  const cols = 20;
  
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

  return (
    <div className={cn("w-full overflow-x-auto bg-white/5 border border-white/10 rounded-lg p-2", className)}>
      <div className="flex flex-col gap-1 min-w-max">
        {grid.map((row, rIndex) => (
          <div key={rIndex} className="flex gap-1">
            {row.map((cell, cIndex) => (
              <div 
                key={`${rIndex}-${cIndex}`} 
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border border-white/5",
                  cell === 'player' && "bg-blue-500 text-white border-blue-300",
                  cell === 'banker' && "bg-red-500 text-white border-red-300",
                  cell === 'tie' && "bg-green-500 text-white border-green-300",
                  !cell && "bg-transparent"
                )}
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
  );
}
