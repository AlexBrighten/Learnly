"use client";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useThemeToggle } from "@/components/theme/useToggle";

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/20 text-gray-300 hover:text-white transition-all opacity-0 group-hover:opacity-100"
            title="Copy code"
        >
            {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
            ) : (
                <Copy className="w-4 h-4" />
            )}
        </button>
    );
}

export default function MarkdownRenderer({ content }: { content: string }) {
    const { isDark } = useThemeToggle();

    if (!content) {
        return <p className="text-gray-500 dark:text-slate-400 italic">No content available.</p>;
    }

    return (
        <ReactMarkdown
            components={{
                h1: ({ children }) => (
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 first:mt-0">
                        {children}
                    </h1>
                ),
                h2: ({ children }) => (
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-7 mb-3 first:mt-0">
                        {children}
                    </h2>
                ),
                h3: ({ children }) => (
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-2">
                        {children}
                    </h3>
                ),
                p: ({ children }) => (
                    <p className="text-gray-700 dark:text-slate-300 leading-7 mb-4">
                        {children}
                    </p>
                ),
                strong: ({ children }) => (
                    <strong className="font-bold text-gray-900 dark:text-white">{children}</strong>
                ),
                em: ({ children }) => (
                    <em className="italic text-gray-600 dark:text-slate-400">{children}</em>
                ),
                ul: ({ children }) => (
                    <ul className="mb-4 ml-6 list-disc space-y-1.5 text-gray-700 dark:text-slate-300">
                        {children}
                    </ul>
                ),
                ol: ({ children }) => (
                    <ol className="mb-4 ml-6 list-decimal space-y-1.5 text-gray-700 dark:text-slate-300">
                        {children}
                    </ol>
                ),
                li: ({ children }) => (
                    <li className="leading-7">{children}</li>
                ),
                blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-indigo-400 dark:border-indigo-500/40 bg-indigo-50/50 dark:bg-indigo-500/5 pl-4 pr-3 py-2 rounded-r-lg italic text-gray-600 dark:text-slate-400 mb-4">
                        {children}
                    </blockquote>
                ),
                code: ({ className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || "");
                    const codeString = String(children).replace(/\n$/, "");

                    if (match) {
                        return (
                            <div className="relative group mb-4 rounded-xl overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-900 border-b border-gray-700">
                                    <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                                        {match[1]}
                                    </span>
                                    <CopyButton text={codeString} />
                                </div>
                                <SyntaxHighlighter
                                    style={isDark ? oneDark : oneLight}
                                    language={match[1]}
                                    PreTag="div"
                                    customStyle={{
                                        margin: 0,
                                        borderRadius: 0,
                                        fontSize: "0.875rem",
                                        padding: "1rem 1.25rem",
                                    }}
                                >
                                    {codeString}
                                </SyntaxHighlighter>
                            </div>
                        );
                    }

                    // Inline code
                    return (
                        <code className="rounded-md bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 text-sm font-mono text-indigo-700 dark:text-indigo-300" {...props}>
                            {children}
                        </code>
                    );
                },
                table: ({ children }) => (
                    <div className="overflow-x-auto mb-4 rounded-xl border border-gray-200 dark:border-white/10">
                        <table className="w-full border-collapse text-sm">{children}</table>
                    </div>
                ),
                th: ({ children }) => (
                    <th className="bg-gray-50 dark:bg-white/5 px-4 py-2.5 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10">
                        {children}
                    </th>
                ),
                td: ({ children }) => (
                    <td className="px-4 py-2.5 text-gray-700 dark:text-slate-300 border-b border-gray-100 dark:border-white/5">
                        {children}
                    </td>
                ),
                hr: () => (
                    <hr className="my-6 border-gray-200 dark:border-white/10" />
                ),
                a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-500 transition-colors">
                        {children}
                    </a>
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
}
