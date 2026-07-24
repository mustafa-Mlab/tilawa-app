"use client";

import { useState, useEffect, useRef } from "react";
import { 
  ALLAH_NAMES, 
  KALIMAS, 
  SANA, 
  AYATUL_KURSI, 
  AZAN_PHRASES, 
  TASBIH_AZKAR, 
  AllahName, 
  TasbihDua 
} from "@/lib/islamicData";
import { 
  Heart, 
  Compass, 
  BookOpen, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Minus, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Music, 
  Volume2,
  Sparkles,
  HelpCircle,
  Share2,
  Check,
  X
} from "lucide-react";

export default function DuaRemembrancePage() {
  const [activeTab, setActiveTab] = useState<"tasbih" | "kalimah" | "sana" | "azan">("tasbih");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedKalima, setExpandedKalima] = useState<number | null>(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Tasbih Counter state (persisted in localStorage)
  const [counts, setCounts] = useState<Record<string, number>>({});
  
  // Audio playback states
  const [ayatulKursiPlaying, setAyatulKursiPlaying] = useState(false);
  const [selectedAzan, setSelectedAzan] = useState("alafasy-a9");
  const [azanPlaying, setAzanPlaying] = useState(false);
  const [sanaPlaying, setSanaPlaying] = useState(false);
  const [playingKalimahId, setPlayingKalimahId] = useState<number | null>(null);

  // Local audio listings state
  const [localAudios, setLocalAudios] = useState<{ adhan: string[]; sana: string[]; kalimah: string[] }>({
    adhan: [],
    sana: [],
    kalimah: [],
  });
  
  // Audio refs
  const ayatulKursiAudioRef = useRef<HTMLAudioElement | null>(null);
  const azanAudioRef = useRef<HTMLAudioElement | null>(null);
  const sanaAudioRef = useRef<HTMLAudioElement | null>(null);
  const kalimahAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize counts from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCounts: Record<string, number> = {};
      TASBIH_AZKAR.forEach(azkar => {
        const val = localStorage.getItem(`tilawa_tasbih_${azkar.id}`);
        savedCounts[azkar.id] = val ? parseInt(val, 10) : 0;
      });
      setCounts(savedCounts);
    }
  }, []);

  // Fetch local audio files
  useEffect(() => {
    fetch("/api/local-audio")
      .then((res) => res.json())
      .then((data) => setLocalAudios(data))
      .catch((err) => console.error("Failed to load local audio list", err));
  }, []);

  // Web Audio API Synthesizer for tactile tick sound
  const playTickSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {
      console.warn("AudioContext failed to start", e);
    }
  };

  const handleIncrement = (id: string) => {
    playTickSound();
    setCounts(prev => {
      const nextVal = (prev[id] || 0) + 1;
      localStorage.setItem(`tilawa_tasbih_${id}`, nextVal.toString());
      return { ...prev, [id]: nextVal };
    });
  };

  const handleDecrement = (id: string) => {
    setCounts(prev => {
      const current = prev[id] || 0;
      if (current <= 0) return prev;
      const nextVal = current - 1;
      localStorage.setItem(`tilawa_tasbih_${id}`, nextVal.toString());
      return { ...prev, [id]: nextVal };
    });
  };

  const handleReset = (id: string) => {
    setCounts(prev => {
      localStorage.setItem(`tilawa_tasbih_${id}`, "0");
      return { ...prev, [id]: 0 };
    });
  };

  // Ayatul Kursi playback trigger
  const toggleAyatulKursi = () => {
    if (!ayatulKursiAudioRef.current) return;
    
    // Stop other audios if playing
    if (azanPlaying && azanAudioRef.current) {
      azanAudioRef.current.pause();
      setAzanPlaying(false);
    }
    if (sanaPlaying && sanaAudioRef.current) {
      sanaAudioRef.current.pause();
      setSanaPlaying(false);
    }
    if (playingKalimahId && kalimahAudioRef.current) {
      kalimahAudioRef.current.pause();
      setPlayingKalimahId(null);
    }

    if (ayatulKursiPlaying) {
      ayatulKursiAudioRef.current.pause();
      setAyatulKursiPlaying(false);
    } else {
      ayatulKursiAudioRef.current.play()
        .then(() => setAyatulKursiPlaying(true))
        .catch(err => console.error("Ayatul Kursi play failed", err));
    }
  };

  // Azan playback trigger
  const toggleAzan = () => {
    if (!azanAudioRef.current) return;

    // Stop other audios if playing
    if (ayatulKursiPlaying && ayatulKursiAudioRef.current) {
      ayatulKursiAudioRef.current.pause();
      setAyatulKursiPlaying(false);
    }
    if (sanaPlaying && sanaAudioRef.current) {
      sanaAudioRef.current.pause();
      setSanaPlaying(false);
    }
    if (playingKalimahId && kalimahAudioRef.current) {
      kalimahAudioRef.current.pause();
      setPlayingKalimahId(null);
    }

    if (azanPlaying) {
      azanAudioRef.current.pause();
      setAzanPlaying(false);
    } else {
      azanAudioRef.current.src = getAzanUrl(selectedAzan);
      azanAudioRef.current.load();
      azanAudioRef.current.play()
        .then(() => setAzanPlaying(true))
        .catch(err => console.error("Azan play failed", err));
    }
  };

  // Sana playback trigger
  const toggleSana = () => {
    if (!sanaAudioRef.current) return;

    // Stop other audios if playing
    if (azanPlaying && azanAudioRef.current) {
      azanAudioRef.current.pause();
      setAzanPlaying(false);
    }
    if (ayatulKursiPlaying && ayatulKursiAudioRef.current) {
      ayatulKursiAudioRef.current.pause();
      setAyatulKursiPlaying(false);
    }
    if (playingKalimahId && kalimahAudioRef.current) {
      kalimahAudioRef.current.pause();
      setPlayingKalimahId(null);
    }

    if (sanaPlaying) {
      sanaAudioRef.current.pause();
      setSanaPlaying(false);
    } else {
      sanaAudioRef.current.src = "/audio/sana/sana.mp3";
      sanaAudioRef.current.load();
      sanaAudioRef.current.play()
        .then(() => setSanaPlaying(true))
        .catch(err => console.error("Sana play failed", err));
    }
  };

  // Kalimah playback trigger
  const toggleKalimah = (id: number) => {
    if (!kalimahAudioRef.current) return;

    // Stop other audios if playing
    if (azanPlaying && azanAudioRef.current) {
      azanAudioRef.current.pause();
      setAzanPlaying(false);
    }
    if (ayatulKursiPlaying && ayatulKursiAudioRef.current) {
      ayatulKursiAudioRef.current.pause();
      setAyatulKursiPlaying(false);
    }
    if (sanaPlaying && sanaAudioRef.current) {
      sanaAudioRef.current.pause();
      setSanaPlaying(false);
    }

    if (playingKalimahId === id) {
      kalimahAudioRef.current.pause();
      setPlayingKalimahId(null);
    } else {
      kalimahAudioRef.current.src = `/audio/kalimah/kalimah${id}.mp3`;
      kalimahAudioRef.current.load();
      kalimahAudioRef.current.play()
        .then(() => setPlayingKalimahId(id))
        .catch(err => console.error(`Kalimah ${id} play failed`, err));
    }
  };

  const getAzanUrl = (key: string) => {
    if (key.startsWith("local-")) {
      const filename = key.replace("local-", "");
      return `/audio/adhan/${filename}`;
    }
    switch (key) {
      case "nafees":
        return "https://cdn.aladhan.com/audio/adhans/a1.mp3";
      case "ozcan":
        return "https://cdn.aladhan.com/audio/adhans/a2.mp3";
      case "jenkins":
        return "https://cdn.aladhan.com/audio/adhans/a3.mp3";
      case "alafasy-a4":
        return "https://cdn.aladhan.com/audio/adhans/a4.mp3";
      case "alafasy-a7":
        return "https://cdn.aladhan.com/audio/adhans/a7.mp3";
      case "zahrani":
        return "https://cdn.aladhan.com/audio/adhans/a11-mansour-al-zahrani.mp3";
      case "fajr-f1":
        return "https://cdn.aladhan.com/audio/adhans/fajr/f1.mp3";
      case "fajr-zahrani":
        return "https://cdn.aladhan.com/audio/adhans/fajr/f2-mansour-al-zahrani.mp3";
      case "alafasy-a9":
      default:
        return "https://cdn.aladhan.com/audio/adhans/a9.mp3";
    }
  };

  // Handle azan source change
  useEffect(() => {
    if (azanPlaying && azanAudioRef.current) {
      azanAudioRef.current.pause();
      azanAudioRef.current.src = getAzanUrl(selectedAzan);
      azanAudioRef.current.load();
      azanAudioRef.current.play().catch(() => setAzanPlaying(false));
    }
  }, [selectedAzan]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (ayatulKursiAudioRef.current) ayatulKursiAudioRef.current.pause();
      if (azanAudioRef.current) azanAudioRef.current.pause();
      if (sanaAudioRef.current) sanaAudioRef.current.pause();
      if (kalimahAudioRef.current) kalimahAudioRef.current.pause();
    };
  }, []);

  // Global search across all content types
  const q = searchQuery.toLowerCase().trim();

  const filteredTasbih = TASBIH_AZKAR.filter(a =>
    !q ||
    a.transliteration.toLowerCase().includes(q) ||
    a.english.toLowerCase().includes(q) ||
    a.bangla.includes(q) ||
    a.arabic.includes(q)
  );

  const filteredNames = ALLAH_NAMES.filter(name =>
    !q ||
    name.transliteration.toLowerCase().includes(q) ||
    name.english.toLowerCase().includes(q) ||
    name.bangla.includes(q) ||
    name.id.toString() === q
  );

  const filteredKalimas = KALIMAS.filter(k =>
    !q ||
    (k.title || "").toLowerCase().includes(q) ||
    k.transliteration.toLowerCase().includes(q) ||
    k.english.toLowerCase().includes(q) ||
    k.bangla.includes(q)
  );

  // Share a card's content
  const handleShare = (type: string, id: string | number, text: string, arabic: string) => {
    const shareText = `${arabic}\n\n${text}\n\nhttps://tilawa-app.vercel.app/dua-remembrance`;
    if (navigator.share) {
      navigator.share({ title: `Tilawa App — ${type}`, text: shareText }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedId(`${type}-${id}`);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-10 animate-fade-in-up">
      {/* Decorative Title Banner */}
      <div className="text-center space-y-3 py-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100/50 dark:border-rose-900/30 text-xs font-bold tracking-wide uppercase">
          <Heart className="h-3.5 w-3.5 fill-current" />
          <span>Remembrance of Allah (Dhikr & Supplications)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Dua & Remembrance
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Recite the 99 names of Allah, perform Tasbihat, learn the Six Kalimas, and listen to Ayatul Kursi and the Azan.
        </p>
      </div>
      {/* ── Global Search Bar (before tabs) ── */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Tasbih, Names of Allah, Kalimas, Dua…"
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto gap-2 sm:gap-6 no-scrollbar">
        <button
          onClick={() => setActiveTab("tasbih")}
          className={`pb-4 text-sm font-bold border-b-2 px-1 whitespace-nowrap transition-all duration-200 ${
            activeTab === "tasbih"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
          }`}
        >
          Tasbih & 99 Names
        </button>
        <button
          onClick={() => setActiveTab("kalimah")}
          className={`pb-4 text-sm font-bold border-b-2 px-1 whitespace-nowrap transition-all duration-200 ${
            activeTab === "kalimah"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
          }`}
        >
          Six Kalimah
        </button>
        <button
          onClick={() => setActiveTab("sana")}
          className={`pb-4 text-sm font-bold border-b-2 px-1 whitespace-nowrap transition-all duration-200 ${
            activeTab === "sana"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
          }`}
        >
          Sana & Ayatul Kursi
        </button>
        <button
          onClick={() => setActiveTab("azan")}
          className={`pb-4 text-sm font-bold border-b-2 px-1 whitespace-nowrap transition-all duration-200 ${
            activeTab === "azan"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
          }`}
        >
          Azan (Call to Prayer)
        </button>
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        {/* TAB 1: TASBIH & 99 NAMES */}
        {activeTab === "tasbih" && (
          <div className="space-y-10">
            {/* Tasbih/Azkar counter section */}
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  📿
                </span>
                Interactive Tasbih Azkar
              </h2>
              
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredTasbih.map((azkar) => {
                  const count = counts[azkar.id] || 0;
                  const isGoalReached = count >= azkar.recommendedCount;
                  
                  return (
                    <div 
                      key={azkar.id}
                      className={`relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200 ${
                        isGoalReached 
                          ? "bg-emerald-50/20 border-emerald-200/60 dark:bg-emerald-950/5 dark:border-emerald-900/30" 
                          : "bg-white border-zinc-200/70 hover:shadow-md dark:bg-zinc-900/60 dark:border-zinc-850"
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                            Target: {azkar.recommendedCount}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {isGoalReached && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                <Sparkles className="h-3 w-3 animate-pulse" />
                                Done!
                              </span>
                            )}
                            <button
                              onClick={() => handleShare("Tasbih", azkar.id, `${azkar.transliteration} — ${azkar.english}\n${azkar.bangla}`, azkar.arabic)}
                              className="flex h-6 w-6 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                              title="Share"
                            >
                              {copiedId === `Tasbih-${azkar.id}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Share2 className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                        </div>
                        <p className="text-right text-2xl font-bold text-zinc-800 dark:text-zinc-100 font-amiri leading-normal">
                          {azkar.arabic}
                        </p>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 italic">
                            {azkar.transliteration}
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {azkar.english}
                          </p>
                          <p className="text-xs text-zinc-600 dark:text-zinc-300 font-semibold">
                            {azkar.bangla}
                          </p>
                        </div>
                      </div>

                      {/* Tactile Counter Widget */}
                      <div className="mt-5 flex items-center justify-between gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
                        {/* Circular Interactive Click Button */}
                        <button
                          onClick={() => handleIncrement(azkar.id)}
                          className="flex-1 flex h-11 items-center justify-between px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm active:scale-[0.98] transition-transform duration-75 shadow-xs shadow-emerald-500/10"
                        >
                          <span>Tap Count</span>
                          <span className="bg-emerald-700/50 px-2.5 py-0.5 rounded-lg text-xs leading-none">
                            {count}
                          </span>
                        </button>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDecrement(azkar.id)}
                            disabled={count === 0}
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 active:scale-95 transition-all"
                            title="Subtract 1"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleReset(azkar.id)}
                            disabled={count === 0}
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 active:scale-95 transition-all"
                            title="Reset counter"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Asmaul Husna section */}
            <div className="space-y-6 pt-4 border-t border-zinc-200 dark:border-zinc-850">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold text-xs">
                  ✨
                </span>
                Asmaul Husna (99 Names of Allah)
              </h2>

              {filteredNames.length === 0 ? (
                <div className="text-center py-10 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 text-sm">
                  No names match your search query.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-3">
                  {filteredNames.map((name) => (
                    <div 
                      key={name.id}
                      className="bg-white/50 border border-zinc-200/60 dark:bg-zinc-900/40 dark:border-zinc-850/60 rounded-xl p-4.5 flex flex-col justify-between gap-3 hover:shadow-xs transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold">
                          #{name.id}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-amiri">
                            {name.arabic}
                          </span>
                          <button
                            onClick={() => handleShare("AllahName", name.id, `${name.transliteration} — ${name.english} (${name.bangla})`, name.arabic)}
                            className="flex h-6 w-6 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                            title="Share"
                          >
                            {copiedId === `AllahName-${name.id}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Share2 className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-extrabold text-zinc-800 dark:text-zinc-200 leading-none">
                          {name.transliteration}
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {name.english}
                        </p>
                        <p className="text-xs text-zinc-655 dark:text-zinc-300 font-medium">
                          {name.bangla}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SIX KALIMAH */}
        {activeTab === "kalimah" && (
          <div className="space-y-4 max-w-3xl mx-auto">
            {filteredKalimas.map((k) => {
              const isExpanded = expandedKalima === k.id;
              return (
                <div 
                  key={k.id}
                  className="bg-white border border-zinc-200/70 rounded-2xl overflow-hidden dark:bg-zinc-900/60 dark:border-zinc-850 transition-all hover:border-zinc-300/80 dark:hover:border-zinc-800"
                >
                  <button
                    onClick={() => setExpandedKalima(isExpanded ? null : k.id)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-zinc-800 dark:text-zinc-200 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-850/30"
                  >
                    <span>{k.title}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleShare("Kalima", k.id, `${k.title}\n${k.transliteration}\n${k.english}`, k.arabic); }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                        title="Share"
                      >
                        {copiedId === `Kalima-${k.id}` ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Share2 className="h-3.5 w-3.5" />}
                      </button>
                      {isExpanded ? (
                        <ChevronUp className="h-4.5 w-4.5 text-zinc-400" />
                      ) : (
                        <ChevronDown className="h-4.5 w-4.5 text-zinc-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-5 border-t border-zinc-100 dark:border-zinc-800/80 space-y-5 bg-zinc-50/10 dark:bg-zinc-900/20">
                      {/* Playback & Arabic recitation card */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/30 border border-zinc-100 dark:border-zinc-900">
                          <div className="flex items-center gap-2 text-xs">
                            <Volume2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            {localAudios.kalimah.includes(`kalimah${k.id}.mp3`) ? (
                              <span className="font-semibold text-zinc-650 dark:text-zinc-300">
                                Local audio recording found
                              </span>
                            ) : (
                              <span className="text-zinc-400">
                                No audio found (place recording at <code className="bg-zinc-105 dark:bg-zinc-800 px-1 py-0.5 rounded text-[10px]">public/audio/kalimah/kalimah{k.id}.mp3</code>)
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => toggleKalimah(k.id)}
                            disabled={!localAudios.kalimah.includes(`kalimah${k.id}.mp3`)}
                            className={`flex h-8 px-3 items-center gap-1.5 rounded-lg font-bold text-xs transition-all ${
                              playingKalimahId === k.id
                                ? "bg-rose-500 text-white animate-pulse"
                                : "bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-40 disabled:hover:bg-emerald-500 disabled:scale-100 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                            }`}
                            title={playingKalimahId === k.id ? "Pause local recording" : "Play local recording"}
                          >
                            {playingKalimahId === k.id ? (
                              <>
                                <Pause className="h-3.5 w-3.5 fill-current" />
                                <span>Pause</span>
                              </>
                            ) : (
                              <>
                                <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                                <span>Play Recording</span>
                              </>
                            )}
                          </button>
                        </div>

                        <p className="text-right text-2xl font-bold text-zinc-900 dark:text-white leading-loose font-amiri tracking-wide select-all bg-white/40 dark:bg-zinc-950/20 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-900">
                          {k.arabic}
                        </p>
                      </div>

                      <div className="space-y-4 pt-2">
                        {/* Pronunciation */}
                        <div className="space-y-1">
                          <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                            Transliteration (Pronunciation)
                          </h4>
                          <p className="text-sm font-bold text-zinc-755 dark:text-zinc-250 italic">
                            {k.transliteration}
                          </p>
                        </div>

                        {/* Translation English */}
                        <div className="space-y-1 border-t border-zinc-100 dark:border-zinc-850/60 pt-3">
                          <h4 className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                            English Translation
                          </h4>
                          <p className="text-xs text-zinc-600 dark:text-zinc-350 leading-relaxed">
                            {k.english}
                          </p>
                        </div>

                        {/* Translation Bangla */}
                        <div className="space-y-1 border-t border-zinc-100 dark:border-zinc-850/60 pt-3">
                          <h4 className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                            Bangla Translation
                          </h4>
                          <p className="text-xs text-zinc-700 dark:text-zinc-250 leading-relaxed font-semibold">
                            {k.bangla}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <audio
              ref={kalimahAudioRef}
              onEnded={() => setPlayingKalimahId(null)}
              onError={() => setPlayingKalimahId(null)}
              preload="none"
            />
          </div>
        )}

        {/* TAB 3: SANA & AYATUL KURSI */}
        {activeTab === "sana" && (
          <div className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
            {/* Sana al-Istiftah */}
            <div className="bg-white border border-zinc-200/70 p-6 rounded-2xl dark:bg-zinc-900/60 dark:border-zinc-850 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🤲</span>
                    <h3 className="font-bold text-zinc-950 dark:text-white text-base">
                      Sana (Opening Supplication)
                    </h3>
                  </div>

                  <button
                    onClick={toggleSana}
                    disabled={!localAudios.sana.includes("sana.mp3")}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg shadow-xs transition-all ${
                      sanaPlaying
                        ? "bg-rose-500 text-white animate-pulse"
                        : "bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-40 disabled:hover:bg-emerald-500 disabled:scale-100 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                    }`}
                    title={
                      !localAudios.sana.includes("sana.mp3")
                        ? "Add sana.mp3 to public/audio/sana/ to play"
                        : sanaPlaying
                        ? "Pause recording"
                        : "Listen to recording"
                    }
                  >
                    {sanaPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
                  </button>
                </div>
                
                <p className="text-right text-xl font-bold text-zinc-900 dark:text-white leading-loose font-amiri p-4 bg-zinc-50/30 dark:bg-zinc-950/20 rounded-xl">
                  {SANA.arabic}
                </p>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-zinc-400">Transliteration</span>
                    <p className="font-bold text-zinc-700 dark:text-zinc-300 italic">{SANA.transliteration}</p>
                  </div>
                  <div className="space-y-0.5 border-t border-zinc-100 dark:border-zinc-850/60 pt-2">
                    <span className="text-[9px] uppercase font-bold text-emerald-600 dark:text-emerald-400">English</span>
                    <p className="text-zinc-500 dark:text-zinc-400">{SANA.english}</p>
                  </div>
                  <div className="space-y-0.5 border-t border-zinc-100 dark:border-zinc-850/60 pt-2">
                    <span className="text-[9px] uppercase font-bold text-teal-600 dark:text-teal-400">Bangla</span>
                    <p className="text-zinc-700 dark:text-zinc-300 font-semibold">{SANA.bangla}</p>
                  </div>
                </div>
              </div>
              
              <audio
                ref={sanaAudioRef}
                src="/audio/sana/sana.mp3"
                onEnded={() => setSanaPlaying(false)}
                onError={() => setSanaPlaying(false)}
                preload="none"
              />

              <div className="space-y-2 mt-6">
                {!localAudios.sana.includes("sana.mp3") && (
                  <p className="text-[9px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-3 py-1.5 rounded-lg border border-amber-100/50 dark:border-amber-900/30">
                    💡 <strong>Recording Tip:</strong> Record your recitation as <code>sana.mp3</code> and place it in <code>public/audio/sana/</code> to play it here.
                  </p>
                )}
                <div className="text-[10px] text-zinc-400 dark:text-zinc-500 italic flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-950/20 px-3 py-2 rounded-lg">
                  <HelpCircle className="h-3.5 w-3.5 shrink-0" />
                  Recited silently at the very beginning of prayer (Salah) before reciting Al-Fatiha.
                </div>
              </div>
            </div>

            {/* Ayatul Kursi */}
            <div className="bg-white border border-zinc-200/70 p-6 rounded-2xl dark:bg-zinc-900/60 dark:border-zinc-850 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">👑</span>
                    <h3 className="font-bold text-zinc-950 dark:text-white text-base">
                      Ayatul Kursi (Verse of the Throne)
                    </h3>
                  </div>

                  {/* Playback Controls */}
                  <button
                    onClick={toggleAyatulKursi}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg shadow-xs transition-all ${
                      ayatulKursiPlaying 
                        ? "bg-rose-500 text-white animate-pulse" 
                        : "bg-emerald-500 hover:bg-emerald-600 text-white active:scale-95"
                    }`}
                    title={ayatulKursiPlaying ? "Pause recitation" : "Listen to recitation"}
                  >
                    {ayatulKursiPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
                  </button>
                </div>
                
                <p className="text-right text-lg font-bold text-zinc-900 dark:text-white leading-loose font-amiri p-4 bg-zinc-50/30 dark:bg-zinc-950/20 rounded-xl max-h-56 overflow-y-auto custom-scrollbar">
                  {AYATUL_KURSI.arabic}
                </p>

                <div className="space-y-3 pt-2 text-xs max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-zinc-400">Transliteration</span>
                    <p className="font-bold text-zinc-700 dark:text-zinc-300 italic leading-relaxed">{AYATUL_KURSI.transliteration}</p>
                  </div>
                  <div className="space-y-0.5 border-t border-zinc-100 dark:border-zinc-850/60 pt-2">
                    <span className="text-[9px] uppercase font-bold text-emerald-600 dark:text-emerald-400">English</span>
                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">{AYATUL_KURSI.english}</p>
                  </div>
                  <div className="space-y-0.5 border-t border-zinc-100 dark:border-zinc-850/60 pt-2">
                    <span className="text-[9px] uppercase font-bold text-teal-600 dark:text-teal-400">Bangla</span>
                    <p className="text-zinc-700 dark:text-zinc-300 font-semibold leading-relaxed">{AYATUL_KURSI.bangla}</p>
                  </div>
                </div>
              </div>

              <audio
                ref={ayatulKursiAudioRef}
                src="https://cdn.islamic.network/quran/audio/128/ar.alafasy/262.mp3"
                onEnded={() => setAyatulKursiPlaying(false)}
                onError={() => setAyatulKursiPlaying(false)}
                preload="none"
              />

              <div className="text-[10px] text-zinc-400 dark:text-zinc-500 italic mt-6 flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-950/20 px-3 py-2 rounded-lg">
                <HelpCircle className="h-3.5 w-3.5 shrink-0" />
                Ayah 255 of Surah Al-Baqarah. Recited by Mishary Rashid Alafasy.
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AZAN */}
        {activeTab === "azan" && (
          <div className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
            {/* Azan translation and list */}
            <div className="bg-white border border-zinc-200/70 p-6 rounded-2xl dark:bg-zinc-900/60 dark:border-zinc-850 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <Music className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-bold text-zinc-950 dark:text-white text-base">
                    Adhan Arabic Text & Transliteration
                  </h3>
                </div>
              </div>

              <div className="space-y-4 divide-y divide-zinc-100 dark:divide-zinc-850/60 max-h-128 overflow-y-auto pr-2 custom-scrollbar">
                {AZAN_PHRASES.map((item, idx) => (
                  <div key={idx} className={`pt-3 flex flex-col gap-1.5 ${idx === 0 ? "pt-0" : ""}`}>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-sm">
                        x{item.count}
                      </span>
                      <p className="text-xl font-bold text-zinc-900 dark:text-white font-amiri">
                        {item.phrase}
                      </p>
                    </div>
                    <div className="space-y-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                      <p className="font-bold text-zinc-700 dark:text-zinc-300 italic">{item.transliteration}</p>
                      <p>{item.english}</p>
                      <p className="text-zinc-700 dark:text-zinc-300 font-semibold">{item.bangla}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Azan audio player and significance */}
            <div className="bg-white border border-zinc-200/70 p-6 rounded-2xl dark:bg-zinc-900/60 dark:border-zinc-850 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <Volume2 className="h-4.5 w-4.5 text-rose-500" />
                  <h3 className="font-bold text-zinc-950 dark:text-white text-base">
                    Listen to Call to Prayer
                  </h3>
                </div>

                {/* Audio Custom Player Box */}
                <div className="p-5 bg-zinc-50/60 border border-zinc-150 rounded-2xl dark:bg-zinc-950/20 dark:border-zinc-900/60 flex flex-col gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                      Select Muezzin (Adhan Location)
                    </label>
                    <select
                      value={selectedAzan}
                      onChange={(e) => setSelectedAzan(e.target.value)}
                      className="w-full pl-3 pr-8 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 text-xs font-bold text-zinc-700 dark:text-zinc-300 focus:outline-hidden focus:ring-1 focus:ring-emerald-500/30 cursor-pointer"
                    >
                      <option value="alafasy-a9">Adhan by Mishary Rashid Alafasy (Yet Another Version)</option>
                      <option value="nafees">Adhan by Ahmad al-Nafees</option>
                      <option value="ozcan">Adhan by Hafiz Mustafa Özcan (Turkey)</option>
                      <option value="alafasy-a4">Adhan from Dubai's One TV (Mishary Rashid Alafasy)</option>
                      <option value="alafasy-a7">Adhan by Mishary Rashid Alafasy</option>
                      <option value="zahrani">Adhan by Mansour Al-Zahrani</option>
                      <option value="fajr-f1">Fajr Adhan (Standard with As-salatu khayrun minan-nawm)</option>
                      <option value="fajr-zahrani">Fajr Adhan by Mansour Al-Zahrani</option>
                      <option value="jenkins">Adhan from Karl Jenkins' Mass for Peace</option>
                      {localAudios.adhan.map((file) => (
                        <option key={`local-${file}`} value={`local-${file}`}>
                          Local Recording: {file}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={toggleAzan}
                    className={`w-full flex h-12 items-center justify-center gap-2 rounded-xl text-white font-extrabold shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all ${
                      azanPlaying 
                        ? "bg-rose-500 hover:bg-rose-600 animate-pulse" 
                        : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/10"
                    }`}
                  >
                    {azanPlaying ? (
                      <>
                        <Pause className="h-4 w-4 fill-current" />
                        <span>Stop Audio Adhan</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 fill-current ml-0.5" />
                        <span>Play Audio Adhan</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Details text */}
                <div className="space-y-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  <h4 className="font-bold text-zinc-800 dark:text-zinc-300">
                    Significance & Virtues:
                  </h4>
                  <p>
                    The Adhan is a call to summon Muslims for congregational prayers. The Prophet Muhammad (ﷺ) said: 
                    <span className="block font-medium text-zinc-700 dark:text-zinc-350 italic mt-1 bg-zinc-55/10 dark:bg-zinc-950/20 p-2.5 rounded-lg">
                      &quot;When the Adhan is pronounced, Satan takes to his heels...&quot; (Bukhari)
                    </span>
                  </p>
                  <p className="mt-2">
                    Listening carefully, repeating the phrases, and reciting the Dua after Adhan are highly rewarded acts in Islam.
                  </p>
                </div>
              </div>

              <audio
                ref={azanAudioRef}
                src={getAzanUrl(selectedAzan)}
                onEnded={() => setAzanPlaying(false)}
                onError={() => setAzanPlaying(false)}
                preload="none"
              />

              <div className="text-[10px] text-zinc-400 dark:text-zinc-500 italic mt-6 flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-950/20 px-3 py-2 rounded-lg">
                <HelpCircle className="h-3.5 w-3.5 shrink-0" />
                Azan audio streaming via AlAdhan CDN (Islamic Network).
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
