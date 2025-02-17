import {useState, useEffect, useCallback} from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useRouter } from 'next/router';
import Vex from 'vexflow';
import {useProgressStore} from "@/store/useProgressStore";

const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const noteRanges = {
    beginner: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'], // Treble clef only
    intermediate: ['A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'], // Extends above/below staff
    // advanced: {
    //     treble: ['F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5'],
    //     bass: ['F2', 'G2', 'A2', 'B2', 'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4'],
    // },
    advanced: ['F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F2', 'G2', 'A2', 'B2'],
};

export default function NoteIdentification() {
    const { difficulty } = useGameStore();
    const { completeLesson } = useProgressStore();
    const router = useRouter();
    const [currentNote, setCurrentNote] = useState(notes[0]);
    // const [currentClef, setCurrentClef] = useState('treble');
    const [feedback, setFeedback] = useState('');
    const [streak, setStreak] = useState(0);
    const [correctChoices, setCorrectChoices] = useState(new Set<string>());
    const [lessonComplete, setLessonComplete] = useState(false);

    const generateNote = useCallback(() => {
        const availableNotes = noteRanges[difficulty];
        const clef = 'treble'; // Default clef

        // if (difficulty === 'advanced') {
        //     const isBassClef = Math.random() > 0.5;
        //     clef = isBassClef ? 'bass' : 'treble';
        //     availableNotes = noteRanges.advanced[clef];
        // }

        const randomNote = availableNotes[Math.floor(Math.random() * availableNotes.length)];
        setCurrentNote(randomNote);
        // setCurrentClef(clef);
        renderNote(randomNote, clef);
    }, [noteRanges, difficulty]);

    useEffect(() => {
        generateNote();
    }, [generateNote]);

    const renderNote = (note: string, clef: string) => {
        const div = document.getElementById('notation');
        if(!div) return;
        if (div) div.innerHTML = '';

        const renderer = new Vex.Flow.Renderer(div as HTMLDivElement, Vex.Flow.Renderer.Backends.SVG);
        const canvasHeight = clef === 'bass' ? 180 : 150;
        renderer.resize(250, canvasHeight);
        const context = renderer.getContext();
        const staveYPosition = clef === 'bass' ? 40 : 60;
        const stave = new Vex.Flow.Stave(10, staveYPosition, 200);
        stave.addClef(clef).setContext(context).draw();

        // Convert note format (e.g., "E4" -> "e/4")
        const formattedNote = `${note.charAt(0).toLowerCase()}/${note.charAt(1)}`;
        const staveNote = new Vex.Flow.StaveNote({
            keys: [formattedNote],
            duration: 'q',
        });

        const voice = new Vex.Flow.Voice({ num_beats: 1, beat_value: 4 });
        voice.addTickables([staveNote]);
        new Vex.Flow.Formatter().joinVoices([voice]).format([voice], 150);
        voice.draw(context, stave);
    };

    const checkAnswer = (selected: string) => {
        if (lessonComplete) return; // Do nothing if lesson is complete

        const isCorrect = selected === currentNote;
        // Compute new streak and update correct choices accordingly
        const newStreak = isCorrect ? streak + 1 : 0;
        const newCorrectChoices = new Set(correctChoices);
        if (isCorrect) newCorrectChoices.add(selected);

        // Show feedback immediately
        setFeedback(isCorrect ? '✅ Correct!' : '❌ Try Again.');

        // Delay before proceeding
        setTimeout(() => {
            // Determine how many choices are available for the current level
            const available = noteRanges[difficulty];

            // Check win condition: all choices have been correctly answered at least once AND streak is at least 10
            if (newCorrectChoices.size === available.length && newStreak >= 10) {
                setLessonComplete(true);
            } else {
                setStreak(newStreak);
                setCorrectChoices(newCorrectChoices);
                generateNote();
                setFeedback('');
            }
        }, 1000);
    };

    const handleLessonComplete = () => {
        completeLesson(1);
        router.push('/curriculum')
    }

    return (
        <div className="flex flex-col items-center justify-center text-center px-6 bg-darkPurple text-white">
            <h1 className="text-3xl font-bold text-neonBlue">Note Identification Game</h1>
            <p className="mt-2 text-lg text-gray-300">Mode: {difficulty.toUpperCase()}</p>

            <div id="notation" className="mt-6 bg-white p-4 rounded-lg shadow-lg" style={{ width: '250px', height: '150px' }}></div>

            <div className="mt-6 grid grid-cols-3 gap-4">
                {noteRanges[difficulty].map((note) => (
                        <button
                            key={note}
                            className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                            onClick={() => checkAnswer(note)}
                        >
                            {note}
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