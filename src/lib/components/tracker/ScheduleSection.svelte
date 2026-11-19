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
      data-period="activities"
      onclick={() => (activePeriod = 'activities')}
    >
      <span class="schedule-tab-icon">🎯</span>
      <span class="schedule-tab-label">Activities</span>
    </button>
    <button
      type="button"
      class="schedule-tab-btn {activePeriod === 'morning' ? 'active' : ''}"
      data-period="morning"
      onclick={() => (activePeriod = 'morning')}
    >
      <span class="schedule-tab-icon">🌅</span>
      <span class="schedule-tab-label">Morning</span>
    </button>
    <button
      type="button"
      class="schedule-tab-btn {activePeriod === 'afternoon' ? 'active' : ''}"
      data-period="afternoon"
      onclick={() => (activePeriod = 'afternoon')}
    >
      <span class="schedule-tab-icon">☀️</span>
      <span class="schedule-tab-label">Afternoon</span>
    </button>
    <button
      type="button"
      class="schedule-tab-btn {activePeriod === 'evening' ? 'active' : ''}"
      data-period="evening"
      onclick={() => (activePeriod = 'evening')}
    >
      <span class="schedule-tab-icon">🌇</span>
      <span class="schedule-tab-label">Evening</span>
    </button>
    <button
      type="button"
      class="schedule-tab-btn {activePeriod === 'night' ? 'active' : ''}"
      data-period="night"
      onclick={() => (activePeriod = 'night')}
    >
      <span class="schedule-tab-icon">🌙</span>
      <span class="schedule-tab-label">Night</span>
    </button>
  </div>

  {#if activePeriod === 'activities'}
    <!-- ACTIVITIES / STUDY HUBS SECTION -->
    <div id="activities-section" class="schedule-section active">
      <div class="section-title activities-title" style="background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); border-left-color: #7c3aed; color: #5b21b6; margin-bottom: 14px;">
        <span>🎯</span> DAILY ACTIVITIES &amp; STUDY HUBS
      </div>

      <!-- 5 Activity Hub Cards -->
      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
        <!-- 1. 3 DAYS A WEEK -->
        <div
          class="activity-link-card"
          onclick={() => navigationState.setTab('week')}
          onkeydown={(e) => { if (e.key === 'Enter') navigationState.setTab('week'); }}
          tabindex="0"
          role="button"
          style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 2px solid var(--ink); border-radius: 16px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px; cursor: pointer; box-shadow: 0 3px 0 var(--ink); transition: all 0.16s ease;"
        >
          <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
            <div class="hub-card-icon" style="width: 40px; height: 40px; background: #ffffff; border: 2px solid #f59e0b; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 0 rgba(217, 119, 6, 0.35); flex-shrink: 0;">
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="4.5" width="20" height="18.5" rx="5" fill="#EEF2FF" stroke="#C7D2FE" stroke-width="1"/>
                <path d="M2 9.5C2 6.73858 4.23858 4.5 7 4.5H17C19.7614 4.5 22 6.73858 22 9.5V10.5H2V9.5Z" fill="url(#calGradBlue)"/>
                <rect x="5.5" y="2" width="3" height="4.5" rx="1.5" fill="#3B82F6"/>
                <rect x="15.5" y="2" width="3" height="4.5" rx="1.5" fill="#3B82F6"/>
                <circle cx="7" cy="14" r="1.3" fill="#94A3B8"/>
                <circle cx="12" cy="14" r="1.3" fill="#94A3B8"/>
                <circle cx="17" cy="14" r="1.3" fill="#94A3B8"/>
                <circle cx="7" cy="18" r="1.3" fill="#94A3B8"/>
                <circle cx="12" cy="18" r="1.3" fill="#94A3B8"/>
                <circle cx="17" cy="18" r="1.5" fill="#2563EB"/>
                <defs>
                  <linearGradient id="calGradBlue" x1="2" y1="4.5" x2="22" y2="10.5" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#3B82F6"/>
                    <stop offset="1" stop-color="#1D4ED8"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div style="min-width: 0;">
              <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <span style="font-size: 14px; font-weight: 800; color: #78350f;">3 DAYS A WEEK</span>
                <span class="hub-card-badge" style="background: #fde68a; color: #92400e; border: 1.5px solid #f59e0b; border-radius: 6px; padding: 2px 7px; font-size: 10px; font-weight: 800;">COURSES</span>
              </div>
              <div style="font-size: 11.5px; color: #92400e; opacity: 0.85; margin-top: 2px;">
                Zad Academy &amp; Understand Quran weekly courses &amp; study logs
              </div>
            </div>
          </div>
          <button type="button" class="page-back-btn" style="padding: 6px 13px; font-size: 11.5px; background: #d97706; color: #ffffff; border: 1.5px solid var(--ink); border-radius: 9px; box-shadow: 0 2px 0 var(--ink); flex-shrink: 0; font-weight: 800; cursor: pointer;">
            Open ↗
          </button>
        </div>

        <!-- 2. @understandquran -->
        <div
          class="activity-link-card"
          onclick={() => navigationState.setTab('week')}
          onkeydown={(e) => { if (e.key === 'Enter') navigationState.setTab('week'); }}
          tabindex="0"
          role="button"
          style="background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%); border: 2px solid var(--ink); border-radius: 16px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px; cursor: pointer; box-shadow: 0 3px 0 var(--ink); transition: all 0.16s ease;"
        >
          <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
            <div class="hub-card-icon" style="width: 40px; height: 40px; font-size: 20px; background: #ffffff; border: 2px solid #0d9488; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 0 rgba(13, 148, 136, 0.35); flex-shrink: 0;">
              📖
            </div>
            <div style="min-width: 0;">
              <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <span style="font-size: 14px; font-weight: 800; color: #0f766e;">@understandquran</span>
                <span class="hub-card-badge" style="background: #99f6e4; color: #115e59; border: 1.5px solid #14b8a6; border-radius: 6px; padding: 2px 7px; font-size: 10px; font-weight: 800;">ACADEMY</span>
              </div>
              <div style="font-size: 11.5px; color: #0f766e; opacity: 0.85; margin-top: 2px;">
                Understand Al-Qur'an official lectures, grammar &amp; vocabulary
              </div>
            </div>
          </div>
          <button type="button" class="page-back-btn" style="padding: 6px 13px; font-size: 11.5px; background: #0d9488; color: #ffffff; border: 1.5px solid var(--ink); border-radius: 9px; box-shadow: 0 2px 0 var(--ink); flex-shrink: 0; font-weight: 800; cursor: pointer;">
            Course ↗
          </button>
        </div>

        <!-- 3. DAILY ENGLISH TOOLKIT -->
        <div
          class="activity-link-card"
          onclick={() => navigationState.setTab('english')}
          onkeydown={(e) => { if (e.key === 'Enter') navigationState.setTab('english'); }}
          tabindex="0"
          role="button"
          style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px solid var(--ink); border-radius: 16px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px; cursor: pointer; box-shadow: 0 3px 0 var(--ink); transition: all 0.16s ease;"
        >
          <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
            <div class="hub-card-icon" style="width: 40px; height: 40px; font-size: 16px; font-weight: 800; color: #0284c7; background: #ffffff; border: 2px solid #0284c7; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 0 rgba(2, 132, 199, 0.35); flex-shrink: 0;">
              🔤
            </div>
            <div style="min-width: 0;">
              <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <span style="font-size: 14px; font-weight: 800; color: #0369a1;">DAILY ENGLISH TOOLKIT</span>
                <span class="hub-card-badge" style="background: #bae6fd; color: #0369a1; border: 1.5px solid #0284c7; border-radius: 6px; padding: 2px 7px; font-size: 10px; font-weight: 800;">PRACTICE</span>
              </div>
              <div style="font-size: 11.5px; color: #0369a1; opacity: 0.85; margin-top: 2px;">
                Grammar session, phonics, vocabulary bank &amp; daily fluency routine
              </div>
            </div>
          </div>
          <button type="button" class="page-back-btn" style="padding: 6px 13px; font-size: 11.5px; background: #4f46e5; color: #ffffff; border: 1.5px solid var(--ink); border-radius: 9px; box-shadow: 0 2px 0 var(--ink); flex-shrink: 0; font-weight: 800; cursor: pointer;">
            Open ↗
          </button>
        </div>

        <!-- 4. English Proficiency & Grammar Test -->
        <div
          class="activity-link-card"
          onclick={() => navigationState.setTab('englishtest')}
          onkeydown={(e) => { if (e.key === 'Enter') navigationState.setTab('englishtest'); }}
          tabindex="0"
          role="button"
          style="background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); border: 2px solid var(--ink); border-radius: 16px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px; cursor: pointer; box-shadow: 0 3px 0 var(--ink); transition: all 0.16s ease;"
        >
          <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
            <div class="hub-card-icon" style="width: 40px; height: 40px; font-size: 20px; background: #ffffff; border: 2px solid #7c3aed; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 0 rgba(124, 58, 237, 0.35); flex-shrink: 0;">
              📝
            </div>
            <div style="min-width: 0;">
              <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <span style="font-size: 14px; font-weight: 800; color: #6d28d9;">English Proficiency &amp; Grammar Test</span>
                <span class="hub-card-badge" style="background: #ddd6fe; color: #6d28d9; border: 1.5px solid #7c3aed; border-radius: 6px; padding: 2px 7px; font-size: 10px; font-weight: 800;">EXAM</span>
              </div>
              <div style="font-size: 11.5px; color: #6d28d9; opacity: 0.85; margin-top: 2px;">
                15-question CEFR test with instant score, explanations &amp; AI evaluation
              </div>
            </div>
          </div>
          <button type="button" class="page-back-btn" style="padding: 6px 13px; font-size: 11.5px; background: #7c3aed; color: #ffffff; border: 1.5px solid var(--ink); border-radius: 9px; box-shadow: 0 2px 0 var(--ink); flex-shrink: 0; font-weight: 800; cursor: pointer;">
            Test ↗
          </button>
        </div>

        <!-- 5. Practical Daily Life Maths Test -->
        <div
          class="activity-link-card"
          onclick={() => navigationState.setTab('mathtest')}
          onkeydown={(e) => { if (e.key === 'Enter') navigationState.setTab('mathtest'); }}
          tabindex="0"
          role="button"
          style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid var(--ink); border-radius: 16px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px; cursor: pointer; box-shadow: 0 3px 0 var(--ink); transition: all 0.16s ease;"
        >
          <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
            <div class="hub-card-icon" style="width: 40px; height: 40px; font-size: 20px; background: #ffffff; border: 2px solid #16a34a; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 0 rgba(22, 163, 74, 0.35); flex-shrink: 0;">
              🧮
            </div>
            <div style="min-width: 0;">
              <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <span style="font-size: 14px; font-weight: 800; color: #15803d;">Practical Daily Life Maths Test</span>
                <span class="hub-card-badge" style="background: #bbf7d0; color: #15803d; border: 1.5px solid #16a34a; border-radius: 6px; padding: 2px 7px; font-size: 10px; font-weight: 800;">MATHS</span>
              </div>
              <div style="font-size: 11.5px; color: #15803d; opacity: 0.85; margin-top: 2px;">
                Grams to kg pricing, grocery counter change &amp; discount calculation shortcuts
              </div>
            </div>
          </div>
          <button type="button" class="page-back-btn" style="padding: 6px 13px; font-size: 11.5px; background: #059669; color: #ffffff; border: 1.5px solid var(--ink); border-radius: 9px; box-shadow: 0 2px 0 var(--ink); flex-shrink: 0; font-weight: 800; cursor: pointer;">
            Maths ↗
          </button>
        </div>
      </div>
    </div>
  {:else}
    <!-- Overall Progress Bar (shown for routines) -->
    <div style="background:#ffffff;border:2px solid var(--ink);border-radius:14px;padding:clamp(10px, 1.5vw, 14px) clamp(12px, 2vw, 18px);margin-bottom:14px;box-shadow:0 3px 0 var(--ink);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;flex-wrap:wrap;gap:6px;">
        <span style="font-size:12px;font-weight:800;color:var(--ink);">TODAY'S PROGRESS</span>
        <span style="font-size:12px;font-weight:800;color:var(--teal);">{trackerState.completedCount} / {trackerState.tasks.length} ({trackerState.completionPercentage}%)</span>
      </div>
      <div style="width:100%;height:10px;background:#f1f5f9;border-radius:999px;border:1px solid #cbd5e1;overflow:hidden;">
        <div style="width:{trackerState.completionPercentage}%;height:100%;background:linear-gradient(90deg, #10b981, #06b6d4);transition:width 0.3s ease;"></div>
      </div>
    </div>

    <!-- TIME PERIOD TIMELINE (MORNING, AFTERNOON, EVENING, NIGHT) -->
    {@const periodTasks = trackerState.tasks.filter((t) => (t.period || 'morning') === activePeriod)}
    <div class="schedule-section active">
      <div class="section-title {activePeriod}-title" style="margin-bottom:14px;text-transform:uppercase;">
        <span>{activePeriod === 'morning' ? '🌅' : activePeriod === 'afternoon' ? '☀️' : activePeriod === 'evening' ? '🌇' : '🌙'}</span> {activePeriod} ROUTINE
      </div>

      <!-- Water & Walk Quick Counter for this period -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(min(100%, 150px), 1fr));gap:clamp(10px, 1.5vw, 14px);margin-bottom:14px;">
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
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(min(100%, 320px), 1fr));gap:clamp(8px, 1.2vw, 12px);">
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
