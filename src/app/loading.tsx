"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] py-12 text-center animate-fade-in-up">
      <div className="relative flex items-center justify-center mb-4">
        {/* Glowing backdrop circle */}
        <div className="absolute h-12 w-12 rounded-full bg-emerald-500/10 blur-md dark:bg-emerald-500/20" />
        {/* Spinner */}
        <Loader2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400 animate-spin relative z-10" />
      </div>
      <h3 className="font-bold text-zinc-900 dark:text-white text-base">
        Loading Surah...
      </h3>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
        Please wait while we fetch the verses and translations
      </p>
    </div>
  );
}
