"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    BookOpen,
    Layers,
    Zap,
    HelpCircle,
    FileText,
    Lock,
    CheckCircle2,
    Star,
    Loader2,
    Trophy,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AskDoubtFAB from "@/components/dashboard/AskDoubtFAB";

const MATERIAL_ICONS = {
    notes: { icon: FileText, label: "Notes", color: "from-blue-500 to-cyan-500" },
    flashcards: { icon: Layers, label: "Flashcards", color: "from-purple-500 to-pink-500" },
    quiz: { icon: Zap, label: "Quiz", color: "from-orange-500 to-amber-500" },
    qa: { icon: HelpCircle, label: "Q&A", color: "from-emerald-500 to-teal-500" },
};

export default function CourseDetailPage() {
    const { user } = useAuth();
    const { courseId } = useParams();
    const router = useRouter();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedChapter, setExpandedChapter] = useState(null);

    useEffect(() => {
        if (courseId) fetchCourse();
    }, [courseId]);

    const fetchCourse = async () => {
        try {
            const res = await fetch(`/api/courses/${courseId}`);
            const data = await res.json();
            if (data.course) setCourse(data.course);
        } catch (err) {
            console.error("Failed to fetch course:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-indigo-500 dark:text-indigo-400 animate-spin" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Course not found</h2>
                <p className="text-gray-500 dark:text-slate-400 mb-6">This course may have been deleted.</p>
                <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                    ← Back to Dashboard
                </Link>
            </div>
        );
    }

    const completedChapters = course.progress?.completedChapters || [];
    const totalChapters = course.chapters?.length || 0;
    const progress = totalChapters > 0 ? Math.round((completedChapters.length / totalChapters) * 100) : 0;

    const getChapterStatus = (idx) => {
        if (completedChapters.includes(idx)) return "completed";
        if (idx === 0 || completedChapters.includes(idx - 1)) return "current";
        return "locked";
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </button>

            {/* Course Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl bg-gradient-to-br from-indigo-100 via-purple-100 to-indigo-100 border border-indigo-200/50 dark:from-indigo-600/20 dark:via-purple-700/20 dark:to-indigo-900/20 dark:border-white/10 p-8 mb-10"
            >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                    <div className="space-y-3">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
                        <p className="text-gray-600 dark:text-slate-400 max-w-xl">{course.summary}</p>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1.5 text-yellow-500 dark:text-yellow-400">
                                <Zap className="w-4 h-4" />
                                {course.progress?.xpEarned || 0} XP
                            </span>
                            <span className="text-gray-500 dark:text-slate-500 capitalize">
                                {course.difficulty} • {course.courseType}
                            </span>
                            <span className="text-gray-500 dark:text-slate-500">
                                {totalChapters} chapters
                            </span>
                        </div>
                    </div>

                    {/* Circular Progress */}
                    <div className="relative w-24 h-24 shrink-0">
                        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                            <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200 dark:text-white/5" />
                            <circle
                                cx="48" cy="48" r="40" fill="none"
                                stroke="url(#progress-gradient)"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 40}
                                strokeDashoffset={2 * Math.PI * 40 * (1 - progress / 100)}
                                className="transition-all duration-1000"
                            />
                            <defs>
                                <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="#a855f7" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">{progress}%</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Gamified Chapter Path */}
            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-white/5" />

                <div className="space-y-0">
                    {course.chapters?.map((chapter, idx) => {
                        const status = getChapterStatus(idx);
                        const isExpanded = expandedChapter === idx;
                        const isLast = idx === course.chapters.length - 1;

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.08 * idx }}
                                className="relative"
                            >
                                {/* Node */}
                                <button
                                    onClick={() => status !== "locked" && setExpandedChapter(isExpanded ? null : idx)}
                                    disabled={status === "locked"}
                                    className={`w-full text-left pl-20 pr-6 py-6 rounded-2xl transition-all duration-300 group ${
                                        status === "locked"
                                            ? "opacity-50 cursor-not-allowed"
                                            : isExpanded
                                            ? "bg-gray-100/80 dark:bg-white/[0.06]"
                                            : "hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                                    }`}
                                >
                                    {/* Circle Node */}
                                    <div className={`absolute left-4 top-6 w-9 h-9 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                                        status === "completed"
                                            ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
                                            : status === "current"
                                            ? "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 ring-4 ring-indigo-500/20"
                                            : "bg-gray-100 border border-gray-200 dark:bg-white/10 dark:border-white/10"
                                    }`}>
                                        {status === "completed" ? (
                                            <CheckCircle2 className="w-5 h-5 text-white" />
                                        ) : status === "current" ? (
                                            <Star className="w-5 h-5 text-white" />
                                        ) : (
                                            <Lock className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">CHAPTER {idx + 1}</span>
                                            {status === "completed" && (
                                                <span className="text-xs bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                                                    +50 XP
                                                </span>
                                            )}
                                        </div>
                                        <h3 className={`text-lg font-semibold transition-colors ${
                                            status === "locked" ? "text-gray-400 dark:text-slate-500" : "text-gray-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300"
                                        }`}>
                                            {chapter.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">{chapter.summary}</p>
                                    </div>
                                </button>

                                {/* Expanded Material Buttons */}
                                {isExpanded && status !== "locked" && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="pl-20 pr-6 pb-6 grid grid-cols-2 sm:grid-cols-4 gap-3"
                                    >
                                        {(course.materials || ["notes", "flashcards", "quiz", "qa"]).map((mat) => {
                                            const matInfo = MATERIAL_ICONS[mat];
                                            if (!matInfo) return null;
                                            const Icon = matInfo.icon;

                                            return (
                                                <Link
                                                    key={mat}
                                                    href={`/dashboard/course/${courseId}/${mat}/${idx}`}
                                                    className="group"
                                                >
                                                    <motion.div
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className={`p-4 rounded-xl bg-gradient-to-br ${matInfo.color} bg-opacity-10 border border-gray-200 hover:border-gray-300 dark:border-white/10 dark:hover:border-white/20 transition-all text-center`}
                                                    >
                                                        <Icon className="w-6 h-6 text-white mx-auto mb-2" />
                                                        <span className="text-sm font-medium text-white">{matInfo.label}</span>
                                                    </motion.div>
                                                </Link>
                                            );
                                        })}
                                    </motion.div>
                                )}

                                {/* Trophy at end */}
                                {isLast && (
                                    <div className="relative pl-20 pb-6">
                                        <div className={`absolute left-4 top-0 w-9 h-9 rounded-full flex items-center justify-center z-10 ${
                                            progress === 100
                                                ? "bg-yellow-500 shadow-lg shadow-yellow-500/30"
                                                : "bg-gray-100 border border-gray-200 dark:bg-white/5 dark:border-white/10"
                                        }`}>
                                            <Trophy className={`w-5 h-5 ${progress === 100 ? "text-white" : "text-gray-400 dark:text-slate-600"}`} />
                                        </div>
                                        <p className={`text-sm font-medium pt-2 ${
                                            progress === 100 ? "text-yellow-500 dark:text-yellow-400" : "text-gray-400 dark:text-slate-600"
                                        }`}>
                                            {progress === 100 ? "🎉 Course Complete!" : "Complete all chapters to earn the trophy"}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <AskDoubtFAB
                courseTopic={course?.topic || course?.title || ""}
                chapterTitle={course?.title || ""}
                chapterNotes={course?.summary || ""}
            />
        </div>
    );
}
