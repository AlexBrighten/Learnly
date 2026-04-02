"use client";

import { useState, useEffect } from "react";
import { Home, Plus, Compass, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export default function MobileNav() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { icon: Home, label: "Home", href: "/dashboard" },
    { icon: Plus, label: "Create", href: "/dashboard/create" },
    { icon: Compass, label: "Explore", href: "/dashboard/explore" },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-2 py-2 backdrop-blur md:hidden dark:border-white/10 dark:bg-[#0a0f1c]/95"
    >
      <div className="mx-auto grid max-w-lg grid-cols-4 gap-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={cn(
                "flex flex-col items-center justify-center rounded-xl px-2 py-2 text-xs font-medium transition-colors",
                isActive
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
              )}
            >
              <item.icon className="mb-1 h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          aria-label="Toggle theme"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="flex flex-col items-center justify-center rounded-xl px-2 py-2 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
        >
          {!mounted ? (
            <Moon className="mb-1 h-4 w-4" />
          ) : resolvedTheme === "dark" ? (
            <Sun className="mb-1 h-4 w-4" />
          ) : (
            <Moon className="mb-1 h-4 w-4" />
          )}
          <span>Theme</span>
        </button>
      </div>
    </nav>
  );
}
