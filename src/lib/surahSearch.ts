/**
 * Fuzzy & Phonetic Surah Search
 *
 * Handles the reality that Arabic Surah names have many valid transliterations
 * e.g. "al fukan" / "al furqaan" / "al-furqan" should all find Surah 25.
 * Also supports verse level search e.g. "25:2", "al fukan 2", "furqan:2".
 */

// ---------------------------------------------------------------------------
// Known aliases / common misspellings mapped to the canonical English name
// ---------------------------------------------------------------------------
const SURAH_ALIASES: Record<string, string> = {
  // Al-Fatiha
  fatiha: "alfatiha", fateha: "alfatiha", fatihah: "alfatiha", fathia: "alfatiha",
  // Al-Baqara
  baqara: "albaqarah", baqarah: "albaqarah", bakara: "albaqarah", bakarah: "albaqarah",
  // Al-Imran
  imran: "alimran", imraan: "alimran", omran: "alimran",
  // An-Nisa
  nisa: "alnisa", nisaa: "alnisa", nessa: "alnisa",
  // Al-Maidah
  maida: "almaidah", maidah: "almaidah", mayeda: "almaidah",
  // Al-Anam
  anam: "alanam", anaam: "alanam",
  // Al-Araf
  araf: "alaraf", aaraf: "alaraf",
  // Al-Anfal
  anfal: "alanfal", anfaal: "alanfal",
  // At-Tawbah
  tauba: "tawbah", taubah: "tawbah", towba: "tawbah",
  // Yunus
  younus: "yunus", yunis: "yunus",
  // Hud
  hood: "hud",
  // Yusuf
  yousuf: "yusuf", joseph: "yusuf",
  // Ar-Ra'd
  rad: "arrad", raad: "arrad",
  // Al-Kahf
  cave: "alkahf",
  // Maryam
  mariam: "maryam", mary: "maryam",
  // Al-Anbiya
  anbiyaa: "alanbiya",
  // Al-Hajj
  haj: "alhajj",
  // Al-Mu'minun
  muminun: "almuminun", mominun: "almuminun", mumenoon: "almuminun",
  // An-Nur
  noor: "alnur", light: "alnur",
  // Al-Furqan <- key transliterations
  furqan: "alfurqan", fukan: "alfurqan", furkan: "alfurqan", forkan: "alfurqan",
  furqaan: "alfurqan", furkaan: "alfurqan", forkaan: "alfurqan", furkon: "alfurqan",
  // Ash-Shu'ara
  shuara: "alshuara", shuaraa: "alshuara",
  // Al-Qasas
  qasas: "alqasas", kasas: "alqasas", qisas: "alqasas",
  // Al-Ankabut
  ankabut: "alankabut", ankaboot: "alankabut",
  // Ar-Rum
  rum: "alrum", rome: "alrum",
  // Luqman
  lokman: "luqman",
  // As-Sajdah
  sijda: "assajdah", sajda: "assajdah",
  // Al-Ahzab
  ahzaab: "alahzab",
  // Saba
  sheba: "saba",
  // Ya-Sin
  yasin: "yasin", yaasin: "yasin", yaseen: "yasin", yaaseen: "yasin",
  // Az-Zumar
  zomar: "azzumar",
  // Ghafir / Al-Mumin
  momin: "ghafir",
  // Muhammad
  mohd: "muhammad",
  // Al-Fath
  victory: "alfath",
  // Al-Hujurat
  hujuraat: "alhujurat",
  // Qaf
  kaf: "qaf",
  // At-Tur
  toor: "attur",
  // Ar-Rahman
  rehman: "alrahman", rohman: "alrahman",
  // Al-Waqiah
  wakiah: "alwaqiah", wakia: "alwaqiah",
  // Al-Hadid
  iron: "alhadid",
  // Al-Jumua
  juma: "aljumua", jumuah: "aljumua", friday: "aljumua",
  // Al-Mulk
  kingdom: "almulk", tabarak: "almulk",
  // Al-Qalam
  kalam: "alqalam", pen: "alqalam",
  // Al-Qiyamah
  kiyamat: "alqiyamah", qiyamat: "alqiyamah",
  // Al-Insan
  human: "alinsan", dahr: "alinsan",
  // Al-Qadr
  kadr: "alqadr", laylatul: "alqadr",
  // Al-Bayyinah
  bayyina: "albayyinah",
  // Al-Qariah
  kariah: "alqariah",
  // Al-Kawthar
  kausar: "alkawthar",
  // Al-Kafirun
  kafiroon: "alkafirun",
  // Al-Ikhlas
  ikhllas: "alikhlas",
  // An-Nasr
  victory2: "annasr",
  // Al-Masad
  lahab: "almasad",
  // Al-Fil
  elephant: "alfil",
  // Quraysh
  koraysh: "quraysh", quraish: "quraysh",
  // At-Talaq
  divorce: "attalaq",
  // Al-Fajr
  dawn: "alfajr",
  // Al-Balad
  city: "albalad",
  // Ash-Shams
  sun: "alshams",
  // Al-Layl
  lail: "allayl", night: "allayl",
};

