"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search, BookOpen, Star, Clock, TrendingUp, ExternalLink,
  Loader2, X, ArrowRight, Globe, Lightbulb, Sparkles, Compass,
  ChevronRight, Brain, Zap, Target
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

function SearchResultCard({ result, onCreateCourse, index }: { result: any; onCreateCourse: (topic: string) => void; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3, ease: "easeOut" }}
      className="group relative flex flex-col sm:flex-row gap-5 p-5 sm:p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

      {result.thumbnail ? (
        <div className="shrink-0 relative w-full sm:w-28 h-40 sm:h-28 rounded-xl overflow-hidden border border-white/10 dark:border-white/5">
          <img
            src={result.thumbnail}
            alt={result.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:hidden" />
          <div className="absolute bottom-3 left-3 sm:hidden font-bold text-white text-lg drop-shadow-md">
            {result.title}
          </div>
        </div>
      ) : (
        <div className="shrink-0 w-full sm:w-28 h-32 sm:h-28 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/20 flex items-center justify-center">
          <BookOpen className="w-10 h-10 text-primary/50" />
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="min-w-0 flex-1 hidden sm:block">
            <h3 className="font-extrabold text-foreground text-lg truncate group-hover:text-primary transition-colors">
              {result.title}
            </h3>
            {result.description && (
              <div className="inline-flex items-center mt-1.5 px-2.5 py-0.5 rounded-full bg-muted border border-border">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{result.description}</p>
              </div>
            )}
          </div>
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="shrink-0 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted focus:ring-2 focus:ring-primary focus:outline-none transition-all"
            title="Read on Wikipedia"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>

        <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed flex-1">
          {result.extract || "No description available for this topic."}
        </p>

        <div className="flex items-center flex-wrap gap-3 mt-4 pt-3 border-t border-border/50">
          <button
            onClick={(e) => { e.stopPropagation(); onCreateCourse(result.topic); }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:outline-none dark:focus:ring-offset-background"
          >
            <Sparkles className="w-4 h-4" />
            Generate Course
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ExplorePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Animated placeholder text
  const placeholders = [
    "What do you want to learn today?",
    "Search 'Quantum Mechanics'...",
    "Explore 'Ancient Egyptian History'...",
    "Master 'Machine Learning'...",
    "Discover 'Classical Music Theory'..."
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const doSearch = useCallback(async (q: string) => {
    if (!q || q.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/explore-search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (query && !activeCategory) doSearch(query);
      if (!query) {
        setSearched(false);
        setResults([]);
      }
    }, 600);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch, activeCategory]);

  const handleCategory = (cat: typeof categories[number]) => {
    setActiveCategory(cat.name);
    setQuery(cat.name);
    doSearch(cat.query);
    setTimeout(() => document.getElementById("search-input")?.focus(), 100);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setSearched(false);
    setActiveCategory(null);
    searchInputRef.current?.focus();
  };

  const handleCreateCourse = (topic: string) => {
    router.push(`/create?topic=${encodeURIComponent(topic)}`);
  };

  const handleFeatured = (item: typeof featured[number]) => {
    setActiveCategory(null);
    setQuery(item.title);
    doSearch(item.query);
    setTimeout(() => document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      {/* Soft Background Blobs — reduced blur for better GPU perf */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-20">
        <div className="absolute top-[-10%] left-[-10%] w-[35%] h-[35%] rounded-full bg-primary/15 blur-[80px] mix-blend-multiply dark:mix-blend-screen animate-pulse-glow" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/15 blur-[80px] mix-blend-multiply dark:mix-blend-screen animate-pulse-glow" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 xl:px-12 space-y-10 pt-4">

        {/* Header Section — no scroll-linked transforms, always visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center space-y-4 max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border shadow-sm text-primary text-xs font-bold uppercase tracking-widest overflow-hidden relative group"
          >
            <div className="absolute inset-0 bg-primary/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <Sparkles className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10 text-foreground dark:text-muted-foreground group-hover:text-primary transition-colors">Powered by Wikipedia & AI Engine</span>
          </motion.div>

          <motion.h1
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.1]"
          >
            Explore Your <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-primary animate-shimmer bg-[length:200%_auto]">
               Curiosity
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
            className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto font-medium"
          >
            Search millions of topics and instantly transform them into personalized, interactive AI learning courses.
          </motion.p>
        </motion.div>

        {/* Search Bar — tighter vertical padding */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
          className="relative max-w-4xl mx-auto z-30"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-indigo-500 rounded-[2rem] blur opacity-20 transition-opacity duration-500" />
          <div className="relative flex items-center bg-card/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2rem] shadow-2xl overflow-hidden focus-within:ring-4 focus-within:ring-primary/20 transition-all duration-300">
            <div className="pl-6 pr-3 text-muted-foreground z-10">
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              ) : (
                <Search className="w-6 h-6" />
              )}
            </div>

            <div className="relative flex-1">
              {/* Animated Placeholder */}
              <AnimatePresence mode="wait">
                {!query && (
                  <motion.div
                    key={placeholderIndex}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -12, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-lg sm:text-xl text-muted-foreground/50 font-semibold z-0"
                  >
                    {placeholders[placeholderIndex]}
                  </motion.div>
                )}
              </AnimatePresence>
              <input
                id="search-input"
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setActiveCategory(null); }}
                onKeyDown={e => e.key === "Enter" && doSearch(query)}
                className="w-full py-5 text-lg sm:text-xl bg-transparent text-foreground placeholder:text-transparent focus:outline-none font-bold z-20 relative peer"
                placeholder=" "
              />
            </div>

            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  onClick={clearSearch}
                  className="pr-6 pl-3 z-20 group"
                >
                  <div className="p-2 rounded-full bg-muted group-hover:bg-destructive/10 group-hover:text-destructive text-muted-foreground transition-colors">
                    <X className="w-4 h-4" />
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Search Results */}
        <AnimatePresence mode="wait">
          {(searched || loading) && (
            <motion.div
              id="results-section"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-6 bg-card/50 backdrop-blur-xl border border-border/50 p-6 sm:p-8 rounded-2xl shadow-xl"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">
                    {loading ? (
                      <span className="animate-pulse">Searching the world&apos;s knowledge...</span>
                    ) : (
                      <>Found <span className="text-primary text-xl font-black">{results.length}</span> matches for &quot;{query}&quot;</>
                    )}
                  </h2>
                </div>
                {!loading && results.length > 0 && (
                  <button
                    onClick={() => handleCreateCourse(query)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-bold text-sm shadow-md shadow-primary/20 hover:-translate-y-0.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    Auto-Generate Course
                  </button>
                )}
              </div>

              {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex gap-4 p-5 rounded-2xl bg-card/60 border border-border animate-pulse overflow-hidden">
                      <div className="w-24 h-24 rounded-xl bg-muted/50 shrink-0" />
                      <div className="flex-1 space-y-3">
                        <div className="h-5 bg-muted/50 rounded-lg w-3/4" />
                        <div className="h-4 bg-muted/30 rounded-lg w-full" />
                        <div className="h-4 bg-muted/30 rounded-lg w-5/6" />
                        <div className="h-9 bg-muted/40 rounded-xl w-32 mt-3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : results.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  {results.map((r, i) => (
                    <SearchResultCard key={i} index={i} result={r} onCreateCourse={handleCreateCourse} />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="py-16 text-center bg-card/80 backdrop-blur-xl rounded-2xl border border-dashed border-border/50"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse-glow" />
                    <BookOpen className="w-10 h-10 text-muted-foreground relative z-10" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-2">No direct matches found</h3>
                  <p className="text-muted-foreground text-base mb-8 max-w-lg mx-auto">
                    We couldn&apos;t find a specific Wikipedia article for &quot;{query}&quot;, but our AI Engine can still build a comprehensive course for you.
                  </p>
                  <button onClick={() => handleCreateCourse(query)}
                    className="group flex items-center gap-3 mx-auto px-7 py-4 rounded-2xl bg-foreground text-background font-black text-base hover:shadow-2xl hover:shadow-foreground/20 hover:-translate-y-1 transition-all active:translate-y-0 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                    <Sparkles className="w-5 h-5 relative z-10" />
                    <span className="relative z-10 group-hover:text-white transition-colors duration-500">Force Generate Course</span>
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categories & Featured — shown when not searching */}
        <AnimatePresence>
          {!searched && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-16"
            >
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

                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                  {categories.map((cat, idx) => (
                    <motion.button
                      key={cat.name}
                      initial={{ opacity: 0, scale: 0.9, y: 12 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: 0.05 + idx * 0.03, duration: 0.3, ease: "easeOut" }}
                      onClick={() => handleCategory(cat)}
                      className={cn(
                        "group flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 hover:shadow-lg active:scale-95 aspect-square relative overflow-hidden cursor-pointer",
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
                className="relative overflow-hidden rounded-2xl bg-card border border-border p-8 sm:p-12 lg:p-16 flex flex-col items-center justify-center text-center shadow-xl group"
              >
                {/* CTA Backgrounds */}
                <div className="absolute inset-0 bg-[#0a0f1c] dark:bg-black/40" />
                <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-primary/5 to-transparent skew-y-12 animate-shimmer" style={{ animationDuration: '4s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl aspect-square bg-gradient-to-tr from-primary/25 to-purple-600/25 rounded-full blur-[80px] group-hover:blur-[100px] transition-all duration-700 group-hover:scale-110" />

                <div className="relative z-10 flex flex-col items-center space-y-6 max-w-3xl">
                  <div className="p-3 rounded-2xl bg-white/10 dark:bg-black/50 backdrop-blur-xl border border-white/20 shadow-xl">
                    <Brain className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white">
                    Master anything your <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">heart desires.</span>
                  </h3>
                  <p className="text-white/80 text-lg md:text-xl font-medium max-w-2xl leading-snug">
                    Our semantic AI engine constructs personalized learning paths for any niche topic in existence.
                  </p>

                  <Link href="/create"
                    className="mt-2 flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl bg-white text-black font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] group/btn relative overflow-hidden">
                    <span className="relative z-10 flex items-center gap-3">
                      Start Learning Now <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
