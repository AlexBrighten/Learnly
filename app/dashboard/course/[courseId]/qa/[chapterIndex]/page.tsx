"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, HelpCircle, ChevronDown } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useParams, useRouter } from "next/navigation";

export default function QAPage() {
    const { user } = useAuth();
    const { courseId, chapterIndex } = useParams();
    const router = useRouter();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);

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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
        );
    }

    const chapter = course?.chapters?.[idx];
    const qaList = chapter?.qa || [];

    if (!chapter || qaList.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-bold text-white">No Q&A available</h2>
                <button onClick={() => router.back()} className="text-indigo-400 mt-4 hover:underline">Go back</button>
            </div>
        );
    }

    // Simple markdown line renderer
    const renderAnswer = (text) => {
        if (!text) return null;
        return text.split("\n").map((line, i) => {
            if (line.startsWith("- ") || line.startsWith("* ")) return <li key={i} className="text-slate-300 ml-6 list-disc mb-1">{line.replace(/^[-*] /, "")}</li>;
            if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-semibold text-white mb-1">{line.replace(/\*\*/g, "")}</p>;
            if (line.trim() === "") return <div key={i} className="h-2" />;
            return <p key={i} className="text-slate-300 leading-relaxed mb-1">{line}</p>;
        });
    };

    return (
        <div className="max-w-3xl mx-auto">
            <button
                onClick={() => router.push(`/dashboard/course/${courseId}`)}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Course
            </button>

            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                    <span className="text-xs text-slate-500 font-medium">CHAPTER {idx + 1} — Q&A</span>
                    <h1 className="text-2xl font-bold text-white">{chapter.title}</h1>
                </div>
            </div>

            {/* Accordion */}
            <div className="space-y-3">
                {qaList.map((item, qIdx) => (
                    <motion.div
                        key={qIdx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * qIdx }}
                        className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
                    >
                        <button
                            onClick={() => setExpanded(expanded === qIdx ? null : qIdx)}
                            className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/[0.03] transition-colors"
                        >
                            <span className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-sm font-medium text-emerald-400 shrink-0">
                                {qIdx + 1}
                            </span>
                            <span className="text-white font-medium flex-1">{item.question}</span>
                            <motion.div
                                animate={{ rotate: expanded === qIdx ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                            </motion.div>
                        </button>

                        <AnimatePresence>
                            {expanded === qIdx && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-5 pb-5 pt-0 pl-[4.25rem] border-t border-white/5">
                                        <div className="pt-4">
                                            {renderAnswer(item.answer)}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
