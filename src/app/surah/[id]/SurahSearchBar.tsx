"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, Globe, BookOpen, ArrowRight, Loader2 } from "lucide-react";
import { AyahDetail } from "@/lib/quran";
import { searchAyahsFullText, AyahSearchResult } from "@/lib/globalSearch";
import Link from "next/link";

interface SurahSearchBarProps {
  surahId: number;
  surahName: string;
  surahAyahs: AyahDetail[];
}

type SearchMode = "surah" | "global";

interface LocalAyahMatch {
  ayah: AyahDetail;
  matchType: "arabic" | "english" | "bangla";
  snippet: string;
}

export function SurahSearchBar({ surahId, surahName, surahAyahs }: SurahSearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<SearchMode>("surah");
  const [query, setQuery] = useState("");
  const [localResults, setLocalResults] = useState<LocalAyahMatch[]>([]);
  const [globalResults, setGlobalResults] = useState<AyahSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // ── Local (within-surah) search ──────────────────────────────────────────
  const searchLocal = useCallback((q: string) => {
    if (!q.trim()) {
      setLocalResults([]);
      return;
    }
    const lq = q.toLowerCase();
    const matches: LocalAyahMatch[] = [];

    for (const ayah of surahAyahs) {
      const englishMatch = ayah.englishText?.toLowerCase().includes(lq);
      const banglaMatch = ayah.banglaText?.toLowerCase().includes(lq);
      const arabicMatch = ayah.arabicText?.includes(q);

      if (englishMatch) {
        const idx = ayah.englishText.toLowerCase().indexOf(lq);
        const start = Math.max(0, idx - 30);
        const snippet = (start > 0 ? "…" : "") + ayah.englishText.slice(start, idx + q.length + 50) + "…";
        matches.push({ ayah, matchType: "english", snippet });
      } else if (banglaMatch) {
        const idx = ayah.banglaText!.toLowerCase().indexOf(lq);
        const start = Math.max(0, idx - 15);
        const snippet = (start > 0 ? "…" : "") + ayah.banglaText!.slice(start, idx + q.length + 40) + "…";
        matches.push({ ayah, matchType: "bangla", snippet });
      } else if (arabicMatch) {
        matches.push({ ayah, matchType: "arabic", snippet: ayah.arabicText.slice(0, 60) + "…" });
      }

      if (matches.length >= 20) break;
    }
    setLocalResults(matches);
  }, [surahAyahs]);

  // ── Global search ────────────────────────────────────────────────────────
  const searchGlobal = useCallback(async (q: string) => {
    if (!q.trim() || q.length < 2) {
      setGlobalResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const results = await searchAyahsFullText(q);
      setGlobalResults(results.slice(0, 15));
    } catch {
      setGlobalResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setLocalResults([]);
      setGlobalResults([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      if (mode === "surah") {
        searchLocal(query);
      } else {
        searchGlobal(query);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, mode, searchLocal, searchGlobal]);

  const handleResultClick = (ayahNum: number) => {
    const el = document.getElementById(`ayah-${ayahNum}`);
    if (el) {
      setIsOpen(false);
      setQuery("");
      window.history.replaceState(null, "", `#ayah-${ayahNum}`);
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-emerald-500", "ring-offset-4", "dark:ring-offset-zinc-950", "transition-all", "duration-500");
      setTimeout(() => el.classList.remove("ring-2", "ring-emerald-500", "ring-offset-4", "dark:ring-offset-zinc-950"), 3500);
    }
  };

  const hasResults = mode === "surah" ? localResults.length > 0 : globalResults.length > 0;

  return (
    <div className="relative" ref={panelRef}>
      {/* Search Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 h-9 px-3 rounded-xl border text-xs font-semibold transition-all shadow-xs ${
          isOpen
            ? "bg-emerald-600 border-emerald-600 text-white"
            : "bg-white/90 border-zinc-200/80 text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900/90 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
        }`}
        title="Search"
      >
        <Search className="h-3.5 w-3.5 shrink-0" />
        <span className="hidden sm:inline">Search</span>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-[min(420px,calc(100vw-2rem))] rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">

          {/* Mode Toggle + Input Row */}
          <div className="flex items-center gap-2 p-3 border-b border-zinc-100 dark:border-zinc-800">
            {/* Mode Pills */}
            <div className="flex items-center p-0.5 gap-0.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 shrink-0">
              <button
                onClick={() => { setMode("surah"); setQuery(""); }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  mode === "surah"
                    ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-xs"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                }`}
              >
                <BookOpen className="h-3 w-3" />
                <span>This Surah</span>
              </button>
              <button
                onClick={() => { setMode("global"); setQuery(""); }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  mode === "global"
                    ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-xs"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                }`}
              >
                <Globe className="h-3 w-3" />
                <span>Quran</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={mode === "surah" ? `Search in ${surahName}…` : "Search entire Quran…"}
                className="w-full pl-8 pr-8 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="max-h-[min(60vh,380px)] overflow-y-auto">
            {/* Loading */}
            {isLoading && (
              <div className="flex items-center justify-center gap-2 py-8 text-zinc-400 text-xs">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Searching…</span>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && query && !hasResults && (
              <div className="py-10 text-center text-zinc-400 text-xs">
                <Search className="h-6 w-6 mx-auto mb-2 opacity-30" />
                <p>No results found for <strong className="text-zinc-500">"{query}"</strong></p>
              </div>
            )}

            {/* Prompt */}
            {!query && (
              <div className="py-8 text-center text-zinc-400 text-xs space-y-1">
                <Search className="h-5 w-5 mx-auto mb-2 opacity-30" />
                {mode === "surah" ? (
                  <p>Type to search within <strong className="text-emerald-600 dark:text-emerald-400">{surahName}</strong></p>
                ) : (
                  <p>Search topics, concepts, or keywords across the entire Quran</p>
                )}
              </div>
            )}

            {/* ── Within-Surah Results ── */}
            {mode === "surah" && localResults.length > 0 && (
              <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {localResults.map(({ ayah, matchType, snippet }) => (
                  <li key={ayah.number}>
                    <button
                      onClick={() => handleResultClick(ayah.numberInSurah)}
                      className="w-full text-left px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex h-5 px-1.5 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                          {surahId}:{ayah.numberInSurah}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${
                          matchType === "english"
                            ? "bg-blue-50 text-blue-500 dark:bg-blue-950/30 dark:text-blue-400"
                            : matchType === "bangla"
                            ? "bg-teal-50 text-teal-500 dark:bg-teal-950/30 dark:text-teal-400"
                            : "bg-amber-50 text-amber-500 dark:bg-amber-950/30 dark:text-amber-400"
                        }`}>
                          {matchType === "english" ? "English" : matchType === "bangla" ? "বাংলা" : "Arabic"}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed line-clamp-2">{snippet}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* ── Global Quran Results ── */}
            {mode === "global" && !isLoading && globalResults.length > 0 && (
              <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {globalResults.map((result) => {
                  const isCurrentSurah = result.surahNumber === surahId;
                  return (
                    <li key={result.globalAyahNumber}>
                      {isCurrentSurah ? (
                        <button
                          onClick={() => handleResultClick(result.numberInSurah)}
                          className="w-full text-left px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex h-5 px-1.5 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                                {result.surahNumber}:{result.numberInSurah}
                              </span>
                              <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 truncate max-w-[120px]">{result.surahEnglishName}</span>
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">← This Surah</span>
                            </div>
                            <ArrowRight className="h-3 w-3 text-zinc-400 shrink-0" />
                          </div>
                          <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed line-clamp-2">{result.englishText}</p>
                          {result.banglaText && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-1 mt-0.5">{result.banglaText}</p>
                          )}
                        </button>
                      ) : (
                        <Link
                          href={`/surah/${result.surahNumber}#ayah-${result.numberInSurah}`}
                          onClick={() => { setIsOpen(false); setQuery(""); }}
                          className="block px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex h-5 px-1.5 items-center justify-center rounded-md bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 font-bold text-[10px]">
                                {result.surahNumber}:{result.numberInSurah}
                              </span>
                              <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 truncate max-w-[160px]">{result.surahEnglishName}</span>
                            </div>
                            <ArrowRight className="h-3 w-3 text-zinc-400 shrink-0" />
                          </div>
                          <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed line-clamp-2">{result.englishText}</p>
                          {result.banglaText && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-1 mt-0.5">{result.banglaText}</p>
                          )}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer hint */}
          {hasResults && (
            <div className="px-4 py-2 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-400">
              {mode === "surah"
                ? `${localResults.length} result${localResults.length !== 1 ? "s" : ""} in ${surahName}`
                : `${globalResults.length} result${globalResults.length !== 1 ? "s" : ""} across the Quran`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
