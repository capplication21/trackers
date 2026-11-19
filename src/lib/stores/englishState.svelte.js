import englishDataset from '$lib/data/englishData.json';
import { storageBridge } from './storageBridge.js';

function getDailyQuestions(questions, mode = 'all', setOffset = 0) {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10);
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) {
    seed = (seed << 5) - seed + dateStr.charCodeAt(i);
    seed |= 0;
  }
  seed = Math.abs(seed) + (setOffset * 997);

  let pool = [...questions];
  if (mode === 'grammar') {
    pool = pool.filter((q) => q.category === 'grammar');
  } else if (mode === 'vocab') {
    pool = pool.filter((q) => q.category === 'vocab');
  }

  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.abs(Math.sin(seed + i)) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const count = Math.min(15, shuffled.length);
  return shuffled.slice(0, count);
}

class EnglishStore {
  questions = $state(englishDataset.questions || []);
  vocabList = $state(englishDataset.vocab || []);
  b1Themes = $state(englishDataset.b1Themes || []);
  dictionary = $state(englishDataset.dict || {});

  // Submenu: 'assessment' | 'history' | 'vocab'
  activeSubMenu = $state('assessment');

  // Mode: 'all' | 'grammar' | 'vocab'
  testMode = $state('all');
  setOffset = $state(0);

  // Active Test State
  currentQuestions = $state([]);
  currentIndex = $state(0);
  userAnswers = $state([]); // array of answer objects per index
  score = $state(0);
  isSubmitted = $state(false);

  // Test History
  testHistory = $state([]);

  isInitialized = false;

  async init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Load saved test history
    const savedHistory = await storageBridge.getItem('english_test_history_v1');
    if (Array.isArray(savedHistory)) {
      this.testHistory = savedHistory;
    }

    // Load any custom vocab
    const savedVocab = await storageBridge.getItem('custom_english_vocab');
    if (Array.isArray(savedVocab)) {
      this.vocabList = [...(englishDataset.vocab || []), ...savedVocab];
    }

    this.loadQuestions();
  }

  loadQuestions() {
    this.currentQuestions = getDailyQuestions(this.questions, this.testMode, this.setOffset);
    this.currentIndex = 0;
    this.userAnswers = [];
    this.score = 0;
    this.isSubmitted = false;
  }

  setTestMode(mode) {
    if (this.testMode === mode) return;
    this.testMode = mode;
    this.setOffset = 0;
    this.loadQuestions();
  }

  nextSet() {
    this.setOffset++;
    this.loadQuestions();
  }

  selectOption(optionIndex) {
    if (this.userAnswers[this.currentIndex]) return; // already answered

    const q = this.currentQuestions[this.currentIndex];
    if (!q) return;

    const isCorrect = optionIndex === q.correctIndex;
    const answerObj = {
      qIndex: this.currentIndex + 1,
      question: q.question,
      options: q.options,
      userIndex: optionIndex,
      userText: q.options[optionIndex],
      correctIndex: q.correctIndex,
      correctText: q.options[q.correctIndex],
      isCorrect,
      explanation: q.explanation,
      level: q.level
    };

    const updated = [...this.userAnswers];
    updated[this.currentIndex] = answerObj;
    this.userAnswers = updated;

    this.score = updated.filter((a) => a && a.isCorrect).length;
  }

  nextQuestion() {
    if (this.currentIndex < this.currentQuestions.length - 1) {
      this.currentIndex++;
    } else {
      this.finishTest();
    }
  }

  prevQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  async finishTest() {
    this.isSubmitted = true;
    const record = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      score: this.score,
      total: this.currentQuestions.length,
      percentage: Math.round((this.score / this.currentQuestions.length) * 100),
      mode: this.testMode
    };

    const newHistory = [record, ...this.testHistory].slice(0, 50);
    this.testHistory = newHistory;
    await storageBridge.setItem('english_test_history_v1', newHistory);
  }

  async addCustomWord(word, meaning, example = '', level = 'B2') {
    const newWord = {
      id: `custom_${Date.now()}`,
      word: word.trim(),
      meaning: meaning.trim(),
      example: example.trim(),
      level: level || 'B2'
    };
    this.vocabList = [newWord, ...this.vocabList];
    const customOnly = this.vocabList.filter((w) => w.id && String(w.id).startsWith('custom_'));
    await storageBridge.setItem('custom_english_vocab', customOnly);
  }

  async deleteCustomWord(id) {
    this.vocabList = this.vocabList.filter((w) => w.id !== id);
    const customOnly = this.vocabList.filter((w) => w.id && String(w.id).startsWith('custom_'));
    await storageBridge.setItem('custom_english_vocab', customOnly);
  }
}

export const englishState = new EnglishStore();
