import { Bell, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header({ className }: { className?: string }) {
    return (
        <header className={cn("flex items-center justify-between px-8 bg-[#0a0f1c]/80", className)}>
            <div className="flex-1 max-w-xl hidden md:block">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-xl leading-5 bg-white/5 text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white/10 transition-all sm:text-sm"
                        placeholder="Search for courses, subjects..."
                    />
                </div>
            </div>

            <div className="flex items-center gap-6 ml-auto">
                <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-[#0a0f1c]" />
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-white/10 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">Student Profile</p>
                        <p className="text-xs text-slate-400">Level 12 Scholar</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
                        <div className="h-full w-full rounded-full bg-[#0a0f1c] flex items-center justify-center border-2 border-transparent">
                            <span className="text-sm font-bold text-white">SP</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
