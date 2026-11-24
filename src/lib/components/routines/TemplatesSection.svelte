<script>
  import { onMount } from 'svelte';
  import { playPageFlipSound } from '$lib/utils/audioRustle.js';

  // Story & Recipe Book Data
  const stories = [
    {
      id: 'story_cocoa_puffs',
      title: 'High Protein Cocoa Puffs',
      subtitle: 'with chocolate & oats (Air Fryer)',
      category: 'BREAKFAST · AIR FRYER',
      icon: '🥣',
      icon3d: '/icons/bowl_3d.png?v=3',
      image: '/cocoa_puffs_dish.jpg?v=2',
      meta: [
        { icon: '🥄', label: 'PREP', val: '5 minutes' },
        { icon: '♨️', label: 'COOK', val: '21 minutes' },
        { icon: '⏱️', label: 'TOTAL', val: '26 minutes' },
        { icon: '🌡️', label: 'TEMP', val: '170°C' },
        { icon: '👥', label: 'SERVES', val: '2' },
        { icon: '⚡', label: 'LEVEL', val: 'easy' }
      ],
      videoUrl: 'https://youtube.com/shorts/9lQzND2xMHI?si=I4wVNhgw5gq5ng1o',
      ingredients: [
        { name: 'Oat flour', qty: '45–50 g' },
        { name: 'Cocoa powder', qty: '20–25 g' },
        { name: 'Protein powder', qty: '35–40 g' },
        { name: 'Brown sugar', qty: '20–25 g (2 tbsp)' },
        { name: 'Baking soda', qty: '5 g (1 tsp)' },
        { name: 'Instant coffee powder', qty: '2–4 g (1 to 2 tsp)' },
        { name: 'Milk', qty: '75–90 g (5 to 6 tbsp)' }
      ],
      steps: [
        'In a mixing bowl, combine oat flour, cocoa powder, protein powder, brown sugar, baking soda, and instant coffee powder. Whisk thoroughly.',
        'Gradually add milk (5 to 6 tbsp), stirring until a soft, pliable chocolate dough forms.',
        'Pinch small pieces of dough and roll them into miniature balls (puffs) with your palms.',
        'Arrange puffs in the air fryer basket in a single layer. Air fry at 170°C for 21 minutes until crispy and crunchy. Let cool, serve with fresh milk or yogurt!'
      ],
      storyNote:
        'A delightful healthy morning breakfast story: waking up early, smelling toasted oats and rich chocolate aroma filling the kitchen, making healthy eating joyful and energetic.'
    },
    {
      id: 'story_vanilla_cake',
      title: 'Vanilla Egg Sponge Cake',
      subtitle: 'Air Fryer & Stovepot Method',
      category: 'BAKING · AIR FRYER / STOVE',
      icon: '🍰',
      icon3d: '/icons/cake_3d.png?v=3',
      image: '/vanilla_egg_cake.jpg',
      meta: [
        { icon: '🥄', label: 'PREP', val: '10 minutes' },
        { icon: '♨️', label: 'COOK', val: '25–35 min' },
        { icon: '⏱️', label: 'TOTAL', val: '35–45 min' },
        { icon: '🌡️', label: 'TEMP', val: '150°C–160°C' },
        { icon: '👥', label: 'SERVES', val: '4' },
        { icon: '⚡', label: 'LEVEL', val: 'easy' }
      ],
      videoUrl: 'https://youtu.be/rxc8d4dWics?si=yoFZiTJZJfWTM',
      ingredients: [
        { name: 'All-purpose flour', qty: '60–65 g' },
        { name: 'Sugar', qty: '50 g' },
        { name: 'Neutral oil or butter', qty: '40 g' },
        { name: 'Eggs (whisked)', qty: '100 g (2 eggs)' },
        { name: 'Eno (unflavored)', qty: '2 g (½ tsp)' },
        { name: 'Salt', qty: '1 g' },
        { name: 'Vanilla extract', qty: '3–5 g' },
        { name: 'Milk', qty: '10 ml' }
      ],
      steps: [
        'Whisk eggs, sugar, oil/butter & vanilla until light, frothy, and pale yellow.',
        'Sift in flour, salt, milk & Eno (½ tsp replaces baking powder); fold gently into a silky smooth batter.',
        'Air Fryer: Preheat at 160°C (3–5 min). Bake at 150°C–160°C for 20–25 min until a toothpick inserted in center comes out clean.',
        'Stove Method: Preheat heavy pot on low for 10 min. Place batter tin inside, cover tight with lid, and bake on lowest flame 35–45 min.',
        'Cool completely before slicing. Enjoy with a cup of warm afternoon tea!'
      ],
      storyNote:
        'The aroma of sweet vanilla brings back warm memories of family afternoons, where simple ingredients turn into a tender, golden sponge cake shared with loved ones.'
    }
  ];

  let currentStoryIndex = $state(0);
  let currentPage = $state(1); // 1 = Left page, 2 = Right page (on mobile), or Spread 1 on desktop
  let isSoundEnabled = $state(true);
  let isFullscreen = $state(false);
  let bookWrapper = $state(null);
  let show3dSpotlight = $state(false);

  const currentStory = $derived(stories[currentStoryIndex] || stories[0]);
  const totalPages = $derived(stories.length * 2);

  function selectStory(idx) {
    currentStoryIndex = idx;
    currentPage = 1;
    playPageFlipSound(isSoundEnabled);
  }

  function nextPage() {
    if (currentPage < 2) {
      currentPage = 2;
      playPageFlipSound(isSoundEnabled);
    } else if (currentStoryIndex < stories.length - 1) {
      currentStoryIndex++;
      currentPage = 1;
      playPageFlipSound(isSoundEnabled);
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      currentPage = 1;
      playPageFlipSound(isSoundEnabled);
    } else if (currentStoryIndex > 0) {
      currentStoryIndex--;
      currentPage = 2;
      playPageFlipSound(isSoundEnabled);
    }
  }

  function toggleFullscreen() {
    isFullscreen = !isFullscreen;
  }

  function copyText(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('Content copied to clipboard! 📋');
    }
  }

  function handlePageClick(event) {
    if (event.target.closest('button, a, input, select, textarea')) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    if (clickX < rect.width / 2) {
      prevPage();
    } else {
      nextPage();
    }
  }
