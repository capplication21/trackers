import { storageBridge } from './storageBridge.js';
import { SURAH_LIST, JUZ_LIST, BUNDLED_SURAHS, DAILY_REFLECTIONS } from '$lib/data/quranData.js';
import { triggerHaptic } from '$lib/utils/haptics.js';

class QuranStore {
  // Navigation & View
  activeView = $state('directory'); // 'directory' | 'reader' | 'khatmah' | 'bookmarks'
  searchQuery = $state('');
  filterType = $state('all'); // 'all' | 'meccan' | 'medinan' | 'popular' | 'juz'
  selectedJuzFilter = $state(1);

  // Active Surah & Ayahs
  currentSurahNumber = $state(1);
  currentSurahData = $state(BUNDLED_SURAHS[1]);
  isLoadingSurah = $state(false);
  loadError = $state(null);

  // Reading Options
  readingMode = $state('verses'); // 'verses' | 'mushaf'
  arabicFontSize = $state(28); // in px
  showTranslation = $state(true);
  showTransliteration = $state(true);

  // Audio Player State
  isPlaying = $state(false);
  currentPlayingAyah = $state(null); // numberInSurah
  audioLoading = $state(false);
  audioElement = null;
  audioReciter = $state('ar.alafasy'); // Mishary Rashid Al-Afasy

  // Khatmah & Tracking
  khatmah = $state({
    pagesRead: 0,
    targetDays: 30,
    completedJuz: [],
    logs: []
  });

  // Last Read Bookmark
  lastRead = $state({
    surahNumber: 1,
    surahName: 'Al-Fatihah',
    ayahNumber: 1,
    timestamp: Date.now()
  });

  // Bookmarks
  bookmarks = $state([]);

  // Daily Reflection
  dailyReflection = $state(DAILY_REFLECTIONS[0]);

  constructor() {
    this.pickDailyReflection();
  }

  pickDailyReflection() {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const index = Math.abs(dayOfYear) % DAILY_REFLECTIONS.length;
    this.dailyReflection = DAILY_REFLECTIONS[index];
  }

  async init() {
    try {
      // 1. Load Last Read
      const savedLastRead = await storageBridge.getItem('quran_last_read_v1');
      if (savedLastRead && typeof savedLastRead === 'object' && savedLastRead.surahNumber) {
        this.lastRead = savedLastRead;
      }

      // 2. Load Khatmah Tracker
      const savedKhatmah = await storageBridge.getItem('quran_khatmah_v1');
      if (savedKhatmah && typeof savedKhatmah === 'object') {
        this.khatmah = {
          pagesRead: Number(savedKhatmah.pagesRead) || 0,
          targetDays: Number(savedKhatmah.targetDays) || 30,
          completedJuz: Array.isArray(savedKhatmah.completedJuz) ? savedKhatmah.completedJuz : [],
          logs: Array.isArray(savedKhatmah.logs) ? savedKhatmah.logs : []
        };
      }

      // 3. Load Bookmarks
      const savedBookmarks = await storageBridge.getItem('quran_bookmarks_v1');
      if (Array.isArray(savedBookmarks)) {
        this.bookmarks = savedBookmarks;
      }

      // 4. Load Reader Settings
      const savedSettings = await storageBridge.getItem('quran_settings_v1');
      if (savedSettings && typeof savedSettings === 'object') {
        if (typeof savedSettings.arabicFontSize === 'number') this.arabicFontSize = savedSettings.arabicFontSize;
        if (typeof savedSettings.showTranslation === 'boolean') this.showTranslation = savedSettings.showTranslation;
        if (typeof savedSettings.showTransliteration === 'boolean') this.showTransliteration = savedSettings.showTransliteration;
        if (typeof savedSettings.readingMode === 'string') this.readingMode = savedSettings.readingMode;
      }

      // Load initial surah if reader is directly accessed
      await this.loadSurah(this.lastRead?.surahNumber || 1, false);
    } catch (err) {
      console.warn('Failed to initialize Quran store:', err);
    }
  }

  async saveSettings() {
    try {
      await storageBridge.setItem('quran_settings_v1', {
        arabicFontSize: this.arabicFontSize,
        showTranslation: this.showTranslation,
        showTransliteration: this.showTransliteration,
        readingMode: this.readingMode
      });
    } catch (e) {
      console.warn('Error saving quran settings:', e);
    }
  }

