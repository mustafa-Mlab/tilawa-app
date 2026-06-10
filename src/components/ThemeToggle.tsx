"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-10 w-10 rounded-xl bg-zinc-100/50 dark:bg-zinc-800/50 animate-pulse border border-zinc-200/20 dark:border-zinc-700/20" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 border border-zinc-200/80 shadow-xs dark:bg-zinc-900/80 dark:border-zinc-800 dark:hover:bg-zinc-800 hover:bg-zinc-50 hover:scale-105 active:scale-95 transition-all duration-200 text-zinc-700 dark:text-zinc-300"
      aria-label="Toggle Theme"
      id="theme-toggle-btn"
    >
      {isDark ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-indigo-600" />}
    </button>
  );
}
