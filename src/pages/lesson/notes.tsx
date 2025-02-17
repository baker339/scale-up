import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/useGameStore';
import Link from 'next/link';
import Flow from 'vexflow';

// Define structured lesson content for each difficulty level.
const lessonContent = {
    beginner: {
        title: "Notes & Staff: Beginner",
        content: `
      <div class="lesson-content">
        <h2>Introduction</h2>
        <p>Welcome to the basics of reading music! In this lesson, you'll learn the fundamentals of the musical staff.</p>
        <h3>The Staff</h3>
        <ul>
          <li>The staff consists of <strong>five lines</strong> and <strong>four spaces</strong>.</li>
          <li>Each line and space corresponds to a specific note.</li>
        </ul>
        <h3>Treble Clef</h3>
        <p>In the treble clef, the lines (from bottom to top) are <em>E, G, B, D, F</em> and the spaces are <em>F, A, C, E</em>.</p>
        <h3>Key Concepts</h3>
        <ul>
          <li>Musical Staff</li>
          <li>Treble Clef</li>
          <li>Note Names and Positions</li>
        </ul>
      </div>
    `,
        renderDiagram: (container: HTMLElement) => {
            // Render a basic diagram with a single note (middle C) on a Treble Clef.
            const VF = window.Vex ? window.Vex.Flow : Flow;
            container.innerHTML = "";
            const renderer = new VF.Renderer(container, VF.Renderer.Backends.SVG);
            renderer.resize(280, 120);
            const context = renderer.getContext();
            // Create a stave positioned to center the diagram.
            const stave = new VF.Stave(10, 20, 260);
            stave.addClef("treble").setContext(context).draw();
            // Render a quarter note (middle C)
            const note = new VF.StaveNote({ keys: ["c/4"], duration: "q" });
            const voice = new VF.Voice({ num_beats: 1, beat_value: 4 });
            voice.addTickables([note]);
            new VF.Formatter().joinVoices([voice]).format([voice], 240);
            voice.draw(context, stave);
        },
    },
    intermediate: {
        title: "Notes & Staff: Intermediate",
        content: `
      <div class="lesson-content">
        <h2>Expanding Your Knowledge</h2>
        <p>In this lesson, you will learn to recognize notes that extend beyond the basic staff. Ledger lines are used to notate these notes.</p>
        <h3>Ledger Lines</h3>
        <p>Ledger lines allow you to notate notes that fall above or below the five-line staff.</p>
        <h3>Practice</h3>
        <ul>
          <li>Identify notes on the staff.</li>
          <li>Learn to read notes with ledger lines.</li>
        </ul>
      </div>
    `,
        renderDiagram: (container: HTMLElement) => {
            const VF = window.Vex ? window.Vex.Flow : Flow;
            container.innerHTML = "";
            const renderer = new VF.Renderer(container, VF.Renderer.Backends.SVG);
            renderer.resize(280, 120);
            const context = renderer.getContext();
            const stave = new VF.Stave(10, 20, 260);
            stave.addClef("treble").setContext(context).draw();
            // Render two quarter notes: middle C and a higher note (G above the staff)
            const note1 = new VF.StaveNote({ keys: ["c/4"], duration: "q" });
            const note2 = new VF.StaveNote({ keys: ["g/5"], duration: "q" });
            const voice = new VF.Voice({ num_beats: 2, beat_value: 4 });
            voice.addTickables([note1, note2]);
            new VF.Formatter().joinVoices([voice]).format([voice], 240);
            voice.draw(context, stave);
        },
    },
    advanced: {
        title: "Notes & Staff: Advanced",
        content: `
      <div class="lesson-content">
        <h2>Mastering Advanced Notation</h2>
        <p>At the advanced level, you'll tackle complex musical notation. This includes reading notes with multiple ledger lines and understanding accidentals.</p>
        <h3>Advanced Concepts</h3>
        <ul>
          <li>Reading ledger lines for notes significantly above or below the standard range.</li>
          <li>Interpreting accidentals: sharps, flats, and naturals.</li>
        </ul>
        <h3>Challenge Yourself</h3>
        <p>Practice by reading advanced notations until you feel comfortable with complex scores.</p>
      </div>
    `,
        renderDiagram: (container: HTMLElement) => {
            const VF = window.Vex ? window.Vex.Flow : Flow;
            container.innerHTML = "";
            const renderer = new VF.Renderer(container, VF.Renderer.Backends.SVG);
            renderer.resize(280, 120);
            const context = renderer.getContext();
            // Lower the stave to provide space for ledger lines.
            const stave = new VF.Stave(10, 10, 260);
            stave.addClef("treble").setContext(context).draw();
            // Render a quarter note with ledger lines (A5, for example).
            const note = new VF.StaveNote({ keys: ["a/5"], duration: "q" });
            const voice = new VF.Voice({ num_beats: 1, beat_value: 4 });
            voice.addTickables([note]);
            new VF.Formatter().joinVoices([voice]).format([voice], 240);
            voice.draw(context, stave);
        },
    },
};

export default function NotesLesson() {
    const { difficulty } = useGameStore();
    const content = lessonContent[difficulty] || lessonContent.beginner;
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current && content.renderDiagram) {
            content.renderDiagram(containerRef.current);
        }
    }, [difficulty, content]);

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-4xl font-bold text-neonBlue mb-4">{content.title}</h1>
            <div
                className="lesson-content prose prose-invert prose-xl mb-6"
                dangerouslySetInnerHTML={{ __html: content.content }}
            />
            <div
                ref={containerRef}
                className="bg-white p-4 rounded-lg shadow-lg mb-6 flex items-center justify-center overflow-hidden"
                style={{ width: "300px", height: "150px" }}
            ></div>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Link href="/game/note-identification">
                    <button className="bg-neonMagenta px-8 py-3 rounded-lg shadow-lg transition transform hover:scale-105">
                        Practice Note Identification
                    </button>
                </Link>
                <Link href="/curriculum">
                    <button className="bg-gray-800 px-8 py-3 rounded-lg shadow-lg transition transform hover:scale-105">
                        Back to Curriculum
                    </button>
                </Link>
            </div>
        </div>
    );
}