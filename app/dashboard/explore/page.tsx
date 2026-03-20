"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Star, TrendingUp,
  ArrowRight, Sparkles,
  ChevronRight, Brain, Target
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const categories = [
  { name: "Science", emoji: "🔬", query: "science fundamentals", color: "from-blue-500/20 to-cyan-500/20", border: "hover:border-blue-400/40" },
  { name: "Mathematics", emoji: "📐", query: "mathematics", color: "from-emerald-500/20 to-teal-500/20", border: "hover:border-emerald-400/40" },
  { name: "History", emoji: "🏛️", query: "world history", color: "from-amber-500/20 to-orange-500/20", border: "hover:border-amber-400/40" },
  { name: "Technology", emoji: "💻", query: "computer science technology", color: "from-indigo-500/20 to-violet-500/20", border: "hover:border-indigo-400/40" },
  { name: "Languages", emoji: "🌍", query: "linguistics language learning", color: "from-pink-500/20 to-rose-500/20", border: "hover:border-pink-400/40" },
  { name: "Arts", emoji: "🎨", query: "art history creativity", color: "from-fuchsia-500/20 to-purple-500/20", border: "hover:border-fuchsia-400/40" },
  { name: "Economics", emoji: "📈", query: "economics finance", color: "from-green-500/20 to-emerald-500/20", border: "hover:border-green-400/40" },
  { name: "Philosophy", emoji: "🧠", query: "philosophy ethics", color: "from-slate-500/20 to-zinc-500/20", border: "hover:border-slate-400/40" },
  { name: "Biology", emoji: "🧬", query: "biology life sciences", color: "from-lime-500/20 to-green-500/20", border: "hover:border-lime-400/40" },
  { name: "Psychology", emoji: "🧩", query: "psychology human behavior", color: "from-sky-500/20 to-blue-500/20", border: "hover:border-sky-400/40" },
  { name: "Physics", emoji: "⚛️", query: "physics quantum mechanics", color: "from-violet-500/20 to-purple-500/20", border: "hover:border-violet-400/40" },
  { name: "Music", emoji: "🎵", query: "music theory composition", color: "from-red-500/20 to-orange-500/20", border: "hover:border-red-400/40" },
];

const featured = [
  { title: "Artificial Intelligence", subject: "Technology", emoji: "🤖", query: "Artificial Intelligence", students: "124k" },
  { title: "Quantum Computing", subject: "Physics", emoji: "⚛️", query: "Quantum computing", students: "89k" },
  { title: "Ancient Rome", subject: "History", emoji: "🏛️", query: "Ancient Rome", students: "210k" },
  { title: "Neuroscience", subject: "Biology", emoji: "🧠", query: "Neuroscience", students: "156k" },
  { title: "Macroeconomics", subject: "Economics", emoji: "📈", query: "Macroeconomics", students: "92k" },
  { title: "Machine Learning", subject: "Technology", emoji: "🚀", query: "Machine learning", students: "340k" },
];

