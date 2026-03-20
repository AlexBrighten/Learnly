"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, ArrowRight, BrainCircuit, Users, Target, Plus, BookOpen } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

const stats = [
  { label: "Active Courses", value: "3", icon: BrainCircuit, color: "text-blue-400", bg: "bg-blue-400/10" },
  { label: "Learning Streak", value: "12 Days", icon: Target, color: "text-orange-400", bg: "bg-orange-400/10" },
  { label: "Study Group", value: "5 Members", icon: Users, color: "text-emerald-400", bg: "bg-emerald-400/10" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(" ")[0] || "there";

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
              <span>Welcome back, {firstName}!</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              Ready to expand your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200">
                knowledge?
              </span>
            </h1>
            <p className="text-indigo-100/80 text-lg leading-relaxed max-w-xl">
              Your personalized AI-powered learning journey awaits. Create a new course or continue where you left off.
            </p>
          </div>
          <Link
            href="/create"
            className="group shrink-0 relative px-6 py-3 rounded-xl bg-white text-indigo-900 font-semibold shadow-xl shadow-white/10 hover:shadow-white/20 transition-all hover:-translate-y-0.5 flex items-center gap-2"
          >
            Start Learning
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (idx + 1) }}
            className="p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-xl relative overflow-hidden group hover:bg-white/[0.07] transition-colors"
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                <div className="text-2xl font-bold text-white mt-1">{stat.value}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {/* Create New Course */}
        <Link href="/create"
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 p-8 hover:border-indigo-500/40 transition-all hover:-translate-y-0.5">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl group-hover:bg-indigo-600/20 transition-all" />
          <div className="relative z-10 space-y-3">
            <div className="p-3 w-fit rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="text-white font-semibold text-lg">Create New Course</h3>
            <p className="text-slate-400 text-sm">Generate an AI-powered course on any topic in seconds</p>
          </div>
          <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* My Learning */}
        <Link href="/dashboard/learning"
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 p-8 hover:border-emerald-500/40 transition-all hover:-translate-y-0.5">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-600/10 rounded-full blur-2xl group-hover:bg-emerald-600/20 transition-all" />
          <div className="relative z-10 space-y-3">
            <div className="p-3 w-fit rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-white font-semibold text-lg">My Learning</h3>
            <p className="text-slate-400 text-sm">Continue your in-progress courses and track your progress</p>
          </div>
          <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </div>
  );
}
