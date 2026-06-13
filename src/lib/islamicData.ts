export interface IslamicItem {
  id: number;
  title?: string;
  arabic: string;
  transliteration: string;
  english: string;
  bangla: string;
}

export interface AllahName {
  id: number;
  arabic: string;
  transliteration: string;
  english: string;
  bangla: string;
}

export const ALLAH_NAMES: AllahName[] = [
  { id: 1, arabic: "الرَّحْمَنُ", transliteration: "Ar-Rahman", english: "The Beneficent", bangla: "পরম দয়ালু" },
  { id: 2, arabic: "الرَّحِيمُ", transliteration: "Ar-Rahim", english: "The Merciful", bangla: "অতি দয়ালু" },
  { id: 3, arabic: "الْمَلِكُ", transliteration: "Al-Malik", english: "The King", bangla: "সার্বভৌম ক্ষমতার অধিকারী" },
  { id: 4, arabic: "الْقُدُّوسُ", transliteration: "Al-Quddus", english: "The Pure / Holy", bangla: "অতি পবিত্র" },
  { id: 5, arabic: "السَّلاَمُ", transliteration: "As-Salam", english: "The Giver of Peace", bangla: "শান্তি ও নিরাপত্তা দানকারী" },
  { id: 6, arabic: "الْمُؤْمِنُ", transliteration: "Al-Mu'min", english: "The Giver of Belief / Faith", bangla: "ঈমান ও নিরাপত্তা দানকারী" },
  { id: 7, arabic: "الْمُهَيْمِنُ", transliteration: "Al-Muhaymin", english: "The Guardian / Overseer", bangla: "রক্ষক ও অভিভাবক" },
  { id: 8, arabic: "الْعَزِيزُ", transliteration: "Al-Aziz", english: "The All Mighty", bangla: "মহাপরাক্রমশালী" },
  { id: 9, arabic: "الْجَبَّارُ", transliteration: "Al-Jabbar", english: "The Compeller", bangla: "মহাপ্রতাপশালী" },
  { id: 10, arabic: "الْمُتَكَبِّرُ", transliteration: "Al-Mutakabbir", english: "The Supreme / Majestic", bangla: "শ্রেষ্ঠত্ব ও অহংকারের অধিকারী" },
  { id: 11, arabic: "الْخَالِقُ", transliteration: "Al-Khaliq", english: "The Creator", bangla: "সৃষ্টিকর্তা" },
  { id: 12, arabic: "الْبَارِئُ", transliteration: "Al-Bari", english: "The Maker of Order", bangla: "সঠিক রূপদানকারী" },
  { id: 13, arabic: "الْمُصَوِّرُ", transliteration: "Al-Musawwir", english: "The Fashioner of Beauty", bangla: "আকৃতিদানকারী" },
  { id: 14, arabic: "الْغَفَّارُ", transliteration: "Al-Ghaffar", english: "The Forgiver", bangla: "মহাক্ষমাশীল" },
  { id: 15, arabic: "الْقَهَّارُ", transliteration: "Al-Qahhar", english: "The Subduer", bangla: "দমনকারী ও নিয়ন্ত্রণকারী" },
  { id: 16, arabic: "الْوَهَّابُ", transliteration: "Al-Wahhab", english: "The Giver of All", bangla: "মহা দানশীল" },
  { id: 17, arabic: "الرَّزَّاقُ", transliteration: "Ar-Razzaq", english: "The Sustainer / Provider", bangla: "রিযিকদাতা" },
  { id: 18, arabic: "الْفَتَّاحُ", transliteration: "Al-Fattah", english: "The Opener / Giver of Victory", bangla: "বিজয়দানকারী ও উন্মোচনকারী" },
  { id: 19, arabic: "الْعَلِيمُ", transliteration: "Al-Alim", english: "The All Knowing", bangla: "সর্বজ্ঞ" },
  { id: 20, arabic: "الْقَابِضُ", transliteration: "Al-Qabid", english: "The Restrainer / Straightener", bangla: "সংকোচনকারী" },
  { id: 21, arabic: "الْبَاسِطُ", transliteration: "Al-Basit", english: "The Expander / Extender", bangla: "সম্প্রসারণকারী" },
  { id: 22, arabic: "الْخَافِضُ", transliteration: "Al-Khafid", english: "The Abaser / Demoter", bangla: "অবনতকারী" },
  { id: 23, arabic: "الرَّافِعُ", transliteration: "Ar-Rafi", english: "The Exalter", bangla: "উন্নতকারী" },
  { id: 24, arabic: "الْمُعِزُّ", transliteration: "Al-Mu'izz", english: "The Giver of Honor", bangla: "সম্মানদানকারী" },
  { id: 25, arabic: "الْمُذِلُّ", transliteration: "Al-Mudhill", english: "The Giver of Dishonor", bangla: "অপমানকারী" },
  { id: 26, arabic: "السَّمِيعُ", transliteration: "As-Sami", english: "The All Hearing", bangla: "সর্বশ্রোতা" },
  { id: 27, arabic: "الْبَصِيرُ", transliteration: "Al-Basir", english: "The All Seeing", bangla: "সর্বদ্রষ্টা" },
  { id: 28, arabic: "الْحَكَمُ", transliteration: "Al-Hakam", english: "The Judge", bangla: "মীমাংসাকারী" },
  { id: 29, arabic: "الْعَدْلُ", transliteration: "Al-Adl", english: "The Utterly Just", bangla: "পরম ন্যায়পরায়ণ" },
  { id: 30, arabic: "اللَّطِيفُ", transliteration: "Al-Latif", english: "The Gentle / Subtle", bangla: "সুক্ষ্মদর্শী ও স্নেহশীল" },
  { id: 31, arabic: "الْخَبِيرُ", transliteration: "Al-Khabir", english: "The All Aware", bangla: "সর্ববিষয়ে সম্যক অবহিত" },
  { id: 32, arabic: "الْحَلِيمُ", transliteration: "Al-Halim", english: "The Forbearing", bangla: "পরম সহনশীল" },
  { id: 33, arabic: "الْعَظِيمُ", transliteration: "Al-Azim", english: "The Magnificent / Infinite", bangla: "অতি মহান" },
  { id: 34, arabic: "الْغَفُورُ", transliteration: "Al-Ghafur", english: "The All Forgiving", bangla: "পরম ক্ষমাশীল" },
  { id: 35, arabic: "الشَّكُورُ", transliteration: "Ash-Shakur", english: "The Grateful", bangla: "গুণগ্রাহী" },
  { id: 36, arabic: "الْعَلِيُّ", transliteration: "Al-Aliyy", english: "The Sublimely Exalted", bangla: "উচ্চ মর্যাদাশীল" },
  { id: 37, arabic: "الْكَبِيرُ", transliteration: "Al-Kabir", english: "The Great", bangla: "সুমহান" },
  { id: 38, arabic: "الْحَفِيظُ", transliteration: "Al-Hafidh", english: "The Preserver", bangla: "সংরক্ষক" },
  { id: 39, arabic: "الْمُقِيتُ", transliteration: "Al-Muqit", english: "The Nourisher", bangla: "জীবনোপকরণ ও শক্তিদানকারী" },
  { id: 40, arabic: "الْحَسِيبُ", transliteration: "Al-Hasib", english: "The Accounter / Reckoner", bangla: "হিসাব গ্রহণকারী" },
  { id: 41, arabic: "الْجَلِيلُ", transliteration: "Al-Jalil", english: "The Majestic", bangla: "মহিমান্বিত" },
  { id: 42, arabic: "الْكَرِيمُ", transliteration: "Al-Karim", english: "The Generous", bangla: "মহা দয়ালু ও সম্মানিত" },
  { id: 43, arabic: "الرَّقِيبُ", transliteration: "Ar-Raqib", english: "The Watchful", bangla: "তত্ত্বাবধায়ক ও পর্যবেক্ষণকারী" },
  { id: 44, arabic: "الْمُجِيبُ", transliteration: "Al-Mujib", english: "The Responder to Prayer", bangla: "প্রার্থনা কবুলকারী" },
  { id: 45, arabic: "الْوَاسِعُ", transliteration: "Al-Wasi", english: "The All-Encompassing", bangla: "অসীম ও অবারিত" },
  { id: 46, arabic: "الْحَكِيمُ", transliteration: "Al-Hakim", english: "The All Wise", bangla: "পরম প্রজ্ঞাময়" },
  { id: 47, arabic: "الْوَدُودُ", transliteration: "Al-Wadud", english: "The Loving One", bangla: "স্নেহশীল ও প্রেমময়" },
  { id: 48, arabic: "الْمَجِيدُ", transliteration: "Al-Majid", english: "The Most Glorious One", bangla: "মহা সম্মানিত" },
  { id: 49, arabic: "الْبَاعِثُ", transliteration: "Al-Ba'ith", english: "The Resurrector", bangla: "পুনরুত্থানকারী" },
  { id: 50, arabic: "الشَّهِيدُ", transliteration: "Ash-Shahid", english: "The Witness", bangla: "সাক্ষী" },
  { id: 51, arabic: "الْحَقُّ", transliteration: "Al-Haqq", english: "The Truth", bangla: "পরম সত্য" },
  { id: 52, arabic: "الْوَكِيلُ", transliteration: "Al-Wakil", english: "The Trustee", bangla: "ভরসাযোগ্য কর্মবিধায়ক" },
  { id: 53, arabic: "الْقَوِيُّ", transliteration: "Al-Qawiyy", english: "The All Strong", bangla: "মহা শক্তিশালী" },
  { id: 54, arabic: "الْمَتِينُ", transliteration: "Al-Matin", english: "The Firm One", bangla: "মহা সুদৃঢ়" },
  { id: 55, arabic: "الْوَلِيُّ", transliteration: "Al-Waliyy", english: "The Protecting Friend", bangla: "সাহায্যকারী ও অভিভাবক" },
  { id: 56, arabic: "الْحَمِيدُ", transliteration: "Al-Hamid", english: "The Praiseworthy", bangla: "মহা প্রশংসিত" },
  { id: 57, arabic: "الْمُحْصِي", transliteration: "Al-Muhsi", english: "The Counter / Appraiser", bangla: "সবকিছুর হিসাব পরিচালনাকারী" },
  { id: 58, arabic: "الْمُبْدِئُ", transliteration: "Al-Mubdi", english: "The Originator", bangla: "প্রথমবার সৃষ্টিকর্তা" },
  { id: 59, arabic: "الْمُعِيدُ", transliteration: "Al-Mu'id", english: "The Restorer", bangla: "পুনরায় সৃষ্টিকর্তা" },
  { id: 60, arabic: "الْمُحْيِي", transliteration: "Al-Muhyi", english: "The Giver of Life", bangla: "জীবনদানকারী" },
  { id: 61, arabic: "الْمُمِيتُ", transliteration: "Al-Mumit", english: "The Bringer of Death", bangla: "মৃত্যুদানকারী" },
  { id: 62, arabic: "الْحَيُّ", transliteration: "Al-Hayy", english: "The Ever Living One", bangla: "চিরঞ্জীব" },
  { id: 63, arabic: "الْقَيُّومُ", transliteration: "Al-Qayyum", english: "The Self-Existing One", bangla: "চিরস্থায়ী ও সবকিছুর ধারক" },
  { id: 64, arabic: "الْوَاجِدُ", transliteration: "Al-Wajid", english: "The Finder", bangla: "অভাবহীন" },
  { id: 65, arabic: "الْمَاجِدُ", transliteration: "Al-Majid", english: "The Noble", bangla: "মর্যাদাবান" },
  { id: 66, arabic: "الْوَاحِدُ", transliteration: "Al-Wahid", english: "The Unique", bangla: "এক ও অদ্বিতীয়" },
  { id: 67, arabic: "الأَحَدُ", transliteration: "Al-Ahad", english: "The One", bangla: "এক ও একক" },
  { id: 68, arabic: "الصَّمَدُ", transliteration: "As-Samad", english: "The Eternal / Absolute", bangla: "অমুখাপেক্ষী" },
  { id: 69, arabic: "الْقَادِرُ", transliteration: "Al-Qadir", english: "The Able / Capable", bangla: "সর্বশক্তিমান" },
  { id: 70, arabic: "الْمُقْتَدِرُ", transliteration: "Al-Muqtadir", english: "The Powerful", bangla: "মহা ক্ষমতাবান" },
  { id: 71, arabic: "الْمُقَدِّمُ", transliteration: "Al-Muqaddim", english: "The Expediter", bangla: "অগ্রগামীকারী" },
  { id: 72, arabic: "الْمُؤَخِّرُ", transliteration: "Al-Mu'akhkhir", english: "The Delayer", bangla: "পশ্চাদগামীকারী" },
  { id: 73, arabic: "الأوَّلُ", transliteration: "Al-Awwal", english: "The First", bangla: "অনাদি / প্রথম" },
  { id: 74, arabic: "الآخِرُ", transliteration: "Al-Akhir", english: "The Last", bangla: "অনন্ত / শেষ" },
  { id: 75, arabic: "الظَّاهِرُ", transliteration: "Ad-Dhahir", english: "The Manifest One", bangla: "প্রকাশ্য" },
  { id: 76, arabic: "الْبَاطِنُ", transliteration: "Al-Batin", english: "The Hidden One", bangla: "অপ্রকাশ্য / গোপন" },
  { id: 77, arabic: "الْوَالِي", transliteration: "Al-Wali", english: "The Protecting Governor", bangla: "শাসনকর্তা ও অভিভাবক" },
  { id: 78, arabic: "الْمُتَعَالِي", transliteration: "Al-Muta'ali", english: "The Supreme Exalted One", bangla: "সর্বোচ্চ মর্যাদার অধিকারী" },
  { id: 79, arabic: "الْبَرُّ", transliteration: "Al-Barr", english: "The Source of All Goodness", bangla: "পরম কল্যাণকারী" },
  { id: 80, arabic: "التَّوَّابُ", transliteration: "At-Tawwab", english: "The Acceptor of Repentance", bangla: "তওবা কবুলকারী" },
  { id: 81, arabic: "الْمُنْتَقِمُ", transliteration: "Al-Muntaqim", english: "The Avenger", bangla: "প্রতিশোধ গ্রহণকারী" },
  { id: 82, arabic: "الْعَفُوُّ", transliteration: "Al-Afuww", english: "The Pardoner", bangla: "ক্ষমাশীল" },
  { id: 83, arabic: "الرَّؤُوفُ", transliteration: "Ar-Ra'uf", english: "The Most Kind", bangla: "পরম স্নেহশীল" },
  { id: 84, arabic: "مَالِكُ الْمُلْكِ", transliteration: "Malik-ul-Mulk", english: "The Owner of All Sovereignty", bangla: "রাজাধিরাজ / নিখিল বিশ্বের অধিপতি" },
  { id: 85, arabic: "ذُو الْجَلاَلِ وَالإِكْرَامِ", transliteration: "Dhu-l-Jalali wal-Ikram", english: "The Lord of Majesty and Bounty", bangla: "মহিমাময় ও সম্মানিত" },
  { id: 86, arabic: "الْمُقْسِطُ", transliteration: "Al-Muqsit", english: "The Equitable One", bangla: "ন্যায়পরায়ণ" },
  { id: 87, arabic: "الْجَامِعُ", transliteration: "Al-Jami", english: "The Gatherer", bangla: "একত্রকারী" },
  { id: 88, arabic: "الْغَنِيُّ", transliteration: "Al-Ghaniyy", english: "The All-Rich One", bangla: "অভাবমুক্ত ও ধনী" },
  { id: 89, arabic: "الْمُغْنِي", transliteration: "Al-Mughni", english: "The Enricher", bangla: "ধনৈশ্বর্য দানকারী" },
  { id: 90, arabic: "الْمَانِعُ", transliteration: "Al-Mani", english: "The Preventer", bangla: "প্রতিরোধকারী" },
  { id: 91, arabic: "الضَّارُّ", transliteration: "Ad-Darr", english: "The Distresser", bangla: "ক্ষতিসাধনকারী (পরীক্ষক)" },
  { id: 92, arabic: "النَّافِعُ", transliteration: "An-Nafi", english: "The Propitious", bangla: "কল্যাণকারী" },
  { id: 93, arabic: "النُّورُ", transliteration: "An-Nur", english: "The Light", bangla: "জ্যোতি" },
  { id: 94, arabic: "الْهَادِي", transliteration: "Al-Hadi", english: "The Guide", bangla: "পথপ্রদর্শক" },
  { id: 95, arabic: "الْبَدِيعُ", transliteration: "Al-Badi", english: "The Incomparable Originator", bangla: "অপূর্ব ও অদ্বিতীয় স্রষ্টা" },
  { id: 96, arabic: "الْبَاقِي", transliteration: "Al-Baqi", english: "The Everlasting", bangla: "চিরস্থায়ী ও অবিনশ্বর" },
  { id: 97, arabic: "الْوَارِثُ", transliteration: "Al-Warith", english: "The Ultimate Inheritor", bangla: "পরম উত্তরাধিকারী" },
  { id: 98, arabic: "الرَّشِيدُ", transliteration: "Ar-Rashid", english: "The Guide to the Right Path", bangla: "সৎপথ প্রদর্শনকারী" },
  { id: 99, arabic: "الصَّبُورُ", transliteration: "As-Sabur", english: "The Patient One", bangla: "পরম ধৈর্যশীল" },
];

