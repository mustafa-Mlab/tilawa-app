import { getSurahList, SurahInfo } from "@/lib/quran";
import { SurahList } from "@/components/SurahList";
import { Sparkles } from "lucide-react";

// The home page is rendered server-side and fetched statically
export default async function Home() {
  let surahs: SurahInfo[] = [];
  let errorMsg = "";

  try {
    surahs = await getSurahList();
  } catch (err) {
    console.error("Error loading surahs:", err);
    errorMsg = "Unable to load the Quranic Surah list. Please check your internet connection and try again.";
  }

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Decorative Title Banner */}
      <div className="text-center space-y-3 py-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30 text-xs font-bold tracking-wide uppercase">
          <Sparkles className="h-3.5 w-3.5 fill-current" />
          <span>Contemplate the Words of Allah</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          The Noble Quran
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Read, search, listen to beautiful audio recitations by renowned reciters, and adjust typography for your reading comfort.
        </p>
      </div>

      {/* Main Content Area */}
      {errorMsg ? (
        <div className="text-center p-8 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md mx-auto">
          <p className="text-rose-500 text-sm font-semibold">{errorMsg}</p>
        </div>
      ) : (
        <SurahList surahs={surahs} />
      )}
    </div>
  );
}
