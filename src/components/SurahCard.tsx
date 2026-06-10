"use client";

import Link from "next/link";
import { SurahInfo } from "@/lib/quran";
import { Compass, BookOpen } from "lucide-react";

interface SurahCardProps {
  surah: SurahInfo;
}

export function SurahCard({ surah }: SurahCardProps) {
  const isMeccan = surah.revelationType === "Meccan";

  return (
    <article className="contents">
      <Link
        href={`/surah/${surah.number}`}
        className="group relative flex items-center justify-between p-5 rounded-2xl border border-zinc-200/60 bg-white shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/40 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 hover:bg-emerald-50/5 dark:hover:bg-emerald-950/5 hover:shadow-md hover:shadow-emerald-500/5 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
      >
        <div className="flex items-center gap-4">
          {/* Decorative Surah Number Frame */}
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-bold group-hover:bg-emerald-500 group-hover:border-emerald-500 group-hover:text-white transition-all duration-300">
            {/* Subtle Islamic geometric shape background in SVG if desired, or just clean number */}
            <span className="text-sm tracking-tight relative z-10">{surah.number}</span>
            <div className="absolute inset-1 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 group-hover:border-emerald-400/50 transition-colors duration-300" />
          </div>

          {/* Names & Ayah count */}
          <div className="flex flex-col">
            <h3 className="font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
              {surah.englishName}
            </h3>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              {surah.englishNameTranslation}
            </span>
            <div className="flex items-center gap-2 mt-2">
              {/* Revelation Type Badge */}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide ${
                  isMeccan
                    ? "bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30"
                    : "bg-teal-50 text-teal-600 border border-teal-100 dark:bg-teal-950/20 dark:text-teal-400 dark:border-teal-900/30"
                }`}
              >
                <Compass className="h-2.5 w-2.5" />
                {surah.revelationType}
              </span>
              {/* Ayahs Count */}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide bg-zinc-50 text-zinc-500 border border-zinc-100 dark:bg-zinc-800/40 dark:text-zinc-400 dark:border-zinc-700/30">
                <BookOpen className="h-2.5 w-2.5" />
                {surah.numberOfAyahs} Ayahs
              </span>
            </div>
          </div>
        </div>

        {/* Arabic Surah Name */}
        <div className="flex flex-col items-end gap-1 pl-2">
          <span
            className="text-3xl font-extrabold font-arabic text-emerald-600 dark:text-emerald-400 tracking-normal leading-relaxed group-hover:scale-105 transition-transform duration-300"
            dir="rtl"
          >
            {surah.name}
          </span>
        </div>
      </Link>
    </article>
  );
}
