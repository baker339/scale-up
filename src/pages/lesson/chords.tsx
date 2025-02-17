import Link from 'next/link';
import Layout from '../../components/Layout';
import { useProgressStore } from '../../store/useProgressStore';
import { useGameStore } from '../../store/useGameStore';

export default function ChordsLesson() {
    const { completeLesson } = useProgressStore();
    const { difficulty } = useGameStore();

    const content = {
        beginner: {
            title: "Chords: Beginner",
            html: `
        <div class="lesson-content">
          <h2>Introduction to Chords</h2>
          <p>Chords are created by playing multiple notes at once. In this beginner lesson, learn about basic major and minor triads.</p>
          <h3>Key Concepts:</h3>
          <ul>
            <li>Major and Minor Triads</li>
            <li>Root, Third, and Fifth</li>
          </ul>
        </div>
      `,
        },
        intermediate: {
            title: "Chords: Intermediate",
            html: `
        <div class="lesson-content">
          <h2>Exploring More Chords</h2>
          <p>At the intermediate level, you'll explore additional chord types including diminished and augmented chords.</p>
          <h3>Key Concepts:</h3>
          <ul>
            <li>Diminished and Augmented Chords</li>
            <li>Chord Inversions</li>
          </ul>
        </div>
      `,
        },
        advanced: {
            title: "Chords: Advanced",
            html: `
        <div class="lesson-content">
          <h2>Advanced Harmony</h2>
          <p>At the advanced level, dive into extended chords such as 7th, 9th, and altered chords. Understand their function in complex progressions.</p>
          <h3>Key Concepts:</h3>
          <ul>
            <li>7th Chords and Extensions</li>
            <li>Chord Substitutions</li>
            <li>Advanced Voice Leading</li>
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
                    <img src="/chords-diagram.png" alt="Chords Diagram" className="w-64 rounded-lg shadow-lg" />
                </div>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <Link href="/game/chord-identification">
                        <button className="bg-neonMagenta px-8 py-3 rounded-lg shadow-lg transition transform hover:scale-105">
                            Practice Chord Identification
                        </button>
                    </Link>
                    <Link href="/curriculum">
                        <button className="bg-gray-800 px-8 py-3 rounded-lg shadow-lg transition transform hover:scale-105">
                            Back to Curriculum
                        </button>
                    </Link>
                </div>
                <button
                    onClick={() => completeLesson(4)}
                    className="mt-6 bg-green-600 px-8 py-3 rounded-lg shadow-lg hover:bg-green-500 transition"
                >
                    Mark as Complete
                </button>
            </div>
    );
}