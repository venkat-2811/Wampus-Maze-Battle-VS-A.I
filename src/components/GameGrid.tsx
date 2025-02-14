import React from 'react';
import { Cell } from './Cell';
import { isValidMove, Position, GRID_SIZE } from '@/lib/gameLogic';

interface GameGridProps {
  grid: number[][];
  playerPosition: Position;
  aiPosition: Position;
  onPlayerMove: (x: number, y: number) => void;
}

export const GameGrid: React.FC<GameGridProps> = ({
  grid,
  playerPosition,
  aiPosition,
  onPlayerMove,
}) => {
  const isAdjacent = (x: number, y: number): boolean => {
    const adjacentPositions = [
      { x: x - 1, y },
      { x: x + 1, y },
      { x, y: y - 1 },
      { x, y: y + 1 },
    ];

    return adjacentPositions.some(
      pos =>
        isValidMove(pos) &&
        ((pos.x === playerPosition.x && pos.y === playerPosition.y) ||
         (pos.x === aiPosition.x && pos.y === aiPosition.y))
    );
  };

  const isCellVisible = (x: number, y: number): boolean => {
    return (
      (x === playerPosition.x && y === playerPosition.y) ||
      (x === aiPosition.x && y === aiPosition.y)
    );
  };

  return (
    <div className="grid gap-1 p-4 bg-gray-800 rounded-lg animate-fade-in overflow-auto max-h-[80vh]">
      {grid.map((row, y) => (
        <div key={y} className="flex gap-1">
          {row.map((cell, x) => (
            <Cell
              key={`${x}-${y}`}
              type={cell}
              isPlayer={x === playerPosition.x && y === playerPosition.y}
              isAI={x === aiPosition.x && y === aiPosition.y}
              onClick={() => onPlayerMove(x, y)}
              isVisible={isCellVisible(x, y)}
              isAdjacent={isAdjacent(x, y)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};