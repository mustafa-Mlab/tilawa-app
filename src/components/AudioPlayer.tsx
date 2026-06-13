"use client";

import { useQuran, RECITERS } from "@/context/QuranContext";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  X,
  Gauge,
  User,
  RefreshCw,
  Repeat,
} from "lucide-react";
import { useState } from "react";

export function AudioPlayer() {
  const {
    currentSurahName,
    currentAyahNumberInSurah,
    isPlaying,
    reciter,
    setReciter,
    playbackRate,
    setPlaybackRate,
    volume,
    setVolume,
    progress,
    duration,
    currentTime,
    autoplayNext,
    setAutoplayNext,
    loop,
    setLoop,
    pauseAudio,
    resumeAudio,
    stopAudio,
    seekTo,
    skipNext,
    skipPrev,
  } = useQuran();

  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.8);

  // If no ayah is loaded, don't show the player
  if (currentAyahNumberInSurah === null) return null;

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      resumeAudio();
    }
  };

  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      setVolume(prevVolume);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickRatio = clickX / width;
    seekTo(clickRatio * duration);
  };

  const activeReciter = RECITERS.find((r) => r.id === reciter) || RECITERS[0];

  // Inline duration formatting
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "00:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 max-w-7xl mx-auto border border-zinc-200/50 bg-white/85 shadow-2xl dark:border-zinc-800/60 dark:bg-zinc-950/85 backdrop-blur-xl rounded-2xl flex flex-col transition-all duration-300 transform translate-y-0 animate-fade-in-up">
      {/* Progress Bar (Clickable) */}
      <div
        className="w-full h-1.5 bg-zinc-150 dark:bg-zinc-800 rounded-t-2xl overflow-hidden cursor-pointer relative group"
        onClick={handleProgressBarClick}
      >
        <div
          className="h-full bg-emerald-500 dark:bg-emerald-400 group-hover:bg-emerald-400 transition-all"
          style={{ width: `${progress}%` }}
        />
        {/* Glow point */}
        <div
          className="absolute h-3 w-3 rounded-full bg-emerald-600 dark:bg-emerald-400 -top-0.75 hidden group-hover:block transition-all shadow-md"
          style={{ left: `calc(${progress}% - 6px)` }}
        />
      </div>

      {/* Main Controls Panel */}
      <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Side: Active Ayah Info */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <RefreshCw className={`h-5 w-5 ${isPlaying ? "animate-spin-slow" : ""}`} />
          </div>
          <div className="flex flex-col text-left">
            <h4 className="font-bold text-zinc-900 dark:text-white text-sm">
              Surah {currentSurahName}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Ayah {currentAyahNumberInSurah}
              </span>
              <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                <User className="h-3 w-3" />
                {activeReciter.englishName}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Playback Buttons & Time */}
        <div className="flex items-center gap-4">
          {/* Timestamps */}
          <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
            {formatTime(currentTime)}
          </span>

          <div className="flex items-center gap-2.5">
            {/* Skip Prev */}
            <button
              onClick={skipPrev}
              className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-all active:scale-95"
              title="Previous Ayah"
            >
              <SkipBack className="h-4.5 w-4.5 fill-current" />
            </button>

            {/* Play/Pause Main Button */}
            <button
              onClick={handlePlayPause}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 fill-current stroke-[2.5]" />
              ) : (
                <Play className="h-5 w-5 fill-current stroke-[2.5] pl-0.5" />
              )}
            </button>

            {/* Skip Next */}
            <button
              onClick={skipNext}
              className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-all active:scale-95"
              title="Next Ayah"
            >
              <SkipForward className="h-4.5 w-4.5 fill-current" />
            </button>
          </div>

          <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
            {formatTime(duration)}
          </span>
        </div>

        {/* Right Side: Options & Audio settings */}
        <div className="flex items-center justify-between md:justify-end gap-3 md:gap-4 w-full md:w-auto border-t md:border-t-0 border-zinc-100 pt-3 md:pt-0 dark:border-zinc-800/40">
          {/* Reciter dropdown list */}
          <div className="relative hidden xl:block">
            <select
              value={reciter}
              onChange={(e) => setReciter(e.target.value)}
              className="pl-2 pr-6 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 text-xs font-semibold text-zinc-700 dark:text-zinc-300 focus:outline-hidden focus:ring-1 focus:ring-emerald-500/30 cursor-pointer appearance-none"
            >
              {RECITERS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.englishName}
                </option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-[9px] font-bold">
              ▼
            </div>
          </div>

          {/* Autoplay Next Toggle */}
          <button
            onClick={() => setAutoplayNext(!autoplayNext)}
            className={`flex h-9.5 px-2.5 xl:px-3 items-center gap-1.5 rounded-lg border text-xs font-bold transition-all ${
              autoplayNext
                ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-400"
                : "border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400"
            }`}
            title="Autoplay next verse"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${autoplayNext && isPlaying ? "animate-spin-slow" : ""}`} />
            <span className="hidden xl:inline">Autoplay</span>
          </button>

          {/* Loop Toggle */}
          <button
            onClick={() => setLoop(!loop)}
            className={`flex h-9.5 px-2.5 xl:px-3 items-center gap-1.5 rounded-lg border text-xs font-bold transition-all ${
              loop
                ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-400"
                : "border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400"
            }`}
            title="Loop playback"
          >
            <Repeat className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">Loop</span>
          </button>

          {/* Speed settings selector */}
          <div className="relative">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="flex h-9.5 w-9.5 items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-all"
              title="Playback speed"
            >
              <Gauge className="h-4.5 w-4.5" />
            </button>

            {showSpeedMenu && (
              <div className="absolute bottom-10 right-0 mb-1 w-24 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 z-50">
                {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => {
                      setPlaybackRate(rate);
                      setShowSpeedMenu(false);
                    }}
                    className={`w-full text-left px-2 py-1 text-xs rounded-sm font-semibold transition-all ${
                      playbackRate === rate
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                        : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/40"
                    }`}
                  >
                    {rate === 1.0 ? "Normal" : `${rate}x`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Volume Control (hidden on mobile, uses physical side buttons) */}
          <div className="hidden sm:flex items-center gap-1.5 group/vol">
            <button
              onClick={toggleMute}
              className="flex h-9.5 w-9.5 items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-all"
              title="Volume"
            >
              {volume === 0 ? <VolumeX className="h-4.5 w-4.5 text-zinc-400" /> : <Volume2 className="h-4.5 w-4.5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 md:w-20 h-1 bg-zinc-150 rounded-lg appearance-none cursor-pointer dark:bg-zinc-800 accent-emerald-500 dark:accent-emerald-400 transition-all group-hover/vol:w-20"
            />
          </div>

          {/* Close Player */}
          <button
            onClick={stopAudio}
            className="flex h-9.5 w-9.5 items-center justify-center rounded-lg border border-zinc-200/50 hover:bg-rose-50 hover:border-rose-100 hover:text-rose-600 dark:border-zinc-800 dark:hover:bg-rose-950/20 dark:hover:border-rose-900/30 dark:hover:text-rose-400 transition-all text-zinc-400"
            title="Close Player"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
