<script>
  import { onMount, tick } from 'svelte';
  import { readingState } from '$lib/stores/readingState.svelte.js';
  import { playPageFlipSound } from '$lib/utils/audioRustle.js';

  let bookElement = $state(null);
  let stageWrapper = $state(null);
  let pageFlipInstance = null;
  let isMobile = $state(false);

  const story = $derived(readingState.currentStory);
  const totalPages = $derived(
    1 /* Front Cover */ +
    1 /* Dedication */ +
    1 /* TOC */ +
    story.pages.length +
    1 /* Epilogue */ +
    1 /* Back Cover */ +
    ((1 + 1 + 1 + story.pages.length + 1 + 1) % 2 !== 0 ? 1 : 0) /* Blank parchment */
  );

  const pageInfoText = $derived.by(() => {
    const page = readingState.currentPage;
    if (page === 0) return '📖 Cover Page';
    if (page === 1) return '📜 Dedication & Title';
    if (page === 2) return '📑 Table of Contents';
    if (page >= totalPages - 2) return '✨ Epilogue & Reflection';
    const chNum = page - 2;
    return `📖 Chapter ${chNum} of ${story.pages.length}`;
  });

  async function mountBook() {
    await tick();
    if (!bookElement) return;

    if (pageFlipInstance) {
      try {
        pageFlipInstance.destroy();
      } catch (e) {}
      pageFlipInstance = null;
    }

    isMobile = window.innerWidth <= 768;
    const availWidth = bookElement.parentElement ? bookElement.parentElement.clientWidth : window.innerWidth - 32;

    let pageWidth = 440;
    let pageHeight = 600;

    if (isMobile) {
      pageWidth = Math.max(280, Math.min(availWidth - 20, 420));
      pageHeight = Math.round(pageWidth * 1.38);
    } else {
      const spreadWidth = Math.min(availWidth - 30, 920);
      pageWidth = Math.round(spreadWidth / 2);
      pageHeight = Math.min(640, Math.round(pageWidth * 1.36));
    }

    try {
      const { PageFlip } = await import('page-flip');
      const flip = new PageFlip(bookElement, {
        width: pageWidth,
        height: pageHeight,
        size: isMobile ? 'fixed' : 'stretch',
        minWidth: 260,
        maxWidth: 960,
        minHeight: 380,
        maxHeight: 1200,
        maxShadowOpacity: 0.45,
        showCover: true,
        mobileScrollSupport: false,
        usePortrait: isMobile,
        flippingTime: 500,
        startPage: Math.max(0, readingState.currentPage || 0)
      });

      const pages = bookElement.querySelectorAll('.reading-flip-page');
      if (pages.length > 0) {
        flip.loadFromHTML(pages);
        flip.on('flip', (e) => {
          readingState.currentPage = e.data;
          readingState.saveState();
          playPageFlipSound(readingState.isSoundEnabled);
        });
        pageFlipInstance = flip;
        readingState.pageFlipInstance = flip;
      }
    } catch (err) {
      console.warn('PageFlip initialization error, running in fallback mode:', err);
    }
  }

  function handleFlipPrev() {
    if (pageFlipInstance) {
      pageFlipInstance.flipPrev();
    } else {
      readingState.currentPage = Math.max(0, readingState.currentPage - 1);
    }
  }

  function handleFlipNext() {
    if (pageFlipInstance) {
      pageFlipInstance.flipNext();
    } else {
      readingState.currentPage = Math.min(totalPages - 1, readingState.currentPage + 1);
    }
  }

  export function flipTo(pageIndex) {
    if (pageFlipInstance) {
      pageFlipInstance.flip(pageIndex);
    } else {
      readingState.currentPage = pageIndex;
    }
  }

  function toggleFullscreen() {
    if (!stageWrapper) return;
    if (!document.fullscreenElement) {
      if (stageWrapper.requestFullscreen) stageWrapper.requestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  }

  onMount(() => {
    mountBook();

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        mountBook();
      }, 250);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (pageFlipInstance) {
        try {
          pageFlipInstance.destroy();
        } catch (e) {}
      }
    };
  });

  // Re-mount when the selected story changes
  $effect(() => {
    const _id = readingState.storyId;
    mountBook();
  });
</script>

