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
      image: '/cocoa_puffs_dish.jpg',
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
    },
    {
      id: 'story_lion_mouse',
      title: 'The Lion and the Clever Mouse',
      subtitle: 'An Aesop Fable on Kindness & Mercy',
      category: 'ENGLISH FABLE · MORAL STORY',
      icon: '🦁',
      image: '',
      meta: [
        { icon: '⏱️', label: 'READ', val: '3 minutes' },
        { icon: '📚', label: 'LEVEL', val: 'B1 English' },
        { icon: '💡', label: 'MORAL', val: 'Kindness' },
        { icon: '🎯', label: 'TOPIC', val: 'Friendship' }
      ],
      videoUrl: '',
      storyText: [
        'Once upon a time in a dense green forest, a mighty lion was taking a nap beneath the shade of an acacia tree. A little playful mouse scampered across the grass and accidentally ran across the sleeping lion’s paw, tickling his whiskers.',
        'Awoken with a sudden roar, the lion trapped the tiny creature beneath his massive claws. "How dare you wake the king of beasts!" the lion growled, opening his jaws.',
        '"Forgive me, O Great King!" pleaded the trembling mouse. "Spare my life, and I promise that one day I might be able to help you in return!" The lion burst into deep laughter at the thought that such a tiny mouse could ever help him, but feeling generous, he lifted his paw and let the mouse scurry away into the bushes.',
        'A few weeks later, hunters entered the jungle and cast a strong rope net. While hunting for prey, the lion stepped into the trap and was hoisted into the air. He roared loudly in frustration, unable to break the thick ropes.',
        'Hearing the familiar roar, the little mouse hurried to the scene. Without hesitating, the mouse used his sharp little teeth to gnaw through the thick netting cords one by one. Before long, a hole large enough for the lion was made, and the great beast slipped free onto the forest floor.',
        'The lion bowed his great mane respectfully. "You laughed when I promised to help," whispered the mouse with a smile, "but even the smallest creature can prove to be of the greatest help."'
      ],
      vocabulary: [
        { word: 'Scampered', meaning: 'Ran with quick, light steps' },
        { word: 'Mighty', meaning: 'Possessing immense power and strength' },
        { word: 'Generous', meaning: 'Showing readiness to give or forgive freely' },
        { word: 'Gnaw', meaning: 'Bite or nibble persistently' }
      ],
      moral: 'No act of kindness, no matter how small, is ever wasted. True friends come in all sizes.'
    },
    {
      id: 'story_king_midas',
      title: 'The Golden Touch of King Midas',
      subtitle: 'A Tale of Greed, Wisdom & Contentment',
      category: 'CLASSIC TALE · B2 ENGLISH',
      icon: '👑',
      image: '',
      meta: [
        { icon: '⏱️', label: 'READ', val: '4 minutes' },
        { icon: '📚', label: 'LEVEL', val: 'B2 English' },
        { icon: '💡', label: 'MORAL', val: 'Contentment' },
        { icon: '💰', label: 'TOPIC', val: 'True Wealth' }
      ],
      videoUrl: '',
      storyText: [
        'King Midas ruled over a prosperous kingdom, yet his heart was consumed by an insatiable craving for gold. Despite possessing grand treasuries filled with jewels, he believed true happiness could only be achieved if everything around him were pure gold.',
        'One evening, an angel granted him a mysterious boon in recognition of his royal hospitality: whatever he touched would instantly transform into glistening gold. Midas leapt with joy.',
        'He reached out and touched an oak branch; immediately, the leaves turned into heavy, shining gold. He touched a ripe apple, and it froze into solid golden fruit. Overjoyed, he ordered a magnificent feast to celebrate his miraculous fortune.',
        'However, when Midas lifted a goblet of water to his parched lips, the liquid turned into cold solid gold before he could swallow a single drop. When he took a piece of bread, it hardened into dense gold between his teeth. He was starving amidst unimaginable luxury.',
        'Just then, his beloved young daughter rushed into the banquet hall to comfort her weeping father. Overcome with grief, Midas embraced her tightly—and in that terrifying instant, she transformed into a lifeless, silent golden statue.',
        'Horrified and weeping bitter tears of repentance, Midas fell to his knees and begged for the curse to be lifted. "Take away all my gold!" he cried. "Return my child and give me simple bread and clean water!" Pitying his sincere remorse, the angel told him to wash his hands in the sacred river Pactolus, washing away the golden touch and restoring his daughter to warm, breathing life.'
      ],
      vocabulary: [
        { word: 'Insatiable', meaning: 'Impossible to satisfy or appease' },
        { word: 'Boon', meaning: 'A beneficial favor, gift, or blessing' },
        { word: 'Parched', meaning: 'Extremely thirsty or dry' },
        { word: 'Repentance', meaning: 'Sincere regret or remorse for one’s actions' }
      ],
      moral: 'Greed blinds us to the real treasures of life: health, family, love, and contentment with what we have.'
    }
  ];

  let currentStoryIndex = $state(0);
  let currentPage = $state(1); // 1 = Left page, 2 = Right page (on mobile), or Spread 1 on desktop
  let isSoundEnabled = $state(true);
  let isFullscreen = $state(false);
  let bookWrapper = $state(null);

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
</script>

