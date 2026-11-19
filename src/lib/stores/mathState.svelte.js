import mathDataset from '$lib/data/mathData.json';

class MathStore {
  questions = $state(mathDataset.questions);
  gramsData = $state(mathDataset.grams);
  changeData = $state(mathDataset.change);
  discountData = $state(mathDataset.discount);

  // Active quiz state
  quizQuestions = $state([]);
  currentIndex = $state(0);
  userAnswers = $state({});
  isSubmitted = $state(false);
  score = $state(0);

  startQuiz(count = 10) {
    const combined = [...this.questions, ...this.gramsData, ...this.changeData, ...this.discountData];
    const shuffled = combined.sort(() => 0.5 - Math.random());
    this.quizQuestions = shuffled.slice(0, Math.min(count, combined.length));
    this.currentIndex = 0;
    this.userAnswers = {};
    this.isSubmitted = false;
    this.score = 0;
  }

  selectAnswer(qIdx, optIdx) {
    if (this.isSubmitted) return;
    this.userAnswers = { ...this.userAnswers, [qIdx]: optIdx };
  }

  submitQuiz() {
    let correct = 0;
    this.quizQuestions.forEach((q, idx) => {
      if (this.userAnswers[idx] === q.correct || this.userAnswers[idx] === q.answer) {
        correct++;
      }
    });
    this.score = correct;
    this.isSubmitted = true;
  }
}

export const mathState = new MathStore();
