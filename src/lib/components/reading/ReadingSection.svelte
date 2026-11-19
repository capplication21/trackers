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
  <div class="section-title">
    <span>📖</span> READING BOOK
  </div>

  <div id="readingBookContainer">
    <ReadingBookshelf />
    <ReadingCompanionPlayer />
    <ReadingFlipbook />
  </div>
</div>
