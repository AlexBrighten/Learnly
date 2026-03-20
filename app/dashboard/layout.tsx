import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#0a0f1c] text-slate-200 antialiased selection:bg-indigo-500/30">
            <div className="flex h-screen overflow-hidden">
                <Sidebar className="hidden lg:block w-72 flex-shrink-0 border-r border-white/5 bg-white/5 backdrop-blur-xl" />

                <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                    <Header className="h-20 flex-shrink-0 border-b border-white/5 bg-white/5 backdrop-blur-xl z-10" />

                    <main className="flex-1 overflow-auto relative">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0a0f1c] to-[#0a0f1c] pointer-events-none" />
                        <div className="p-8 lg:p-12 relative z-10 h-full w-full">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
