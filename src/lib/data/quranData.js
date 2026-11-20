/**
 * Quran Data: 114 Surahs directory, 30 Juz index, and bundled high-demand Surahs for instant offline reading.
 */

export const SURAH_LIST = [
  { number: 1, name: "الفَاتِحَة", englishName: "Al-Fatihah", englishMeaning: "The Opening", type: "Meccan", ayahCount: 7, juz: 1, page: 1 },
  { number: 2, name: "البَقَرَة", englishName: "Al-Baqarah", englishMeaning: "The Cow", type: "Medinan", ayahCount: 286, juz: 1, page: 2 },
  { number: 3, name: "آل عِمْرَان", englishName: "Aal-e-Imran", englishMeaning: "Family of Imran", type: "Medinan", ayahCount: 200, juz: 3, page: 50 },
  { number: 4, name: "النِّسَاء", englishName: "An-Nisa", englishMeaning: "The Women", type: "Medinan", ayahCount: 176, juz: 4, page: 77 },
  { number: 5, name: "المَائِدَة", englishName: "Al-Ma'idah", englishMeaning: "The Table Spread", type: "Medinan", ayahCount: 120, juz: 6, page: 106 },
  { number: 6, name: "الأَنْعَام", englishName: "Al-An'am", englishMeaning: "The Cattle", type: "Meccan", ayahCount: 165, juz: 7, page: 128 },
  { number: 7, name: "الأَعْرَاف", englishName: "Al-A'raf", englishMeaning: "The Heights", type: "Meccan", ayahCount: 206, juz: 8, page: 151 },
  { number: 8, name: "الأَنْفَال", englishName: "Al-Anfal", englishMeaning: "The Spoils of War", type: "Medinan", ayahCount: 75, juz: 9, page: 177 },
  { number: 9, name: "التَّوْبَة", englishName: "At-Tawbah", englishMeaning: "The Repentance", type: "Medinan", ayahCount: 129, juz: 10, page: 187 },
  { number: 10, name: "يُونُس", englishName: "Yunus", englishMeaning: "Jonah", type: "Meccan", ayahCount: 109, juz: 11, page: 208 },
  { number: 11, name: "هُود", englishName: "Hud", englishMeaning: "Hud", type: "Meccan", ayahCount: 123, juz: 11, page: 221 },
  { number: 12, name: "يُوسُف", englishName: "Yusuf", englishMeaning: "Joseph", type: "Meccan", ayahCount: 111, juz: 12, page: 235 },
  { number: 13, name: "الرَّعْد", englishName: "Ar-Ra'd", englishMeaning: "The Thunder", type: "Medinan", ayahCount: 43, juz: 13, page: 249 },
  { number: 14, name: "إِبْرَاهِيم", englishName: "Ibrahim", englishMeaning: "Abraham", type: "Meccan", ayahCount: 52, juz: 13, page: 255 },
  { number: 15, name: "الحِجْر", englishName: "Al-Hijr", englishMeaning: "The Rocky Tract", type: "Meccan", ayahCount: 99, juz: 14, page: 262 },
  { number: 16, name: "النَّحْل", englishName: "An-Nahl", englishMeaning: "The Bee", type: "Meccan", ayahCount: 128, juz: 14, page: 267 },
  { number: 17, name: "الإِسْرَاء", englishName: "Al-Isra", englishMeaning: "The Night Journey", type: "Meccan", ayahCount: 111, juz: 15, page: 282 },
  { number: 18, name: "الكَهْف", englishName: "Al-Kahf", englishMeaning: "The Cave", type: "Meccan", ayahCount: 110, juz: 15, page: 293 },
  { number: 19, name: "مَرْيَم", englishName: "Maryam", englishMeaning: "Mary", type: "Meccan", ayahCount: 98, juz: 16, page: 305 },
  { number: 20, name: "طه", englishName: "Taha", englishMeaning: "Ta-Ha", type: "Meccan", ayahCount: 135, juz: 16, page: 312 },
  { number: 21, name: "الأَنْبِيَاء", englishName: "Al-Anbiya", englishMeaning: "The Prophets", type: "Meccan", ayahCount: 112, juz: 17, page: 322 },
  { number: 22, name: "الحَجّ", englishName: "Al-Hajj", englishMeaning: "The Pilgrimage", type: "Medinan", ayahCount: 78, juz: 17, page: 332 },
  { number: 23, name: "المُؤْمِنُون", englishName: "Al-Mu'minun", englishMeaning: "The Believers", type: "Meccan", ayahCount: 118, juz: 18, page: 342 },
  { number: 24, name: "النُّور", englishName: "An-Nur", englishMeaning: "The Light", type: "Medinan", ayahCount: 64, juz: 18, page: 350 },
  { number: 25, name: "الفُرْقَان", englishName: "Al-Furqan", englishMeaning: "The Criterion", type: "Meccan", ayahCount: 77, juz: 18, page: 359 },
  { number: 26, name: "الشُّعَرَاء", englishName: "Ash-Shu'ara", englishMeaning: "The Poets", type: "Meccan", ayahCount: 227, juz: 19, page: 367 },
  { number: 27, name: "النَّمْل", englishName: "An-Naml", englishMeaning: "The Ant", type: "Meccan", ayahCount: 93, juz: 19, page: 377 },
  { number: 28, name: "القَصَص", englishName: "Al-Qasas", englishMeaning: "The Stories", type: "Meccan", ayahCount: 88, juz: 20, page: 385 },
  { number: 29, name: "العَنْكَبُوت", englishName: "Al-Ankabut", englishMeaning: "The Spider", type: "Meccan", ayahCount: 69, juz: 20, page: 396 },
  { number: 30, name: "الرُّوم", englishName: "Ar-Rum", englishMeaning: "The Romans", type: "Meccan", ayahCount: 60, juz: 21, page: 404 },
  { number: 31, name: "لُقْمَان", englishName: "Luqman", englishMeaning: "Luqman", type: "Meccan", ayahCount: 34, juz: 21, page: 411 },
  { number: 32, name: "السَّجْدَة", englishName: "As-Sajdah", englishMeaning: "The Prostration", type: "Meccan", ayahCount: 30, juz: 21, page: 415 },
  { number: 33, name: "الأَحْزَاب", englishName: "Al-Ahzab", englishMeaning: "The Combined Forces", type: "Medinan", ayahCount: 73, juz: 21, page: 418 },
  { number: 34, name: "سَبَأ", englishName: "Saba", englishMeaning: "Sheba", type: "Meccan", ayahCount: 54, juz: 22, page: 428 },
  { number: 35, name: "فَاطِر", englishName: "Fatir", englishMeaning: "Originator", type: "Meccan", ayahCount: 45, juz: 22, page: 434 },
  { number: 36, name: "يس", englishName: "Ya-Sin", englishMeaning: "Ya-Sin", type: "Meccan", ayahCount: 83, juz: 22, page: 440 },
  { number: 37, name: "الصَّافَّات", englishName: "As-Saffat", englishMeaning: "Those Who Set The Ranks", type: "Meccan", ayahCount: 182, juz: 23, page: 446 },
  { number: 38, name: "ص", englishName: "Sad", englishMeaning: "The Letter Sad", type: "Meccan", ayahCount: 88, juz: 23, page: 453 },
  { number: 39, name: "الزُّمَر", englishName: "Az-Zumar", englishMeaning: "The Troops", type: "Meccan", ayahCount: 75, juz: 23, page: 458 },
  { number: 40, name: "غَافِر", englishName: "Ghafir", englishMeaning: "The Forgiver", type: "Meccan", ayahCount: 85, juz: 24, page: 467 },
  { number: 41, name: "فُصِّلَت", englishName: "Fussilat", englishMeaning: "Explained In Detail", type: "Meccan", ayahCount: 54, juz: 24, page: 477 },
  { number: 42, name: "الشُّورَى", englishName: "Ash-Shura", englishMeaning: "The Consultation", type: "Meccan", ayahCount: 53, juz: 25, page: 483 },
  { number: 43, name: "الزُّخْرُف", englishName: "Az-Zukhruf", englishMeaning: "The Ornaments of Gold", type: "Meccan", ayahCount: 89, juz: 25, page: 489 },
  { number: 44, name: "الدُّخَان", englishName: "Ad-Dukhan", englishMeaning: "The Smoke", type: "Meccan", ayahCount: 59, juz: 25, page: 496 },
  { number: 45, name: "الجَاثِيَة", englishName: "Al-Jathiyah", englishMeaning: "The Crouching", type: "Meccan", ayahCount: 37, juz: 25, page: 499 },
  { number: 46, name: "الأَحْقَاف", englishName: "Al-Ahqaf", englishMeaning: "The Wind-Curved Sandhills", type: "Meccan", ayahCount: 35, juz: 26, page: 502 },
  { number: 47, name: "مُحَمَّد", englishName: "Muhammad", englishMeaning: "Muhammad", type: "Medinan", ayahCount: 38, juz: 26, page: 507 },
  { number: 48, name: "الفَتْح", englishName: "Al-Fath", englishMeaning: "The Victory", type: "Medinan", ayahCount: 29, juz: 26, page: 511 },
  { number: 49, name: "الحُجُرَات", englishName: "Al-Hujurat", englishMeaning: "The Rooms", type: "Medinan", ayahCount: 18, juz: 26, page: 515 },
  { number: 50, name: "ق", englishName: "Qaf", englishMeaning: "The Letter Qaf", type: "Meccan", ayahCount: 45, juz: 26, page: 518 },
  { number: 51, name: "الذَّارِيَات", englishName: "Adh-Dhariyat", englishMeaning: "The Winnowing Winds", type: "Meccan", ayahCount: 60, juz: 26, page: 520 },
  { number: 52, name: "الطُّور", englishName: "At-Tur", englishMeaning: "The Mount", type: "Meccan", ayahCount: 49, juz: 27, page: 523 },
  { number: 53, name: "النَّجْم", englishName: "An-Najm", englishMeaning: "The Star", type: "Meccan", ayahCount: 62, juz: 27, page: 526 },
  { number: 54, name: "القَمَر", englishName: "Al-Qamar", englishMeaning: "The Moon", type: "Meccan", ayahCount: 55, juz: 27, page: 528 },
  { number: 55, name: "الرَّحْمَٰن", englishName: "Ar-Rahman", englishMeaning: "The Beneficent", type: "Medinan", ayahCount: 78, juz: 27, page: 531 },
  { number: 56, name: "الوَاِقِعَة", englishName: "Al-Waqi'ah", englishMeaning: "The Inevitable", type: "Meccan", ayahCount: 96, juz: 27, page: 534 },
  { number: 57, name: "الحَدِيد", englishName: "Al-Hadid", englishMeaning: "The Iron", type: "Medinan", ayahCount: 29, juz: 27, page: 537 },
  { number: 58, name: "المُجَادِلَة", englishName: "Al-Mujadila", englishMeaning: "The Pleading Woman", type: "Medinan", ayahCount: 22, juz: 28, page: 542 },
  { number: 59, name: "الحَشْر", englishName: "Al-Hashr", englishMeaning: "The Exile", type: "Medinan", ayahCount: 24, juz: 28, page: 545 },
  { number: 60, name: "المُمْتَحَنَة", englishName: "Al-Mumtahanah", englishMeaning: "She That Is To Be Examined", type: "Medinan", ayahCount: 13, juz: 28, page: 549 },
  { number: 61, name: "الصَّفّ", englishName: "As-Saff", englishMeaning: "The Ranks", type: "Medinan", ayahCount: 14, juz: 28, page: 551 },
  { number: 62, name: "الجُمُعَة", englishName: "Al-Jumu'ah", englishMeaning: "Friday", type: "Medinan", ayahCount: 11, juz: 28, page: 553 },
  { number: 63, name: "المُنَافِقُون", englishName: "Al-Munafiqun", englishMeaning: "The Hypocrites", type: "Medinan", ayahCount: 11, juz: 28, page: 554 },
  { number: 64, name: "التَّغَابُن", englishName: "At-Taghabun", englishMeaning: "Mutual Disillusion", type: "Medinan", ayahCount: 18, juz: 28, page: 556 },
  { number: 65, name: "الطَّلَاق", englishName: "At-Talaq", englishMeaning: "The Divorce", type: "Medinan", ayahCount: 12, juz: 28, page: 558 },
  { number: 66, name: "التَّحْرِيم", englishName: "At-Tahrim", englishMeaning: "The Prohibition", type: "Medinan", ayahCount: 12, juz: 28, page: 560 },
  { number: 67, name: "المُلْك", englishName: "Al-Mulk", englishMeaning: "The Sovereignty", type: "Meccan", ayahCount: 30, juz: 29, page: 562 },
  { number: 68, name: "القَلَم", englishName: "Al-Qalam", englishMeaning: "The Pen", type: "Meccan", ayahCount: 52, juz: 29, page: 564 },
  { number: 69, name: "الحَاقَّة", englishName: "Al-Haqqah", englishMeaning: "The Reality", type: "Meccan", ayahCount: 52, juz: 29, page: 566 },
  { number: 70, name: "المَعَارِج", englishName: "Al-Ma'arij", englishMeaning: "The Ascending Stairways", type: "Meccan", ayahCount: 44, juz: 29, page: 568 },
  { number: 71, name: "نُوح", englishName: "Nuh", englishMeaning: "Noah", type: "Meccan", ayahCount: 28, juz: 29, page: 570 },
  { number: 72, name: "الجِنّ", englishName: "Al-Jinn", englishMeaning: "The Jinn", type: "Meccan", ayahCount: 28, juz: 29, page: 572 },
  { number: 73, name: "المُزَّمِّل", englishName: "Al-Muzzammil", englishMeaning: "The Enshrouded One", type: "Meccan", ayahCount: 20, juz: 29, page: 574 },
  { number: 74, name: "المُدَّثِّر", englishName: "Al-Muddaththir", englishMeaning: "The Cloaked One", type: "Meccan", ayahCount: 56, juz: 29, page: 575 },
  { number: 75, name: "القِيَامَة", englishName: "Al-Qiyamah", englishMeaning: "The Resurrection", type: "Meccan", ayahCount: 40, juz: 29, page: 577 },
  { number: 76, name: "الإِنْسَان", englishName: "Al-Insan", englishMeaning: "Man", type: "Medinan", ayahCount: 31, juz: 29, page: 578 },
  { number: 77, name: "المُرْسَلَات", englishName: "Al-Mursalat", englishMeaning: "The Emissaries", type: "Meccan", ayahCount: 50, juz: 29, page: 580 },
  { number: 78, name: "النَّبَأ", englishName: "An-Naba", englishMeaning: "The Tidings", type: "Meccan", ayahCount: 40, juz: 30, page: 582 },
  { number: 79, name: "النَّازِعَات", englishName: "An-Nazi'at", englishMeaning: "Those Who Drag Forth", type: "Meccan", ayahCount: 46, juz: 30, page: 583 },
  { number: 80, name: "عَبَسَ", englishName: "'Abasa", englishMeaning: "He Frowned", type: "Meccan", ayahCount: 42, juz: 30, page: 585 },
  { number: 81, name: "التَّكْوِير", englishName: "At-Takwir", englishMeaning: "The Overthrowing", type: "Meccan", ayahCount: 29, juz: 30, page: 586 },
  { number: 82, name: "الانْفِطَار", englishName: "Al-Infitar", englishMeaning: "The Cleaving", type: "Meccan", ayahCount: 19, juz: 30, page: 587 },
  { number: 83, name: "المُطَفِّفِين", englishName: "Al-Mutaffifin", englishMeaning: "Defrauding", type: "Meccan", ayahCount: 36, juz: 30, page: 587 },
  { number: 84, name: "الانْشِقَاق", englishName: "Al-Inshiqaq", englishMeaning: "The Splitting Open", type: "Meccan", ayahCount: 25, juz: 30, page: 589 },
  { number: 85, name: "البُرُوج", englishName: "Al-Buruj", englishMeaning: "The Mansions of the Stars", type: "Meccan", ayahCount: 22, juz: 30, page: 590 },
  { number: 86, name: "الطَّارِق", englishName: "At-Tariq", englishMeaning: "The Nightcomer", type: "Meccan", ayahCount: 17, juz: 30, page: 591 },
  { number: 87, name: "الأَعْلَى", englishName: "Al-A'la", englishMeaning: "The Most High", type: "Meccan", ayahCount: 19, juz: 30, page: 591 },
  { number: 88, name: "الغَاشِيَة", englishName: "Al-Ghashiyah", englishMeaning: "The Overwhelming", type: "Meccan", ayahCount: 26, juz: 30, page: 592 },
  { number: 89, name: "الفَجْر", englishName: "Al-Fajr", englishMeaning: "The Dawn", type: "Meccan", ayahCount: 30, juz: 30, page: 593 },
  { number: 90, name: "البَلَد", englishName: "Al-Balad", englishMeaning: "The City", type: "Meccan", ayahCount: 20, juz: 30, page: 594 },
  { number: 91, name: "الشَّمْس", englishName: "Ash-Shams", englishMeaning: "The Sun", type: "Meccan", ayahCount: 15, juz: 30, page: 595 },
  { number: 92, name: "اللَّيْل", englishName: "Al-Layl", englishMeaning: "The Night", type: "Meccan", ayahCount: 21, juz: 30, page: 595 },
  { number: 93, name: "الضُّحَى", englishName: "Ad-Duha", englishMeaning: "The Morning Hours", type: "Meccan", ayahCount: 11, juz: 30, page: 596 },
  { number: 94, name: "الشَّرْح", englishName: "Ash-Sharh", englishMeaning: "The Relief", type: "Meccan", ayahCount: 8, juz: 30, page: 596 },
  { number: 95, name: "التِّين", englishName: "At-Tin", englishMeaning: "The Fig", type: "Meccan", ayahCount: 8, juz: 30, page: 597 },
  { number: 96, name: "العَلَق", englishName: "Al-'Alaq", englishMeaning: "The Clot", type: "Meccan", ayahCount: 19, juz: 30, page: 597 },
  { number: 97, name: "القَدْر", englishName: "Al-Qadr", englishMeaning: "The Power", type: "Meccan", ayahCount: 5, juz: 30, page: 598 },
  { number: 98, name: "البَيِّنَة", englishName: "Al-Bayyinah", englishMeaning: "The Clear Proof", type: "Medinan", ayahCount: 8, juz: 30, page: 598 },
  { number: 99, name: "الزَّلْزَلَة", englishName: "Az-Zalzalah", englishMeaning: "The Earthquake", type: "Medinan", ayahCount: 8, juz: 30, page: 599 },
  { number: 100, name: "العَادِيَات", englishName: "Al-'Adiyat", englishMeaning: "The Courser", type: "Meccan", ayahCount: 11, juz: 30, page: 599 },
  { number: 101, name: "القَارِعَة", englishName: "Al-Qari'ah", englishMeaning: "The Calamity", type: "Meccan", ayahCount: 11, juz: 30, page: 600 },
  { number: 102, name: "التَّكَاثُر", englishName: "At-Takathur", englishMeaning: "The Rivalry in World Increase", type: "Meccan", ayahCount: 8, juz: 30, page: 600 },
  { number: 103, name: "العَصْر", englishName: "Al-'Asr", englishMeaning: "The Declining Day", type: "Meccan", ayahCount: 3, juz: 30, page: 601 },
  { number: 104, name: "الهُمَزَة", englishName: "Al-Humazah", englishMeaning: "The Traducer", type: "Meccan", ayahCount: 9, juz: 30, page: 601 },
  { number: 105, name: "الفِيل", englishName: "Al-Fil", englishMeaning: "The Elephant", type: "Meccan", ayahCount: 5, juz: 30, page: 601 },
  { number: 106, name: "قُرَيْش", englishName: "Quraysh", englishMeaning: "Quraysh", type: "Meccan", ayahCount: 4, juz: 30, page: 602 },
  { number: 107, name: "المَاعُون", englishName: "Al-Ma'un", englishMeaning: "Small Kindnesses", type: "Meccan", ayahCount: 7, juz: 30, page: 602 },
  { number: 108, name: "الكَوْثَر", englishName: "Al-Kawthar", englishMeaning: "Abundance", type: "Meccan", ayahCount: 3, juz: 30, page: 602 },
  { number: 109, name: "الكَافِرُون", englishName: "Al-Kafirun", englishMeaning: "The Disbelievers", type: "Meccan", ayahCount: 6, juz: 30, page: 603 },
  { number: 110, name: "النَّصْر", englishName: "An-Nasr", englishMeaning: "Divine Support", type: "Medinan", ayahCount: 3, juz: 30, page: 603 },
  { number: 111, name: "المَسَد", englishName: "Al-Masad", englishMeaning: "Palm Fibre", type: "Meccan", ayahCount: 5, juz: 30, page: 603 },
  { number: 112, name: "الإِخْلَاص", englishName: "Al-Ikhlas", englishMeaning: "Sincerity", type: "Meccan", ayahCount: 4, juz: 30, page: 604 },
  { number: 113, name: "الفَلَق", englishName: "Al-Falaq", englishMeaning: "The Daybreak", type: "Meccan", ayahCount: 5, juz: 30, page: 604 },
  { number: 114, name: "النَّاس", englishName: "An-Nas", englishMeaning: "Mankind", type: "Meccan", ayahCount: 6, juz: 30, page: 604 }
];

