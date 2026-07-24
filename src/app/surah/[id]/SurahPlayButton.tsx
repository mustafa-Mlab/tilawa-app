"use client";

import { Play, Pause } from "lucide-react";
import { useQuran } from "@/context/QuranContext";
import { AyahDetail } from "@/lib/quran";

interface SurahPlayButtonProps {
  surahId: number;
  surahName: string;
  surahAyahs: AyahDetail[];
}

export function SurahPlayButton({ surahId, surahName, surahAyahs }: SurahPlayButtonProps) {
  const { currentSurahId, isPlaying, playFullSurah, pauseAudio, resumeAudio } = useQuran();

  const isCurrentSurahPlaying = currentSurahId === surahId && isPlaying;

  const handleToggle = () => {
    if (currentSurahId === surahId) {
      if (isPlaying) {
        pauseAudio();
      } else {
        resumeAudio();
      }
    } else {
      playFullSurah(surahId, surahName, surahAyahs);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs shadow-md transition-all duration-200 active:scale-95 cursor-pointer ${
        isCurrentSurahPlaying
          ? "bg-amber-500 hover:bg-amber-400 text-white shadow-amber-500/20"
          : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20 hover:scale-102"
      }`}
      title={isCurrentSurahPlaying ? "Pause Surah" : "Play Full Surah"}
    >
      {isCurrentSurahPlaying ? (
        <>
          <Pause className="h-4 w-4 fill-current" />
          <span>Pause Surah</span>
        </>
      ) : (
        <>
          <Play className="h-4 w-4 fill-current ml-0.5" />
          <span>Play Surah</span>
        </>
      )}
    </button>
  );
}
