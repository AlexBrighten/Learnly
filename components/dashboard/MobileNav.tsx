"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, Plus, Compass, LogOut, Sun, Moon, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/context/AuthContext";
import { useThemeToggle } from "@/components/theme/useToggle";

export default function MobileNav() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const { user, signOut } = useAuth();
    const { isDark, toggle, hydrated } = useThemeToggle();

    const navItems = [
        { icon: Home, label: "Home", href: "/dashboard" },
        { icon: Plus, label: "Create Course", href: "/dashboard/create" },
        { icon: Compass, label: "Explore", href: "/dashboard/explore" },
    ];

    const handleSignOut = async () => {
        await signOut();
        window.location.href = "/sign-in";
    };

    return (
        <>
            {/* Top Bar */}
            <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-[#0a0f1c]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5">
                <Link href="/dashboard" className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <span className="text-white font-bold text-lg">L</span>
                    </div>
                    <span className="font-semibold text-lg tracking-tight text-gray-900 dark:text-white">Learnly</span>
                </Link>
                <div className="flex items-center gap-2">
                    {user && (
                        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-200 dark:border-indigo-500/30 shrink-0">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">{user.displayName?.charAt(0)?.toUpperCase() || "U"}</span>
                                </div>
                            )}
                        </div>
                    )}
                    <button
                        onClick={() => setOpen(true)}
                        className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-white/5 transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Slide-in Drawer */}
            <div
                className={cn(
                    "fixed top-0 right-0 z-50 h-full w-72 bg-white dark:bg-[#0a0f1c] border-l border-gray-200 dark:border-white/5 shadow-2xl transform transition-transform duration-300 ease-out lg:hidden flex flex-col",
                    open ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Drawer Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5">
                    <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <span className="text-white font-bold text-lg">L</span>
                        </div>
                        <span className="font-semibold text-lg tracking-tight text-gray-900 dark:text-white">Learnly</span>
                    </Link>
                    <button
                        onClick={() => setOpen(false)}
                        className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-white/5 transition-colors"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Profile Section */}
                {user && (
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-indigo-200 dark:border-indigo-500/30 shrink-0 shadow-md">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.displayName || "Learner"}</p>
                                <p className="text-xs text-gray-400 dark:text-slate-500 truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Drawer Nav Items */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navItems.map((item, idx) => {
                        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={idx}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                    isActive
                                        ? "bg-indigo-50 text-indigo-600 font-medium dark:bg-indigo-500/10 dark:text-indigo-400"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                                )}
                            >
                                <item.icon className={cn(
                                    "w-5 h-5 shrink-0",
                                    isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-slate-400"
                                )} />
                                <span>{item.label}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Drawer Footer */}
                <div className="p-4 mt-auto border-t border-gray-100 dark:border-white/5 flex flex-col gap-1">
                    {hydrated && (
                        <button
                            onClick={toggle}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 dark:text-slate-300 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/5 dark:hover:text-white transition-colors"
                        >
                            {isDark ? <Sun className="w-5 h-5 text-gray-400 dark:text-slate-400" /> : <Moon className="w-5 h-5 text-gray-400 dark:text-slate-400" />}
                            <span>Toggle Theme</span>
                        </button>
                    )}
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"
                    >
                        <LogOut className="w-5 h-5 text-red-400/80" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </>
    );
}
