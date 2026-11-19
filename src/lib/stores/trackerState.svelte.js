import defaults from '$lib/data/trackerDefaults.json';
import { storageBridge } from './storageBridge.js';
import { triggerHaptic } from '$lib/utils/haptics.js';

function getTodayKey() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

class TrackerStore {
  today = $state(getTodayKey());
  tasks = $state(defaults.tasks);
  completedTasks = $state({}); // { [taskId]: boolean }
  water = $state({ morning: 0, afternoon: 0, evening: 0, night: 0 });
  walk = $state({ morning: 0, afternoon: 0, evening: 0, night: 0 });
  hairWashCount = $state(0);
  hairWashReminders = $state(false);
  typingRange = $state({ start: '', end: '' });
  history = $state([]);
  medicines = $state(defaults.medicines || []);
  
  // 3x/Week Zad and Understand Quran state
  zadSubjects = $state([
    { id: 'aqeedah', name: 'Aqeedah (Islamic Creed)', currentLecture: 1, totalLectures: 25, playlistUrl: 'https://youtube.com/@academyzaden' },
    { id: 'fiqh', name: 'Fiqh (Islamic Jurisprudence)', currentLecture: 1, totalLectures: 25, playlistUrl: 'https://youtube.com/@academyzaden' },
    { id: 'seerah', name: 'Seerah (Prophetic Biography)', currentLecture: 1, totalLectures: 25, playlistUrl: 'https://youtube.com/@academyzaden' },
    { id: 'tarbiyah', name: 'Islamic Education & Tarbiyah', currentLecture: 1, totalLectures: 25, playlistUrl: 'https://youtube.com/@academyzaden' }
  ]);

  uqSubjects = $state([
    { id: 'quran_course_1', name: 'Understand Al-Qur\'an 50% Words', currentLecture: 1, totalLectures: 20, playlistUrl: 'https://youtube.com/@understandquran' },
    { id: 'quran_course_2', name: 'Grammar Made Easy Level 1', currentLecture: 1, totalLectures: 20, playlistUrl: 'https://youtube.com/@understandquran' }
  ]);

  // Period Health
  periodData = $state({
    periods: [],
    defaultCycleLength: 28
  });

  isInitialized = false;

  async init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    this.today = getTodayKey();

    // Load today tasks
    const savedToday = await storageBridge.getItem(`daily_tracker_${this.today}`);
    if (savedToday && typeof savedToday === 'object') {
      if (savedToday.completedTasks) this.completedTasks = savedToday.completedTasks;
      if (savedToday.water) this.water = savedToday.water;
      if (savedToday.walk) this.walk = savedToday.walk;
    }

    // Load hair wash
    const savedHairWash = await storageBridge.getItem('hair_wash_status');
    if (savedHairWash) {
      if (typeof savedHairWash.count === 'number') this.hairWashCount = savedHairWash.count;
      if (typeof savedHairWash.reminders === 'boolean') this.hairWashReminders = savedHairWash.reminders;
    }

    // Load typing range
    const savedTyping = await storageBridge.getItem('typing_range');
    if (savedTyping) this.typingRange = savedTyping;

    // Load history
    const savedHistory = await storageBridge.getItem('tracker_history_archive');
    if (Array.isArray(savedHistory)) this.history = savedHistory;

    // Load Zad & UQ courses
    const savedZad = await storageBridge.getItem('zad_subjects_v1');
    if (Array.isArray(savedZad)) this.zadSubjects = savedZad;

    const savedUq = await storageBridge.getItem('uq_subjects_v1');
    if (Array.isArray(savedUq)) this.uqSubjects = savedUq;

    // Load medicines
    const savedMeds = await storageBridge.getItem('medicines_config');
    if (Array.isArray(savedMeds)) this.medicines = savedMeds;

