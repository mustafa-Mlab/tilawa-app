/**
 * Global Quran Search Engine
 *
 * Searches across:
 *  1. Surah names, phonetic transliterations, and aliases (e.g. "nisa", "al fukan")
 *  2. Direct verse references (e.g. "25:2", "al fukan 2")
 *  3. Full-text search in English & Bangla translations with synonym expansion
 *     (e.g. "azan" -> "call to prayer", "nisa" -> "women / girl / meye / mohila")
 */

import { fuzzySearchSurahs, SurahSearchable, DirectAyahMatch } from "./surahSearch";

export interface AyahSearchResult {
  globalAyahNumber: number;
  surahNumber: number;
  surahEnglishName: string;
  surahArabicName: string;
  surahEnglishTranslation: string;
  numberInSurah: number;
  englishText: string;
  banglaText?: string;
  matchedWord?: string;
}

export interface GlobalSearchResponse<T extends SurahSearchable> {
  surahs: T[];
  directAyahMatch?: DirectAyahMatch<T>;
  ayahResults: AyahSearchResult[];
  totalAyahMatches: number;
  searchQuery: string;
}

// ---------------------------------------------------------------------------
// Concept / Synonym Expansion Map
// Maps user keywords (English, Banglish, Bangla) to Quranic search terms
// ---------------------------------------------------------------------------
const SYNONYM_MAP: Record<string, string[]> = {
  // Call to prayer / Azan
  azan: ["call to prayer", "called to prayer", "adhan", "আজান", "আযান"],
  azaan: ["call to prayer", "called to prayer", "adhan", "আজান"],
  adhan: ["call to prayer", "called to prayer", "adhan", "আজান"],
  আজান: ["call to prayer", "আজান", "আযান"],
  আযান: ["call to prayer", "আজান", "আযান"],

  // Women / Female / Girl / Nisa
  women: ["women", "woman", "female", "wife", "wives", "nisa", "নারী", "মহিলা"],
  woman: ["woman", "women", "female", "wife", "নারী"],
  female: ["female", "women", "woman", "নারী"],
  girl: ["girl", "female", "women", "daughter", "মেয়ে", "কন্যা"],
  meye: ["women", "woman", "female", "girl", "daughter", "মেয়ে", "কন্যা"],
  মেয়ে: ["women", "female", "girl", "daughter", "মেয়ে"],
  mohila: ["women", "woman", "female", "মহিলা", "নারী"],
  মহিলা: ["women", "female", "মহিলা", "নারী"],
  nisa: ["women", "nisa", "female", "নারী"],
  nisaa: ["women", "nisa", "female"],

  // Fasting / Roza
  fasting: ["fast", "fasting", "ramadan", "sawm", "রোজা", "সিয়াম"],
  roza: ["fast", "fasting", "ramadan", "sawm", "রোজা", "সিয়াম"],
  রোজা: ["fast", "fasting", "রোজা", "সিয়াম"],
  ramadan: ["ramadan", "fasting", "রমজান"],

  // Prayer / Namaz / Salat
  namaz: ["prayer", "establish prayer", "salat", "সালাত", "নামাজ"],
  salat: ["prayer", "salat", "সালাত", "নামাজ"],
  solat: ["prayer", "salat", "সালাত"],
  নামাজ: ["prayer", "salat", "নামাজ", "সালাত"],
  সালাত: ["prayer", "salat", "সালাত"],

  // Charity / Zakat
  zakat: ["zakah", "charity", "alms", "sadaqah", "যাকাত"],
  jakat: ["zakah", "charity", "alms", "যাকাত"],
  charity: ["charity", "alms", "zakah", "দান", "সদকা"],
  যাকাত: ["zakah", "charity", "যাকাত"],

  // Parents / Father / Mother
  parents: ["parents", "father", "mother", "পিতা-মাতা", "বাবা-মা"],
  father: ["father", "parents", "পিতা", "বাবা"],
  mother: ["mother", "parents", "মাতা", "মা"],
  pab: ["father", "parents", "পিতা"],
  ma: ["mother", "parents", "মাতা"],
  বাবা: ["father", "parents", "পিতা"],
  মা: ["mother", "parents", "মাতা"],

  // Paradise / Hell
  jannah: ["gardens", "paradise", "jannah", "জান্নাত", "বেহেশত"],
  paradise: ["gardens", "paradise", "jannah", "জান্নাত"],
  heaven: ["gardens", "paradise", "heavens", "জান্নাত"],
  jahannam: ["hell", "fire", "jahannam", "জাহান্নাম", "দোযখ"],
  hell: ["hell", "fire", "jahannam", "জাহান্নাম"],

  // Prophets
  muhammad: ["muhammad", "ahmad", "prophet", "মুহাম্মদ"],
  jesus: ["jesus", "isa", "son of mary", "ঈসা"],
  isa: ["jesus", "isa", "ঈসা"],
  moses: ["moses", "musa", "মুসা"],
  musa: ["moses", "musa", "মুসা"],
  abraham: ["abraham", "ibrahim", "ইব্রাহিম"],
  ibrahim: ["abraham", "ibrahim", "ইব্রাহিম"],
};

