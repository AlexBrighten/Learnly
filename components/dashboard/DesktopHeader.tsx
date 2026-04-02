"use client";

import { useAuth } from "@/app/context/AuthContext";
import { ThemeToggle } from "@/components/theme/toggle";

export default function DesktopHeader() {
    const { user } = useAuth();
    
    const displayName = user?.displayName || "Student";
    const initials = displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <header className="hidden md:flex items-center justify-end px-8 py-3 bg-white/80 dark:bg-[#0a0f1c]/80 border-b border-gray-200 dark:border-white/5 backdrop-blur z-20 sticky top-0">
            <div className="flex items-center gap-4">
                <ThemeToggle className="text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white" />
                
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-white/10 group cursor-pointer">
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors dark:text-white dark:group-hover:text-indigo-300">
                            {displayName}
                        </p>
                    </div>
                    {user?.photoURL ? (
                        <img
                            src={user.photoURL}
                            alt={displayName}
                            className="h-10 w-10 rounded-full border border-gray-200 dark:border-white/10 object-cover shrink-0"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px] shrink-0">
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
