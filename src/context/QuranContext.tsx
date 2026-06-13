"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { getAyahAudioUrl, getSurah, AyahDetail } from "@/lib/quran";
import { useRouter } from "next/navigation";

export interface Reciter {
  id: string;
  name: string;
  englishName: string;
}

export const RECITERS: Reciter[] = [
  { id: "ar.alafasy", name: "مشاري راشد العفاسي", englishName: "Mishary Rashid Alafasy" },
  { id: "ar.abdurrahmaansudais", name: "عبد الرحمن السديس", englishName: "Abdurrahman As-Sudais" },
  { id: "ar.mahermuaiqly", name: "ماهر المعيقلي", englishName: "Maher Al-Muaiqly" },
  { id: "ar.husary", name: "محمود خليل الحصري", englishName: "Mahmoud Khalil Al-Husary" },
  { id: "ar.minshawi", name: "محمد صديق المنشاوي", englishName: "Mohamed Siddiq Al-Minshawi" },
  { id: "ar.abdulbasitmurattal", name: "عبد الباسط عبد الصمد (مرتل)", englishName: "Abdul Basit (Murattal)" },
  { id: "ar.shaatree", name: "أبو بكر الشاطري", englishName: "Abu Bakr Ash-Shaatree" },
  { id: "ar.ahmedajamy", name: "أحمد بن علي العجمي", englishName: "Ahmed Al-Ajamy" },
  { id: "ar.hudhaify", name: "علي بن عبد الرحمن الحذيفي", englishName: "Ali Al-Hudhaify" },
  { id: "ar.muhammadayyoub", name: "محمد أيوب", englishName: "Muhammad Ayyoub" },
  { id: "ar.saoodshuraym", name: "سعود الشريم", englishName: "Sa'ud Al-Shuraim" },
  { id: "ar.abdulsamad", name: "عبد الباسط عبد الصمد", englishName: "Abdul Samad" },
  { id: "ar.abdullahbasfar", name: "عبد الله بصفر", englishName: "Abdullah Basfar" },
  { id: "ar.hanirifai", name: "هاني الرفاعي", englishName: "Hani Ar-Rifai" },
  { id: "en.walk", name: "Ibrahim Walk (English Translation)", englishName: "Ibrahim Walk (English Translation)" },
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
  loop: boolean;
  playEnglishAudio: boolean;

  // Visual settings
  arabicFontSize: number; // in px
  translationFontSize: number; // in px
  tafsirFontSize: number; // in px
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
    surahAyahs: AyahDetail[]
  ) => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  stopAudio: () => void;
  setReciter: (id: string) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (val: number) => void;
  setAutoplayNext: (val: boolean) => void;
  setLoop: (val: boolean) => void;
  setPlayEnglishAudio: (val: boolean) => void;
  toggleBookmark: (ayahNumber: number) => void;
  updateLastRead: (surahId: number, surahName: string, ayahNumberInSurah: number) => void;
  setArabicFontSize: (size: number) => void;
  setTranslationFontSize: (size: number) => void;
  setTafsirFontSize: (size: number) => void;
  setShowEnglish: (val: boolean) => void;
  setShowBangla: (val: boolean) => void;
  seekTo: (time: number) => void;
  skipNext: () => void;
  skipPrev: () => void;
}

const QuranContext = createContext<QuranContextProps | undefined>(undefined);

