"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import {
  ALLAH_NAMES,
  KALIMAS,
  TASBIH_AZKAR,
} from "@/lib/islamicData";

interface DuaSearchWidgetProps {
  /** Called when user clicks a result so the page can switch tab & scroll */
  onNavigate: (tab: "tasbih" | "kalimah" | "sana" | "azan", id?: number) => void;
}

interface DuaResult {
  type: "tasbih" | "name" | "kalima";
  id: number | string;
  arabic: string;
  title: string;
  subtitle: string;
  tab: "tasbih" | "kalimah" | "sana" | "azan";
}

export function DuaSearchWidget({ onNavigate }: DuaSearchWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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

  // Focus on open
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [isOpen]);

  // Build results from all content types
  const q = query.toLowerCase().trim();

  const results: DuaResult[] = [];

  if (q) {
    // Tasbih
    TASBIH_AZKAR.forEach((a) => {
      if (
        a.transliteration.toLowerCase().includes(q) ||
        a.english.toLowerCase().includes(q) ||
        a.bangla.includes(q) ||
        a.arabic.includes(q)
      ) {
        results.push({
          type: "tasbih",
          id: a.id,
          arabic: a.arabic,
          title: a.transliteration,
          subtitle: a.english,
          tab: "tasbih",
        });
      }
    });

    // Names of Allah
    ALLAH_NAMES.forEach((n) => {
      if (
        n.transliteration.toLowerCase().includes(q) ||
        n.english.toLowerCase().includes(q) ||
        n.bangla.includes(q) ||
        n.id.toString() === q
      ) {
        results.push({
          type: "name",
          id: n.id,
          arabic: n.arabic,
          title: n.transliteration,
          subtitle: `#${n.id} · ${n.english}`,
          tab: "tasbih",
        });
      }
    });

    // Kalimas
    KALIMAS.forEach((k) => {
      if (
        (k.title || "").toLowerCase().includes(q) ||
        k.transliteration.toLowerCase().includes(q) ||
        k.english.toLowerCase().includes(q) ||
        k.bangla.includes(q)
      ) {
        results.push({
          type: "kalima",
          id: k.id,
          arabic: k.arabic,
          title: k.title || `Kalima ${k.id}`,
          subtitle: k.english.slice(0, 60) + "…",
          tab: "kalimah",
        });
      }
    });
  }

  const handleResultClick = (result: DuaResult) => {
    onNavigate(result.tab, typeof result.id === "number" ? result.id : undefined);
    setIsOpen(false);
    setQuery("");
  };

  const typeBadge = (type: DuaResult["type"]) => {
    if (type === "tasbih") return { label: "Tasbih", cls: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400" };
    if (type === "name")   return { label: "Name of Allah", cls: "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400" };
    return { label: "Kalima", cls: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400" };
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* ── Trigger button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 h-9 px-3.5 rounded-xl border text-xs font-semibold transition-all shadow-xs ${
          isOpen
            ? "bg-emerald-600 border-emerald-600 text-white"
            : "bg-white/90 border-zinc-200/80 text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900/90 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
        }`}
      >
        <Search className="h-3.5 w-3.5 shrink-0" />
        <span>Search</span>
      </button>

      {/* ── Dropdown panel ── */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-[min(400px,calc(100vw-2rem))] rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl z-50 overflow-hidden">

          {/* Input row */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
            <Search className="h-4 w-4 text-zinc-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Tasbih, Names of Allah, Kalimas…"
              className="flex-1 text-sm text-zinc-800 dark:text-zinc-100 bg-transparent placeholder-zinc-400 focus:outline-none"
            />
            {query ? (
              <button onClick={() => setQuery("")} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          {/* Results */}
          <div className="max-h-[min(60vh,360px)] overflow-y-auto">
            {!query && (
              <div className="py-8 text-center text-xs text-zinc-400">
                <Search className="h-5 w-5 mx-auto mb-2 opacity-30" />
                <p>Type to search Tasbih, Names of Allah, or Kalimas</p>
              </div>
            )}

            {query && results.length === 0 && (
              <div className="py-8 text-center text-xs text-zinc-400">
                <Search className="h-5 w-5 mx-auto mb-2 opacity-30" />
                <p>No results for <strong className="text-zinc-500">&quot;{query}&quot;</strong></p>
              </div>
            )}

            {results.length > 0 && (
              <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {results.map((r, i) => {
                  const badge = typeBadge(r.type);
                  return (
                    <li key={`${r.type}-${r.id}-${i}`}>
                      <button
                        onClick={() => handleResultClick(r)}
                        className="w-full text-left flex items-center justify-between gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${badge.cls}`}>
                              {badge.label}
                            </span>
                            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-100 truncate">{r.title}</span>
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{r.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-base font-arabic text-emerald-600 dark:text-emerald-400">{r.arabic.slice(0, 10)}</span>
                          <ArrowRight className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-600" />
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          {results.length > 0 && (
            <div className="px-4 py-2 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-400">
              {results.length} result{results.length !== 1 ? "s" : ""} found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