// ---------------------------------------------------------------------------
// Phonetic normalisation map
// ---------------------------------------------------------------------------
const PHONETIC_REPLACEMENTS: [RegExp, string][] = [
  [/aa/g, "a"],
  [/ee/g, "i"],
  [/oo/g, "u"],
  [/ou/g, "u"],
  [/ai/g, "a"],
  [/ei/g, "i"],
  [/kh/g, "h"],
  [/gh/g, "g"],
  [/sh/g, "s"],
  [/th/g, "t"],
  [/dh/g, "d"],
  [/ph/g, "f"],
  [/q/g, "k"],
  [/z/g, "s"],
  [/h/g, ""],
  [/[aeiou]/g, "a"],
];

function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/['\u2018\u2019\u02bc\-]/g, "")
    .replace(/\s+/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function phonetify(str: string): string {
  let s = str;
  for (const [pattern, replacement] of PHONETIC_REPLACEMENTS) {
    s = s.replace(pattern, replacement);
  }
  return s;
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// ---------------------------------------------------------------------------
// Query parser for Surah + Ayah (e.g. "25:2", "al fukan 2", "furqan:2")
// ---------------------------------------------------------------------------
export interface ParsedSearchQuery {
  surahQuery: string;
  ayahNumber?: number;
}

export function parseSurahAyahQuery(rawQuery: string): ParsedSearchQuery {
  let q = rawQuery.trim();
  if (!q) return { surahQuery: "" };

  // Strip leading "surah" or "sura" if present
  q = q.replace(/^(?:surah|sura)\s+/i, "");

  // 1. Colon or comma separator: "25:2", "al furkan: 2", "25,2"
  const colonMatch = q.match(/^(.*?)(?::|,)\s*(\d+)$/i);
  if (colonMatch && colonMatch[1].trim()) {
    return {
      surahQuery: colonMatch[1].trim(),
      ayahNumber: parseInt(colonMatch[2], 10),
    };
  }

  // 2. Explicit verse words: "25 ayah 2", "furqan verse 2", "al fukan v2"
  const verseWordMatch = q.match(/^(.*?)\s+(?:ayah|verse|aaya|ayat|v)\s*(\d+)$/i);
  if (verseWordMatch && verseWordMatch[1].trim()) {
    return {
      surahQuery: verseWordMatch[1].trim(),
      ayahNumber: parseInt(verseWordMatch[2], 10),
    };
  }

  // 3. Trailing space separated number: "25 2", "al furkan 2", "furqan 2"
  const trailingNumMatch = q.match(/^(.*?)\s+(\d+)$/i);
  if (trailingNumMatch && trailingNumMatch[1].trim()) {
    return {
      surahQuery: trailingNumMatch[1].trim(),
      ayahNumber: parseInt(trailingNumMatch[2], 10),
    };
  }

  return { surahQuery: q };
}

// ---------------------------------------------------------------------------
// Main exports
// ---------------------------------------------------------------------------

export interface SurahSearchable {
  number: number;
  englishName: string;
  englishNameTranslation: string;
  name: string; // Arabic
  numberOfAyahs?: number;
  revelationType?: string;
}

export function scoreSurah(surah: SurahSearchable, rawQuery: string): number {
  const query = normalize(rawQuery);
  if (!query) return 1;

  // 1. Number match
  if (surah.number.toString() === rawQuery.trim()) return 1000;

  const engNorm = normalize(surah.englishName);
  const traNorm = normalize(surah.englishNameTranslation);
  const qPhone = phonetify(query);
  const engPhone = phonetify(engNorm);
  const traPhone = phonetify(traNorm);

  // Alias lookup
  const queryNoAl = query.replace(/^al/, "");
  const aliasKey = SURAH_ALIASES[query] || SURAH_ALIASES[queryNoAl];
  const engCanon = engNorm.replace(/^al/, "");

  // 2. Alias match
  if (aliasKey) {
    const targetCanon = `al${engCanon}`;
    if (aliasKey === targetCanon || aliasKey === engNorm) return 900;
  }

  // 3. Exact English / translation match
  if (engNorm === query || engNorm === `al${query}`) return 800;
  if (traNorm === query) return 700;

  // 4. Starts-with
  if (engNorm.startsWith(query)) return 600;
  if (engNorm.startsWith(`al${query}`)) return 590;
  if (traNorm.startsWith(query)) return 550;

  // 5. Contains (substring)
  if (engNorm.includes(query)) return 500;
  if (traNorm.includes(query)) return 480;

  // 6. Phonetic contains
  if (engPhone.includes(qPhone)) return 400;
  if (traPhone.includes(qPhone)) return 380;

  // 7. Levenshtein on phonetic consonant skeleton per token
  const queryTokens = rawQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const engTokens = surah.englishName.toLowerCase().split(/[\s\-]+/).filter(Boolean);

  let bestLev = Infinity;
  for (const qt of queryTokens) {
    const qtNorm = normalize(qt);
    if (qtNorm.length <= 2) continue; // skip short prefix tokens like "al"
    const qtPhone = phonetify(qtNorm);
    for (const et of engTokens) {
      const etNorm = normalize(et);
      if (etNorm.length <= 2) continue;
      const etPhone = phonetify(etNorm);
      const dist = levenshtein(qtPhone, etPhone);
      const threshold = Math.max(2, Math.floor(etPhone.length * 0.4));
      if (dist <= threshold) {
        bestLev = Math.min(bestLev, dist);
      }
    }
  }

  if (bestLev !== Infinity) {
    return Math.max(10, 300 - bestLev * 50);
  }

  return 0;
}

export interface DirectAyahMatch<T> {
  surah: T;
  ayahNumber: number;
}

export function fuzzySearchSurahs<T extends SurahSearchable>(
  surahs: T[],
  rawQuery: string,
  revelationFilter: "All" | "Meccan" | "Medinan" = "All"
): { surahs: T[]; directAyahMatch?: DirectAyahMatch<T> } {
  const { surahQuery, ayahNumber } = parseSurahAyahQuery(rawQuery);
  const effectiveQuery = surahQuery || rawQuery;

  const results: { surah: T; score: number }[] = [];

  for (const surah of surahs) {
    if (revelationFilter !== "All" && surah.revelationType !== revelationFilter) {
      continue;
    }
    const score = scoreSurah(surah, effectiveQuery);
    if (score > 0) {
      results.push({ surah, score });
    }
  }

  results.sort((a, b) =>
    b.score !== a.score ? b.score - a.score : a.surah.number - b.surah.number
  );

  const matchedSurahs = results.map((r) => r.surah);

  let directAyahMatch: DirectAyahMatch<T> | undefined;
  if (ayahNumber && matchedSurahs.length > 0) {
    const topSurah = matchedSurahs[0];
    const maxAyahs = topSurah.numberOfAyahs || 286;
    if (ayahNumber > 0 && ayahNumber <= maxAyahs) {
      directAyahMatch = {
        surah: topSurah,
        ayahNumber,
      };
    }
  }

  return { surahs: matchedSurahs, directAyahMatch };
}
