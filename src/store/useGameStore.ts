import { create } from 'zustand';

type Difficulty = 'beginner' | 'intermediate' | 'advanced';

interface GameState {
    difficulty: Difficulty;
    setDifficulty: (difficulty: Difficulty) => void;
}

export const useGameStore = create<GameState>((set) => ({
    difficulty: 'beginner', // Default difficulty
    setDifficulty: (difficulty) => set({ difficulty }),
}));