const BASE = "https://api.alquran.cloud/v1";

export interface SurahInfo {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
}

export interface AyahDetail {
  number: number;         // Global ayah number (e.g. 1 to 6236)
  numberInSurah: number;  // Ayah number in this Surah (e.g. 1 to 7)
  arabicText: string;     // Arabic text (clean, without Bismillah if start of Surah)
  englishText: string;    // English translation
  banglaText: string;     // Bangla translation
  juz: number;
  page: number;
}

export interface SurahDetailResponse {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: "Meccan" | "Medinan";
  numberOfAyahs: number;
  ayahs: AyahDetail[];
}

export async function getSurahList(): Promise<SurahInfo[]> {
  const res = await fetch(`${BASE}/surah`, {
    next: { revalidate: 86400 } // Cache for 24 hours
  });
  if (!res.ok) {
    throw new Error("Failed to fetch surah list");
  }
  const json = await res.json();
  return json.data;
}

export async function getSurah(id: number): Promise<SurahDetailResponse> {
  const editions = "quran-uthmani,en.sahih,bn.bengali";
  const res = await fetch(`${BASE}/surah/${id}/editions/${editions}`, {
    next: { revalidate: 86400 } // Cache for 24 hours
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch Surah ${id}`);
  }
  const json = await res.json();
  const dataList = json.data;

  // dataList[0] is Arabic, dataList[1] is English, dataList[2] is Bangla
  const arabicSurah = dataList[0];
  const englishSurah = dataList[1];
  const banglaSurah = dataList[2];

  interface RawAyah {
    number: number;
    numberInSurah: number;
    text: string;
    juz: number;
    page: number;
  }

  const ayahs: AyahDetail[] = arabicSurah.ayahs.map((arabicAyah: RawAyah, idx: number) => {
    let arText = arabicAyah.text;
    const bismillah = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
    
    // Clean up Byte Order Marks (BOM) or leading spaces if any
    const cleanArText = arText.trim().replace(/^\uFEFF/, "");
    if (id !== 1 && id !== 9 && idx === 0 && cleanArText.startsWith(bismillah)) {
      arText = cleanArText.substring(bismillah.length).trim();
    } else {
      arText = cleanArText;
    }

    return {
      number: arabicAyah.number,
      numberInSurah: arabicAyah.numberInSurah,
      arabicText: arText,
      englishText: englishSurah?.ayahs[idx]?.text || "",
      banglaText: banglaSurah?.ayahs[idx]?.text || "",
      juz: arabicAyah.juz,
      page: arabicAyah.page,
    };
  });

  return {
    number: arabicSurah.number,
    name: arabicSurah.name,
    englishName: arabicSurah.englishName,
    englishNameTranslation: arabicSurah.englishNameTranslation,
    revelationType: arabicSurah.revelationType,
    numberOfAyahs: arabicSurah.numberOfAyahs,
    ayahs,
  };
}

const RECITER_BITRATES: Record<string, number> = {
  "ar.alafasy": 128,
  "ar.abdurrahmaansudais": 64,
  "ar.mahermuaiqly": 128,
  "ar.husary": 128,
  "ar.minshawi": 128,
  "ar.abdulbasitmurattal": 64,
  "ar.shaatree": 128,
  "ar.ahmedajamy": 128,
  "ar.hudhaify": 128,
  "ar.muhammadayyoub": 128,
  "ar.saoodshuraym": 64,
  "ar.abdulsamad": 64,
  "ar.abdullahbasfar": 64,
  "ar.hanirifai": 64,
  "en.walk": 192,
};

export function getAyahAudioUrl(ayahNumber: number, reciter = "ar.alafasy") {
  const bitrate = RECITER_BITRATES[reciter] || 128;
  return `/api/audio/${bitrate}/${reciter}/${ayahNumber}.mp3`;
}
