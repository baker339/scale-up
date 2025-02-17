import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { useRouter } from 'next/router';
import Vex from 'vexflow';
import {useProgressStore} from "@/store/useProgressStore";

const VF = Vex.Flow;

// Define rhythmic patterns for each difficulty level.
const rhythmPatternsByDifficulty = {
    beginner: [
        { timeSignature: "4/4", notes: [{ keys: ["c/4"], duration: "q" }, { keys: ["d/4"], duration: "q" }, { keys: ["e/4"], duration: "q" }, { keys: ["f/4"], duration: "q" }] },
        { timeSignature: "3/4", notes: [{ keys: ["c/4"], duration: "q" }, { keys: ["d/4"], duration: "q" }, { keys: ["e/4"], duration: "q" }] },
        { timeSignature: "2/4", notes: [{ keys: ["c/4"], duration: "q" }, { keys: ["d/4"], duration: "q" }] },
    ],
    intermediate: [
        { timeSignature: "4/4", notes: [{ keys: ["c/4"], duration: "q" }, { keys: ["d/4"], duration: "q" }, { keys: ["e/4"], duration: "q" }, { keys: ["f/4"], duration: "q" }] },
        { timeSignature: "3/4", notes: [{ keys: ["c/4"], duration: "q" }, { keys: ["d/4"], duration: "q" }, { keys: ["e/4"], duration: "q" }] },
        { timeSignature: "6/8", notes: [{ keys: ["c/4"], duration: "8" }, { keys: ["d/4"], duration: "8" }, { keys: ["e/4"], duration: "8" }, { keys: ["f/4"], duration: "8" }, { keys: ["g/4"], duration: "8" }, { keys: ["a/4"], duration: "8" }] },
    ],
    advanced: [
        { timeSignature: "5/4", notes: [{ keys: ["c/4"], duration: "q" }, { keys: ["d/4"], duration: "q" }, { keys: ["e/4"], duration: "q" }, { keys: ["f/4"], duration: "q" }, { keys: ["g/4"], duration: "q" }] },
        { timeSignature: "7/8", notes: [{ keys: ["c/4"], duration: "8" }, { keys: ["d/4"], duration: "8" }, { keys: ["e/4"], duration: "8" }, { keys: ["f/4"], duration: "8" }, { keys: ["g/4"], duration: "8" }, { keys: ["a/4"], duration: "8" }, { keys: ["b/4"], duration: "8" }] },
    ],
};

// Superset of answer choices.
const answerChoices = ["4/4", "3/4", "2/4", "6/8", "5/4", "7/8"];

// Helper to calculate total beats from a pattern.
function getBeatsForPattern(notes: { duration: string }[]): number {
    let total = 0;
    notes.forEach(note => {
        if (note.duration === "q") total += 1;
        else if (note.duration === "8") total += 0.5;
    });
    return total;
}

export default function TimeSignatureQuiz() {
    const { difficulty } = useGameStore();
    const { completeLesson } = useProgressStore();
    const router = useRouter();

    const availablePatterns = rhythmPatternsByDifficulty[difficulty] || rhythmPatternsByDifficulty["beginner"];
    const [currentPattern, setCurrentPattern] = useState(availablePatterns[0]);
    const [feedback, setFeedback] = useState("");
    const [streak, setStreak] = useState(0);
    const [correctChoices, setCorrectChoices] = useState(new Set<string>());
    const [lessonComplete, setLessonComplete] = useState(false);

    useEffect(() => {
        generatePattern();
    }, [difficulty]);

    const generatePattern = () => {
        const randomPattern = availablePatterns[Math.floor(Math.random() * availablePatterns.length)];
        setCurrentPattern(randomPattern);
        renderPattern(randomPattern);
    };

    const renderPattern = (pattern: { timeSignature: string; notes: {keys: string[], duration: string }[] }) => {
        const div = document.getElementById("notation");
        if (div) div.innerHTML = "";

        const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
        renderer.resize(300, 150);
        const context = renderer.getContext();

        const stave = new VF.Stave(10, 50, 280);
        stave.addClef("treble");
        stave.setContext(context).draw();

        const notes = pattern.notes.map((noteDef) => new VF.StaveNote({
            keys: noteDef.keys,
            duration: noteDef.duration,
        }));

        const numBeats = getBeatsForPattern(pattern.notes);
        const voice = new VF.Voice({ num_beats: numBeats, beat_value: 4 });
        voice.addTickables(notes);

        new VF.Formatter().joinVoices([voice]).format([voice], 250);
        voice.draw(context, stave);
    };

    const checkAnswer = (selected: string) => {
        if (lessonComplete) return;

        const isCorrect = selected === currentPattern.timeSignature;
        const newStreak = isCorrect ? streak + 1 : 0;
        const newCorrectChoices = new Set(correctChoices);
        if (isCorrect) newCorrectChoices.add(selected);

        setFeedback(isCorrect ? "✅ Correct!" : "❌ Try Again.");

        setTimeout(() => {
            if (newCorrectChoices.size === availablePatterns.length && newStreak >= 10) {
                setLessonComplete(true);
            } else {
                setStreak(newStreak);
                setCorrectChoices(newCorrectChoices);
                generatePattern();
                setFeedback("");
            }
        }, 1000);
    };

    const handleLessonComplete = () => {
        completeLesson(5);
        router.push('/curriculum')
    }

    return (
        <div className="flex flex-col items-center justify-center text-center px-6 bg-darkPurple text-white">
            <h1 className="text-3xl font-bold text-neonBlue">Time Signature Quiz</h1>
            <p className="mt-2 text-lg text-gray-300">
                Determine the time signature implied by the note pattern.
            </p>

            <div id="notation" className="mt-6 bg-white p-4 rounded-lg shadow-lg" style={{ width: "300px", height: "150px" }}></div>

            <div className="mt-6 grid grid-cols-3 gap-4">
                {answerChoices.map((choice) => (
                    <button
                        key={choice}
                        onClick={() => checkAnswer(choice)}
                        className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                    >
                        {choice}
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