export default function ExplorePage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleCategory = (cat: typeof categories[number]) => {
    setActiveCategory(cat.name);
    router.push(`/dashboard/create?topic=${encodeURIComponent(cat.query)}`);
  };

  const handleFeatured = (item: typeof featured[number]) => {
    router.push(`/dashboard/create?topic=${encodeURIComponent(item.query)}`);
  };

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      {/* Soft Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-20">
        <div className="absolute top-[-10%] left-[-10%] w-[35%] h-[35%] rounded-full bg-primary/15 blur-[80px] mix-blend-multiply dark:mix-blend-screen animate-pulse-glow" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/15 blur-[80px] mix-blend-multiply dark:mix-blend-screen animate-pulse-glow" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 xl:px-12 space-y-12 sm:space-y-16 pt-2 sm:pt-4">
        {/* Browse Disciplines */}
        <div className="space-y-6">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 text-primary border border-white/10">
                  <Target className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-foreground">Browse Disciplines</h2>
              </div>
              <p className="text-muted-foreground text-sm font-medium pl-12 hidden sm:block">Select a category to deep dive into fundamental concepts.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((cat, idx) => (
              <motion.button
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.05 + idx * 0.03, duration: 0.3, ease: "easeOut" }}
                onClick={() => handleCategory(cat)}
                className={cn(
                  "group flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 hover:shadow-lg active:scale-95 min-h-[110px] sm:aspect-square relative overflow-hidden cursor-pointer",
                  cat.border,
                  activeCategory === cat.name
                    ? "bg-card border-primary shadow-primary/20"
                    : "bg-card/60 border-transparent hover:bg-card"
                )}
              >
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0",
                  cat.color
                )} />
                <span className="text-3xl sm:text-4xl mb-2 relative z-10 group-hover:scale-110 transition-transform duration-200">{cat.emoji}</span>
                <span className="font-bold text-xs text-center relative z-10 text-foreground/70 group-hover:text-foreground transition-colors">{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Trending Knowledge */}
        <div className="space-y-6">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 text-indigo-500 border border-white/10">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-foreground">Trending Knowledge</h2>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {featured.map((item, idx) => (
              <motion.button
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.06, duration: 0.35, ease: "easeOut" }}
                onClick={() => handleFeatured(item)}
                className="group text-left h-full p-6 rounded-2xl bg-card/70 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-200 relative overflow-hidden shadow-sm hover:shadow-lg hover:shadow-primary/5 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
              >
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-full blur-2xl group-hover:from-primary/15 group-hover:to-purple-500/15 group-hover:scale-125 transition-all duration-500 ease-out" />

                <div className="flex items-start justify-between mb-5 relative z-10">
                  <div className="text-4xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 ease-out">{item.emoji}</div>
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-muted border border-border text-[11px] font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                      <Star className="w-3 h-3 fill-current text-yellow-500" />
                      Top Rated
                    </div>
                    <div className="text-[11px] font-bold text-muted-foreground bg-background px-2.5 py-0.5 rounded-full border border-border">
                      {item.students} learners
                    </div>
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors duration-200 leading-tight mb-1">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm font-medium">
                    {item.subject}
                  </p>
                </div>

                <div className="absolute bottom-5 right-5 p-3 rounded-xl bg-card border border-border/50 text-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-200 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 hidden sm:block">
                  <ChevronRight className="w-5 h-5 stroke-[3]" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
          className="relative overflow-hidden rounded-2xl bg-card border border-border p-6 sm:p-12 lg:p-16 flex flex-col items-center justify-center text-center shadow-xl group"
        >
          {/* CTA Backgrounds */}
          <div className="absolute inset-0 bg-[#0a0f1c] dark:bg-black/40" />
          <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-primary/5 to-transparent skew-y-12 animate-shimmer" style={{ animationDuration: '4s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl aspect-square bg-gradient-to-tr from-primary/25 to-purple-600/25 rounded-full blur-[80px] group-hover:blur-[100px] transition-all duration-700 group-hover:scale-110" />

          <div className="relative z-10 flex flex-col items-center space-y-6 max-w-3xl">
            <div className="p-3 rounded-2xl bg-white/10 dark:bg-black/50 backdrop-blur-xl border border-white/20 shadow-xl">
              <Brain className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white">
              Master anything your <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">heart desires.</span>
            </h3>
            <p className="text-white/80 text-lg md:text-xl font-medium max-w-2xl leading-snug">
              Our semantic AI engine constructs personalized learning paths for any niche topic in existence.
            </p>

            <Link href="/dashboard/create"
              className="mt-2 flex items-center justify-center gap-3 px-6 sm:px-10 py-3.5 sm:py-5 rounded-2xl bg-white text-black font-black text-base sm:text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] group/btn relative overflow-hidden">
              <span className="relative z-10 flex items-center gap-3">
                Start Learning Now <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
