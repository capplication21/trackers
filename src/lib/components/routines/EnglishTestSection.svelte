<script>
  import { onMount } from 'svelte';
  import { englishState } from '$lib/stores/englishState.svelte.js';

  let showAiModal = $state(false);
  let aiQuery = $state('');
  let customAiResponse = $state('');

  // Vocab Modal
  let showAddWordModal = $state(false);
  let newWord = $state('');
  let newMeaning = $state('');
  let newExample = $state('');
  let newLevel = $state('B2');

  onMount(async () => {
    await englishState.init();
  });

  const formattedDate = $derived(() => {
    const d = new Date();
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  });

  const curQ = $derived(englishState.currentQuestions[englishState.currentIndex]);
  const curAnswer = $derived(englishState.userAnswers[englishState.currentIndex]);

  function getAiAnswer(q, query = '') {
    if (!q) return '';
    const qLower = query.toLowerCase();

    if (qLower.includes('urdu') || qLower.includes('اردو')) {
      return `<strong>اردو میں وضاحت (Urdu Explanation):</strong><br/>اس سوال کا صحیح جواب <strong>"${q.options[q.correctIndex]}"</strong> ہے۔<br/><strong>وجہ:</strong> ${q.explanation}`;
    }
    if (qLower.includes('formula') || qLower.includes('structure')) {
      return `<strong>Grammar Formula &amp; Structure:</strong><br/><code>[Subject] + [Verb / Adjective / Collocation] + [Object]</code><br/>Rule: ${q.explanation}`;
    }
    if (qLower.includes('example') || qLower.includes('3 more')) {
      return `<strong>Sentence Examples:</strong><br/>1. Her soft voice belied her fierce determination.<br/>2. They fought with fierce courage during the tournament.<br/>3. A fierce storm was approaching the coastline.`;
    }

    return `<strong>Core Grammar &amp; Vocabulary Rule:</strong><br/>
    • <strong>Correct Option:</strong> "${q.options[q.correctIndex]}"<br/>
    • <strong>CEFR Level:</strong> ${q.level || 'B2'}<br/>
    • <strong>Detailed Analysis:</strong> ${q.explanation}`;
  }

  function handleAiChip(chipText) {
    aiQuery = chipText;
    customAiResponse = getAiAnswer(curQ, chipText);
  }

  async function handleAddWord() {
    if (!newWord.trim() || !newMeaning.trim()) return;
    await englishState.addCustomWord(newWord, newMeaning, newExample, newLevel);
    newWord = '';
    newMeaning = '';
    newExample = '';
    showAddWordModal = false;
  }
</script>

