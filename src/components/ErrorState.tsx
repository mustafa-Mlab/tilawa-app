"use client";

import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorStateProps {
  message?: string;
  showHomeButton?: boolean;
  onRetry?: () => void;
}

export function ErrorState({ message, showHomeButton = true, onRetry }: ErrorStateProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in-up w-full">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/80 rounded-3xl p-8 shadow-xl space-y-6 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-12 -left-12 h-36 w-36 rounded-full bg-rose-500/5 dark:bg-rose-500/10 blur-2xl pointer-events-none" />
        
        {/* Warning Icon Badge */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
          <AlertCircle className="h-7 w-7" />
        </div>

        {/* Text descriptions */}
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white">
            Connection Interrupted
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            We couldn&apos;t retrieve the Quranic data. This usually happens due to a network disconnect or an API timeout.
          </p>
        </div>

        {/* Technical details */}
        {message && (
          <div className="bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-100 dark:border-zinc-800/50 rounded-xl p-3 text-left">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
              Error Details
            </span>
            <p className="text-xs font-mono text-rose-600 dark:text-rose-400 break-words font-semibold">
              {message}
            </p>
          </div>
        )}

        {/* Buttons Panel */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleRetry}
            className="w-full inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md shadow-emerald-600/10 hover:scale-102 active:scale-98 transition-all cursor-pointer"
          >
            <RefreshCcw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
          
          {showHomeButton && (
            <Link
              href="/"
              className="w-full inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-zinc-200/80 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-sm transition-all hover:scale-102 active:scale-98 shadow-xs"
            >
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
