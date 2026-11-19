import englishDataset from '$lib/data/englishData.json';
import { storageBridge } from './storageBridge.js';

class EnglishStore {
  questions = $state(englishDataset.questions);
  vocabList = $state(englishDataset.vocab);
  b1Themes = $state(englishDataset.b1Themes);
  dictionary = $state(englishDataset.dict);

  // Test state
  testQuestions = $state([]);
  currentQuestionIndex = $state(0);
  userAnswers = $state({}); // { [qIdx]: selectedOptionIndex }
  isTestActive = $state(false);
  isTestSubmitted = $state(false);
  score = $state(0);

  isInitialized = false;

  async init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Load any custom vocab or routine progress
    const savedVocab = await storageBridge.getItem('custom_english_vocab');
    if (Array.isArray(savedVocab)) {
      this.vocabList = [...englishDataset.vocab, ...savedVocab];
    }
  }

  startQuiz(count = 10) {
    const shuffled = [...this.questions].sort(() => 0.5 - Math.random());
    this.testQuestions = shuffled.slice(0, Math.min(count, this.questions.length));
    this.currentQuestionIndex = 0;
    this.userAnswers = {};
    this.isTestActive = true;
    this.isTestSubmitted = false;
    this.score = 0;
  }

  selectAnswer(qIndex, optionIndex) {
    if (this.isTestSubmitted) return;
    this.userAnswers = { ...this.userAnswers, [qIndex]: optionIndex };
  }

  submitQuiz() {
    let correctCount = 0;
    this.testQuestions.forEach((q, idx) => {
      if (this.userAnswers[idx] === q.correct) {
        correctCount++;
      }
    });
    this.score = correctCount;
    this.isTestSubmitted = true;
  }
}

export const englishState = new EnglishStore();
