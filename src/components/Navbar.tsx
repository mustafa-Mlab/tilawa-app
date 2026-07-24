"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { BookOpen, Settings, Sliders, Type, Check, Bookmark, Languages, Music, Play, Repeat, Heart, Share2 } from "lucide-react";
import { useQuran, RECITERS } from "@/context/QuranContext";
import { ThemeToggle } from "./ThemeToggle";
import { NavSearchBar } from "./NavSearchBar";

export function Navbar() {
  const {
    arabicFontSize,
    setArabicFontSize,
    translationFontSize,
    setTranslationFontSize,
    tafsirFontSize,
    setTafsirFontSize,
    showEnglish,
    setShowEnglish,
    showBangla,
    setShowBangla,
    bookmarks,
    reciter,
    setReciter,
    autoplayNext,
    setAutoplayNext,
    loop,
    setLoop,
    playEnglishAudio,
    setPlayEnglishAudio,
  } = useQuran();

  const pathname = usePathname();
  const isRouteActive = (path: string) => pathname === path;

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/50 bg-white/70 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-950/70 transition-all duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Branding Logo & Navigation Wrapper */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group hover:opacity-90 transition-opacity">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="h-5.5 w-5.5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white leading-none">
                Tilawa App
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                Read & Listen Quran
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-50 dark:bg-zinc-900/60 p-1 rounded-xl border border-zinc-250/30 dark:border-zinc-800/30">
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                isRouteActive("/")
                  ? "bg-white text-emerald-600 shadow-xs dark:bg-zinc-800 dark:text-emerald-400"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Quran</span>
            </Link>
            <Link
              href="/dua-remembrance"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                isRouteActive("/dua-remembrance")
                  ? "bg-white text-emerald-600 shadow-xs dark:bg-zinc-800 dark:text-emerald-400"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              <Heart className="h-3.5 w-3.5" />
              <span>Dua & Remembrance</span>
            </Link>
          </nav>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          {/* Settings Panel Trigger */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 ${
                isOpen
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400"
                  : "bg-white/80 border-zinc-200/80 text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900/80 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
              } shadow-xs hover:scale-105 active:scale-95`}
              aria-label="Settings"
              id="settings-toggle-btn"
            >
              <Settings className={`h-5 w-5 ${isOpen ? "animate-spin-slow" : ""}`} />
            </button>

            {/* Settings Dropdown Card */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-76 origin-top-right rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xl ring-1 ring-black/5 dark:border-zinc-800 dark:bg-zinc-900 focus:outline-hidden transform scale-100 opacity-100 transition-all duration-200 z-50">
                <div className="flex items-center gap-2 border-b border-zinc-100 pb-3 dark:border-zinc-800 mb-4">
                  <Sliders className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-semibold text-zinc-900 dark:text-white text-sm">
                    Reading Settings
                  </h3>
                </div>

                {/* Font Sizes */}
                <div className="space-y-4">
                  {/* Arabic Size Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
                        <Type className="h-3.5 w-3.5" />
                        Arabic Font Size
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{arabicFontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="24"
                      max="56"
                      step="2"
                      value={arabicFontSize}
                      onChange={(e) => setArabicFontSize(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer dark:bg-zinc-800 accent-emerald-500 dark:accent-emerald-400"
                    />
                  </div>

                  {/* Translation Size Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
                        <Type className="h-3.5 w-3.5" />
                        Translation Size
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{translationFontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="28"
                      step="1"
                      value={translationFontSize}
                      onChange={(e) => setTranslationFontSize(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer dark:bg-zinc-800 accent-emerald-500 dark:accent-emerald-400"
                    />
                  </div>

                  {/* Tafsir Size Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
                        <Type className="h-3.5 w-3.5" />
                        Tafsir Size
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{tafsirFontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="24"
                      step="1"
                      value={tafsirFontSize}
                      onChange={(e) => setTafsirFontSize(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer dark:bg-zinc-800 accent-emerald-500 dark:accent-emerald-400"
                    />
                  </div>

                  {/* Languages Display */}
                  <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="flex items-center gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">
                      <Languages className="h-3.5 w-3.5" />
                      Active Translations
                    </span>

                    {/* English Toggle */}
                    <button
                      onClick={() => setShowEnglish(!showEnglish)}
                      className="flex w-full items-center justify-between rounded-lg p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-left text-sm font-medium transition-colors"
                    >
                      <span className="text-zinc-700 dark:text-zinc-300">English (Sahih Intl)</span>
                      <div className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all ${
                        showEnglish
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-zinc-300 dark:border-zinc-700"
                      }`}>
                        {showEnglish && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>
                    </button>

                    {/* Bangla Toggle */}
                    <button
                      onClick={() => setShowBangla(!showBangla)}
                      className="flex w-full items-center justify-between rounded-lg p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-left text-sm font-medium transition-colors"
                    >
                      <span className="text-zinc-700 dark:text-zinc-300">Bangla (Muhiuddin Khan)</span>
                      <div className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all ${
                        showBangla
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-zinc-300 dark:border-zinc-700"
                      }`}>
                        {showBangla && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  </div>

                  {/* Tilawat Settings Section */}
                  <div className="flex items-center gap-2 border-b border-zinc-100 pb-3 dark:border-zinc-800 mb-4 mt-6">
                    <Music className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="font-semibold text-zinc-900 dark:text-white text-sm">
                      Tilawat Settings
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Reciter dropdown list */}
                    <div className="space-y-1.5">
                      <span className="flex items-center gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Reciter
                      </span>
                      <div className="relative">
                        <select
                          value={reciter}
                          onChange={(e) => setReciter(e.target.value)}
                          className="w-full pl-3 pr-8 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 text-xs font-semibold text-zinc-700 dark:text-zinc-300 focus:outline-hidden focus:ring-1 focus:ring-emerald-500/30 cursor-pointer appearance-none"
                        >
                          {RECITERS.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.englishName}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-[8px] font-bold">
                          ▼
                        </div>
                      </div>
                    </div>

                    {/* Playback Toggles */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      {/* Autoplay Toggle */}
                      <button
                        onClick={() => setAutoplayNext(!autoplayNext)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                          autoplayNext
                            ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-400"
                            : "border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                        }`}
                        title="Autoplay next verse"
                      >
                        <Play className="h-4 w-4 mb-1" />
                        <span>Autoplay</span>
                      </button>

                      {/* Loop Toggle */}
                      <button
                        onClick={() => setLoop(!loop)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                          loop
                            ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-400"
                            : "border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                        }`}
                        title="Loop playback"
                      >
                        <Repeat className="h-4 w-4 mb-1" />
                        <span>Loop</span>
                      </button>
                    </div>

                    {/* Audio Translation Toggle */}
                    <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Translation Voice
                      </span>
                      
                      {/* Play English Audio Toggle */}
                      <button
                        onClick={() => setPlayEnglishAudio(!playEnglishAudio)}
                        className="flex w-full items-center justify-between rounded-lg p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-left text-sm font-medium transition-colors"
                      >
                        <span className="text-zinc-700 dark:text-zinc-300">Play English (Human Voice)</span>
                        <div className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all ${
                          playEnglishAudio
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "border-zinc-300 dark:border-zinc-700"
                        }`}>
                          {playEnglishAudio && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bookmarks Counter Badge */}
          {bookmarks.length > 0 && (
            <div className="flex h-10 px-3 items-center gap-1.5 rounded-xl border border-rose-200/80 bg-rose-50/50 dark:border-rose-950/30 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-semibold text-sm">
              <Bookmark className="h-4.5 w-4.5 fill-current" />
              <span>{bookmarks.length}</span>
            </div>
          )}

          {/* Dark Mode Switcher */}
          <NavSearchBar />

          {/* Share App Button */}
          <button
            onClick={() => {
              const url = typeof window !== "undefined" ? window.location.origin : "https://tilawa-app.vercel.app";
              if (navigator.share) {
                navigator.share({ title: "Tilawa App — Read & Listen Quran", url }).catch(() => {});
              } else {
                navigator.clipboard.writeText(url);
              }
            }}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200/80 bg-white/80 text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-900/80 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 shadow-xs hover:scale-105 active:scale-95 transition-all"
            aria-label="Share App"
            title="Share this app"
          >
            <Share2 className="h-4.5 w-4.5" />
          </button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
