import { SURAH_LIST } from '$lib/data/quranData.js';

export const SURAH_ALIASES = {
  fatihah: 1, fatiha: 1, faatiha: 1, opening: 1,
  baqarah: 2, baqara: 2, cow: 2,
  imran: 3, aaleimran: 3, aliimran: 3, familyofimran: 3,
  nisa: 4, nisaa: 4, women: 4,
  maidah: 5, maida: 5, tablespread: 5, table: 5,
  anam: 6, cattle: 6,
  araf: 7, heights: 7,
  anfal: 8, spoils: 8,
  tawbah: 9, taubah: 9, tawba: 9, repentance: 9,
  yunus: 10, jonah: 10,
  hud: 11,
  yusuf: 12, joseph: 12,
  rad: 13, thunder: 13,
  ibrahim: 14, abraham: 14,
  hijr: 15,
  nahl: 16, bee: 16,
  isra: 17, israil: 17, israel: 17, nightjourney: 17,
  kahf: 18, cave: 18,
  maryam: 19, mary: 19,
  taha: 20,
  anbiya: 21, prophets: 21,
  hajj: 22, pilgrimage: 22,
  muminun: 23, believers: 23,
  nur: 24, light: 24,
  furqan: 25, criterion: 25,
  shuara: 26, poets: 26,
  naml: 27, ant: 27,
  qasas: 28, stories: 28,
  ankabut: 29, spider: 29,
  rum: 30, romans: 30,
  luqman: 31,
  sajdah: 32, prostration: 32,
  ahzab: 33, combinedforces: 33,
  saba: 34, sheba: 34,
  fatir: 35, originator: 35,
  yasin: 36, yaseen: 36,
  saffat: 37,
  sad: 38,
  zumar: 39, troops: 39,
  ghafir: 40, forgiver: 40,
  fussilat: 41,
  shura: 42, consultation: 42,
  zukhruf: 43,
  dukhan: 44, smoke: 44,
  jathiyah: 45,
  ahqaf: 46,
  muhammad: 47,
  fath: 48, victory: 48,
  hujurat: 49,
  qaf: 50,
  dhariyat: 51,
  tur: 52, mount: 52,
  najm: 53, star: 53,
  qamar: 54, moon: 54,
  rahman: 55, beneficent: 55, merciful: 55,
  waqiah: 56, waqia: 56,
  hadid: 57, iron: 57,
  mujadila: 58,
  hashr: 59,
  mumtahanah: 60,
  saff: 61,
  jumuah: 62, jummah: 62, friday: 62,
  munafiqun: 63, hypocrites: 63,
  taghabun: 64,
  talaq: 65, divorce: 65,
  tahrim: 66, prohibition: 66,
  mulk: 67, dominion: 67, kingdom: 67,
  qalam: 68, pen: 68,
  haqqah: 69,
  maarij: 70,
  nuh: 71, noah: 71,
  jinn: 72,
  muzzammil: 73,
  muddathir: 74,
  qiyamah: 75, resurrection: 75,
  insan: 76, dahr: 76,
  mursalat: 77,
  naba: 78, tidings: 78,
  naziat: 79,
  abasa: 80,
  takwir: 81,
  infitar: 82,
  mutaffifin: 83,
  inshiqaq: 84,
  buruj: 85,
  tariq: 86,
  ala: 87,
  ghashiyah: 88,
  fajr: 89, dawn: 89,
  balad: 90, city: 90,
  shams: 91, sun: 91,
  layl: 92, night: 92,
  duha: 93,
  sharh: 94, inshirah: 94,
  tin: 95, fig: 95,
  alaq: 96, clot: 96,
  qadr: 97, power: 97,
  bayyinah: 98,
  zalzalah: 99, earthquake: 99,
  adiyat: 100,
  qariah: 101,
  takathur: 102,
  asr: 103, time: 103,
  humazah: 104,
  fil: 105, elephant: 105,
  quraysh: 106, quraish: 106,
  maun: 107,
  kawthar: 108,
  kafirun: 109,
  nasr: 110,
  masad: 111, lahab: 111,
  ikhlas: 112, purity: 112,
  falaq: 113, daybreak: 113,
  nas: 114, mankind: 114
};

/**
 * Robustly detects Surah number (1-114) from user-entered text, title, or query.
 * Matches explicit numbers, English transliterations, aliases, and Arabic text.
 */
export function detectSurahFromText(text) {
  if (!text) return null;
  const s = String(text).trim().toLowerCase();
  if (!s) return null;

  // 1. Explicit surah number like 'surah 5' or 'surah 18:' or 'surah 18'
  const surahNumMatch = s.match(/(?:surah|sura|chapter)\s*[:#\s-]*\s*(\b(?:11[0-4]|10\d|[1-9]\d?)\b)/i);
  if (surahNumMatch) {
    const num = parseInt(surahNumMatch[1], 10);
    if (num >= 1 && num <= 114) return num;
  }

  // 2. Number at start like '18. Al-Kahf' or '18: Al-Kahf' or '18 - Al-Kahf'
  const startNumMatch = s.match(/^\s*(\b(?:11[0-4]|10\d|[1-9]\d?)\b)\s*[:.-]/);
  if (startNumMatch) {
    const num = parseInt(startNumMatch[1], 10);
    if (num >= 1 && num <= 114) return num;
  }

  // 3. Word-by-word alias checking (e.g., 'maida', 'baqarah', 'mulk')
  const words = s.match(/[a-z]+/g) || [];
  for (const w of words) {
    if (SURAH_ALIASES[w]) return SURAH_ALIASES[w];
    const withoutAl = w.replace(/^al/, '');
    if (withoutAl && SURAH_ALIASES[withoutAl]) return SURAH_ALIASES[withoutAl];
  }

  // 4. Substring check against aliases (e.g. 'al-maidah' -> clean 'maidah')
  const clean = s.replace(/[^a-z0-9]/g, '');
  for (const [alias, num] of Object.entries(SURAH_ALIASES)) {
    if (clean.includes(alias)) {
      return num;
    }
  }

  // 5. Match against SURAH_LIST entries directly
  for (const item of SURAH_LIST) {
    const eng = item.englishName.toLowerCase().replace(/[^a-z]/g, '');
    const engClean = eng.replace(/^al/, '');
    if (clean.includes(eng) || (engClean.length >= 3 && clean.includes(engClean))) {
      return item.number;
    }
    if (s.includes(item.name)) {
      return item.number;
    }
  }

  // 6. Fallback standalone number between 1 and 114
  const fallbackNumMatch = s.match(/\b(11[0-4]|10\d|[1-9]\d?)\b/);
  if (fallbackNumMatch) {
    const num = parseInt(fallbackNumMatch[1], 10);
    if (num >= 1 && num <= 114) return num;
  }

  return null;
}

export function getSurahMeta(numOrText) {
  let num = typeof numOrText === 'number' ? numOrText : detectSurahFromText(numOrText);
  if (!num || num < 1 || num > 114) num = 2; // Default to Al-Baqarah
  return SURAH_LIST.find((s) => s.number === num) || SURAH_LIST[1];
}
