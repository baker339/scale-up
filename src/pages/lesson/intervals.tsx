import Link from 'next/link';
import { useProgressStore } from '@/store/useProgressStore';
import { useGameStore } from '@/store/useGameStore';

export default function IntervalsLesson() {
    const { completeLesson } = useProgressStore();
    const { difficulty } = useGameStore();

    const content = {
        beginner: {
            title: "Intervals: Beginner",
            html: `
        <div class="lesson-content">
          <h2>What is an Interval?</h2>
          <p>An interval is the distance between two musical notes. In this beginner lesson, you will learn to identify simple intervals like the major and minor second.</p>
          <h3>Key Concepts:</h3>
          <ul>
            <li>Definition of an interval</li>
            <li>Major vs. Minor Seconds</li>
            <li>Hearing the difference</li>
          </ul>
        </div>
      `,
        },
        intermediate: {
            title: "Intervals: Intermediate",
            html: `
        <div class="lesson-content">
          <h2>Expanding Your Interval Knowledge</h2>
          <p>At the intermediate level, you will learn about more complex intervals, including the major and minor third, perfect fourth, and perfect fifth.</p>
          <h3>Key Concepts:</h3>
          <ul>
            <li>Major and Minor Thirds</li>
            <li>Perfect Fourths and Fifths</li>
            <li>Interval inversion basics</li>
          </ul>
        </div>
      `,
        },
        advanced: {
            title: "Intervals: Advanced",
            html: `
        <div class="lesson-content">
          <h2>Mastering Complex Intervals</h2>
          <p>At the advanced level, you'll explore augmented, diminished, and compound intervals. Develop a refined ear for subtle differences in pitch.</p>
          <h3>Key Concepts:</h3>
          <ul>
            <li>Augmented and Diminished Intervals</li>
            <li>Compound Intervals</li>
            <li>Advanced interval inversions</li>
          </ul>
        </div>
      `,
        },
    };

    const currentContent = content[difficulty] || content.beginner;

    return (
            <div className="max-w-3xl mx-auto p-6">
                <h1 className="text-4xl font-bold text-neonBlue mb-4">{currentContent.title}</h1>
                <div
                    className="lesson-content prose prose-invert prose-xl mb-6"
                    dangerouslySetInnerHTML={{ __html: currentContent.html }}
                />
                {/* Diagram placeholder */}
                {/*<div className="flex justify-center mb-6">*/}
                {/*    <img src="/interval-diagram.png" alt="Interval Diagram" className="w-64 rounded-lg shadow-lg" />*/}
                {/*</div>*/}
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <Link href="/game/interval-recognition">
                        <button className="bg-neonMagenta px-8 py-3 rounded-lg shadow-lg transition transform hover:scale-105">
                            Practice Interval Recognition
                        </button>
                    </Link>
                    <Link href="/curriculum">
                        <button className="bg-gray-800 px-8 py-3 rounded-lg shadow-lg transition transform hover:scale-105">
                            Back to Curriculum
                        </button>
                    </Link>
                </div>
                <button
                    onClick={() => completeLesson(2)}
                    className="mt-6 bg-green-600 px-8 py-3 rounded-lg shadow-lg hover:bg-green-500 transition"
                >
                    Mark as Complete
                </button>
            </div>
    );
}