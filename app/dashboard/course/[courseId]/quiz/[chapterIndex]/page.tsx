"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, Zap, Clock, CheckCircle2, XCircle, Trophy, RotateCcw } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import AskDoubtFAB from "@/components/dashboard/AskDoubtFAB";

const TIMER_SECONDS = 30;

export default function QuizPage() {
    const { user } = useAuth();
    const { courseId, chapterIndex } = useParams();
    const router = useRouter();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQ, setCurrentQ] = useState(0);
    const [selected, setSelected] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
    const timerRef = useRef(null);

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

    const quiz = course?.chapters?.[idx]?.quiz || [];

    // Timer
    useEffect(() => {
        if (loading || finished || showFeedback || quiz.length === 0) return;

        setTimeLeft(TIMER_SECONDS);
        timerRef.current = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    clearInterval(timerRef.current);
                    handleSelect(-1); // time's up
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [currentQ, loading, finished]);

    const handleSelect = (optionIdx) => {
        if (showFeedback) return;
        clearInterval(timerRef.current);

        setSelected(optionIdx);
        setShowFeedback(true);

        const isCorrect = optionIdx === quiz[currentQ]?.correctAnswer;
        if (isCorrect) setScore((s) => s + 1);

        setTimeout(() => {
            if (currentQ >= quiz.length - 1) {
                setFinished(true);
                markCompleted();
            } else {
                setCurrentQ((q) => q + 1);
                setSelected(null);
                setShowFeedback(false);
            }
        }, 1500);
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
        setCurrentQ(0);
        setSelected(null);
        setShowFeedback(false);
        setScore(0);
        setFinished(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-indigo-500 dark:text-indigo-400 animate-spin" />
            </div>
        );
    }

    if (!course?.chapters?.[idx] || quiz.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">No quiz available</h2>
                <button onClick={() => router.back()} className="text-indigo-600 dark:text-indigo-400 mt-4 hover:underline">Go back</button>
            </div>
        );
    }

    // Score Screen
    if (finished) {
        const percentage = Math.round((score / quiz.length) * 100);
        const xpEarned = score * 10 + 50;

        return (
            <div className="max-w-lg mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6 py-10"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-2xl ${
                            percentage >= 70
                                ? "bg-gradient-to-br from-yellow-400 to-orange-500 shadow-yellow-500/30"
                                : "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/30"
                        }`}
                    >
                        <Trophy className="w-12 h-12 text-white" />
                    </motion.div>

                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {percentage >= 80 ? "Outstanding! 🎉" : percentage >= 60 ? "Good Job! 💪" : "Keep Practicing! 📚"}
                        </h2>
                        <p className="text-gray-500 dark:text-slate-400">You scored {score} out of {quiz.length}</p>
                    </div>

                    {/* Score Ring */}
                    <div className="relative w-32 h-32 mx-auto">
                        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
                            <circle cx="64" cy="64" r="52" fill="none" stroke="currentColor" strokeWidth="10" className="text-gray-200 dark:text-white/5" />
                            <motion.circle
                                cx="64" cy="64" r="52" fill="none"
                                stroke={percentage >= 70 ? "#22c55e" : "#6366f1"}
                                strokeWidth="10"
                                strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 52}
                                initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - percentage / 100) }}
                                transition={{ duration: 1.5, delay: 0.3 }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">{percentage}%</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-yellow-500 dark:text-yellow-400 font-medium">
                        <Zap className="w-5 h-5" />
                        +{xpEarned} XP earned!
                    </div>

                    <div className="flex gap-4 justify-center pt-4">
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

    const question = quiz[currentQ];

    return (
        <div className="max-w-2xl mx-auto">
            <button
                onClick={() => router.push(`/dashboard/course/${courseId}`)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Course
            </button>

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                    <span className="text-sm text-gray-500 dark:text-slate-400">
                        Question {currentQ + 1} of {quiz.length}
                    </span>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                    timeLeft <= 10 ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" : "bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-slate-300"
                }`}>
                    <Clock className="w-4 h-4" />
                    {timeLeft}s
                </div>
            </div>

            {/* Progress */}
            <div className="h-2 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden mb-8">
                <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500"
                    animate={{ width: `${((currentQ + 1) / quiz.length) * 100}%` }}
                />
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQ}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                >
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white leading-relaxed">
                        {question?.question}
                    </h2>

                    <div className="space-y-3">
                        {question?.options?.map((option, optIdx) => {
                            let btnClass = "border-gray-200 bg-white hover:border-gray-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20";

                            if (showFeedback) {
                                if (optIdx === question.correctAnswer) {
                                    btnClass = "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10";
                                } else if (optIdx === selected && optIdx !== question.correctAnswer) {
                                    btnClass = "border-red-500 bg-red-50 dark:bg-red-500/10";
                                }
                            } else if (selected === optIdx) {
                                btnClass = "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10";
                            }

                            return (
                                <motion.button
                                    key={optIdx}
                                    whileHover={!showFeedback ? { scale: 1.01 } : {}}
                                    whileTap={!showFeedback ? { scale: 0.99 } : {}}
                                    onClick={() => handleSelect(optIdx)}
                                    disabled={showFeedback}
                                    className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${btnClass}`}
                                >
                                    <span className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-sm font-medium text-gray-500 dark:text-slate-400 shrink-0">
                                        {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    <span className="text-gray-900 dark:text-white">{option}</span>
                                    {showFeedback && optIdx === question.correctAnswer && (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 ml-auto shrink-0" />
                                    )}
                                    {showFeedback && optIdx === selected && optIdx !== question.correctAnswer && (
                                        <XCircle className="w-5 h-5 text-red-500 dark:text-red-400 ml-auto shrink-0" />
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Feedback Explanation */}
                    {showFeedback && question?.explanation && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 dark:bg-indigo-500/5 dark:border-indigo-500/10"
                        >
                            <p className="text-sm text-gray-700 dark:text-slate-300">
                                <span className="font-medium text-indigo-600 dark:text-indigo-400">Explanation: </span>
                                {question.explanation}
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>

            <AskDoubtFAB
                courseTopic={course?.topic || course?.title || ""}
                chapterTitle={course?.chapters?.[idx]?.title || ""}
                chapterNotes={course?.chapters?.[idx]?.notes || ""}
            />
        </div>
    );
}
