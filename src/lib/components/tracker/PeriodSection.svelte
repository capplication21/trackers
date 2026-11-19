<script>
  import { onMount } from 'svelte';
  import { trackerState } from '$lib/stores/trackerState.svelte.js';

  let showModal = $state(false);
  let newStart = $state('');
  let newEnd = $state('');

  onMount(() => {
    trackerState.init();
  });

  const latestPeriod = $derived(trackerState.periodData.periods[0] || null);

  const nextPeriodEstimate = $derived.by(() => {
    if (!latestPeriod || !latestPeriod.start) return { dateStr: '--', daysLeft: '--' };
    const startDate = new Date(latestPeriod.start);
    const cycle = trackerState.periodData.defaultCycleLength || 28;
    const nextDate = new Date(startDate.getTime() + cycle * 24 * 60 * 60 * 1000);
    const today = new Date();
    const diffDays = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return {
      dateStr: nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      daysLeft: diffDays > 0 ? diffDays : 0
    };
  });

  async function handleAddPeriod() {
    if (newStart) {
      await trackerState.addPeriodEntry(newStart, newEnd || newStart);
      newStart = '';
      newEnd = '';
      showModal = false;
    }
  }
</script>

<div class="tab-content active" id="tab-period" style="display: block;">
  <div class="section-title period-title">
    <span>🌸</span> PERIOD &amp; CYCLE TRACKER
  </div>

  <!-- Period Bar -->
  <div class="nav-bar">
    <div class="nav-title-section">
      <span class="nav-title-label">First Date (Last)</span>
      <span class="nav-title-value">{latestPeriod?.start || '--'}</span>
    </div>
    <div class="nav-countdown-box">
      <div class="label">Next in</div>
      <div class="days">{nextPeriodEstimate.daysLeft}</div>
      <div class="label">days</div>
    </div>
    <div class="nav-title-section" style="align-items: flex-end; text-align: right">
      <span class="nav-title-label">✨ Next Date</span>
      <span class="nav-title-value" style="color: #6d28d9; font-weight: 800;">{nextPeriodEstimate.dateStr}</span>
    </div>
    <button type="button" class="nav-edit-btn" onclick={() => (showModal = true)}>
      <span>➕</span> Add / Edit
    </button>
  </div>

  <!-- Fertility Overview Card -->
  <div class="period-fertility-card" style="background: linear-gradient(135deg, #fffbeb 0%, #faf5ff 100%); border: 2px solid #ddd6fe; border-radius: 14px; padding: 14px 16px; margin-bottom: 14px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
      <span style="font-weight: 800; font-size: 13.5px; color: #581c87; display: flex; align-items: center; gap: 5px;">
        <span>🌸</span> Fertility &amp; Cycle Overview
      </span>
      <span class="cycle-badge cycle-badge-length" style="font-size: 11.5px; padding: 3px 8px;">
        ⚡ {trackerState.periodData.defaultCycleLength || 28} days cycle
      </span>
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center; background: #f5f3ff; border: 1.5px solid #ddd6fe; border-radius: 10px; padding: 8px 12px; font-size: 12px;">
      <span style="color: #5b21b6; font-weight: 800;">✨ Next Period Date: <strong style="color: #7c3aed;">{nextPeriodEstimate.dateStr}</strong></span>
      <span style="color: #6d28d9; font-weight: 700;">Last Logged: {latestPeriod?.start || '--'}</span>
    </div>
  </div>

  <!-- History Card -->
  <div class="history-card">
    <div class="history-header">
      <span class="history-title">📜 Period History</span>
      <span class="history-count">{trackerState.periodData.periods.length}</span>
    </div>
    <div class="history-list">
      {#if trackerState.periodData.periods.length === 0}
        <div class="history-empty">
          No period history yet. Tap "Add / Edit" to get started.
        </div>
      {:else}
        {#each trackerState.periodData.periods as p (p.id || p.start)}
          <div style="display:flex;justify-content:space-between;padding:10px 12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:8px;">
            <div style="font-weight:800;color:var(--ink);">{p.start} {#if p.end && p.end !== p.start}➔ {p.end}{/if}</div>
            <span style="color:#7c3aed;font-weight:700;font-size:12px;">Logged</span>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>

{#if showModal}
  <div class="reading-modal-overlay">
    <div class="reading-modal-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <div style="font-size:15px;font-weight:800;color:#fef08a;">🌸 Log Period</div>
        <button type="button" class="reading-tool-btn" onclick={() => (showModal = false)}>✕</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div>
          <label for="periodStartDate" style="font-size:11px;font-weight:800;color:#cbd5e1;display:block;margin-bottom:4px;">First Day of Period *</label>
          <input id="periodStartDate" type="date" bind:value={newStart} style="width:100%;padding:8px 10px;border-radius:6px;border:1px solid #475569;background:#0f172a;color:#ffffff;box-sizing:border-box;" />
        </div>
        <div>
          <label for="periodEndDate" style="font-size:11px;font-weight:800;color:#cbd5e1;display:block;margin-bottom:4px;">End Date (Optional)</label>
          <input id="periodEndDate" type="date" bind:value={newEnd} style="width:100%;padding:8px 10px;border-radius:6px;border:1px solid #475569;background:#0f172a;color:#ffffff;box-sizing:border-box;" />
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px;">
        <button type="button" class="reading-tool-btn" onclick={() => (showModal = false)}>Cancel</button>
        <button type="button" class="reading-tool-btn active" onclick={handleAddPeriod}>Save Entry</button>
      </div>
    </div>
  </div>
{/if}
