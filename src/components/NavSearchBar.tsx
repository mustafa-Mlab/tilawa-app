"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { searchAyahsFullText, AyahSearchResult } from "@/lib/globalSearch";
import { fuzzySearchSurahs } from "@/lib/surahSearch";
import { getSurahList, SurahInfo } from "@/lib/quran";
import Link from "next/link";

export function NavSearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [surahResults, setSurahResults] = useState<SurahInfo[]>([]);
  const [ayahResults, setAyahResults] = useState<AyahSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allSurahs, setAllSurahs] = useState<SurahInfo[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load surah list once
  useEffect(() => {
    getSurahList().then((list) => {
      setSurahResults(list.slice(0, 5));
      setAllSurahs(list);
    }).catch(() => {});
  }, []);

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

  // Keyboard shortcut: Ctrl/Cmd+K
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 60);
  }, [isOpen]);

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSurahResults(allSurahs.slice(0, 5));
      setAyahResults([]);
      return;
    }

    // Surah fuzzy search (instant)
    const { surahs } = fuzzySearchSurahs(allSurahs, q, "All");
    setSurahResults(surahs.slice(0, 4));

    // Full-text ayah search (async, debounced)
    if (q.length >= 3) {
      setIsLoading(true);
      try {
        const results = await searchAyahsFullText(q);
        setAyahResults(results.slice(0, 5));
      } catch {
        setAyahResults([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setAyahResults([]);
    }
  }, [allSurahs]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(query), 280);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, runSearch]);

  const close = () => { setIsOpen(false); setQuery(""); };

  return (
    <div className="relative" ref={panelRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 h-10 px-3 rounded-xl border text-xs font-semibold transition-all shadow-xs ${
          isOpen
            ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400"
            : "bg-white/80 border-zinc-200/80 text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-900/80 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
        }`}
        aria-label="Search"
        title="Search (Ctrl+K)"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700">
          ⌘K
        </kbd>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[min(480px,calc(100vw-2rem))] rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl z-50 overflow-hidden">

          {/* Search Input */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
            <Search className="h-4 w-4 text-zinc-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Surah, topic, or verse (25:2)…"
              className="flex-1 text-sm text-zinc-800 dark:text-zinc-100 bg-transparent placeholder-zinc-400 focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                <X className="h-4 w-4" />
              </button>
            )}
            {isLoading && <Loader2 className="h-4 w-4 text-emerald-500 animate-spin shrink-0" />}
          </div>

          <div className="max-h-[min(65vh,400px)] overflow-y-auto">
            {/* Surah Results */}
            {surahResults.length > 0 && (
              <div>
                <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Surahs
                </p>
                <ul>
                  {surahResults.map((surah) => (
                    <li key={surah.number}>
                      <Link
                        href={`/surah/${surah.number}`}
                        onClick={close}
                        className="flex items-center justify-between px-4 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] shrink-0">
                            {surah.number}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 leading-tight">{surah.englishName}</p>
                            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">{surah.englishNameTranslation} · {surah.numberOfAyahs} verses</p>
                          </div>
                        </div>
                        <span className="text-sm font-arabic text-emerald-600 dark:text-emerald-400 shrink-0">{surah.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ayah Results */}
            {ayahResults.length > 0 && (
              <div className="border-t border-zinc-100 dark:border-zinc-800">
                <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Verses
                </p>
                <ul>
                  {ayahResults.map((result) => (
                    <li key={result.globalAyahNumber}>
                      <Link
                        href={`/surah/${result.surahNumber}#ayah-${result.numberInSurah}`}
                        onClick={close}
                        className="flex items-start justify-between gap-3 px-4 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="inline-flex h-5 px-1.5 items-center rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold text-[10px]">
                              {result.surahNumber}:{result.numberInSurah}
                            </span>
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">{result.surahEnglishName}</span>
                          </div>
                          <p className="text-xs text-zinc-700 dark:text-zinc-300 line-clamp-1 leading-relaxed">{result.englishText}</p>
                          {result.banglaText && (
                            <p className="text-xs text-zinc-400 dark:text-zinc-500 line-clamp-1 mt-0.5">{result.banglaText}</p>
                          )}
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-600 shrink-0 mt-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && query && surahResults.length === 0 && ayahResults.length === 0 && (
              <div className="py-10 text-center text-zinc-400 text-xs">
                <Search className="h-6 w-6 mx-auto mb-2 opacity-30" />
                <p>No results for <strong className="text-zinc-500">&quot;{query}&quot;</strong></p>
              </div>
            )}

            {/* Default hint */}
            {!query && (
              <div className="py-6 text-center space-y-1">
                <p className="text-xs text-zinc-400">Type to search Surahs, topics, or verses</p>
                <p className="text-[10px] text-zinc-300 dark:text-zinc-600">e.g. "Al-Fatiha", "mercy", "azan", "2:255"</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
            <span className="text-[10px] text-zinc-400">Press <kbd className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-[9px] font-mono">Esc</kbd> to close</span>
            <Link href="/" onClick={close} className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
              Browse all Surahs →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
