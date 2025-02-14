import React from 'react';
import { Square, Circle, Skull, CoinsIcon, Wind, Flame } from 'lucide-react';

interface CellProps {
  type: number;
  isPlayer: boolean;
  isAI: boolean;
  onClick: () => void;
  isVisible?: boolean;
  isAdjacent?: boolean;
}

export const Cell: React.FC<CellProps> = ({ 
  type, 
  isPlayer, 
  isAI, 
  onClick, 
  isVisible = false,
  isAdjacent = false 
}) => {
  const getCellContent = () => {
    if (isPlayer) {
      return <Circle className="w-6 h-6 text-primary animate-pulse" />;
    }
    if (isAI) {
      return <Square className="w-6 h-6 text-secondary animate-pulse" />;
    }

    // Only show breeze and stench when adjacent
    if (!isVisible && !isAdjacent && !isPlayer && !isAI) {
      return <div className="w-6 h-6 bg-gray-800" />;
    }

    switch (type) {
      case 1: // Pit
        return isVisible ? <Skull className="w-6 h-6 text-destructive" /> : null;
      case 2: // Gold
        return isVisible ? <CoinsIcon className="w-6 h-6 text-yellow-400" /> : null;
      case 3: // Wumpus
        return isVisible ? <Flame className="w-6 h-6 text-red-500" /> : null;
      case 4: // Breeze
        return isAdjacent ? <Wind className="w-6 h-6 text-blue-400 opacity-50" /> : null;
      case 5: // Stench
        return isAdjacent ? <Wind className="w-6 h-6 text-green-400 opacity-50" /> : null;
      default:
        return null;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`w-10 h-10 bg-gray-700 rounded flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors ${
        !isVisible && !isAdjacent && !isPlayer && !isAI ? 'bg-gray-900' : ''
      }`}
    >
      {getCellContent()}
    </div>
  );
};