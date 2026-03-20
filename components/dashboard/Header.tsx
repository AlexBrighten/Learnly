"use client";

import { Bell, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/context/AuthContext";
import { ThemeToggle } from "@/components/theme/toggle";

export default function Header({ className }) {
    const { user } = useAuth();

    const displayName = user?.displayName || "Student";
    const initials = displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <header className={cn("flex items-center justify-between px-8 bg-white/80 dark:bg-[#0a0f1c]/80", className)}>
            <div className="flex-1 max-w-xl hidden md:block">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 dark:text-slate-500 dark:group-focus-within:text-indigo-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all sm:text-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:placeholder-slate-500 dark:focus:bg-white/10"
                        placeholder="Search for courses, subjects..."
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 ml-auto">
                <ThemeToggle className="text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white" />

                <button className="relative p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-[#0a0f1c]" />
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-white/10 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors dark:text-white dark:group-hover:text-indigo-300">
                            {displayName}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-slate-400">{user?.email || "learner"}</p>
                    </div>
                    {user?.photoURL ? (
                        <img
                            src={user.photoURL}
                            alt={displayName}
                            className="h-10 w-10 rounded-full border-2 border-indigo-500/50 object-cover"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
                            <div className="h-full w-full rounded-full bg-white dark:bg-[#0a0f1c] flex items-center justify-center">
                                <span className="text-sm font-bold text-indigo-600 dark:text-white">{initials}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
