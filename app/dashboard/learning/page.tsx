"use client";

import { motion } from "framer-motion";
import { BookOpen, Play, CheckCircle2, Clock } from "lucide-react";

const inProgress = [
  { title: "Introduction to Machine Learning", progress: 65, totalLessons: 24, completedLessons: 16, subject: "Technology", nextLesson: "Neural Networks Basics" },
  { title: "Advanced Calculus", progress: 40, totalLessons: 18, completedLessons: 7, subject: "Mathematics", nextLesson: "Integration by Parts" },
  { title: "Modern World History", progress: 82, totalLessons: 20, completedLessons: 16, subject: "History", nextLesson: "Cold War Era" },
];

const completed = [
  { title: "Python Fundamentals", subject: "Technology", completedDate: "Mar 10, 2026" },
  { title: "Basic Statistics", subject: "Mathematics", completedDate: "Feb 28, 2026" },
];

export default function LearningPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-white tracking-tight">My Learning</h1>
        <p className="text-slate-400 mt-2">Track your progress and pick up where you left off</p>
      </motion.div>

      {/* Stats Row */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4">
        {[
          { label: "In Progress", value: inProgress.length, color: "text-indigo-400" },
          { label: "Completed", value: completed.length, color: "text-emerald-400" },
          { label: "Hours Learned", value: "34h", color: "text-orange-400" },
        ].map((stat, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/5 text-center">
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* In Progress */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-xl font-semibold text-white mb-4">Continue Learning</h2>
        <div className="space-y-4">
          {inProgress.map((course, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-all group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-indigo-400 font-medium">{course.subject}</span>
                  <h3 className="text-white font-semibold mt-0.5 truncate">{course.title}</h3>
                  <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Next: {course.nextLesson}
                  </p>
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 1, delay: 0.3 + idx * 0.1 }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>
                <button className="shrink-0 p-3 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 group-hover:scale-105 transition-all">
                  <Play className="w-5 h-5 fill-current" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Completed */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="text-xl font-semibold text-white mb-4">Completed Courses</h2>
        <div className="space-y-3">
          {completed.map((course, idx) => (
            <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{course.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{course.subject} · Completed {course.completedDate}</p>
              </div>
              <BookOpen className="w-5 h-5 text-slate-500" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
