import { ReactNode } from 'react';
import Link from 'next/link';
import { useProgressStore } from '@/store/useProgressStore';
import { lessons } from '@/data/lessons';
import Image from "next/image";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const { currentLesson } = useProgressStore();

    // Find the current lesson object by id.
    const currentLessonObj = lessons.find((lesson) => lesson.id === currentLesson);
    const lessonTitle = currentLessonObj ? currentLessonObj.title : "Lesson";

    // Calculate progress percent (e.g. out of lessons.length).
    const progressPercent = Math.round(
        ((currentLesson - 1) / lessons.length) * 100
    );

    // For a dark background, we'll use the white logo.
    const logoSrc = '/ScaleUpLogoWhite.png';

    return (
        <div className="min-h-screen bg-darkPurple text-white">
            {/* Header */}
            <header className="flex items-center justify-between p-4 border-b border-gray-800">
                <Link href="/" className="flex items-center">
                    <Image src={logoSrc} alt="ScaleUp Logo" width={125} height={125} priority />
                </Link>
                <nav className="flex items-center gap-6">
                    {/*<span className="text-lg text-gray-300">Level: <span className="font-bold text-neonBlue">{difficulty}</span></span>*/}
                    <Link href="/curriculum" className="text-lg text-gray-300 hover:text-neonMagenta transition">
                        Curriculum
                    </Link>
                </nav>
            </header>

            {/* Progress Indicator */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                    Current Lesson: <span className="font-bold">{lessonTitle}</span>
                </div>
                {/* Progress Bar */}
                <div className="w-1/2 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className={"h-full bg-neonMagenta" + (progressPercent === 100 ? " shimmer" : "")}
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
            </div>

            {/* Main Content */}
            <main className="p-6">{children}</main>

            {/* Footer */}
            <footer className="p-4 text-center text-gray-500 text-xs border-t border-gray-800">
                © {new Date().getFullYear()} ScaleUp. All rights reserved.
            </footer>
        </div>
    );
}