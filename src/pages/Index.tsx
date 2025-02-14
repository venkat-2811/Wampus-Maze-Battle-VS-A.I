import React, { useState, useEffect } from 'react';
import { GameGrid } from '@/components/GameGrid';
import { GameControls } from '@/components/GameControls';
import { createInitialGrid, getAIMove, calculateReward, Position, GRID_SIZE, checkGameEnd } from '@/lib/gameLogic';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Index = () => {
  const [grid, setGrid] = useState(createInitialGrid());
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 0, y: 0 });
  const [aiPosition, setAiPosition] = useState<Position>({ x: GRID_SIZE - 1, y: 0 });
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameState, setGameState] = useState({ isGameOver: false, winner: null as 'player' | 'ai' | null });

  const handlePlayerMove = (newX: number, newY: number) => {
    if (!isPlayerTurn || gameState.isGameOver) return;

    // Ensure the move is only one step in any direction
    const dx = Math.abs(newX - playerPosition.x);
    const dy = Math.abs(newY - playerPosition.y);
    
    // Only allow one step moves (not diagonal)
    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
      const newPosition = { x: newX, y: newY };
      const reward = calculateReward(grid, newPosition);
      const newGameState = checkGameEnd(grid, newPosition);

      setPlayerPosition(newPosition);
      setPlayerScore(prev => prev + reward);
      setIsPlayerTurn(false);
      setGameState(newGameState);

      if (newGameState.isGameOver) {
        if (newGameState.winner === 'player') {
          toast({
            title: "Congratulations!",
            description: "You found the gold and won the game!",
          });
        } else {
          toast({
            title: "Game Over!",
            description: "You fell into a trap! AI wins!",
            variant: "destructive",
          });
        }
      }
    }
  };

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isPlayerTurn || gameState.isGameOver) return;

      const newPosition = { ...playerPosition };

      switch (event.key) {
        case 'ArrowUp':
          if (newPosition.y > 0) {
            handlePlayerMove(newPosition.x, newPosition.y - 1);
          }
          break;
        case 'ArrowDown':
          if (newPosition.y < GRID_SIZE - 1) {
            handlePlayerMove(newPosition.x, newPosition.y + 1);
          }
          break;
        case 'ArrowLeft':
          if (newPosition.x > 0) {
            handlePlayerMove(newPosition.x - 1, newPosition.y);
          }
          break;
        case 'ArrowRight':
          if (newPosition.x < GRID_SIZE - 1) {
            handlePlayerMove(newPosition.x + 1, newPosition.y);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlayerTurn, playerPosition, gameState.isGameOver]);

  useEffect(() => {
    if (!isPlayerTurn && !gameState.isGameOver) {
      const timer = setTimeout(() => {
        const newAiPosition = getAIMove(grid, aiPosition, playerPosition);
        const reward = calculateReward(grid, newAiPosition);
        const newGameState = checkGameEnd(grid, newAiPosition);

        setAiPosition(newAiPosition);
        setAiScore(prev => prev + reward);
        setIsPlayerTurn(true);
        setGameState(newGameState);

        if (newGameState.isGameOver) {
          if (newGameState.winner === 'ai') {
            toast({
              title: "AI Wins!",
              description: "The AI found the gold!",
            });
          } else {
            toast({
              title: "You Win!",
              description: "The AI fell into a trap!",
              variant: "destructive",
            });
          }
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, grid, aiPosition, playerPosition, gameState.isGameOver]);

  const handleReset = () => {
    setGrid(createInitialGrid());
    setPlayerPosition({ x: 0, y: 0 });
    setAiPosition({ x: GRID_SIZE - 1, y: 0 });
    setPlayerScore(0);
    setAiScore(0);
    setIsPlayerTurn(true);
    setGameState({ isGameOver: false, winner: null });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 animate-fade-in">
          Wumpus World Game
        </h1>
        
        <div className="grid md:grid-cols-[1fr,auto] gap-8">
          <GameGrid
            grid={grid}
            playerPosition={playerPosition}
            aiPosition={aiPosition}
            onPlayerMove={handlePlayerMove}
          />
          
          <GameControls
            onReset={handleReset}
            playerScore={playerScore}
            aiScore={aiScore}
          />
        </div>

        <div className="mt-8 text-center text-gray-400 animate-fade-in">
          <p>Use arrow keys to move. Avoid pits and try to reach the gold before the AI!</p>
          <p className="mt-2">
            <span className="text-primary">● Player</span> |{" "}
            <span className="text-secondary">■ AI</span> |{" "}
            <span className="text-destructive">☠ Pit</span> |{" "}
            <span className="text-yellow-400">⭐ Gold</span>
          </p>
        </div>

        <Dialog open={gameState.isGameOver} onOpenChange={() => handleReset()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Game Over!</DialogTitle>
              <DialogDescription>
                {gameState.winner === 'player' 
                  ? "Congratulations! You won by finding the gold!" 
                  : "AI wins! Better luck next time!"}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;