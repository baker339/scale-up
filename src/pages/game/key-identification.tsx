// import { useState, useEffect } from 'react';
// import { useGameStore } from '../../store/useGameStore';
// import Vex from 'vexflow';
//
// const keySignatures = {
//     beginner: [
//         { name: 'C Major / A Minor', accidentals: [], clef: 'treble' },
//         { name: 'G Major / E Minor', accidentals: [{ type: 'sharp', note: 'f' }], clef: 'treble' },
//         { name: 'F Major / D Minor', accidentals: [{ type: 'flat', note: 'b' }], clef: 'treble' },
//     ],
//     intermediate: [
//         { name: 'D Major / B Minor', accidentals: [{ type: 'sharp', note: 'f' }, { type: 'sharp', note: 'c' }], clef: 'treble' },
//         { name: 'B-flat Major / G Minor', accidentals: [{ type: 'flat', note: 'b' }, { type: 'flat', note: 'e' }], clef: 'treble' },
//         { name: 'E Major / C# Minor', accidentals: [{ type: 'sharp', note: 'f' }, { type: 'sharp', note: 'c' }, { type: 'sharp', note: 'g' }], clef: 'treble' },
//     ],
//     advanced: {
//         treble: [
//             { name: 'A Major / F# Minor', accidentals: [{ type: 'sharp', note: 'f' }, { type: 'sharp', note: 'c' }, { type: 'sharp', note: 'g' }], clef: 'treble' },
//             { name: 'D-flat Major / B-flat Minor', accidentals: [{ type: 'flat', note: 'b' }, { type: 'flat', note: 'e' }, { type: 'flat', note: 'a' }, { type: 'flat', note: 'd' }, { type: 'flat', note: 'g' }], clef: 'treble' },
//         ],
//         bass: [
//             { name: 'E-flat Major / C Minor', accidentals: [{ type: 'flat', note: 'b' }, { type: 'flat', note: 'e' }, { type: 'flat', note: 'a' }], clef: 'bass' },
//             { name: 'B Major / G# Minor', accidentals: [{ type: 'sharp', note: 'f' }, { type: 'sharp', note: 'c' }, { type: 'sharp', note: 'g' }, { type: 'sharp', note: 'd' }, { type: 'sharp', note: 'a' }], clef: 'bass' },
//         ],
//     },
// };
//
// export default function KeyIdentification() {
//     const { difficulty } = useGameStore();
//     const [currentKey, setCurrentKey] = useState(null);
//     const [currentClef, setCurrentClef] = useState('treble');
//     const [feedback, setFeedback] = useState('');
//
//     useEffect(() => {
//         generateKeySignature();
//     }, []);
//
//     const generateKeySignature = () => {
//         let availableKeys = keySignatures[difficulty];
//         let clef = 'treble'; // Default clef
//
//         if (difficulty === 'advanced') {
//             const isBassClef = Math.random() > 0.5; // 50% chance for bass clef
//             clef = isBassClef ? 'bass' : 'treble';
//             availableKeys = keySignatures.advanced[clef];
//         }
//
//         const randomKey = availableKeys[Math.floor(Math.random() * availableKeys.length)];
//         setCurrentKey(randomKey);
//         setCurrentClef(clef);
//         renderKeySignature(randomKey, clef);
//     };
//
//     const renderKeySignature = (keySignature, clef) => {
//         const div = document.getElementById('notation');
//         if (div) div.innerHTML = ''; // Clear previous key signature
//
//         const renderer = new Vex.Flow.Renderer(div, Vex.Flow.Renderer.Backends.SVG);
//         renderer.resize(250, 150);
//         const context = renderer.getContext();
//
//         const stave = new Vex.Flow.Stave(10, 50, 200);
//         stave.addClef(clef);
//
//         if (keySignature.accidentals.length > 0) {
//             stave.addKeySignature(keySignature.name.split(" ")[0]); // Extract major key name
//         }
//
//         stave.setContext(context).draw();
//     };
//
//     const checkAnswer = (selectedKey) => {
//         if (selectedKey === currentKey.name) {
//             setFeedback('✅ Correct!');
//         } else {
//             setFeedback('❌ Try Again.');
//         }
//
//         setTimeout(() => {
//             generateKeySignature();
//             setFeedback('');
//         }, 1000);
//     };
//
//     return (
//         <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-darkPurple text-white">
//             <h1 className="text-3xl font-bold text-neonBlue">Key Signature Identification</h1>
//             <p className="mt-2 text-lg text-gray-300">Mode: {difficulty.toUpperCase()}</p>
//
//             <div id="notation" className="mt-6 bg-white p-4 rounded-lg shadow-lg"></div>
//
//             <div className="mt-6 grid grid-cols-2 gap-4">
//                 {(difficulty === 'advanced' ? keySignatures.advanced[currentClef] : keySignatures[difficulty]).map((key) => (
//                     <button
//                         key={key.name}
//                         className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
//                         onClick={() => checkAnswer(key.name)}
//                     >
//                         {key.name}
//                     </button>
//                 ))}
//             </div>
//
//             <p className="mt-4 text-lg">{feedback}</p>
//         </div>
//     );
// }