/**
 * Expand query term to include relevant English & Bangla search terms
 */
function expandSearchTerms(rawQuery: string): string[] {
  const clean = rawQuery.trim().toLowerCase();
  if (!clean) return [];

  const terms = new Set<string>();
  terms.add(clean);

  // Check synonym map for exact term or individual words
  if (SYNONYM_MAP[clean]) {
    SYNONYM_MAP[clean].forEach((t) => terms.add(t));
  }

  const words = clean.split(/\s+/);
  for (const word of words) {
    if (SYNONYM_MAP[word]) {
      SYNONYM_MAP[word].forEach((t) => terms.add(t));
    }
  }

  return Array.from(terms);
}

/**
 * Search AlQuran Cloud API for text matches in English & Bangla
 */
export async function searchAyahsFullText(
  rawQuery: string
): Promise<AyahSearchResult[]> {
  const clean = rawQuery.trim();
  if (!clean || clean.length < 2) return [];

  const searchTerms = expandSearchTerms(clean);
  const targetTerms = searchTerms.slice(0, 3);

  const resultsMap = new Map<number, AyahSearchResult>();

  await Promise.all(
    targetTerms.map(async (term) => {
      try {
        const isBangla = /[\u0980-\u09FF]/.test(term);
        const edition = isBangla ? "bn.bengali" : "en.sahih";
        const url = `https://api.alquran.cloud/v1/search/${encodeURIComponent(term)}/all/${edition}`;

        const res = await fetch(url);
        if (!res.ok) return;
        const json = await res.json();

        if (json.data && Array.isArray(json.data.matches)) {
          const matches = json.data.matches.slice(0, 15);
          for (const m of matches) {
            const key = m.number; // global ayah number
            const existing = resultsMap.get(key);

            if (isBangla) {
              if (existing) {
                existing.banglaText = m.text;
              } else {
                resultsMap.set(key, {
                  globalAyahNumber: m.number,
                  surahNumber: m.surah.number,
                  surahEnglishName: m.surah.englishName,
                  surahArabicName: m.surah.name,
                  surahEnglishTranslation: m.surah.englishNameTranslation,
                  numberInSurah: m.numberInSurah,
                  englishText: "",
                  banglaText: m.text,
                  matchedWord: term,
                });
              }
            } else {
              if (existing) {
                existing.englishText = m.text;
              } else {
                resultsMap.set(key, {
                  globalAyahNumber: m.number,
                  surahNumber: m.surah.number,
                  surahEnglishName: m.surah.englishName,
                  surahArabicName: m.surah.name,
                  surahEnglishTranslation: m.surah.englishNameTranslation,
                  numberInSurah: m.numberInSurah,
                  englishText: m.text,
                  matchedWord: term,
                });
              }
            }
          }
        }
      } catch (err) {
        console.error("Full text search error for term:", term, err);
      }
    })
  );

  const topResults = Array.from(resultsMap.values()).slice(0, 15);

  // Fetch missing translations (e.g. Bangla for English search, or English for Bangla search)
  await Promise.all(
    topResults.map(async (item) => {
      try {
        if (!item.banglaText) {
          const res = await fetch(`https://api.alquran.cloud/v1/ayah/${item.globalAyahNumber}/bn.bengali`);
          if (res.ok) {
            const json = await res.json();
            if (json.data && json.data.text) {
              item.banglaText = json.data.text;
            }
          }
        }
        if (!item.englishText) {
          const res = await fetch(`https://api.alquran.cloud/v1/ayah/${item.globalAyahNumber}/en.sahih`);
          if (res.ok) {
            const json = await res.json();
            if (json.data && json.data.text) {
              item.englishText = json.data.text;
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch missing translation for ayah", item.globalAyahNumber, err);
      }
    })
  );

  return topResults;
}

/**
 * Execute unified global search across Surah names, Direct verse numbers, and Ayah text
 */
export async function executeGlobalSearch<T extends SurahSearchable>(
  allSurahs: T[],
  rawQuery: string,
  revelationFilter: "All" | "Meccan" | "Medinan" = "All"
): Promise<GlobalSearchResponse<T>> {
  const query = rawQuery.trim();
  if (!query) {
    return {
      surahs: allSurahs.filter(
        (s) => revelationFilter === "All" || s.revelationType === revelationFilter
      ),
      ayahResults: [],
      totalAyahMatches: 0,
      searchQuery: "",
    };
  }

  // 1. Fuzzy Surah & Direct Ayah Number match
  const { surahs, directAyahMatch } = fuzzySearchSurahs(allSurahs, query, revelationFilter);

  // 2. Full-text Ayah search in English & Bangla
  let ayahResults: AyahSearchResult[] = [];
  if (query.length >= 2 && !/^\d+$/.test(query)) {
    ayahResults = await searchAyahsFullText(query);
  }

  return {
    surahs,
    directAyahMatch,
    ayahResults,
    totalAyahMatches: ayahResults.length,
    searchQuery: query,
  };
}
