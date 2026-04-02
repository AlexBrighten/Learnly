"use client";

import { useState } from "react";
import { Compass, LogOut, Home, Plus, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/context/AuthContext";
import { ThemeToggle } from "@/components/theme/toggle";

export default function Sidebar({ className }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, signOut } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");

    const navItems = [
        { icon: Home, label: "Home", href: "/dashboard" },
        { icon: Plus, label: "Create Course", href: "/dashboard/create" },
        { icon: Compass, label: "Explore", href: "/dashboard/explore" },
    ];

    const displayName = user?.displayName || "Student";
    const initials = displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            router.push(`/dashboard/explore?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        window.location.href = "/sign-in";
    };

    return (
        <div className={cn("flex flex-col h-full bg-white text-gray-600 dark:bg-[#0a0f1c]/80 dark:text-slate-300", className)}>
            <div className="p-6 pb-2">
                <Link href="/dashboard" className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <span className="text-white font-bold text-xl">L</span>
                    </div>
                    <span className="font-semibold text-xl tracking-tight text-gray-900 dark:text-white">Learnly</span>
                </Link>

                <div className="relative group mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:focus:bg-white/10"
                        placeholder="Search topics..."
                    />
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navItems.map((item, idx) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={idx}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                                isActive
                                    ? "bg-indigo-50 text-indigo-600 font-medium dark:bg-indigo-500/10 dark:text-indigo-400"
                                    : "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/5 dark:hover:text-white"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5 transition-transform duration-300",
                                isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 group-hover:text-gray-900 group-hover:scale-110 dark:text-slate-400 dark:group-hover:text-white"
                            )} />
                            <span>{item.label}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto border-t border-gray-200 dark:border-white/5 space-y-2">
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 text-gray-500 dark:text-slate-300 mt-1"
                >
                    <LogOut className="w-5 h-5 text-red-500/80" />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
}
