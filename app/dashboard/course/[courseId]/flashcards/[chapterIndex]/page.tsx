"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, Layers, ThumbsUp, ThumbsDown, RotateCcw, Trophy } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import AskDoubtFAB from "@/components/dashboard/AskDoubtFAB";

export default function FlashcardsPage() {
    const { user } = useAuth();
    const { courseId, chapterIndex } = useParams();
    const router = useRouter();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentCard, setCurrentCard] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [known, setKnown] = useState(0);
    const [unknown, setUnknown] = useState(0);
    const [finished, setFinished] = useState(false);

    const idx = parseInt(chapterIndex as string);

    useEffect(() => {
        fetchCourse();
    }, [courseId]);

    const fetchCourse = async () => {
        try {
            const res = await fetch(`/api/courses/${courseId}`);
            const data = await res.json();
            if (data.course) setCourse(data.course);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const flashcards = course?.chapters?.[idx]?.flashcards || [];

    const handleAnswer = (isKnown) => {
        if (isKnown) setKnown((k) => k + 1);
        else setUnknown((u) => u + 1);

        setFlipped(false);

        if (currentCard >= flashcards.length - 1) {
            setFinished(true);
            markCompleted();
        } else {
            setTimeout(() => setCurrentCard((c) => c + 1), 200);
        }
    };

    const markCompleted = async () => {
        try {
            await fetch(`/api/courses/${courseId}/progress`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chapterIndex: idx, uid: user.uid }),
            });
        } catch (err) {
            console.error(err);
        }
    };

    const restart = () => {
        setCurrentCard(0);
        setFlipped(false);
        setKnown(0);
        setUnknown(0);
        setFinished(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-indigo-500 dark:text-indigo-400 animate-spin" />
            </div>
        );
    }

    const chapter = course?.chapters?.[idx];

    if (!chapter || flashcards.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">No flashcards available</h2>
                <button onClick={() => router.back()} className="text-indigo-600 dark:text-indigo-400 mt-4 hover:underline">
                    Go back
                </button>
            </div>
        );
    }

    // Finished screen
    if (finished) {
        const percentage = Math.round((known / flashcards.length) * 100);
        return (
            <div className="max-w-lg mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6"
                >
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-yellow-500/30">
                        <Trophy className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Session Complete!</h2>
                    <p className="text-gray-500 dark:text-slate-400">You reviewed all {flashcards.length} flashcards</p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20">
                            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{known}</p>
                            <p className="text-sm text-emerald-600/70 dark:text-emerald-400/70">Known</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 dark:bg-red-500/10 dark:border-red-500/20">
                            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{unknown}</p>
                            <p className="text-sm text-red-600/70 dark:text-red-400/70">Need Review</p>
                        </div>
                    </div>

                    <div className="h-3 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={restart}
                            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Try Again
                        </button>
                        <button
                            onClick={() => router.push(`/dashboard/course/${courseId}`)}
                            className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/25"
                        >
                            Back to Course
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto">
            <button
                onClick={() => router.push(`/dashboard/course/${courseId}`)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Course
            </button>

            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                    <Layers className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                    <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{chapter.title} — Flashcards</h1>
                </div>
                <span className="text-sm text-gray-500 dark:text-slate-400">
                    {currentCard + 1} / {flashcards.length}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden mb-8">
                <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                    animate={{ width: `${((currentCard + 1) / flashcards.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Flashcard */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentCard}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="perspective-1000"
                >
                    <div
                        onClick={() => setFlipped(!flipped)}
                        className="cursor-pointer"
                        style={{ perspective: "1000px" }}
                    >
                        <motion.div
                            animate={{ rotateY: flipped ? 180 : 0 }}
                            transition={{ duration: 0.5 }}
                            style={{ transformStyle: "preserve-3d" }}
                            className="relative w-full h-64 sm:h-72 rounded-3xl"
                        >
                            {/* Front */}
                            <div
                                className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 border border-purple-200 dark:from-purple-500/20 dark:to-pink-500/20 dark:border-white/10 flex items-center justify-center p-8 backface-hidden"
                                style={{ backfaceVisibility: "hidden" }}
                            >
                                <p className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white text-center">
                                    {flashcards[currentCard]?.front}
                                </p>
                            </div>
                            {/* Back */}
                            <div
                                className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200 dark:from-indigo-500/20 dark:to-purple-500/20 dark:border-indigo-500/20 flex items-center justify-center p-8"
                                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                            >
                                <p className="text-base sm:text-lg text-gray-700 dark:text-slate-200 text-center">
                                    {flashcards[currentCard]?.back}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <p className="text-center text-sm text-gray-400 dark:text-slate-500 mt-3 mb-6">
                {flipped ? "How well did you know this?" : "Tap to reveal the answer"}
            </p>

            {/* Answer Buttons */}
            {flipped && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAnswer(false)}
                        className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 font-medium hover:bg-red-100 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/20 transition-colors"
                    >
                        <ThumbsDown className="w-5 h-5" />
                        Don&apos;t Know
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAnswer(true)}
                        className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 font-medium hover:bg-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/20 transition-colors"
                    >
                        <ThumbsUp className="w-5 h-5" />
                        Know It
                    </motion.button>
                </motion.div>
            )}

            <AskDoubtFAB
                courseTopic={course?.topic || course?.title || ""}
                chapterTitle={chapter?.title || ""}
                chapterNotes={chapter?.notes || ""}
            />
        </div>
    );
}
