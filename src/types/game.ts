export interface Player {
  id: string;
  name: string;
  isAdmin: boolean;
  isReady: boolean;
  score: number;
  joinedAt: Date;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
  points: number;
}

export interface GameRoom {
  id: string;
  name: string;
  admin: string;
  players: Player[];
  questions: Question[];
  status: 'waiting' | 'active' | 'finished';
  currentQuestion?: number;
  createdAt: Date;
  settings: {
    maxPlayers: number;
    questionTimeLimit: number;
    showCorrectAnswer: boolean;
  };
}

export interface GameState {
  currentQuestion: number;
  timeRemaining: number;
  answers: Record<string, number>;
  showResults: boolean;
}

export interface PlayerAnswer {
  playerId: string;
  questionId: string;
  answer: number;
  isCorrect: boolean;
  timeSpent: number;
}
