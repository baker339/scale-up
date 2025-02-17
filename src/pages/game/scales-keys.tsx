import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useRouter } from 'next/router';
import Vex from 'vexflow';
import * as Tone from 'tone';
import {useProgressStore} from "@/store/useProgressStore";

// -----------------------
// SCALE & KEY DATA
// -----------------------
const scalesData = {
    beginner: [
        { name: 'C Major', notes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'] },
        { name: 'A Minor', notes: ['A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4'] },
    ],
    intermediate: [
        { name: 'D Major', notes: ['D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C#5', 'D5'] },
        { name: 'E Minor', notes: ['E3', 'F#3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4'] },
    ],
    advanced: [
        { name: 'B Major', notes: ['B3', 'C#4', 'D#4', 'E4', 'F#4', 'G#4', 'A#4', 'B4'] },
        { name: 'G# Minor', notes: ['G#3', 'A#3', 'B3', 'C#4', 'D#4', 'E4', 'F#4', 'G#4'] },
    ],
};

const keyData = {
    beginner: [
        { name: 'C Major / A Minor', signature: 'C' },
        { name: 'G Major / E Minor', signature: 'G' },
    ],
    intermediate: [
        { name: 'D Major / B Minor', signature: 'D' },
        { name: 'Bb Major / G Minor', signature: 'Bb' },
    ],
    advanced: [
        { name: 'B Major / G# Minor', signature: 'B' },
        { name: 'F# Major / D# Minor', signature: 'F#' },
    ],
};

// Helper to merge scales and keys into one question set
function getAvailableQuestions(difficulty: string) {
    const scaleQuestions =
        scalesData[difficulty]?.map((q: {name: string, notes: string[]}) => ({ ...q, type: 'scale' })) || [];
    const keyQuestions =
        keyData[difficulty]?.map((q: {name: string, signature: string}) => ({ ...q, type: 'key' })) || [];
    return [...scaleQuestions, ...keyQuestions];
}

// -----------------------
// Play Scale Function
// -----------------------
async function playScale(scaleObj: { notes: string[] }) {
    await Tone.start();
    const synth = new Tone.Synth().toDestination();
    scaleObj.notes.forEach((note, index) => {
        setTimeout(() => {
            synth.triggerAttackRelease(note, "0.5");
        }, index * 500);
    });
}

// -----------------------
// Render Key Signature Function
// -----------------------
function renderKeySignature(question: { signature: string }, container: HTMLElement) {
    container.innerHTML = "";
    const VF = Vex.Flow;
    const renderer = new VF.Renderer(container, VF.Renderer.Backends.SVG);
    renderer.resize(250, 120);
    const context = renderer.getContext();
    const stave = new VF.Stave(10, 20, 220);
    stave.addClef("treble").setContext(context).draw();
    stave.addKeySignature(question.signature);
    stave.draw();
}

// -----------------------
// Render Scale Diagram
// -----------------------
function renderScale(scaleObj: { notes: string[] }, container: HTMLElement) {
    container.innerHTML = "";
    const VF = Vex.Flow;
    const renderer = new VF.Renderer(container, VF.Renderer.Backends.SVG);
    renderer.resize(250, 120);
    const context = renderer.getContext();
    const stave = new VF.Stave(10, 20, 220);
    stave.addClef("treble").setContext(context).draw();

    const notes = scaleObj.notes.map((note) => new VF.StaveNote({
        keys: [note.replace(/\d/, '') + "/4"],
        duration: "q",
    }));

    const voice = new VF.Voice({ num_beats: notes.length, beat_value: 4 });
    voice.addTickables(notes);
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

    const [currentQuestion, setCurrentQuestion] = useState(availableQuestions[0]);
    const [feedback, setFeedback] = useState('');
    const [streak, setStreak] = useState(0);
    const [correctChoices, setCorrectChoices] = useState(new Set<string>());
    const [lessonComplete, setLessonComplete] = useState(false);

    useEffect(() => {
        generateQuestion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [difficulty]);

    const generateQuestion = async () => {
        const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
        setCurrentQuestion(randomQuestion);

        if (randomQuestion.type === 'scale') {
            playScale(randomQuestion);
            renderScale(randomQuestion, document.getElementById('vexcontainer')!);
        } else if (randomQuestion.type === 'key') {
            renderKeySignature(randomQuestion, document.getElementById('vexcontainer')!);
        }
    };

    const checkAnswer = (selected: string) => {
        if (lessonComplete) return;
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
            ? scalesData[difficulty].map((q: {name: string, notes: string[]}) => q.name)
            : keyData[difficulty].map((q: {name: string, signature: string}) => q.name);

    const handleLessonComplete = () => {
        completeLesson(3);
        router.push('/curriculum')
    }

    return (
        <div className="flex flex-col items-center justify-center text-center px-6 bg-darkPurple text-white">
            <h1 className="text-3xl font-bold text-neonBlue">Scales & Keys Game</h1>
            <p className="mt-2 text-lg text-gray-300">Mode: {difficulty.toUpperCase()}</p>

            <div id="vexcontainer" className="mt-6 bg-white p-4 rounded-lg shadow-lg" style={{ width: '300px', height: '150px' }}></div>

            <div className="mt-6 grid grid-cols-2 gap-4">
                {answerOptions.map((option: string) => (
                    <button
                        key={option}
                        className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                        onClick={() => checkAnswer(option)}
                    >
                        {option}
                    </button>
                ))}
            </div>

            <p className="mt-4 text-lg">
                {feedback} {streak > 0 && `Streak: ${streak}`}
            </p>

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