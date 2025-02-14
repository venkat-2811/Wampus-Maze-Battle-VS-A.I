import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface GameControlsProps {
  onReset: () => void;
  playerScore: number;
  aiScore: number;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onReset,
  playerScore,
  aiScore,
}) => {
  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gray-800 rounded-lg animate-fade-in">
      <div className="flex gap-8">
        <div className="text-center">
          <h3 className="text-lg font-bold text-primary">Player</h3>
          <p className="text-2xl">{playerScore}</p>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-secondary">AI</h3>
          <p className="text-2xl">{aiScore}</p>
        </div>
      </div>
      <Button onClick={onReset} variant="outline" className="gap-2">
        <RefreshCw className="w-4 h-4" />
        Reset Game
      </Button>
    </div>
  );
};