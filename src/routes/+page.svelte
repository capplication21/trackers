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
  let isDragging = $state(false);
  let hasMoved = $state(false);
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;

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
    };
  });

  /** @param {PointerEvent} e */
  function handlePointerDown(e) {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (!buttonEl) return;

    try {
      buttonEl.setPointerCapture(e.pointerId);
    } catch {}

    const rect = buttonEl.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    startLeft = rect.left;
    startTop = rect.top;
    hasMoved = false;
    isDragging = true;
  }

  /** @param {PointerEvent} e */
  function handlePointerMove(e) {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (!hasMoved && Math.hypot(dx, dy) > 4) {
      hasMoved = true;
    }

    if (hasMoved) {
      pos = clampPos(startLeft + dx, startTop + dy);
    }
  }

  /** @param {PointerEvent} e */
  function handlePointerUp(e) {
    if (!isDragging) return;

    try {
      if (buttonEl?.hasPointerCapture(e.pointerId)) {
        buttonEl.releasePointerCapture(e.pointerId);
      }
    } catch {}

    const moved = hasMoved;
    isDragging = false;
    hasMoved = false;

    if (moved) {
      try {
        localStorage.setItem('tracker_nav_pill_pos', JSON.stringify({ x: pos.x, y: pos.y }));
      } catch {}
    } else {
      navigationState.toggleMenu();
    }
  }

  /** @param {PointerEvent} e */
  function handlePointerCancel(e) {
    if (!isDragging) return;
    try {
      if (buttonEl?.hasPointerCapture(e.pointerId)) {
        buttonEl.releasePointerCapture(e.pointerId);
      }
    } catch {}
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
      class:is-dragging={isDragging && hasMoved}
      style={pos.x !== null && pos.y !== null
        ? `left: ${pos.x}px; top: ${pos.y}px; right: auto; bottom: auto; cursor: ${isDragging ? 'grabbing' : 'grab'};`
        : `cursor: ${isDragging ? 'grabbing' : 'grab'};`}
      onpointerdown={handlePointerDown}
      onpointermove={handlePointerMove}
      onpointerup={handlePointerUp}
      onpointercancel={handlePointerCancel}
      title="Drag to reposition or click to open Navigators"
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
  }
  .floating-nav-pill.is-dragging {
    transition: none !important;
    animation: none !important;
    transform: scale(1.06) !important;
    box-shadow: 0 12px 28px rgba(79, 70, 229, 0.65), 0 5px 0 var(--ink) !important;
    z-index: 1000000 !important;
  }
</style>
