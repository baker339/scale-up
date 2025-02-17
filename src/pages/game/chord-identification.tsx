import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useRouter } from 'next/router';
import Vex from 'vexflow';
import { useProgressStore } from '@/store/useProgressStore';

const chordData = {
    beginner: [
        { name: 'C Major', notes: ['c/4', 'e/4', 'g/4'], clef: 'treble' },
        { name: 'A Minor', notes: ['a/3', 'c/4', 'e/4'], clef: 'treble' },
        { name: 'G Major', notes: ['g/3', 'b/3', 'd/4'], clef: 'treble' },
        { name: 'F Major', notes: ['f/3', 'a/3', 'c/4'], clef: 'treble' },
    ],
    intermediate: [
        { name: 'D Minor', notes: ['d/3', 'f/3', 'a/3'], clef: 'treble' },
        { name: 'B Diminished', notes: ['b/3', 'd/4', 'f/4'], clef: 'treble' },
        { name: 'E Augmented', notes: ['e/3', 'g#/3', 'c/4'], clef: 'treble' },
    ],
    // advanced: {
    //     treble: [
    //         { name: 'C Major 7', notes: ['c/3', 'e/3', 'g/3', 'b/3'], clef: 'treble' },
    //         { name: 'G Dominant 7', notes: ['g/3', 'b/3', 'd/4', 'f/4'], clef: 'treble' },
    //         { name: 'F Minor 7', notes: ['f/3', 'ab/3', 'c/4', 'eb/4'], clef: 'treble' },
    //     ],
    //     bass: [
    //         { name: 'F Major', notes: ['f/2', 'a/2', 'c/3'], clef: 'bass' },
    //         { name: 'G Minor', notes: ['g/2', 'bb/2', 'd/3'], clef: 'bass' },
    //         { name: 'C Major 7', notes: ['c/2', 'e/2', 'g/2', 'b/2'], clef: 'bass' },
    //     ],
    // },
    advanced: [
        { name: 'C Major 7', notes: ['c/3', 'e/3', 'g/3', 'b/3'], clef: 'treble' },
        { name: 'G Dominant 7', notes: ['g/3', 'b/3', 'd/4', 'f/4'], clef: 'treble' },
        { name: 'F Minor 7', notes: ['f/3', 'ab/3', 'c/4', 'eb/4'], clef: 'treble' },

        { name: 'F Major', notes: ['f/2', 'a/2', 'c/3'], clef: 'bass' },
        { name: 'G Minor', notes: ['g/2', 'bb/2', 'd/3'], clef: 'bass' },
        { name: 'C Major 7', notes: ['c/2', 'e/2', 'g/2', 'b/2'], clef: 'bass' },
    ],
};

export default function ChordIdentification() {
    const { difficulty } = useGameStore();
    const { completeLesson } = useProgressStore();
    const router = useRouter();

    // ✅ Fix: Correctly initialize state based on difficulty level
    const [currentChord, setCurrentChord] = useState( chordData[difficulty][0]);

    const [feedback, setFeedback] = useState('');
    const [streak, setStreak] = useState(0);
    const [correctChoices, setCorrectChoices] = useState(new Set<string>());
    const [lessonComplete, setLessonComplete] = useState(false);

    // ✅ Fix: Safe chord generation, wrapped in `useCallback` for useEffect()
    const generateChord = useCallback(() => {
        let availableChords;
        let clef = 'treble';

        // if (difficulty === 'advanced') {
        //     const isBassClef = Math.random() > 0.5;
        //     clef = isBassClef ? 'bass' : 'treble';
        //     availableChords = chordData.advanced[clef];
        // } else {
        //     availableChords = chordData[difficulty];
        // }

        availableChords = chordData[difficulty];

        const randomChord = availableChords[Math.floor(Math.random() * availableChords.length)];
        setCurrentChord(randomChord);
        renderChord(randomChord, clef);
    }, [difficulty]);

    useEffect(() => {
        generateChord();
    }, []);

    // ✅ Fix: Ensure canvas does not overflow the white container
    const renderChord = (chord, clef) => {
        const div = document.getElementById('notation');
        if (div) div.innerHTML = '';

        const renderer = new Vex.Flow.Renderer(div, Vex.Flow.Renderer.Backends.SVG);

        // Adjust canvas height based on lowest note
        const lowestNote = chord.notes[0];
        const lowestPitch = parseInt(lowestNote.split('/')[1]);
        const canvasHeight = lowestPitch < 4 ? 190 : 160;

        renderer.resize(250, canvasHeight);
        const context = renderer.getContext();
        const staveYPosition = clef === 'bass' || lowestPitch < 4 ? 30 : 50;

        const stave = new Vex.Flow.Stave(10, staveYPosition, 200);
        stave.addClef(clef).setContext(context).draw();

        const staveNotes = new Vex.Flow.StaveNote({
            keys: chord.notes,
            duration: 'q',
        });

        const voice = new Vex.Flow.Voice({ num_beats: 1, beat_value: 4 });
        voice.addTickables([staveNotes]);
        new Vex.Flow.Formatter().joinVoices([voice]).format([voice], 150);
        voice.draw(context, stave);
    };

    // ✅ Game win conditions: Streak of 10 and all chords identified
    const checkAnswer = (selectedChord) => {
        if (lessonComplete) return;

        const isCorrect = selectedChord === currentChord.name;
        const newStreak = isCorrect ? streak + 1 : 0;
        const newCorrectChoices = new Set(correctChoices);
        if (isCorrect) newCorrectChoices.add(selectedChord);

        setFeedback(isCorrect ? '✅ Correct!' : '❌ Try Again.');

        setTimeout(() => {
            if (newCorrectChoices.size === getAvailableChords().length && newStreak >= 10) {
                setLessonComplete(true);
            } else {
                setStreak(newStreak);
                setCorrectChoices(newCorrectChoices);
                generateChord();
                setFeedback('');
            }
        }, 1000);
    };

    // ✅ Fix: Get the correct available chords
    const getAvailableChords = () => {
        return difficulty === 'advanced'
            ? [...chordData.advanced.treble, ...chordData.advanced.bass]
            : chordData[difficulty];
    };

    const handleLessonComplete = () => {
        completeLesson(4);
        router.push('/curriculum');
    };

    return (
        <div className="flex flex-col items-center justify-center text-center px-6 bg-darkPurple text-white">
            <h1 className="text-3xl font-bold text-neonBlue">Chord Identification Game</h1>
            <p className="mt-2 text-lg text-gray-300">Mode: {difficulty.toUpperCase()}</p>

            <div id="notation" className="mt-6 bg-white p-4 rounded-lg shadow-lg" style={{ width: '250px', height: '160px' }}></div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                {getAvailableChords().map((chord) => (
                    <button
                        key={chord.name}
                        className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                        onClick={() => checkAnswer(chord.name)}
                    >
                        {chord.name}
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
                        className="mt-4 bg-green-600 px-8 py-3 rounded-lg shadow-lg hover:bg-green-500 transition shimmer-effect"
                        onClick={handleLessonComplete}
                    >
                        Complete Lesson & Return to Curriculum
                    </button>
                </div>
            )}
        </div>
    );
}