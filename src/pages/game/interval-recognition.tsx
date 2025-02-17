import {useState, useEffect, useCallback} from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useProgressStore } from '@/store/useProgressStore';
import { useRouter } from 'next/router';
import Vex from 'vexflow';
import * as Tone from 'tone';

// Define all intervals with a name and a ratio.
const intervals = [
    { name: 'Minor 2nd', ratio: 16 / 15 },
    { name: 'Major 2nd', ratio: 9 / 8 },
    { name: 'Minor 3rd', ratio: 6 / 5 },
    { name: 'Major 3rd', ratio: 5 / 4 },
    { name: 'Perfect 4th', ratio: 4 / 3 },
    { name: 'Tritone', ratio: Math.sqrt(2) },
    { name: 'Perfect 5th', ratio: 3 / 2 },
    { name: 'Minor 6th', ratio: 8 / 5 },
    { name: 'Major 6th', ratio: 5 / 3 },
    { name: 'Minor 7th', ratio: 9 / 5 },
    { name: 'Major 7th', ratio: 15 / 8 },
    { name: 'Octave', ratio: 2 },
];

// Define subsets for each difficulty.
const intervalSets = {
    beginner: intervals.filter((i) =>
        ['Perfect 5th', 'Major 3rd', 'Octave'].includes(i.name)
    ),
    intermediate: intervals.filter((i) =>
        ['Minor 3rd', 'Major 3rd', 'Perfect 4th', 'Perfect 5th', 'Octave'].includes(i.name)
    ),
    advanced: intervals, // All intervals.
};

// Mapping from interval name to the second note (relative to C4).
const intervalMapping = {
    'Minor 2nd': 'Db4',
    'Major 2nd': 'D4',
    'Minor 3rd': 'Eb4',
    'Major 3rd': 'E4',
    'Perfect 4th': 'F4',
    'Tritone': 'F#4',
    'Perfect 5th': 'G4',
    'Minor 6th': 'Ab4',
    'Major 6th': 'A4',
    'Minor 7th': 'Bb4',
    'Major 7th': 'B4',
    'Octave': 'c5',
};

// Helper function to format note strings (e.g., "E4" becomes "e/4").
function formatNote(noteStr: string): string {
    if (noteStr.includes('/')) {
        return noteStr;
    }
    return `${noteStr.charAt(0).toLowerCase()}/${noteStr.slice(1)}`;
}

// Function to play the interval using Tone.js.
async function playIntervalSound(intervalObj: { name: string; ratio: number }) {
    await Tone.start(); // Ensure the audio context is started.
    const synth = new Tone.Synth().toDestination();
    const rootFreq = Tone.Frequency("C4").toFrequency();
    const secondFreq = rootFreq * intervalObj.ratio;
    // Play the root note.
    synth.triggerAttackRelease(rootFreq, "0.5");
    // After a short delay, play the second note.
    setTimeout(() => {
        synth.triggerAttackRelease(secondFreq, "0.5");
    }, 500);
}

export default function IntervalRecognition() {
    const { difficulty } = useGameStore();
    const { completeLesson } = useProgressStore();
    const router = useRouter();
    const availableIntervals = intervalSets[difficulty] || intervalSets.beginner;

    const [currentInterval, setCurrentInterval] = useState(availableIntervals[0]);
    const [feedback, setFeedback] = useState('');
    const [streak, setStreak] = useState(0);
    const [correctChoices, setCorrectChoices] = useState(new Set<string>());
    const [lessonComplete, setLessonComplete] = useState(false);

    const generateInterval = useCallback( async() => {
        const randomInterval = availableIntervals[Math.floor(Math.random() * availableIntervals.length)];
        setCurrentInterval(randomInterval);
        // Play the interval sounds.
        playIntervalSound(randomInterval);
        renderInterval(randomInterval);
    }, [difficulty]);

    useEffect(() => {
        generateInterval();
    }, [generateInterval]);

    const renderInterval = (intervalObj: { name: string; ratio: number }) => {
        const div = document.getElementById('notation');
        if(!div) return;
        if (div) div.innerHTML = '';

        const VF = Vex.Flow;
        const renderer = new VF.Renderer(div as HTMLDivElement, VF.Renderer.Backends.SVG);
        renderer.resize(300, 150);
        const context = renderer.getContext();

        const stave = new VF.Stave(10, 40, 280);
        stave.addClef('treble').setContext(context).draw();

        const rootNote = 'c/4'; // Fixed root note.
        const secondNoteRaw = intervalMapping[intervalObj.name] || 'g4';
        const secondNote = formatNote(secondNoteRaw);

        const note1 = new VF.StaveNote({ keys: [rootNote], duration: 'q' });
        const note2 = new VF.StaveNote({ keys: [secondNote], duration: 'q' });

        const voice = new VF.Voice({ num_beats: 2, beat_value: 4 });
        voice.addTickables([note1, note2]);
        new VF.Formatter().joinVoices([voice]).format([voice], 240);
        voice.draw(context, stave);
    };

    const checkAnswer = (selected: string) => {
        if (lessonComplete) return;

        const isCorrect = selected === currentInterval.name;
        const newStreak = isCorrect ? streak + 1 : 0;
        const newCorrectChoices = new Set(correctChoices);
        if (isCorrect) newCorrectChoices.add(selected);

        setFeedback(isCorrect ? '✅ Correct!' : '❌ Try Again.');

        setTimeout(() => {
            if (newCorrectChoices.size === availableIntervals.length && newStreak >= 10) {
                setLessonComplete(true);
            } else {
                setStreak(newStreak);
                setCorrectChoices(newCorrectChoices);
                generateInterval();
                setFeedback('');
            }
        }, 1000);
    };

    const handleLessonComplete = () => {
        completeLesson(2);
        router.push('/curriculum')
    }

    return (
        <div className="flex flex-col items-center justify-center text-center px-6 bg-darkPurple text-white">
            <h1 className="text-3xl font-bold text-neonBlue">Interval Recognition Game</h1>
            <p className="mt-2 text-lg text-gray-300">Mode: {difficulty.toUpperCase()}</p>

            <div id="notation" className="mt-6 bg-white p-4 rounded-lg shadow-lg" style={{ width: '300px', height: '150px' }}></div>

            <div className="mt-6 grid grid-cols-3 gap-4">
                {availableIntervals.map((interval) => (
                    <button
                        key={interval.name}
                        className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                        onClick={() => checkAnswer(interval.name)}
                    >
                        {interval.name}
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