<div class="tab-content active" id="tab-englishtest" style="display: block;">
  <!-- Hero Header Card -->
  <div class="test-hero-card" style="background: #ffffff; border: 2.5px solid var(--ink); border-radius: 18px; padding: 14px 18px; margin-bottom: 14px; box-shadow: 0 4px 0 var(--ink);">
    <div class="test-hero-info" style="display: flex; align-items: center; gap: 12px;">
      <div class="test-hero-icon" style="width: 44px; height: 44px; font-size: 22px; background: #ede9fe; color: #7c3aed; border: 2px solid var(--ink); border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 0 var(--ink); flex-shrink: 0;">
        📝
      </div>
      <div>
        <div class="test-hero-title" style="font-size: 16px; font-weight: 900; color: #0f172a;">
          English Proficiency &amp; Grammar Test
        </div>
        <div class="test-hero-sub" style="font-size: 11px; color: #64748b; font-weight: 600; margin-top: 2px;">
          CEFR Levels B1/B2 Assessment • Vocabulary • Tenses • Error Correction
        </div>
        <div style="display: inline-flex; align-items: center; gap: 6px; background: #fef3c7; color: #92400e; border: 1.5px solid #f59e0b; border-radius: 999px; padding: 2px 10px; font-size: 11px; font-weight: 700; margin-top: 5px;">
          🗓️ Daily Challenge: {formattedDate()} • Set #{englishState.setOffset + 1}
        </div>
      </div>
    </div>
  </div>

  <!-- English Test Sub-Menu Navigation Bar -->
  <div style="background: #ffffff; border: 2.5px solid var(--ink); border-radius: 16px; padding: 8px 10px; box-shadow: 0 3px 0 var(--ink); margin-bottom: 14px; display: flex; flex-direction: column; gap: 8px;">
    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
      <button
        type="button"
        class="eng-subnav-tab {englishState.activeSubMenu === 'assessment' ? 'active' : ''}"
        onclick={() => (englishState.activeSubMenu = 'assessment')}
        style="flex: 1; min-width: 130px; padding: 8px 14px; border-radius: 10px; border: 1.5px solid {englishState.activeSubMenu === 'assessment' ? '#4f46e5' : 'transparent'}; background: {englishState.activeSubMenu === 'assessment' ? '#4f46e5' : '#f8fafc'}; color: {englishState.activeSubMenu === 'assessment' ? '#ffffff' : '#334155'}; font-size: 13px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px; box-shadow: {englishState.activeSubMenu === 'assessment' ? '0 2px 0 var(--ink)' : 'none'}; transition: all 0.15s ease;"
      >
        <span>🎯</span>
        <span>Daily Assessment</span>
      </button>

      <button
        type="button"
        class="eng-subnav-tab {englishState.activeSubMenu === 'history' ? 'active' : ''}"
        onclick={() => (englishState.activeSubMenu = 'history')}
        style="flex: 1; min-width: 130px; padding: 8px 14px; border-radius: 10px; border: 1.5px solid {englishState.activeSubMenu === 'history' ? '#4f46e5' : 'transparent'}; background: {englishState.activeSubMenu === 'history' ? '#4f46e5' : '#f8fafc'}; color: {englishState.activeSubMenu === 'history' ? '#ffffff' : '#334155'}; font-size: 13px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px; box-shadow: {englishState.activeSubMenu === 'history' ? '0 2px 0 var(--ink)' : 'none'}; transition: all 0.15s ease;"
      >
        <span>📜</span>
        <span>Test History</span>
        <span style="background: #ede9fe; color: #6d28d9; font-size: 10px; font-weight: 800; padding: 1px 6px; border-radius: 999px;">
          {englishState.testHistory.length}
        </span>
      </button>
    </div>

    <button
      type="button"
      class="eng-subnav-tab {englishState.activeSubMenu === 'vocab' ? 'active' : ''}"
      onclick={() => (englishState.activeSubMenu = 'vocab')}
      style="width: 100%; padding: 8px 14px; border-radius: 10px; border: 1.5px solid {englishState.activeSubMenu === 'vocab' ? '#0d9488' : 'transparent'}; background: {englishState.activeSubMenu === 'vocab' ? '#f0fdf4' : '#f8fafc'}; color: #15803d; font-size: 13px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.15s ease;"
    >
      <span>📖</span>
      <span>My New Words</span>
      <span style="background: #dcfce7; color: #15803d; font-size: 10px; font-weight: 800; padding: 1px 6px; border-radius: 999px;">
        {englishState.vocabList.length}
      </span>
    </button>
  </div>

  <!-- 1. Daily Assessment Submenu -->
  {#if englishState.activeSubMenu === 'assessment'}
    <!-- Mode Tabs: Full Assessment, Grammar, Vocab -->
    <div class="test-mode-tabs" style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 12px;">
      <button
        type="button"
        class="test-mode-tab {englishState.testMode === 'all' ? 'active' : ''}"
        onclick={() => englishState.setTestMode('all')}
        style="background: {englishState.testMode === 'all' ? '#ea580c' : '#ffffff'}; color: {englishState.testMode === 'all' ? '#ffffff' : '#334155'}; border: 2px solid var(--ink); border-radius: 999px; padding: 6px 14px; font-size: 12px; font-weight: 800; cursor: pointer; box-shadow: 0 2px 0 var(--ink); transition: all 0.15s ease;"
      >
        🎯 Full Assessment (15 Qs)
      </button>

      <button
        type="button"
        class="test-mode-tab {englishState.testMode === 'grammar' ? 'active' : ''}"
        onclick={() => englishState.setTestMode('grammar')}
        style="background: {englishState.testMode === 'grammar' ? '#ea580c' : '#ffffff'}; color: {englishState.testMode === 'grammar' ? '#ffffff' : '#334155'}; border: 2px solid var(--ink); border-radius: 999px; padding: 6px 14px; font-size: 12px; font-weight: 800; cursor: pointer; box-shadow: 0 2px 0 var(--ink); transition: all 0.15s ease;"
      >
        📖 Grammar
      </button>

      <button
        type="button"
        class="test-mode-tab {englishState.testMode === 'vocab' ? 'active' : ''}"
        onclick={() => englishState.setTestMode('vocab')}
        style="background: {englishState.testMode === 'vocab' ? '#ea580c' : '#ffffff'}; color: {englishState.testMode === 'vocab' ? '#ffffff' : '#334155'}; border: 2px solid var(--ink); border-radius: 999px; padding: 6px 14px; font-size: 12px; font-weight: 800; cursor: pointer; box-shadow: 0 2px 0 var(--ink); transition: all 0.15s ease;"
      >
        💎 Vocab
      </button>
    </div>

    <!-- Main Test Engine Box -->
    {#if curQ}
      <div class="test-card-box" style="background: #ffffff; border: 2.5px solid var(--ink); border-radius: 18px; padding: 18px 16px; box-shadow: 0 4px 0 var(--ink); margin-bottom: 16px;">
        <!-- Header Row -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; gap: 8px; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 11.5px; font-weight: 800; padding: 4px 10px; border-radius: 999px; border: 1.5px solid var(--ink); background: #f1f5f9; color: #1e293b;">
              Question {englishState.currentIndex + 1} of {englishState.currentQuestions.length} • Level {curQ.level || 'B2'}
            </span>
            <span style="font-size: 11.5px; font-weight: 900; padding: 4px 10px; border-radius: 999px; border: 1.5px solid var(--ink); background: #fef08a; color: #141413;">
              Score: {englishState.score}
            </span>
          </div>

          <button
            type="button"
            onclick={() => {
              showAiModal = true;
              customAiResponse = getAiAnswer(curQ);
            }}
            style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; border: 1.5px solid var(--ink); font-size: 11px; padding: 5px 12px; font-weight: 800; border-radius: 8px; display: inline-flex; align-items: center; gap: 5px; box-shadow: 0 1.5px 0 var(--ink); cursor: pointer;"
            title="Ask Gemini AI Grammar Tutor"
          >
            <span>✨</span>
            <span>Ask with Gemini</span>
          </button>
        </div>

        <!-- Question Prompt -->
        <div style="font-size: 16.5px; font-weight: 800; color: #0f172a; line-height: 1.45; margin-bottom: 16px;">
          {curQ.question}
        </div>

        <!-- Options Grid -->
        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
          {#each curQ.options as opt, optIdx}
            {@const ans = curAnswer}
            {@const isAnswered = Boolean(ans)}
            {@const isCorrectOpt = optIdx === curQ.correctIndex}
            {@const isSelected = ans?.userIndex === optIdx}

            <button
              type="button"
              onclick={() => englishState.selectOption(optIdx)}
              disabled={isAnswered}
              style="width: 100%; padding: 12px 14px; border-radius: 12px; border: 2px solid {isAnswered && isCorrectOpt ? '#16a34a' : isAnswered && isSelected && !isCorrectOpt ? '#dc2626' : '#cbd5e1'}; background: {isAnswered && isCorrectOpt ? '#dcfce7' : isAnswered && isSelected && !isCorrectOpt ? '#fee2e2' : '#f8fafc'}; color: {isAnswered && isCorrectOpt ? '#14532d' : isAnswered && isSelected && !isCorrectOpt ? '#7f1d1d' : '#1e293b'}; text-align: left; font-size: 14px; font-weight: 700; cursor: {isAnswered ? 'default' : 'pointer'}; display: flex; align-items: center; gap: 12px; transition: all 0.1s ease;"
            >
              <span style="width: 24px; height: 24px; border-radius: 50%; border: 1.5px solid {isAnswered && isCorrectOpt ? '#16a34a' : isAnswered && isSelected && !isCorrectOpt ? '#dc2626' : '#94a3b8'}; background: {isAnswered && isCorrectOpt ? '#16a34a' : isAnswered && isSelected && !isCorrectOpt ? '#dc2626' : '#ffffff'}; color: {isAnswered && (isCorrectOpt || isSelected) ? '#ffffff' : '#475569'}; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; flex-shrink: 0;">
                {String.fromCharCode(65 + optIdx)}
              </span>
              <span style="flex: 1;">{opt}</span>
            </button>
          {/each}
        </div>

        <!-- Instant Feedback Box -->
        {#if curAnswer}
          <div style="border-radius: 12px; padding: 12px 14px; font-size: 12.5px; line-height: 1.45; margin-bottom: 14px; border: 2px solid {curAnswer.isCorrect ? '#16a34a' : '#ef4444'}; background: {curAnswer.isCorrect ? '#dcfce7' : '#fef2f2'}; color: {curAnswer.isCorrect ? '#14532d' : '#991b1b'};">
            <div style="font-weight: 800; margin-bottom: 4px;">
              {curAnswer.isCorrect ? '✅ Correct Answer!' : '❌ Incorrect.'}
            </div>
            <div>
              {curQ.explanation}
            </div>
          </div>
        {/if}

        <!-- Actions Bar -->
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 14px; width: 100%; flex-wrap: wrap;">
          <!-- New 15 Set Button -->
          <button
            type="button"
            onclick={() => englishState.nextSet()}
            style="background: #ede9fe; color: #6d28d9; border: 2px solid var(--ink); box-shadow: 0 2px 0 var(--ink); font-size: 12.5px; padding: 8px 14px; font-weight: 800; border-radius: 9px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; flex-shrink: 0;"
          >
            <span style="font-size: 14px;">🎲</span>
            <span>New 15 Set</span>
          </button>

          <!-- Prev & Next Group -->
          <div style="display: inline-flex; align-items: stretch; border: 2px solid var(--ink); border-radius: 9px; overflow: hidden; box-shadow: 0 2px 0 var(--ink); flex-shrink: 0;">
            <button
              type="button"
              onclick={() => englishState.prevQuestion()}
              disabled={englishState.currentIndex <= 0}
              style="border: none; border-right: 1.5px solid var(--ink); background: #ffffff; color: {englishState.currentIndex <= 0 ? '#94a3b8' : '#334155'}; font-size: 13px; font-weight: 800; padding: 8px 18px; display: inline-flex; align-items: center; gap: 6px; cursor: {englishState.currentIndex <= 0 ? 'not-allowed' : 'pointer'};"
            >
              <span>⬅ Prev</span>
            </button>

            <button
              type="button"
              onclick={() => englishState.nextQuestion()}
              style="border: none; background: #4338ca; color: #ffffff; font-size: 13px; font-weight: 800; padding: 8px 18px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer;"
            >
              <span>{englishState.currentIndex < englishState.currentQuestions.length - 1 ? 'Next ➔' : 'Finish & Score ➔'}</span>
            </button>
          </div>
        </div>
      </div>
    {/if}

    <!-- Result Box (if submitted) -->
    {#if englishState.isSubmitted}
      <div style="background: #ffffff; border: 2.5px solid var(--ink); border-radius: 18px; padding: 20px; box-shadow: 0 4px 0 var(--ink); text-align: center; margin-bottom: 16px;">
        <div style="font-size: 40px; margin-bottom: 6px;">
          {englishState.score >= 12 ? '🏆' : englishState.score >= 8 ? '👏' : '📚'}
        </div>
        <div style="font-size: 22px; font-weight: 900; color: #0f172a; margin-bottom: 4px;">
          Your Score: {englishState.score} / {englishState.currentQuestions.length}
        </div>
        <div style="font-size: 13px; font-weight: 700; color: #64748b; margin-bottom: 16px;">
          {Math.round((englishState.score / englishState.currentQuestions.length) * 100)}% CEFR Proficiency • Recorded in Test History
        </div>
        <button
          type="button"
          onclick={() => englishState.nextSet()}
          style="padding: 10px 20px; background: #eab308; color: #141413; border: 2px solid var(--ink); border-radius: 10px; font-size: 13px; font-weight: 800; cursor: pointer; box-shadow: 0 2px 0 var(--ink);"
        >
          🎲 Start Next 15 Challenge
        </button>
      </div>
    {/if}
  {/if}

  <!-- 2. Test History Submenu -->
  {#if englishState.activeSubMenu === 'history'}
    <div style="background: #ffffff; border: 2.5px solid var(--ink); border-radius: 18px; padding: 18px 16px; box-shadow: 0 4px 0 var(--ink); margin-bottom: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <div style="font-size: 15px; font-weight: 800; color: var(--ink);">
          📜 Past Test Attempts
        </div>
        <span style="background: #ede9fe; color: #6d28d9; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 800;">
          {englishState.testHistory.length} Recorded
        </span>
      </div>

      {#if englishState.testHistory.length === 0}
        <div style="text-align: center; padding: 32px 16px; color: #94a3b8; font-size: 13px; font-style: italic;">
          No test records yet. Complete a 15-question daily challenge to save your score!
        </div>
      {:else}
        <div style="display: flex; flex-direction: column; gap: 8px;">
          {#each englishState.testHistory as item}
            <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 10px 14px;">
              <div>
                <div style="font-size: 13.5px; font-weight: 800; color: #0f172a;">{item.date}</div>
                <div style="font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase;">
                  Mode: {item.mode || 'All'}
                </div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 14px; font-weight: 900; color: {item.percentage >= 80 ? '#16a34a' : item.percentage >= 50 ? '#d97706' : '#dc2626'};">
                  {item.score} / {item.total} ({item.percentage}%)
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}

  <!-- 3. My New Words Submenu -->
  {#if englishState.activeSubMenu === 'vocab'}
    <div style="background: #ffffff; border: 2.5px solid var(--ink); border-radius: 18px; padding: 18px 16px; box-shadow: 0 4px 0 var(--ink); margin-bottom: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 15px; font-weight: 800; color: #15803d;">📖 My New Words</span>
          <span style="background: #dcfce7; color: #15803d; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 800;">
            {englishState.vocabList.length} words
          </span>
        </div>
        <button
          type="button"
          onclick={() => (showAddWordModal = true)}
          style="padding: 6px 12px; background: #16a34a; color: #ffffff; border: 1.5px solid var(--ink); border-radius: 8px; font-size: 12px; font-weight: 800; cursor: pointer; box-shadow: 0 1.5px 0 var(--ink);"
        >
          ➕ Add Word
        </button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); gap: 10px;">
        {#each englishState.vocabList as wordItem}
          <div style="background: #fdfbf7; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <span style="font-size: 15px; font-weight: 800; color: #0f172a;">{wordItem.word}</span>
                <span style="font-size: 10px; font-weight: 800; background: #dbeafe; color: #1e40af; padding: 2px 6px; border-radius: 6px;">
                  {wordItem.level || 'B2'}
                </span>
              </div>
              <div style="font-size: 12px; color: #334155; line-height: 1.4; margin-bottom: 6px;">
                {wordItem.meaning}
              </div>
              {#if wordItem.example}
                <div style="font-size: 11px; color: #64748b; font-style: italic; background: #f1f5f9; padding: 4px 8px; border-radius: 6px;">
                  "{wordItem.example}"
                </div>
              {/if}
            </div>
            {#if wordItem.id && String(wordItem.id).startsWith('custom_')}
              <button
                type="button"
                onclick={() => englishState.deleteCustomWord(wordItem.id)}
                style="align-self: flex-end; background: transparent; border: none; cursor: pointer; font-size: 12px; margin-top: 6px;"
                title="Delete word"
              >
                🗑️
              </button>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<!-- Gemini AI Grammar Tutor Modal -->
{#if showAiModal}
  <div
    class="nav-menu-overlay"
    onclick={() => (showAiModal = false)}
    onkeydown={(e) => { if (e.key === 'Escape') showAiModal = false; }}
    role="button"
    tabindex="-1"
    style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 999999; display: flex; align-items: center; justify-content: center; padding: 16px;"
  >
    <div
      class="nav-menu-dropdown"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="dialog"
      tabindex="0"
      style="background: #ffffff; border: 2.5px solid var(--ink); border-radius: 18px; width: min(100%, 480px); max-height: 85vh; overflow-y: auto; padding: 18px; box-shadow: 0 6px 0 var(--ink);"
    >
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
        <div style="font-size: 15px; font-weight: 800; color: #4338ca; display: flex; align-items: center; gap: 6px;">
          <span>✨</span> Ask with Gemini: Question {englishState.currentIndex + 1}
        </div>
        <button
          type="button"
          onclick={() => (showAiModal = false)}
          style="background: #f1f5f9; border: 1.5px solid var(--ink); border-radius: 50%; width: 28px; height: 28px; cursor: pointer; font-size: 12px; font-weight: 800;"
        >
          ✕
        </button>
      </div>

      <!-- Question Banner -->
      <div style="padding: 10px 12px; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 10px; margin-bottom: 12px;">
        <div style="font-size: 11px; font-weight: 800; color: #4338ca; margin-bottom: 2px;">
          Question • Level {curQ?.level}
        </div>
        <div style="font-size: 13.5px; font-weight: 700; color: #0f172a;">
          {curQ?.question}
        </div>
      </div>

      <!-- Smart Prompt Chips -->
      <div style="font-size: 11.5px; font-weight: 800; color: #64748b; margin-bottom: 6px;">
        Ask Gemini AI:
      </div>
      <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px;">
        <button
          type="button"
          onclick={() => handleAiChip('What is the core grammar rule here?')}
          style="padding: 5px 10px; background: #ede9fe; color: #6d28d9; border: 1px solid #c4b5fd; border-radius: 999px; font-size: 11px; font-weight: 700; cursor: pointer;"
        >
          Core Grammar Rule
        </button>
        <button
          type="button"
          onclick={() => handleAiChip('Explain in Urdu with comparison')}
          style="padding: 5px 10px; background: #fef3c7; color: #92400e; border: 1px solid #fde68a; border-radius: 999px; font-size: 11px; font-weight: 700; cursor: pointer;"
        >
          اردو میں وضاحت (Urdu)
        </button>
        <button
          type="button"
          onclick={() => handleAiChip('Show Formula & Structure')}
          style="padding: 5px 10px; background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; border-radius: 999px; font-size: 11px; font-weight: 700; cursor: pointer;"
        >
          Formula &amp; Structure
        </button>
        <button
          type="button"
          onclick={() => handleAiChip('Give 3 More Sentence Examples')}
          style="padding: 5px 10px; background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; border-radius: 999px; font-size: 11px; font-weight: 700; cursor: pointer;"
        >
          3 Sentence Examples
        </button>
      </div>

      <!-- AI Response Output -->
      <div style="background: #fdfbf7; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 12px; font-size: 12.5px; line-height: 1.5; color: #1e293b;">
        {@html customAiResponse || getAiAnswer(curQ)}
      </div>

      <div style="display: flex; justify-content: flex-end; margin-top: 14px;">
        <button
          type="button"
          onclick={() => (showAiModal = false)}
          style="padding: 6px 14px; background: #f1f5f9; border: 1.5px solid var(--ink); border-radius: 8px; font-size: 12px; font-weight: 800; cursor: pointer;"
        >
          Close
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Add Word Modal -->
{#if showAddWordModal}
  <div
    class="nav-menu-overlay"
    onclick={() => (showAddWordModal = false)}
    onkeydown={(e) => { if (e.key === 'Escape') showAddWordModal = false; }}
    role="button"
    tabindex="-1"
    style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 999999; display: flex; align-items: center; justify-content: center; padding: 16px;"
  >
    <div
      class="nav-menu-dropdown"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="dialog"
      tabindex="0"
      style="background: #ffffff; border: 2.5px solid var(--ink); border-radius: 16px; width: min(100%, 420px); padding: 18px; box-shadow: 0 6px 0 var(--ink);"
    >
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
        <div style="font-size: 15px; font-weight: 800; color: #15803d;">➕ Add New Word</div>
        <button
          type="button"
          onclick={() => (showAddWordModal = false)}
          style="background: #f1f5f9; border: 1.5px solid var(--ink); border-radius: 50%; width: 28px; height: 28px; cursor: pointer; font-size: 12px; font-weight: 800;"
        >
          ✕
        </button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        <div>
          <label for="newVocabWord" style="font-size: 11.5px; font-weight: 800; color: #475569; display: block; margin-bottom: 4px;">Word *</label>
          <input id="newVocabWord" type="text" bind:value={newWord} placeholder="e.g. Resilience" style="width: 100%; padding: 8px 10px; border: 1.5px solid var(--ink); border-radius: 8px; font-size: 13px; box-sizing: border-box;" />
        </div>
        <div>
          <label for="newVocabMeaning" style="font-size: 11.5px; font-weight: 800; color: #475569; display: block; margin-bottom: 4px;">Definition / Meaning *</label>
          <textarea id="newVocabMeaning" rows="2" bind:value={newMeaning} placeholder="Capacity to recover quickly..." style="width: 100%; padding: 8px 10px; border: 1.5px solid var(--ink); border-radius: 8px; font-size: 12.5px; font-family: inherit; box-sizing: border-box;"></textarea>
        </div>
        <div>
          <label for="newVocabExample" style="font-size: 11.5px; font-weight: 800; color: #475569; display: block; margin-bottom: 4px;">Example Sentence</label>
          <input id="newVocabExample" type="text" bind:value={newExample} placeholder="She showed great resilience." style="width: 100%; padding: 8px 10px; border: 1.5px solid var(--ink); border-radius: 8px; font-size: 13px; box-sizing: border-box;" />
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 14px;">
        <button type="button" onclick={() => (showAddWordModal = false)} style="padding: 6px 12px; background: #f1f5f9; border: 1.5px solid var(--ink); border-radius: 8px; font-size: 12px; font-weight: 800; cursor: pointer;">Cancel</button>
        <button type="button" onclick={handleAddWord} style="padding: 6px 14px; background: #16a34a; color: #ffffff; border: 1.5px solid var(--ink); border-radius: 8px; font-size: 12px; font-weight: 800; cursor: pointer; box-shadow: 0 1.5px 0 var(--ink);">Save Word</button>
      </div>
    </div>
  </div>
{/if}
