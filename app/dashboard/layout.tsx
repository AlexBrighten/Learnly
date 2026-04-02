import Sidebar from "@/components/dashboard/Sidebar";
import MobileNav from "@/components/dashboard/MobileNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50 text-foreground antialiased selection:bg-indigo-500/30 dark:bg-[#0a0f1c] dark:text-slate-200">
            <div className="flex h-screen overflow-hidden">
                <Sidebar className="hidden lg:flex flex-shrink-0 border-r border-gray-200 bg-white dark:border-white/5 dark:bg-white/5 dark:backdrop-blur-xl" />

                <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                    <MobileNav />
                    <main className="flex-1 overflow-auto relative">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-gray-50 to-gray-50 dark:from-indigo-900/20 dark:via-[#0a0f1c] dark:to-[#0a0f1c] pointer-events-none" />
                        <div className="p-5 sm:p-8 lg:p-12 relative z-10 h-full w-full">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
