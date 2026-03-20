"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";
import { db } from "@/configs/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  BookOpen, Brain, Zap, FileQuestion, GraduationCap,
  ArrowRight, ArrowLeft, Sparkles, Loader2, ChevronRight
} from "lucide-react";

const difficulties = [
  { value: "beginner", label: "Beginner", desc: "No prior knowledge needed", color: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400" },
  { value: "intermediate", label: "Intermediate", desc: "Some familiarity helpful", color: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400" },
  { value: "advanced", label: "Advanced", desc: "Deep prior knowledge required", color: "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400" },
];

const types = [
  { value: "flashcards", label: "Flashcards", desc: "Bite-sized key facts", icon: Zap, color: "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-400" },
  { value: "quiz", label: "Quiz", desc: "Multiple-choice questions", icon: FileQuestion, color: "from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-400" },
  { value: "qa", label: "Q & A", desc: "Question and answer pairs", icon: Brain, color: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400" },
  { value: "exam", label: "Exam Prep", desc: "In-depth exam questions", icon: GraduationCap, color: "from-rose-500/20 to-rose-600/10 border-rose-500/30 text-rose-400" },
];

const steps = ["Topic", "Difficulty", "Type", "Generate"];

function CreateCourseInner() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(0);
  const [topic, setTopic] = useState(searchParams.get("topic") || "");
  const [difficulty, setDifficulty] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canNext = [
    topic.trim().length > 2,
    !!difficulty,
    !!type,
  ];

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      // Generate course via Gemini (and save to Firestore server-side)
      const res = await fetch("/api/generate-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          difficulty,
          type,
          userId: user?.uid,
          userEmail: user?.email
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Generation failed");

      // Redirect using the docId returned from the backend
      router.push(`/course/${data.docId}`);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" /> AI Course Generator
          </div>
          <h1 className="text-3xl font-bold text-white">Create Your Course</h1>
          <p className="text-slate-400 mt-2">Let AI build a personalized course for you in seconds</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-all ${
                i < step ? "bg-indigo-600 text-white" :
                i === step ? "bg-indigo-500/30 border border-indigo-500 text-indigo-300" :
                "bg-white/5 text-slate-500"
              }`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i === step ? "text-white" : "text-slate-500"}`}>{s}</span>
              {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-slate-600" />}
            </div>
          ))}
        </div>

        {/* Card */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl"
        >
          {/* Step 0: Topic */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">What do you want to learn?</h2>
                <p className="text-slate-400 text-sm">Enter any topic, subject, or skill</p>
              </div>
              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  autoFocus
                  type="text"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && canNext[0] && setStep(1)}
                  placeholder="e.g. Quantum Physics, Spanish Grammar, React Hooks..."
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-lg"
                />
              </div>
              {/* Quick suggestions */}
              <div>
                <p className="text-xs text-slate-500 mb-2">Popular topics:</p>
                <div className="flex flex-wrap gap-2">
                  {["Machine Learning", "World History", "Python", "Calculus", "Photography", "Economics"].map(t => (
                    <button key={t} onClick={() => setTopic(t)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-indigo-500/10 border border-white/10 hover:border-indigo-500/30 text-slate-300 hover:text-indigo-300 text-sm transition-all">
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Difficulty */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">Choose difficulty</h2>
                <p className="text-slate-400 text-sm">How much do you already know about <span className="text-indigo-300 font-medium">"{topic}"</span>?</p>
              </div>
              <div className="space-y-3">
                {difficulties.map(d => (
                  <button key={d.value} onClick={() => setDifficulty(d.value)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border bg-gradient-to-r transition-all ${d.color} ${
                      difficulty === d.value ? "ring-2 ring-offset-1 ring-offset-transparent ring-current scale-[1.01]" : "opacity-60 hover:opacity-100"
                    }`}>
                    <div className="flex-1 text-left">
                      <p className="font-semibold">{d.label}</p>
                      <p className="text-xs opacity-70 mt-0.5">{d.desc}</p>
                    </div>
                    {difficulty === d.value && <div className="w-2 h-2 rounded-full bg-current" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Type */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">Study style</h2>
                <p className="text-slate-400 text-sm">How would you like the content formatted?</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {types.map(t => {
                  const Icon = t.icon;
                  return (
                    <button key={t.value} onClick={() => setType(t.value)}
                      className={`flex flex-col items-start gap-3 p-5 rounded-2xl border bg-gradient-to-br transition-all ${t.color} ${
                        type === t.value ? "ring-2 ring-offset-1 ring-offset-transparent ring-current scale-[1.01]" : "opacity-60 hover:opacity-100"
                      }`}>
                      <Icon className="w-6 h-6" />
                      <div className="text-left">
                        <p className="font-semibold text-white text-sm">{t.label}</p>
                        <p className="text-xs opacity-70 mt-0.5">{t.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Generate */}
          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-white">Ready to generate!</h2>
                <p className="text-slate-400 text-sm">Your AI course will be created in about 10 seconds</p>
              </div>
              {/* Summary card */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Topic</span>
                  <span className="text-white font-medium">{topic}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Difficulty</span>
                  <span className="text-white font-medium capitalize">{difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Style</span>
                  <span className="text-white font-medium">{types.find(t => t.value === type)?.label}</span>
                </div>
              </div>
              {error && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                  {error}
                </div>
              )}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-indigo-500/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating your course…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Course
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        {step < 3 && (
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => step > 0 ? setStep(s => s - 1) : router.push("/dashboard")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              {step === 0 ? "Dashboard" : "Back"}
            </button>
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext[step]}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 3 && !loading && (
          <div className="flex justify-center mt-6">
            <button onClick={() => setStep(2)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CreateCoursePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <CreateCourseInner />
    </Suspense>
  );
}