export const KALIMAS: IslamicItem[] = [
  {
    id: 1,
    title: "First Kalima: Tayyabah (Purity)",
    arabic: "لَا إِلٰهَ إِلَّا اللهُ مُحَمَّدٌ رَسُولُ اللهِ",
    transliteration: "La ilaha illallahu Muhammadur Rasulullah",
    english: "There is no God but Allah, and Muhammad is the messenger of Allah.",
    bangla: "আল্লাহ তাআলা ব্যতীত কোনো উপাস্য নেই, হযরত মুহাম্মদ (সা.) তাঁর প্রেরিত রসূল।"
  },
  {
    id: 2,
    title: "Second Kalima: Shahadah (Testimony)",
    arabic: "أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    transliteration: "Ashhadu al-la ilaha illallahu wahdahu la sharika lahu wa ashhadu anna Muhammadan 'abduhu wa rasuluh",
    english: "I bear witness that there is no deity but Allah, who is alone and without partners, and I bear witness that Muhammad is His servant and messenger.",
    bangla: "আমি সাক্ষ্য দিচ্ছি যে, আল্লাহ ছাড়া কোনো মাবুদ নাই। তিনি এক, তাঁর কোনো অংশীদার নাই এবং আমি আরও সাক্ষ্য দিচ্ছি যে, হযরত মুহাম্মদ (সা.) তাঁর বান্দা ও প্রেরিত রসূল।"
  },
  {
    id: 3,
    title: "Third Kalima: Tamjeed (Glorification)",
    arabic: "سُبْحَانَ اللهِ وَالْحَمْدُ للهِ وَلَا إِلٰهَ إِلَّا اللهُ وَاللهُ أَكْبَرُ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ الْعَلِيِّ الْعَظِيمِ",
    transliteration: "Subhanallahi walhamdulillahi wa la ilaha illallahu wallahu akbar, wa la hawla wa la quwwata illa billahil 'aliyyil 'adheem",
    english: "Glory be to Allah, and all praise be to Allah, and there is no deity but Allah, and Allah is the Greatest. And there is no power nor strength except from Allah, the Most High, the Most Great.",
    bangla: "মহিমান্বিত আল্লাহ, সমস্ত প্রশংসা আল্লাহর, আল্লাহ ছাড়া কোনো মাবুদ নাই, আল্লাহ মহান। মহান আল্লাহ ছাড়া কোনো ক্ষমতা বা শক্তি নাই, যিনি অতি উচ্চ, অতি মহান।"
  },
  {
    id: 4,
    title: "Fourth Kalima: Tawheed (Unity)",
    arabic: "لَا إِلٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، يُحْيِي وَيُمِيتُ وَهُوَ حَيٌّ لَا يَمُوتُ أَبَدًا أَبَدًا، ذُو الْجَلَالِ وَالْإِكْرَامِ، بِيَدِهِ الْخَيْرُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: "La ilaha illallahu wahdahu la sharika lahu, lahul-mulku wa lahul-hamdu, yuhyi wa yumitu wa huwa hayyul la yamutu abadan abada, dhul-jalali wal-ikram, biyadihil-khair, wa huwa 'ala kulli shay'in qadir",
    english: "There is no deity but Allah, alone without partner. His is the sovereignty, and His is the praise. He gives life and causes death, and He is living, who never dies. Owner of majesty and honor. In His hand is all good, and He is powerful over all things.",
    bangla: "আল্লাহ ছাড়া কোনো মাবুদ নাই, তিনি এক ও অংশীদারহীন। সার্বভৌমত্ব ও প্রশংসা তাঁরই। তিনি জীবিত করেন ও মারেন, তিনি চিরঞ্জীব, কখনও মৃত্যুবরণ করবেন না। তিনি মহিমান্বিত ও সম্মানিত। তাঁর হাতেই সমস্ত কল্যাণ এবং তিনি সব কিছুর ওপর ক্ষমতাবান।"
  },
  {
    id: 5,
    title: "Fifth Kalima: Istighfar (Penitence)",
    arabic: "أَسْتَغْفِرُ اللهَ رَبِّي مِنْ كُلِّ ذَنْبٍ أَذْنَبْتُهُ عَمْدًا أَوْ خَطَأً سِرًّا أَوْ عَلَانِيَةً وَأَتُوبُ إِلَيْهِ مِنَ الذَّنْبِ الَّذِي أَعْلَمُ وَمِنَ الذَّنْبِ الَّذِي لَا أَعْلَمُ، إِنَّكَ أَنْتَ عَلَّامُ الْغُيُوبِ وَسَتَّارُ الْعُيُوبِ وَغَفَّارُ الذُّنُوبِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ الْعَلِيِّ الْعَظِيمِ",
    transliteration: "Astaghfirullaha rabbi min kulli dhanbin adhanabtuhu 'amdan aw khata'an sirran aw 'alaniyatan wa atubu ilayhi minadh-dhanbil-ladhi a'lamu wa minadh-dhanbil-ladhi la a'lamu, innaka anta 'allamul-ghuyubi wa sattarul-'uyubi wa ghaffarudh-dhunubi wa la hawla wa la quwwata illa billahil-'aliyyil-'adheem",
    english: "I seek forgiveness from Allah, my Lord, for every sin I committed knowingly or unknowingly, secretly or openly, and I turn to Him in repentance from the sin I know and from the sin I do not know. Indeed, You are the Knower of the unseen, the Concealer of flaws, and the Forgiver of sins. And there is no power nor strength except from Allah, the Most High, the Most Great.",
    bangla: "আমি আমার প্রতিপালক আল্লাহর কাছে ক্ষমা প্রার্থনা করছি আমার করা প্রতিটি পাপের জন্য, যা আমি ইচ্ছা করে বা ভুলবশত, গোপনে বা প্রকাশ্য করেছি। আমি তাঁর কাছে ফিরে আসছি সেই পাপ থেকে যা আমি জানি এবং যা জানি না। নিশ্চয়ই আপনি অদৃশ্য বিষয়ে পরিজ্ঞাত, ত্রুটিসমূহ গোপনকারী এবং পাপসমূহ ক্ষমাকারী। মহান আল্লাহ ছাড়া কোনো ক্ষমতা বা শক্তি নাই, যিনি অতি উচ্চ, অতি মহান।"
  },
  {
    id: 6,
    title: "Sixth Kalima: Radde Kufr (Rejection of Disbelief)",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ أَنْ أُشْرِكَ بِكَ شَيْءً وَأَنَا أَعْلَمُ بِهِ، وَأَسْتَغْفِرُكَ لِمَا لَا أَعْلَمُ بِهِ، تُبْتُ عَنْهُ وَتَبَرَّأْتُ مِنَ الْكُفْرِ وَالشِّرْكِ وَالْكَذِبِ وَالْغِيبَةِ وَالْبِدْعَةِ وَالنَّمِيمَةِ وَالْفَوَاحِشِ وَالْبُهْتَانِ وَالْمَعَاصِي كُلِّهَا، وَأَسْلَمْتُ وَأَقُولُ لَا إِلٰهَ إِلَّا اللهُ مُحَمَّدٌ رَسُولُ اللهِ",
    transliteration: "Allahumma inni a'udhu bika min an ushrika bika shay'an wa ana a'lamu bihi, wa astaghfiruka lima la a'lamu bihi, tubtu 'anhu wa tabarra'tu minal-kufri wash-shirki wal-kadhibi wal-ghibati wal-bid'ati wan-namimati wal-fawahishi wal-buhtani wal-ma'asi kulliha, wa aslamtu wa aqulu la ilaha illallahu Muhammadur Rasulullah",
    english: "O Allah! I seek refuge in You from associating anything with You knowingly, and I seek Your forgiveness for what I do not know. I repent from it and free myself from disbelief, polytheism, falsehood, backbiting, innovation, slander, lewdness, calumny, and all disobedience. I submit and say: There is no deity but Allah, and Muhammad is the messenger of Allah.",
    bangla: "হে আল্লাহ! আমি আপনার কাছে আশ্রয় চাচ্ছি যেন আমি জেনে শুনে আপনার সাথে কোনো কিছুকে অংশীদার না করি, এবং না জেনে করা ভুলের জন্য আপনার কাছে ক্ষমা প্রার্থনা করছি। আমি তা থেকে তওবা করছি এবং কুফর, শিরক, মিথ্যা, গীবত, বিদআত, পরনিন্দা, অশ্লীলতা, অপবাদ এবং সব ধরনের অবাধ্যতা থেকে নিজেকে মুক্ত করছি। আমি আত্মসমর্পণ করেছি এবং বলছি: আল্লাহ ছাড়া কোনো মাবুদ নাই, হযরত মুহাম্মদ (সা.) তাঁর প্রেরিত রসূল।"
  }
];