export const JUZ_LIST = Array.from({ length: 30 }, (_, i) => {
  const juzNum = i + 1;
  const juzNames = [
    "Alif Lam Meem", "Sayaqool", "Tilka-r-Rusul", "Lan Tanaaloo", "Wal-Muhsanat",
    "La Yuhibbullah", "Wa Iza Sami'oo", "Wa Law Annana", "Qalal Malao", "Wa A'lamoo",
    "Ya'taziroon", "Wa Ma Min Daabbah", "Wa Ma Ubri-oo", "Rubama", "Subhana-llazee",
    "Qal Alam", "Iqtaraba lin-Nas", "Qad Aflaha", "Wa Qalallazina", "Aman Khalaqa",
    "Utlu Ma Oohiya", "Wa Man Yaqnut", "Wa Maliya", "Fa Man Azlamu", "Ilayhi Yuraddu",
    "Ha-Meem", "Qala Fama Khatbukum", "Qad Sami'allah", "Tabaraka-llazee", "'Amma Yatasa'aloon"
  ];
  return {
    number: juzNum,
    title: `Juz ${juzNum}`,
    nameArabic: `الجزء ${juzNum}`,
    nameEnglish: juzNames[i] || `Juz ${juzNum}`,
    pagesCount: juzNum === 30 ? 23 : 20,
    startSurah: SURAH_LIST.find(s => s.juz === juzNum)?.englishName || "Surah"
  };
});

