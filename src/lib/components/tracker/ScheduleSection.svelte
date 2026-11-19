<script>
  import { onMount } from 'svelte';
  import { trackerState } from '$lib/stores/trackerState.svelte.js';
  import { navigationState } from '$lib/stores/navigationState.svelte.js';

  let activePeriod = $state('activities'); // 'activities' | 'morning' | 'afternoon' | 'evening' | 'night'

  onMount(() => {
    trackerState.init();
  });
</script>

<div class="tab-content active" id="tab-schedule" style="display: block;">
  <!-- Schedule Tabs Header -->
  <div class="schedule-tabs">
    <button
      type="button"
      class="schedule-tab-btn {activePeriod === 'activities' ? 'active' : ''}"
      onclick={() => (activePeriod = 'activities')}
    >
      <span class="schedule-tab-icon">🎯</span>
      <span class="schedule-tab-label">Activities</span>
    </button>
    <button
      type="button"
      class="schedule-tab-btn {activePeriod === 'morning' ? 'active' : ''}"
      onclick={() => (activePeriod = 'morning')}
    >
      <span class="schedule-tab-icon">🌅</span>
      <span class="schedule-tab-label">Morning</span>
    </button>
    <button
      type="button"
      class="schedule-tab-btn {activePeriod === 'afternoon' ? 'active' : ''}"
      onclick={() => (activePeriod = 'afternoon')}
    >
      <span class="schedule-tab-icon">☀️</span>
      <span class="schedule-tab-label">Afternoon</span>
    </button>
    <button
      type="button"
      class="schedule-tab-btn {activePeriod === 'evening' ? 'active' : ''}"
      onclick={() => (activePeriod = 'evening')}
    >
      <span class="schedule-tab-icon">🌇</span>
      <span class="schedule-tab-label">Evening</span>
    </button>
    <button
      type="button"
      class="schedule-tab-btn {activePeriod === 'night' ? 'active' : ''}"
      onclick={() => (activePeriod = 'night')}
    >
      <span class="schedule-tab-icon">🌙</span>
      <span class="schedule-tab-label">Night</span>
    </button>
  </div>

  <!-- Overall Progress Bar -->
  <div style="background:#ffffff;border:2px solid var(--ink);border-radius:14px;padding:12px 16px;margin-bottom:14px;box-shadow:0 3px 0 var(--ink);">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
      <span style="font-size:12px;font-weight:800;color:var(--ink);">TODAY'S PROGRESS</span>
      <span style="font-size:12px;font-weight:800;color:var(--teal);">{trackerState.completedCount} / {trackerState.tasks.length} ({trackerState.completionPercentage}%)</span>
    </div>
    <div style="width:100%;height:10px;background:#f1f5f9;border-radius:999px;border:1px solid #cbd5e1;overflow:hidden;">
      <div style="width:{trackerState.completionPercentage}%;height:100%;background:linear-gradient(90deg, #10b981, #06b6d4);transition:width 0.3s ease;"></div>
    </div>
  </div>

  {#if activePeriod === 'activities'}
    <!-- ACTIVITIES / STUDY HUBS SECTION -->
    <div id="activities-section" class="schedule-section active">
      <div class="section-title activities-title" style="background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); border-left-color: #7c3aed; color: #5b21b6; margin-bottom: 14px;">
        <span>🎯</span> DAILY ACTIVITIES &amp; STUDY HUBS
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
        <!-- 1. 3 DAYS A WEEK -->
        <div
          class="activity-link-card"
          onclick={() => navigationState.setTab('week')}
          onkeydown={(e) => { if (e.key === 'Enter') navigationState.setTab('week'); }}
          tabindex="0"
          role="button"
          style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 2px solid var(--ink); border-radius: 16px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px; cursor: pointer; box-shadow: 0 3px 0 var(--ink);"
        >
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="hub-card-icon" style="font-size:22px; width: 40px; height: 40px; background: #ffffff; border: 2px solid #f59e0b; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              📅
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <span style="font-size: 14px; font-weight: 800; color: #78350f;">3 DAYS A WEEK</span>
                <span class="hub-card-badge" style="background: #fde68a; color: #92400e; border-color: #f59e0b;">COURSES</span>
              </div>
              <div style="font-size: 11.5px; color: #92400e; opacity: 0.85; margin-top: 2px;">
                Zad Academy &amp; Understand Quran weekly courses &amp; study logs
              </div>
            </div>
          </div>
          <button type="button" class="page-back-btn" style="padding: 6px 13px; font-size: 11.5px; background: #d97706; color: #ffffff; border: 1.5px solid var(--ink); border-radius: 9px; box-shadow: 0 2px 0 var(--ink); flex-shrink: 0; font-weight: 800;">
            Open ↗
          </button>
        </div>

        <!-- 2. READING BOOK -->
        <div
          class="activity-link-card"
          onclick={() => navigationState.setTab('reading')}
          onkeydown={(e) => { if (e.key === 'Enter') navigationState.setTab('reading'); }}
          tabindex="0"
          role="button"
          style="background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); border: 2px solid var(--ink); border-radius: 16px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px; cursor: pointer; box-shadow: 0 3px 0 var(--ink);"
        >
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="hub-card-icon" style="font-size:22px; width: 40px; height: 40px; background: #ffffff; border: 2px solid #db2777; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              📚
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <span style="font-size: 14px; font-weight: 800; color: #831843;">ENGLISH2FLOW READING</span>
                <span class="hub-card-badge" style="background: #fbcfe8; color: #9d174d; border-color: #ec4899;">3D BOOK</span>
              </div>
              <div style="font-size: 11.5px; color: #9d174d; opacity: 0.85; margin-top: 2px;">
                Graded readers, synchronized video/audio bar &amp; 3D flipbook
              </div>
            </div>
          </div>
          <button type="button" class="page-back-btn" style="padding: 6px 13px; font-size: 11.5px; background: #db2777; color: #ffffff; border: 1.5px solid var(--ink); border-radius: 9px; box-shadow: 0 2px 0 var(--ink); flex-shrink: 0; font-weight: 800;">
            Read ↗
          </button>
        </div>

        <!-- 3. ENGLISH TOOLKIT -->
        <div
          class="activity-link-card"
          onclick={() => navigationState.setTab('english')}
          onkeydown={(e) => { if (e.key === 'Enter') navigationState.setTab('english'); }}
          tabindex="0"
          role="button"
          style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 2px solid var(--ink); border-radius: 16px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px; cursor: pointer; box-shadow: 0 3px 0 var(--ink);"
        >
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="hub-card-icon" style="font-size:22px; width: 40px; height: 40px; background: #ffffff; border: 2px solid #2563eb; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              🔤
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <span style="font-size: 14px; font-weight: 800; color: #1e3a8a;">ENGLISH B1 TOOLKIT</span>
                <span class="hub-card-badge" style="background: #bfdbfe; color: #1d4ed8; border-color: #3b82f6;">STUDY</span>
              </div>
              <div style="font-size: 11.5px; color: #1e40af; opacity: 0.85; margin-top: 2px;">
                Vocabulary, Grammar, Phonics, Daily Routine &amp; Practice
              </div>
            </div>
          </div>
          <button type="button" class="page-back-btn" style="padding: 6px 13px; font-size: 11.5px; background: #2563eb; color: #ffffff; border: 1.5px solid var(--ink); border-radius: 9px; box-shadow: 0 2px 0 var(--ink); flex-shrink: 0; font-weight: 800;">
            Study ↗
          </button>
        </div>

        <!-- 4. MORNING & EVENING ADKAR -->
        <div
          class="activity-link-card"
          onclick={() => navigationState.setTab('adkar')}
          onkeydown={(e) => { if (e.key === 'Enter') navigationState.setTab('adkar'); }}
          tabindex="0"
          role="button"
          style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 2px solid var(--ink); border-radius: 16px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px; cursor: pointer; box-shadow: 0 3px 0 var(--ink);"
        >
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="hub-card-icon" style="font-size:22px; width: 40px; height: 40px; background: #ffffff; border: 2px solid #059669; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              📿
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <span style="font-size: 14px; font-weight: 800; color: #064e3b;">ADKAR &amp; DUAS</span>
                <span class="hub-card-badge" style="background: #a7f3d0; color: #065f46; border-color: #10b981;">DHIKR</span>
              </div>
              <div style="font-size: 11.5px; color: #047857; opacity: 0.85; margin-top: 2px;">
                Morning &amp; Evening Supplications with interactive counters
              </div>
            </div>
          </div>
          <button type="button" class="page-back-btn" style="padding: 6px 13px; font-size: 11.5px; background: #059669; color: #ffffff; border: 1.5px solid var(--ink); border-radius: 9px; box-shadow: 0 2px 0 var(--ink); flex-shrink: 0; font-weight: 800;">
            Dhikr ↗
          </button>
        </div>
      </div>
    </div>
  {:else}
    <!-- TIME PERIOD TIMELINE (MORNING, AFTERNOON, EVENING, NIGHT) -->
    {@const periodTasks = trackerState.tasks.filter((t) => (t.period || 'morning') === activePeriod)}
    <div class="schedule-section active">
      <div class="section-title" style="margin-bottom:14px;text-transform:uppercase;">
        <span>🌅</span> {activePeriod} ROUTINE
      </div>

      <!-- Water & Walk Quick Counter for this period -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
        <div style="background:#ffffff;border:2px solid var(--ink);border-radius:14px;padding:12px;box-shadow:0 3px 0 var(--ink);text-align:center;">
          <div style="font-size:12px;font-weight:800;color:var(--teal);margin-bottom:6px;">💧 WATER ({activePeriod})</div>
          <div style="font-size:22px;font-weight:800;color:var(--ink);margin-bottom:8px;">{trackerState.water[activePeriod] || 0} glasses</div>
          <div style="display:flex;justify-content:center;gap:8px;">
            <button type="button" class="hair-wash-btn" onclick={() => trackerState.adjustWater(activePeriod, -1)}>−1</button>
            <button type="button" class="hair-wash-btn hair-wash-plus" onclick={() => trackerState.adjustWater(activePeriod, 1)}>+1 Glass</button>
          </div>
        </div>

        <div style="background:#ffffff;border:2px solid var(--ink);border-radius:14px;padding:12px;box-shadow:0 3px 0 var(--ink);text-align:center;">
          <div style="font-size:12px;font-weight:800;color:var(--orange);margin-bottom:6px;">🚶 WALK ({activePeriod})</div>
          <div style="font-size:22px;font-weight:800;color:var(--ink);margin-bottom:8px;">{trackerState.walk[activePeriod] || 0} steps</div>
          <div style="display:flex;justify-content:center;gap:8px;">
            <button type="button" class="hair-wash-btn" onclick={() => trackerState.adjustWalk(activePeriod, -500)}>−500</button>
            <button type="button" class="hair-wash-btn hair-wash-plus" onclick={() => trackerState.adjustWalk(activePeriod, 500)}>+500</button>
          </div>
        </div>
      </div>

      <!-- Task Checklist for this Period -->
      <div style="display:flex;flex-direction:column;gap:10px;">
        {#each periodTasks as task (task.id || task.text)}
          {@const isDone = trackerState.completedTasks[task.id || task.text]}
          <div
            class="schedule-task-item {isDone ? 'done' : ''}"
            onclick={() => trackerState.toggleTask(task.id || task.text)}
            onkeydown={(e) => { if (e.key === 'Enter') trackerState.toggleTask(task.id || task.text); }}
            tabindex="0"
            role="button"
            style="background:#ffffff;border:2px solid var(--ink);border-radius:14px;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;box-shadow:0 3px 0 var(--ink);transition:all 0.12s ease;opacity:{isDone ? 0.65 : 1};"
          >
            <div style="display:flex;align-items:center;gap:12px;">
              <input
                type="checkbox"
                checked={isDone}
                style="width:20px;height:20px;cursor:pointer;accent-color:var(--green);"
                onclick={(e) => e.stopPropagation()}
                onchange={() => trackerState.toggleTask(task.id || task.text)}
              />
              <div>
                <div style="font-size:14px;font-weight:700;color:var(--ink);text-decoration:{isDone ? 'line-through' : 'none'};">
                  {task.icon || '📌'} {task.label || task.title || task.text}
                </div>
                {#if task.time}
                  <div style="font-size:11px;font-weight:700;color:#64748b;margin-top:2px;">
                    ⏰ {task.time}
                  </div>
                {/if}
              </div>
            </div>

            <span style="font-size:11px;font-weight:800;color:{isDone ? 'var(--green)' : '#94a3b8'};">
              {isDone ? 'Done ✓' : 'Pending'}
            </span>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
