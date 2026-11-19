<script>
  import { onMount } from 'svelte';
  import { adkarState } from '$lib/stores/adkarState.svelte.js';

  onMount(() => {
    adkarState.init();
  });
</script>

<div class="tab-content active" id="tab-adkar" style="display: block;">
  <div class="section-title" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
    <span><span>📿</span> ADKAR &amp; DUAS</span>
    <button
      type="button"
      class="reading-tool-btn"
      onclick={() => adkarState.resetCounters()}
      title="Reset all counters to 0"
      style="font-size: 11.5px; padding: 4px 10px;"
    >
      ↺ Reset Counters
    </button>
  </div>

  <!-- Navigation Pills -->
  <div style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;">
    <button
      type="button"
      class="reading-filter-pill {adkarState.activeSection === 'morning' ? 'active' : ''}"
      onclick={() => (adkarState.activeSection = 'morning')}
    >
      🌅 Morning Adhkar ({adkarState.morningItems.length})
    </button>
    <button
      type="button"
      class="reading-filter-pill {adkarState.activeSection === 'evening' ? 'active' : ''}"
      onclick={() => (adkarState.activeSection = 'evening')}
    >
      🌇 Evening Adhkar ({adkarState.eveningItems.length})
    </button>
    <button
      type="button"
      class="reading-filter-pill {adkarState.activeSection === 'surahs' ? 'active' : ''}"
      onclick={() => (adkarState.activeSection = 'surahs')}
    >
      📖 Quran Surahs ({adkarState.surahs.length})
    </button>
  </div>

  {#if adkarState.activeSection === 'surahs'}
    <!-- Surahs Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr)); gap: clamp(8px, 1.5vw, 12px);">
      {#each adkarState.surahs as surah (surah.num)}
        <div style="background: #ffffff; border: 1.5px solid var(--ink); border-radius: 12px; padding: 12px; box-shadow: 0 2px 0 var(--ink); display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 11px; font-weight: 800; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 6px;">#{surah.num}</span>
              <strong style="font-size: 13.5px; color: var(--ink);">{surah.name}</strong>
            </div>
            <div style="font-size: 11px; color: #64748b; margin-top: 3px;">{surah.count} Ayahs</div>
          </div>
          <div style="text-align: right; font-family: 'Amiri', 'Scheherazade New', serif; font-size: 20px; color: #0369a1; direction: rtl;">
            {surah.ar || ''}
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <!-- Dhikr List -->
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 460px), 1fr)); gap: clamp(10px, 2vw, 16px);">
      {#each adkarState.currentItems as item, idx (item.id || idx)}
        {@const maxCount = item.count || 1}
        {@const currentCount = adkarState.counters[item.id || idx] || 0}
        {@const isComplete = currentCount >= maxCount}
        <div
          class="adkar-item-card {isComplete ? 'completed' : ''}"
          style="background: #ffffff; border: 2px solid {isComplete ? '#10b981' : 'var(--ink)'}; border-radius: 16px; padding: clamp(12px, 2vw, 18px); box-shadow: 0 3px 0 {isComplete ? '#059669' : 'var(--ink)'}; transition: all 0.15s ease; display: flex; flex-direction: column; justify-content: space-between;"
        >
          <div>
            <!-- Card Header & Counter -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 12px; font-weight: 800; background: #f1f5f9; color: #475569; padding: 3px 8px; border-radius: 6px;">
                  #{idx + 1}
                </span>
                <span style="font-size: 14px; font-weight: 800; color: var(--ink);">
                  {item.title || (adkarState.activeSection === 'morning' ? 'Morning Dhikr' : 'Evening Dhikr')}
                </span>
              </div>

              <!-- Big Counter Pill -->
              <button
                type="button"
                onclick={() => adkarState.increment(item.id || idx, maxCount)}
                disabled={isComplete}
                style="cursor: {isComplete ? 'default' : 'pointer'}; display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 999px; font-weight: 800; font-size: 13px; border: 2px solid var(--ink); background: {isComplete ? '#dcfce7' : '#fef08a'}; color: {isComplete ? '#166534' : '#854d0e'}; box-shadow: 0 2px 0 var(--ink);"
              >
                {#if isComplete}
                  <span>✓ Completed ({maxCount}x)</span>
                {:else}
                  <span>+1 Read ({currentCount} / {maxCount})</span>
                {/if}
              </button>
            </div>

            <!-- Arabic Text -->
            <div
              style="font-family: 'Amiri', 'Scheherazade New', serif; font-size: clamp(20px, 3.5vw, 24px); line-height: 2.2; color: #1e293b; direction: rtl; text-align: right; margin-bottom: 14px; padding: 12px 14px; background: #fdfbf7; border-radius: 12px; border: 1px solid #f1e9d2;"
            >
              {item.ar}
            </div>

            <!-- Transliteration -->
            {#if item.trans}
              <div style="font-size: 12.5px; font-style: italic; color: #475569; line-height: 1.6; margin-bottom: 8px;">
                "{item.trans}"
              </div>
            {/if}

            <!-- English Translation -->
            {#if item.en}
              <div style="font-size: 13px; color: #1e293b; line-height: 1.6; margin-bottom: 10px;">
                {item.en}
              </div>
            {/if}
          </div>

          <!-- Virtue / Reference Box -->
          {#if item.virtue}
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #16a34a; border-radius: 8px; padding: 8px 12px; font-size: 11.5px; color: #15803d; line-height: 1.5; margin-top: auto;">
              <strong>Virtue:</strong> {item.virtue}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
