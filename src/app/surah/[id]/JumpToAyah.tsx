"use client";

import { useState } from "react";
import { Hash, ArrowRight } from "lucide-react";

interface JumpToAyahProps {
  totalAyahs: number;
}

export function JumpToAyah({ totalAyahs }: JumpToAyahProps) {
  const [ayahInput, setAyahInput] = useState("");
  const [error, setError] = useState(false);

  const handleJump = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const num = parseInt(ayahInput.trim(), 10);
    if (isNaN(num) || num < 1 || num > totalAyahs) {
      setError(true);
      setTimeout(() => setError(false), 2000);
      return;
    }

    setError(false);
    const element = document.getElementById(`ayah-${num}`);
    if (element) {
      window.history.replaceState(null, "", `#ayah-${num}`);
      element.scrollIntoView({ behavior: "smooth", block: "center" });

      element.classList.add(
        "ring-2",
        "ring-emerald-500",
        "ring-offset-4",
        "dark:ring-offset-zinc-950",
        "transition-all",
        "duration-500"
      );
      setTimeout(() => {
        element.classList.remove(
          "ring-2",
          "ring-emerald-500",
          "ring-offset-4",
          "dark:ring-offset-zinc-950"
        );
      }, 3500);
    }
  };

  return (
    <form
      onSubmit={handleJump}
      className="flex items-center gap-1.5 bg-white/80 dark:bg-zinc-900/80 p-1 pl-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs"
    >
      <span className="flex items-center gap-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300 whitespace-nowrap">
        <Hash className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span className="hidden sm:inline">Jump to Ayah</span>
        <span className="sm:hidden">Ayah</span>
      </span>

      <input
        type="number"
        min={1}
        max={totalAyahs}
        placeholder={`1-${totalAyahs}`}
        value={ayahInput}
        onChange={(e) => setAyahInput(e.target.value)}
        className={`w-14 sm:w-16 px-1.5 py-1 text-xs font-bold text-center rounded-lg border bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden transition-all ${
          error
            ? "border-rose-500 ring-1 ring-rose-500"
            : "border-zinc-200 dark:border-zinc-700 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
        }`}
      />

      <button
        type="submit"
        disabled={!ayahInput}
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white transition-all active:scale-95 shadow-xs shrink-0 cursor-pointer"
        title="Go to Ayah"
      >
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}
