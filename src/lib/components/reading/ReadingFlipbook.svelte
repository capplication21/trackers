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
    1 /* Epilogue */
  );

  const savedBookmark = $derived(readingState.getStoryBookmark(story.id));

  async function handleTogglePageBookmark(pageIdx) {
    await readingState.toggleBookmark(story.id, pageIdx);
  }

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
    let pageHeight = 580;

    if (isMobile) {
      pageWidth = Math.max(260, Math.min(availWidth - 16, 400));
      pageHeight = Math.round(pageWidth * 1.34);
    } else {
      const spreadWidth = Math.min(availWidth - 24, 880);
      pageWidth = Math.round(spreadWidth / 2);
      pageHeight = Math.min(580, Math.round(pageWidth * 1.32));
    }

    try {
      const { PageFlip } = await import('page-flip');
      const flip = new PageFlip(bookElement, {
        width: pageWidth,
        height: pageHeight,
        size: 'fixed',
        autoSize: false,
        maxShadowOpacity: 0.45,
        showCover: true,
        mobileScrollSupport: false,
        usePortrait: isMobile,
        flippingTime: 450,
        useMouseEvents: false,
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

  function handleBookClick(event) {
    // If the click originated from an interactive element (buttons, links, bookmark triggers), let it do its work
    if (event.target.closest('button, a, input, select, textarea, .reading-bookmark-ribbon, .reading-page-bm-btn')) {
      return;
    }

    if (!bookElement) return;
    const rect = bookElement.getBoundingClientRect();
    const clickX = event.clientX - rect.left;

    // Closed cover (Page 0) -> click anywhere flips next to open the book
    if (readingState.currentPage === 0) {
      handleFlipNext();
      return;
    }

    // Last page / Epilogue -> click flips back
    if (readingState.currentPage >= totalPages - 1) {
      handleFlipPrev();
      return;
    }

    // Open spread:
    // Left click on page (left half) flips back to previous page
    // Right click on page (right half) flips forward to next page
    if (clickX < rect.width / 2) {
      handleFlipPrev();
    } else {
      handleFlipNext();
    }
  }

  function handleContextMenu(event) {
    // Prevent default context menu on book, and support secondary mouse click to go next
    event.preventDefault();
    handleFlipNext();
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

<div class="reading-stage-wrapper" id="readingFlipbookCard" bind:this={stageWrapper}>
  <!-- Flipbook Stage with Left/Right Click Page Turning -->
  <div
    class="reading-flipbook-container"
    onclick={handleBookClick}
    oncontextmenu={handleContextMenu}
    role="region"
    aria-label="Storybook Reader"
    style="position: relative; user-select: none;"
  >
    <div id="readingStBookElement" bind:this={bookElement} style="cursor: pointer;">
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

          {#if savedBookmark !== null && savedBookmark > 0}
            <div style="margin-top:16px;">
              <button
                type="button"
                class="reading-cover-resume-btn"
                onclick={(e) => {
                  e.stopPropagation();
                  flipTo(savedBookmark);
                }}
                style="display: inline-flex; align-items: center; gap: 6px; padding: 7px 16px; background: #f59e0b; color: #141413; border: 1.5px solid #d97706; border-radius: 999px; font-size: 12px; font-weight: 800; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.4);"
                title="Jump directly to your saved bookmark"
              >
                <span>🔖 Resume from Bookmark (Page {savedBookmark})</span>
              </button>
            </div>
          {/if}
        </div>

        <div
          style="border-top:1px solid rgba(212,175,55,0.3);padding-top:10px;text-align:center;font-size:10.5px;color:#fef3c7;opacity:0.85;"
        >
          Click page to open • English2Flow
        </div>
      </div>

      <!-- Page 1: Inside Front & Dedication -->
      <div class="reading-flip-page">
        <div class="reading-page-inner">
          {#if savedBookmark === 1}
            <div
              class="reading-bookmark-ribbon"
              role="button"
              tabindex="0"
              onclick={(e) => {
                e.stopPropagation();
                handleTogglePageBookmark(1);
              }}
              onkeydown={(e) => {
                if (e.key === 'Enter') {
                  e.stopPropagation();
                  handleTogglePageBookmark(1);
                }
              }}
              title="Bookmarked! Click to remove bookmark"
            >
              <span>🔖</span>
            </div>
          {/if}
          <div class="reading-page-header">
            <span>Frontispiece</span>
            <div style="display:flex;align-items:center;gap:8px;">
              <span>English2Flow</span>
              <button
                type="button"
                class="reading-page-bm-btn"
                onclick={(e) => {
                  e.stopPropagation();
                  handleTogglePageBookmark(1);
                }}
                title={savedBookmark === 1 ? 'Remove bookmark' : 'Bookmark this page'}
              >
                {savedBookmark === 1 ? '🔖' : '📑'}
              </button>
            </div>
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
              🎧 <strong>Reading Tip:</strong> Follow the English story line by line. Click the right page to turn forward!
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
          {#if savedBookmark === 2}
            <div
              class="reading-bookmark-ribbon"
              role="button"
              tabindex="0"
              onclick={(e) => {
                e.stopPropagation();
                handleTogglePageBookmark(2);
              }}
              onkeydown={(e) => {
                if (e.key === 'Enter') {
                  e.stopPropagation();
                  handleTogglePageBookmark(2);
                }
              }}
              title="Bookmarked! Click to remove bookmark"
            >
              <span>🔖</span>
            </div>
          {/if}
          <div class="reading-page-header">
            <span>Contents</span>
            <div style="display:flex;align-items:center;gap:8px;">
              <span>Table of Chapters</span>
              <button
                type="button"
                class="reading-page-bm-btn"
                onclick={(e) => {
                  e.stopPropagation();
                  handleTogglePageBookmark(2);
                }}
                title={savedBookmark === 2 ? 'Remove bookmark' : 'Bookmark this page'}
              >
                {savedBookmark === 2 ? '🔖' : '📑'}
              </button>
            </div>
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
                  onclick={(e) => {
                    e.stopPropagation();
                    flipTo(targetFlipIndex);
                  }}
                  onkeydown={(e) => {
                    if (e.key === 'Enter') {
                      e.stopPropagation();
                      flipTo(targetFlipIndex);
                    }
                  }}
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
        {@const pageFlipIndex = pIdx + 3}
        <div class="reading-flip-page">
          <div class="reading-page-inner">
            {#if savedBookmark === pageFlipIndex}
              <div
                class="reading-bookmark-ribbon"
                role="button"
                tabindex="0"
                onclick={(e) => {
                  e.stopPropagation();
                  handleTogglePageBookmark(pageFlipIndex);
                }}
                onkeydown={(e) => {
                  if (e.key === 'Enter') {
                    e.stopPropagation();
                    handleTogglePageBookmark(pageFlipIndex);
                  }
                }}
                title="Bookmarked! Click to remove bookmark"
              >
                <span>🔖</span>
              </div>
            {/if}
            <div class="reading-page-header">
              <span>{story.title.split(':')[0]}</span>
              <div style="display:flex;align-items:center;gap:8px;">
                <span>Chapter {humanPageNum} of {story.pages.length}</span>
                <button
                  type="button"
                  class="reading-page-bm-btn"
                  onclick={(e) => {
                    e.stopPropagation();
                    handleTogglePageBookmark(pageFlipIndex);
                  }}
                  title={savedBookmark === pageFlipIndex ? 'Remove bookmark' : 'Bookmark this page'}
                >
                  {savedBookmark === pageFlipIndex ? '🔖' : '📑'}
                </button>
              </div>
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
          {#if savedBookmark === story.pages.length + 3}
            <div
              class="reading-bookmark-ribbon"
              role="button"
              tabindex="0"
              onclick={(e) => {
                e.stopPropagation();
                handleTogglePageBookmark(story.pages.length + 3);
              }}
              onkeydown={(e) => {
                if (e.key === 'Enter') {
                  e.stopPropagation();
                  handleTogglePageBookmark(story.pages.length + 3);
                }
              }}
              title="Bookmarked! Click to remove bookmark"
            >
              <span>🔖</span>
            </div>
          {/if}
          <div class="reading-page-header">
            <span>Epilogue</span>
            <div style="display:flex;align-items:center;gap:8px;">
              <span>Reflection &amp; Moral</span>
              <button
                type="button"
                class="reading-page-bm-btn"
                onclick={(e) => {
                  e.stopPropagation();
                  handleTogglePageBookmark(story.pages.length + 3);
                }}
                title={savedBookmark === story.pages.length + 3 ? 'Remove bookmark' : 'Bookmark this page'}
              >
                {savedBookmark === story.pages.length + 3 ? '🔖' : '📑'}
              </button>
            </div>
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

            <div style="background:#f1f5f9;border-radius:8px;padding:10px;font-size:11px;color:#475569;text-align:center;margin-bottom:12px;">
              🎉 <strong>Congratulations!</strong> You finished reading <em>{story.title}</em>!
            </div>

            <div style="text-align:center;">
              <button
                type="button"
                class="reading-tool-btn active"
                onclick={(e) => {
                  e.stopPropagation();
                  flipTo(0);
                }}
                style="padding:8px 16px;font-size:12px;display:inline-flex;align-items:center;gap:6px;"
              >
                ↺ Re-read from Cover
              </button>
            </div>
          </div>

          <div class="reading-page-footer">
            <span>Epilogue</span>
            <span>End of Story</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
