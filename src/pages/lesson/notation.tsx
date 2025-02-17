import Link from 'next/link';
import Layout from '../../components/Layout';
import { useProgressStore } from '../../store/useProgressStore';
import { useGameStore } from '../../store/useGameStore';

export default function NotationLesson() {
    const { completeLesson } = useProgressStore();
    const { difficulty } = useGameStore();

    const content = {
        beginner: {
            title: "Musical Symbols: Beginner",
            html: `
        <div class="lesson-content">
          <h2>Introduction to Musical Symbols</h2>
          <p>Learn to identify common musical symbols such as rests and basic dynamics. These symbols are essential for understanding written music.</p>
          <h3>Key Concepts:</h3>
          <ul>
            <li>Understanding Rests</li>
            <li>Basic Dynamic Markings</li>
          </ul>
        </div>
      `,
        },
        intermediate: {
            title: "Musical Symbols: Intermediate",
            html: `
        <div class="lesson-content">
          <h2>Exploring More Symbols</h2>
          <p>At the intermediate level, you'll study additional symbols, including articulations and more detailed dynamic markings.</p>
          <h3>Key Concepts:</h3>
          <ul>
            <li>Advanced Rests</li>
            <li>Articulation Marks</li>
          </ul>
        </div>
      `,
        },
        advanced: {
            title: "Musical Symbols: Advanced",
            html: `
        <div class="lesson-content">
          <h2>Mastering Notation</h2>
          <p>At the advanced level, dive into complex musical symbols such as codas, segnos, and repeat signs that add nuance to music performance.</p>
          <h3>Key Concepts:</h3>
          <ul>
            <li>Codas and Segnos</li>
            <li>Repeat Signs and Endings</li>
            <li>Detailed Dynamic Instructions</li>
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
                <img src="/notation-diagram.png" alt="Notation Diagram" className="w-64 rounded-lg shadow-lg" />
            </div>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Link href="/game/notation-identification">
                    <button className="bg-neonMagenta px-8 py-3 rounded-lg shadow-lg transition transform hover:scale-105">
                        Practice Musical Symbols
                    </button>
                </Link>
                <Link href="/curriculum">
                    <button className="bg-gray-800 px-8 py-3 rounded-lg shadow-lg transition transform hover:scale-105">
                        Back to Curriculum
                    </button>
                </Link>
            </div>
            <button
                onClick={() => completeLesson(6)}
                className="mt-6 bg-green-600 px-8 py-3 rounded-lg shadow-lg hover:bg-green-500 transition"
            >
                Mark as Complete
            </button>
        </div>
    );
}