export const SANA: IslamicItem = {
  id: 1,
  arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَهَ غَيْرُكَ",
  transliteration: "Subhanaka Allahumma wa bihamdika, wa tabarakasmuka wa ta'ala jadduka, wa la ilaha ghairuk",
  english: "Glory be to You, O Allah, and all praise is Yours. Blessed is Your name, and exalted is Your majesty, and there is no deity worthy of worship besides You.",
  bangla: "হে আল্লাহ, আমি আপনার পবিত্রতা ঘোষণা করছি প্রশংসার সাথে। আপনার নাম বরকতময়, আপনার মাহাত্ম্য সর্বোচ্চ এবং আপনি ছাড়া অন্য কোনো উপাস্য নেই।"
};

export const AYATUL_KURSI: IslamicItem = {
  id: 1,
  arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۚ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
  transliteration: "Allahu la ilaha illa Huwal-Hayyul-Qayyum. La ta'khudhuhu sinatun wa la nawm. Lahu ma fis-samawati wa ma fil-ard. Man dhal-ladhi yashfa'u 'indahu illa bi-idhnihi? Ya'lamu ma bayna aydihim wa ma khalfahum, wa la yuhituna bishay'in min 'ilmihi illa bima sha'. Wasi'a kursiyyuhus-samawati wal-ard, wa la ya'uduhu hifdhuhuma, wa Huwal-'Aliyyul-'Adheem",
  english: "Allah! There is no deity but He, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
  bangla: "আল্লাহ, তিনি ছাড়া অন্য কোনো উপাস্য নেই, তিনি চিরঞ্জীব, সব কিছুর ধারক। তাঁকে তন্দ্রা ও নিদ্রা স্পর্শ করে না। আকাশসমূহে যা কিছু আছে এবং পৃথিবীতে যা কিছু আছে সব তাঁরই। কে সে, যে তাঁর অনুমতি ছাড়া তাঁর নিকট সুপারিশ করবে? তাদের সামনে ও পেছনে যা কিছু আছে তা তিনি জানেন। আর তাঁর জ্ঞান থেকে তারা কোনো কিছুই আয়ত্ত করতে পারে না, কেবল যা তিনি চান তা ছাড়া। তাঁর কুরসী আকাশসমূহ ও পৃথিবীব্যাপী বিস্তৃত এবং এ দুটোর রক্ষণাবেক্ষণ তাঁর জন্য ক্লান্তিকর নয়। আর তিনি সর্বোচ্চ, মহান।"
};

