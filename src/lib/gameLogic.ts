export interface Position {
  x: number;
  y: number;
}

export const GRID_SIZE = 8;

// Cell types
export const EMPTY = 0;
export const PIT = 1;
export const GOLD = 2;
export const WUMPUS = 3;
export const BREEZE = 4;
export const STENCH = 5;

export interface GameState {
  isGameOver: boolean;
  winner: 'player' | 'ai' | null;
}

export const createInitialGrid = (): number[][] => {
  const grid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
  
  // Add 2 Wumpuses (avoiding [0,0] and [GRID_SIZE-1,0])
  let wumpusCount = 0;
  while (wumpusCount < 2) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    if ((x !== 0 || y !== 0) && (x !== GRID_SIZE-1 || y !== 0) && grid[y][x] === EMPTY) {
      grid[y][x] = WUMPUS;
      addStench(grid, x, y);
      wumpusCount++;
    }
  }
  
  // Add 6 pits
  let pitCount = 0;
  while (pitCount < 6) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    if ((x !== 0 || y !== 0) && (x !== GRID_SIZE-1 || y !== 0) && grid[y][x] === EMPTY) {
      grid[y][x] = PIT;
      addBreeze(grid, x, y);
      pitCount++;
    }
  }
  
  // Add gold (not in starting positions or where there's already something)
  let goldPlaced = false;
  while (!goldPlaced) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    if ((x !== 0 || y !== 0) && (x !== GRID_SIZE-1 || y !== 0) && grid[y][x] === EMPTY) {
      grid[y][x] = GOLD;
      goldPlaced = true;
    }
  }
  
  return grid;
};

export const isValidMove = (pos: Position): boolean => {
  return pos.x >= 0 && pos.x < GRID_SIZE && pos.y >= 0 && pos.y < GRID_SIZE;
};

export const calculateReward = (grid: number[][], pos: Position): number => {
  const cell = grid[pos.y][pos.x];
  switch (cell) {
    case PIT:
      return -50;
    case WUMPUS:
      return -100;
    case GOLD:
      return 100;
    default:
      return -1; // Cost for each move
  }
};

export const checkGameEnd = (grid: number[][], pos: Position): GameState => {
  const cell = grid[pos.y][pos.x];
  
  if (cell === GOLD) {
    return {
      isGameOver: true,
      winner: 'player'
    };
  }
  
  if (cell === PIT || cell === WUMPUS) {
    return {
      isGameOver: true,
      winner: 'ai'
    };
  }
  
  return {
    isGameOver: false,
    winner: null
  };
};

export const getAIMove = (
  grid: number[][],
  currentPos: Position,
  playerPos: Position
): Position => {
  const possibleMoves = [
    { x: currentPos.x + 1, y: currentPos.y },
    { x: currentPos.x - 1, y: currentPos.y },
    { x: currentPos.x, y: currentPos.y + 1 },
    { x: currentPos.x, y: currentPos.y - 1 },
  ].filter(pos => isValidMove(pos));

  // Initialize Q-values for each possible move
  const qValues = possibleMoves.map(move => {
    const reward = calculateReward(grid, move);
    // Add distance-based heuristic to encourage exploration towards gold
    const distanceHeuristic = getDistanceHeuristic(grid, move);
    return { move, value: reward + distanceHeuristic };
  });

  // Choose the move with the highest Q-value
  const bestMove = qValues.reduce((best, current) => 
    current.value > best.value ? current : best
  , { move: possibleMoves[0], value: -Infinity });

  return bestMove.move;
};

// Helper function to calculate distance-based heuristic
const getDistanceHeuristic = (grid: number[][], pos: Position): number => {
  // Find gold position
  let goldPos: Position | null = null;
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (grid[y][x] === GOLD) {
        goldPos = { x, y };
        break;
      }
    }
    if (goldPos) break;
  }

  if (!goldPos) return 0;

  // Calculate Manhattan distance to gold
  const distance = Math.abs(pos.x - goldPos.x) + Math.abs(pos.y - goldPos.y);
  // Return inverse distance (closer = higher value)
  return 10 / (distance + 1);
};

const addStench = (grid: number[][], x: number, y: number) => {
  const adjacent = [
    { x: x-1, y },
    { x: x+1, y },
    { x, y: y-1 },
    { x, y: y+1 }
  ];
  
  adjacent.forEach(pos => {
    if (isValidMove(pos) && grid[pos.y][pos.x] === EMPTY) {
      grid[pos.y][pos.x] = STENCH;
    }
  });
};

const addBreeze = (grid: number[][], x: number, y: number) => {
  const adjacent = [
    { x: x-1, y },
    { x: x+1, y },
    { x, y: y-1 },
    { x, y: y+1 }
  ];
  
  adjacent.forEach(pos => {
    if (isValidMove(pos) && grid[pos.y][pos.x] === EMPTY) {
      grid[pos.y][pos.x] = BREEZE;
    }
  });
};