</script>

<div class="tab-content active" id="tab-templates" style="display: block;">
  <!-- Section Title Badge -->
  <div
    class="section-title"
    style="background: #fef3c7; color: #92400e; border-color: #f59e0b;"
  >
    <span><span>🍳</span> MY TRIED RECIPES</span>
  </div>

  <!-- Story Selector Pills Strip -->
  <div
    style="display: flex; gap: 8px; margin-bottom: 14px; overflow-x: auto; padding-bottom: 4px; -webkit-overflow-scrolling: touch;"
  >
    {#each stories as s, idx}
      <button
        type="button"
        onclick={() => selectStory(idx)}
        style="padding: 7px 16px; border-radius: 999px; font-size: 12.5px; font-weight: 800; cursor: pointer; white-space: nowrap; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s ease; {currentStoryIndex === idx ? 'background: #f59e0b; color: #18181b; border: 2px solid var(--ink); box-shadow: 0 2px 0 var(--ink);' : 'background: #ffffff; color: #475569; border: 1.5px solid #cbd5e1;'}"
      >
        <span>{s.icon}</span>
        <span>{s.title}</span>
      </button>
    {/each}
  </div>

  <!-- Interactive 3D Book Container -->
  <div
    bind:this={bookWrapper}
    class="template-flipbook-section"
    style="width: 100%; position: relative; {isFullscreen ? 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 99999; background: #262626; padding: 20px; box-sizing: border-box; overflow-y: auto;' : ''}"
  >
    <div
      class="pdf-viewer-card"
      id="templateViewerCard"
      style="border-radius: 18px; border: 2px solid var(--ink); box-shadow: 0 5px 0 var(--ink); background: #fdfbf7; position: relative; overflow: hidden; width: 100%; max-width: 580px; margin: 0 auto;"
    >
      <!-- Floating Fullscreen Button -->
      <button
        type="button"
        class="template-floating-fullscreen-btn"
        onclick={toggleFullscreen}
        title="Toggle Fullscreen"
        style="position: absolute; top: 12px; right: 12px; z-index: 10; width: 34px; height: 34px; border-radius: 8px; background: rgba(255,255,255,0.9); border: 1.5px solid var(--ink); font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 0 var(--ink);"
      >
        {isFullscreen ? '✕' : '⛶'}
      </button>

      <!-- Single Page Book Layout with Left/Right Click Turning -->
      <div
        class="book-spread-container"
        onclick={handlePageClick}
        style="min-height: 650px; background: linear-gradient(175deg, #ffffff 0%, #fdfbf7 55%, #f9f4ea 100%); position: relative; cursor: pointer; display: flex; flex-direction: column;"
      >
        {#if currentPage === 1}
          <!-- PAGE 1: Overview, Photo, Meta Stats -->
          <div
            class="template-page-item template-page-left"
            style="padding: clamp(16px, 2.5vw, 24px); display: flex !important; flex-direction: column !important; justify-content: space-between !important; min-height: 650px; width: 100%; box-sizing: border-box; flex: 1 1 auto;"
          >
            <div style="display: flex; flex-direction: column; flex: 1 1 auto;">
              <!-- Top Bar with 3D Animated Icon and Small Box Action Buttons (Copy & Video) -->
              <div class="cb-top-bar" style="margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center; gap: 8px;">
                <div
                  class="cb-icon-3d-wrap"
                  role="button"
                  tabindex="0"
                  onclick={(e) => {
                    e.stopPropagation();
                    show3dSpotlight = true;
                  }}
                  onkeydown={(e) => {
                    if (e.key === 'Enter') {
                      e.stopPropagation();
                      show3dSpotlight = true;
                    }
                  }}
                  title="Click to view dish upfront on screen"
                >
                  <div class="cb-icon-sheen"></div>
                  <span class="cb-sparkle cb-sparkle-1">✨</span>
                  <span class="cb-sparkle cb-sparkle-2">✦</span>
                  {#if currentStory.icon3d}
                    <img
                      src={currentStory.icon3d}
                      alt={currentStory.title}
                      class="cb-icon-3d-anim"
                    />
                  {:else}
                    <span style="font-size: 22px;">{currentStory.icon}</span>
                  {/if}
                </div>
                <div style="display: flex; gap: 6px; align-items: center;">
                  <button
                    type="button"
                    class="cb-copy-small-btn"
                    onclick={(e) => {
                      e.stopPropagation();
                      copyText(
                        currentStory.title +
                          (currentStory.subtitle ? ' - ' + currentStory.subtitle : '') +
                          '\n\nIngredients:\n' +
                          (currentStory.ingredients
                            ? currentStory.ingredients.map((i) => '• ' + i.name + ': ' + i.qty).join('\n')
                            : '') +
                          '\n\nPreparation:\n' +
                          (currentStory.steps ? currentStory.steps.map((st, i) => `${i + 1}. ${st}`).join('\n') : '')
                      );
                    }}
                    style="width: 28px; height: 28px; background: #ffffff; border: 1.5px solid var(--ink); border-radius: 8px; font-size: 14px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 1.5px 0 var(--ink); box-sizing: border-box; padding: 0;"
                    title="Copy Recipe"
                  >
                    <span>📋</span>
                  </button>
                  {#if currentStory.videoUrl}
                    <a
                      href={currentStory.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onclick={(e) => e.stopPropagation()}
                      style="width: 28px; height: 28px; background: #fee2e2; color: #dc2626; border: 1.5px solid #f87171; border-radius: 8px; font-size: 13px; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 1.5px 0 #f87171; box-sizing: border-box; padding: 0;"
                      title="Watch Video"
                    >
                      <span>▶️</span>
                    </a>
                  {/if}
                </div>
              </div>

              <!-- Title & Subtitle -->
              <div class="cb-header-block" style="margin: 4px 0 8px;">
                <h2 class="cb-title" style="font-size: clamp(20px, 3vw, 24px); font-weight: 900; line-height: 1.2; color: #1c1917; margin: 0;">
                  {currentStory.title}
                </h2>
                {#if currentStory.subtitle}
                  <div class="cb-subtitle" style="font-size: 13.5px; color: #78716c; margin-top: 3px; font-style: italic;">
                    {currentStory.subtitle}
                  </div>
                {/if}
              </div>

              <div class="cb-divider-line" style="height: 1.5px; background: #e7e5e4; margin: 8px 0 12px;"></div>

              <!-- Meta Stats Strip -->
              {#if currentStory.meta && currentStory.meta.length}
                <div
                  class="cb-meta-strip"
                  style="display: flex; justify-content: space-between; background: #fafaf9; border: 1px solid #e7e5e4; border-radius: 10px; padding: 8px 6px; margin-bottom: 14px;"
                >
                  {#each currentStory.meta as m}
                    <div class="cb-meta-cell" style="flex: 1; text-align: center; border-right: 1px dashed #e7e5e4;">
                      <div style="font-size: 13px;">{m.icon}</div>
                      <div style="font-size: 8.5px; font-weight: 800; color: #a8a29e; text-transform: uppercase; margin-top: 1px;">
                        {m.label}
                      </div>
                      <div style="font-size: 11px; font-weight: 800; color: #292524;">
                        {m.val}
                      </div>
                    </div>
                  {/each}
                </div>
              {/if}

              <!-- Story Artwork / Photo (if image exists) -->
              {#if currentStory.image}
                <div
                  class="cb-plate-wrap"
                  style="flex: 1 1 auto; display: flex; justify-content: center; align-items: center; margin: 10px 0; min-height: 280px; max-height: 380px; overflow: hidden; border-radius: 14px;"
                >
                  <img
                    src={currentStory.image}
                    alt={currentStory.title}
                    class="cb-plate-img"
                    loading="eager"
                    decoding="async"
                    style="width: 100%; height: 100%; min-height: 280px; max-height: 380px; object-fit: cover; object-position: center; border-radius: 14px; border: 1.5px solid #e7e5e4; box-shadow: 0 4px 12px rgba(0,0,0,0.08); image-rendering: -webkit-optimize-contrast;"
                  />
                </div>
              {/if}
            </div>

            <!-- Left Page Footer -->
            <div
              style="display: flex; justify-content: space-between; align-items: center; font-size: 11.5px; color: #a8a29e; font-weight: 700; margin-top: 14px; border-top: 1px solid #f5f5f4; padding-top: 8px; flex-shrink: 0;"
            >
              <span>My Tried Recipe</span>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 999px; font-weight: 800; font-size: 11px;">
                  Page 1 of 2
                </span>
              </div>
            </div>
          </div>
        {:else}
          <!-- PAGE 2: Ingredients & Preparation -->
          <div
            class="template-page-item template-page-right"
            style="padding: clamp(16px, 2.5vw, 24px); display: flex !important; flex-direction: column !important; justify-content: space-between !important; min-height: 650px; width: 100%; box-sizing: border-box; flex: 1 1 auto;"
          >
            <div style="display: flex; flex-direction: column; flex: 1 1 auto;">
              <!-- Top Bar on Page 2 -->
              <div class="cb-top-bar" style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; gap: 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <button
                    type="button"
                    onclick={(e) => { e.stopPropagation(); prevPage(); }}
                    style="background: #ffffff; border: 1.5px solid var(--ink); border-radius: 8px; padding: 3px 8px; font-size: 11px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 3px; box-shadow: 0 1px 0 var(--ink);"
                    title="Back to Photo"
                  >
                    <span>◀</span> Photo
                  </button>
                  <span style="font-size: 13px; font-weight: 800; color: #1c1917;">
                    {currentStory.title}
                  </span>
                </div>
                <div style="display: flex; gap: 6px; align-items: center;">
                  <button
                    type="button"
                    class="cb-copy-small-btn"
                    onclick={(e) => {
                      e.stopPropagation();
                      copyText(
                        currentStory.title +
                          (currentStory.subtitle ? ' - ' + currentStory.subtitle : '') +
                          '\n\nIngredients:\n' +
                          (currentStory.ingredients
                            ? currentStory.ingredients.map((i) => '• ' + i.name + ': ' + i.qty).join('\n')
                            : '') +
                          '\n\nPreparation:\n' +
                          (currentStory.steps ? currentStory.steps.map((st, i) => `${i + 1}. ${st}`).join('\n') : '')
                      );
                    }}
                    style="width: 28px; height: 28px; background: #ffffff; border: 1.5px solid var(--ink); border-radius: 8px; font-size: 14px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 1.5px 0 var(--ink); box-sizing: border-box; padding: 0;"
                    title="Copy Recipe"
                  >
                    <span>📋</span>
                  </button>
                  {#if currentStory.videoUrl}
                    <a
                      href={currentStory.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onclick={(e) => e.stopPropagation()}
                      style="width: 28px; height: 28px; background: #fee2e2; color: #dc2626; border: 1.5px solid #f87171; border-radius: 8px; font-size: 13px; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 1.5px 0 #f87171; box-sizing: border-box; padding: 0;"
                      title="Watch Video"
                    >
                      <span>▶️</span>
                    </a>
                  {/if}
                </div>
              </div>

              {#if currentStory.ingredients}
                <!-- Ingredients List -->
                <div class="cb-section-heading" style="font-size: 15px; font-weight: 800; color: #292524; margin-bottom: 8px; border-bottom: 1px solid #e7e5e4; padding-bottom: 4px;">
                  Ingredients
                </div>
                <div class="cb-ingredients-list" style="display: flex; flex-direction: column; gap: 4px; margin-bottom: 16px;">
                  {#each currentStory.ingredients as ing}
                    <div class="cb-ing-row" style="display: flex; justify-content: space-between; font-size: 12.5px; border-bottom: 1px dashed #f5f5f4; padding-bottom: 3px;">
                      <span class="cb-ing-name" style="font-weight: 700; color: #44403c;">{ing.name}</span>
                      <span class="cb-ing-qty" style="color: #78716c; font-weight: 600;">{ing.qty}</span>
                    </div>
                  {/each}
                </div>

                <!-- Preparation Steps -->
                <div class="cb-section-heading" style="font-size: 15px; font-weight: 800; color: #292524; margin-bottom: 8px; border-bottom: 1px solid #e7e5e4; padding-bottom: 4px;">
                  Preparation
                </div>
                <div class="cb-steps-list" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
                  {#each currentStory.steps as step, sIdx}
                    <div class="cb-step-row" style="display: flex; gap: 8px; font-size: 12.5px; line-height: 1.45; color: #44403c;">
                      <span class="cb-step-num" style="font-weight: 800; color: #d97706;">{sIdx + 1}.</span>
                      <span class="cb-step-text">{step}</span>
                    </div>
                  {/each}
                </div>
              {/if}
            </div>

            <!-- Right Page Footer -->
            <div
              style="display: flex; justify-content: space-between; align-items: center; font-size: 11.5px; color: #a8a29e; font-weight: 700; margin-top: 14px; border-top: 1px solid #f5f5f4; padding-top: 8px; flex-shrink: 0;"
            >
              <span>My Tried Recipe</span>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 999px; font-weight: 800; font-size: 11px;">
                  Page 2 of 2
                </span>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>

  {#if show3dSpotlight}
    <!-- Upfront 3D Screen Spotlight Overlay -->
    <div
      class="upfront-3d-backdrop"
      onclick={() => (show3dSpotlight = false)}
      onkeydown={(e) => { if (e.key === 'Escape') show3dSpotlight = false; }}
      role="dialog"
      aria-modal="true"
      tabindex="-1"
    >
      <div
        class="upfront-3d-card"
        onclick={(e) => e.stopPropagation()}
        onkeydown={(e) => e.stopPropagation()}
        role="document"
        tabindex="0"
      >
        <!-- Close Button -->
        <button
          type="button"
          class="upfront-close-btn"
          onclick={() => (show3dSpotlight = false)}
          title="Close 3D View"
        >
          ✕
        </button>

        <!-- Upfront Floating 3D Graphic -->
        <div class="upfront-stage">
          <div class="upfront-glow-halo"></div>
          <span class="upfront-sparkle s1">✨</span>
          <span class="upfront-sparkle s2">🌟</span>
          <span class="upfront-sparkle s3">✦</span>
          <span class="upfront-sparkle s4">✨</span>

          {#if currentStory.icon3d}
            <img
              src={currentStory.icon3d}
              alt={currentStory.title}
              class="upfront-3d-model"
            />
          {:else}
            <span style="font-size: 80px;">{currentStory.icon}</span>
          {/if}
        </div>

        <!-- Dish Title & Category -->
        <div class="upfront-title">{currentStory.title}</div>
        <div class="upfront-subtitle">{currentStory.category}</div>

        <button
          type="button"
          class="upfront-done-btn"
          onclick={() => (show3dSpotlight = false)}
        >
          Close View
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  /* 3D Icon Wrap with Breathing Ambient Glow and 3D Card Depth */
  :global(.cb-icon-3d-wrap) {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: radial-gradient(circle at 30% 25%, #ffffff 0%, #fffbeb 60%, #fef3c7 100%);
    border: 2px solid var(--ink);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 14px rgba(245, 158, 11, 0.25), 0 2.5px 0 var(--ink);
    perspective: 400px;
    position: relative;
    overflow: visible;
    flex-shrink: 0;
    cursor: pointer;
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
    animation: badgeGlow 3.5s ease-in-out infinite;
  }
  :global(.cb-icon-3d-wrap:hover) {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 8px 20px rgba(245, 158, 11, 0.4), 0 3px 0 var(--ink);
  }
  :global(.cb-icon-3d-wrap:active) {
    transform: translateY(1px) scale(0.96);
    box-shadow: 0 2px 6px rgba(245, 158, 11, 0.3), 0 1px 0 var(--ink);
  }

  /* Shimmer light beam across the badge */
  :global(.cb-icon-sheen) {
    position: absolute;
    inset: 0;
    border-radius: 12px;
    background: linear-gradient(115deg, transparent 20%, rgba(255, 255, 255, 0.7) 48%, rgba(255, 255, 255, 0.9) 52%, transparent 75%);
    background-size: 250% 250%;
    animation: sheenSweep 4s ease-in-out infinite;
    pointer-events: none;
    mix-blend-mode: overlay;
    z-index: 1;
  }

  @keyframes sheenSweep {
    0%, 20% {
      background-position: 150% 150%;
      opacity: 0;
    }
    30% {
      opacity: 1;
    }
    50%, 100% {
      background-position: -50% -50%;
      opacity: 0;
    }
  }

  @keyframes badgeGlow {
    0%, 100% {
      box-shadow: 0 3px 10px rgba(245, 158, 11, 0.2), 0 2px 0 var(--ink);
    }
    50% {
      box-shadow: 0 6px 18px rgba(245, 158, 11, 0.45), 0 2.5px 0 var(--ink);
    }
  }

  /* True 3D Multi-Axis Gyro Floating Animation */
  @keyframes float3dFull {
    0%, 100% {
      transform: perspective(300px) translateY(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1);
    }
    25% {
      transform: perspective(300px) translateY(-4px) rotateX(8deg) rotateY(12deg) rotateZ(2deg) scale(1.08);
    }
    50% {
      transform: perspective(300px) translateY(-1px) rotateX(-5deg) rotateY(-8deg) rotateZ(-2deg) scale(1.03);
    }
    75% {
      transform: perspective(300px) translateY(-5px) rotateX(6deg) rotateY(-10deg) rotateZ(3deg) scale(1.1);
    }
  }

  :global(.cb-icon-3d-anim) {
    width: 38px;
    height: 38px;
    object-fit: contain;
    pointer-events: none;
    image-rendering: -webkit-optimize-contrast;
    animation: float3dFull 3.2s ease-in-out infinite;
    display: inline-block;
    transform-origin: center center;
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.25s ease;
    will-change: transform;
    z-index: 2;
    position: relative;
  }

  :global(.cb-icon-3d-wrap:hover .cb-icon-3d-anim) {
    transform: perspective(300px) scale(1.22) rotateY(22deg) rotateX(8deg) translateY(-2px);
    filter: brightness(1.08) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15));
  }

  /* Twinkling Micro Sparkles */
  :global(.cb-sparkle) {
    position: absolute;
    pointer-events: none;
    font-size: 11px;
    line-height: 1;
    z-index: 3;
    animation: twinkleSparkle 2.6s ease-in-out infinite;
  }
  :global(.cb-sparkle-1) {
    top: -5px;
    right: -4px;
    color: #f59e0b;
    animation-delay: 0.3s;
  }
  :global(.cb-sparkle-2) {
    bottom: -2px;
    left: -4px;
    color: #fbbf24;
    font-size: 9px;
    animation-delay: 1.4s;
  }

  @keyframes twinkleSparkle {
    0%, 100% {
      transform: scale(0) rotate(0deg);
      opacity: 0;
    }
    40% {
      transform: scale(1.2) rotate(45deg);
      opacity: 1;
    }
    70% {
      transform: scale(0.8) rotate(90deg);
      opacity: 0.8;
    }
    85% {
      transform: scale(0) rotate(120deg);
      opacity: 0;
    }
  }

  :global(.cb-copy-small-btn:hover) {
    background: #f5f5f4 !important;
    transform: translateY(-1px);
  }
  :global(.cb-copy-small-btn:active) {
    transform: translateY(1px);
  }

  /* Upfront 3D Screen Spotlight Overlay */
  :global(.upfront-3d-backdrop) {
    position: fixed;
    inset: 0;
    z-index: 999999;
    background: rgba(20, 16, 12, 0.72);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: upfrontFadeIn 0.25s ease-out;
  }

  @keyframes upfrontFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  :global(.upfront-3d-card) {
    background: radial-gradient(circle at 50% 25%, #ffffff 0%, #fffbeb 55%, #fef3c7 100%);
    border: 2.5px solid var(--ink);
    border-radius: 24px;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.45), 0 6px 0 var(--ink);
    padding: 32px 24px 24px;
    text-align: center;
    max-width: 320px;
    width: 100%;
    position: relative;
    animation: upfrontPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes upfrontPop {
    from {
      transform: scale(0.7) translateY(30px);
      opacity: 0;
    }
    to {
      transform: scale(1) translateY(0);
      opacity: 1;
    }
  }

  :global(.upfront-close-btn) {
    position: absolute;
    top: 14px;
    right: 14px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #ffffff;
    border: 1.5px solid var(--ink);
    font-size: 14px;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 0 var(--ink);
    transition: all 0.15s ease;
  }
  :global(.upfront-close-btn:hover) {
    background: #fee2e2;
    color: #dc2626;
    transform: scale(1.1);
  }

  :global(.upfront-stage) {
    position: relative;
    width: 160px;
    height: 160px;
    margin: 0 auto 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :global(.upfront-glow-halo) {
    position: absolute;
    width: 130px;
    height: 130px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, transparent 70%);
    filter: blur(10px);
    animation: haloPulse 3s ease-in-out infinite;
  }

  @keyframes haloPulse {
    0%, 100% {
      transform: scale(0.9);
      opacity: 0.6;
    }
    50% {
      transform: scale(1.2);
      opacity: 1;
    }
  }

  :global(.upfront-3d-model) {
    width: 130px;
    height: 130px;
    object-fit: contain;
    animation: upfrontSpinFloat 4s ease-in-out infinite;
    filter: drop-shadow(0 14px 20px rgba(0, 0, 0, 0.22));
    position: relative;
    z-index: 2;
    pointer-events: none;
    image-rendering: -webkit-optimize-contrast;
  }

  @keyframes upfrontSpinFloat {
    0%, 100% {
      transform: perspective(600px) translateY(0px) rotateX(12deg) rotateY(0deg) scale(1);
    }
    25% {
      transform: perspective(600px) translateY(-12px) rotateX(20deg) rotateY(26deg) scale(1.12);
    }
    50% {
      transform: perspective(600px) translateY(-3px) rotateX(6deg) rotateY(-18deg) scale(1.05);
    }
    75% {
      transform: perspective(600px) translateY(-14px) rotateX(15deg) rotateY(-28deg) scale(1.14);
    }
  }

  :global(.upfront-sparkle) {
    position: absolute;
    pointer-events: none;
    z-index: 3;
    animation: upfrontSparkleTwinkle 2.5s ease-in-out infinite;
  }
  :global(.upfront-sparkle.s1) {
    top: 5px;
    right: 15px;
    font-size: 16px;
    color: #f59e0b;
    animation-delay: 0.2s;
  }
  :global(.upfront-sparkle.s2) {
    bottom: 15px;
    left: 10px;
    font-size: 14px;
    color: #fbbf24;
    animation-delay: 1.1s;
  }
  :global(.upfront-sparkle.s3) {
    top: 30px;
    left: 10px;
    font-size: 13px;
    color: #f59e0b;
    animation-delay: 1.8s;
  }
  :global(.upfront-sparkle.s4) {
    bottom: 25px;
    right: 8px;
    font-size: 15px;
    color: #fbbf24;
    animation-delay: 0.7s;
  }

  @keyframes upfrontSparkleTwinkle {
    0%, 100% {
      transform: scale(0) rotate(0deg);
      opacity: 0;
    }
    50% {
      transform: scale(1.3) rotate(90deg);
      opacity: 1;
    }
  }

  :global(.upfront-title) {
    font-size: 18px;
    font-weight: 900;
    color: #1c1917;
    margin-bottom: 4px;
  }
  :global(.upfront-subtitle) {
    font-size: 12px;
    font-weight: 700;
    color: #92400e;
    margin-bottom: 20px;
  }
  :global(.upfront-done-btn) {
    background: #18181b;
    color: #ffffff;
    border: 2px solid var(--ink);
    border-radius: 999px;
    padding: 8px 24px;
    font-size: 12.5px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 2px 0 var(--ink);
    transition: all 0.15s ease;
  }
  :global(.upfront-done-btn:hover) {
    background: #d97706;
    transform: translateY(-1px);
  }
</style>
