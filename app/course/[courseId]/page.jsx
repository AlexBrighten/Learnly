"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { db } from "@/configs/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  ArrowLeft, BookOpen, ChevronDown, ChevronUp,
  CheckCircle2, Loader2, AlertCircle, Plus
} from "lucide-react";

export default function CourseViewerPage() {
  const { courseId } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openChapter, setOpenChapter] = useState(0);
  const [openLesson, setOpenLesson] = useState(null);
  const [completed, setCompleted] = useState(new Set());

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Course not found.");
        } else {
          setCourse(data.course);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchCourse();
  }, [courseId]);

  const toggleLesson = (key) => setOpenLesson(prev => prev === key ? null : key);

  const markComplete = (key) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const totalLessons = course?.chapters?.reduce((acc, ch) => acc + ch.lessons.length, 0) || 0;
  const progress = totalLessons ? Math.round((completed.size / totalLessons) * 100) : 0;

  if (loading) return (
    <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
        <p className="text-slate-400">Loading your course…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <p className="text-white text-lg font-medium">{error}</p>
        <button onClick={() => router.push("/dashboard")} className="px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors">
          Back to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-200">
      {/* Fixed top bar */}
      <div className="sticky top-0 z-20 bg-[#0a0f1c]/90 backdrop-blur-xl border-b border-white/5 px-4 sm:px-8 py-4 flex items-center gap-4">
        <button onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </button>
        <div className="flex-1 min-w-0 ml-4">
          <h1 className="text-white font-bold text-lg truncate">
            {course.emoji} {course.title}
          </h1>
        </div>
        {/* Progress */}
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-xs text-slate-400">{progress}% complete</span>
          <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Course Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600/30 via-purple-600/20 to-transparent border border-indigo-500/20 p-8">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl" />
          <div className="text-6xl mb-4">{course.emoji || "📚"}</div>
          <h2 className="text-2xl font-bold text-white mb-2">{course.title}</h2>
          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">{course.description}</p>
          <div className="flex flex-wrap gap-3 mt-5">
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium capitalize">{course.difficulty}</span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium capitalize">{course.type?.replace("qa", "Q&A")}</span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> {totalLessons} lessons
            </span>
          </div>
        </motion.div>

        {/* Chapters */}
        <div className="space-y-3">
          {course.chapters?.map((chapter, ci) => (
            <motion.div key={ci}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.07 }}
              className="rounded-2xl border border-white/5 overflow-hidden bg-white/[0.03]">
              {/* Chapter Header */}
              <button onClick={() => setOpenChapter(prev => prev === ci ? null : ci)}
                className="w-full flex items-center gap-4 p-5 hover:bg-white/5 transition-colors text-left">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-sm font-bold shrink-0">
                  {ci + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{chapter.title}</p>
                  <p className="text-slate-400 text-xs mt-0.5 truncate">{chapter.summary}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>{chapter.lessons.length} lessons</span>
                  {openChapter === ci ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Lessons */}
              {openChapter === ci && (
                <div className="border-t border-white/5 divide-y divide-white/5">
                  {chapter.lessons.map((lesson, li) => {
                    const key = `${ci}-${li}`;
                    const isOpen = openLesson === key;
                    const isDone = completed.has(key);

                    return (
                      <div key={li} className="transition-all">
                        <button onClick={() => toggleLesson(key)}
                          className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors text-left">
                          <button onClick={e => { e.stopPropagation(); markComplete(key); }}
                            className={`shrink-0 transition-colors ${isDone ? "text-emerald-400" : "text-slate-600 hover:text-slate-400"}`}>

                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                          <span className={`flex-1 text-sm ${isDone ? "line-through text-slate-500" : "text-slate-200"}`}>
                            {lesson.title}
                          </span>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                        </button>

                        {isOpen && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-14 pb-6 space-y-4">
                            <p className="text-slate-300 text-sm leading-relaxed">{lesson.content}</p>
                            {lesson.keyPoints?.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Key Points</p>
                                <ul className="space-y-1.5">
                                  {lesson.keyPoints.map((kp, ki) => (
                                    <li key={ki} className="flex items-start gap-2 text-sm text-slate-300">
                                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                                      {kp}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            <button onClick={() => markComplete(key)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isDone
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20"
                                }`}>
                              <CheckCircle2 className="w-4 h-4" />
                              {isDone ? "Completed!" : "Mark as complete"}
                            </button>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 pb-8">
          <button onClick={() => router.push("/create")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-all">
            <Plus className="w-4 h-4" /> Create Another Course
          </button>
          <button onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
