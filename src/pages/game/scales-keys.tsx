import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useRouter } from 'next/router';
import Vex from 'vexflow';
import * as Tone from 'tone';
import { useProgressStore } from "@/store/useProgressStore";

interface scale {
    name: string;
    notes: string[];
    type: string;
}

interface key {
    name: string;
    signature: string;
    type: string;
}

// -----------------------
// SCALE & KEY DATA
// -----------------------
const scalesData = {
    beginner: [
        { name: 'C Major', notes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'], type: 'scale' },
        { name: 'A Minor', notes: ['A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4'], type: 'scale' },
    ],
    intermediate: [
        { name: 'D Major', notes: ['D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C#5', 'D5'], type: 'scale' },
        { name: 'E Minor', notes: ['E3', 'F#3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4'], type: 'scale' },
    ],
    advanced: [
        { name: 'B Major', notes: ['B3', 'C#4', 'D#4', 'E4', 'F#4', 'G#4', 'A#4', 'B4'], type: 'scale' },
        { name: 'G# Minor', notes: ['G#3', 'A#3', 'B3', 'C#4', 'D#4', 'E4', 'F#4', 'G#4'], type: 'scale' },
    ],
};

const keyData = {
    beginner: [
        { name: 'C Major / A Minor', signature: 'C', type: 'key' },
        { name: 'G Major / E Minor', signature: 'G', type: 'key' },
    ],
    intermediate: [
        { name: 'D Major / B Minor', signature: 'D', type: 'key' },
        { name: 'Bb Major / G Minor', signature: 'Bb', type: 'key' },
    ],
    advanced: [
        { name: 'B Major / G# Minor', signature: 'B', type: 'key' },
        { name: 'F# Major / D# Minor', signature: 'F#', type: 'key' },
    ],
};

// Merge scales and keys into one dataset
function getAvailableQuestions(difficulty: "beginner" | "intermediate" | "advanced") {
    return [...scalesData[difficulty], ...keyData[difficulty]];
}

// -----------------------
// Play Scale Function
// -----------------------
async function playScale(notes: string[]) {
    await Tone.start();
    const synth = new Tone.Synth().toDestination();
    notes.forEach((note, index) => {
        setTimeout(() => {
            synth.triggerAttackRelease(note, "0.5");
        }, index * 500);
    });
}

// -----------------------
// Render Key Signature Function
// -----------------------
function renderKeySignature(signature: string, container: HTMLDivElement) {
    container.innerHTML = "";
    const VF = Vex.Flow;
    const renderer = new VF.Renderer(container, VF.Renderer.Backends.SVG);
    renderer.resize(250, 160);
    const context = renderer.getContext();
    const stave = new VF.Stave(10, 40, 220);
    stave.addClef("treble").setContext(context).draw();
    stave.addKeySignature(signature);
    stave.draw();
}

// -----------------------
// Render Scale Diagram
// -----------------------
function renderScale(notes: string[], container: HTMLDivElement) {
    container.innerHTML = "";
    const VF = Vex.Flow;
    const renderer = new VF.Renderer(container, VF.Renderer.Backends.SVG);
    renderer.resize(250, 160);
    const context = renderer.getContext();
    const stave = new VF.Stave(10, 40, 220);
    stave.addClef("treble").setContext(context).draw();

    const staveNotes = notes.map((note) => new VF.StaveNote({
        keys: [note.replace(/\d/, '') + "/4"],
        duration: "q",
    }));

    const voice = new VF.Voice({ num_beats: staveNotes.length, beat_value: 4 });
    voice.addTickables(staveNotes);
    new VF.Formatter().joinVoices([voice]).format([voice], 200);
    voice.draw(context, stave);
}

// -----------------------
// Combined Game Component
// -----------------------
export default function ScalesKeysGame() {
    const { difficulty } = useGameStore();
    const { completeLesson } = useProgressStore();
    const router = useRouter();
    const availableQuestions = getAvailableQuestions(difficulty);

    const [currentQuestion, setCurrentQuestion] = useState<typeof availableQuestions[0] | null>(null);
    const [feedback, setFeedback] = useState('');
    const [streak, setStreak] = useState(0);
    const [correctChoices, setCorrectChoices] = useState(new Set<string>());
    const [lessonComplete, setLessonComplete] = useState(false);

    useEffect(() => {
        generateQuestion();
    }, [difficulty]);

    const generateQuestion = () => {
        const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
        setCurrentQuestion(randomQuestion);

        const container = document.getElementById('vexcontainer') as HTMLDivElement;
        if (!container) return;

        if (randomQuestion.type === 'scale') {
            playScale((randomQuestion as scale).notes);
            renderScale((randomQuestion as scale).notes, container);
        } else if (randomQuestion.type === 'key') {
            renderKeySignature((randomQuestion as key).signature, container);
        }
    };

    const checkAnswer = (selected: string) => {
        if (lessonComplete || !currentQuestion) return;

        const isCorrect = selected === currentQuestion.name;
        const newStreak = isCorrect ? streak + 1 : 0;
        const newCorrectChoices = new Set(correctChoices);
        if (isCorrect) newCorrectChoices.add(selected);

        setFeedback(isCorrect ? '✅ Correct!' : '❌ Try Again.');

        setTimeout(() => {
            if (newCorrectChoices.size === availableQuestions.length && newStreak >= 10) {
                setLessonComplete(true);
            } else {
                setStreak(newStreak);
                setCorrectChoices(newCorrectChoices);
                generateQuestion();
                setFeedback('');
            }
        }, 1000);
    };

    const answerOptions =
        currentQuestion?.type === 'scale'
            ? scalesData[difficulty].map((q) => q.name)
            : keyData[difficulty].map((q) => q.name);

    const handleLessonComplete = () => {
        completeLesson(3);
        router.push('/curriculum');
    };

    return (
        <div className="flex flex-col items-center justify-center text-center px-6 bg-darkPurple text-white">
            <h1 className="text-3xl font-bold text-neonBlue">Scales & Keys Game</h1>
            <p className="mt-2 text-lg text-gray-300">Mode: {difficulty.toUpperCase()}</p>

            <div id="vexcontainer" className="mt-6 bg-white p-4 rounded-lg shadow-lg" style={{ width: '300px', height: '160px' }}></div>

            <div className="mt-6 grid grid-cols-2 gap-4">
                {answerOptions.map((option) => (
                    <button
                        key={option}
                        className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                        onClick={() => checkAnswer(option)}
                    >
                        {option}
                    </button>
                ))}
            </div>

            <p className="mt-4 text-lg">{feedback} {streak > 0 && `Streak: ${streak}`}</p>

            {lessonComplete && (
                <div className="mt-6">
                    <p className="text-xl text-green-500 font-bold">
                        {"Congratulations! You've completed this lesson."}
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