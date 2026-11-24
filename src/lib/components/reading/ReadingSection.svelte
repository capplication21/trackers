<script>
  import ReadingCompanionPlayer from './ReadingCompanionPlayer.svelte';
  import ReadingFlipbook from './ReadingFlipbook.svelte';
  import ReadingLibrary from './ReadingLibrary.svelte';
  import { readingState } from '$lib/stores/readingState.svelte.js';
  import { openExternalUrl } from '$lib/utils/openLink.js';
  import { onMount } from 'svelte';

  onMount(() => {
    readingState.init();
  });

  const stories = $derived(readingState.allStories);
  const currentStory = $derived(readingState.currentStory);

  function handleStoryChange(e) {
    const val = e.target.value;
    if (val) {
      readingState.setStory(val);
    }
  }
</script>

<div class="tab-content active" id="tab-reading" style="display: block;">
  <!-- Section Header & View Switcher -->
  <div class="reading-header-row">
    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
      <div class="section-title" style="margin: 0;">
        <span>📖</span> READING BOOK
      </div>
      {#if readingState.activeView === 'reader'}
        <span class="active-book-indicator">
          <span>{currentStory.icon || '📖'}</span> {currentStory.title}
        </span>
      {/if}
    </div>

    <!-- Mode Switcher Pills -->
    <div class="reading-view-pills">
      <button
        type="button"
        class="view-pill"
        class:active={readingState.activeView === 'library'}
        onclick={() => readingState.setView('library')}
        title="Browse All 9 Story Books in the Library Shelf"
      >
        <span>📚</span> Library Shelf ({stories.length})
      </button>

      <button
        type="button"
        class="view-pill"
        class:active={readingState.activeView === 'reader'}
        onclick={() => readingState.setView('reader')}
        title="Open Book Reader & Video"
      >
        <span>📖</span> Read &amp; Watch
      </button>

      <button
        type="button"
        class="yt-channel-link"
        onclick={() => openExternalUrl('https://www.youtube.com/@English2Flow')}
        title="Visit @English2Flow on YouTube"
      >
        <span>▶️</span> @English2Flow ↗
      </button>
    </div>
  </div>

  <div id="readingBookContainer">
    {#if readingState.activeView === 'library'}
      <!-- LIBRARY VIEW: ALL STORIES ARRANGED AS A BOOKSHELF -->
      <ReadingLibrary />
    {:else}
      <!-- READER VIEW: ACTIVE BOOK WITH COMPANION VIDEO PLAYER -->
      <div class="reader-top-nav-bar">
        <button
          type="button"
          class="back-to-library-btn"
          onclick={() => readingState.setView('library')}
          title="Return to Library Shelf"
        >
          <span>◀ 📚</span> Library Shelf
        </button>

        <!-- Book Switcher Dropdown -->
        <div class="reader-story-selector-wrap">
          <label for="readerStorySelect" class="selector-label">Book:</label>
          <select
            id="readerStorySelect"
            class="reader-story-select"
            value={readingState.storyId}
            onchange={handleStoryChange}
            title="Select story to read"
          >
            {#each stories as s (s.id)}
              <option value={s.id}>
                {s.icon || '📖'} {s.title} ({s.level.includes('Level 1') ? 'L1' : 'L2'})
              </option>
            {/each}
          </select>
        </div>
      </div>

      <ReadingCompanionPlayer />
      <ReadingFlipbook />
    {/if}
  </div>
</div>

<style>
  .reading-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 14px;
    flex-wrap: wrap;
  }

  .active-book-indicator {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #ffffff;
    border: 1.5px solid #cbd5e1;
    border-radius: 999px;
    padding: 4px 12px;
    font-size: 11.5px;
    font-weight: 700;
    color: #334155;
    max-width: 240px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .reading-view-pills {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  .view-pill {
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #ffffff;
    color: #475569;
    border: 1.5px solid #cbd5e1;
    transition: all 0.15s ease;
  }

  .view-pill:hover {
    background: #f1f5f9;
    color: #0f172a;
  }

  .view-pill.active {
    background: #0f766e;
    color: #ffffff;
    border: 2px solid var(--ink);
    box-shadow: 0 2px 0 var(--ink);
  }

  .yt-channel-link {
    background: #ffffff;
    color: #dc2626;
    border: 1.5px solid #fca5a5;
    border-radius: 999px;
    padding: 6px 12px;
    font-size: 11.5px;
    font-weight: 800;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: all 0.12s ease;
  }

  .yt-channel-link:hover {
    background: #fee2e2;
    border-color: #dc2626;
  }

  /* Reader Top Navigation Bar */
  .reader-top-nav-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    background: #ffffff;
    border: 2px solid var(--ink);
    border-radius: 12px;
    padding: 8px 12px;
    margin-bottom: 12px;
    box-shadow: 0 2px 0 var(--ink);
    flex-wrap: wrap;
  }

  .back-to-library-btn {
    background: #f1f5f9;
    border: 1.5px solid #cbd5e1;
    color: #1e293b;
    border-radius: 8px;
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.12s ease;
  }

  .back-to-library-btn:hover {
    background: #e2e8f0;
    border-color: #94a3b8;
  }

  .reader-story-selector-wrap {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    max-width: 440px;
  }

  .selector-label {
    font-size: 12px;
    font-weight: 800;
    color: #475569;
  }

  .reader-story-select {
    flex: 1;
    background: #f8fafc;
    border: 1.5px solid #cbd5e1;
    border-radius: 8px;
    padding: 6px 10px;
    font-size: 12px;
    font-weight: 700;
    color: #1e293b;
    cursor: pointer;
    outline: none;
  }

  .reader-story-select:focus {
    border-color: #0f766e;
    background: #ffffff;
  }
</style>
