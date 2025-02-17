import Link from 'next/link';
import { useGameStore } from '../store/useGameStore';
import { useProgressStore } from '../store/useProgressStore';
import { lessons } from '../data/lessons';

export default function Curriculum() {
    const { difficulty, setDifficulty } = useGameStore();
    const { currentLesson, completedLessons, resetProgress } = useProgressStore();

    // Calculate progress percentage
    const progress = Math.round(((currentLesson - 1) / lessons.length) * 100);

    // Handle leveling up
    const handleLevelUp = () => {
        if (difficulty === 'beginner') {
            setDifficulty('intermediate');
        } else if (difficulty === 'intermediate') {
            setDifficulty('advanced');
        }
        resetProgress();
    };

    return (
        <div className="flex flex-col items-center justify-center text-center space-y-6 p-8">
            <h1 className="text-4xl font-bold text-neonBlue">ScaleUp Curriculum</h1>
            <p className="text-lg text-gray-300">Follow the path to master music theory!</p>

            {/* Current Level Display */}
            <p className="text-xl font-bold text-neonBlue">
                Current Level: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </p>

            {/* Level Up Button (Only appears when progress is full) */}
            {progress === 100 && (
                <button
                    onClick={handleLevelUp}
                    className="mt-6 bg-green-600 px-6 py-3 rounded-lg shadow-lg hover:bg-green-500 transition text-xl font-bold shimmer"
                >
                    🎉 Level Up 🚀
                </button>
            )}

            {/* Lesson List */}
            <div className="flex flex-col space-y-4 w-full max-w-md mt-6">
                {lessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center space-x-4">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                                completedLessons.includes(lesson.id)
                                    ? 'bg-green-500'
                                    : lesson.id === currentLesson
                                        ? 'bg-blue-500'
                                        : 'bg-gray-700 opacity-50'
                            }`}
                        >
                            {completedLessons.includes(lesson.id) ? '✔️' : lesson.id}
                        </div>
                        <Link href={`/lesson/${lesson.path}`}>
                            <button
                                className={`flex-1 px-4 py-3 rounded-lg shadow-lg transition transform hover:scale-105 ${
                                    lesson.id > currentLesson
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-neonMagenta hover:bg-pink-500'
                                }`}
                                disabled={lesson.id > currentLesson}
                            >
                                {lesson.title}
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}