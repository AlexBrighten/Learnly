"use client";

import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function MobileHeader() {
  const { user, signOut } = useAuth();

  const displayName = user?.displayName || "Learner";
  const initials = displayName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/sign-in";
  };

  return (
    <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-[#0a0f1c]/95">
      <Link href="/dashboard" className="flex items-center gap-2.5" aria-label="Go to dashboard">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
          <span className="text-white font-bold text-lg">L</span>
        </div>
        <span className="font-semibold text-lg tracking-tight text-gray-900 dark:text-white">Learnly</span>
      </Link>

      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Open profile menu"
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-white/10 transition-colors"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={displayName}
                className="h-9 w-9 rounded-full border border-indigo-400/40 object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
                <div className="h-full w-full rounded-full bg-white dark:bg-[#0a0f1c] flex items-center justify-center">
                  <span className="text-xs font-bold text-indigo-600 dark:text-white">{initials}</span>
                </div>
              </div>
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent align="end" className="w-64 p-3 rounded-xl border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-gray-50 dark:bg-white/5">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
              <User className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{displayName}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="mt-2 w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </PopoverContent>
      </Popover>
    </header>
  );
}
