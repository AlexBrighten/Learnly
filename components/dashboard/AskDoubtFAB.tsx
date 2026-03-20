"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircleQuestion, Send, X, Loader2, Sparkles } from "lucide-react";
import MarkdownRenderer from "@/components/dashboard/MarkdownRenderer";

interface Message {
    role: "user" | "ai";
    content: string;
}

interface AskDoubtFABProps {
    courseTopic: string;
    chapterTitle: string;
    chapterNotes?: string;
}

export default function AskDoubtFAB({ courseTopic, chapterTitle, chapterNotes }: AskDoubtFABProps) {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.focus();
        }
    }, [open]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleAsk = async () => {
        const question = input.trim();
        if (!question || loading) return;

        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: question }]);
        setLoading(true);

        try {
            const res = await fetch("/api/ask-doubt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question,
                    chapterTitle,
                    chapterNotes: chapterNotes || "",
                    courseTopic,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to get answer");

            setMessages((prev) => [...prev, { role: "ai", content: data.answer }]);
        } catch (err: any) {
            setMessages((prev) => [
                ...prev,
                { role: "ai", content: `Sorry, I couldn't get an answer right now. Error: ${err.message}` },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* FAB Button */}
            <motion.button
                onClick={() => setOpen(!open)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all ${
                    open
                        ? "bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-slate-300 shadow-lg"
                        : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-indigo-500/40"
                }`}
                title="Ask your doubt"
            >
                {open ? <X className="w-6 h-6" /> : <MessageCircleQuestion className="w-6 h-6" />}
            </motion.button>

            {/* Chat Panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 z-50 w-[min(420px,calc(100vw-3rem))] rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0f1425] overflow-hidden flex flex-col"
                        style={{ maxHeight: "min(520px, calc(100vh - 10rem))" }}
                    >
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-gray-100 dark:border-white/5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Ask Your Doubt</h3>
                                    <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-1">{chapterTitle}</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-[200px]">
                            {messages.length === 0 && (
                                <div className="text-center py-8 space-y-2">
                                    <MessageCircleQuestion className="w-10 h-10 text-gray-300 dark:text-slate-600 mx-auto" />
                                    <p className="text-sm text-gray-400 dark:text-slate-500">
                                        Ask anything about this chapter!
                                    </p>
                                    <p className="text-xs text-gray-300 dark:text-slate-600">
                                        I'll explain it in simple words 🧠
                                    </p>
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                                            msg.role === "user"
                                                ? "bg-indigo-500 text-white rounded-br-md"
                                                : "bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-slate-200 rounded-bl-md"
                                        }`}
                                    >
                                        {msg.role === "user" ? (
                                            <p className="text-sm">{msg.content}</p>
                                        ) : (
                                            <div className="text-sm [&>*:last-child]:mb-0">
                                                <MarkdownRenderer content={msg.content} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 dark:bg-white/5 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                                        <span className="text-sm text-gray-500 dark:text-slate-400">Thinking...</span>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleAsk();
                                }}
                                className="flex items-center gap-2"
                            >
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your doubt..."
                                    disabled={loading}
                                    className="flex-1 px-4 py-2.5 text-sm rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-slate-500 disabled:opacity-50 transition-all"
                                />
                                <motion.button
                                    type="submit"
                                    disabled={!input.trim() || loading}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 transition-opacity"
                                >
                                    <Send className="w-4 h-4" />
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