    // Load Period data
    const savedPeriod = await storageBridge.getItem('period_tracker_data');
    if (savedPeriod && typeof savedPeriod === 'object') this.periodData = savedPeriod;
  }

  get totalWaterGlasses() {
    return (this.water.morning || 0) + (this.water.afternoon || 0) + (this.water.evening || 0) + (this.water.night || 0);
  }

  get totalWaterMl() {
    return this.totalWaterGlasses * (defaults.glassMl || 250);
  }

  get totalWalkSteps() {
    return (this.walk.morning || 0) + (this.walk.afternoon || 0) + (this.walk.evening || 0) + (this.walk.night || 0);
  }

  get completedCount() {
    return Object.values(this.completedTasks).filter(Boolean).length;
  }

  get completionPercentage() {
    if (!this.tasks.length) return 0;
    return Math.round((this.completedCount / this.tasks.length) * 100);
  }

  async saveToday() {
    await storageBridge.setItem(`daily_tracker_${this.today}`, {
      completedTasks: this.completedTasks,
      water: this.water,
      walk: this.walk,
      savedAt: new Date().toISOString()
    });

    // Update history entry for today
    const entry = {
      date: this.today,
      completed: this.completedCount,
      total: this.tasks.length,
      waterGlasses: this.totalWaterGlasses,
      walkSteps: this.totalWalkSteps
    };
    const existingIdx = this.history.findIndex(h => h.date === this.today);
    if (existingIdx >= 0) {
      this.history[existingIdx] = entry;
    } else {
      this.history = [entry, ...this.history].slice(0, 30);
    }
    await storageBridge.setItem('tracker_history_archive', this.history);
  }

  async toggleTask(taskId) {
    triggerHaptic('medium');
    this.completedTasks = {
      ...this.completedTasks,
      [taskId]: !this.completedTasks[taskId]
    };
    await this.saveToday();
  }

  async adjustWater(period, delta) {
    const cur = this.water[period] || 0;
    this.water = {
      ...this.water,
      [period]: Math.max(0, cur + delta)
    };
    await this.saveToday();
  }

  async adjustWalk(period, delta) {
    const cur = this.walk[period] || 0;
    this.walk = {
      ...this.walk,
      [period]: Math.max(0, cur + delta)
    };
    await this.saveToday();
  }

  async adjustHairWash(delta) {
    this.hairWashCount = Math.max(0, this.hairWashCount + delta);
    await storageBridge.setItem('hair_wash_status', {
      count: this.hairWashCount,
      reminders: this.hairWashReminders
    });
  }

  async toggleHairWashReminders() {
    this.hairWashReminders = !this.hairWashReminders;
    await storageBridge.setItem('hair_wash_status', {
      count: this.hairWashCount,
      reminders: this.hairWashReminders
    });
  }

  async setTypingDate(field, dateStr) {
    this.typingRange = { ...this.typingRange, [field]: dateStr };
    await storageBridge.setItem('typing_range', this.typingRange);
  }

  async updateZadLecture(subjectId, delta) {
    this.zadSubjects = this.zadSubjects.map(s => {
      if (s.id === subjectId) {
        const next = Math.max(1, Math.min(s.totalLectures, s.currentLecture + delta));
        return { ...s, currentLecture: next };
      }
      return s;
    });
    await storageBridge.setItem('zad_subjects_v1', this.zadSubjects);
  }

  async addZadSubject(name, totalLectures = 25, playlistUrl = '') {
    const id = 'zad_' + Date.now();
    this.zadSubjects = [...this.zadSubjects, { id, name, currentLecture: 1, totalLectures, playlistUrl }];
    await storageBridge.setItem('zad_subjects_v1', this.zadSubjects);
  }

  async updateUqLecture(subjectId, delta) {
    this.uqSubjects = this.uqSubjects.map(s => {
      if (s.id === subjectId) {
        const next = Math.max(1, Math.min(s.totalLectures, s.currentLecture + delta));
        return { ...s, currentLecture: next };
      }
      return s;
    });
    await storageBridge.setItem('uq_subjects_v1', this.uqSubjects);
  }

  async addUqSubject(name, totalLectures = 20, playlistUrl = '') {
    const id = 'uq_' + Date.now();
    this.uqSubjects = [...this.uqSubjects, { id, name, currentLecture: 1, totalLectures, playlistUrl }];
    await storageBridge.setItem('uq_subjects_v1', this.uqSubjects);
  }

  async addPeriodEntry(startDate, endDate) {
    this.periodData = {
      ...this.periodData,
      periods: [{ id: Date.now(), start: startDate, end: endDate }, ...this.periodData.periods]
    };
    await storageBridge.setItem('period_tracker_data', this.periodData);
  }
}

export const trackerState = new TrackerStore();
