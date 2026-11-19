<script>
  import { onMount } from 'svelte';
  import { englishState } from '$lib/stores/englishState.svelte.js';
  import { navigationState } from '$lib/stores/navigationState.svelte.js';

  let activeTab = $state('routine'); // 'routine' | 'vocab' | 'themes'
  let vocabSearch = $state('');

  onMount(() => {
    englishState.init();
  });

  const filteredVocab = $derived.by(() => {
    if (!vocabSearch.trim()) return englishState.vocabList;
    const q = vocabSearch.toLowerCase();
    return englishState.vocabList.filter(
      (v) => (v.word || '').toLowerCase().includes(q) || (v.meaning || '').toLowerCase().includes(q)
    );
  });
</script>

<div class="tab-content active" id="tab-english" style="display: block;">
  <div class="section-title" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
    <span><span>🔤</span> B1 ENGLISH TOOLKIT</span>
    <button
      type="button"
      class="reading-tool-btn active"
      onclick={() => navigationState.setTab('englishtest')}
      style="font-size: 11.5px; padding: 4px 10px;"
    >
      📝 Take English Exam Test ➔
    </button>
  </div>

  <!-- Sub Navigation -->
  <div style="display: flex; gap: 8px; margin-bottom: 16px;">
    <button
      type="button"
      class="reading-filter-pill {activeTab === 'routine' ? 'active' : ''}"
      onclick={() => (activeTab = 'routine')}
    >
      🎯 Daily Routine
    </button>
    <button
      type="button"
      class="reading-filter-pill {activeTab === 'vocab' ? 'active' : ''}"
      onclick={() => (activeTab = 'vocab')}
    >
      📖 Vocabulary Bank ({englishState.vocabList.length})
    </button>
  </div>

  {#if activeTab === 'routine'}
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <!-- Daily 4 Pillars Card -->
      <div style="background: #ffffff; border: 2px solid var(--ink); border-radius: 16px; padding: 16px; box-shadow: 0 3px 0 var(--ink);">
        <div style="font-size: 15px; font-weight: 800; color: var(--ink); margin-bottom: 12px;">
          🌟 Daily 4 Pillars to Fluency
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px;">
          <div style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 12px; padding: 12px;">
            <div style="font-weight: 800; font-size: 13px; color: #1e40af; margin-bottom: 4px;">🎧 1. Listening (15 mins)</div>
            <div style="font-size: 11.5px; color: #1e3a8a; line-height: 1.4;">Listen to English2Flow story videos or BBC 6 Minute English. Focus on accent &amp; rhythm.</div>
          </div>
          <div style="background: #fdf2f8; border: 1.5px solid #fbcfe8; border-radius: 12px; padding: 12px;">
            <div style="font-weight: 800; font-size: 13px; color: #9d174d; margin-bottom: 4px;">🗣️ 2. Speaking (10 mins)</div>
            <div style="font-size: 11.5px; color: #831843; line-height: 1.4;">Shadow native sentences aloud. Record yourself answering daily discussion questions.</div>
          </div>
          <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 12px; padding: 12px;">
            <div style="font-weight: 800; font-size: 13px; color: #166534; margin-bottom: 4px;">📖 3. Reading (15 mins)</div>
            <div style="font-size: 11.5px; color: #14532d; line-height: 1.4;">Read 1 chapter of English2Flow 3D graded reader. Note 3 new key vocabulary items.</div>
          </div>
          <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px; padding: 12px;">
            <div style="font-weight: 800; font-size: 13px; color: #92400e; margin-bottom: 4px;">✍️ 4. Writing &amp; Test (10 mins)</div>
            <div style="font-size: 11.5px; color: #78350f; line-height: 1.4;">Write a 3-sentence chapter summary and take the 10-question English Exam test.</div>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <!-- Vocabulary Bank -->
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <input
        type="text"
        placeholder="🔍 Search vocabulary word or meaning..."
        bind:value={vocabSearch}
        style="width: 100%; padding: 10px 14px; border: 2px solid var(--ink); border-radius: 12px; font-size: 13px; font-weight: 600; box-shadow: 0 2px 0 var(--ink); box-sizing: border-box;"
      />

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 10px;">
        {#each filteredVocab as v}
          <div style="background: #ffffff; border: 1.5px solid var(--ink); border-radius: 12px; padding: 12px; box-shadow: 0 2px 0 var(--ink);">
            <div style="font-size: 14px; font-weight: 800; color: #1e3a8a; margin-bottom: 4px;">
              {v.word || v.en}
            </div>
            <div style="font-size: 12px; color: #475569; line-height: 1.4; margin-bottom: 6px;">
              {v.meaning || v.definition}
            </div>
            {#if v.urdu || v.ur}
              <div style="font-family: 'Noto Nastaliq Urdu', serif; font-size: 14px; color: #047857; direction: rtl; text-align: right;">
                {v.urdu || v.ur}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