<div class="tab-content active" id="tab-templates" style="display: block;">
  <!-- Section Title Badge -->
  <div
    class="section-title"
    style="background: #fef3c7; color: #92400e; border-color: #f59e0b; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;"
  >
    <span><span>📖</span> ENGLISH STORIES BOOK</span>
    <div style="display: flex; align-items: center; gap: 6px;">
      <button
        type="button"
        onclick={() => (isSoundEnabled = !isSoundEnabled)}
        style="background: #ffffff; border: 1.5px solid #d97706; border-radius: 999px; padding: 3px 10px; font-size: 11.5px; font-weight: 800; color: #92400e; cursor: pointer;"
        title="Toggle Page Flip Sound"
      >
        {isSoundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF'}
      </button>
    </div>
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
      style="border-radius: 18px; border: 2px solid var(--ink); box-shadow: 0 5px 0 var(--ink); background: #fdfbf7; position: relative; overflow: hidden;"
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

      <!-- Dual-Page Spread Book Layout (Responsive: 2-page spread on desktop, 1 page on mobile) -->
      <div
        class="book-spread-container"
        style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr)); min-height: 520px; background: linear-gradient(175deg, #ffffff 0%, #fdfbf7 55%, #f9f4ea 100%); position: relative;"
      >
        <!-- LEFT PAGE -->
        <div
          class="template-page-item template-page-left"
          style="padding: clamp(16px, 2.5vw, 24px); border-right: 1.5px solid #ebe5df; display: flex; flex-direction: column; justify-content: space-between;"
        >
          <div>
            <!-- Top Bar -->
            <div class="cb-top-bar" style="margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
              <div class="cb-icon-circle" style="font-size: 20px;">
                <span>{currentStory.icon}</span>
              </div>
              <div
                class="cb-top-category"
                style="font-size: 10.5px; font-weight: 800; letter-spacing: 0.8px; color: #78716c; text-transform: uppercase;"
              >
                {currentStory.category}
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
                style="display: flex; justify-content: center; align-items: center; margin: 10px 0;"
              >
                <img
                  src={currentStory.image}
                  alt={currentStory.title}
                  class="cb-plate-img"
                  style="width: 100%; max-height: 280px; object-fit: cover; border-radius: 14px; border: 1.5px solid #e7e5e4; box-shadow: 0 4px 12px rgba(0,0,0,0.08);"
                />
              </div>
            {:else if currentStory.storyText}
              <!-- For text stories: Beginning paragraphs on Left Page -->
              <div style="font-size: 14px; line-height: 1.7; color: #334155; font-family: 'Georgia', serif;">
                <p style="margin-bottom: 12px; font-size: 15px; font-weight: 500;">
                  {currentStory.storyText[0]}
                </p>
                {#if currentStory.storyText[1]}
                  <p style="margin-bottom: 12px;">
                    {currentStory.storyText[1]}
                  </p>
                {/if}
                {#if currentStory.storyText[2]}
                  <p style="margin-bottom: 12px;">
                    {currentStory.storyText[2]}
                  </p>
                {/if}
              </div>
            {/if}
          </div>

          <!-- Left Page Footer -->
          <div
            style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #a8a29e; font-weight: 700; margin-top: 14px; border-top: 1px solid #f5f5f4; padding-top: 8px;"
          >
            <span>English Stories Book</span>
            <span>Page {currentStoryIndex * 2 + 1}</span>
          </div>
        </div>

        <!-- RIGHT PAGE -->
        <div
          class="template-page-item template-page-right"
          style="padding: clamp(16px, 2.5vw, 24px); display: flex; flex-direction: column; justify-content: space-between;"
        >
          <div>
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
            {:else if currentStory.storyText}
              <!-- Story Continuation, Vocabulary & Moral -->
              <div style="font-size: 14px; line-height: 1.7; color: #334155; font-family: 'Georgia', serif; margin-bottom: 16px;">
                {#each currentStory.storyText.slice(3) as para}
                  <p style="margin-bottom: 10px;">{para}</p>
                {/each}
              </div>

              <!-- Vocabulary Spotlight -->
              {#if currentStory.vocabulary}
                <div style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 10px; padding: 10px 12px; margin-bottom: 12px;">
                  <div style="font-size: 12px; font-weight: 800; color: #1e40af; margin-bottom: 6px;">
                    📖 Key Vocabulary
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11.5px;">
                    {#each currentStory.vocabulary as v}
                      <div>
                        <strong style="color: #1e3a8a;">{v.word}:</strong> <span style="color: #334155;">{v.meaning}</span>
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}

              <!-- Moral Box -->
              {#if currentStory.moral}
                <div style="background: #fefce8; border: 1.5px solid #fde047; border-radius: 10px; padding: 10px 12px; margin-bottom: 12px;">
                  <span style="font-size: 12px; font-weight: 800; color: #854d0e;">🌟 Moral of the Story:</span>
                  <div style="font-size: 12.5px; font-weight: 700; color: #713f12; margin-top: 2px;">
                    {currentStory.moral}
                  </div>
                </div>
              {/if}
            {/if}
          </div>

          <!-- Right Page Action Buttons & Footer -->
          <div>
            <div
              style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #e7e5e4; padding-top: 10px; gap: 8px; flex-wrap: wrap;"
            >
              <div style="display: flex; gap: 6px; align-items: center;">
                <button
                  type="button"
                  class="cb-copy-btn"
                  onclick={() =>
                    copyText(
                      currentStory.title +
                        '\n\n' +
                        (currentStory.ingredients
                          ? currentStory.ingredients.map((i) => i.name + ': ' + i.qty).join('\n')
                          : currentStory.storyText.join('\n\n'))
                    )}
                  style="background: #ffffff; border: 1.5px solid var(--ink); border-radius: 8px; padding: 5px 12px; font-size: 11.5px; font-weight: 800; cursor: pointer;"
                >
                  <span>📋</span> Copy
                </button>
                {#if currentStory.videoUrl}
                  <a
                    href={currentStory.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style="background: #fee2e2; color: #dc2626; border: 1.5px solid #f87171; border-radius: 8px; padding: 5px 12px; font-size: 11.5px; font-weight: 800; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;"
                  >
                    <span>▶️</span> Video
                  </a>
                {/if}
              </div>

              <div style="font-size: 11px; color: #a8a29e; font-weight: 700;">
                Page {currentStoryIndex * 2 + 2} of {totalPages}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Interactive Flipbook Navigation Toolbar -->
      <div
        style="background: #f5f5f4; border-top: 1.5px solid #e7e5e4; padding: 10px 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;"
      >
        <button
          type="button"
          class="reading-tool-btn"
          disabled={currentStoryIndex <= 0}
          onclick={() => selectStory(currentStoryIndex - 1)}
          style="font-size: 12.5px; font-weight: 800; padding: 6px 14px;"
        >
          ◀ Previous Story
        </button>

        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 12.5px; font-weight: 800; color: #44403c;">
            Story {currentStoryIndex + 1} of {stories.length}
          </span>
          <span style="color: #a8a29e;">•</span>
          <span style="font-size: 12px; font-weight: 700; color: #78716c;">
            {currentStory.title}
          </span>
        </div>

        <button
          type="button"
          class="reading-tool-btn active"
          disabled={currentStoryIndex >= stories.length - 1}
          onclick={() => selectStory(currentStoryIndex + 1)}
          style="font-size: 12.5px; font-weight: 800; padding: 6px 14px;"
        >
          Next Story ▶
        </button>
      </div>
    </div>
  </div>
</div>
