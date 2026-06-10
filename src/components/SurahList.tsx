"use client";

import { useState } from "react";
import { SurahInfo } from "@/lib/quran";
import { SurahCard } from "./SurahCard";
import { Search, Compass, BookOpen, Clock, ChevronRight } from "lucide-react";
import { useQuran } from "@/context/QuranContext";
import Link from "next/link";

interface SurahListProps {
  surahs: SurahInfo[];
}

export function SurahList({ surahs }: SurahListProps) {
  const { lastRead } = useQuran();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"All" | "Meccan" | "Medinan">("All");

  // Filtering logic
  const filteredSurahs = surahs.filter((surah) => {
    const query = searchQuery.trim().toLowerCase();
    
    // Check type filter first
    if (filterType !== "All" && surah.revelationType !== filterType) {
      return false;
    }

    if (!query) return true;

    // Search by number, english name, english translation, or arabic name
    return (
      surah.number.toString() === query ||
      surah.englishName.toLowerCase().includes(query) ||
      surah.englishNameTranslation.toLowerCase().includes(query) ||
      surah.name.includes(query)
    );
  });

  return (
    <div className="w-full space-y-8">
      {/* Continue Reading Banner */}
      {lastRead && (
        <div className="relative overflow-hidden rounded-2xl border border-emerald-200/50 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent p-5 dark:border-emerald-950/40 dark:from-emerald-950/20 dark:via-zinc-900/10">
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
        </div>
      )}

      {/* Control Panel: Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Surah by name, translation, or number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-zinc-200 bg-white/80 dark:border-zinc-800 dark:bg-zinc-900/40 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
          />
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
            We couldn't find any Surah matching "{searchQuery}". Try searching for another name or number.
          </p>
        </div>
      )}
    </div>
  );
}
