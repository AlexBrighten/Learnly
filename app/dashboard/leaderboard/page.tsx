"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Star, TrendingUp, TrendingDown, Minus } from "lucide-react";

const leaders = [
  { rank: 1, name: "Alex Chen", points: 12840, streak: 45, change: "up", avatar: "AC" },
  { rank: 2, name: "Priya Sharma", points: 11200, streak: 32, change: "up", avatar: "PS" },
  { rank: 3, name: "James Wright", points: 10750, streak: 28, change: "same", avatar: "JW" },
  { rank: 4, name: "Fatima Al-Sayed", points: 9630, streak: 19, change: "down", avatar: "FA" },
  { rank: 5, name: "Luca Bianchi", points: 8910, streak: 14, change: "up", avatar: "LB" },
  { rank: 6, name: "Sofia Müller", points: 8400, streak: 22, change: "up", avatar: "SM" },
  { rank: 7, name: "You", points: 7520, streak: 12, change: "up", avatar: "ME", isUser: true },
  { rank: 8, name: "Ananya Singh", points: 7100, streak: 9, change: "down", avatar: "AS" },
  { rank: 9, name: "Tom Baker", points: 6850, streak: 7, change: "same", avatar: "TB" },
  { rank: 10, name: "Mei Lin", points: 6200, streak: 11, change: "down", avatar: "ML" },
];

const medalColors = ["from-yellow-400 to-amber-500", "from-slate-300 to-slate-400", "from-amber-600 to-orange-700"];

function ChangeIcon({ change }: { change: string }) {
  if (change === "up") return <TrendingUp className="w-4 h-4 text-emerald-400" />;
  if (change === "down") return <TrendingDown className="w-4 h-4 text-red-400" />;
  return <Minus className="w-4 h-4 text-slate-500" />;
}

export default function LeaderboardPage() {
  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-white tracking-tight">Leaderboard</h1>
        <p className="text-slate-400 mt-2">Top learners this week ranked by XP points</p>
      </motion.div>

      {/* Top 3 Podium */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex items-end justify-center gap-4 pt-4">
        {[top3[1], top3[0], top3[2]].map((leader, podiumIdx) => {
          const actualRank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3;
          const heights = ["h-24", "h-32", "h-20"];
          return (
            <div key={leader.rank} className="flex flex-col items-center gap-3 flex-1">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${medalColors[actualRank - 1]} flex items-center justify-center text-white font-bold text-lg shadow-xl`}>
                {leader.avatar}
              </div>
              <p className="text-white font-medium text-sm text-center truncate w-full px-1">{leader.name}</p>
              <p className="text-xs text-slate-400">{leader.points.toLocaleString()} XP</p>
              <div className={`w-full ${heights[podiumIdx]} rounded-t-2xl bg-gradient-to-t ${medalColors[actualRank - 1]} opacity-20 flex items-center justify-center`}>
                {actualRank === 1 && <Trophy className="w-6 h-6 text-yellow-400 opacity-100" />}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Rest of list */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="space-y-2">
        {rest.map((leader, idx) => (
          <motion.div
            key={leader.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + idx * 0.05 }}
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
              leader.isUser
                ? "bg-indigo-500/10 border-indigo-500/30"
                : "bg-white/5 border-white/5 hover:bg-white/[0.07]"
            }`}
          >
            <span className="w-8 text-center text-slate-400 text-sm font-medium">#{leader.rank}</span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white text-sm font-bold">
              {leader.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-medium truncate ${leader.isUser ? "text-indigo-300" : "text-white"}`}>
                {leader.name} {leader.isUser && <span className="text-xs font-normal text-indigo-400">(you)</span>}
              </p>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {leader.streak} day streak
              </p>
            </div>
            <div className="text-right flex items-center gap-3">
              <ChangeIcon change={leader.change} />
              <div>
                <p className="text-white font-semibold text-sm">{leader.points.toLocaleString()}</p>
                <p className="text-xs text-slate-400">XP</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
