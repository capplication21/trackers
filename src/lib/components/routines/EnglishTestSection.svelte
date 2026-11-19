<script>
  import { onMount } from 'svelte';
  import { englishState } from '$lib/stores/englishState.svelte.js';

  onMount(() => {
    englishState.init();
    if (!englishState.isTestActive && !englishState.isTestSubmitted) {
      englishState.startQuiz(10);
    }
  });

  function getOptionLabel(opt, optIdx) {
    if (typeof opt === 'string') return opt;
    return opt.text || opt.label || `Option ${optIdx + 1}`;
  }
</script>

<div class="tab-content active" id="tab-englishtest" style="display: block;">
  <div class="section-title" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
    <span><span>📝</span> ENGLISH B1 EXAM TEST</span>
    <button
      type="button"
      class="reading-tool-btn"
      onclick={() => englishState.startQuiz(10)}
      style="font-size: 11.5px; padding: 4px 10px;"
    >
      ↺ New 10-Question Test
    </button>
  </div>

  {#if !englishState.isTestSubmitted}
    <!-- Active Quiz View -->
    <div style="background: #ffffff; border: 2px solid var(--ink); border-radius: 16px; padding: 16px; box-shadow: 0 3px 0 var(--ink); margin-bottom: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-size: 12px; font-weight: 800; color: #64748b;">
          QUESTION {englishState.currentQuestionIndex + 1} OF {englishState.testQuestions.length}
        </span>
        <span style="font-size: 11px; font-weight: 800; background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 999px;">
          {englishState.testQuestions[englishState.currentQuestionIndex]?.topic || 'Grammar & Vocab'}
        </span>
      </div>

      <!-- Current Question Text -->
      {#if englishState.testQuestions[englishState.currentQuestionIndex]}
        {@const curQ = englishState.testQuestions[englishState.currentQuestionIndex]}
        <div style="font-size: 16px; font-weight: 800; color: var(--ink); line-height: 1.4; margin-bottom: 16px;">
          {curQ.question || curQ.prompt}
        </div>

        <!-- Options -->
        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
          {#each curQ.options as opt, optIdx}
            {@const isSelected = englishState.userAnswers[englishState.currentQuestionIndex] === optIdx}
            <button
              type="button"
              onclick={() => englishState.selectAnswer(englishState.currentQuestionIndex, optIdx)}
              style="text-align: left; padding: 12px 14px; border-radius: 10px; border: 2px solid {isSelected ? '#2563eb' : '#e2e8f0'}; background: {isSelected ? '#eff6ff' : '#f8fafc'}; font-size: 13.5px; font-weight: 700; color: {isSelected ? '#1e40af' : 'var(--ink)'}; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: all 0.1s ease;"
            >
              <span style="width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid {isSelected ? '#2563eb' : '#94a3b8'}; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; background: {isSelected ? '#2563eb' : '#ffffff'}; color: {isSelected ? '#ffffff' : '#64748b'};">
                {String.fromCharCode(65 + optIdx)}
              </span>
              <span>{getOptionLabel(opt, optIdx)}</span>
            </button>
          {/each}
        </div>

        <!-- Stepper Controls -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <button
            type="button"
            class="reading-tool-btn"
            disabled={englishState.currentQuestionIndex <= 0}
            onclick={() => (englishState.currentQuestionIndex = Math.max(0, englishState.currentQuestionIndex - 1))}
          >
            ◀ Previous
          </button>

          {#if englishState.currentQuestionIndex < englishState.testQuestions.length - 1}
            <button
              type="button"
              class="reading-tool-btn active"
              onclick={() => (englishState.currentQuestionIndex = Math.min(englishState.testQuestions.length - 1, englishState.currentQuestionIndex + 1))}
            >
              Next Question ▶
            </button>
          {:else}
            <button
              type="button"
              class="reading-tool-btn active"
              style="background: var(--green); border-color: var(--ink);"
              onclick={() => englishState.submitQuiz()}
            >
              Finish &amp; Score Quiz ✓
            </button>
          {/if}
        </div>
      {/if}
    </div>
  {:else}
    <!-- Score & Review Screen -->
    <div style="background: #ffffff; border: 2px solid var(--ink); border-radius: 16px; padding: 20px; box-shadow: 0 3px 0 var(--ink); text-align: center; margin-bottom: 16px;">
      <div style="font-size: 40px; margin-bottom: 6px;">
        {englishState.score >= 8 ? '🏆' : englishState.score >= 5 ? '👍' : '📚'}
      </div>
      <div style="font-size: 24px; font-weight: 800; color: var(--ink); margin-bottom: 4px;">
        Your Score: {englishState.score} / {englishState.testQuestions.length}
      </div>
      <div style="font-size: 14px; font-weight: 700; color: #64748b; margin-bottom: 16px;">
        {Math.round((englishState.score / englishState.testQuestions.length) * 100)}% Proficiency
      </div>
      <button
        type="button"
        class="reading-tool-btn active"
        onclick={() => englishState.startQuiz(10)}
        style="padding: 8px 18px; font-size: 13px;"
      >
        ↺ Retake with New Questions
      </button>
    </div>

    <!-- Question by Question Review -->
    <div style="display: flex; flex-direction: column; gap: 10px;">
      {#each englishState.testQuestions as q, qIdx}
        {@const userAns = englishState.userAnswers[qIdx]}
        {@const isCorrect = userAns === q.correct}
        <div style="background: #ffffff; border: 1.5px solid {isCorrect ? '#10b981' : '#f87171'}; border-radius: 12px; padding: 12px; box-shadow: 0 2px 0 var(--ink);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-size: 12px; font-weight: 800; color: var(--ink);">Question {qIdx + 1}</span>
            <span style="font-size: 11px; font-weight: 800; color: {isCorrect ? '#166534' : '#991b1b'};">
              {isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
            </span>
          </div>
          <div style="font-size: 13.5px; font-weight: 700; color: var(--ink); margin-bottom: 6px;">
            {q.question || q.prompt}
          </div>
          <div style="font-size: 11.5px; color: #64748b; margin-bottom: 4px;">
            Your answer: <strong>{getOptionLabel(q.options[userAns], userAns) || 'Not answered'}</strong>
          </div>
          {#if !isCorrect}
            <div style="font-size: 11.5px; color: #166534; margin-bottom: 4px;">
              Correct answer: <strong>{getOptionLabel(q.options[q.correct], q.correct)}</strong>
            </div>
          {/if}
          {#if q.explanation}
            <div style="background: #f8fafc; border-radius: 6px; padding: 6px 8px; font-size: 11px; color: #475569; margin-top: 6px;">
              💡 {q.explanation}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
