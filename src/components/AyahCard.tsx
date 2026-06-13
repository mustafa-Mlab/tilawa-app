"use client";

import { useState, useEffect } from "react";
import { AyahDetail } from "@/lib/quran";
import { Play, Pause, Bookmark, Copy, Check, BookOpen } from "lucide-react";
import { useQuran } from "@/context/QuranContext";

interface AyahCardProps {
  ayah: AyahDetail;
  surahId: number;
  surahName: string;
  surahAyahs: AyahDetail[]
}

export function AyahCard({ ayah, surahId, surahName, surahAyahs }: AyahCardProps) {
  const {
    currentAyahNumber,
    isPlaying,
    playAyah,
    bookmarks,
    toggleBookmark,
    arabicFontSize,
    translationFontSize,
    tafsirFontSize,
    showEnglish,
    showBangla,
  } = useQuran();

  const [copied, setCopied] = useState(false);
  const [showTafsir, setShowTafsir] = useState(false);
  const [loadingTafsir, setLoadingTafsir] = useState(false);
  const [tafsirData, setTafsirData] = useState<{ english: string; bangla: string } | null>(null);

  const isCurrentPlaying = currentAyahNumber === ayah.number;
  const isBookmarked = bookmarks.includes(ayah.number);

  useEffect(() => {
    if (isCurrentPlaying) {
      const element = document.getElementById(`ayah-${ayah.numberInSurah}`);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [isCurrentPlaying, ayah.numberInSurah]);

  const handlePlay = () => {
    playAyah(ayah.number, ayah.numberInSurah, surahId, surahName, surahAyahs);
  };

  const handleCopy = () => {
    const textToCopy = `[Quran ${surahId}:${ayah.numberInSurah}]\nArabic: ${ayah.arabicText}\n${
      showEnglish ? `English: ${ayah.englishText}\n` : ""
    }${showBangla ? `Bangla: ${ayah.banglaText}` : ""}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleTafsir = async () => {
    if (showTafsir) {
      setShowTafsir(false);
      return;
    }

    setShowTafsir(true);

    if (tafsirData) return; // already fetched

    setLoadingTafsir(true);
    try {
      console.log(`[Tafsir] Fetching Tafsir for Surah ${surahId}, Ayah ${ayah.numberInSurah}...`);
      const [engRes, bngRes] = await Promise.all([
        fetch(`https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/en-tafisr-ibn-kathir/${surahId}.json`),
        fetch(`https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/bn-tafsir-ahsanul-bayaan/${surahId}.json`)
      ]);

      console.log(`[Tafsir] Fetch status - English: ${engRes.status}, Bangla: ${bngRes.status}`);

      if (!engRes.ok || !bngRes.ok) {
        throw new Error(`Failed to fetch Tafsir. Status - English: ${engRes.status}, Bangla: ${bngRes.status}`);
      }

      const engList = await engRes.json();
      const bngList = await bngRes.json();

      console.log(`[Tafsir] Data sizes - English: ${engList?.length}, Bangla: ${bngList?.length}`);

      const engAyah = engList.find((item: any) => item.ayah === ayah.numberInSurah);
      const bngAyah = bngList.find((item: any) => item.ayah === ayah.numberInSurah);

      console.log(`[Tafsir] Search results - English text length: ${engAyah?.text?.length || 0}, Bangla text length: ${bngAyah?.text?.length || 0}`);

      setTafsirData({
        english: engAyah ? engAyah.text : "No English Tafsir available for this verse.",
        bangla: bngAyah ? bngAyah.text : "কোনো বাংলা তাফসীর পাওয়া যায়নি।"
      });
    } catch (error) {
      console.error("[Tafsir] Fetch failed:", error);
      setTafsirData({
        english: "Failed to load English Tafsir. Please check your internet connection.",
        bangla: "বাংলা তাফসীর লোড করা যায়নি। অনুগ্রহ করে আপনার ইন্টারনেট কানেকশন চেক করুন।"
      });
    } finally {
      setLoadingTafsir(false);
    }
  };

  return (
    <article
      id={`ayah-${ayah.numberInSurah}`}
      className={`group relative flex flex-col p-6 rounded-2xl border transition-all duration-350 ${
        isCurrentPlaying
          ? "bg-emerald-500/5 border-emerald-500/30 dark:bg-emerald-950/10 dark:border-emerald-800/40 shadow-xs shadow-emerald-500/2"
          : "bg-white border-zinc-200/60 dark:bg-zinc-900/20 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700/60"
      }`}
    >
      {/* Decorative vertical line for active Ayah */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-all duration-300 ${
          isCurrentPlaying ? "bg-emerald-500 dark:bg-emerald-400" : "bg-transparent"
        }`}
      />

      {/* Meta & Actions Bar */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800 mb-5 text-zinc-500 dark:text-zinc-400">
        {/* Ayah Identifier (e.g. 1:1) */}
        <span className="inline-flex h-7 px-3 items-center justify-center rounded-lg bg-zinc-100 text-xs font-bold border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700">
          {surahId}:{ayah.numberInSurah}
        </span>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Play/Pause Button */}
          <button
            onClick={handlePlay}
            className={`flex h-9.5 w-9.5 items-center justify-center rounded-lg transition-all ${
              isCurrentPlaying
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                : "hover:bg-zinc-50 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            }`}
            aria-label={isCurrentPlaying && isPlaying ? "Pause Audio" : "Play Audio"}
          >
            {isCurrentPlaying && isPlaying ? (
              <Pause className="h-4 w-4 fill-current stroke-[2.5]" />
            ) : (
              <Play className="h-4 w-4 fill-current stroke-[2.5] pl-0.5" />
            )}
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => toggleBookmark(ayah.number)}
            className={`flex h-9.5 w-9.5 items-center justify-center rounded-lg transition-all ${
              isBookmarked
                ? "text-rose-500 dark:text-rose-400"
                : "hover:bg-zinc-50 text-zinc-400 hover:text-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-white"
            }`}
            aria-label="Bookmark Ayah"
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex h-9.5 w-9.5 items-center justify-center rounded-lg hover:bg-zinc-50 text-zinc-400 hover:text-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-white transition-all"
            aria-label="Copy Ayah"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500 stroke-[2.5]" /> : <Copy className="h-4 w-4" />}
          </button>

          {/* Tafsir Button */}
          <button
            onClick={toggleTafsir}
            className={`flex h-9.5 px-3 items-center gap-1.5 rounded-lg border text-xs font-bold transition-all ${
              showTafsir
                ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20"
                : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 text-zinc-600 hover:text-zinc-955 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            }`}
            aria-label="Toggle Tafsir"
          >
            <BookOpen className="h-4 w-4" />
            <span>Tafsir</span>
          </button>
        </div>
      </div>

      {/* Main Text Content */}
      <div className="space-y-6">
        {/* Arabic Script */}
        <div className="w-full text-right" dir="rtl">
          <p
            className="font-arabic text-zinc-950 dark:text-zinc-50 font-bold leading-loose select-all tracking-normal"
            style={{ fontSize: `${arabicFontSize}px` }}
          >
            {ayah.arabicText}
          </p>
        </div>

        {/* English Translation */}
        {showEnglish && (
          <div className="w-full text-left border-l-2 border-emerald-500/10 pl-4 dark:border-emerald-800/10">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">
              English
            </span>
            <p
              className="text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed font-sans"
              style={{ fontSize: `${translationFontSize}px` }}
            >
              {ayah.englishText}
            </p>
          </div>
        )}

        {/* Bangla Translation */}
        {showBangla && (
          <div className="w-full text-left border-l-2 border-emerald-500/10 pl-4 dark:border-emerald-800/10">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">
              বাংলা
            </span>
            <p
              className="text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed font-sans"
              style={{ fontSize: `${translationFontSize}px` }}
            >
              {ayah.banglaText}
            </p>
          </div>
        )}

        {/* Tafsir Panel */}
        {showTafsir && (
          <div className="pt-5 border-t border-dashed border-zinc-200 dark:border-zinc-800 space-y-4 animate-fade-in">
            <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span>Ayah Tafsir (Explanation)</span>
            </h4>

            {loadingTafsir ? (
              <div className="flex items-center gap-2 text-zinc-400 py-3 text-xs">
                <span className="h-4 w-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span>Loading Bangla & English Tafsir...</span>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Bangla Tafsir */}
                <div className="p-4 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-150/60 dark:border-zinc-900/60 space-y-1.5">
                  <span className="text-[9px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest block">
                    বাংলা তাফসীর (আহসানুল বায়ান)
                  </span>
                  <p 
                    className="text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line select-all"
                    style={{ fontSize: `${tafsirFontSize}px` }}
                  >
                    {tafsirData?.bangla}
                  </p>
                </div>

                {/* English Tafsir */}
                <div className="p-4 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-150/60 dark:border-zinc-900/60 space-y-1.5">
                  <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">
                    English Tafsir (Ibn Kathir)
                  </span>
                  <p 
                    className="text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line select-all"
                    style={{ fontSize: `${tafsirFontSize}px` }}
                  >
                    {tafsirData?.english}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
