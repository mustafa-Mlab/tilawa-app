"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SurahInfo } from "@/lib/quran";
import { fuzzySearchSurahs } from "@/lib/surahSearch";
import { searchAyahsFullText, AyahSearchResult } from "@/lib/globalSearch";
import { SurahCard } from "./SurahCard";
import { Search, BookOpen, Clock, ChevronRight, Sparkles, History, X, ArrowRight, Loader2, FileText } from "lucide-react";
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

  // Full-Text Ayah Search state
  const [ayahResults, setAyahResults] = useState<AyahSearchResult[]>([]);
  const [isSearchingAyahs, setIsSearchingAyahs] = useState(false);

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

  // Debounced Full-Text Ayah search (e.g. "azan", "women", "girl", "meye", "fasting", "roza")
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q || q.length < 2 || /^\d+$/.test(q)) {
      setAyahResults([]);
      setIsSearchingAyahs(false);
      return;
    }

    setIsSearchingAyahs(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchAyahsFullText(q);
        setAyahResults(results);
      } catch (err) {
        console.error("Ayah text search error:", err);
      } finally {
        setIsSearchingAyahs(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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

  // Fuzzy / phonetic & Ayah number search (e.g. "25:2", "al fukan 2", "furqan:2")
  const { surahs: filteredSurahs, directAyahMatch } = fuzzySearchSurahs(surahs, searchQuery, filterType);

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
              href={`/surah/${lastRead.surahId}#ayah-${lastRead.ayahNumberInSurah}`}
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
              placeholder="Search Surah, topic (e.g. azan, women), or verse (25:2)..."
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
                setTimeout(() => commitToHistory(searchQuery), 150);
              }}
              className="w-full pl-11 pr-10 py-3 rounded-2xl border border-zinc-200 bg-white/80 dark:border-zinc-800 dark:bg-zinc-900/40 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
            />
            {/* Loading / Clear indicator */}
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {isSearchingAyahs && (
                <Loader2 className="h-4 w-4 text-emerald-500 animate-spin" />
              )}
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); setShowHistory(true); }}
                  className="h-5 w-5 flex items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Search History Dropdown */}
            {showHistory && hasHistory && !searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl z-50 overflow-hidden">
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

        {/* Direct Ayah Match Card (e.g. "25:2" or "al fukan 2") */}
        {directAyahMatch && (
          <div className="relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-900/15 p-5 shadow-lg dark:border-emerald-500/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black text-lg shadow-md shadow-emerald-500/30">
                  {directAyahMatch.surah.number}:{directAyahMatch.ayahNumber}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                      <Sparkles className="h-3 w-3" />
                      Direct Verse Match
                    </span>
                    <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      Verse {directAyahMatch.ayahNumber} of {directAyahMatch.surah.numberOfAyahs}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-zinc-900 dark:text-white text-lg mt-1 flex items-center gap-2">
                    <span>Surah {directAyahMatch.surah.englishName}</span>
                    <span className="text-sm font-normal text-emerald-600 dark:text-emerald-400 font-arabic">
                      ({directAyahMatch.surah.name})
                    </span>
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {directAyahMatch.surah.englishNameTranslation}
                  </p>
                </div>
              </div>

              <Link
                href={`/surah/${directAyahMatch.surah.number}#ayah-${directAyahMatch.ayahNumber}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shrink-0"
              >
                <span>Jump to Ayah {directAyahMatch.ayahNumber}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Full-Text Ayah Search Results Section (e.g. "azan", "women", "fasting", "roza") */}
        {ayahResults.length > 0 && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <FileText className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
                <span>Matching Verses ({ayahResults.length})</span>
              </h3>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                Mentioning &quot;{searchQuery}&quot;
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {ayahResults.map((ayah) => (
                <div
                  key={ayah.globalAyahNumber}
                  className="group relative flex flex-col p-4 rounded-2xl border border-zinc-200/80 bg-white/90 dark:border-zinc-800/80 dark:bg-zinc-900/40 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all shadow-xs"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800/60 pb-2.5 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 px-2 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 font-bold text-xs">
                        {ayah.surahNumber}:{ayah.numberInSurah}
                      </span>
                      <span className="font-bold text-zinc-900 dark:text-white text-sm">
                        Surah {ayah.surahEnglishName}
                      </span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 hidden sm:inline">
                        ({ayah.surahEnglishTranslation})
                      </span>
                    </div>

                    <Link
                      href={`/surah/${ayah.surahNumber}#ayah-${ayah.numberInSurah}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                    >
                      <span>Read Verse</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  {/* Verse Text Snippets */}
                  <div className="space-y-1.5 pt-1">
                    {ayah.englishText && (
                      <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mr-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200/50 dark:border-emerald-800/40">
                          English
                        </span>
                        &quot;{ayah.englishText}&quot;
                      </p>
                    )}
                    {ayah.banglaText && (
                      <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                        <span className="inline-block text-[10px] font-bold tracking-wider text-teal-600 dark:text-teal-400 mr-1.5 bg-teal-50 dark:bg-teal-950/40 px-1.5 py-0.5 rounded border border-teal-200/50 dark:border-teal-800/40">
                          বাংলা
                        </span>
                        &quot;{ayah.banglaText}&quot;
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section Header for Surah Cards Grid */}
        {searchQuery && (
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
            <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
              Surah Matches ({filteredSurahs.length})
            </h3>
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
          !isSearchingAyahs && ayahResults.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
              <BookOpen className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4 stroke-1 animate-pulse" />
              <h3 className="font-bold text-zinc-800 dark:text-zinc-200 text-lg">
                No Results Found
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs">
                No Surah or Verse matched &quot;{searchQuery}&quot;. Try searching by topic (e.g. &quot;azan&quot;, &quot;women&quot;, &quot;fasting&quot;) or verse number (e.g. &quot;25:2&quot;).
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Global search supports English, Bangla, and topic keywords</span>
              </div>
            </div>
          )
        )}
      </section>
    </div>
  );
}
