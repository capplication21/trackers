<script>
  import { onMount } from 'svelte';
  import { trackerState } from '$lib/stores/trackerState.svelte.js';

  onMount(() => {
    trackerState.init();
  });

  const totalDays = $derived(trackerState.history.length || 1);
  const avgCompletion = $derived.by(() => {
    if (!trackerState.history.length) return trackerState.completionPercentage;
    const sum = trackerState.history.reduce((acc, h) => acc + (h.total ? (h.completed / h.total) * 100 : 0), 0);
    return Math.round(sum / trackerState.history.length);
  });
</script>

<div class="tab-content active" id="tab-summary" style="display: block;">
  <div class="section-title water-title">
    <span>📊</span> TRACKER PERFORMANCE &amp; STATS
  </div>

  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 16px;">
    <div style="background: #ffffff; border: 2px solid var(--ink); border-radius: 14px; padding: 14px; box-shadow: 0 3px 0 var(--ink); text-align: center;">
      <div style="font-size: 24px; margin-bottom: 4px;">🎯</div>
      <div style="font-size: 22px; font-weight: 800; color: var(--teal);">{avgCompletion}%</div>
      <div style="font-size: 11px; font-weight: 800; color: #64748b;">AVG COMPLETION</div>
    </div>

    <div style="background: #ffffff; border: 2px solid var(--ink); border-radius: 14px; padding: 14px; box-shadow: 0 3px 0 var(--ink); text-align: center;">
      <div style="font-size: 24px; margin-bottom: 4px;">📅</div>
      <div style="font-size: 22px; font-weight: 800; color: var(--ink);">{totalDays}</div>
      <div style="font-size: 11px; font-weight: 800; color: #64748b;">DAYS TRACKED</div>
    </div>

    <div style="background: #ffffff; border: 2px solid var(--ink); border-radius: 14px; padding: 14px; box-shadow: 0 3px 0 var(--ink); text-align: center;">
      <div style="font-size: 24px; margin-bottom: 4px;">💧</div>
      <div style="font-size: 22px; font-weight: 800; color: #0284c7;">{trackerState.totalWaterGlasses}</div>
      <div style="font-size: 11px; font-weight: 800; color: #64748b;">GLASSES TODAY</div>
    </div>

    <div style="background: #ffffff; border: 2px solid var(--ink); border-radius: 14px; padding: 14px; box-shadow: 0 3px 0 var(--ink); text-align: center;">
      <div style="font-size: 24px; margin-bottom: 4px;">🚶</div>
      <div style="font-size: 22px; font-weight: 800; color: #ea580c;">{trackerState.totalWalkSteps}</div>
      <div style="font-size: 11px; font-weight: 800; color: #64748b;">STEPS TODAY</div>
    </div>
  </div>
</div>
