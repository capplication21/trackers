<script>
  import { readingState } from '$lib/stores/readingState.svelte.js';

  let showModal = $state(false);
  let customUrlInput = $state('');

  function openModal() {
    const story = readingState.currentStory;
    customUrlInput = (readingState.customVideoUrls && readingState.customVideoUrls[story.id]) || story.videoUrl || '';
    showModal = true;
  }

  function closeModal() {
    showModal = false;
  }

  async function handleSaveCustomVideo() {
    if (customUrlInput.trim()) {
      await readingState.setCustomVideoUrl(readingState.currentStory.id, customUrlInput.trim());
      closeModal();
    }
  }

  async function handleResetVideo() {
    await readingState.resetVideoUrl(readingState.currentStory.id);
    closeModal();
  }
</script>

<div class="reading-companion-box" id="readingCompanionMediaBox">
  <div class="reading-companion-topbar">
    <div class="reading-companion-info">
      <div class="reading-pulse-dot" title="Audio narration synced"></div>
      <div style="min-width:0;">
        <div class="reading-companion-title">
          🎧 Narration: {readingState.currentStory.title}
        </div>
        <div style="font-size:11px;color:#94a3b8;display:flex;align-items:center;gap:6px;">
          <span>{readingState.currentStory.level}</span> •
          <span>{readingState.currentStory.pages.length} Chapters</span> •
          <span style="color:#22c55e;">Synced Audio Player</span>
        </div>
      </div>
    </div>

    <div class="reading-companion-actions">
      <button
        type="button"
        class="reading-media-btn"
        id="readingMediaModeBtn"
        onclick={() => readingState.toggleMediaMode()}
        title="Toggle between audio mode and video screen"
      >
        {#if readingState.mediaMode === 'compact'}
          <span>🎬</span> Watch Video
        {:else}
          <span>🎵</span> Audio Bar
        {/if}
      </button>

      <button
        type="button"
        class="reading-media-btn"
        onclick={openModal}
        title="Put or edit video URL for this story"
      >
        <span>🔗</span> Video Link
      </button>

      <button
        type="button"
        class="reading-media-btn"
        onclick={() => readingState.toggleMediaVisibility()}
        title="Hide or show companion player"
      >
        <span>👁️</span> Media
      </button>
    </div>
  </div>

  <!-- Embedded Video / Audio Player -->
  <div
    class="reading-video-stage-container {readingState.mediaMode} {readingState.isMediaVisible ? '' : 'hidden'}"
    id="readingCompanionMediaStage"
  >
    <iframe
      id="readingCompanionIframe"
      data-active-video-id={readingState.currentVideoId}
      src="https://www.youtube.com/embed/{readingState.currentVideoId}?enablejsapi=1&rel=0"
      title="English2Flow Story Narration"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    ></iframe>
  </div>
</div>

{#if showModal}
  <div class="reading-modal-overlay" id="readingVideoModal">
    <div class="reading-modal-card">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
        <div style="font-size:15px;font-weight:800;color:#fef08a;">🔗 Custom YouTube Video Link</div>
        <button type="button" class="reading-tool-btn" onclick={closeModal}>✕</button>
      </div>
      <p style="font-size:12px;color:#94a3b8;margin-bottom:14px;line-height:1.4;">
        Paste any YouTube video or audio link for <strong>{readingState.currentStory.title}</strong>. It will play directly on this page while you read.
      </p>
      <input
        type="text"
        id="readingCustomUrlInput"
        bind:value={customUrlInput}
        placeholder="https://www.youtube.com/watch?v=..."
        style="width:100%;padding:10px;border-radius:8px;border:1.5px solid #475569;background:#0f172a;color:#ffffff;font-size:13px;margin-bottom:14px;box-sizing:border-box;"
      />
      <div style="display:flex;justify-content:flex-end;gap:8px;">
        <button
          type="button"
          class="reading-tool-btn"
          onclick={handleResetVideo}
          style="color:#f87171;"
        >
          Reset to Channel Default
        </button>
        <button
          type="button"
          class="reading-tool-btn active"
          onclick={handleSaveCustomVideo}
        >
          Save &amp; Play
        </button>
      </div>
    </div>
  </div>
{/if}
