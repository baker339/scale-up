import { useState } from 'react';
import * as Tone from 'tone';
import { useGameStore } from '../../store/useGameStore';

const scalesData = {
    beginner: [
        { name: 'Major Scale', intervals: [0, 2, 4, 5, 7, 9, 11, 12] },
        { name: 'Minor Scale', intervals: [0, 2, 3, 5, 7, 8, 10, 12] },
    ],
    intermediate: [
        { name: 'Major Scale', intervals: [0, 2, 4, 5, 7, 9, 11, 12] },
        { name: 'Natural Minor', intervals: [0, 2, 3, 5, 7, 8, 10, 12] },
        { name: 'Harmonic Minor', intervals: [0, 2, 3, 5, 7, 8, 11, 12] },
        { name: 'Melodic Minor', intervals: [0, 2, 3, 5, 7, 9, 11, 12] },
    ],
    advanced: [
        { name: 'Major Scale', intervals: [0, 2, 4, 5, 7, 9, 11, 12] },
        { name: 'Natural Minor', intervals: [0, 2, 3, 5, 7, 8, 10, 12] },
        { name: 'Harmonic Minor', intervals: [0, 2, 3, 5, 7, 8, 11, 12] },
        { name: 'Melodic Minor', intervals: [0, 2, 3, 5, 7, 9, 11, 12] },
        { name: 'Dorian Mode', intervals: [0, 2, 3, 5, 7, 9, 10, 12] },
        { name: 'Phrygian Mode', intervals: [0, 1, 3, 5, 7, 8, 10, 12] },
        { name: 'Lydian Mode', intervals: [0, 2, 4, 6, 7, 9, 11, 12] },
        { name: 'Mixolydian Mode', intervals: [0, 2, 4, 5, 7, 9, 10, 12] },
    ],
};

export default function ScalesGame() {
    const { difficulty } = useGameStore();
    const scales = scalesData[difficulty];
    const [currentScale, setCurrentScale] = useState(scales[0]);
    const [feedback, setFeedback] = useState('');

    const getRandomScale = () => scales[Math.floor(Math.random() * scales.length)];

    const playScale = async () => {
        await Tone.start();
        const synth = new Tone.Synth().toDestination();
        const rootNote = Tone.Frequency("C4").toFrequency();
        const scaleNotes = currentScale.intervals.map((interval) => rootNote * Math.pow(2, interval / 12));

        scaleNotes.forEach((note, index) => {
            setTimeout(() => {
                synth.triggerAttackRelease(note, "0.5");
            }, index * 500);
        });
    };

    const checkAnswer = (selected: string) => {
        if (selected === currentScale.name) {
            setFeedback('✅ Correct!');
        } else {
            setFeedback('❌ Try Again.');
        }

        setTimeout(() => {
            setCurrentScale(getRandomScale());
            setFeedback('');
        }, 1000);
    };

    return (
        <div className="flex flex-col items-center justify-center text-center px-6 bg-darkPurple text-white">
            <h1 className="text-3xl font-bold text-neonBlue">Scale Recognition Game</h1>
            <p className="mt-2 text-lg text-gray-300">Mode: {difficulty.toUpperCase()}</p>

            <button onClick={playScale} className="mt-6 bg-neonMagenta px-6 py-3 rounded-lg shadow-lg hover:bg-pink-500 transition">
                🎵 Play Scale
            </button>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                {scales.map((scale) => (
                    <button
                        key={scale.name}
                        className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                        onClick={() => checkAnswer(scale.name)}
                    >
                        {scale.name}
                    </button>
                ))}
            </div>

            <p className="mt-4 text-lg">{feedback}</p>
        </div>
    );
}