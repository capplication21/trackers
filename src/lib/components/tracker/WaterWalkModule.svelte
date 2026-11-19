<script>
  import { onMount } from 'svelte';
  import { trackerState } from '$lib/stores/trackerState.svelte.js';

  onMount(() => {
    trackerState.init();
  });
</script>

<div class="tab-content active" id="tab-water" style="display: block;">
  <div class="section-title water-title"><span>✅</span> DAILY HABITS &amp; HEALTH</div>

  <!-- Water & Walk Daily Summary Card -->
  <div class="history-card chore-card" style="margin-bottom:14px;">
    <div class="chore-question">💧 Daily Hydration &amp; Movement</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:12px 0;">
      <div style="background:#f0fdfa;border:1.5px solid #99f6e4;border-radius:12px;padding:12px;text-align:center;">
        <div style="font-size:11px;font-weight:800;color:#0d9488;">TOTAL WATER</div>
        <div style="font-size:24px;font-weight:800;color:#0f766e;margin:4px 0;">{trackerState.totalWaterGlasses} glasses</div>
        <div style="font-size:12px;color:#115e59;font-weight:700;">{trackerState.totalWaterMl} ml / 2000 ml</div>
      </div>
      <div style="background:#fff7ed;border:1.5px solid #fed7aa;border-radius:12px;padding:12px;text-align:center;">
        <div style="font-size:11px;font-weight:800;color:#ea580c;">TOTAL STEPS</div>
        <div style="font-size:24px;font-weight:800;color:#c2410c;margin:4px 0;">{trackerState.totalWalkSteps} steps</div>
        <div style="font-size:12px;color:#9a3412;font-weight:700;">Goal: 6,000 steps</div>
      </div>
    </div>
  </div>

  <!-- Hair Wash Card -->
  <div class="history-card chore-card">
    <div class="chore-question">🧴 Washed hair this week?</div>
    <div class="hair-wash-row">
      <div class="hair-wash-count" id="hairWashCount">
        {trackerState.hairWashCount} / 2 this week
      </div>
      <div class="hair-wash-buttons">
        <button
          type="button"
          class="hair-wash-btn hair-wash-minus"
          onclick={() => trackerState.adjustHairWash(-1)}
          id="hairWashMinusBtn"
        >
          −
        </button>
        <button
          type="button"
          class="hair-wash-btn hair-wash-plus"
          onclick={() => trackerState.adjustHairWash(1)}
        >
          +1 Log a wash
        </button>
      </div>
    </div>
    <div class="hair-wash-progress-track">
      <div
        class="hair-wash-progress-fill"
        id="hairWashProgressFill"
        style="width:{Math.min(100, (trackerState.hairWashCount / 2) * 100)}%;"
      ></div>
    </div>
    <div class="medicine-reminder-row">
      <div>
        <div class="medicine-reminder-text">🔔 Hair wash reminders</div>
        <div class="medicine-reminder-sub" id="hairWashReminderSub">
          {trackerState.hairWashReminders ? 'Reminders active for this week.' : "Get a nudge if you're behind on 2x this week."}
        </div>
      </div>
      <button
        type="button"
        class="medicine-reminder-btn {trackerState.hairWashReminders ? 'active' : ''}"
        id="hairWashReminderBtn"
        onclick={() => trackerState.toggleHairWashReminders()}
      >
        {trackerState.hairWashReminders ? 'Enabled ✓' : 'Enable'}
      </button>
    </div>
  </div>

  <!-- Typing Practice Card -->
  <div class="history-card chore-card">
    <div class="chore-question">⌨️ Typing practice done?</div>
    <a
      class="yt-link"
      href="https://www.typing.com/student/lessons"
      target="_blank"
      rel="noopener noreferrer"
      onclick={(e) => e.stopPropagation()}
    >
      <span>⌨️</span> Open Typing.com Lessons
    </a>
    <div class="typing-range-row">
      <div class="typing-date-picker-box">
        <span class="lecture-date-icon">📅</span>
        <span class="typing-date-display" id="typingStartDateDisplay">
          {trackerState.typingRange.start || 'Start date'}
        </span>
        <input
          type="date"
          class="typing-hidden-date-input"
          value={trackerState.typingRange.start || ''}
          onchange={(e) => trackerState.setTypingDate('start', e.currentTarget.value)}
        />
      </div>
      <span class="typing-range-sep">to</span>
      <div class="typing-date-picker-box">
        <span class="lecture-date-icon">🏁</span>
        <span class="typing-date-display" id="typingEndDateDisplay">
          {trackerState.typingRange.end || 'End date'}
        </span>
        <input
          type="date"
          class="typing-hidden-date-input"
          value={trackerState.typingRange.end || ''}
          onchange={(e) => trackerState.setTypingDate('end', e.currentTarget.value)}
        />
      </div>
    </div>
  </div>
</div>
