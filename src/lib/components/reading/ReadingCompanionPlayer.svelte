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
      <div class="reading-pulse-dot" title="Video narration available"></div>
      <div style="min-width:0;">
        <div class="reading-companion-title">
          ▶️ Story Narration Video • {readingState.currentStory.title}
        </div>
        <div style="font-size:11px;color:#94a3b8;display:flex;align-items:center;gap:6px;margin-top:2px;flex-wrap:wrap;">
          <span>{readingState.currentStory.level}</span> •
          <span>{readingState.currentStory.pages.length} Chapters</span> •
          <span style="color:#22c55e;font-weight:700;">Watch or Read on this page</span>
        </div>
      </div>
    </div>

    <div class="reading-companion-actions">
      <button
        type="button"
        class="reading-media-btn active"
        onclick={() => readingState.toggleMediaVisibility()}
        title="Show or hide story video"
      >
        {#if readingState.isMediaVisible}
          <span>🔽</span> Hide Video
        {:else}
          <span>👁️</span> Watch Video Here
        {/if}
      </button>

      {#if readingState.currentStory.videoUrl}
        <a
          href={readingState.currentStory.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="reading-media-btn"
          title="Open in YouTube"
          style="text-decoration:none;"
        >
          <span>↗️</span> YouTube
        </a>
      {/if}

      <button
        type="button"
        class="reading-media-btn"
        onclick={openModal}
        title="Put or edit video URL for this story"
      >
        <span>✏️</span> Edit Link
      </button>
    </div>
  </div>

  <!-- Embedded Video / Audio Player -->
  {#if readingState.isMediaVisible}
    <div
      class="reading-video-stage-container expanded"
      id="readingCompanionMediaStage"
      style="margin-top:12px;border:2px solid #334155;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.5);aspect-ratio:16/9;height:auto;max-height:480px;"
    >
      <iframe
        id="readingCompanionIframe"
        data-active-video-id={readingState.currentVideoId}
        src="https://www.youtube.com/embed/{readingState.currentVideoId}?enablejsapi=1&rel=0"
        title="English2Flow Story Narration"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        style="width:100%;height:100%;border:0;display:block;"
      ></iframe>
    </div>
  {/if}
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
