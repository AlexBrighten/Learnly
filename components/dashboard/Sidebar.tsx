"use client";

import { Compass, LogOut, Home, Plus, Zap, Sun, Moon, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/context/AuthContext";
import { useThemeToggle } from "@/components/theme/useToggle";
import { useState } from "react";

export default function Sidebar({ className }) {
    const pathname = usePathname();
    const { signOut } = useAuth();
    const { isDark, toggle, hydrated } = useThemeToggle();
    const [collapsed, setCollapsed] = useState(false);

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
        <div className={cn("flex flex-col h-full bg-white text-gray-600 dark:bg-[#0a0f1c]/80 dark:text-slate-300 transition-all duration-300 relative shrink-0", collapsed ? "w-20" : "w-72", className)}>
            <div className={cn("flex items-center justify-between transition-all", collapsed ? "p-4" : "p-6")}>
                <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <span className="text-white font-bold text-xl">L</span>
                    </div>
                    {!collapsed && <span className="font-semibold text-xl tracking-tight text-gray-900 dark:text-white whitespace-nowrap">Learnly</span>}
                </Link>
            </div>

            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-8 bg-white border border-gray-200 dark:bg-[#0a0f1c] dark:border-white/10 rounded-full p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors shadow-sm hidden lg:flex z-50"
            >
                {collapsed ? <ChevronRight className="w-4 h-4"/> : <ChevronLeft className="w-4 h-4" />}
            </button>

            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
                {navItems.map((item, idx) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={idx}
                            href={item.href}
                            title={collapsed ? item.label : undefined}
                            className={cn(
                                "flex items-center rounded-xl transition-all duration-300 group",
                                collapsed ? "justify-center p-3" : "gap-3 px-4 py-3",
                                isActive
                                    ? "bg-indigo-50 text-indigo-600 font-medium dark:bg-indigo-500/10 dark:text-indigo-400"
                                    : "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/5 dark:hover:text-white"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5 shrink-0 transition-transform duration-300",
                                isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 group-hover:text-gray-900 group-hover:scale-110 dark:text-slate-400 dark:group-hover:text-white"
                            )} />
                            {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                            {!collapsed && isActive && (
                                <div className="ml-auto shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className={cn("mt-auto border-t border-gray-200 dark:border-white/5 flex flex-col gap-1 transition-all", collapsed ? "p-3" : "p-4")}>
                {hydrated && (
                    <button
                        onClick={toggle}
                        title={collapsed ? "Toggle Theme" : undefined}
                        className={cn(
                            "flex items-center rounded-xl transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/5 dark:hover:text-white text-gray-500 dark:text-slate-300",
                            collapsed ? "justify-center p-3" : "w-full gap-3 px-4 py-3"
                        )}
                    >
                        {isDark ? <Sun className="w-5 h-5 shrink-0 text-gray-400 dark:text-slate-400" /> : <Moon className="w-5 h-5 shrink-0 text-gray-400 dark:text-slate-400" />}
                        {!collapsed && <span className="whitespace-nowrap">Toggle Theme</span>}
                    </button>
                )}
                <button
                    onClick={handleSignOut}
                    title={collapsed ? "Sign Out" : undefined}
                    className={cn(
                         "flex items-center rounded-xl transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 text-gray-500 dark:text-slate-300",
                         collapsed ? "justify-center p-3" : "w-full gap-3 px-4 py-3"
                    )}
                >
                    <LogOut className="w-5 h-5 shrink-0 text-red-400/80" />
                    {!collapsed && <span className="whitespace-nowrap">Sign Out</span>}
                </button>
            </div>
        </div>
    );
}
