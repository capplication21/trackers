<script>
  import { onMount } from 'svelte';
  import { navigationState } from '$lib/stores/navigationState.svelte.js';
  import TopNavBar from '$lib/components/common/TopNavBar.svelte';

  // Modules
  import ReadingSection from '$lib/components/reading/ReadingSection.svelte';
  import ScheduleSection from '$lib/components/tracker/ScheduleSection.svelte';
  import WaterWalkModule from '$lib/components/tracker/WaterWalkModule.svelte';
  import WeekSection from '$lib/components/tracker/WeekSection.svelte';
  import HistorySection from '$lib/components/tracker/HistorySection.svelte';
  import PeriodSection from '$lib/components/tracker/PeriodSection.svelte';
  import RecipeBookSection from '$lib/components/routines/RecipeBookSection.svelte';
  import AdkarDuaSection from '$lib/components/routines/AdkarDuaSection.svelte';
  import B1EnglishRoutine from '$lib/components/routines/B1EnglishRoutine.svelte';
  import EnglishTestSection from '$lib/components/routines/EnglishTestSection.svelte';
  import DailyMathsSuite from '$lib/components/routines/DailyMathsSuite.svelte';
  import DuaaNotesSection from '$lib/components/routines/DuaaNotesSection.svelte';
  import TemplatesSection from '$lib/components/routines/TemplatesSection.svelte';
  import PdfFlipbookViewer from '$lib/components/pdf/PdfFlipbookViewer.svelte';
  import QuranSection from '$lib/components/quran/QuranSection.svelte';

  // Moveable / Draggable Navigators Floating Pill
  /** @type {HTMLButtonElement | null} */
  let buttonEl = $state(null);
  let pos = $state({ x: /** @type {number | null} */ (null), y: /** @type {number | null} */ (null) });
  
  const HOLD_DURATION = 1500; // 1.5s hold required before dragging is enabled
  /** @type {any} */
  let holdTimer = null;
  let isHolding = $state(false);
  let isDragReady = $state(false);
  let isDragging = $state(false);
  let hasMoved = $state(false);
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;

  function clearHoldTimer() {
    if (holdTimer) {
      clearTimeout(holdTimer);
      holdTimer = null;
    }
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  function clampPos(x, y) {
    if (!buttonEl || typeof window === 'undefined') return { x, y };
    const rect = buttonEl.getBoundingClientRect();
    const pad = 8;
    const maxX = Math.max(pad, window.innerWidth - rect.width - pad);
    const maxY = Math.max(pad, window.innerHeight - rect.height - pad);
    return {
      x: Math.min(Math.max(pad, x), maxX),
      y: Math.min(Math.max(pad, y), maxY)
    };
  }

  onMount(() => {
    try {
      const saved = localStorage.getItem('tracker_nav_pill_pos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          requestAnimationFrame(() => {
            pos = clampPos(parsed.x, parsed.y);
          });
        }
      }
    } catch {
      // Ignore local storage errors
    }

    const handleResize = () => {
      if (pos.x !== null && pos.y !== null) {
        pos = clampPos(pos.x, pos.y);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearHoldTimer();
    };
  });

  /** @param {PointerEvent} e */
  function handlePointerDown(e) {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (!buttonEl || isHolding) return;

    try {
      buttonEl.setPointerCapture(e.pointerId);
    } catch {}

    const rect = buttonEl.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    startLeft = rect.left;
    startTop = rect.top;

    isHolding = true;
    isDragReady = false;
    isDragging = false;
    hasMoved = false;

    clearHoldTimer();
    holdTimer = setTimeout(() => {
      // 1.5 seconds hold reached -> unlock dragging!
      isDragReady = true;
      isDragging = true;
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate(35);
        } catch {}
      }
    }, HOLD_DURATION);
  }

  /** @param {PointerEvent} e */
  function handlePointerMove(e) {
    // Do NOT drag unless user held for 1.5 seconds!
    if (!isDragReady || !isDragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (!hasMoved && Math.hypot(dx, dy) > 3) {
      hasMoved = true;
    }

    if (hasMoved) {
      pos = clampPos(startLeft + dx, startTop + dy);
    }
  }

  /** @param {PointerEvent} e */
  function handlePointerUp(e) {
    clearHoldTimer();

    try {
      if (buttonEl?.hasPointerCapture(e.pointerId)) {
        buttonEl.releasePointerCapture(e.pointerId);
      }
    } catch {}

    const wasDragReady = isDragReady;
    const moved = hasMoved;

    isHolding = false;
    isDragReady = false;
    isDragging = false;
    hasMoved = false;

    if (wasDragReady && moved) {
      // User held for 1.5s and actually dragged -> save position
      try {
        localStorage.setItem('tracker_nav_pill_pos', JSON.stringify({ x: pos.x, y: pos.y }));
      } catch {}
    } else {
      // Released before 1.5s (or held without moving) -> behaves as click!
      navigationState.toggleMenu();
    }
  }

  /** @param {PointerEvent} e */
  function handlePointerCancel(e) {
    clearHoldTimer();
    try {
      if (buttonEl?.hasPointerCapture(e.pointerId)) {
        buttonEl.releasePointerCapture(e.pointerId);
      }
    } catch {}
    isHolding = false;
    isDragReady = false;
    isDragging = false;
    hasMoved = false;
  }
</script>

<div class="app-container">
  <TopNavBar />

  <div id="content-area">
    {#if navigationState.activeTab === 'schedule'}
      <ScheduleSection />
    {:else if navigationState.activeTab === 'reading'}
      <ReadingSection />
    {:else if navigationState.activeTab === 'water'}
      <WaterWalkModule />
    {:else if navigationState.activeTab === 'week'}
      <WeekSection />
    {:else if navigationState.activeTab === 'history'}
      <HistorySection />
    {:else if navigationState.activeTab === 'period'}
      <PeriodSection />
    {:else if navigationState.activeTab === 'recipe'}
      <RecipeBookSection />
    {:else if navigationState.activeTab === 'adkar'}
      <AdkarDuaSection />
    {:else if navigationState.activeTab === 'english'}
      <B1EnglishRoutine />
    {:else if navigationState.activeTab === 'englishtest'}
      <EnglishTestSection />
    {:else if navigationState.activeTab === 'mathtest'}
      <DailyMathsSuite />
    {:else if navigationState.activeTab === 'notes'}
      <DuaaNotesSection />
    {:else if navigationState.activeTab === 'quran'}
      <QuranSection />
    {:else if navigationState.activeTab === 'templates'}
      <TemplatesSection />
    {:else if navigationState.activeTab === 'pdf'}
      <PdfFlipbookViewer />
    {:else}
      <ScheduleSection />
    {/if}
  </div>

  {#if !navigationState.isMenuOpen}
    <button
      bind:this={buttonEl}
      type="button"
      class="floating-nav-pill"
      class:is-holding={isHolding && !isDragReady}
      class:is-drag-ready={isDragReady}
      class:is-dragging={isDragging && hasMoved}
      style={pos.x !== null && pos.y !== null
        ? `left: ${pos.x}px; top: ${pos.y}px; right: auto; bottom: auto; cursor: ${isDragging && hasMoved ? 'grabbing' : isDragReady ? 'grab' : 'pointer'};`
        : `cursor: ${isDragging && hasMoved ? 'grabbing' : isDragReady ? 'grab' : 'pointer'};`}
      onpointerdown={handlePointerDown}
      onpointermove={handlePointerMove}
      onpointerup={handlePointerUp}
      onpointercancel={handlePointerCancel}
      onkeydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigationState.toggleMenu();
        }
      }}
      title="Tap to open Navigators (or hold 1.5s to drag)"
    >
      <span class="floating-icon">🧭</span> Navigators
    </button>
  {/if}
</div>

<style>
  .floating-nav-pill {
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
  }
  .floating-nav-pill.is-holding {
    transform: scale(0.96);
    filter: brightness(0.96);
  }
  .floating-nav-pill.is-drag-ready {
    transform: scale(1.08) !important;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.65), 0 10px 24px rgba(79, 70, 229, 0.45), 0 4px 0 var(--ink) !important;
  }
  .floating-nav-pill.is-dragging {
    transition: none !important;
    animation: none !important;
    transform: scale(1.1) !important;
    box-shadow: 0 14px 28px rgba(79, 70, 229, 0.65), 0 5px 0 var(--ink) !important;
    z-index: 1000000 !important;
  }
</style>