export interface AzanItem {
  phrase: string;
  count: number;
  transliteration: string;
  english: string;
  bangla: string;
}

export const AZAN_PHRASES: AzanItem[] = [
  { phrase: "اللَّهُ أَكْبَرُ", count: 4, transliteration: "Allahu Akbar", english: "Allah is the Greatest", bangla: "আল্লাহ মহান" },
  { phrase: "أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللَّهُ", count: 2, transliteration: "Ashhadu alla ilaha illallah", english: "I bear witness that there is no deity but Allah", bangla: "আমি সাক্ষ্য দিচ্ছি যে আল্লাহ ছাড়া কোনো মাবুদ নাই" },
  { phrase: "أَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ", count: 2, transliteration: "Ashhadu anna Muhammadar Rasulullah", english: "I bear witness that Muhammad is the Messenger of Allah", bangla: "আমি সাক্ষ্য দিচ্ছি যে মুহাম্মদ (সা.) আল্লাহর রাসূল" },
  { phrase: "حَيَّ عَلَى الصَّلَاةِ", count: 2, transliteration: "Hayya 'alas-salah", english: "Hurry to the prayer", bangla: "সালাতের (নামাজের) জন্য এসো" },
  { phrase: "حَيَّ عَلَى الْفَلَاحِ", count: 2, transliteration: "Hayya 'alal-falah", english: "Hurry to the success", bangla: "কল্যাণের জন্য এসো" },
  { phrase: "الصَّلَاةُ خَيْرٌ مِنَ النَّوْمِ", count: 2, transliteration: "As-salatu khayrum-minan-nawm (Only Fajr)", english: "Prayer is better than sleep", bangla: "ঘুমের চেয়ে নামায উত্তম (শুধু ফজরের আযানে)" },
  { phrase: "اللَّهُ أَكْبَرُ", count: 2, transliteration: "Allahu Akbar", english: "Allah is the Greatest", bangla: "আল্লাহ মহান" },
  { phrase: "لَا إِلٰهَ إِلَّا اللَّهُ", count: 1, transliteration: "La ilaha illallah", english: "There is no deity but Allah", bangla: "আল্লাহ ছাড়া কোনো মাবুদ নাই" },
];

