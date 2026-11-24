<script>
  import { onMount } from 'svelte';
  import { trackerState } from '$lib/stores/trackerState.svelte.js';
  import { navigationState } from '$lib/stores/navigationState.svelte.js';
  import { quranState } from '$lib/stores/quranState.svelte.js';
  import { storageBridge } from '$lib/stores/storageBridge.js';
  import { SURAH_LIST } from '$lib/data/quranData.js';
  import { detectSurahFromText, getSurahMeta } from '$lib/utils/surahMatcher.js';
  import EveningQuranModal from './EveningQuranModal.svelte';

  let activePeriod = $state('activities'); // 'activities' | 'morning' | 'afternoon' | 'evening' | 'night'

  // Exercise Timer State (Morning)
  let exerciseMinutes = $state(30);
  let exerciseRemaining = $state(30 * 60);
  let isExerciseRunning = $state(false);
  let timerInterval = null;

  // Medicine Modal State
  let showMedModal = $state(false);
  let medModalId = $state('');
  let medModalName = $state('');
  let medModalPeriod = $state('morning');
  let medModalIsDefault = $state(false);

  // Quran Playlist State (Evening - Synchronized via quranState)
  let showSurahModal = $state(false);
  let surahFormNumber = $state(2);
  let surahFormTitle = $state('');
  let surahFormStart = $state(1);
  let surahFormEnd = $state(286);
  let surahFormUrl = $state('');
  let editingSurahId = $state(null);

  // Evening Quran Reader & Recitation Modal (Matches Screenshot)
  let isEveningQuranOpen = $state(false);
  let eveningQuranSurah = $state(2);
  let eveningQuranStart = $state(1);
  let eveningQuranEnd = $state(286);
  let eveningQuranUrl = $state('');

  function openEveningQuran(surahObj) {
    if (surahObj) {
      eveningQuranSurah = surahObj.surahNumber || 2;
      eveningQuranStart = surahObj.ayahStart || 1;
      eveningQuranEnd = surahObj.ayahEnd || 286;
      eveningQuranUrl = surahObj.url || '';
    } else {
      eveningQuranSurah = 2;
      eveningQuranStart = 1;
      eveningQuranEnd = 286;
      eveningQuranUrl = '';
    }
    isEveningQuranOpen = true;
  }

  onMount(async () => {
    await trackerState.init();
    await quranState.initSurahs();

    // Load timer minutes preference
    const savedMin = await storageBridge.getItem('tm_exercise_minutes');
    if (typeof savedMin === 'number' && savedMin >= 1 && savedMin <= 60) {
      exerciseMinutes = savedMin;
      exerciseRemaining = savedMin * 60;
    }
  });

  // Timer helpers
  function formatTimer(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function toggleExerciseTimer() {
    if (isExerciseRunning) {
      clearInterval(timerInterval);
      isExerciseRunning = false;
    } else {
      if (exerciseRemaining === 0) exerciseRemaining = exerciseMinutes * 60;
      isExerciseRunning = true;
      timerInterval = setInterval(() => {
        if (exerciseRemaining > 0) {
          exerciseRemaining--;
        } else {
          clearInterval(timerInterval);
          isExerciseRunning = false;
        }
      }, 1000);
    }
  }

  function resetExerciseTimer() {
    clearInterval(timerInterval);
    isExerciseRunning = false;
    exerciseRemaining = exerciseMinutes * 60;
  }

  async function adjustExerciseMinutes(delta) {
    if (isExerciseRunning) return;
    const next = Math.max(1, Math.min(60, exerciseMinutes + delta));
    exerciseMinutes = next;
    exerciseRemaining = next * 60;
    await storageBridge.setItem('tm_exercise_minutes', next);
  }

  // Water & Walk helpers
  function isWalkWaterDone(period) {
    return Boolean(trackerState.completedTasks[`trackerWalk-${period}`]);
  }

  function toggleWalkWater(period) {
    trackerState.toggleTask(`trackerWalk-${period}`);
  }

  function updateWalk(period, val) {
    const num = Math.max(0, parseInt(val, 10) || 0);
    trackerState.walk = { ...trackerState.walk, [period]: num };
    trackerState.saveToday();
  }

  function updateWater(period, val) {
    const num = Math.max(0, parseInt(val, 10) || 0);
    trackerState.water = { ...trackerState.water, [period]: num };
    trackerState.saveToday();
  }

  // Medicine helpers
  function periodMedicines(period) {
    return trackerState.medicines.filter((m) => m.period === period && m.enabled !== false);
  }

  function openMedModal(id = '', defaultPeriod = 'morning') {
    medModalId = id;
    medModalPeriod = defaultPeriod;
    if (id) {
      const med = trackerState.medicines.find((m) => m.id === id);
      if (med) {
        medModalName = med.name || med.defaultName;
        medModalPeriod = med.period;
        medModalIsDefault = Boolean(med.isDefault);
      }
    } else {
      medModalName = '';
      medModalIsDefault = false;
    }
    showMedModal = true;
  }

  async function saveMedicine() {
    if (!medModalName.trim()) return;
    if (medModalId) {
      // Edit existing
      trackerState.medicines = trackerState.medicines.map((m) => {
        if (m.id === medModalId) {
          return { ...m, name: medModalName.trim(), period: medModalPeriod };
        }
        return m;
      });
    } else {
      // Add custom medicine
      const newMed = {
        id: 'med_' + Date.now(),
        name: medModalName.trim(),
        period: medModalPeriod,
        enabled: true,
        isDefault: false,
        icon: '💊'
      };
      trackerState.medicines = [...trackerState.medicines, newMed];
    }
    await storageBridge.setItem('medicines_config', trackerState.medicines);
    showMedModal = false;
  }

  async function resetMedToDefault() {
    if (!medModalId) return;
    trackerState.medicines = trackerState.medicines.map((m) => {
      if (m.id === medModalId && m.defaultName) {
        return { ...m, name: m.defaultName };
      }
      return m;
    });
    await storageBridge.setItem('medicines_config', trackerState.medicines);
    showMedModal = false;
  }

  async function removeMedicine() {
    if (!medModalId) return;
    trackerState.medicines = trackerState.medicines.filter((m) => m.id !== medModalId);
    await storageBridge.setItem('medicines_config', trackerState.medicines);
    showMedModal = false;
  }

  // Surah helpers
  function openAddSurahModal() {
    editingSurahId = null;
    surahFormNumber = 2;
    const meta = getSurahMeta(2);
    surahFormTitle = `📖 Surah 2: Al-Baqarah (Ayat 1 – 286)`;
    surahFormStart = 1;
    surahFormEnd = meta.ayahCount || 286;
    surahFormUrl = '';
    showSurahModal = true;
  }

  function editSurah(s) {
    editingSurahId = s.id;
    const detected = detectSurahFromText(s.title);
    surahFormNumber = s.surahNumber || detected || 2;
    surahFormTitle = s.title || '';
    const meta = getSurahMeta(surahFormNumber);
    surahFormStart = s.ayahStart || 1;
    surahFormEnd = s.ayahEnd || meta.ayahCount || 286;
    surahFormUrl = s.url || '';
    showSurahModal = true;
  }

  function handleSurahDropdownChange(e) {
    const num = parseInt(e.target.value, 10);
    if (!num) return;
    surahFormNumber = num;
    const meta = getSurahMeta(num);
    // If title was blank or had standard surah title format, update title to match
    if (!surahFormTitle || /^📖\s*Surah\s*\d+/i.test(surahFormTitle) || /^surah\s+[a-z]+/i.test(surahFormTitle.trim())) {
      surahFormTitle = `📖 Surah ${meta.number}: ${meta.englishName} (${meta.name})`;
    }
    surahFormStart = 1;
    surahFormEnd = meta.ayahCount;
  }

  function handleTitleInput(e) {
    const val = e.target.value;
    surahFormTitle = val;
    const detected = detectSurahFromText(val);
    if (detected && detected !== surahFormNumber) {
      surahFormNumber = detected;
      const meta = getSurahMeta(detected);
      if (surahFormEnd > meta.ayahCount) {
        surahFormEnd = meta.ayahCount;
      }
    }
  }

  async function saveSurah() {
    const titleTrimmed = surahFormTitle.trim();
    if (!titleTrimmed && !surahFormNumber) return;

    const detected = detectSurahFromText(titleTrimmed);
    const finalSurahNum = surahFormNumber || detected || 2;
    const meta = getSurahMeta(finalSurahNum);
    const finalTitle = titleTrimmed || `📖 Surah ${meta.number}: ${meta.englishName} (${meta.name})`;
    const start = Math.max(1, parseInt(surahFormStart, 10) || 1);
    const end = Math.min(meta.ayahCount, Math.max(start, parseInt(surahFormEnd, 10) || meta.ayahCount));

    if (editingSurahId) {
      await quranState.updateSurah(editingSurahId, {
        title: finalTitle,
        surahNumber: finalSurahNum,
        ayahStart: start,
        ayahEnd: end,
        url: surahFormUrl.trim()
      });
    } else {
      const newSurah = {
        id: 'surah_' + Date.now(),
        title: finalTitle,
        surahNumber: finalSurahNum,
        ayahStart: start,
        ayahEnd: end,
        url: surahFormUrl.trim()
      };
      await quranState.addSurah(newSurah);
    }
    showSurahModal = false;
  }

  async function deleteSurah(id) {
    await quranState.deleteSurah(id);
  }
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
          <button
            type="button"
            class="page-back-btn"
            onclick={(e) => {
              e.stopPropagation();
              if (typeof window !== 'undefined') {
                window.open('https://www.youtube.com/playlist?list=PL62RQxDpIL7VhZuvQkggarKVAe9YvaePR&si=qcgHjtXVrXq_QCxK', '_blank');
              }
            }}
            style="padding: 6px 13px; font-size: 11.5px; background: #0d9488; color: #ffffff; border: 1.5px solid var(--ink); border-radius: 9px; box-shadow: 0 2px 0 var(--ink); flex-shrink: 0; font-weight: 800; cursor: pointer;"
          >
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
    <!-- TIME PERIOD ROUTINES: MORNING, AFTERNOON, EVENING, NIGHT -->
    <div id="{activePeriod}-section" class="schedule-section active">
      <!-- Section Header -->
      <div
        class="section-title {activePeriod}-title"
        style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; width: 100%; box-sizing: border-box;"
      >
        <span>
          <span>{activePeriod === 'morning' ? '🌅' : activePeriod === 'afternoon' ? '☀️' : activePeriod === 'evening' ? '🌇' : '🌙'}</span>
          {activePeriod.toUpperCase()} ROUTINES
        </span>
        <button
          type="button"
          class="section-med-btn"
          onclick={() => openMedModal('', activePeriod)}
          style="font-size: 11px; padding: 3px 8px; border-radius: 6px; border: 1.5px solid var(--ink); background: #ffffff; color: var(--ink); font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 1px 0 var(--ink);"
          title="Add a custom medicine to {activePeriod} routine"
        >
          <span>💊</span> <span>+ Medicine</span>
        </button>
      </div>

      <!-- CARD 1: Walk & Water (Present in all periods) -->
      <div
        class="task-card"
        id="task-trackerWalk-{activePeriod}-s"
        class:completed={isWalkWaterDone(activePeriod)}
        onclick={() => toggleWalkWater(activePeriod)}
        role="button"
        tabindex="0"
        onkeydown={(e) => { if (e.key === 'Enter') toggleWalkWater(activePeriod); }}
      >
        <div class="checkbox">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div style="flex: 1; min-width: 0;">
          <div class="task-text">Walk &amp; Water <span>🚶💧</span></div>
          <div class="tracker-row" onclick={(e) => e.stopPropagation()} role="presentation">
            <div class="tracker-group steps-group">
              <span class="tracker-group-icon">🚶</span>
              <input
                type="number"
                class="tracker-input"
                id="trackerWalkInput-{activePeriod}"
                min="0"
                inputmode="numeric"
                placeholder="0"
                value={trackerState.walk[activePeriod] || 0}
                oninput={(e) => updateWalk(activePeriod, e.currentTarget.value)}
              />
              <span class="tracker-group-label">steps</span>
            </div>
            <div class="tracker-group water-group">
              <span class="tracker-group-icon">💧</span>
              <input
                type="number"
                class="tracker-input"
                id="trackerWaterInput-{activePeriod}"
                min="0"
                inputmode="numeric"
                placeholder="0"
                value={trackerState.water[activePeriod] || 0}
                oninput={(e) => updateWater(activePeriod, e.currentTarget.value)}
              />
              <span class="tracker-group-label">glasses</span>
            </div>
          </div>
          <div class="water-litre-preview">
            {trackerState.water[activePeriod] || 0} glasses = {((trackerState.water[activePeriod] || 0) * 0.25).toFixed(2)} L
          </div>
        </div>
      </div>

      <!-- MORNING SPECIFIC TASKS -->
      {#if activePeriod === 'morning'}
        <!-- Folic Acid & Morning Medicines -->
        {#each periodMedicines('morning') as med (med.id)}
          {@const isDone = Boolean(trackerState.completedTasks[med.id])}
          <div
            class="task-card"
            class:completed={isDone}
            onclick={() => trackerState.toggleTask(med.id)}
            role="button"
            tabindex="0"
            onkeydown={(e) => { if (e.key === 'Enter') trackerState.toggleTask(med.id); }}
          >
            <div class="checkbox">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div style="flex: 1; min-width: 0;">
              <div class="task-text">
                <span>{med.name || med.defaultName}</span> <span>{med.icon || '💊'}</span>
              </div>
              <div class="task-sub" class:sub-taken={isDone} class:sub-not-taken={!isDone}>
                {isDone ? '✓ Taken' : '❓ Not taken'}
              </div>
            </div>
            <button
              type="button"
              class="task-med-edit-btn"
              onclick={(e) => { e.stopPropagation(); openMedModal(med.id, 'morning'); }}
              title="Change name, keep default, or remove medicine"
              style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 3px 8px; font-size: 11px; cursor: pointer; color: #475569; font-weight: 700; display: inline-flex; align-items: center; gap: 3px; flex-shrink: 0;"
            >
              <span>✏️</span> <span>Edit</span>
            </button>
          </div>
        {/each}

        <!-- Exercise Card with Video & Countdown Timer -->
        {@const isExerciseDone = Boolean(trackerState.completedTasks['m4'])}
        <div
          class="task-card"
          id="task-m4-s"
          class:completed={isExerciseDone}
          onclick={() => trackerState.toggleTask('m4')}
          role="button"
          tabindex="0"
          onkeydown={(e) => { if (e.key === 'Enter') trackerState.toggleTask('m4'); }}
        >
          <div class="checkbox">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div style="flex: 1; min-width: 0;">
            <div class="task-text">Exercise <span>🏋️</span></div>
            <a
              class="yt-link"
              href="https://youtu.be/IT94xC35u6k?si=CXCFkwumv4jICfbE"
              target="_blank"
              rel="noopener noreferrer"
              onclick={(e) => e.stopPropagation()}
            >
              <span>▶️</span> Watch Exercise Video
            </a>
            <div class="timer-wrap" onclick={(e) => e.stopPropagation()} role="presentation">
              <div class="timer-display" id="timer-display-exercise" class:done={exerciseRemaining === 0}>
                {formatTimer(exerciseRemaining)}
              </div>
              <div class="timer-info">
                <div class="adhkar-label" style="margin-bottom: 2px">
                  ⏱️ Exercise Timer
                </div>
                <div class="timer-controls">
                  <button type="button" class="timer-btn" onclick={toggleExerciseTimer}>
                    {isExerciseRunning ? 'Pause' : 'Start'}
                  </button>
                  <button
                    type="button"
                    class="timer-reset-btn"
                    onclick={resetExerciseTimer}
                    title="Reset"
                  >
                    ↺
                  </button>
                  <div class="timer-adjust">
                    <button
                      type="button"
                      class="timer-adjust-btn"
                      onclick={() => adjustExerciseMinutes(-1)}
                      disabled={isExerciseRunning || exerciseMinutes <= 1}
                    >
                      −
                    </button>
                    <span class="timer-minutes">{exerciseMinutes}m</span>
                    <button
                      type="button"
                      class="timer-adjust-btn"
                      onclick={() => adjustExerciseMinutes(1)}
                      disabled={isExerciseRunning || exerciseMinutes >= 60}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      <!-- AFTERNOON SPECIFIC TASKS -->
      {:else if activePeriod === 'afternoon'}
        <!-- Vitamin B Complex & Afternoon Medicines -->
        {#each periodMedicines('afternoon') as med (med.id)}
          {@const isDone = Boolean(trackerState.completedTasks[med.id])}
          <div
            class="task-card"
            class:completed={isDone}
            onclick={() => trackerState.toggleTask(med.id)}
            role="button"
            tabindex="0"
            onkeydown={(e) => { if (e.key === 'Enter') trackerState.toggleTask(med.id); }}
          >
            <div class="checkbox">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div style="flex: 1; min-width: 0;">
              <div class="task-text">
                <span>{med.name || med.defaultName}</span> <span>{med.icon || '💊'}</span>
              </div>
              <div class="task-sub" class:sub-taken={isDone} class:sub-not-taken={!isDone}>
                {isDone ? '✓ Taken' : '❓ Not taken'}
              </div>
            </div>
            <button
              type="button"
              class="task-med-edit-btn"
              onclick={(e) => { e.stopPropagation(); openMedModal(med.id, 'afternoon'); }}
              title="Change name, keep default, or remove medicine"
              style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 3px 8px; font-size: 11px; cursor: pointer; color: #475569; font-weight: 700; display: inline-flex; align-items: center; gap: 3px; flex-shrink: 0;"
            >
              <span>✏️</span> <span>Edit</span>
            </button>
          </div>
        {/each}

        <!-- Do activity on Kimi -->
        {@const isKimiDone = Boolean(trackerState.completedTasks['a3'])}
        <div
          class="task-card"
          id="task-a3-s"
          class:completed={isKimiDone}
          onclick={() => trackerState.toggleTask('a3')}
          role="button"
          tabindex="0"
          onkeydown={(e) => { if (e.key === 'Enter') trackerState.toggleTask('a3'); }}
        >
          <div class="checkbox">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div class="task-text">Do activity on Kimi <span>🤖</span></div>
        </div>

      <!-- EVENING SPECIFIC TASKS -->
      {:else if activePeriod === 'evening'}
        <!-- Custom Evening Medicines (if any) -->
        {#each periodMedicines('evening') as med (med.id)}
          {@const isDone = Boolean(trackerState.completedTasks[med.id])}
          <div
            class="task-card"
            class:completed={isDone}
            onclick={() => trackerState.toggleTask(med.id)}
            role="button"
            tabindex="0"
            onkeydown={(e) => { if (e.key === 'Enter') trackerState.toggleTask(med.id); }}
          >
            <div class="checkbox">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div style="flex: 1; min-width: 0;">
              <div class="task-text">
                <span>{med.name || med.defaultName}</span> <span>{med.icon || '💊'}</span>
              </div>
              <div class="task-sub" class:sub-taken={isDone} class:sub-not-taken={!isDone}>
                {isDone ? '✓ Taken' : '❓ Not taken'}
              </div>
            </div>
            <button
              type="button"
              class="task-med-edit-btn"
              onclick={(e) => { e.stopPropagation(); openMedModal(med.id, 'evening'); }}
              title="Change name, keep default, or remove medicine"
              style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 3px 8px; font-size: 11px; cursor: pointer; color: #475569; font-weight: 700; display: inline-flex; align-items: center; gap: 3px; flex-shrink: 0;"
            >
              <span>✏️</span> <span>Edit</span>
            </button>
          </div>
        {/each}

        <!-- Read and Listen Quran -->
        {@const isQuranDone = Boolean(trackerState.completedTasks['e3'])}
        <div
          class="task-card"
          id="task-e3-s"
          class:completed={isQuranDone}
          onclick={() => trackerState.toggleTask('e3')}
          role="button"
          tabindex="0"
          onkeydown={(e) => { if (e.key === 'Enter') trackerState.toggleTask('e3'); }}
        >
          <div class="checkbox">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px;">
              <div class="task-text" style="margin-bottom: 0;">
                Read and Listen Quran <span>📖</span>
              </div>
              <button
                type="button"
                class="grammar-add-topic-btn"
                onclick={(e) => { e.stopPropagation(); openAddSurahModal(); }}
                title="Set Surah, Ayat range & YouTube recitation link"
                style="font-size: 11.5px; padding: 4px 14px; background: #f59e0b; color: #000000; font-weight: 800; border: 2px solid var(--ink); border-radius: 999px; cursor: pointer; box-shadow: 0 2px 0 var(--ink); display: inline-flex; align-items: center; gap: 4px;"
              >
                <span style="color: #6366f1; font-weight: 900; font-size: 13px;">+</span> Set Surah &amp; Ayahs
              </button>
            </div>

            <!-- Surah Cards List -->
            <div style="margin-top: 8px;" onclick={(e) => e.stopPropagation()} role="presentation">
              {#each quranState.surahs as s (s.id)}
                <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 10px 14px; margin-top: 6px;">
                  <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;">
                    <div style="flex: 1; min-width: 0;">
                      <div style="font-size: 13px; font-weight: 800; color: #0f172a; line-height: 1.3;">
                        {s.title}
                      </div>
                      <div style="font-size: 11px; color: #0284c7; font-weight: 700; margin-top: 2px;">
                        Ayat {s.ayahStart || 1} – {s.ayahEnd || 286} · Online Arabic &amp; Urdu Meaning
                      </div>

                      <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-top: 6px;">
                        <button
                          type="button"
                          class="quran-read-btn"
                          onclick={() => openEveningQuran(s)}
                          title="Open Surah with Arabic text, Urdu meaning &amp; recitation"
                          style="background: #ffffff; border: 1.5px solid #059669; color: #047857; border-radius: 8px; padding: 3px 10px; font-size: 11px; font-weight: 800; display: inline-flex; align-items: center; gap: 5px; cursor: pointer;"
                        >
                          <span>📖</span> Read &amp; Listen with Urdu Meaning
                        </button>
                        {#if s.url}
                          <a
                            class="yt-link"
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onclick={(e) => e.stopPropagation()}
                            style="background: #eff6ff; border: 1.5px solid #bfdbfe; color: #2563eb; border-radius: 8px; padding: 3px 10px; font-size: 11px; font-weight: 800; display: inline-flex; align-items: center; gap: 5px; text-decoration: none; margin-top: 0;"
                          >
                            <span style="color: #2563eb; font-size: 10px;">▶</span> External Link
                          </a>
                        {/if}
                      </div>
                    </div>

                    <!-- Right action icons -->
                    <div style="display: flex; align-items: center; gap: 5px; flex-shrink: 0;">
                      <button
                        type="button"
                        class="grammar-item-action-btn"
                        onclick={() => openEveningQuran(s)}
                        title="Read &amp; Listen"
                        style="width: 26px; height: 26px; font-size: 11px; background: #ffffff; border: 1.5px solid #10b981; border-radius: 8px; color: #047857; cursor: pointer; display: flex; align-items: center; justify-content: center;"
                      >
                        📖
                      </button>
                      <button
                        type="button"
                        class="grammar-item-action-btn"
                        onclick={() => editSurah(s)}
                        title="Edit Playlist"
                        style="width: 26px; height: 26px; font-size: 11px; border: 1.5px solid #cbd5e1; border-radius: 8px; background: #ffffff; cursor: pointer; display: flex; align-items: center; justify-content: center;"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        class="grammar-item-action-btn delete-btn"
                        onclick={() => deleteSurah(s.id)}
                        title="Delete Playlist"
                        style="width: 26px; height: 26px; font-size: 11px; border: 1.5px solid #cbd5e1; border-radius: 8px; background: #ffffff; cursor: pointer; display: flex; align-items: center; justify-content: center;"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>

        <!-- Lumosity -->
        {@const isLumosityDone = Boolean(trackerState.completedTasks['e4'])}
        <div
          class="task-card"
          id="task-e4-s"
          class:completed={isLumosityDone}
          onclick={() => trackerState.toggleTask('e4')}
          role="button"
          tabindex="0"
          onkeydown={(e) => { if (e.key === 'Enter') trackerState.toggleTask('e4'); }}
        >
          <div class="checkbox">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div style="flex: 1; min-width: 0;">
            <div class="task-text">Lumosity <span>🧠</span></div>
            <a
              class="yt-link"
              href="https://www.lumosity.com"
              target="_blank"
              rel="noopener noreferrer"
              onclick={(e) => e.stopPropagation()}
            >
              <span>🧠</span> Open Lumosity
            </a>
          </div>
        </div>

      <!-- NIGHT SPECIFIC TASKS -->
      {:else if activePeriod === 'night'}
        <!-- Surah Mulk -->
        {@const isMulkDone = Boolean(trackerState.completedTasks['n5'])}
        <div
          class="task-card"
          id="task-n5-s"
          class:completed={isMulkDone}
          onclick={() => trackerState.toggleTask('n5')}
          role="button"
          tabindex="0"
          onkeydown={(e) => { if (e.key === 'Enter') trackerState.toggleTask('n5'); }}
        >
          <div class="checkbox">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div style="flex: 1; min-width: 0;">
            <div class="task-text">Surah Mulk <span>📖</span></div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 6px;">
              <button
                type="button"
                class="grammar-add-topic-btn"
                onclick={(e) => {
                  e.stopPropagation();
                  openEveningQuran({
                    surahNumber: 67,
                    ayahStart: 1,
                    ayahEnd: 30,
                    url: 'https://youtu.be/JZnXtmZk_3M?si=xXxwcQyjEP_KeoFF'
                  });
                }}
                style="font-size: 11px; padding: 4px 10px; background: #047857; color: #ffffff; font-weight: 800; border: 1.5px solid var(--ink); border-radius: 6px; cursor: pointer; box-shadow: 0 1px 0 var(--ink);"
              >
                <span>📖</span> Read &amp; Listen Surah Mulk ➔
              </button>
              <a
                class="yt-link"
                href="https://youtu.be/JZnXtmZk_3M?si=xXxwcQyjEP_KeoFF"
                target="_blank"
                rel="noopener noreferrer"
                onclick={(e) => e.stopPropagation()}
              >
                <span>▶️</span> Listen Surah Mulk
              </a>
            </div>
          </div>
        </div>

        <!-- Freedase 30 & Night Medicines -->
        {#each periodMedicines('night') as med (med.id)}
          {@const isDone = Boolean(trackerState.completedTasks[med.id])}
          <div
            class="task-card"
            class:completed={isDone}
            onclick={() => trackerState.toggleTask(med.id)}
            role="button"
            tabindex="0"
            onkeydown={(e) => { if (e.key === 'Enter') trackerState.toggleTask(med.id); }}
          >
            <div class="checkbox">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div style="flex: 1; min-width: 0;">
              <div class="task-text">
                <span>{med.name || med.defaultName}</span> <span>{med.icon || '💊'}</span>
              </div>
              <div class="task-sub" class:sub-taken={isDone} class:sub-not-taken={!isDone}>
                {isDone ? '✓ Taken' : '❓ Not taken'}
              </div>
            </div>
            <button
              type="button"
              class="task-med-edit-btn"
              onclick={(e) => { e.stopPropagation(); openMedModal(med.id, 'night'); }}
              title="Change name, keep default, or remove medicine"
              style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 3px 8px; font-size: 11px; cursor: pointer; color: #475569; font-weight: 700; display: inline-flex; align-items: center; gap: 3px; flex-shrink: 0;"
            >
              <span>✏️</span> <span>Edit</span>
            </button>
          </div>
        {/each}
      {/if}
    </div>
  {/if}
</div>

<!-- MEDICINE CONFIG MODAL -->
{#if showMedModal}
  <div
    class="nav-menu-overlay"
    onclick={() => (showMedModal = false)}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    onkeydown={(e) => { if (e.key === 'Escape') showMedModal = false; }}
  >
    <div
      class="nav-menu-dropdown"
      style="max-width: 420px; padding: 20px;"
      onclick={(e) => e.stopPropagation()}
      role="document"
    >
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <h3 style="margin: 0; font-size: 16px; font-weight: 800; color: var(--ink);">
          {medModalId ? '✏️ Edit Medicine' : '💊 Add Medicine'}
        </h3>
        <button
          type="button"
          class="dropdown-close-btn"
          onclick={() => (showMedModal = false)}
        >
          ✕
        </button>
      </div>

      <div style="margin-bottom: 12px;">
        <label for="medNameInput" style="display: block; font-size: 12px; font-weight: 700; color: var(--ink); margin-bottom: 4px;">
          Medicine Name:
        </label>
        <input
          id="medNameInput"
          type="text"
          class="input-field"
          style="width: 100%; box-sizing: border-box; padding: 8px 10px; border: 2px solid var(--ink); border-radius: 8px; font-size: 14px;"
          placeholder="e.g. Folic Acid medicine"
          bind:value={medModalName}
        />
      </div>

      <div style="margin-bottom: 16px;">
        <label for="medPeriodSelect" style="display: block; font-size: 12px; font-weight: 700; color: var(--ink); margin-bottom: 4px;">
          Routine Period:
        </label>
        <select
          id="medPeriodSelect"
          bind:value={medModalPeriod}
          style="width: 100%; box-sizing: border-box; padding: 8px 10px; border: 2px solid var(--ink); border-radius: 8px; font-size: 14px; background: white;"
        >
          <option value="morning">🌅 Morning</option>
          <option value="afternoon">☀️ Afternoon</option>
          <option value="evening">🌇 Evening</option>
          <option value="night">🌙 Night</option>
        </select>
      </div>

      <div style="display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap;">
        {#if medModalId}
          {#if medModalIsDefault}
            <button
              type="button"
              onclick={resetMedToDefault}
              style="padding: 7px 12px; font-size: 12px; background: #f1f5f9; border: 1.5px solid var(--ink); border-radius: 8px; font-weight: 700; cursor: pointer;"
            >
              Reset to Default
            </button>
          {:else}
            <button
              type="button"
              onclick={removeMedicine}
              style="padding: 7px 12px; font-size: 12px; background: #fee2e2; color: #b91c1c; border: 1.5px solid #ef4444; border-radius: 8px; font-weight: 700; cursor: pointer;"
            >
              Delete
            </button>
          {/if}
        {/if}
        <button
          type="button"
          onclick={saveMedicine}
          style="padding: 7px 16px; font-size: 12px; background: #10b981; color: white; border: 1.5px solid var(--ink); border-radius: 8px; font-weight: 800; cursor: pointer; box-shadow: 0 2px 0 var(--ink);"
        >
          Save
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- SET SURAH & AYAHS MODAL -->
{#if showSurahModal}
  <div
    class="nav-menu-overlay"
    onclick={() => (showSurahModal = false)}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    onkeydown={(e) => { if (e.key === 'Escape') showSurahModal = false; }}
  >
    <div
      class="nav-menu-dropdown"
      style="max-width: 440px; padding: 20px;"
      onclick={(e) => e.stopPropagation()}
      role="document"
    >
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
        <h3 style="margin: 0; font-size: 16px; font-weight: 800; color: var(--ink);">
          {editingSurahId ? '✏️ Edit Surah' : '➕ Set Surah & Ayahs'}
        </h3>
        <button
          type="button"
          class="dropdown-close-btn"
          onclick={() => (showSurahModal = false)}
        >
          ✕
        </button>
      </div>

      <!-- Surah Selector Dropdown -->
      <div style="margin-bottom: 10px;">
        <label for="surahSelectDropdown" style="display: block; font-size: 12px; font-weight: 700; color: var(--ink); margin-bottom: 4px;">
          Surah Name &amp; Number:
        </label>
        <select
          id="surahSelectDropdown"
          class="input-field"
          style="width: 100%; box-sizing: border-box; padding: 8px 10px; border: 2px solid var(--ink); border-radius: 8px; font-size: 13.5px; background: #ffffff;"
          value={surahFormNumber}
          onchange={handleSurahDropdownChange}
        >
          {#each SURAH_LIST as s (s.number)}
            <option value={s.number}>
              {s.number}. {s.englishName} ({s.name}) — {s.ayahCount} Ayahs
            </option>
          {/each}
        </select>
      </div>

      <div style="margin-bottom: 10px;">
        <label for="surahTitleInput" style="display: block; font-size: 12px; font-weight: 700; color: var(--ink); margin-bottom: 4px;">
          Title (e.g. 📖 Surah 18: Al-Kahf):
        </label>
        <input
          id="surahTitleInput"
          type="text"
          class="input-field"
          style="width: 100%; box-sizing: border-box; padding: 8px 10px; border: 2px solid var(--ink); border-radius: 8px; font-size: 13.5px;"
          placeholder="📖 Surah 18: Al-Kahf (Ayat 1 - 110)"
          value={surahFormTitle}
          oninput={handleTitleInput}
        />
      </div>

      <div style="display: flex; gap: 10px; margin-bottom: 10px;">
        <div style="flex: 1;">
          <label for="surahStartInput" style="display: block; font-size: 12px; font-weight: 700; color: var(--ink); margin-bottom: 4px;">
            Start Ayah:
          </label>
          <input
            id="surahStartInput"
            type="number"
            min="1"
            class="input-field"
            style="width: 100%; box-sizing: border-box; padding: 8px 10px; border: 2px solid var(--ink); border-radius: 8px; font-size: 13.5px;"
            bind:value={surahFormStart}
          />
        </div>
        <div style="flex: 1;">
          <label for="surahEndInput" style="display: block; font-size: 12px; font-weight: 700; color: var(--ink); margin-bottom: 4px;">
            End Ayah:
          </label>
          <input
            id="surahEndInput"
            type="number"
            min="1"
            class="input-field"
            style="width: 100%; box-sizing: border-box; padding: 8px 10px; border: 2px solid var(--ink); border-radius: 8px; font-size: 13.5px;"
            bind:value={surahFormEnd}
          />
        </div>
      </div>

      <div style="margin-bottom: 16px;">
        <label for="surahUrlInput" style="display: block; font-size: 12px; font-weight: 700; color: var(--ink); margin-bottom: 4px;">
          Recitation Link (YouTube / Audio URL):
        </label>
        <input
          id="surahUrlInput"
          type="url"
          class="input-field"
          style="width: 100%; box-sizing: border-box; padding: 8px 10px; border: 2px solid var(--ink); border-radius: 8px; font-size: 13.5px;"
          placeholder="https://youtu.be/..."
          bind:value={surahFormUrl}
        />
      </div>

      <div style="display: flex; gap: 8px; justify-content: flex-end;">
        <button
          type="button"
          onclick={() => (showSurahModal = false)}
          style="padding: 7px 12px; font-size: 12px; background: #f1f5f9; border: 1.5px solid var(--ink); border-radius: 8px; font-weight: 700; cursor: pointer;"
        >
          Cancel
        </button>
        <button
          type="button"
          onclick={saveSurah}
          style="padding: 7px 16px; font-size: 12px; background: #f59e0b; color: black; border: 1.5px solid var(--ink); border-radius: 8px; font-weight: 800; cursor: pointer; box-shadow: 0 2px 0 var(--ink);"
        >
          Save Surah
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- EVENING QURAN READER & RECITATION MODAL (MATCHES SCREENSHOT) -->
<EveningQuranModal
  isOpen={isEveningQuranOpen}
  surahNumber={eveningQuranSurah}
  initialStart={eveningQuranStart}
  initialEnd={eveningQuranEnd}
  initialVideoUrl={eveningQuranUrl}
  onClose={() => (isEveningQuranOpen = false)}
/>
