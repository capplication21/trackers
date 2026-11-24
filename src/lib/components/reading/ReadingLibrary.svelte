<script>
  import { readingState } from '$lib/stores/readingState.svelte.js';
  import { openExternalUrl } from '$lib/utils/openLink.js';

  const stories = $derived(readingState.filteredStories);
  const allCount = $derived(readingState.allStories.length);
  const l1Count = $derived(readingState.allStories.filter(s => s.level.toLowerCase().includes('level 1')).length);
  const l2Count = $derived(readingState.allStories.filter(s => s.level.toLowerCase().includes('level 2')).length);

  function selectBook(id) {
    readingState.setStory(id);
  }
</script>

<div class="reading-library-wrap">
  <!-- Channel Hero Banner -->
  <div class="library-channel-banner">
    <div class="channel-info-left">
      <div class="channel-avatar">📚</div>
      <div>
        <div class="channel-title">English2Flow Graded Reader Library</div>
        <div class="channel-subtitle">
          9 Interactive Story Books with Full YouTube Video Narrations • Adapted for English Learners
        </div>
      </div>
    </div>

    <button
      type="button"
      class="channel-link-btn"
      onclick={() => openExternalUrl('https://www.youtube.com/@English2Flow')}
      title="Open @English2Flow Official Channel on YouTube"
    >
      <span>▶️</span> @English2Flow ↗
    </button>
  </div>

  <!-- Filter & Stats Bar -->
  <div class="library-filter-bar">
    <div class="library-filter-pills">
      <button
        type="button"
        class="filter-pill"
        class:active={readingState.activeFilter === 'all'}
        onclick={() => readingState.setFilter('all')}
      >
        📖 All Books ({allCount})
      </button>
      <button
        type="button"
        class="filter-pill"
        class:active={readingState.activeFilter === 'level1'}
        onclick={() => readingState.setFilter('level1')}
      >
        🌱 Level 1 (Beginner · {l1Count})
      </button>
      <button
        type="button"
        class="filter-pill"
        class:active={readingState.activeFilter === 'level2'}
        onclick={() => readingState.setFilter('level2')}
      >
        ⭐ Level 2 (Intermediate · {l2Count})
      </button>
    </div>

    <div class="library-stats-hint">
      Tap any book cover to open its 3D flipbook &amp; narration video
    </div>
  </div>

  <!-- Library Bookshelf Grid -->
  <div class="library-bookshelf-grid">
    {#each stories as story (story.id)}
      {@const bookmark = readingState.getStoryBookmark(story.id)}
      {@const isCurrent = readingState.storyId === story.id}
      <div class="library-book-card" class:is-active-book={isCurrent}>
        <!-- Hardcover Book Spine / Cover Preview -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="book-cover-preview"
          style="background-color: {story.coverColor || '#1e293b'};"
          onclick={() => selectBook(story.id)}
          title="Open {story.title}"
        >
          {#if bookmark !== null && bookmark > 0}
            <div class="book-cover-bookmark" title="Saved at page {bookmark}">
              🔖 p. {bookmark}
            </div>
          {/if}

          <div class="book-cover-top">
            <span class="book-cover-badge">ENGLISH2FLOW</span>
            <span class="book-cover-icon">{story.icon || '📖'}</span>
          </div>

          <div class="book-cover-center">
            <div class="book-cover-title">{story.title}</div>
            <div class="book-cover-subtitle">{story.subtitle || 'Graded English Reader'}</div>
          </div>

          <div class="book-cover-bottom">
            <span class="book-cover-level">
              {story.level.includes('Level 1') ? 'Level 1' : 'Level 2'} • {story.pages ? story.pages.length : 0} Ch.
            </span>
            <span class="book-cover-open-cue">Open ➔</span>
          </div>
        </div>

        <!-- Book Details & Actions -->
        <div class="book-card-details">
          <div class="book-card-header">
            <div class="book-title-row">
              <span class="book-story-icon">{story.icon || '📖'}</span>
              <button
                type="button"
                class="book-title-btn"
                onclick={() => selectBook(story.id)}
                title="Read {story.title}"
              >
                {story.title}
              </button>
            </div>
            <span class="book-level-tag" class:tag-l1={story.level.includes('Level 1')}>
              {story.level.includes('Level 1') ? 'Level 1 · Beginner' : 'Level 2 · Intermediate'}
            </span>
          </div>

          <p class="book-card-desc">
            {story.description || 'Graded English story with chapter vocabulary, reflection morals, and video narration.'}
          </p>

          <div class="book-card-meta">
            <span class="meta-item">
              <span>📑</span> {story.pages ? story.pages.length : 0} Chapters
            </span>
            <span class="meta-item">
              <span>🎧</span> Video Narration
            </span>
            {#if bookmark !== null && bookmark > 0}
              <span class="meta-item meta-bookmark">
                <span>🔖</span> Bookmarked (p. {bookmark})
              </span>
            {/if}
          </div>

          <!-- Action Buttons -->
          <div class="book-card-actions">
            <button
              type="button"
              class="book-open-btn"
              onclick={() => selectBook(story.id)}
              title="Open book in 3D reader with video"
            >
              <span>📖</span> {isCurrent ? 'Continue Reading ➔' : 'Read Book & Video ➔'}
            </button>

            {#if story.videoUrl}
              <button
                type="button"
                class="book-yt-btn"
                onclick={() => openExternalUrl(story.videoUrl)}
                title="Watch on YouTube"
              >
                <span>▶️</span> YouTube ↗
              </button>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .reading-library-wrap {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 30px;
  }

  /* Channel Hero Banner */
  .library-channel-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    background: radial-gradient(circle at top left, #1e293b 0%, #0f172a 100%);
    border: 2.5px solid var(--ink);
    border-radius: 16px;
    padding: 16px 20px;
    box-shadow: 0 4px 0 var(--ink);
    color: #ffffff;
    flex-wrap: wrap;
  }

  .channel-info-left {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
  }

  .channel-avatar {
    width: 46px;
    height: 46px;
    background: #f59e0b;
    border: 2px solid var(--ink);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    box-shadow: 0 3px 0 var(--ink);
    flex-shrink: 0;
  }

  .channel-title {
    font-size: 17px;
    font-weight: 800;
    color: #fef08a;
    font-family: 'Georgia', serif;
    letter-spacing: 0.3px;
  }

  .channel-subtitle {
    font-size: 12px;
    color: #cbd5e1;
    margin-top: 2px;
  }

  .channel-link-btn {
    background: #dc2626;
    color: #ffffff;
    border: 2px solid var(--ink);
    border-radius: 999px;
    padding: 8px 18px;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 3px 0 var(--ink);
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.12s ease;
    white-space: nowrap;
  }

  .channel-link-btn:hover {
    background: #b91c1c;
    transform: translateY(-1px);
    box-shadow: 0 4px 0 var(--ink);
  }

  /* Filter Bar */
  .library-filter-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    flex-wrap: wrap;
    background: #ffffff;
    border: 2px solid var(--ink);
    border-radius: 14px;
    padding: 8px 14px;
    box-shadow: 0 2px 0 var(--ink);
  }

  .library-filter-pills {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  .filter-pill {
    background: #f1f5f9;
    border: 1.5px solid #cbd5e1;
    color: #475569;
    font-size: 12px;
    font-weight: 700;
    padding: 6px 14px;
    border-radius: 999px;
    cursor: pointer;
    transition: all 0.12s ease;
  }

  .filter-pill:hover {
    background: #e2e8f0;
    color: #0f172a;
  }

  .filter-pill.active {
    background: #0f766e;
    color: #ffffff;
    border-color: var(--ink);
    box-shadow: 0 2px 0 var(--ink);
    font-weight: 800;
  }

  .library-stats-hint {
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    font-style: italic;
  }

  /* Bookshelf Grid */
  .library-bookshelf-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 16px;
  }

  .library-book-card {
    background: #ffffff;
    border: 2.5px solid var(--ink);
    border-radius: 16px;
    padding: 14px;
    box-shadow: 0 4px 0 var(--ink);
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    position: relative;
  }

  .library-book-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 0 var(--ink);
  }

  .library-book-card.is-active-book {
    border-color: #047857;
    background: #f0fdf4;
    box-shadow: 0 4px 0 #047857;
  }

  /* Hardcover Book Cover Preview */
  .book-cover-preview {
    border: 2px solid rgba(212, 175, 55, 0.5);
    border-radius: 10px;
    padding: 14px 16px;
    color: #ffffff;
    box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.7), 0 4px 10px rgba(0, 0, 0, 0.35);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 155px;
    position: relative;
    overflow: hidden;
    transition: transform 0.15s ease;
  }

  .book-cover-preview:hover {
    transform: scale(1.015);
  }

  .book-cover-preview::before {
    content: '';
    position: absolute;
    top: 6px;
    left: 6px;
    right: 6px;
    bottom: 6px;
    border: 1px solid rgba(212, 175, 55, 0.35);
    border-radius: 6px;
    pointer-events: none;
  }

  .book-cover-bookmark {
    position: absolute;
    top: 0;
    right: 14px;
    background: #dc2626;
    color: #ffffff;
    font-size: 10px;
    font-weight: 800;
    padding: 3px 8px 5px 8px;
    border-radius: 0 0 4px 4px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
    z-index: 2;
  }

  .book-cover-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1;
  }

  .book-cover-badge {
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.8px;
    color: #fef08a;
    background: rgba(0, 0, 0, 0.3);
    padding: 2px 8px;
    border-radius: 999px;
    border: 0.5px solid rgba(254, 240, 138, 0.4);
  }

  .book-cover-icon {
    font-size: 22px;
  }

  .book-cover-center {
    margin: 8px 0;
    z-index: 1;
  }

  .book-cover-title {
    font-size: 16px;
    font-weight: 800;
    font-family: 'Georgia', serif;
    color: #fef08a;
    line-height: 1.25;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  }

  .book-cover-subtitle {
    font-size: 10.5px;
    color: #fef3c7;
    opacity: 0.85;
    font-style: italic;
    margin-top: 3px;
  }

  .book-cover-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(212, 175, 55, 0.25);
    padding-top: 8px;
    font-size: 10px;
    color: #fef3c7;
    z-index: 1;
  }

  .book-cover-level {
    font-weight: 700;
  }

  .book-cover-open-cue {
    font-weight: 800;
    color: #fde047;
  }

  /* Details Area */
  .book-card-details {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    gap: 8px;
  }

  .book-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
  }

  .book-title-row {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }

  .book-story-icon {
    font-size: 18px;
    flex-shrink: 0;
  }

  .book-title-btn {
    background: none;
    border: none;
    padding: 0;
    text-align: left;
    font-size: 14px;
    font-weight: 800;
    color: #0f172a;
    cursor: pointer;
    font-family: inherit;
    line-height: 1.25;
  }

  .book-title-btn:hover {
    color: #0f766e;
    text-decoration: underline;
  }

  .book-level-tag {
    font-size: 10px;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 999px;
    background: #fef3c7;
    color: #92400e;
    border: 1px solid #fde68a;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .book-level-tag.tag-l1 {
    background: #ecfdf5;
    color: #065f46;
    border-color: #a7f3d0;
  }

  .book-card-desc {
    font-size: 11.5px;
    color: #475569;
    line-height: 1.5;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .book-card-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    font-size: 10.5px;
    color: #64748b;
    font-weight: 600;
  }

  .meta-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .meta-bookmark {
    color: #dc2626;
    font-weight: 700;
  }

  /* Actions */
  .book-card-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
  }

  .book-open-btn {
    flex: 1;
    background: #0f766e;
    color: #ffffff;
    border: 2px solid var(--ink);
    border-radius: 999px;
    padding: 7px 14px;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 2.5px 0 var(--ink);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.12s ease;
  }

  .book-open-btn:hover {
    background: #115e59;
    transform: translateY(-1px);
    box-shadow: 0 3.5px 0 var(--ink);
  }

  .book-yt-btn {
    background: #ffffff;
    color: #dc2626;
    border: 1.5px solid #fca5a5;
    border-radius: 999px;
    padding: 7px 12px;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: all 0.12s ease;
  }

  .book-yt-btn:hover {
    background: #fee2e2;
    border-color: #dc2626;
  }

  @media (max-width: 600px) {
    .library-bookshelf-grid {
      grid-template-columns: 1fr;
    }
    .library-channel-banner {
      padding: 12px 14px;
    }
  }
</style>
