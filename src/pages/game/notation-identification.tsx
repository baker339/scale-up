import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { useRouter } from 'next/router';
import Vex from 'vexflow';
import {useProgressStore} from "@/store/useProgressStore";

const notationSymbolsByDifficulty = {
    beginner: [
        { name: "Quarter Rest", duration: "qr" },
        { name: "Half Rest", duration: "hr" },
    ],
    intermediate: [
        { name: "Quarter Rest", duration: "qr" },
        { name: "Half Rest", duration: "hr" },
        { name: "Whole Rest", duration: "wr" },
    ],
    advanced: [
        { name: "Quarter Rest", duration: "qr" },
        { name: "Half Rest", duration: "hr" },
        { name: "Whole Rest", duration: "wr" },
        { name: "Eighth Rest", duration: "8r" },
    ],
};

// Helper function to determine how many beats a given duration represents.
function getBeatsForDuration(duration: string): number {
    const baseDuration = duration.replace('r', '');
    switch (baseDuration) {
        case 'w': return 4;
        case 'h': return 2;
        case 'q': return 1;
        case '8': return 0.5;
        case '16': return 0.25;
        default: return 1;
    }
}

export default function NotationIdentification() {
    const { difficulty } = useGameStore();
    const { completeLesson } = useProgressStore();
    const router = useRouter();

    const availableSymbols = notationSymbolsByDifficulty[difficulty] || notationSymbolsByDifficulty['beginner'];
    const [currentSymbol, setCurrentSymbol] = useState(availableSymbols[0]);
    const [feedback, setFeedback] = useState('');
    const [streak, setStreak] = useState(0);
    const [correctChoices, setCorrectChoices] = useState(new Set<string>());
    const [lessonComplete, setLessonComplete] = useState(false);

    useEffect(() => {
        generateSymbol();
    }, [difficulty]);

    const generateSymbol = () => {
        const randomSymbol = availableSymbols[Math.floor(Math.random() * availableSymbols.length)];
        setCurrentSymbol(randomSymbol);
        renderSymbol(randomSymbol);
    };

    const renderSymbol = (symbol: { name: string; duration: string }) => {
        const div = document.getElementById('notation');
        if (div) div.innerHTML = '';

        const VF = Vex.Flow;
        const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
        renderer.resize(250, 150);
        const context = renderer.getContext();

        const stave = new VF.Stave(10, 50, 200);
        stave.addClef('treble').setContext(context).draw();

        const staveNote = new VF.StaveNote({
            keys: ["b/4"],
            duration: symbol.duration,
        });

        staveNote.setAttribute("isRest", true);

        const beats = getBeatsForDuration(symbol.duration);
        const voice = new VF.Voice({ num_beats: beats, beat_value: 4 });
        voice.addTickables([staveNote]);
        new VF.Formatter().joinVoices([voice]).format([voice], 150);
        voice.draw(context, stave);
    };

    const checkAnswer = (selectedName: string) => {
        if (lessonComplete) return;

        const isCorrect = selectedName === currentSymbol.name;
        const newStreak = isCorrect ? streak + 1 : 0;
        const newCorrectChoices = new Set(correctChoices);
        if (isCorrect) newCorrectChoices.add(selectedName);

        setFeedback(isCorrect ? '✅ Correct!' : '❌ Try Again.');

        setTimeout(() => {
            if (newCorrectChoices.size === availableSymbols.length && newStreak >= 10) {
                setLessonComplete(true);
            } else {
                setStreak(newStreak);
                setCorrectChoices(newCorrectChoices);
                generateSymbol();
                setFeedback('');
            }
        }, 1000);
    };

    const handleLessonComplete = () => {
        completeLesson(6);
        router.push('/curriculum')
    }

    return (
        <div className="flex flex-col items-center justify-center text-center px-6 bg-darkPurple text-white">
            <h1 className="text-3xl font-bold text-neonBlue">Notation Identification Game</h1>
            <p className="mt-2 text-lg text-gray-300">
                Identify the musical symbol shown below.
            </p>

            <div id="notation" className="mt-6 bg-white p-4 rounded-lg shadow-lg" style={{ width: '250px', height: '150px' }}></div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableSymbols.map((symbol) => (
                    <button
                        key={symbol.name}
                        className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                        onClick={() => checkAnswer(symbol.name)}
                    >
                        {symbol.name}
                    </button>
                ))}
            </div>

            <p className="mt-4 text-lg">{feedback} {streak > 0 && `Streak: ${streak}`}</p>

            {lessonComplete && (
                <div className="mt-6">
                    <p className="text-xl text-green-500 font-bold">
                        Congratulations! You've completed this lesson.
                    </p>
                    <button
                        className="mt-4 bg-green-600 px-8 py-3 rounded-lg shadow-lg hover:bg-green-500 transition"
                        onClick={handleLessonComplete}
                    >
                        Complete Lesson & Return to Curriculum
                    </button>
                </div>
            )}
        </div>
    );
}