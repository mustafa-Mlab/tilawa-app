import { getSurah } from "@/lib/quran";
import { AyahCard } from "@/components/AyahCard";
import { ChevronLeft, ChevronRight, Home, Compass, BookOpen, Play } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { InitializeLastRead } from "./InitializeLastRead";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const surahId = parseInt(id, 10);
    const surah = await getSurah(surahId);
    return {
      title: `Surah ${surah.englishName} (${surah.name}) - Tilawa App`,
      description: `Read and listen to Surah ${surah.englishName} (${surah.englishNameTranslation}) translation in English and Bangla with audio recitations.`,
    };
  } catch {
    return {
      title: "Surah Reader - Tilawa App",
    };
  }
}

export default async function SurahPage({ params }: PageProps) {
  const { id } = await params;
  const surahId = parseInt(id, 10);

  if (isNaN(surahId) || surahId < 1 || surahId > 114) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-rose-500">Invalid Surah Number</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">Surah number must be between 1 and 114.</p>
        <Link href="/" className="mt-6 inline-flex items-center gap-1.5 text-emerald-600 hover:underline">
          <ChevronLeft className="h-4 w-4" /> Back to Home
        </Link>
      </div>
    );
  }

  const surah = await getSurah(surahId);
  const isMeccan = surah.revelationType === "Meccan";

  // Array of ayah structures to pass to child cards for audio player list management
  const surahAyahs = surah.ayahs.map((a) => ({
    number: a.number,
    numberInSurah: a.numberInSurah,
  }));

  // Render centered Bismillah for Surahs (except Al-Fatiha (1) and At-Tawbah (9))
  const showBismillah = surahId !== 1 && surahId !== 9;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Setup client-side last-read trigger */}
      <InitializeLastRead surahId={surah.number} surahName={surah.englishName} />

      {/* Breadcrumbs / Navigation Header */}
      <div className="flex items-center justify-between border-b border-zinc-200/50 pb-4 dark:border-zinc-800/50">
        <Link
          href="/"
          className="inline-flex h-9 px-3 items-center gap-1.5 rounded-lg border border-zinc-200/80 bg-white/80 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-all active:scale-95 shadow-xs"
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>

        {/* Next/Prev Surah Controls */}
        <div className="flex items-center gap-2">
          {surahId > 1 ? (
            <Link
              href={`/surah/${surahId - 1}`}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200/80 bg-white/80 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all active:scale-95 shadow-xs"
              title="Previous Surah"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200/40 bg-zinc-100/50 text-zinc-300 dark:border-zinc-800/40 dark:bg-zinc-900/30 dark:text-zinc-700 cursor-not-allowed opacity-50">
              <ChevronLeft className="h-5 w-5" />
            </div>
          )}

          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 px-2 select-none">
            {surahId} / 114
          </span>

          {surahId < 114 ? (
            <Link
              href={`/surah/${surahId + 1}`}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200/80 bg-white/80 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all active:scale-95 shadow-xs"
              title="Next Surah"
            >
              <ChevronRight className="h-5 w-5" />
            </Link>
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200/40 bg-zinc-100/50 text-zinc-300 dark:border-zinc-800/40 dark:bg-zinc-900/30 dark:text-zinc-700 cursor-not-allowed opacity-50">
              <ChevronRight className="h-5 w-5" />
            </div>
          )}
        </div>
      </div>

      {/* Surah Header Card (Glassmorphic look) */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-6 md:p-8 shadow-xl dark:border-zinc-800/80 dark:bg-zinc-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3.5">
            {/* Metadata Badges */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.75 rounded-md text-[10px] font-bold tracking-wide uppercase ${
                  isMeccan
                    ? "bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30"
                    : "bg-teal-50 text-teal-600 border border-teal-100 dark:bg-teal-950/20 dark:text-teal-400 dark:border-teal-900/30"
                }`}
              >
                <Compass className="h-3 w-3" />
                {surah.revelationType}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.75 rounded-md text-[10px] font-bold tracking-wide uppercase bg-zinc-50 text-zinc-500 border border-zinc-100 dark:bg-zinc-800/40 dark:text-zinc-400 dark:border-zinc-700/30">
                <BookOpen className="h-3 w-3" />
                {surah.numberOfAyahs} Verses
              </span>
            </div>

            {/* Names */}
            <div>
              <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                {surah.englishName}
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mt-1">
                {surah.englishNameTranslation}
              </p>
            </div>
          </div>

          {/* Right Side: Arabic Name & Full Recitation Play button */}
          <div className="flex flex-col items-start md:items-end gap-4">
            <span
              className="text-4xl md:text-5xl font-extrabold font-arabic text-emerald-600 dark:text-emerald-400 tracking-normal"
              dir="rtl"
            >
              {surah.name}
            </span>
          </div>
        </div>

        {/* Subtle decorative background gradient */}
        <div className="absolute right-0 bottom-0 top-0 w-64 bg-radial from-emerald-500/5 to-transparent blur-3xl pointer-events-none" />
      </div>

      {/* Bismillah Header Block */}
      {showBismillah && (
        <div className="text-center py-10" dir="rtl">
          <p className="font-arabic text-3xl font-bold text-zinc-800 dark:text-zinc-100 leading-normal select-none tracking-normal">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
        </div>
      )}

      {/* Verses List */}
      <div className="space-y-6">
        {surah.ayahs.map((ayah) => (
          <AyahCard
            key={ayah.number}
            ayah={ayah}
            surahId={surahId}
            surahName={surah.englishName}
            surahAyahs={surahAyahs}
          />
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between border-t border-zinc-200/50 pt-8 pb-12 dark:border-zinc-800/50">
        <Link
          href="/"
          className="inline-flex h-9 px-4 items-center gap-1.5 rounded-lg border border-zinc-200/80 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-all shadow-xs"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Surah List</span>
        </Link>

        {surahId < 114 && (
          <Link
            href={`/surah/${surahId + 1}`}
            className="inline-flex h-9 px-4 items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all hover:scale-102 active:scale-98 shadow-xs"
          >
            <span>Next Surah</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
