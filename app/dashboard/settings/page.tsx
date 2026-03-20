"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { User, Bell, Shield, Palette, Globe, ChevronRight, Moon, Sun } from "lucide-react";

const sections = [
  {
    id: "profile",
    icon: User,
    title: "Profile",
    description: "Update your name and profile photo",
  },
  {
    id: "notifications",
    icon: Bell,
    title: "Notifications",
    description: "Choose what you want to be notified about",
  },
  {
    id: "privacy",
    icon: Shield,
    title: "Privacy & Security",
    description: "Manage your data and security settings",
  },
  {
    id: "appearance",
    icon: Palette,
    title: "Appearance",
    description: "Customize the look and feel of your dashboard",
  },
  {
    id: "language",
    icon: Globe,
    title: "Language & Region",
    description: "Set your preferred language and timezone",
  },
];

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    streaks: true,
    newCourses: true,
  });

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-slate-400 mt-2">Manage your account preferences</p>
      </motion.div>

      {/* Profile Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
        <h2 className="text-white font-semibold text-lg">Profile</h2>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
            SP
          </div>
          <div className="flex-1">
            <p className="text-white font-medium">Student Profile</p>
            <p className="text-slate-400 text-sm">student@example.com</p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 text-sm hover:bg-indigo-500/20 transition-colors">
            Edit Photo
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">Display Name</label>
            <input
              type="text"
              defaultValue="Student Profile"
              className="mt-1.5 w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">Email</label>
            <input
              type="email"
              defaultValue="student@example.com"
              className="mt-1.5 w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <button className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-500 transition-colors">
            Save Changes
          </button>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
        <h2 className="text-white font-semibold text-lg">Notifications</h2>
        <div className="space-y-3">
          {Object.entries(notifications).map(([key, value]) => {
            const labels: Record<string, string> = {
              email: "Email notifications",
              push: "Push notifications",
              streaks: "Daily streak reminders",
              newCourses: "New course alerts",
            };
            return (
              <div key={key} className="flex items-center justify-between py-2">
                <span className="text-slate-300 text-sm">{labels[key]}</span>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${value ? "bg-indigo-600" : "bg-white/10"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${value ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
        <h2 className="text-white font-semibold text-lg">Appearance</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
            <span className="text-slate-300 text-sm">{darkMode ? "Dark Mode" : "Light Mode"}</span>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-11 h-6 rounded-full transition-colors ${darkMode ? "bg-indigo-600" : "bg-white/10"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${darkMode ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>
      </motion.div>

      {/* Other settings as list */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="divide-y divide-white/5 rounded-2xl bg-white/5 border border-white/5 overflow-hidden">
        {[sections[2], sections[4]].map((section) => (
          <button key={section.id}
            className="w-full flex items-center gap-4 p-5 hover:bg-white/5 transition-colors text-left group">
            <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-indigo-500/10 transition-colors">
              <section.icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm">{section.title}</p>
              <p className="text-slate-400 text-xs mt-0.5">{section.description}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          </button>
        ))}
      </motion.div>

      {/* Danger Zone */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20">
        <h2 className="text-red-400 font-semibold mb-3">Danger Zone</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-sm font-medium">Delete Account</p>
            <p className="text-slate-400 text-xs mt-0.5">Permanently delete your account and all data</p>
          </div>
          <button className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-colors">
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}
