import Link from 'next/link';
import { useProgressStore } from '../../store/useProgressStore';
import { useGameStore } from '../../store/useGameStore';

export default function ScalesLesson() {
    const { completeLesson } = useProgressStore();
    const { difficulty } = useGameStore();

    const content = {
        beginner: {
            title: "Scales & Keys: Beginner",
            html: `
        <div class="lesson-content">
          <h2>Introduction to Scales</h2>
          <p>Learn the fundamental patterns of major and minor scales. These are the building blocks of music.</p>
          <h3>Key Concepts:</h3>
          <ul>
            <li>Major and Minor Scale Patterns</li>
            <li>Whole and Half Steps</li>
            <li>Scale Degrees</li>
          </ul>
        </div>
      `,
        },
        intermediate: {
            title: "Scales & Keys: Intermediate",
            html: `
        <div class="lesson-content">
          <h2>Understanding Key Signatures</h2>
          <p>At this level, you'll explore how scales determine key signatures and how to read them on the staff.</p>
          <h3>Key Concepts:</h3>
          <ul>
            <li>Key Signatures and Their Construction</li>
            <li>The Circle of Fifths</li>
          </ul>
        </div>
      `,
        },
        advanced: {
            title: "Scales & Keys: Advanced",
            html: `
        <div class="lesson-content">
          <h2>Advanced Scale Theory</h2>
          <p>Dive into modal scales, exotic scales, and advanced key signature concepts to expand your musical vocabulary.</p>
          <h3>Key Concepts:</h3>
          <ul>
            <li>Modal Scales (Dorian, Phrygian, etc.)</li>
            <li>Altered and Exotic Scales</li>
            <li>Modulation and Key Changes</li>
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
                <div className="flex justify-center mb-6">
                    <img src="/scales-diagram.png" alt="Scales Diagram" className="w-64 rounded-lg shadow-lg" />
                </div>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <Link href="/game/scales-keys">
                        <button className="bg-neonMagenta px-8 py-3 rounded-lg shadow-lg transition transform hover:scale-105">
                            Practice Key Identification
                        </button>
                    </Link>
                    <Link href="/curriculum">
                        <button className="bg-gray-800 px-8 py-3 rounded-lg shadow-lg transition transform hover:scale-105">
                            Back to Curriculum
                        </button>
                    </Link>
                </div>
                <button
                    onClick={() => completeLesson(3)}
                    className="mt-6 bg-green-600 px-8 py-3 rounded-lg shadow-lg hover:bg-green-500 transition"
                >
                    Mark as Complete
                </button>
            </div>
    );
}