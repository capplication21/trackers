<script>
  import ReadingBookshelf from './ReadingBookshelf.svelte';
  import ReadingCompanionPlayer from './ReadingCompanionPlayer.svelte';
  import ReadingFlipbook from './ReadingFlipbook.svelte';
  import { readingState } from '$lib/stores/readingState.svelte.js';
  import { onMount } from 'svelte';

  onMount(() => {
    readingState.init();
  });
</script>

<div class="tab-content active" id="tab-reading" style="display: block;">
  <div class="section-title reading-title" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
    <span><span>📖</span> READING BOOK</span>
    <div
      class="reading-badge-indicator"
      style="display:inline-flex;align-items:center;gap:6px;background:#eff6ff;color:#1e40af;border:1.5px solid #bfdbfe;font-size:11.5px;font-weight:800;padding:4px 12px;border-radius:999px;"
    >
      <span>🎬</span> Story Video (Plays on this Page)
    </div>
  </div>

  <div id="readingBookContainer">
    <ReadingBookshelf />
    <ReadingCompanionPlayer />
    <ReadingFlipbook />
  </div>
</div>
