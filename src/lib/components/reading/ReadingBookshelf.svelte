<script>
  import { readingState } from '$lib/stores/readingState.svelte.js';

  let showAddModal = $state(false);
  let addTitle = $state('');
  let addVideoUrl = $state('');
  let addLevel = $state('Level 2 (Beginner-Intermediate)');
  let addColor = $state('#2b0a1a');
  let addText = $state('');

  function openAddModal() {
    addTitle = '';
    addVideoUrl = '';
    addLevel = 'Level 2 (Beginner-Intermediate)';
    addColor = '#2b0a1a';
    addText = '';
    showAddModal = true;
  }

  function closeAddModal() {
    showAddModal = false;
  }

  async function handleCreateStory() {
    const title = addTitle.trim();
    const text = addText.trim();
    if (!title || !text) {
      alert('Please provide both a Title and Story content.');
      return;
    }

    const rawChapters = text.split(/\n\s*---\s*\n/).map((c) => c.trim()).filter(Boolean);
    const pages = (rawChapters.length ? rawChapters : [text]).map((chunk, idx) => {
      const lines = chunk.split('\n').map((l) => l.trim()).filter(Boolean);
      const chTitle = lines[0]?.startsWith('Chapter') ? lines[0] : 'Chapter ' + (idx + 1);
      const prose = lines.slice(1).length ? lines.slice(1) : [chunk];
      return {
        chapter: 'Chapter ' + (idx + 1),
        title: chTitle,
        prose: prose,
        vocab: []
      };
    });

    const newStory = {
      id: 'story_custom_' + Date.now(),
      title: title,
      subtitle: 'Added by Reader • ' + addLevel,
      videoUrl: addVideoUrl.trim() || 'https://www.youtube.com/watch?v=3L_Oh4p-Ufg',
      views: 'Personal Library',
      level: addLevel,
      featuredBadge: 'Custom Story',
      coverColor: addColor,
      coverAccent: '#f59e0b',
      icon: '📖',
      description: 'Custom story added to your English2Flow bookshelf.',
      dedication: 'For the love of learning English through reading and listening.',
      pages: pages
    };

    await readingState.addUserStory(newStory);
    closeAddModal();
  }
</script>

