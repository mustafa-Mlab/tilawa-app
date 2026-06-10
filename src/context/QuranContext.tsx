"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { getAyahAudioUrl } from "@/lib/quran";

export interface Reciter {
  id: string;
  name: string;
  englishName: string;
}

export const RECITERS: Reciter[] = [
  { id: "ar.alafasy", name: "مشاري راشد العفاسي", englishName: "Mishary Rashid Alafasy" },
  { id: "ar.abdurrahmaansudais", name: "عبد الرحمن السديس", englishName: "Abdurrahman As-Sudais" },
  { id: "ar.maheralmuaiqly", name: "ماهر المعيقلي", englishName: "Maher Al-Muaiqly" },
  { id: "ar.husary", name: "محمود خليل الحصري", englishName: "Mahmoud Khalil Al-Husary" },
  { id: "ar.minshawi", name: "محمد صديق المنشاوي", englishName: "Mohamed Siddiq Al-Minshawi" },
];

export interface LastRead {
  surahId: number;
  surahName: string;
  ayahNumberInSurah: number;
}

interface QuranContextProps {
  // Audio playback state
  currentSurahId: number | null;
  currentSurahName: string | null;
  currentAyahNumber: number | null; // Global number (1 - 6236)
  currentAyahNumberInSurah: number | null; // Number in Surah (1 - N)
  isPlaying: boolean;
  reciter: string;
  playbackRate: number;
  volume: number;
  progress: number; // Percentage
  duration: number; // Seconds
  currentTime: number; // Seconds
  autoplayNext: boolean;

  // Visual settings
  arabicFontSize: number; // in px
  translationFontSize: number; // in px
  showEnglish: boolean;
  showBangla: boolean;

  // Library/Bookmarks & History
  bookmarks: number[]; // Array of global ayah numbers
  lastRead: LastRead | null;

  // Actions
  playAyah: (
    ayahNumber: number,
    ayahNumberInSurah: number,
    surahId: number,
    surahName: string,
    surahAyahs: { number: number; numberInSurah: number }[]
  ) => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  stopAudio: () => void;
  setReciter: (id: string) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (val: number) => void;
  setAutoplayNext: (val: boolean) => void;
  toggleBookmark: (ayahNumber: number) => void;
  updateLastRead: (surahId: number, surahName: string, ayahNumberInSurah: number) => void;
  setArabicFontSize: (size: number) => void;
  setTranslationFontSize: (size: number) => void;
  setShowEnglish: (val: boolean) => void;
  setShowBangla: (val: boolean) => void;
  seekTo: (time: number) => void;
  skipNext: () => void;
  skipPrev: () => void;
}

const QuranContext = createContext<QuranContextProps | undefined>(undefined);

