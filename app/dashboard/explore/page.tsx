"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search, BookOpen, Star, Clock, TrendingUp, ExternalLink,
  Loader2, X, ArrowRight, Globe, Lightbulb
} from "lucide-react";
import { useRouter } from "next/navigation";

const categories = [
  { name: "Science", emoji: "🔬", query: "science fundamentals" },
  { name: "Mathematics", emoji: "📐", query: "mathematics" },
  { name: "History", emoji: "🏛️", query: "world history" },
  { name: "Technology", emoji: "💻", query: "computer science technology" },
  { name: "Languages", emoji: "🌍", query: "linguistics language learning" },
  { name: "Arts", emoji: "🎨", query: "art history creativity" },
  { name: "Economics", emoji: "📈", query: "economics finance" },
  { name: "Philosophy", emoji: "🧠", query: "philosophy ethics" },
  { name: "Biology", emoji: "🧬", query: "biology life sciences" },
  { name: "Psychology", emoji: "🧩", query: "psychology human behavior" },
  { name: "Physics", emoji: "⚛️", query: "physics quantum mechanics" },
  { name: "Music", emoji: "🎵", query: "music theory composition" },
];

const featured = [
  { title: "Artificial Intelligence", subject: "Technology", emoji: "🤖", query: "Artificial Intelligence" },
  { title: "Calculus", subject: "Mathematics", emoji: "📐", query: "Calculus" },
  { title: "World War II", subject: "History", emoji: "🏛️", query: "World War II" },
  { title: "Python Programming", subject: "Technology", emoji: "🐍", query: "Python programming language" },
  { title: "Climate Change", subject: "Science", emoji: "🌍", query: "Climate change" },
  { title: "Quantum Physics", subject: "Physics", emoji: "⚛️", query: "Quantum mechanics" },
];

function SearchResultCard({ result, onCreateCourse }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-all group"
    >
      {result.thumbnail && (
        <img
          src={result.thumbnail}
          alt={result.title}
          className="w-16 h-16 rounded-xl object-cover shrink-0 bg-white/5"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold text-white truncate">{result.title}</p>
            {result.description && (
              <p className="text-xs text-indigo-400 mt-0.5">{result.description}</p>
            )}
          </div>
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
            title="Open Wikipedia"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        <p className="text-sm text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">{result.extract}</p>
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => onCreateCourse(result.topic)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium hover:bg-indigo-500/20 transition-colors"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            Generate Course
          </button>
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-xs font-medium hover:text-white hover:bg-white/10 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            Read on Wikipedia
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function ExplorePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef(null);

  const doSearch = useCallback(async (q) => {
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

  // Debounce search input
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!activeCategory) doSearch(query);
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [query, doSearch, activeCategory]);

  const handleCategory = (cat) => {
    setActiveCategory(cat.name);
    setQuery(cat.name);
    doSearch(cat.query);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setSearched(false);
    setActiveCategory(null);
  };

  const handleCreateCourse = (topic) => {
    // Redirect to /create with topic pre-filled via URL param
    router.push(`/create?topic=${encodeURIComponent(topic)}`);
  };

  const handleFeatured = (item) => {
    setActiveCategory(null);
    setQuery(item.title);
    doSearch(item.query);
    // Scroll to results
    setTimeout(() => document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-white tracking-tight">Explore Topics</h1>
        <p className="text-slate-400 mt-2">Search any topic, explore categories, or generate an AI course instantly</p>
      </motion.div>

      {/* Search Bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="relative">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${loading ? "text-indigo-400 animate-pulse" : "text-slate-500"}`} />
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setActiveCategory(null); }}
          onKeyDown={e => e.key === "Enter" && doSearch(query)}
          placeholder="Search any topic — Python, Quantum Physics, Renaissance Art…"
          className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-base"
        />
        {query && (
          <button onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </motion.div>

      {/* Search Results */}
      <AnimatePresence mode="wait">
        {(searched || loading) && (
          <div id="results-section" className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                {loading ? "Searching Wikipedia…" : `${results.length} results for "${query}"`}
              </h2>
              {!loading && results.length > 0 && (
                <button onClick={() => handleCreateCourse(query)}
                  className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Generate full course on "{query}"
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-3">
                {results.map((r, i) => (
                  <SearchResultCard key={i} result={r} onCreateCourse={handleCreateCourse} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-slate-400">No results found for "{query}"</p>
                <button onClick={() => handleCreateCourse(query)}
                  className="mt-4 flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm hover:bg-indigo-500/20 transition-colors">
                  <Lightbulb className="w-4 h-4" />
                  Still, generate an AI course on "{query}"
                </button>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Categories */}
      {!searched && (
        <>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-xl font-semibold text-white mb-4">Browse by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {categories.map((cat, idx) => (
                <button key={idx} onClick={() => handleCategory(cat)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    activeCategory === cat.name
                      ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                      : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 text-slate-300"
                  }`}>
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="font-medium text-sm">{cat.name}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Featured Topics */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-xl font-semibold text-white mb-4">Trending Topics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map((item, idx) => (
                <button key={idx} onClick={() => handleFeatured(item)}
                  className="group p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all text-left relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-indigo-600/5 rounded-full blur-2xl group-hover:bg-indigo-600/15 transition-all" />
                  <div className="text-3xl mb-3">{item.emoji}</div>
                  <p className="font-semibold text-white group-hover:text-indigo-300 transition-colors">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.subject}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-slate-500 group-hover:text-indigo-400 transition-colors flex items-center gap-1">
                      Search topic <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600/20 to-purple-600/10 border border-indigo-500/20 p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h3 className="text-white font-bold text-xl">Can't find what you're looking for?</h3>
              <p className="text-slate-400 text-sm mt-1">Generate a fully custom AI course on any topic in seconds</p>
            </div>
            <Link href="/create"
              className="relative z-10 shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-all hover:-translate-y-0.5">
              Create a Course <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </>
      )}
    </div>
  );
}