  async loadSurah(surahNum, navigateToReader = true) {
    const meta = SURAH_LIST.find((s) => s.number === surahNum);
    if (!meta) return;

    this.stopAudio();
    this.currentSurahNumber = surahNum;
    this.isLoadingSurah = true;
    this.loadError = null;

    if (navigateToReader) {
      this.activeView = 'reader';
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    // 1. Check Bundled offline Surahs
    if (BUNDLED_SURAHS[surahNum]) {
      this.currentSurahData = BUNDLED_SURAHS[surahNum];
      this.isLoadingSurah = false;
      this.saveLastRead(surahNum, 1);
      return;
    }

    // 2. Check local cached surahs in storageBridge
    try {
      const cacheKey = `quran_cache_surah_${surahNum}`;
      const cached = await storageBridge.getItem(cacheKey);
      if (cached && Array.isArray(cached.ayahs) && cached.ayahs.length > 0) {
        this.currentSurahData = cached;
        this.isLoadingSurah = false;
        this.saveLastRead(surahNum, 1);
        return;
      }
    } catch (e) {
      console.warn('Cache read error:', e);
    }

    // 3. Online fetch from Al-Quran Cloud API
    try {
      // Free public Al-Quran Cloud API for Uthmani script and Sahih International translation
      const url = `https://api.alquran.cloud/v1/surah/${surahNum}/editions/quran-uthmani,en.sahih`;
      const response = await fetch(url, { cache: 'force-cache' });
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      if (data && data.data && data.data.length >= 2) {
        const arabicData = data.data[0];
        const englishData = data.data[1];

        const ayahs = arabicData.ayahs.map((ay, idx) => {
          const engAyah = englishData.ayahs[idx] || {};
          let arabicText = ay.text;
          // Strip bismillah prefix for verse 1 except Surah 1 & 9 if needed
          if (surahNum !== 1 && surahNum !== 9 && idx === 0) {
            arabicText = arabicText.replace(/^بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\s*/, '');
          }
          return {
            numberInSurah: ay.numberInSurah,
            globalNumber: ay.number,
            arabic: arabicText,
            translation: engAyah.text || '',
            transliteration: ''
          };
        });

        const newSurahObj = {
          number: meta.number,
          name: meta.name,
          englishName: meta.englishName,
          englishMeaning: meta.englishMeaning,
          type: meta.type,
          ayahCount: meta.ayahCount,
          bismillahPre: surahNum !== 1 && surahNum !== 9,
          ayahs
        };

        this.currentSurahData = newSurahObj;
        this.saveLastRead(surahNum, 1);

        // Save to cache for offline access next time!
        try {
          await storageBridge.setItem(`quran_cache_surah_${surahNum}`, newSurahObj);
        } catch {}
      } else {
        throw new Error('Invalid Quran data format returned.');
      }
    } catch (err) {
      console.warn(`Online fetch for Surah ${surahNum} failed:`, err);
      this.loadError = `Unable to fetch Surah ${meta.englishName} online. Please verify your internet connection. You can still read the bundled Surahs (Al-Fatihah, Al-Mulk, Al-Ikhlas, etc.) anytime offline!`;
      // Graceful fallback to basic outline
      this.currentSurahData = {
        number: meta.number,
        name: meta.name,
        englishName: meta.englishName,
        englishMeaning: meta.englishMeaning,
        type: meta.type,
        ayahCount: meta.ayahCount,
        bismillahPre: surahNum !== 1 && surahNum !== 9,
        ayahs: []
      };
    } finally {
      this.isLoadingSurah = false;
    }
  }

  async saveLastRead(surahNumber, ayahNumber = 1) {
    const meta = SURAH_LIST.find((s) => s.number === surahNumber);
    if (!meta) return;

    this.lastRead = {
      surahNumber,
      surahName: meta.englishName,
      surahArabic: meta.name,
      ayahNumber,
      timestamp: Date.now()
    };

    try {
      await storageBridge.setItem('quran_last_read_v1', this.lastRead);
    } catch (e) {
      console.warn('Failed saving last read:', e);
    }
  }

  // Bookmarking
  isBookmarked(surahNum, ayahNum) {
    return this.bookmarks.some((b) => b.surahNumber === surahNum && b.ayahNumber === ayahNum);
  }

  async toggleBookmark(ayah) {
    triggerHaptic('selection');
    const existingIndex = this.bookmarks.findIndex(
      (b) => b.surahNumber === this.currentSurahNumber && b.ayahNumber === ayah.numberInSurah
    );

    if (existingIndex >= 0) {
      this.bookmarks = this.bookmarks.filter((_, idx) => idx !== existingIndex);
    } else {
      const meta = SURAH_LIST.find((s) => s.number === this.currentSurahNumber);
      const newBm = {
        id: `bm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        surahNumber: this.currentSurahNumber,
        surahName: meta?.englishName || `Surah ${this.currentSurahNumber}`,
        ayahNumber: ayah.numberInSurah,
        arabic: ayah.arabic,
        translation: ayah.translation,
        date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
      };
      this.bookmarks = [newBm, ...this.bookmarks];
    }

    try {
      await storageBridge.setItem('quran_bookmarks_v1', this.bookmarks);
    } catch (e) {
      console.warn('Failed saving bookmarks:', e);
    }
  }

  async removeBookmark(id) {
    triggerHaptic('light');
    this.bookmarks = this.bookmarks.filter((b) => b.id !== id);
    try {
      await storageBridge.setItem('quran_bookmarks_v1', this.bookmarks);
    } catch (e) {}
  }

  // Khatmah Tracker Methods
  async logPages(count) {
    triggerHaptic('medium');
    const newPages = Math.min(604, Math.max(0, this.khatmah.pagesRead + count));
    const today = new Date().toISOString().split('T')[0];

    const logs = [...this.khatmah.logs];
    const todayLogIndex = logs.findIndex((l) => l.date === today);
    if (todayLogIndex >= 0) {
      logs[todayLogIndex].pages += count;
    } else {
      logs.push({ date: today, pages: count });
    }

    this.khatmah = {
      ...this.khatmah,
      pagesRead: newPages,
      logs: logs.slice(-30)
    };

    try {
      await storageBridge.setItem('quran_khatmah_v1', this.khatmah);
    } catch (e) {}
  }

  async setTargetDays(days) {
    this.khatmah = {
      ...this.khatmah,
      targetDays: Math.max(1, Number(days) || 30)
    };
    try {
      await storageBridge.setItem('quran_khatmah_v1', this.khatmah);
    } catch (e) {}
  }

  async toggleJuzCompletion(juzNum) {
    triggerHaptic('selection');
    let completed = [...this.khatmah.completedJuz];
    if (completed.includes(juzNum)) {
      completed = completed.filter((j) => j !== juzNum);
    } else {
      completed.push(juzNum);
    }

    this.khatmah = {
      ...this.khatmah,
      completedJuz: completed
    };

    try {
      await storageBridge.setItem('quran_khatmah_v1', this.khatmah);
    } catch (e) {}
  }

  async resetKhatmah() {
    if (typeof window !== 'undefined' && !window.confirm('Start a new Khatmah cycle? (This resets pages read and completed Juz)')) {
      return;
    }
    this.khatmah = {
      pagesRead: 0,
      targetDays: 30,
      completedJuz: [],
      logs: []
    };
    try {
      await storageBridge.setItem('quran_khatmah_v1', this.khatmah);
    } catch (e) {}
  }

  // Audio Playback Engine
  playAyahAudio(ayah) {
    if (typeof window === 'undefined') return;

    // If currently playing this exact ayah, toggle pause
    if (this.isPlaying && this.currentPlayingAyah === ayah.numberInSurah) {
      this.pauseAudio();
      return;
    }

    this.stopAudio();

    this.currentPlayingAyah = ayah.numberInSurah;
    this.audioLoading = true;

    // EveryAyah audio URL format:
    // e.g. https://everyayah.com/data/Alafasy_128kbps/001001.mp3
    const sStr = String(this.currentSurahNumber).padStart(3, '0');
    const aStr = String(ayah.numberInSurah).padStart(3, '0');
    const audioUrl = `https://everyayah.com/data/Alafasy_128kbps/${sStr}${aStr}.mp3`;

    this.audioElement = new Audio(audioUrl);

    this.audioElement.oncanplay = () => {
      this.audioLoading = false;
      this.isPlaying = true;
    };

    this.audioElement.onended = () => {
      this.isPlaying = false;
      // Auto advance to next verse in the surah!
      const nextIndex = this.currentSurahData.ayahs.findIndex((a) => a.numberInSurah === ayah.numberInSurah) + 1;
      if (nextIndex < this.currentSurahData.ayahs.length) {
        this.playAyahAudio(this.currentSurahData.ayahs[nextIndex]);
      } else {
        this.currentPlayingAyah = null;
      }
    };

    this.audioElement.onerror = () => {
      console.warn('Audio playback error for verse:', audioUrl);
      this.audioLoading = false;
      this.isPlaying = false;
      this.currentPlayingAyah = null;
    };

    this.audioElement.play().catch((err) => {
      console.warn('Audio play request interrupted:', err);
      this.audioLoading = false;
      this.isPlaying = false;
    });
  }

  pauseAudio() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.isPlaying = false;
    }
  }

  resumeAudio() {
    if (this.audioElement && this.currentPlayingAyah) {
      this.audioElement.play().catch(() => {});
      this.isPlaying = true;
    }
  }

  stopAudio() {
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.audioElement = null;
      } catch (e) {}
    }
    this.isPlaying = false;
    this.currentPlayingAyah = null;
    this.audioLoading = false;
  }
}

export const quranState = new QuranStore();
