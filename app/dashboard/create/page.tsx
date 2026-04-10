"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight,
    ArrowLeft,
    Sparkles,
    BookOpen,
    GraduationCap,
    Briefcase,
    Target,
    Brain,
    FileText,
    Layers,
    HelpCircle,
    CheckCircle2,
    Loader2,
    Zap,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";

const STEPS = ["topic", "type", "difficulty", "materials"];

const COURSE_TYPES = [
    { id: "exam", label: "Exam Prep", icon: GraduationCap, description: "Focused on testable concepts & key facts", color: "from-blue-500 to-cyan-500" },
    { id: "interview", label: "Interview", icon: Briefcase, description: "Common questions & practical scenarios", color: "from-emerald-500 to-teal-500" },
    { id: "practice", label: "Practice", icon: Target, description: "Hands-on exercises & skill building", color: "from-orange-500 to-amber-500" },
    { id: "knowledge", label: "Deep Dive", icon: Brain, description: "Comprehensive understanding & theory", color: "from-purple-500 to-indigo-500" },
];

const DIFFICULTIES = [
    { id: "beginner", label: "Beginner", emoji: "🌱", description: "Start from scratch", color: "border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
    { id: "intermediate", label: "Intermediate", emoji: "🔥", description: "Build on your knowledge", color: "border-yellow-500 bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400" },
    { id: "advanced", label: "Advanced", emoji: "⚡", description: "Master-level content", color: "border-red-500 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" },
];

const MATERIALS = [
    { id: "notes", label: "Notes", icon: FileText, description: "Detailed study notes" },
    { id: "flashcards", label: "Flashcards", icon: Layers, description: "Interactive flashcards" },
    { id: "quiz", label: "Quiz", icon: Zap, description: "MCQ with scoring" },
    { id: "qa", label: "Q&A", icon: HelpCircle, description: "Questions & Answers" },
];

function CreateCourseContent() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [step, setStep] = useState(0);
    const [topic, setTopic] = useState("");
    const [courseType, setCourseType] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [selectedMaterials, setSelectedMaterials] = useState([]);
    const [allSelected, setAllSelected] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const queryTopic = searchParams?.get("topic");
        if (queryTopic) {
            setTopic(queryTopic);
            setStep(1); // skip topic selection step
        }
    }, [searchParams]);

    const toggleMaterial = (id) => {
        if (id === "all") {
            if (allSelected) {
                setSelectedMaterials([]);
                setAllSelected(false);
            } else {
                setSelectedMaterials(MATERIALS.map((m) => m.id));
                setAllSelected(true);
            }
            return;
        }
        setSelectedMaterials((prev) => {
            const next = prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id];
            setAllSelected(next.length === MATERIALS.length);
            return next;
        });
    };

    const canProceed = () => {
        switch (step) {
            case 0: return topic.trim().length > 2;
            case 1: return !!courseType;
            case 2: return !!difficulty;
            case 3: return selectedMaterials.length > 0;
            default: return false;
        }
    };

    const handleSubmit = async () => {
        setGenerating(true);
        setError("");

        try {
            const res = await fetch("/api/generate-course", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    topic,
                    courseType,
                    difficulty,
                    materials: selectedMaterials,
                    uid: user.uid,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to generate course");

            router.push(`/dashboard/course/${data.courseId}`);
        } catch (err) {
            setError(err.message);
            setGenerating(false);
        }
    };

    const nextStep = () => {
        if (step === STEPS.length - 1) {
            handleSubmit();
        } else {
            setStep((s) => s + 1);
        }
    };

    // Generating overlay
    if (generating) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30"
                    >
                        <Brain className="w-10 h-10 text-white" />
                    </motion.div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">AI is generating your course...</h2>
                        <p className="text-gray-500 dark:text-slate-400">Creating chapters, notes, quizzes, and more for <span className="text-indigo-600 dark:text-indigo-400 font-medium">{topic}</span></p>
                    </div>
                    <motion.div
                        className="flex items-center justify-center gap-1"
                    >
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                className="w-3 h-3 rounded-full bg-indigo-500"
                            />
                        ))}
                    </motion.div>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-500 dark:text-red-400 text-sm"
                        >
                            {error}
                        </motion.p>
                    )}
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-10">
                <div className="flex items-center justify-between mb-3">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                        Create a Course
                    </h1>
                    <span className="text-sm text-gray-500 dark:text-slate-400">Step {step + 1} of {STEPS.length}</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
                    <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                        transition={{ duration: 0.4 }}
                    />
                </div>
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Step 1 — Topic */}
                    {step === 0 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">What do you want to learn?</h2>
                                <p className="text-gray-500 dark:text-slate-400">Enter any topic and our AI will create a personalized course for you.</p>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && canProceed() && nextStep()}
                                    placeholder="e.g. Machine Learning, React.js, World History..."
                                    className="w-full px-6 py-5 text-lg rounded-2xl bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:bg-white/[0.07]"
                                    autoFocus
                                />
                                <BookOpen className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 dark:text-slate-500" />
                            </div>
                        </div>
                    )}

                    {/* Step 2 — Course Type */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Choose your learning style</h2>
                                <p className="text-gray-500 dark:text-slate-400">How do you want to approach <span className="text-indigo-600 dark:text-indigo-400 font-medium">{topic}</span>?</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {COURSE_TYPES.map((type) => (
                                    <motion.button
                                        key={type.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setCourseType(type.id)}
                                        className={`p-6 rounded-2xl border-2 text-left transition-all ${
                                            courseType === type.id
                                                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
                                                : "border-gray-200 bg-white hover:border-gray-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
                                        }`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4`}>
                                            <type.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{type.label}</h3>
                                        <p className="text-sm text-gray-500 dark:text-slate-400">{type.description}</p>
                                        {courseType === type.id && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute top-4 right-4"
                                            >
                                                <CheckCircle2 className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                                            </motion.div>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3 — Difficulty */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Select difficulty</h2>
                                <p className="text-gray-500 dark:text-slate-400">Choose the level that matches your current knowledge.</p>
                            </div>
                            <div className="space-y-4">
                                {DIFFICULTIES.map((diff) => (
                                    <motion.button
                                        key={diff.id}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => setDifficulty(diff.id)}
                                        className={`w-full p-6 rounded-2xl border-2 text-left transition-all flex items-center gap-5 ${
                                            difficulty === diff.id
                                                ? diff.color + " border-2"
                                                : "border-gray-200 bg-white hover:border-gray-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
                                        }`}
                                    >
                                        <span className="text-4xl">{diff.emoji}</span>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{diff.label}</h3>
                                            <p className="text-sm text-gray-500 dark:text-slate-400">{diff.description}</p>
                                        </div>
                                        {difficulty === diff.id && (
                                            <CheckCircle2 className="w-6 h-6 text-current ml-auto" />
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 4 — Materials */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Pick your materials</h2>
                                <p className="text-gray-500 dark:text-slate-400">Select what study materials you want generated.</p>
                            </div>

                            {/* Select All */}
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() => toggleMaterial("all")}
                                className={`w-full p-5 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                                    allSelected
                                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
                                        : "border-gray-200 bg-white hover:border-gray-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
                                }`}
                            >
                                <Sparkles className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                                <span className="font-semibold text-gray-900 dark:text-white">Select All</span>
                                {allSelected && <CheckCircle2 className="w-5 h-5 text-indigo-500 dark:text-indigo-400 ml-auto" />}
                            </motion.button>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {MATERIALS.map((mat) => (
                                    <motion.button
                                        key={mat.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => toggleMaterial(mat.id)}
                                        className={`p-5 rounded-2xl border-2 text-left transition-all ${
                                            selectedMaterials.includes(mat.id)
                                                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
                                                : "border-gray-200 bg-white hover:border-gray-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <mat.icon className={`w-5 h-5 ${
                                                selectedMaterials.includes(mat.id) ? "text-indigo-500 dark:text-indigo-400" : "text-gray-400 dark:text-slate-400"
                                            }`} />
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">{mat.label}</h3>
                                                <p className="text-xs text-gray-500 dark:text-slate-400">{mat.description}</p>
                                            </div>
                                            {selectedMaterials.includes(mat.id) && (
                                                <CheckCircle2 className="w-5 h-5 text-indigo-500 dark:text-indigo-400 ml-auto" />
                                            )}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Error */}
            {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 dark:text-red-400 text-sm mt-4 text-center">
                    {error}
                </motion.p>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10">
                <button
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    disabled={step === 0}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                <motion.button
                    whileHover={{ scale: canProceed() ? 1.02 : 1 }}
                    whileTap={{ scale: canProceed() ? 0.98 : 1 }}
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-indigo-500/40"
                >
                    {step === STEPS.length - 1 ? (
                        <>
                            <Sparkles className="w-4 h-4" />
                            Generate Course
                        </>
                    ) : (
                        <>
                            Continue
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
}

export default function CreateCoursePage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>}>
            <CreateCourseContent />
        </Suspense>
    );
}
