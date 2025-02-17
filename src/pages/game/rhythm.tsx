// import { useState, useEffect } from 'react';
// import * as Tone from 'tone';
// import { useGameStore } from '../../store/useGameStore';
//
// const rhythmPatterns = {
//     beginner: [
//         { name: 'Quarter Notes', pattern: [1, 1, 1, 1], tempo: 80 },
//         { name: 'Eighth Notes', pattern: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5], tempo: 80 },
//     ],
//     intermediate: [
//         { name: 'Quarter Notes', pattern: [1, 1, 1, 1], tempo: 80 },
//         { name: 'Eighth Notes', pattern: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5], tempo: 80 },
//         { name: 'Syncopation', pattern: [1, 0.5, 0.5, 1, 1], tempo: 100 },
//         { name: 'Triplets', pattern: [0.33, 0.33, 0.33, 1, 0.33, 0.33, 0.33], tempo: 100 },
//     ],
//     advanced: [
//         { name: 'Quarter Notes', pattern: [1, 1, 1, 1], tempo: 80 },
//         { name: 'Eighth Notes', pattern: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5], tempo: 80 },
//         { name: 'Syncopation', pattern: [1, 0.5, 0.5, 1, 1], tempo: 100 },
//         { name: 'Triplets', pattern: [0.33, 0.33, 0.33, 1, 0.33, 0.33, 0.33], tempo: 100 },
//         { name: 'Polyrhythm', pattern: [1, 0.5, 1, 0.5, 0.5, 0.5], tempo: 120 },
//         { name: 'Odd Meter (5/4)', pattern: [1, 1, 1, 0.5, 0.5], tempo: 120 },
//     ],
// };
//
export default function RhythmGame() {
    // const { difficulty } = useGameStore();
    // const [currentPattern, setCurrentPattern] = useState(rhythmPatterns[difficulty][0]);
    // const [isPlaying, setIsPlaying] = useState(false);
    // const [userTaps, setUserTaps] = useState<number[]>([]);
    // const [feedback, setFeedback] = useState('');
    //
    // useEffect(() => {
    //     setCurrentPattern(rhythmPatterns[difficulty][0]);
    // }, [difficulty]);
    //
    // const playRhythm = async () => {
    //     await Tone.start();
    //     setIsPlaying(true);
    //     setUserTaps([]);
    //     setFeedback('🎵 Get Ready...');
    //
    //     setTimeout(() => {
    //         setFeedback('🥁 Tap Along!');
    //
    //         const synth = new Tone.MembraneSynth().toDestination();
    //         let time = 0;
    //         currentPattern.pattern.forEach((beat) => {
    //             Tone.Transport.scheduleOnce((t) => synth.triggerAttackRelease('C2', '0.1', t), time);
    //             time += beat;
    //         });
    //
    //         Tone.Transport.start();
    //         setTimeout(() => {
    //             Tone.Transport.stop();
    //             setIsPlaying(false);
    //         }, time * (60000 / currentPattern.tempo));
    //     }, 3000); // 3-second count-in
    // };
    //
    // const handleUserTap = () => {
    //     //if (!isPlaying) return;
    //
    //     const tapTime = Tone.now();
    //     setUserTaps((prev) => [...prev, tapTime]);
    //
    //     // Compare to expected beat timing
    //     if (userTaps.length < currentPattern.pattern.length) {
    //         const expectedTime = userTaps.length * (currentPattern.pattern[userTaps.length] * (60000 / currentPattern.tempo));
    //         const actualTime = tapTime * 1000;
    //         const error = Math.abs(expectedTime - actualTime);
    //
    //         setFeedback(error < 150 ? '✅ On Beat!' : '⚠️ Off Beat!');
    //     }
    //
    //     console.log(`User tapped at: ${tapTime}`);
    // };
    //
    // const analyzeTaps = () => {
    //     if (userTaps.length < currentPattern.pattern.length) {
    //         setFeedback('❌ Too Few Taps! Try Again.');
    //         return;
    //     }
    //
    //     let totalError = 0;
    //     userTaps.forEach((tap, index) => {
    //         if (index < currentPattern.pattern.length) {
    //             const expectedTime = index * (currentPattern.pattern[index] * (60000 / currentPattern.tempo));
    //             const actualTime = tap * 1000;
    //             totalError += Math.abs(expectedTime - actualTime);
    //         }
    //     });
    //
    //     const averageError = totalError / currentPattern.pattern.length;
    //
    //     if (averageError < 100) {
    //         setFeedback('🎯 Perfect Timing! Great job!');
    //     } else if (averageError < 200) {
    //         setFeedback('✅ Good Timing! A little tighter next time.');
    //     } else {
    //         setFeedback('⚠️ Off Beat! Try to lock into the rhythm.');
    //     }
    //
    //     console.log(`Average Timing Error: ${averageError}ms`);
    // };

    return (<></>
        // <div className="flex flex-col items-center justify-center text-center px-6 bg-darkPurple text-white">
        //     <h1 className="text-3xl font-bold text-neonBlue">Rhythm Matching Game</h1>
        //     <p className="mt-2 text-lg text-gray-300">Mode: {difficulty.toUpperCase()}</p>
        //
        //     <div className="mt-6 flex gap-2">
        //         {currentPattern.pattern.map((_, index) => (
        //             <div
        //                 key={index}
        //                 className={`w-4 h-4 rounded-full ${
        //                     isPlaying ? 'bg-yellow-500 animate-pulse' : 'bg-gray-500'
        //                 } transition`}
        //             />
        //         ))}
        //     </div>
        //
        //     <button
        //         onClick={playRhythm}
        //         disabled={isPlaying}
        //         className={`mt-6 px-6 py-3 rounded-lg shadow-lg transition ${
        //             isPlaying ? 'bg-gray-600' : 'bg-neonMagenta hover:bg-pink-500'
        //         }`}
        //     >
        //         🥁 Play Rhythm
        //     </button>
        //
        //     <button
        //         onClick={handleUserTap}
        //         disabled={isPlaying}
        //         className="mt-6 bg-blue-600 px-6 py-3 rounded-lg shadow-lg hover:bg-blue-500 transition"
        //     >
        //         ✋ Tap to Match
        //     </button>
        //     <p className="mt-4 text-lg text-yellow-400">Taps: {userTaps.length} / {currentPattern.pattern.length}</p>
        //
        //     {/*<button*/}
        //     {/*    onClick={analyzeTaps}*/}
        //     {/*    className="mt-4 bg-green-600 px-6 py-3 rounded-lg shadow-lg hover:bg-green-500 transition"*/}
        //     {/*>*/}
        //     {/*    ✅ Check Accuracy*/}
        //     {/*</button>*/}
        //
        //     <p className="mt-4 text-lg">{feedback}</p>
        // </div>
    );
}