export function QuranProvider({ children }: { children: React.ReactNode }) {

  // Audio state
  const [currentSurahId, setCurrentSurahId] = useState<number | null>(null);
  const [currentSurahName, setCurrentSurahName] = useState<string | null>(null);
  const [currentAyahNumber, setCurrentAyahNumber] = useState<number | null>(null);
  const [currentAyahNumberInSurah, setCurrentAyahNumberInSurah] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [reciter, setReciterState] = useState("ar.alafasy");
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [volume, setVolumeState] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [autoplayNext, setAutoplayNextState] = useState(true);

  // The active Surah's Ayahs list for navigation/autoplay
  const [activeSurahAyahs, setActiveSurahAyahs] = useState<{ number: number; numberInSurah: number }[]>([]);

  // Visual state
  const [arabicFontSize, setArabicFontSizeState] = useState(36); // px
  const [translationFontSize, setTranslationFontSizeState] = useState(16); // px
  const [showEnglish, setShowEnglishState] = useState(true);
  const [showBangla, setShowBanglaState] = useState(true);

  // Library & History
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [lastRead, setLastRead] = useState<LastRead | null>(null);

  // HTML Audio instance ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize state from local storage (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedReciter = localStorage.getItem("tilawa_reciter");
        const storedRate = localStorage.getItem("tilawa_rate");
        const storedVolume = localStorage.getItem("tilawa_volume");
        const storedAutoplay = localStorage.getItem("tilawa_autoplay");
        const storedArSize = localStorage.getItem("tilawa_ar_size");
        const storedEnSize = localStorage.getItem("tilawa_en_size");
        const storedShowEn = localStorage.getItem("tilawa_show_en");
        const storedShowBn = localStorage.getItem("tilawa_show_bn");
        const storedBookmarks = localStorage.getItem("tilawa_bookmarks");
        const storedLastRead = localStorage.getItem("tilawa_last_read");

        if (storedReciter) setReciterState(storedReciter);
        if (storedRate) setPlaybackRateState(parseFloat(storedRate));
        if (storedVolume) setVolumeState(parseFloat(storedVolume));
        if (storedAutoplay) setAutoplayNextState(storedAutoplay === "true");
        if (storedArSize) setArabicFontSizeState(parseInt(storedArSize));
        if (storedEnSize) setTranslationFontSizeState(parseInt(storedEnSize));
        if (storedShowEn) setShowEnglishState(storedShowEn === "true");
        if (storedShowBn) setShowBanglaState(storedShowBn === "true");
        if (storedBookmarks) setBookmarks(JSON.parse(storedBookmarks));
        if (storedLastRead) setLastRead(JSON.parse(storedLastRead));
      } catch (e) {
        console.error("Error loading localStorage settings", e);
      }

    }
  }, []);

  // Update Audio instance properties when parameters change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.volume = volume;
    }
  }, [playbackRate, volume]);

  // Helpers to save settings
  const saveSetting = (key: string, value: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  };

  const setReciter = (id: string) => {
    setReciterState(id);
    saveSetting("tilawa_reciter", id);
    
    // If playing, switch reciter for current Ayah instantly
    if (currentAyahNumber && audioRef.current) {
      const isCurrentlyPlaying = !audioRef.current.paused && !audioRef.current.ended;
      audioRef.current.src = getAyahAudioUrl(currentAyahNumber, id);
      audioRef.current.load();
      if (isCurrentlyPlaying) {
        audioRef.current.play().catch(err => console.error("Reciter switch play failed", err));
      }
    }
  };

  const setPlaybackRate = (rate: number) => {
    setPlaybackRateState(rate);
    saveSetting("tilawa_rate", rate.toString());
  };

  const setVolume = (val: number) => {
    setVolumeState(val);
    saveSetting("tilawa_volume", val.toString());
  };

  const setAutoplayNext = (val: boolean) => {
    setAutoplayNextState(val);
    saveSetting("tilawa_autoplay", val.toString());
  };

  const setArabicFontSize = (size: number) => {
    setArabicFontSizeState(size);
    saveSetting("tilawa_ar_size", size.toString());
  };

  const setTranslationFontSize = (size: number) => {
    setTranslationFontSizeState(size);
    saveSetting("tilawa_en_size", size.toString());
  };

  const setShowEnglish = (val: boolean) => {
    setShowEnglishState(val);
    saveSetting("tilawa_show_en", val.toString());
  };

  const setShowBangla = (val: boolean) => {
    setShowBanglaState(val);
    saveSetting("tilawa_show_bn", val.toString());
  };

  const toggleBookmark = (ayahNum: number) => {
    const nextBookmarks = bookmarks.includes(ayahNum)
      ? bookmarks.filter(n => n !== ayahNum)
      : [...bookmarks, ayahNum];
    setBookmarks(nextBookmarks);
    saveSetting("tilawa_bookmarks", JSON.stringify(nextBookmarks));
  };

  const updateLastRead = useCallback((surahId: number, surahName: string, ayahNumberInSurah: number) => {
    const val: LastRead = { surahId, surahName, ayahNumberInSurah };
    setLastRead(val);
    saveSetting("tilawa_last_read", JSON.stringify(val));
  }, []);

  // Main playback controls
  const playAyah = (
    ayahNumber: number,
    ayahNumberInSurah: number,
    surahId: number,
    surahName: string,
    surahAyahs: { number: number; numberInSurah: number }[]
  ) => {
    if (!audioRef.current) return;

    // Set the list of ayahs in this surah
    setActiveSurahAyahs(surahAyahs);

    // If it's already the same ayah, toggle play/pause
    if (currentAyahNumber === ayahNumber) {
      if (!audioRef.current.paused && !audioRef.current.ended) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.error("Resume playback failed", err));
      }
      return;
    }

    // New Ayah
    setCurrentSurahId(surahId);
    setCurrentSurahName(surahName);
    setCurrentAyahNumber(ayahNumber);
    setCurrentAyahNumberInSurah(ayahNumberInSurah);
    updateLastRead(surahId, surahName, ayahNumberInSurah);

    audioRef.current.src = getAyahAudioUrl(ayahNumber, reciter);
    audioRef.current.playbackRate = playbackRate;
    audioRef.current.volume = volume;
    audioRef.current.load();
    
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(err => {
        console.error("Play failed", err);
        setIsPlaying(false);
      });
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const resumeAudio = () => {
    if (audioRef.current && currentAyahNumber) {
      audioRef.current.play().catch(err => console.error("Play failed", err));
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentSurahId(null);
    setCurrentSurahName(null);
    setCurrentAyahNumber(null);
    setCurrentAyahNumberInSurah(null);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
      if (audioRef.current.duration) {
        setProgress((time / audioRef.current.duration) * 100);
      }
    }
  };

  // Navigating between active Ayahs
  const handleNextAyah = () => {
    if (activeSurahAyahs.length === 0 || currentAyahNumber === null) return;

    const currentIndex = activeSurahAyahs.findIndex(a => a.number === currentAyahNumber);
    if (currentIndex !== -1 && currentIndex < activeSurahAyahs.length - 1) {
      const next = activeSurahAyahs[currentIndex + 1];
      if (currentSurahId && currentSurahName) {
        playAyah(next.number, next.numberInSurah, currentSurahId, currentSurahName, activeSurahAyahs);
      }
    } else {
      // End of Surah, stop
      stopAudio();
    }
  };

  const handlePrevAyah = () => {
    if (activeSurahAyahs.length === 0 || currentAyahNumber === null) return;

    const currentIndex = activeSurahAyahs.findIndex(a => a.number === currentAyahNumber);
    if (currentIndex > 0) {
      const prev = activeSurahAyahs[currentIndex - 1];
      if (currentSurahId && currentSurahName) {
        playAyah(prev.number, prev.numberInSurah, currentSurahId, currentSurahName, activeSurahAyahs);
      }
    }
  };

  // Audio HTML events mapped to React callbacks
  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleDurationChange = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(100);
    
    // Auto-trigger next ayah if autoplay is enabled
    if (autoplayNext) {
      handleNextAyah();
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    console.error("Audio playback error:", e);
    setIsPlaying(false);
  };

  return (
    <QuranContext.Provider
      value={{
        currentSurahId,
        currentSurahName,
        currentAyahNumber,
        currentAyahNumberInSurah,
        isPlaying,
        reciter,
        playbackRate,
        volume,
        progress,
        duration,
        currentTime,
        autoplayNext,
        arabicFontSize,
        translationFontSize,
        showEnglish,
        showBangla,
        bookmarks,
        lastRead,
        playAyah,
        pauseAudio,
        resumeAudio,
        stopAudio,
        setReciter,
        setPlaybackRate,
        setVolume,
        setAutoplayNext,
        toggleBookmark,
        updateLastRead,
        setArabicFontSize,
        setTranslationFontSize,
        setShowEnglish,
        setShowBangla,
        seekTo,
        skipNext: handleNextAyah,
        skipPrev: handlePrevAyah,
      }}
    >
      {children}
      <audio
        ref={audioRef}
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onEnded={handleEnded}
        onError={handleError}
      />
    </QuranContext.Provider>
  );
}

export function useQuran() {
  const context = useContext(QuranContext);
  if (context === undefined) {
    throw new Error("useQuran must be used within a QuranProvider");
  }
  return context;
}
