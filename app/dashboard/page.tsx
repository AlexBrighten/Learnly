"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, BrainCircuit, BookOpen, Plus, Zap, Target, Loader2, Trash2 } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

export default function DashboardPage() {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, courseId: string, courseTitle: string } | null>(null);

    useEffect(() => {
        if (user?.uid) fetchCourses();
        
        const closeMenu = () => setContextMenu(null);
        document.addEventListener("click", closeMenu);
        return () => document.removeEventListener("click", closeMenu);
    }, [user]);

    const fetchCourses = async () => {
        try {
            const res = await fetch("/api/courses", {
                headers: { "x-user-uid": user.uid },
            });
            const data = await res.json();
            setCourses(data.courses || []);
        } catch (err) {
            console.error("Failed to fetch courses:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCourse = async (id: string, title: string) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
        
        try {
            const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
            if (res.ok) {
                setCourses(prev => prev.filter(c => c.id !== id));
            } else {
                alert("Failed to delete course.");
            }
        } catch (err) {
            console.error("Delete Error:", err);
        }
    };

    const handleContextMenu = (e: React.MouseEvent, id: string, title: string) => {
        e.preventDefault();
        setContextMenu({ x: e.pageX, y: e.pageY, courseId: id, courseTitle: title });
    };

    const getProgress = (course) => {
        const completed = course.progress?.completedChapters?.length || 0;
        const total = course.chapters?.length || 1;
        return Math.round((completed / total) * 100);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-900 p-8 sm:p-10 shadow-2xl shadow-indigo-500/20"
            >
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/5 blur-3xl mix-blend-overlay pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="space-y-4 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-indigo-100 text-sm font-medium backdrop-blur-md">
                            <Sparkles className="w-4 h-4 text-indigo-300" />
                            <span>Welcome back, {user?.displayName?.split(" ")[0] || "Learner"}!</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                            Ready to expand your{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200">
                                knowledge?
                            </span>
                        </h1>
                        <div className="flex items-center gap-6 text-indigo-200/80 text-sm">
                            <span className="flex items-center gap-1.5">
                                <BookOpen className="w-4 h-4" />
                                {courses.length} course{courses.length !== 1 ? "s" : ""}
                            </span>
                        </div>
                    </div>
                    <Link
                        href="/dashboard/create"
                        className="group shrink-0 relative px-6 py-3 rounded-xl bg-white text-indigo-900 font-semibold shadow-xl shadow-white/10 hover:shadow-white/20 transition-all hover:-translate-y-0.5"
                    >
                        <span className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Create Course
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>
                </div>
            </motion.div>

            {/* Courses Section */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                    Your Courses
                </h2>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-indigo-500 dark:text-indigo-400 animate-spin" />
                    </div>
                ) : courses.length === 0 ? (
                    // Empty State
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50/50 dark:border-white/10 dark:bg-white/[0.02] p-12 flex flex-col items-center justify-center text-center"
                    >
                        <div className="w-20 h-20 rounded-2xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center mb-6">
                            <BrainCircuit className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Start Your Learning Journey
                        </h3>
                        <p className="text-gray-500 dark:text-slate-400 max-w-md mb-8">
                            Create your first AI-powered course in seconds. Choose any topic and
                            let our AI build a personalized learning path for you.
                        </p>
                        <Link
                            href="/dashboard/create"
                            className="group px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:-translate-y-0.5"
                        >
                            <span className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Create Your First Course
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    </motion.div>
                ) : (
                    // Course Cards Grid
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {courses.map((course, idx) => {
                                const progress = getProgress(course);
                                return (
                                    <motion.div
                                        key={course.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.05 * idx }}
                                        onContextMenu={(e) => handleContextMenu(e, course.id, course.title)}
                                    >
                                        <Link
                                            href={`/dashboard/course/${course.id}`}
                                            className="block group"
                                        >
                                            <div className="p-6 rounded-2xl bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 dark:bg-white/5 dark:border-white/5 dark:backdrop-blur-xl dark:hover:bg-white/[0.08] dark:hover:border-indigo-500/20 transition-all duration-300 relative overflow-hidden">
                                                {/* Glow Effect */}
                                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                                <div className="relative z-10">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                                                            <BrainCircuit className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                                                        </div>
                                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                                            course.status === "ready"
                                                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                                                                : "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400"
                                                        }`}>
                                                            {course.status === "ready" ? "Ready" : "Generating..."}
                                                        </span>
                                                    </div>

                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors line-clamp-1">
                                                        {course.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 dark:text-slate-400 mb-4 line-clamp-2">
                                                        {course.summary}
                                                    </p>

                                                    {/* Progress Bar */}
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-xs">
                                                            <span className="text-gray-500 dark:text-slate-400">
                                                                {course.progress?.completedChapters?.length || 0}/{course.chapters?.length || 0} chapters
                                                            </span>
                                                            <span className="text-indigo-600 dark:text-indigo-400 font-medium">{progress}%</span>
                                                        </div>
                                                        <div className="h-2 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${progress}%` }}
                                                                transition={{ duration: 1, delay: 0.2 * idx }}
                                                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Footer */}
                                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                                                        <span className="text-xs text-gray-400 dark:text-slate-500 capitalize">
                                                            {course.difficulty || "beginner"} • {course.courseType || "knowledge"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Custom Right-Click Context Menu */}
            <AnimatePresence>
                {contextMenu && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="fixed z-50 min-w-[160px] bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 shadow-2xl rounded-xl p-1 backdrop-blur-xl"
                        style={{ top: contextMenu.y, left: contextMenu.x }}
                    >
                        <button
                            onClick={() => handleDeleteCourse(contextMenu.courseId, contextMenu.courseTitle)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors text-left"
                        >
                            <Trash2 className="w-4 h-4 mb-0.5" />
                            Delete Course
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