<div class="reading-bookshelf-wrapper">
  <div class="reading-bookshelf-header">
    <div class="reading-bookshelf-title">
      <span>📚</span> English2Flow Graded Storybooks
      <span style="font-size:11px;font-weight:700;background:rgba(255,255,255,0.12);padding:2px 8px;border-radius:999px;">
        {readingState.allStories.length} Books
      </span>
    </div>

    <!-- Filter Pills & Add Button -->
    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
      <div class="reading-filter-pill-group">
        <button
          type="button"
          class="reading-filter-pill {readingState.activeFilter === 'all' ? 'active' : ''}"
          onclick={() => readingState.setFilter('all')}
        >
          All ({readingState.allStories.length})
        </button>
        <button
          type="button"
          class="reading-filter-pill {readingState.activeFilter === 'level1' ? 'active' : ''}"
          onclick={() => readingState.setFilter('level1')}
        >
          Level 1
        </button>
        <button
          type="button"
          class="reading-filter-pill {readingState.activeFilter === 'level2' ? 'active' : ''}"
          onclick={() => readingState.setFilter('level2')}
        >
          Level 2
        </button>
      </div>

      <button
        type="button"
        class="reading-tool-btn"
        onclick={openAddModal}
        title="Add your own story or English2Flow episode"
      >
        ➕ Add Story
      </button>

      <a
        href="https://www.youtube.com/@English2Flow"
        target="_blank"
        rel="noopener noreferrer"
        class="reading-channel-btn"
        title="Open English2Flow YouTube channel"
      >
        <span>▶</span> English2Flow
      </a>
    </div>
  </div>

  <!-- Bookshelf Grid -->
  <div class="reading-bookshelf-grid">
    {#each readingState.filteredStories as st (st.id)}
      {@const isSelected = st.id === readingState.currentStory.id}
      {@const coverBg = st.coverColor || '#2b0a1a'}
      <div
        class="reading-book-card-item {isSelected ? 'active' : ''}"
        onclick={() => readingState.setStory(st.id)}
        onkeydown={(e) => { if (e.key === 'Enter') readingState.setStory(st.id); }}
        tabindex="0"
        role="button"
        title="Read {st.title}"
      >
        <div
          class="reading-book-card-cover-preview"
          style="background:{coverBg};border-color:{st.coverAccent || '#f59e0b'};"
        >
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span class="reading-card-icon">{st.icon || '📖'}</span>
            <span class="reading-card-level-badge">{st.level.split('(')[0].trim()}</span>
          </div>
          <div style="font-size:11px;font-weight:800;color:#fef08a;text-shadow:0 1px 3px rgba(0,0,0,0.8);line-height:1.2;">
            {st.title}
          </div>
        </div>

        <div class="reading-card-title">
          {st.title}
        </div>

        <div class="reading-card-meta">
          <span>📑 {st.pages.length} Chapters</span>
          <span style="font-weight:700;color:{isSelected ? '#f59e0b' : '#94a3b8'};">
            {isSelected ? 'Reading Now ★' : 'Open 📖'}
          </span>
        </div>
      </div>
    {/each}
  </div>
</div>

{#if showAddModal}
  <div class="reading-modal-overlay" id="readingAddStoryModal">
    <div class="reading-modal-card" style="max-width:580px;max-height:90vh;overflow-y:auto;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
        <div style="font-size:15px;font-weight:800;color:#fef08a;">➕ Add English2Flow Storybook</div>
        <button type="button" class="reading-tool-btn" onclick={closeAddModal}>✕</button>
      </div>
      <p style="font-size:12px;color:#94a3b8;margin-bottom:14px;">
        Add any new story from <strong>English2Flow</strong>. Paste the YouTube link and chapters.
      </p>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div>
          <label for="addStoryTitle" style="font-size:11px;font-weight:800;color:#cbd5e1;display:block;margin-bottom:4px;">Story Title *</label>
          <input
            id="addStoryTitle"
            type="text"
            bind:value={addTitle}
            placeholder="e.g. The Brave Little Tailor"
            style="width:100%;padding:8px 10px;border-radius:6px;border:1px solid #475569;background:#0f172a;color:#ffffff;box-sizing:border-box;"
          />
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div>
            <label for="addStoryLevel" style="font-size:11px;font-weight:800;color:#cbd5e1;display:block;margin-bottom:4px;">Level</label>
            <select
              id="addStoryLevel"
              bind:value={addLevel}
              style="width:100%;padding:8px 10px;border-radius:6px;border:1px solid #475569;background:#0f172a;color:#ffffff;box-sizing:border-box;"
            >
              <option value="Level 1 (Beginner)">Level 1 (Beginner)</option>
              <option value="Level 2 (Beginner-Intermediate)">Level 2 (Intermediate)</option>
              <option value="Level 3 (Advanced)">Level 3 (Advanced)</option>
            </select>
          </div>
          <div>
            <label for="addStoryColor" style="font-size:11px;font-weight:800;color:#cbd5e1;display:block;margin-bottom:4px;">Cover Color</label>
            <select
              id="addStoryColor"
              bind:value={addColor}
              style="width:100%;padding:8px 10px;border-radius:6px;border:1px solid #475569;background:#0f172a;color:#ffffff;box-sizing:border-box;"
            >
              <option value="#2b0a1a">Wine Red</option>
              <option value="#0f291e">Emerald Forest</option>
              <option value="#1e1b4b">Midnight Blue</option>
              <option value="#2d1810">Dark Chocolate</option>
              <option value="#0c2340">Deep Sapphire</option>
              <option value="#381e05">Warm Copper</option>
            </select>
          </div>
        </div>
        <div>
          <label for="addStoryVideoUrl" style="font-size:11px;font-weight:800;color:#cbd5e1;display:block;margin-bottom:4px;">YouTube Video Link *</label>
          <input
            id="addStoryVideoUrl"
            type="text"
            bind:value={addVideoUrl}
            placeholder="https://www.youtube.com/watch?v=..."
            style="width:100%;padding:8px 10px;border-radius:6px;border:1px solid #475569;background:#0f172a;color:#ffffff;box-sizing:border-box;"
          />
        </div>
        <div>
          <label for="addStoryText" style="font-size:11px;font-weight:800;color:#cbd5e1;display:block;margin-bottom:4px;">Story Prose / Chapters (Separate chapters by "---" or double newlines) *</label>
          <textarea
            id="addStoryText"
            bind:value={addText}
            rows="6"
            placeholder="Chapter 1: ...&#10;Prose paragraphs...&#10;---&#10;Chapter 2: ..."
            style="width:100%;padding:8px 10px;border-radius:6px;border:1px solid #475569;background:#0f172a;color:#ffffff;font-family:inherit;font-size:12px;box-sizing:border-box;"
          ></textarea>
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px;">
        <button type="button" class="reading-tool-btn" onclick={closeAddModal}>Cancel</button>
        <button type="button" class="reading-tool-btn active" onclick={handleCreateStory}>Create Book 📚</button>
      </div>
    </div>
  </div>
{/if}