export function QuranProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

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
  const [loop, setLoopState] = useState(false);
  const [playEnglishAudio, setPlayEnglishAudioState] = useState(true);

  // The active Surah's Ayahs list for navigation/autoplay
  const [activeSurahAyahs, setActiveSurahAyahs] = useState<AyahDetail[]>([]);

  // Visual state
  const [arabicFontSize, setArabicFontSizeState] = useState(36); // px
  const [translationFontSize, setTranslationFontSizeState] = useState(16); // px
  const [tafsirFontSize, setTafsirFontSizeState] = useState(14); // px
  const [showEnglish, setShowEnglishState] = useState(true);
  const [showBangla, setShowBanglaState] = useState(true);

  // Library & History
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [lastRead, setLastRead] = useState<LastRead | null>(null);

  // HTML Audio instance ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isBismillahPlayingRef = useRef(false);
  const isIntroSpeakingRef = useRef(false);
  const isTranslationPlayingRef = useRef(false);

  // Initialize state from local storage (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedReciter = localStorage.getItem("tilawa_reciter");
        const storedRate = localStorage.getItem("tilawa_rate");
        const storedVolume = localStorage.getItem("tilawa_volume");
        const storedAutoplay = localStorage.getItem("tilawa_autoplay");
        const storedLoop = localStorage.getItem("tilawa_loop");
        const storedPlayEnglishAudio = localStorage.getItem("tilawa_play_english_audio");
        const storedArSize = localStorage.getItem("tilawa_ar_size");
        const storedEnSize = localStorage.getItem("tilawa_en_size");
        const storedTafsirSize = localStorage.getItem("tilawa_tafsir_size");
        const storedShowEn = localStorage.getItem("tilawa_show_en");
        const storedShowBn = localStorage.getItem("tilawa_show_bn");
        const storedBookmarks = localStorage.getItem("tilawa_bookmarks");
        const storedLastRead = localStorage.getItem("tilawa_last_read");

        if (storedReciter) setReciterState(storedReciter);
        if (storedRate) setPlaybackRateState(parseFloat(storedRate));
        if (storedVolume) setVolumeState(parseFloat(storedVolume));
        if (storedAutoplay) setAutoplayNextState(storedAutoplay === "true");
        if (storedLoop) setLoopState(storedLoop === "true");
        if (storedPlayEnglishAudio) setPlayEnglishAudioState(storedPlayEnglishAudio === "true");
        if (storedArSize) setArabicFontSizeState(parseInt(storedArSize));
        if (storedEnSize) setTranslationFontSizeState(parseInt(storedEnSize));
        if (storedTafsirSize) setTafsirFontSizeState(parseInt(storedTafsirSize));
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

  const setLoop = (val: boolean) => {
    setLoopState(val);
    saveSetting("tilawa_loop", val.toString());
  };

  const setPlayEnglishAudio = (val: boolean) => {
    setPlayEnglishAudioState(val);
    saveSetting("tilawa_play_english_audio", val.toString());
  };



  const setArabicFontSize = (size: number) => {
    setArabicFontSizeState(size);
    saveSetting("tilawa_ar_size", size.toString());
  };

  const setTranslationFontSize = (size: number) => {
    setTranslationFontSizeState(size);
    saveSetting("tilawa_en_size", size.toString());
  };

  const setTafsirFontSize = (size: number) => {
    setTafsirFontSizeState(size);
    saveSetting("tilawa_tafsir_size", size.toString());
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
  const playActualFirstAyah = useCallback((ayahNum: number) => {
    if (!audioRef.current) return;
    isTranslationPlayingRef.current = false;
    audioRef.current.src = getAyahAudioUrl(ayahNum, reciter);
    audioRef.current.playbackRate = playbackRate;
    audioRef.current.volume = volume;
    audioRef.current.load();
    
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(err => {
        console.error("Play failed", err);
        setIsPlaying(false);
      });
  }, [reciter, playbackRate, volume]);

  const playAyah = (
    ayahNumber: number,
    ayahNumberInSurah: number,
    surahId: number,
    surahName: string,
    surahAyahs: AyahDetail[]
  ) => {
    if (!audioRef.current) return;

    // Set the list of ayahs in this surah
    setActiveSurahAyahs(surahAyahs);

    // If it's already the same ayah, toggle play/pause
    if (currentAyahNumber === ayahNumber) {
      if (isIntroSpeakingRef.current) {
        if (isPlaying) {
          window.speechSynthesis.pause();
          setIsPlaying(false);
        } else {
          window.speechSynthesis.resume();
          setIsPlaying(true);
        }
      } else if (!audioRef.current.paused && !audioRef.current.ended) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.error("Resume playback failed", err));
      }
      return;
    }

    // Cancel any active speech synthesis and reset playback state
    window.speechSynthesis.cancel();
    isIntroSpeakingRef.current = false;
    isBismillahPlayingRef.current = false;
    isTranslationPlayingRef.current = false;

    // New Ayah
    setCurrentSurahId(surahId);
    setCurrentSurahName(surahName);
    setCurrentAyahNumber(ayahNumber);
    setCurrentAyahNumberInSurah(ayahNumberInSurah);
    updateLastRead(surahId, surahName, ayahNumberInSurah);

    // If starting a Surah from the beginning (Ayah 1):
    if (ayahNumberInSurah === 1) {
      setIsPlaying(true);
      isIntroSpeakingRef.current = true;

      getSurah(surahId)
        .then((surahDetails) => {
          const type = surahDetails.revelationType; // "Meccan" or "Medinan"
          const speechText = `Surah ${surahName}. It is a ${type} Surah.`;
          
          const utterance = new SpeechSynthesisUtterance(speechText);
          
          // Select a high-quality male voice (Alex/Daniel on macOS, Google UK Male, or Microsoft David on Windows)
          const voices = window.speechSynthesis.getVoices();
          const maleVoice = 
            voices.find(v => v.name.toLowerCase().includes("google uk english male")) ||
            voices.find(v => v.name.toLowerCase() === "alex") ||
            voices.find(v => v.name.toLowerCase().includes("daniel")) ||
            voices.find(v => v.name.toLowerCase().includes("oliver")) ||
            voices.find(v => v.name.toLowerCase().includes("david")) ||
            voices.find(v => v.name.toLowerCase().includes("male") && v.lang.startsWith("en")) ||
            voices.find(v => v.lang.startsWith("en"));

          if (maleVoice) {
            utterance.voice = maleVoice;
            utterance.lang = maleVoice.lang;
          } else {
            utterance.lang = "en-US";
          }

          utterance.rate = 0.85; // Slightly slower, more solemn and natural
          utterance.pitch = 0.95; // Slightly deeper pitch
          
          utterance.onend = () => {
            isIntroSpeakingRef.current = false;
            
            // After speech finishes, play Bismillah (global Ayah 1) for all Surahs except Al-Fatiha (1) and At-Tawbah (9)
            const needsBismillah = surahId !== 1 && surahId !== 9;
            if (needsBismillah) {
              isBismillahPlayingRef.current = true;
              if (audioRef.current) {
                audioRef.current.src = getAyahAudioUrl(1, reciter);
                audioRef.current.load();
                audioRef.current.play()
                  .catch(err => {
                    console.error("Failed to play Bismillah audio, playing Ayah 1 directly", err);
                    isBismillahPlayingRef.current = false;
                    playActualFirstAyah(ayahNumber);
                  });
              }
            } else {
              playActualFirstAyah(ayahNumber);
            }
          };

          utterance.onerror = (e) => {
            console.error("Speech synthesis error", e);
            isIntroSpeakingRef.current = false;
            playActualFirstAyah(ayahNumber);
          };

          window.speechSynthesis.speak(utterance);
        })
        .catch((err) => {
          console.error("Failed to get Surah details for intro announcement", err);
          isIntroSpeakingRef.current = false;
          playActualFirstAyah(ayahNumber);
        });
    } else {
      // Normal Ayah playback
      playActualFirstAyah(ayahNumber);
    }
  };



  function triggerAutoplayOrLoop() {
    // Case 3: Autoplay is DISABLED and Loop is ENABLED -> replay same Ayah
    if (!autoplayNext && loop) {
      if (currentAyahNumber) {
        playActualFirstAyah(currentAyahNumber);
      }
      return;
    }

    // Case 4: Autoplay is DISABLED and Loop is DISABLED -> stop playing
    if (!autoplayNext && !loop) {
      setIsPlaying(false);
      return;
    }

    // If Autoplay is ENABLED:
    if (autoplayNext) {
      if (activeSurahAyahs.length === 0 || currentAyahNumber === null || currentSurahId === null || currentSurahName === null) {
        setIsPlaying(false);
        return;
      }

      const currentIndex = activeSurahAyahs.findIndex(a => a.number === currentAyahNumber);

      // If NOT the last Ayah of the current Surah: play next Ayah
      if (currentIndex !== -1 && currentIndex < activeSurahAyahs.length - 1) {
        const next = activeSurahAyahs[currentIndex + 1];
        playAyah(next.number, next.numberInSurah, currentSurahId, currentSurahName, activeSurahAyahs);
      } else {
        // We reached the END of the current Surah!
        
        // Case 2: Autoplay is ENABLED and Loop is ENABLED -> play current Surah in loop (loop back to first Ayah of current Surah)
        if (loop) {
          const first = activeSurahAyahs[0];
          playAyah(first.number, first.numberInSurah, currentSurahId, currentSurahName, activeSurahAyahs);
        } else {
          // Case 1: Autoplay is ENABLED and Loop is DISABLED -> play next Surah automatically
          const nextSurahId = currentSurahId + 1;
          if (nextSurahId <= 114) {
            getSurah(nextSurahId)
              .then((nextSurah) => {
                const firstAyah = nextSurah.ayahs[0];
                playAyah(firstAyah.number, 1, nextSurahId, nextSurah.englishName, nextSurah.ayahs);
                router.push(`/surah/${nextSurahId}`);
              })
              .catch((err) => {
                console.error("Failed to autoplay next surah", err);
                setIsPlaying(false);
              });
          } else {
            // End of Quran, stop
            stopAudio();
          }
        }
      }
    }
  }

  const pauseAudio = () => {
    if (isIntroSpeakingRef.current) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const resumeAudio = () => {
    if (isIntroSpeakingRef.current) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
    } else if (audioRef.current && currentAyahNumber) {
      audioRef.current.play().catch(err => console.error("Play failed", err));
    }
  };

  const stopAudio = () => {
    window.speechSynthesis.cancel();
    isIntroSpeakingRef.current = false;
    isBismillahPlayingRef.current = false;
    isTranslationPlayingRef.current = false;
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
    setProgress(100);

    // If Bismillah finished playing, transition to actual first Ayah
    if (isBismillahPlayingRef.current) {
      isBismillahPlayingRef.current = false;
      if (currentAyahNumber) {
        playActualFirstAyah(currentAyahNumber);
      }
      return;
    }

    // If Arabic recitation ends and playEnglishAudio is enabled, play Ibrahim Walk translation audio
    if (!isTranslationPlayingRef.current && playEnglishAudio && reciter !== "en.walk" && currentAyahNumber) {
      isTranslationPlayingRef.current = true;
      if (audioRef.current) {
        audioRef.current.src = getAyahAudioUrl(currentAyahNumber, "en.walk");
        audioRef.current.playbackRate = playbackRate;
        audioRef.current.volume = volume;
        audioRef.current.load();
        audioRef.current.play()
          .catch(err => {
            console.error("Failed to play Ibrahim Walk translation audio", err);
            isTranslationPlayingRef.current = false;
            triggerAutoplayOrLoop();
          });
      }
      return;
    }

    isTranslationPlayingRef.current = false;
    triggerAutoplayOrLoop();
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
        loop,
        playEnglishAudio,
        arabicFontSize,
        translationFontSize,
        tafsirFontSize,
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
        setLoop,
        setPlayEnglishAudio,
        toggleBookmark,
        updateLastRead,
        setArabicFontSize,
        setTranslationFontSize,
        setTafsirFontSize,
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