<div class="reading-stage-wrapper" id="readingStageWrapper" bind:this={stageWrapper}>
  <!-- Stage Top Toolbar -->
  <div class="reading-stage-top-controls">
    <div class="reading-stage-page-info" id="readingStagePageIndicator">
      {pageInfoText}
    </div>

    <div class="reading-top-tool-group">
      <button
        type="button"
        class="reading-tool-btn {readingState.isSoundEnabled ? 'active' : ''}"
        onclick={() => readingState.toggleSound()}
        title="Toggle realistic page-flip sound effect"
      >
        {#if readingState.isSoundEnabled}
          <span>🔊</span> Sound On
        {:else}
          <span>🔇</span> Sound Off
        {/if}
      </button>

      <button
        type="button"
        class="reading-tool-btn"
        onclick={() => readingState.adjustFontSize(-1)}
        title="Decrease font size"
      >
        A-
      </button>
      <button
        type="button"
        class="reading-tool-btn"
        onclick={() => readingState.adjustFontSize(1)}
        title="Increase font size"
      >
        A+
      </button>

      <button
        type="button"
        class="reading-tool-btn"
        onclick={toggleFullscreen}
        title="Fullscreen Reading Mood"
      >
        ⛶ Fullscreen
      </button>
    </div>
  </div>

  <!-- Flipbook Stage with Floating Arrows -->
  <div class="reading-flipbook-container">
    <button
      type="button"
      class="reading-flip-arrow-btn reading-flip-arrow-prev"
      id="readingFlipArrowPrev"
      disabled={readingState.currentPage <= 0}
      onclick={handleFlipPrev}
      title="Flip to Previous Page"
    >
      ◀
    </button>

    <div id="readingStBookElement" bind:this={bookElement}>
      <!-- Page 0: Front Hardcover -->
      <div
        class="reading-flip-page reading-page-cover-front"
        style="--story-theme-color:{story.coverColor || '#2b0a1a'};"
      >
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span class="reading-cover-badge-pill">ENGLISH2FLOW GRADED READER</span>
          <span style="font-size:18px;">{story.icon || '📖'}</span>
        </div>

        <div style="text-align:center;margin:auto 0;padding:20px 0;">
          <div style="font-size:36px;margin-bottom:10px;">{story.icon || '📖'}</div>
          <div class="reading-cover-emboss-title">{story.title}</div>
          <div class="reading-cover-sub">{story.subtitle}</div>
          <div style="margin-top:16px;">
            <span
              style="display:inline-block;padding:4px 12px;border-radius:999px;background:rgba(212,175,55,0.25);border:1px solid #d4af37;color:#fef08a;font-size:11px;font-weight:800;"
            >
              ★ {story.level} • {story.pages.length} Chapters ★
            </span>
          </div>
        </div>

        <div
          style="border-top:1px solid rgba(212,175,55,0.3);padding-top:10px;text-align:center;font-size:10.5px;color:#fef3c7;opacity:0.85;"
        >
          Click right edge or "Next ▶" to flip open • English2Flow
        </div>
      </div>

      <!-- Page 1: Inside Front & Dedication -->
      <div class="reading-flip-page">
        <div class="reading-page-inner">
          <div class="reading-page-header">
            <span>Frontispiece</span>
            <span>English2Flow</span>
          </div>

          <div style="text-align:center;margin:auto 0;padding:14px 8px;">
            <div
              style="font-size:20px;font-weight:800;color:#1e293b;font-family:'Georgia',serif;margin-bottom:6px;"
            >
              {story.title}
            </div>
            <div style="font-size:12px;color:#64748b;font-style:italic;margin-bottom:16px;">
              Adapted for English Learners
            </div>

            <div style="width:40px;height:2px;background:#ca8a04;margin:16px auto;"></div>

            <div style="font-size:13px;line-height:1.75;color:#475569;font-style:italic;padding:0 12px;">
              "{story.dedication || 'Dedicated to every student striving toward fluency.'}"
            </div>

            <div style="width:40px;height:2px;background:#ca8a04;margin:16px auto;"></div>

            <div
              style="font-size:11px;color:#854d0e;background:#fefce8;padding:8px 12px;border-radius:8px;border:1px dashed #ca8a04;margin-top:14px;"
            >
              🎧 <strong>Reading Tip:</strong> Hit <em>Watch Video</em> or <em>Audio Bar</em> above to listen to native pronunciation while following the words.
            </div>
          </div>

          <div class="reading-page-footer">
            <span>Inside Title</span>
            <span>Page i</span>
          </div>
        </div>
      </div>

      <!-- Page 2: Table of Contents -->
      <div class="reading-flip-page">
        <div class="reading-page-inner">
          <div class="reading-page-header">
            <span>Contents</span>
            <span>Table of Chapters</span>
          </div>

          <div style="flex:1;overflow-y:auto;padding-right:4px;">
            <div
              class="reading-chapter-title"
              style="margin-bottom:14px;border-bottom:2px solid #ca8a04;padding-bottom:4px;"
            >
              Table of Contents
            </div>
            <div style="display:flex;flex-direction:column;gap:8px;">
              {#each story.pages as p, pIdx}
                {@const targetFlipIndex = pIdx + 3}
                <div
                  onclick={() => flipTo(targetFlipIndex)}
                  onkeydown={(e) => { if (e.key === 'Enter') flipTo(targetFlipIndex); }}
                  tabindex="0"
                  role="button"
                  style="display:flex;align-items:center;justify-content:space-between;padding:7px 10px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;cursor:pointer;transition:background 0.12s ease;"
                  title="Jump to {p.chapter}"
                >
                  <div style="font-size:12px;font-weight:700;color:#1e293b;">
                    {p.chapter}: <span style="font-weight:600;color:#475569;">{p.title}</span>
                  </div>
                  <span style="font-size:11px;font-weight:800;color:#ca8a04;">p. {pIdx + 1} ➔</span>
                </div>
              {/each}
            </div>
          </div>

          <div class="reading-page-footer">
            <span>Table of Contents</span>
            <span>Page ii</span>
          </div>
        </div>
      </div>

      <!-- Pages 3..N+2: Story Chapter Pages -->
      {#each story.pages as p, pIdx}
        {@const humanPageNum = pIdx + 1}
        <div class="reading-flip-page">
          <div class="reading-page-inner">
            <div class="reading-page-header">
              <span>{story.title.split(':')[0]}</span>
              <span>Chapter {humanPageNum} of {story.pages.length}</span>
            </div>

            <div class="reading-chapter-title">
              {p.chapter}: {p.title}
            </div>

            <div class="reading-prose-container" style="font-size:{readingState.fontSize}px;">
              {#each p.prose as paragraph, paraIdx}
                {#if paraIdx === 0 && paragraph.length > 0}
                  <p style="margin-bottom:12px;">
                    <span class="reading-drop-cap">{paragraph.charAt(0)}</span>{paragraph.slice(1)}
                  </p>
                {:else}
                  <p style="margin-bottom:12px;">{paragraph}</p>
                {/if}
              {/each}
            </div>

            {#if p.vocab && p.vocab.length}
              <div class="reading-vocab-box">
                <div
                  style="font-weight:800;color:#854d0e;margin-bottom:4px;display:flex;align-items:center;gap:4px;"
                >
                  <span>💡</span> Key Vocabulary &amp; Expressions:
                </div>
                {#each p.vocab as v}
                  <div class="reading-vocab-item">
                    <span class="reading-vocab-word">• {v.word}</span>:
                    <span class="reading-vocab-def">{v.meaning}</span>
                  </div>
                {/each}
              </div>
            {/if}

            <div class="reading-page-footer">
              <span>English2Flow</span>
              <span>Page {humanPageNum}</span>
            </div>
          </div>
        </div>
      {/each}

      <!-- Epilogue, Moral & Discussion Page -->
      <div class="reading-flip-page">
        <div class="reading-page-inner">
          <div class="reading-page-header">
            <span>Epilogue</span>
            <span>Reflection &amp; Moral</span>
          </div>

          <div style="flex:1;overflow-y:auto;padding-right:4px;">
            <div class="reading-chapter-title" style="color:#854d0e;">
              ✨ Moral of the Story
            </div>

            <div
              style="background:#fefce8;border:1.5px solid #fef08a;border-left:4px solid #ca8a04;padding:12px;border-radius:8px;font-size:12.5px;line-height:1.6;color:#713f12;margin-bottom:16px;"
            >
              <strong>Life Lesson:</strong> {story.description}
            </div>

            <div style="font-size:12px;font-weight:800;color:#1e293b;margin-bottom:8px;">
              🗣️ Discussion &amp; Reflection Questions:
            </div>
            <ol style="font-size:11.5px;line-height:1.6;color:#334155;padding-left:18px;margin-bottom:14px;">
              <li style="margin-bottom:6px;">How would you describe the main sacrifice made in this story?</li>
              <li style="margin-bottom:6px;">Which new vocabulary words or phrases were most useful for you?</li>
              <li style="margin-bottom:6px;">Can you summarize what happened in 3 sentences using your own English words?</li>
            </ol>

            <div style="background:#f1f5f9;border-radius:8px;padding:10px;font-size:11px;color:#475569;text-align:center;">
              🎉 <strong>Congratulations!</strong> You finished reading <em>{story.title}</em>!
            </div>
          </div>

          <div class="reading-page-footer">
            <span>Epilogue</span>
            <span>End of Story</span>
          </div>
        </div>
      </div>

      {#if (1 + 1 + 1 + story.pages.length + 1 + 1) % 2 !== 0}
        <!-- Blank Parchment Endpaper to ensure even spreads -->
        <div class="reading-flip-page">
          <div class="reading-page-inner" style="justify-content:center;text-align:center;">
            <div style="font-size:24px;color:#ca8a04;margin-bottom:8px;">❦</div>
            <div style="font-size:12px;color:#94a3b8;font-style:italic;">Notes &amp; Reflections</div>
            <div style="font-size:24px;color:#ca8a04;margin-top:8px;">❦</div>
          </div>
        </div>
      {/if}

      <!-- Back Hardcover -->
      <div
        class="reading-flip-page reading-page-cover-back"
        style="--story-theme-color:{story.coverColor || '#2b0a1a'};"
      >
        <div style="font-size:18px;">{story.icon || '📖'}</div>

        <div style="padding:14px 10px;">
          <div style="font-size:15px;font-weight:800;color:#fef08a;margin-bottom:8px;">
            {story.title}
          </div>
          <p style="font-size:11.5px;line-height:1.6;color:#fef3c7;margin-bottom:16px;">
            {story.description}
          </p>

          <button
            type="button"
            class="reading-tool-btn active"
            onclick={() => flipTo(0)}
            style="padding:8px 16px;font-size:12px;"
          >
            ↺ Re-read from Cover
          </button>
        </div>

        <div
          style="border-top:1px solid rgba(212,175,55,0.3);padding-top:10px;font-size:10.5px;color:#fef3c7;opacity:0.85;"
        >
          English2Flow • YouTube Channel Graded Library
        </div>
      </div>
    </div>

    <button
      type="button"
      class="reading-flip-arrow-btn reading-flip-arrow-next"
      id="readingFlipArrowNext"
      disabled={readingState.currentPage >= totalPages - 1}
      onclick={handleFlipNext}
      title="Flip to Next Page"
    >
      ▶
    </button>
  </div>

  <!-- Bottom Chapter Quick Jump Bar -->
  <div class="reading-bottom-chapter-bar">
    <button
      type="button"
      class="reading-chapter-jump-pill {readingState.currentPage === 0 ? 'active' : ''}"
      onclick={() => flipTo(0)}
    >
      Cover 📕
    </button>
    <button
      type="button"
      class="reading-chapter-jump-pill {readingState.currentPage === 1 ? 'active' : ''}"
      onclick={() => flipTo(1)}
    >
      Title 📜
    </button>
    <button
      type="button"
      class="reading-chapter-jump-pill {readingState.currentPage === 2 ? 'active' : ''}"
      onclick={() => flipTo(2)}
    >
      TOC 📑
    </button>
    {#each story.pages as p, idx}
      {@const targetIdx = idx + 3}
      <button
        type="button"
        class="reading-chapter-jump-pill {readingState.currentPage === targetIdx ? 'active' : ''}"
        onclick={() => flipTo(targetIdx)}
      >
        Ch {idx + 1}
      </button>
    {/each}
    <button
      type="button"
      class="reading-chapter-jump-pill {readingState.currentPage >= story.pages.length + 3 ? 'active' : ''}"
      onclick={() => flipTo(story.pages.length + 3)}
    >
      Moral ✨
    </button>
  </div>
</div>
