import { BookOpen, Trophy, Compass, Settings, LogOut, Home } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils"; // Assuming they have a standard cn utility, common in Next.js + Tailwind setups

export default function Sidebar({ className }: { className?: string }) {
    const navItems = [
        { icon: Home, label: "Home", href: "/dashboard", active: true },
        { icon: Compass, label: "Explore", href: "/dashboard/explore", active: false },
        { icon: BookOpen, label: "My Learning", href: "/dashboard/learning", active: false },
        { icon: Trophy, label: "Leaderboard", href: "/dashboard/leaderboard", active: false },
    ];

    return (
        <div className={cn("flex flex-col h-full bg-[#0a0f1c]/80 text-slate-300", className)}>
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <span className="text-white font-bold text-xl">L</span>
                    </div>
                    <span className="font-semibold text-xl tracking-tight text-white">Learnly</span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navItems.map((item, idx) => (
                    <Link
                        key={idx}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                            item.active
                                ? "bg-indigo-500/10 text-indigo-400 font-medium"
                                : "hover:bg-white/5 hover:text-white"
                        )}
                    >
                        <item.icon className={cn(
                            "w-5 h-5 transition-transform duration-300",
                            item.active ? "text-indigo-400" : "text-slate-400 group-hover:text-white group-hover:scale-110"
                        )} />
                        <span>{item.label}</span>
                        {item.active && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                        )}
                    </Link>
                ))}
            </nav>

            <div className="p-4 mt-auto border-t border-white/5">
                <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-white/5 hover:text-white"
                >
                    <Settings className="w-5 h-5 text-slate-400" />
                    <span>Settings</span>
                </Link>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-red-500/10 hover:text-red-400 text-slate-300 mt-1">
                    <LogOut className="w-5 h-5 text-red-400/80" />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
}
