"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, BrainCircuit, Users, Target } from "lucide-react";

export default function DashboardPage() {
    const stats = [
        { label: "Active Courses", value: "3", icon: BrainCircuit, color: "text-blue-400", bg: "bg-blue-400/10" },
        { label: "Learning Streak", value: "12 Days", icon: Target, color: "text-orange-400", bg: "bg-orange-400/10" },
        { label: "Study Group", value: "5 Members", icon: Users, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Welcome Section */}
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
                            <span>Welcome to the new Learnly</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                            Ready to expand your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200">knowledge?</span>
                        </h1>
                        <p className="text-indigo-100/80 text-lg leading-relaxed max-w-xl">
                            Your personalized learning journey is fully redesigned. Dive back into your courses or start something new today.
                        </p>
                    </div>
                    <button className="group shrink-0 relative px-6 py-3 rounded-xl bg-white text-indigo-900 font-semibold shadow-xl shadow-white/10 hover:shadow-white/20 transition-all hover:-translate-y-0.5">
                        <span className="flex items-center gap-2">
                            Start Learning
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
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

            {/* Placeholder for future sections */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="h-96 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-xl flex flex-col items-center justify-center border-dashed text-slate-500"
            >
                <BrainCircuit className="w-12 h-12 mb-4 opacity-50" />
                <h3 className="text-xl font-medium text-slate-300">Your Activity</h3>
                <p className="text-sm mt-2 max-w-sm text-center">New widgets and course activity streams will appear here as you continue learning.</p>
            </motion.div>
        </div>
    );
}
