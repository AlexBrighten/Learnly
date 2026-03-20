"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Loader2, BookOpen } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import MarkdownRenderer from "@/components/dashboard/MarkdownRenderer";
import AskDoubtFAB from "@/components/dashboard/AskDoubtFAB";

export default function NotesPage() {
    const { user } = useAuth();
    const { courseId, chapterIndex } = useParams();
    const router = useRouter();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completed, setCompleted] = useState(false);
    const [marking, setMarking] = useState(false);

    const idx = parseInt(chapterIndex as string);

    useEffect(() => {
        fetchCourse();
    }, [courseId]);

    const fetchCourse = async () => {
        try {
            const res = await fetch(`/api/courses/${courseId}`);
            const data = await res.json();
            if (data.course) {
                setCourse(data.course);
                setCompleted(data.course.progress?.completedChapters?.includes(idx) || false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const markCompleted = async () => {
        setMarking(true);
        try {
            await fetch(`/api/courses/${courseId}/progress`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chapterIndex: idx, uid: user.uid }),
            });
            setCompleted(true);
        } catch (err) {
            console.error(err);
        } finally {
            setMarking(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-indigo-500 dark:text-indigo-400 animate-spin" />
            </div>
        );
    }

    const chapter = course?.chapters?.[idx];
    if (!chapter) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Chapter not found</h2>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <button
                onClick={() => router.push(`/dashboard/course/${courseId}`)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-5"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Course
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-white border border-gray-200 dark:bg-white/5 dark:border-white/10 p-5 sm:p-8"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">CHAPTER {idx + 1} — NOTES</span>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{chapter.title}</h1>
                    </div>
                </div>

                <MarkdownRenderer content={chapter.notes} />

                {/* Mark Completed */}
                <div className="mt-10 pt-6 border-t border-gray-200 dark:border-white/10">
                    {completed ? (
                        <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400 font-medium">
                            <CheckCircle2 className="w-5 h-5" />
                            Chapter completed!
                        </div>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={markCompleted}
                            disabled={marking}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/25 disabled:opacity-50"
                        >
                            {marking ? "Saving..." : "Mark as Completed"}
                        </motion.button>
                    )}
                </div>
            </motion.div>

            <AskDoubtFAB
                courseTopic={course?.topic || course?.title || ""}
                chapterTitle={chapter.title}
                chapterNotes={chapter.notes}
            />
        </div>
    );
}
