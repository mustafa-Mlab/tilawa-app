"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Heart } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();
  const isRouteActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white/80 dark:bg-zinc-950/80 border-t border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-md px-6 py-2 flex justify-around items-center shadow-lg safe-bottom">
      <Link
        href="/"
        className={`flex flex-col items-center gap-1 py-1.5 px-4 rounded-xl transition-all duration-150 ${
          isRouteActive("/")
            ? "text-emerald-600 dark:text-emerald-450 font-black scale-105"
            : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 font-bold"
        }`}
      >
        <BookOpen className="h-5 w-5" />
        <span className="text-[10px] tracking-wider uppercase font-extrabold">Quran</span>
      </Link>
      <Link
        href="/dua-remembrance"
        className={`flex flex-col items-center gap-1 py-1.5 px-4 rounded-xl transition-all duration-150 ${
          isRouteActive("/dua-remembrance")
            ? "text-emerald-600 dark:text-emerald-450 font-black scale-105"
            : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 font-bold"
        }`}
      >
        <Heart className="h-5 w-5" />
        <span className="text-[10px] tracking-wider uppercase font-extrabold">Dua & Remembrance</span>
      </Link>
    </nav>
  );
}
