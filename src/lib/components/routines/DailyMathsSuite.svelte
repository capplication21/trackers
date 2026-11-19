<script>
  import { onMount } from 'svelte';
  import { mathState } from '$lib/stores/mathState.svelte.js';

  let activeMode = $state('test'); // 'test' | 'grams' | 'change'

  onMount(() => {
    if (!mathState.quizQuestions.length) {
      mathState.startQuiz(10);
    }
  });

  function getOptionLabel(opt, optIdx) {
    if (typeof opt === 'string' || typeof opt === 'number') return String(opt);
    return opt.text || opt.label || `Option ${optIdx + 1}`;
  }
</script>

<div class="tab-content active" id="tab-mathtest" style="display: block;">
  <!-- Top Header Card -->
  <div
    style="background: #fffbeb; border: 2px solid var(--ink); border-radius: 16px; padding: 10px 16px; margin-bottom: 14px; box-shadow: 0 3px 0 var(--ink); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;"
  >
    <div style="font-size: 15px; font-weight: 900; color: #1e293b; display: flex; align-items: center; gap: 8px;">
      <span>🧮</span>
      <span>DAILY MATHS &amp; EXAM SUITE</span>
    </div>
    <button
      type="button"
      onclick={() => mathState.startQuiz(10)}
      style="background: #fdfbf7; border: 1.5px solid #fed7aa; border-radius: 999px; padding: 5px 14px; font-size: 12px; font-weight: 800; color: #c2410c; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);"
    >
      ↺ New 10-Question Quiz
    </button>
  </div>

  <!-- Sub Navigation Mode Filter Pills -->
  <div style="display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap;">
    <button
      type="button"
      onclick={() => (activeMode = 'test')}
      style="padding: 7px 18px; border-radius: 999px; font-size: 13px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease; {activeMode === 'test' ? 'background: #f59e0b; color: #18181b; border: 2px solid var(--ink); box-shadow: 0 2px 0 var(--ink);' : 'background: #fef3c7; color: #92400e; border: 1.5px solid #fde68a; opacity: 0.8;'}"
    >
      <span>📝</span> Math Exam
    </button>
    <button
      type="button"
      onclick={() => (activeMode = 'grams')}
      style="padding: 7px 18px; border-radius: 999px; font-size: 13px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease; {activeMode === 'grams' ? 'background: #f59e0b; color: #18181b; border: 2px solid var(--ink); box-shadow: 0 2px 0 var(--ink);' : 'background: #fef3c7; color: #92400e; border: 1.5px solid #fde68a; opacity: 0.8;'}"
    >
      <span>⚖️</span> Grams &amp; Kilograms
    </button>
    <button
      type="button"
      onclick={() => (activeMode = 'change')}
      style="padding: 7px 18px; border-radius: 999px; font-size: 13px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease; {activeMode === 'change' ? 'background: #f59e0b; color: #18181b; border: 2px solid var(--ink); box-shadow: 0 2px 0 var(--ink);' : 'background: #fef3c7; color: #92400e; border: 1.5px solid #fde68a; opacity: 0.8;'}"
    >
      <span>💰</span> Change &amp; Discounts
    </button>
  </div>

  {#if activeMode === 'test'}
    {#if !mathState.isSubmitted}
      <!-- Question Card Box -->
      <div
        style="background: #ffffff; border: 2px solid var(--ink); border-radius: 20px; padding: clamp(16px, 3vw, 24px); box-shadow: 0 4px 0 var(--ink); margin-bottom: 16px;"
      >
        {#if mathState.quizQuestions.length > 0 && mathState.quizQuestions[mathState.currentIndex]}
          {@const curQ = mathState.quizQuestions[mathState.currentIndex]}
          <!-- Header: Question X of Y + Math Problem Pill -->
          <div
            style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;"
          >
            <span
              style="font-size: 13px; font-weight: 800; color: #334155; text-transform: uppercase; letter-spacing: 0.5px;"
            >
              QUESTION {mathState.currentIndex + 1} OF {mathState.quizQuestions.length}
            </span>
            <span
              style="font-size: 11.5px; font-weight: 800; background: #fef3c7; color: #b45309; border-radius: 999px; padding: 4px 14px; border: 1px solid #fde68a;"
            >
              {curQ.type || 'Math Problem'}
            </span>
          </div>

          <!-- Question Prompt Text -->
          <div
            style="font-size: 16.5px; font-weight: 800; color: var(--ink); line-height: 1.45; margin-bottom: 20px;"
          >
            {curQ.question || curQ.prompt}
          </div>

          <!-- Options List -->
          {#if curQ.options && curQ.options.length}
            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
              {#each curQ.options as opt, optIdx}
                {@const isSelected = mathState.userAnswers[mathState.currentIndex] === optIdx}
                <button
                  type="button"
                  onclick={() => mathState.selectAnswer(mathState.currentIndex, optIdx)}
                  style="text-align: left; padding: 14px 18px; border-radius: 12px; border: 1.5px solid {isSelected ? '#0284c7' : '#cbd5e1'}; background: {isSelected ? '#f0f9ff' : '#ffffff'}; font-size: 15px; font-weight: 700; color: #1e293b; cursor: pointer; display: flex; align-items: center; gap: 14px; box-shadow: {isSelected ? '0 2px 0 #0284c7' : '0 1px 2px rgba(0,0,0,0.03)'}; transition: all 0.15s ease;"
                >
                  <span
                    style="width: 28px; height: 28px; border-radius: 50%; border: 2px solid {isSelected ? '#0284c7' : '#94a3b8'}; display: flex; align-items: center; justify-content: center; font-size: 12.5px; font-weight: 800; background: {isSelected ? '#0284c7' : '#f8fafc'}; color: {isSelected ? '#ffffff' : '#64748b'}; flex-shrink: 0;"
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span style="flex: 1;">{getOptionLabel(opt, optIdx)}</span>
                </button>
              {/each}
            </div>
          {/if}

          <!-- Bottom Actions -->
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <button
              type="button"
              class="reading-tool-btn"
              disabled={mathState.currentIndex <= 0}
              onclick={() => (mathState.currentIndex = Math.max(0, mathState.currentIndex - 1))}
              style="padding: 9px 18px; font-size: 13px; font-weight: 700;"
            >
              ◀ Previous
            </button>

            {#if mathState.currentIndex < mathState.quizQuestions.length - 1}
              <button
                type="button"
                style="background: #16a34a; color: #ffffff; border: none; border-radius: 8px; padding: 10px 22px; font-size: 13.5px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 0 #15803d; transition: all 0.15s ease;"
                onclick={() =>
                  (mathState.currentIndex = Math.min(
                    mathState.quizQuestions.length - 1,
                    mathState.currentIndex + 1
                  ))}
              >
                Next ▶
              </button>
            {:else}
              <button
                type="button"
                style="background: #16a34a; color: #ffffff; border: none; border-radius: 8px; padding: 10px 22px; font-size: 13.5px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 0 #15803d; transition: all 0.15s ease;"
                onclick={() => mathState.submitQuiz()}
              >
                Finish Test ✓
              </button>
            {/if}
          </div>
        {/if}
      </div>
    {:else}
      <!-- Results Screen -->
      <div
        style="background: #ffffff; border: 2px solid var(--ink); border-radius: 16px; padding: 24px; box-shadow: 0 3px 0 var(--ink); text-align: center; margin-bottom: 16px;"
      >
        <div style="font-size: 42px; margin-bottom: 6px;">
          {mathState.score >= 8 ? '🎯' : '🧮'}
        </div>
        <div style="font-size: 24px; font-weight: 800; color: var(--ink); margin-bottom: 4px;">
          Score: {mathState.score} / {mathState.quizQuestions.length}
        </div>
        <div style="font-size: 14px; font-weight: 700; color: #64748b; margin-bottom: 16px;">
          {Math.round((mathState.score / mathState.quizQuestions.length) * 100)}% Accuracy
        </div>
        <button
          type="button"
          class="reading-tool-btn active"
          onclick={() => mathState.startQuiz(10)}
          style="padding: 9px 20px; font-size: 13px;"
        >
          ↺ New Quiz
        </button>
      </div>
    {/if}
  {:else if activeMode === 'grams'}
    <!-- Grams & Kilograms Reference Cards -->
    <div
      style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap: clamp(8px, 1.5vw, 12px);"
    >
      {#each mathState.gramsData as item}
        <div
          style="background: #ffffff; border: 1.5px solid var(--ink); border-radius: 12px; padding: 14px; box-shadow: 0 2px 0 var(--ink); display: flex; flex-direction: column; gap: 6px;"
        >
          <div style="font-weight: 800; font-size: 14px; color: var(--ink);">
            {item.question || item.prompt}
          </div>
          <div style="font-size: 13px; color: #475569;">
            {item.explanation || item.note || ''}
          </div>
          <div
            style="font-weight: 800; font-size: 13px; color: #047857; background: #f0fdf4; padding: 6px 10px; border-radius: 8px; border: 1px solid #bbf7d0; margin-top: auto;"
          >
            {item.options ? item.options[item.correct] : item.answer}
          </div>
        </div>
      {/each}
    </div>
  {:else if activeMode === 'change'}
    <!-- Change & Discounts Reference Cards -->
    <div
      style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap: clamp(8px, 1.5vw, 12px);"
    >
      {#each [...mathState.changeData, ...mathState.discountData] as item}
        <div
          style="background: #ffffff; border: 1.5px solid var(--ink); border-radius: 12px; padding: 14px; box-shadow: 0 2px 0 var(--ink); display: flex; flex-direction: column; gap: 6px;"
        >
          <div style="font-weight: 800; font-size: 14px; color: var(--ink);">
            {item.question || item.prompt}
          </div>
          <div style="font-size: 13px; color: #475569;">
            {item.explanation || item.note || ''}
          </div>
          <div
            style="font-weight: 800; font-size: 13px; color: #b45309; background: #fffbeb; padding: 6px 10px; border-radius: 8px; border: 1px solid #fde68a; margin-top: auto;"
          >
            {item.options ? item.options[item.correct] : item.answer}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
