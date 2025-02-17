// store/useProgressStore.ts
import { create } from 'zustand';

interface ProgressState {
    currentLesson: number;
    completedLessons: number[];
    completeLesson: (lessonId: number) => void;
    resetProgress: () => void;
    completeProgress: () => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
    currentLesson: 1, // Start at lesson 1
    completedLessons: [],
    completeLesson: (lessonId: number) =>
        set((state) => ({
            completedLessons: [...state.completedLessons, lessonId],
            currentLesson: lessonId + 1,
        })),
    resetProgress: () => set({ currentLesson: 1, completedLessons: [] }),
    completeProgress: () => set({currentLesson: 7, completedLessons: [1, 2, 3, 4, 5, 6]})
}));