import Link from 'next/link';
import { useProgressStore } from '@/store/useProgressStore';
import { useGameStore } from '@/store/useGameStore';

export default function RhythmLesson() {
    const { completeLesson } = useProgressStore();
    const { difficulty } = useGameStore();

    const content = {
        beginner: {
            title: "Rhythm & Time Signatures: Beginner",
            html: `
        <div class="lesson-content">
          <h2>Basics of Rhythm</h2>
          <p>Rhythm is what gives music its flow. Learn the basic time signatures such as 4/4 and 3/4, which determine the number of beats in each measure.</p>
          <h3>Key Concepts:</h3>
          <ul>
            <li>Time Signatures</li>
            <li>Beat and Measure</li>
          </ul>
        </div>
      `,
        },
        intermediate: {
            title: "Rhythm & Time Signatures: Intermediate",
            html: `
        <div class="lesson-content">
          <h2>Understanding Compound Rhythms</h2>
          <p>At the intermediate level, you will explore compound time signatures such as 6/8, which group beats differently.</p>
          <h3>Key Concepts:</h3>
          <ul>
            <li>Simple vs. Compound Time</li>
            <li>Grouping of Beats</li>
          </ul>
        </div>
      `,
        },
        advanced: {
            title: "Rhythm & Time Signatures: Advanced",
            html: `
        <div class="lesson-content">
          <h2>Mastering Complex Rhythms</h2>
          <p>At the advanced level, you'll tackle odd meter time signatures and intricate rhythmic patterns that challenge your sense of timing.</p>
          <h3>Key Concepts:</h3>
          <ul>
            <li>Odd Meters (e.g., 5/4, 7/8)</li>
            <li>Syncopation and Polyrhythms</li>
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
            {/*    <img src="/rhythm-diagram.png" alt="Rhythm Diagram" className="w-64 rounded-lg shadow-lg" />*/}
            {/*</div>*/}
            <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Link href="/game/time-signature-identification">
                    <button className="bg-neonMagenta px-8 py-3 rounded-lg shadow-lg transition transform hover:scale-105">
                        Practice Time Signature Quiz
                    </button>
                </Link>
                <Link href="/curriculum">
                    <button className="bg-gray-800 px-8 py-3 rounded-lg shadow-lg transition transform hover:scale-105">
                        Back to Curriculum
                    </button>
                </Link>
            </div>
            <button
                onClick={() => completeLesson(5)}
                className="mt-6 bg-green-600 px-8 py-3 rounded-lg shadow-lg hover:bg-green-500 transition"
            >
                Mark as Complete
            </button>
        </div>
    );
}