export interface TasbihDua {
  id: string;
  arabic: string;
  transliteration: string;
  english: string;
  bangla: string;
  recommendedCount: number;
}

export const TASBIH_AZKAR: TasbihDua[] = [
  {
    id: "subhanallah",
    arabic: "سُبْحَانَ اللَّهِ",
    transliteration: "SubhanAllah",
    english: "Glory be to Allah",
    bangla: "আল্লাহ অতি পবিত্র",
    recommendedCount: 33
  },
  {
    id: "alhamdulillah",
    arabic: "الْحَمْدُ لِلَّهِ",
    transliteration: "Alhamdulillah",
    english: "Praise be to Allah",
    bangla: "সমস্ত প্রশংসা আল্লাহর",
    recommendedCount: 33
  },
  {
    id: "allahuakbar",
    arabic: "اللَّهُ أَكْبَرُ",
    transliteration: "Allahu Akbar",
    english: "Allah is the Greatest",
    bangla: "আল্লাহ মহান",
    recommendedCount: 34
  },
  {
    id: "istighfar",
    arabic: "أَسْتَغْفِرُ اللَّهِ",
    transliteration: "Astaghfirullah",
    english: "I seek forgiveness from Allah",
    bangla: "আমি আল্লাহর কাছে ক্ষমা প্রার্থনা করছি",
    recommendedCount: 100
  },
  {
    id: "lailahaillallah",
    arabic: "لَا إِلٰهَ إِلَّا اللَّهُ",
    transliteration: "La ilaha illallah",
    english: "There is no deity but Allah",
    bangla: "আল্লাহ ছাড়া কোনো মাবুদ নাই",
    recommendedCount: 100
  },
  {
    id: "subhanallahi_bihamdihi",
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
    transliteration: "SubhanAllahi wa bihamdihi, SubhanAllahil Adheem",
    english: "Glory be to Allah and Praise, Glory be to Allah the Supreme",
    bangla: "আল্লাহ অতি পবিত্র এবং তাঁরই সব প্রশংসা, অতি পবিত্র মহান আল্লাহ",
    recommendedCount: 100
  },
  {
    id: "lahawla",
    arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    transliteration: "La hawla wa la quwwata illa billah",
    english: "There is no power nor strength except with Allah",
    bangla: "আল্লাহ ছাড়া কোনো শক্তি বা সামর্থ্য নেই",
    recommendedCount: 100
  },
  {
    id: "salawat",
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ",
    transliteration: "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammad",
    english: "O Allah, send blessings upon Muhammad and the family of Muhammad",
    bangla: "হে আল্লাহ, হযরত মুহাম্মদ (সা.) ও তাঁর বংশধরের প্রতি অনুগ্রহ বর্ষণ করুন",
    recommendedCount: 100
  }
];
