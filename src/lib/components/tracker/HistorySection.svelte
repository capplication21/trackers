<script>
  import { onMount } from 'svelte';
  import { trackerState } from '$lib/stores/trackerState.svelte.js';

  onMount(() => {
    trackerState.init();
  });
</script>

<div class="tab-content active" id="tab-history" style="display: block;">
  <div class="section-title history-title">
    <span>📜</span> 30-DAY COMPLETION ARCHIVE
  </div>

  {#if trackerState.history.length === 0}
    <div style="background: #ffffff; border: 2px dashed #cbd5e1; border-radius: 14px; padding: 32px; text-align: center; color: #64748b;">
      <div style="font-size: 32px; margin-bottom: 8px;">📅</div>
      <div style="font-size: 15px; font-weight: 800; color: var(--ink);">No History Yet</div>
      <p style="font-size: 12px; margin-top: 4px;">Complete daily habits and tasks to see your historical performance here.</p>
    </div>
  {:else}
    <div style="display: flex; flex-direction: column; gap: 10px;">
      {#each trackerState.history as entry (entry.date)}
        {@const pct = entry.total ? Math.round((entry.completed / entry.total) * 100) : 0}
        <div style="background: #ffffff; border: 2px solid var(--ink); border-radius: 14px; padding: 12px 14px; box-shadow: 0 3px 0 var(--ink); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
          <div>
            <div style="font-size: 14px; font-weight: 800; color: var(--ink);">{entry.date}</div>
            <div style="font-size: 11.5px; color: #64748b; font-weight: 700; display: flex; gap: 10px; margin-top: 4px;">
              <span>💧 {entry.waterGlasses || 0} glasses</span>
              <span>🚶 {entry.walkSteps || 0} steps</span>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 14px; font-weight: 800; color: {pct >= 80 ? 'var(--green)' : pct >= 50 ? 'var(--yellow)' : 'var(--red)'};">
              {pct}% Completed
            </div>
            <div style="font-size: 11px; color: #94a3b8; font-weight: 700;">
              {entry.completed} / {entry.total} tasks
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