/**
 * Built-in High Quality Offline Quran Surahs with full Arabic text, transliteration, English translation, and audio mapping.
 */
export const BUNDLED_SURAHS = {
  1: {
    number: 1,
    name: "الفَاتِحَة",
    englishName: "Al-Fatihah",
    englishMeaning: "The Opening",
    type: "Meccan",
    ayahCount: 7,
    bismillahPre: false, // In Fatihah, Bismillah is verse 1
    ayahs: [
      {
        numberInSurah: 1,
        arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        transliteration: "Bismillahi-r-Rahmani-r-Raheem",
        translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful."
      },
      {
        numberInSurah: 2,
        arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        transliteration: "Alhamdu lillahi Rabbi-l-'alameen",
        translation: "[All] praise is [due] to Allah, Lord of the worlds -"
      },
      {
        numberInSurah: 3,
        arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
        transliteration: "Ar-Rahmani-r-Raheem",
        translation: "The Entirely Merciful, the Especially Merciful,"
      },
      {
        numberInSurah: 4,
        arabic: "مَالِكِ يَوْمِ الدِّينِ",
        transliteration: "Maliki Yawmi-d-Deen",
        translation: "Sovereign of the Day of Recompense."
      },
      {
        numberInSurah: 5,
        arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        transliteration: "Iyyaka na'budu wa iyyaka nasta'een",
        translation: "It is You we worship and You we ask for help."
      },
      {
        numberInSurah: 6,
        arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
        transliteration: "Ihdina-s-Sirata-l-Mustaqeem",
        translation: "Guide us to the straight path -"
      },
      {
        numberInSurah: 7,
        arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
        transliteration: "Sirata-llazeena an'amta 'alayhim ghayri-l-maghdoobi 'alayhim wa la-d-daalleen",
        translation: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray."
      }
    ]
  },
  67: {
    number: 67,
    name: "المُلْك",
    englishName: "Al-Mulk",
    englishMeaning: "The Sovereignty",
    type: "Meccan",
    ayahCount: 30,
    bismillahPre: true,
    ayahs: [
      {
        numberInSurah: 1,
        arabic: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
        transliteration: "Tabaraka-lladhee biyadihi-l-mulku wa huwa 'ala kulli shay'in qadeer",
        translation: "Blessed is He in whose hand is dominion, and He is over all things competent -"
      },
      {
        numberInSurah: 2,
        arabic: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ",
        transliteration: "Alladhee khalaqa-l-mawta wal-hayata liyabluwakum ayyukum ahsanu 'amalan, wa huwa-l-'Azeezu-l-Ghafoor",
        translation: "[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving -"
      },
      {
        numberInSurah: 3,
        arabic: "الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ",
        transliteration: "Alladhee khalaqa sab'a samawatin tibaqan, ma tara fee khalqi-r-Rahmani min tafawut, farji'i-l-basara hal tara min futoor",
        translation: "[And] who created seven heavens in layers. You see no flaw in the creation of the Most Merciful. So return your vision [to the sky]; do you see any breaks?"
      },
      {
        numberInSurah: 4,
        arabic: "ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ",
        transliteration: "Thumma-rji'i-l-basara karratayni yanqalib ilayka-l-basaru khasi-an wa huwa haseer",
        translation: "Then return [your] vision twice again. [Your] vision will return to you humbled while it is fatigued."
      },
      {
        numberInSurah: 5,
        arabic: "وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ",
        transliteration: "Wa laqad zayyanna-s-sama'a-d-dunya bimasabeeha wa ja'alnaha rujooman li-sh-shayateen, wa a'tadna lahum 'adhaba-s-sa'eer",
        translation: "And We have certainly beautified the nearest heaven with lamps and have made [from] them what is thrown at the devils and have prepared for them the punishment of the Blaze."
      },
      {
        numberInSurah: 6,
        arabic: "وَلِلَّذِينَ كَفَرُوا بِرَبِّهِمْ عَذَابُ جَهَنَّمَ ۖ وَبِئْسَ الْمَصِيرُ",
        transliteration: "Wa lilladheena kafaroo bi-Rabbihim 'adhabu jahannama wa bi'sa-l-maseer",
        translation: "And for those who disbelieved in their Lord is the punishment of Hell, and wretched is the destination."
      },
      {
        numberInSurah: 7,
        arabic: "إِذَا أُلْقُوا فِيهَا سَمِعُوا لَهَا شَهِيقًا وَهِيَ تَفُورُ",
        transliteration: "Idha ulqoo feeha sami'oo laha shaheeqan wa hiya tafoor",
        translation: "When they are thrown into it, they hear from it a dreadful inhaling while it boils up."
      },
      {
        numberInSurah: 8,
        arabic: "تَكَادُ تَمَيَّزُ مِنَ الْغَيْظِ ۖ كُلَّمَا أُلْقِيَ فِيهَا فَوْجٌ سَأَلَهُمْ خَزَنَتُهَا أَلَمْ يَأْتِكُمْ نَذِيرٌ",
        transliteration: "Takadu tamayyazu mina-l-ghayz, kullama ulqiya feeha fawjun sa-alahum khazanatuha alam ya'tikum nadheer",
        translation: "It almost bursts with rage. Every time a group is thrown into it, its keepers ask them, 'Did there not come to you a warner?'"
      },
      {
        numberInSurah: 9,
        arabic: "قَالُوا بَلَىٰ قَدْ جَاءَنَا نَذِيرٌ فَكَذَّبْنَا وَقُلْنَا مَا نَزَّلَ اللَّهُ مِن شَيْءٍ إِنْ أَنتُمْ إِلَّا فِي ضَلَالٍ كَبِيرٍ",
        transliteration: "Qaloo bala qad ja'ana nadheerun fakadhdhabna wa qulna ma nazzala-llahu min shay'in in antum illa fee dalalin kabeer",
        translation: "They will say, 'Yes, a warner had come to us, but we denied and said, 'Allah has not sent down anything. You are not except in great error.'' "
      },
      {
        numberInSurah: 10,
        arabic: "وَقَالُوا لَوْ كُنَّا نَسْمَعُ أَوْ نَعْقِلُ مَا كُنَّا فِي أَصْحَابِ السَّعِيرِ",
        transliteration: "Wa qaloo law kunna nasma'u aw na'qilu ma kunna fee as-habi-s-sa'eer",
        translation: "And they will say, 'If only we had been listening or reasoning, we would not be among the companions of the Blaze.'"
      },
      {
        numberInSurah: 11,
        arabic: "فَاعْتَرَفُوا بِذَنبِهِمْ فَسُحْقًا لِّأَصْحَابِ السَّعِيرِ",
        transliteration: "Fa'tarafoo bidhanbihim fasuhqan li-as-habi-s-sa'eer",
        translation: "And they will admit their sin, so [it is] alienation for the companions of the Blaze."
      },
      {
        numberInSurah: 12,
        arabic: "إِنَّ الَّذِينَ يَخْشَوْنَ رَبَّهُم بِالْغَيْبِ لَهُم مَّغْفِرَةٌ وَأَجْرٌ كَبِيرٌ",
        transliteration: "Inna-lladheena yakhshawna Rabbahum bil-ghaybi lahum maghfiratun wa ajrun kabeer",
        translation: "Indeed, those who fear their Lord unseen will have forgiveness and great reward."
      },
      {
        numberInSurah: 13,
        arabic: "وَأَسِرُّوا قَوْلَكُمْ أَوِ اجْهَرُوا بِهِ ۖ إِنَّهُ عَلِيمٌ بِذَاتِ الصُّدُورِ",
        transliteration: "Wa asirroo qawlakum awi-jharoo bih, innahu 'aleemun bidhati-s-sudoor",
        translation: "And conceal your speech or publicize it; indeed, He is Knowing of that within the breasts."
      },
      {
        numberInSurah: 14,
        arabic: "أَلَا يَعْلَمُ مَنْ خَلَقَ وَهُوَ اللَّطِيفُ الْخَبِيرُ",
        transliteration: "Ala ya'lamu man khalaqa wa huwa-l-Lateefu-l-Khabeer",
        translation: "Does He who created not know, while He is the Subtle, the Acquainted?"
      },
      {
        numberInSurah: 15,
        arabic: "هُوَ الَّذِي جَعَلَ لَكُمُ الْأَرْضَ ذَلُولًا فَامْشُوا فِي مَنَاكِبِهَا وَكُلُوا مِن رِّزْقِهِ ۖ وَإِلَيْهِ النُّشُورُ",
        transliteration: "Huwa-lladhee ja'ala lakumu-l-arda dhaloolan famshoo fee manakibiha wa kuloo min rizqihi wa ilayhi-n-nushoor",
        translation: "It is He who made the earth tame for you - so walk among its slopes and eat of His provision - and to Him is the resurrection."
      },
      {
        numberInSurah: 16,
        arabic: "أَأَمِنتُم مَّن فِي السَّمَاءِ أَن يَخْسِفَ بِكُمُ الْأَرْضَ فَإِذَا هِيَ تَمُورُ",
        transliteration: "A-amintum man fee-s-sama-i an yakhsifa bikumu-l-arda fa-idha hiya tamoor",
        translation: "Do you feel secure that He who [has dominion] in the heaven would not cause the earth to swallow you and suddenly it sways?"
      },
      {
        numberInSurah: 17,
        arabic: "أَمْ أَمِنتُم مَّن فِي السَّمَاءِ أَن يُرْسِلَ عَلَيْكُمْ حَاصِبًا ۖ فَسَتَعْلَمُونَ كَيْفَ نَذِيرِ",
        transliteration: "Am amintum man fee-s-sama-i an yursila 'alaykum hasiban, fasata'lamoona kayfa nadheer",
        translation: "Or do you feel secure that He who [has dominion] in the heaven would not send against you a storm of stones? Then you would know how [severe] was My warning."
      },
      {
        numberInSurah: 18,
        arabic: "وَلَقَدْ كَذَّبَ الَّذِينَ مِن قَبْلِهِمْ فَكَيْفَ كَانَ نَكِيرِ",
        transliteration: "Wa laqad kadhdhaba-lladheena min qablihim fakayfa kana nakeer",
        translation: "And already had those before them denied, and how [terrible] was My reproach."
      },
      {
        numberInSurah: 19,
        arabic: "أَوَلَمْ يَرَوْا إِلَى الطَّيْرِ فَوْقَهُمْ صَافَّاتٍ وَيَقْبِضْنَ ۚ مَا يُمْسِكُهُنَّ إِلَّا الرَّحْمَٰنُ ۚ إِنَّهُ بِكُلِّ شَيْءٍ بَصِيرٌ",
        transliteration: "Awalam yaraw ila-t-tayri fawqahum saffatin wa yaqbidn, ma yumsikuhunna illa-r-Rahman, innahu bikulli shay'in baseer",
        translation: "Do they not see the birds above them with wings outspread and [then] folding in? None holds them [aloft] except the Most Merciful. Indeed, He is, of all things, Seeing."
      },
      {
        numberInSurah: 20,
        arabic: "أَمَّنْ هَٰذَا الَّذِي هُوَ جُندٌ لَّكُمْ يَنصُرُكُم مِّن دُونِ الرَّحْمَٰنِ ۚ إِنِ الْكَافِرُونَ إِلَّا فِي غُرُورٍ",
        transliteration: "Amman hadha-lladhee huwa jundun lakum yansurukum min dooni-r-Rahman, ini-l-kafiroona illa fee ghuroor",
        translation: "Or who is it that could be an army for you to aid you other than the Most Merciful? The disbelievers are not but in delusion."
      },
      {
        numberInSurah: 21,
        arabic: "أَمَّنْ هَٰذَا الَّذِي يَرْزُقُكُمْ إِنْ أَمْسَكَ رِزْقَهُ ۚ بَل لَّجُّوا فِي عُتُوٍّ وَنُفُورٍ",
        transliteration: "Amman hadha-lladhee yarzuqukum in amsaka rizqah, bal lajjoo fee 'utuwwin wa nufoor",
        translation: "Or who is it that could provide for you if He withheld His provision? But they have persisted in insolence and aversion."
      },
      {
        numberInSurah: 22,
        arabic: "أَفَمَن يَمْشِي مُكِبًّا عَلَىٰ وَجْهِهِ أَهْدَىٰ أَمَّن يَمْشِي سَوِيًّا عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ",
        transliteration: "Afaman yamshee mukibban 'ala wajhihi ahda amman yamshee sawiyyan 'ala siratin mustaqeem",
        translation: "Then is one who walks fallen on his face better guided or one who walks erect on a straight path?"
      },
      {
        numberInSurah: 23,
        arabic: "قُلْ هُوَ الَّذِي أَنشَأَكُمْ وَجَعَلَ لَكُمُ السَّمْعَ وَالأَبْصَارَ وَالأَفْئِدَةَ ۖ قَلِيلًا مَّا تَشْكُرُونَ",
        transliteration: "Qul huwa-lladhee ansha'akum wa ja'ala lakumu-s-sam'a wal-absara wal-af'idah, qaleelan ma tashkuroon",
        translation: "Say, 'It is He who has produced you and made for you hearing and vision and hearts; little are you grateful.'"
      },
      {
        numberInSurah: 24,
        arabic: "قُلْ هُوَ الَّذِي ذَرَأَكُمْ فِي الأَرْضِ وَإِلَيْهِ تُحْشَرُونَ",
        transliteration: "Qul huwa-lladhee dhara'akum fee-l-ardi wa ilayhi tuhsharoon",
        translation: "Say, 'It is He who has multiplied you throughout the earth, and to Him you will be gathered.'"
      },
      {
        numberInSurah: 25,
        arabic: "وَيَقُولُونَ مَتَىٰ هَٰذَا الْوَعْدُ إِن كُنتُمْ صَادِقِينَ",
        transliteration: "Wa yaqooloona mata hadha-l-wa'du in kuntum sadiqeen",
        translation: "And they say, 'When is this promise, if you should be truthful?'"
      },
      {
        numberInSurah: 26,
        arabic: "قُلْ إِنَّمَا الْعِلْمُ عِندَ اللَّهِ وَإِنَّمَا أَنَا نَذِيرٌ مُّبِينٌ",
        transliteration: "Qul innama-l-'ilmu 'inda-llahi wa innama ana nadheerun mubeen",
        translation: "Say, 'The knowledge is only with Allah, and I am only a clear warner.'"
      },
      {
        numberInSurah: 27,
        arabic: "فَلَمَّا رَأَوْهُ زُلْفَةً سِيئَتْ وُجُوهُ الَّذِينَ كَفَرُوا وَقِيلَ هَٰذَا الَّذِي كُنتُم بِهِ تَدَّعُونَ",
        transliteration: "Falamma ra'awhu zulfatan see-at wujoohu-lladheena kafaroo wa qeela hadha-lladhee kuntum bihi tadda'oon",
        translation: "But when they see it approaching, the faces of those who disbelieve will be distressed, and it will be said, 'This is that for which you used to call.'"
      },
      {
        numberInSurah: 28,
        arabic: "قُلْ أَرَأَيْتُمْ إِنْ أَهْلَكَنِيَ اللَّهُ وَمَن مَّعِيَ أَوْ رَحِمَنَا فَمَن يُجِيرُ الْكَافِرِينَ مِنْ عَذَابٍ أَلِيمٍ",
        transliteration: "Qul ara'aytum in ahlakaniya-llahu wa man ma'iya aw rahimana faman yujeeru-l-kafireena min 'adhabin aleem",
        translation: "Say, [O Muhammad], 'Have you considered: whether Allah should cause my death and those with me or have mercy upon us, who can protect the disbelievers from a painful punishment?'"
      },
      {
        numberInSurah: 29,
        arabic: "قُلْ هُوَ الرَّحْمَٰنُ آمَنَّا بِهِ وَعَلَيْهِ تَوَكَّلْنَا ۖ فَسَتَعْلَمُونَ مَنْ هُوَ فِي ضَلَالٍ مُّبِينٍ",
        transliteration: "Qul huwa-r-Rahmanu amanna bihi wa 'alayhi tawakkalna, fasata'lamoona man huwa fee dalalin mubeen",
        translation: "Say, 'He is the Most Merciful; we have believed in Him, and upon Him we have relied. And you will know who it is that is in clear error.'"
      },
      {
        numberInSurah: 30,
        arabic: "قُلْ أَرَأَيْتُمْ إِنْ أَصْبَحَ مَاؤُكُمْ غَوْرًا فَمَن يَأْتِيكُم بِمَاءٍ مَّعِينٍ",
        transliteration: "Qul ara'aytum in asbaha ma'ukum ghawran faman ya'teekum bima-in ma'een",
        translation: "Say, 'Have you considered: if your water was to become sunken [into the earth], then who could bring you flowing water?'"
      }
    ]
  },
  112: {
    number: 112,
    name: "الإِخْلَاص",
    englishName: "Al-Ikhlas",
    englishMeaning: "Sincerity",
    type: "Meccan",
    ayahCount: 4,
    bismillahPre: true,
    ayahs: [
      {
        numberInSurah: 1,
        arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
        transliteration: "Qul Huwa-llahu Ahad",
        translation: "Say, 'He is Allah, [who is] One,'"
      },
      {
        numberInSurah: 2,
        arabic: "اللَّهُ الصَّمَدُ",
        transliteration: "Allahu-s-Samad",
        translation: "Allah, the Eternal Refuge."
      },
      {
        numberInSurah: 3,
        arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
        transliteration: "Lam yalid wa lam yoolad",
        translation: "He neither begets nor is born,"
      },
      {
        numberInSurah: 4,
        arabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
        transliteration: "Wa lam yakun lahu kufuwan ahad",
        translation: "Nor is there to Him any equivalent."
      }
    ]
  },
  113: {
    number: 113,
    name: "الفَلَق",
    englishName: "Al-Falaq",
    englishMeaning: "The Daybreak",
    type: "Meccan",
    ayahCount: 5,
    bismillahPre: true,
    ayahs: [
      {
        numberInSurah: 1,
        arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
        transliteration: "Qul a'oodhu bi-Rabbi-l-falaq",
        translation: "Say, 'I seek refuge in the Lord of daybreak'"
      },
      {
        numberInSurah: 2,
        arabic: "مِن شَرِّ مَا خَلَقَ",
        transliteration: "Min sharri ma khalaq",
        translation: "From the evil of that which He created"
      },
      {
        numberInSurah: 3,
        arabic: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
        transliteration: "Wa min sharri ghasiqin idha waqab",
        translation: "And from the evil of darkness when it settles"
      },
      {
        numberInSurah: 4,
        arabic: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
        transliteration: "Wa min sharri-n-naffathati fee-l-'uqad",
        translation: "And from the evil of the blowers in knots"
      },
      {
        numberInSurah: 5,
        arabic: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        transliteration: "Wa min sharri hasidin idha hasad",
        translation: "And from the evil of an envier when he envies."
      }
    ]
  },
  114: {
    number: 114,
    name: "النَّاس",
    englishName: "An-Nas",
    englishMeaning: "Mankind",
    type: "Meccan",
    ayahCount: 6,
    bismillahPre: true,
    ayahs: [
      {
        numberInSurah: 1,
        arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
        transliteration: "Qul a'oodhu bi-Rabbi-n-nas",
        translation: "Say, 'I seek refuge in the Lord of mankind,'"
      },
      {
        numberInSurah: 2,
        arabic: "مَلِكِ النَّاسِ",
        transliteration: "Maliki-n-nas",
        translation: "The Sovereign of mankind,"
      },
      {
        numberInSurah: 3,
        arabic: "إِلَٰهِ النَّاسِ",
        transliteration: "Ilahi-n-nas",
        translation: "The God of mankind,"
      },
      {
        numberInSurah: 4,
        arabic: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
        transliteration: "Min sharri-l-waswasi-l-khannas",
        translation: "From the evil of the retreating whisperer -"
      },
      {
        numberInSurah: 5,
        arabic: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
        transliteration: "Alladhee yuwaswisu fee sudoori-n-nas",
        translation: "Who whispers [evil] into the breasts of mankind -"
      },
      {
        numberInSurah: 6,
        arabic: "مِنَ الْجِنَّةِ وَالنَّاسِ",
        transliteration: "Mina-l-jinnati wan-nas",
        translation: "From among the jinn and mankind."
      }
    ]
  },
  108: {
    number: 108,
    name: "الكَوْثَر",
    englishName: "Al-Kawthar",
    englishMeaning: "Abundance",
    type: "Meccan",
    ayahCount: 3,
    bismillahPre: true,
    ayahs: [
      {
        numberInSurah: 1,
        arabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ",
        transliteration: "Inna a'taynaka-l-kawthar",
        translation: "Indeed, We have granted you, [O Muhammad], al-Kawthar."
      },
      {
        numberInSurah: 2,
        arabic: "فَصَلِّ لِرَبِّكَ وَانْحَرْ",
        transliteration: "Fasalli li-Rabbika wan-har",
        translation: "So pray to your Lord and sacrifice [to Him alone]."
      },
      {
        numberInSurah: 3,
        arabic: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ",
        transliteration: "Inna shani'aka huwa-l-abtar",
        translation: "Indeed, your enemy is the one cut off."
      }
    ]
  },
  109: {
    number: 109,
    name: "الكَافِرُون",
    englishName: "Al-Kafirun",
    englishMeaning: "The Disbelievers",
    type: "Meccan",
    ayahCount: 6,
    bismillahPre: true,
    ayahs: [
      {
        numberInSurah: 1,
        arabic: "قُلْ يَا أَيُّهَا الْكَافِرُونَ",
        transliteration: "Qul ya ayyuha-l-kafiroon",
        translation: "Say, 'O disbelievers,'"
      },
      {
        numberInSurah: 2,
        arabic: "لَا أَعْبُدُ مَا تَعْبُدُونَ",
        transliteration: "La a'budu ma ta'budoon",
        translation: "I do not worship what you worship."
      },
      {
        numberInSurah: 3,
        arabic: "وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ",
        transliteration: "Wa la antum 'abidoona ma a'bud",
        translation: "Nor are you worshippers of what I worship."
      },
      {
        numberInSurah: 4,
        arabic: "وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ",
        transliteration: "Wa la ana 'abidum-ma 'abadtum",
        translation: "Nor will I be a worshipper of what you worship."
      },
      {
        numberInSurah: 5,
        arabic: "وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ",
        transliteration: "Wa la antum 'abidoona ma a'bud",
        translation: "Nor will you be worshippers of what I worship."
      },
      {
        numberInSurah: 6,
        arabic: "لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
        transliteration: "Lakum deenukum wa liya deen",
        translation: "For you is your religion, and for me is my religion."
      }
    ]
  },
  110: {
    number: 110,
    name: "النَّصْر",
    englishName: "An-Nasr",
    englishMeaning: "Divine Support",
    type: "Medinan",
    ayahCount: 3,
    bismillahPre: true,
    ayahs: [
      {
        numberInSurah: 1,
        arabic: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ",
        transliteration: "Idha ja'a nasru-llahi wal-fath",
        translation: "When the victory of Allah has come and the conquest,"
      },
      {
        numberInSurah: 2,
        arabic: "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا",
        transliteration: "Wa ra'ayta-n-nasa yadkhuloona fee deeni-llahi afwaja",
        translation: "And you see the people entering into the religion of Allah in multitudes,"
      },
      {
        numberInSurah: 3,
        arabic: "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا",
        transliteration: "Fasabbih bihamdi Rabbika wastaghfirh, innahu kana Tawwaba",
        translation: "Then exalt [Him] with praise of your Lord and ask forgiveness of Him. Indeed, He is ever Accepting of repentance."
      }
    ]
  },
  93: {
    number: 93,
    name: "الضُّحَى",
    englishName: "Ad-Duha",
    englishMeaning: "The Morning Hours",
    type: "Meccan",
    ayahCount: 11,
    bismillahPre: true,
    ayahs: [
      { numberInSurah: 1, arabic: "وَالضُّحَىٰ", transliteration: "Wad-duha", translation: "By the morning brightness" },
      { numberInSurah: 2, arabic: "وَاللَّيْلِ إِذَا سَجَىٰ", transliteration: "Wal-layli idha saja", translation: "And [by] the night when it covers with darkness," },
      { numberInSurah: 3, arabic: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ", transliteration: "Ma wadda'aka Rabbuka wa ma qala", translation: "Your Lord has not taken leave of you, [O Muhammad], nor has He detested [you]." },
      { numberInSurah: 4, arabic: "وَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَىٰ", transliteration: "Wa lal-akhiratu khayrul-laka minal-oola", translation: "And the Hereafter is better for you than the first [life]." },
      { numberInSurah: 5, arabic: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ", transliteration: "Wa lasawfa yu'teeka Rabbuka fatarda", translation: "And your Lord is going to give you, and you will be satisfied." },
      { numberInSurah: 6, arabic: "أَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ", transliteration: "Alam yajidka yateeman fa-awa", translation: "Did He not find you an orphan and give [you] refuge?" },
      { numberInSurah: 7, arabic: "وَوَجَدَكَ ضَالًّا فَهَدَىٰ", transliteration: "Wa wajadaka daallan fahada", translation: "And He found you lost and guided [you]," },
      { numberInSurah: 8, arabic: "وَوَجَدَكَ عَائِلًا فَأَغْنَىٰ", transliteration: "Wa wajadaka 'a-ilan fa-aghna", translation: "And He found you poor and made [you] self-sufficient." },
      { numberInSurah: 9, arabic: "فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ", transliteration: "Fa ammal-yateema fala taqhar", translation: "So as for the orphan, do not oppress [him]." },
      { numberInSurah: 10, arabic: "وَأَمَّا السَّائِلَ فَلَا تَنْهَرْ", transliteration: "Wa ammas-sa-ila fala tanhar", translation: "And as for the petitioner, do not repel [him]." },
      { numberInSurah: 11, arabic: "وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ", transliteration: "Wa amma bini'mati Rabbika fahaddith", translation: "But as for the favor of your Lord, report [it]." }
    ]
  },
  94: {
    number: 94,
    name: "الشَّرْح",
    englishName: "Ash-Sharh",
    englishMeaning: "The Relief",
    type: "Meccan",
    ayahCount: 8,
    bismillahPre: true,
    ayahs: [
      { numberInSurah: 1, arabic: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ", transliteration: "Alam nashrah laka sadrak", translation: "Did We not expand for you, [O Muhammad], your breast?" },
      { numberInSurah: 2, arabic: "وَوَضَعْنَا عَنكَ وِزْرَكَ", transliteration: "Wa wada'na 'anka wizrak", translation: "And We removed from you your burden" },
      { numberInSurah: 3, arabic: "الَّذِي أَنقَضَ ظَهْرَكَ", transliteration: "Alladhee anqada zahrak", translation: "Which had weighed upon your back" },
      { numberInSurah: 4, arabic: "وَرَفَعْنَا لَكَ ذِكْرَكَ", transliteration: "Wa rafa'na laka dhikrak", translation: "And raised high for you your repute." },
      { numberInSurah: 5, arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", transliteration: "Fa inna ma'al-'usri yusra", translation: "For indeed, with hardship [will be] ease." },
      { numberInSurah: 6, arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", transliteration: "Inna ma'al-'usri yusra", translation: "Indeed, with hardship [will be] ease." },
      { numberInSurah: 7, arabic: "فَإِذَا فَرَغْتَ فَانصَبْ", transliteration: "Fa idha faraghta fansab", translation: "So when you have finished [your duties], then stand up [for worship]." },
      { numberInSurah: 8, arabic: "وَإِلَىٰ رَبِّكَ فَارْغَب", transliteration: "Wa ila Rabbika farghab", translation: "And to your Lord direct [your] longing." }
    ]
  },
  103: {
    number: 103,
    name: "العَصْر",
    englishName: "Al-'Asr",
    englishMeaning: "The Declining Day",
    type: "Meccan",
    ayahCount: 3,
    bismillahPre: true,
    ayahs: [
      { numberInSurah: 1, arabic: "وَالْعَصْرِ", transliteration: "Wal-'asr", translation: "By time," },
      { numberInSurah: 2, arabic: "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ", transliteration: "Innal-insana lafee khusr", translation: "Indeed, mankind is in loss," },
      { numberInSurah: 3, arabic: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ", transliteration: "Illal-ladheena amanoo wa 'amilus-salihati wa tawwasaw bil-haqqi wa tawwasaw bis-sabr", translation: "Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience." }
    ]
  }
};

/**
 * Inspiring Quran Verses for Daily Reflection.
 */
export const DAILY_REFLECTIONS = [
  {
    surah: "Al-Baqarah",
    ayahRef: "2:286",
    arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    translation: "Allah does not burden a soul beyond that it can bear.",
    theme: "Hope & Strength"
  },
  {
    surah: "Ash-Sharh",
    ayahRef: "94:5-6",
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "Indeed, with hardship comes ease.",
    theme: "Patience & Relief"
  },
  {
    surah: "Al-Baqarah",
    ayahRef: "2:152",
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
    translation: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
    theme: "Gratitude & Remembrance"
  },
  {
    surah: "Az-Zumar",
    ayahRef: "39:53",
    arabic: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا",
    translation: "Say, 'O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins.'",
    theme: "Divine Mercy"
  },
  {
    surah: "At-Talaq",
    ayahRef: "65:3",
    arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    translation: "And whoever relies upon Allah - then He is sufficient for him.",
    theme: "Tawakkul (Trust in Allah)"
  },
  {
    surah: "Al-Anbiya",
    ayahRef: "21:87",
    arabic: "لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
    translation: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
    theme: "Forgiveness & Relief from Distress"
  },
  {
    surah: "Al-Mulk",
    ayahRef: "67:14",
    arabic: "أَلَا يَعْلَمُ مَنْ خَلَقَ وَهُوَ اللَّطِيفُ الْخَبِيرُ",
    translation: "Does He who created not know, while He is the Subtle, the Acquainted?",
    theme: "Peace of Mind"
  }
];

export const POPULAR_SURAH_NUMBERS = [1, 18, 36, 55, 56, 67, 93, 112, 113, 114];
