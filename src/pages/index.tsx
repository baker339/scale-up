import { useProgressStore } from '../store/useProgressStore';
import { useRouter } from 'next/router';
import { lessons } from '../data/lessons';

export default function Home() {
    const { currentLesson } = useProgressStore();
    const router = useRouter();

    const startLearning = () => {
        const currentLessonObj = lessons.find((lesson) => lesson.id === currentLesson);
        if (currentLessonObj) {
            router.push(`/lesson/${currentLessonObj.path}`);
        } else {
            router.push('/curriculum');
        }
    };

    const logoSrc = '/ScaleUpLogoWhite.png';

    return (
            <div className="flex flex-col items-center justify-center text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-neonBlue">
                    Welcome to <img src={logoSrc} alt="ScaleUp Logo" className="h-20 w-auto" />
                </h1>
                <p className="text-lg md:text-xl text-gray-300">
                    Follow the guided path to master music theory.
                </p>
                <button
                    onClick={startLearning}
                    className="mt-6 bg-neonMagenta px-8 py-3 rounded-lg shadow-lg transition transform hover:scale-105"
                >
                    Start Learning 🚀
                </button>
            </div>
    );
}