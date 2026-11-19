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
  <div class="section-title" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
    <span><span>🧮</span> DAILY MATHS &amp; EXAM SUITE</span>
    <button
      type="button"
      class="reading-tool-btn"
      onclick={() => mathState.startQuiz(10)}
      style="font-size: 11.5px; padding: 4px 10px;"
    >
      ↺ New 10-Question Quiz
    </button>
  </div>

  <div style="display: flex; gap: 8px; margin-bottom: 16px;">
    <button
      type="button"
      class="reading-filter-pill {activeMode === 'test' ? 'active' : ''}"
      onclick={() => (activeMode = 'test')}
    >
      📝 Math Exam
    </button>
    <button
      type="button"
      class="reading-filter-pill {activeMode === 'grams' ? 'active' : ''}"
      onclick={() => (activeMode = 'grams')}
    >
      ⚖️ Grams &amp; Kilograms
    </button>
    <button
      type="button"
      class="reading-filter-pill {activeMode === 'change' ? 'active' : ''}"
      onclick={() => (activeMode = 'change')}
    >
      💰 Change &amp; Discounts
    </button>
  </div>

  {#if activeMode === 'test'}
    {#if !mathState.isSubmitted}
      <div style="background: #ffffff; border: 2px solid var(--ink); border-radius: 16px; padding: 16px; box-shadow: 0 3px 0 var(--ink);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span style="font-size: 12px; font-weight: 800; color: #64748b;">
            QUESTION {mathState.currentIndex + 1} OF {mathState.quizQuestions.length}
          </span>
          <span style="font-size: 11px; font-weight: 800; background: #fef3c7; color: #b45309; padding: 2px 8px; border-radius: 999px;">
            {mathState.quizQuestions[mathState.currentIndex]?.type || 'Math Problem'}
          </span>
        </div>

        {#if mathState.quizQuestions[mathState.currentIndex]}
          {@const curQ = mathState.quizQuestions[mathState.currentIndex]}
          <div style="font-size: 16px; font-weight: 800; color: var(--ink); line-height: 1.4; margin-bottom: 16px;">
            {curQ.question || curQ.prompt}
          </div>

          {#if curQ.options && curQ.options.length}
            <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
              {#each curQ.options as opt, optIdx}
                {@const isSelected = mathState.userAnswers[mathState.currentIndex] === optIdx}
                <button
                  type="button"
                  onclick={() => mathState.selectAnswer(mathState.currentIndex, optIdx)}
                  style="text-align: left; padding: 12px 14px; border-radius: 10px; border: 2px solid {isSelected ? '#d97706' : '#e2e8f0'}; background: {isSelected ? '#fffbeb' : '#f8fafc'}; font-size: 13.5px; font-weight: 700; color: {isSelected ? '#92400e' : 'var(--ink)'}; cursor: pointer; display: flex; align-items: center; gap: 10px;"
                >
                  <span style="width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid {isSelected ? '#d97706' : '#94a3b8'}; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; background: {isSelected ? '#d97706' : '#ffffff'}; color: {isSelected ? '#ffffff' : '#64748b'};">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span>{getOptionLabel(opt, optIdx)}</span>
                </button>
              {/each}
            </div>
          {/if}

          <div style="display: flex; justify-content: space-between; align-items: center;">
            <button
              type="button"
              class="reading-tool-btn"
              disabled={mathState.currentIndex <= 0}
              onclick={() => (mathState.currentIndex = Math.max(0, mathState.currentIndex - 1))}
            >
              ◀ Previous
            </button>

            {#if mathState.currentIndex < mathState.quizQuestions.length - 1}
              <button
                type="button"
                class="reading-tool-btn active"
                onclick={() => (mathState.currentIndex = Math.min(mathState.quizQuestions.length - 1, mathState.currentIndex + 1))}
              >
                Next ▶
              </button>
            {:else}
              <button
                type="button"
                class="reading-tool-btn active"
                style="background: var(--green); border-color: var(--ink);"
                onclick={() => mathState.submitQuiz()}
              >
                Finish &amp; Score Math Test ✓
              </button>
            {/if}
          </div>
        {/if}
      </div>
    {:else}
      <!-- Results Screen -->
      <div style="background: #ffffff; border: 2px solid var(--ink); border-radius: 16px; padding: 20px; box-shadow: 0 3px 0 var(--ink); text-align: center; margin-bottom: 16px;">
        <div style="font-size: 40px; margin-bottom: 6px;">
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
          style="padding: 8px 18px; font-size: 13px;"
        >
          ↺ New Quiz
        </button>
      </div>
    {/if}
  {:else if activeMode === 'grams'}
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap: clamp(8px, 1.5vw, 12px);">
      {#each mathState.gramsData as item}
        <div style="background: #ffffff; border: 1.5px solid var(--ink); border-radius: 12px; padding: 12px; box-shadow: 0 2px 0 var(--ink); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <div style="font-weight: 700; font-size: 14px; color: var(--ink);">{item.question || item.prompt}</div>
          <div style="font-weight: 800; font-size: 13px; color: var(--teal); background: #f0fdfa; padding: 4px 10px; border-radius: 8px; border: 1px solid #99f6e4;">
            {item.answer || (item.options && item.options[item.correct]) || '--'}
          </div>
        </div>
      {/each}
    </div>
  {:else if activeMode === 'change'}
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap: clamp(8px, 1.5vw, 12px);">
      {#each mathState.changeData as item}
        <div style="background: #ffffff; border: 1.5px solid var(--ink); border-radius: 12px; padding: 12px; box-shadow: 0 2px 0 var(--ink); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <div style="font-weight: 700; font-size: 14px; color: var(--ink);">{item.question || item.prompt}</div>
          <div style="font-weight: 800; font-size: 13px; color: var(--orange); background: #fff7ed; padding: 4px 10px; border-radius: 8px; border: 1px solid #fed7aa;">
            {item.answer || (item.options && item.options[item.correct]) || '--'}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
