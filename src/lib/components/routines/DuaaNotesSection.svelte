<script>
  import { onMount } from 'svelte';
  import { notesState } from '$lib/stores/notesState.svelte.js';

  let localText = $state('');
  let isSaved = $state(false);

  onMount(async () => {
    await notesState.init();
    localText = notesState.notesText;
  });

  async function handleSave() {
    await notesState.saveNotes(localText);
    isSaved = true;
    setTimeout(() => (isSaved = false), 2000);
  }
</script>

<div class="tab-content active" id="tab-notes" style="display: block;">
  <div class="section-title" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
    <span><span>🤲</span> DUAA BOOK &amp; JOURNAL</span>
    <button
      type="button"
      class="reading-tool-btn active"
      onclick={handleSave}
      style="font-size: 11.5px; padding: 4px 12px;"
    >
      {isSaved ? 'Saved ✓' : '💾 Save Journal'}
    </button>
  </div>

  <div style="background: #ffffff; border: 2px solid var(--ink); border-radius: 16px; padding: 14px; box-shadow: 0 3px 0 var(--ink);">
    <textarea
      bind:value={localText}
      placeholder="Write personal supplications, daily reflections, reflections on verses, or gratitude notes here..."
      rows="18"
      style="width: 100%; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 14px; font-family: 'Georgia', serif; font-size: 14.5px; line-height: 1.8; color: var(--ink); box-sizing: border-box; background: #fdfbf7; resize: vertical;"
      oninput={() => { isSaved = false; }}
    ></textarea>
  </div>
</div>
