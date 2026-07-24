"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SurahInfo } from "@/lib/quran";
import { fuzzySearchSurahs } from "@/lib/surahSearch";
import { SurahCard } from "./SurahCard";
import { Search, BookOpen, Clock, ChevronRight, Sparkles, History, X } from "lucide-react";
import { useQuran } from "@/context/QuranContext";
import Link from "next/link";

const HISTORY_KEY = "tilawa_search_history";
const MAX_HISTORY = 8;

function loadHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveHistory(history: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

interface SurahListProps {
  surahs: SurahInfo[];
}

export function SurahList({ surahs }: SurahListProps) {
  const { lastRead } = useQuran();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"All" | "Meccan" | "Medinan">("All");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    setSearchHistory(loadHistory());
  }, []);

  // Close history dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowHistory(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Commit a search query to history when user stops typing (on blur or Enter)
  const commitToHistory = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return;
    setSearchHistory((prev) => {
      const deduped = [trimmed, ...prev.filter((h) => h.toLowerCase() !== trimmed.toLowerCase())];
      const next = deduped.slice(0, MAX_HISTORY);
      saveHistory(next);
      return next;
    });
  }, []);

  const removeFromHistory = (item: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchHistory((prev) => {
      const next = prev.filter((h) => h !== item);
      saveHistory(next);
      return next;
    });
  };

  const clearAllHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchHistory([]);
    saveHistory([]);
  };

  const applyHistoryItem = (item: string) => {
    setSearchQuery(item);
    setShowHistory(false);
  };

  // Fuzzy / phonetic search — handles transliteration variants like "al fukan" → Al-Furqan
  const filteredSurahs = fuzzySearchSurahs(surahs, searchQuery, filterType);

  const hasHistory = searchHistory.length > 0;

  return (
    <div className="w-full space-y-8">
      {/* Continue Reading Banner */}
      {lastRead && (
        <section
          aria-label="Continue Reading"
          className="relative overflow-hidden rounded-2xl border border-emerald-200/50 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent p-5 dark:border-emerald-950/40 dark:from-emerald-950/20 dark:via-zinc-900/10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                <Clock className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 tracking-wide uppercase">
                  Last Read Position
                </span>
                <h4 className="font-bold text-zinc-900 dark:text-white text-base mt-0.5">
                  Surah {lastRead.surahName} • Ayah {lastRead.ayahNumberInSurah}
                </h4>
              </div>
            </div>
            <Link
              href={`/surah/${lastRead.surahId}`}
              className="inline-flex items-center justify-center gap-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Resume Reading
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          {/* Subtle background decoration */}
          <div className="absolute right-0 bottom-0 top-0 w-32 bg-radial from-emerald-500/10 to-transparent blur-2xl pointer-events-none" />
        </section>
      )}

      {/* Control Panel: Search & Filters & Surah List */}
      <section aria-label="Quran Surahs" className="space-y-8">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Input + History */}
          <div className="relative flex-1 max-w-md" ref={searchRef}>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 pointer-events-none z-10" />
            <input
              id="surah-search-input"
              type="text"
              placeholder="Search Surah by name, translation, or number..."
              value={searchQuery}
              autoComplete="off"
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowHistory(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  commitToHistory(searchQuery);
                  setShowHistory(false);
                  (e.target as HTMLInputElement).blur();
                }
                if (e.key === "Escape") {
                  setShowHistory(false);
                  setSearchQuery("");
                }
              }}
              onBlur={() => {
                // Small delay so clicks on history items register first
                setTimeout(() => commitToHistory(searchQuery), 150);
              }}
              className="w-full pl-11 pr-10 py-3 rounded-2xl border border-zinc-200 bg-white/80 dark:border-zinc-800 dark:bg-zinc-900/40 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
            />
            {/* Clear button */}
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setShowHistory(true); }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </button>
            )}

            {/* Search History Dropdown */}
            {showHistory && hasHistory && !searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl z-50 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    <History className="h-3.5 w-3.5" />
                    Recent Searches
                  </span>
                  <button
                    onClick={clearAllHistory}
                    className="text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 font-medium transition-colors"
                  >
                    Clear all
                  </button>
                </div>
                {/* History Items */}
                <ul role="listbox" aria-label="Search history">
                  {searchHistory.map((item) => (
                    <li
                      key={item}
                      role="option"
                      aria-selected={false}
                      onClick={() => applyHistoryItem(item)}
                      className="group flex items-center justify-between gap-3 px-4 py-2.5 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <History className="h-3.5 w-3.5 shrink-0 text-zinc-400 dark:text-zinc-500" />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300 truncate">{item}</span>
                      </div>
                      <button
                        onClick={(e) => removeFromHistory(item, e)}
                        className="shrink-0 h-5 w-5 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 transition-all"
                        aria-label={`Remove "${item}" from history`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Revelation Type Filter Tabs */}
          <div className="flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800/80 self-start md:self-auto border border-zinc-200/10 dark:border-zinc-700/10">
            {(["All", "Meccan", "Medinan"] as const).map((type) => {
              const isActive = filterType === type;
              return (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-white text-zinc-950 shadow-xs dark:bg-zinc-700 dark:text-white"
                      : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent search chips — shown while typing to allow quick re-use */}
        {searchQuery && hasHistory && (
          <div className="flex flex-wrap gap-2 -mt-4">
            {searchHistory
              .filter((h) => h.toLowerCase() !== searchQuery.toLowerCase())
              .slice(0, 5)
              .map((item) => (
                <button
                  key={item}
                  onClick={() => applyHistoryItem(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400 border border-zinc-200 dark:border-zinc-700 transition-all duration-150"
                >
                  <History className="h-3 w-3" />
                  {item}
                </button>
              ))}
          </div>
        )}

        {/* Grid of Surah Cards */}
        {filteredSurahs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSurahs.map((surah) => (
              <SurahCard key={surah.number} surah={surah} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
            <BookOpen className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4 stroke-1 animate-pulse" />
            <h3 className="font-bold text-zinc-800 dark:text-zinc-200 text-lg">
              No Surahs Found
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs">
              No Surah matched &quot;{searchQuery}&quot;. Try a different spelling — e.g. &quot;furqan&quot;, &quot;baqarah&quot;, or search by number.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Smart search understands phonetic variations</span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
