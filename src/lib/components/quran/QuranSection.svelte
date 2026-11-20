<script>
  import { onMount } from 'svelte';
  import { quranState } from '$lib/stores/quranState.svelte.js';
  import EveningQuranModal from '$lib/components/tracker/EveningQuranModal.svelte';

  // Set / Edit Surah Modal
  let showSurahModal = $state(false);
  let surahFormTitle = $state('');
  let surahFormStart = $state(1);
  let surahFormEnd = $state(286);
  let surahFormUrl = $state('');
  let editingSurahId = $state(null);

  // Player Modal
  let isPlayerOpen = $state(false);
  let activeSurahNum = $state(2);
  let activeStart = $state(1);
  let activeEnd = $state(286);
  let activeUrl = $state('');

  onMount(async () => {
    await quranState.initSurahs();
  });

  function openPlayer(s) {
    if (s) {
      activeSurahNum = s.surahNumber || 2;
      activeStart = s.ayahStart || 1;
      activeEnd = s.ayahEnd || 286;
      activeUrl = s.url || '';
    } else {
      activeSurahNum = 2;
      activeStart = 1;
      activeEnd = 286;
      activeUrl = 'https://youtu.be/JZnXtmZk_3M?si=xXxwcQyjEP_KeoFF';
    }
    isPlayerOpen = true;
  }

  function openAddSurah() {
    editingSurahId = null;
    surahFormTitle = '';
    surahFormStart = 1;
    surahFormEnd = 286;
    surahFormUrl = '';
    showSurahModal = true;
  }

  function editSurah(s) {
    editingSurahId = s.id;
    surahFormTitle = s.title;
    surahFormStart = s.ayahStart || 1;
    surahFormEnd = s.ayahEnd || 286;
    surahFormUrl = s.url || '';
    showSurahModal = true;
  }

  async function saveSurah() {
    if (!surahFormTitle.trim()) return;
    if (editingSurahId) {
      await quranState.updateSurah(editingSurahId, {
        title: surahFormTitle.trim(),
        ayahStart: surahFormStart,
        ayahEnd: surahFormEnd,
        url: surahFormUrl.trim()
      });
    } else {
      const newSurah = {
        id: 'surah_' + Date.now(),
        title: surahFormTitle.trim(),
        surahNumber: parseInt(surahFormTitle.match(/\d+/)?.[0] || '2', 10),
        ayahStart: surahFormStart,
        ayahEnd: surahFormEnd,
        url: surahFormUrl.trim()
      };
      await quranState.addSurah(newSurah);
    }
    showSurahModal = false;
  }

  async function deleteSurah(id) {
    await quranState.deleteSurah(id);
  }
</script>

<div class="quran-page-wrapper">
  <!-- Pill Header Badge -->
  <div class="quran-header-pill">
    <span class="pill-icon">📖</span> QUR'AN
  </div>

  <!-- Quran Card -->
  <div class="quran-main-card">
    <div class="task-content-body">
      <!-- Title & Set Button Row -->
      <div class="task-head-row">
        <div class="task-text" style="margin-bottom: 0;">
          Read and Listen Quran <span>📖</span>
        </div>
        <button
          type="button"
          class="set-surah-btn"
          onclick={(e) => { e.stopPropagation(); openAddSurah(); }}
          title="Set Surah, Ayat range & YouTube recitation link"
        >
          <span class="plus-sign">+</span> Set Surah &amp; Ayahs
        </button>
      </div>

      <!-- Surah Cards List -->
      <div class="surah-cards-list" onclick={(e) => e.stopPropagation()} role="presentation">
        {#each quranState.surahs as s (s.id)}
          <div class="surah-item-box">
            <div class="surah-item-top">
              <div class="surah-info-side">
                <div class="surah-title-text">
                  {s.title}
                </div>
                <div class="surah-meta-text">
                  Ayat {s.ayahStart || 1} – {s.ayahEnd || 286} · Online Arabic &amp; Urdu Meaning
                </div>

                <div class="surah-actions-row">
                  <button
                    type="button"
                    class="quran-read-btn"
                    onclick={() => openPlayer(s)}
                    title="Open Surah with Arabic text, Urdu meaning &amp; recitation"
                  >
                    <span>📖</span> Read &amp; Listen with Urdu Meaning
                  </button>
                  {#if s.url}
                    <a
                      class="quran-ext-link"
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onclick={(e) => e.stopPropagation()}
                    >
                      <span class="play-icon-badge">▶</span> External Link
                    </a>
                  {/if}
                </div>
              </div>

              <!-- Right action icons -->
              <div class="surah-icons-group">
                <button
                  type="button"
                  class="action-icon-btn read-icon-btn"
                  onclick={() => openPlayer(s)}
                  title="Read &amp; Listen"
                >
                  📖
                </button>
                <button
                  type="button"
                  class="action-icon-btn edit-icon-btn"
                  onclick={() => editSurah(s)}
                  title="Edit Playlist"
                >
                  ✏️
                </button>
                <button
                  type="button"
                  class="action-icon-btn delete-icon-btn"
                  onclick={() => deleteSurah(s.id)}
                  title="Delete Playlist"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<!-- SET SURAH & AYAHS MODAL -->
{#if showSurahModal}
  <div
    class="nav-menu-overlay"
    onclick={() => (showSurahModal = false)}
    onkeydown={(e) => { if (e.key === 'Escape') showSurahModal = false; }}
    role="button"
    tabindex="-1"
  >
    <div
      class="nav-menu-dropdown"
      style="max-width: 440px; padding: 20px;"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="dialog"
      tabindex="0"
    >
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
        <h3 style="font-size: 16px; font-weight: 800; color: #1e1b4b; margin: 0;">
          {editingSurahId ? '✏️ Edit Surah' : '➕ Set Surah & Ayahs'}
        </h3>
        <button
          type="button"
          class="dropdown-close-btn"
          onclick={() => (showSurahModal = false)}
        >
          ✕
        </button>
      </div>

      <div style="margin-bottom: 12px;">
        <label for="surahTitleInput" style="display: block; font-size: 12px; font-weight: 700; color: var(--ink); margin-bottom: 4px;">
          Title (e.g. 📖 Surah 2: Al-Baqarah (Ayat 1 – 286)):
        </label>
        <input
          id="surahTitleInput"
          type="text"
          class="input-field"
          style="width: 100%; box-sizing: border-box; padding: 8px 10px; border: 2px solid var(--ink); border-radius: 8px; font-size: 13.5px;"
          placeholder="📖 Surah 2: Al-Baqarah (Ayat 1 – 286)"
          bind:value={surahFormTitle}
        />
      </div>

      <div style="display: flex; gap: 10px; margin-bottom: 12px;">
        <div style="flex: 1;">
          <label for="surahStartInput" style="display: block; font-size: 12px; font-weight: 700; color: var(--ink); margin-bottom: 4px;">
            Start Ayah:
          </label>
          <input
            id="surahStartInput"
            type="number"
            min="1"
            class="input-field"
            style="width: 100%; box-sizing: border-box; padding: 8px 10px; border: 2px solid var(--ink); border-radius: 8px; font-size: 13.5px;"
            bind:value={surahFormStart}
          />
        </div>
        <div style="flex: 1;">
          <label for="surahEndInput" style="display: block; font-size: 12px; font-weight: 700; color: var(--ink); margin-bottom: 4px;">
            End Ayah:
          </label>
          <input
            id="surahEndInput"
            type="number"
            min="1"
            class="input-field"
            style="width: 100%; box-sizing: border-box; padding: 8px 10px; border: 2px solid var(--ink); border-radius: 8px; font-size: 13.5px;"
            bind:value={surahFormEnd}
          />
        </div>
      </div>

      <div style="margin-bottom: 16px;">
        <label for="surahUrlInput" style="display: block; font-size: 12px; font-weight: 700; color: var(--ink); margin-bottom: 4px;">
          Recitation Link (YouTube / Audio URL):
        </label>
        <input
          id="surahUrlInput"
          type="url"
          class="input-field"
          style="width: 100%; box-sizing: border-box; padding: 8px 10px; border: 2px solid var(--ink); border-radius: 8px; font-size: 13.5px;"
          placeholder="https://youtu.be/..."
          bind:value={surahFormUrl}
        />
      </div>

      <div style="display: flex; gap: 8px; justify-content: flex-end;">
        <button
          type="button"
          onclick={() => (showSurahModal = false)}
          style="padding: 7px 12px; font-size: 12px; background: #f1f5f9; border: 1.5px solid var(--ink); border-radius: 8px; font-weight: 700; cursor: pointer;"
        >
          Cancel
        </button>
        <button
          type="button"
          onclick={saveSurah}
          style="padding: 7px 16px; font-size: 12px; background: #f59e0b; color: black; border: 1.5px solid var(--ink); border-radius: 8px; font-weight: 800; cursor: pointer; box-shadow: 0 2px 0 var(--ink);"
        >
          Save Surah
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- FULL QURAN RECITATION PLAYER MODAL -->
<EveningQuranModal
  isOpen={isPlayerOpen}
  surahNumber={activeSurahNum}
  initialStart={activeStart}
  initialEnd={activeEnd}
  initialVideoUrl={activeUrl}
  onClose={() => (isPlayerOpen = false)}
/>

<style>
  .quran-page-wrapper {
    max-width: 680px;
    margin: 0 auto;
    padding-bottom: 60px;
    font-family: inherit;
  }

  .quran-header-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #ffffff;
    border: 2.5px solid var(--ink, #141413);
    border-radius: 999px;
    padding: 6px 16px;
    font-weight: 800;
    font-size: 13px;
    margin-bottom: 14px;
    box-shadow: 0 2px 0 var(--ink, #141413);
  }

  .pill-icon {
    font-size: 15px;
  }

  /* MAIN CARD */
  .quran-main-card {
    background: #ffffff;
    border: 2.5px solid var(--ink, #141413);
    border-radius: 20px;
    padding: 18px 20px;
    box-shadow: 0 4px 0 var(--ink, #141413);
  }

  .task-content-body {
    flex: 1;
    min-width: 0;
  }

  .task-head-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 6px;
  }

  .task-text {
    font-size: 16px;
    font-weight: 800;
    color: #1e1b4b;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .set-surah-btn {
    font-size: 11.5px;
    padding: 4px 14px;
    background: #f59e0b;
    color: #000000;
    font-weight: 800;
    border: 2px solid var(--ink, #141413);
    border-radius: 999px;
    cursor: pointer;
    box-shadow: 0 2px 0 var(--ink, #141413);
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: transform 0.1s;
    font-family: inherit;
  }

  .set-surah-btn:active {
    transform: translateY(2px);
    box-shadow: none;
  }

  .plus-sign {
    color: #6366f1;
    font-weight: 900;
    font-size: 13px;
  }

  /* INNER SURAH CARD */
  .surah-cards-list {
    margin-top: 10px;
  }

  .surah-item-box {
    background: #ffffff;
    border: 1.5px solid #cbd5e1;
    border-radius: 12px;
    padding: 12px 14px;
    margin-top: 6px;
  }

  .surah-item-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
  }

  .surah-info-side {
    flex: 1;
    min-width: 0;
  }

  .surah-title-text {
    font-size: 13.5px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.3;
  }

  .surah-meta-text {
    font-size: 11px;
    color: #0284c7;
    font-weight: 700;
    margin-top: 2px;
  }

  .surah-actions-row {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 8px;
  }

  .quran-read-btn {
    background: #ffffff;
    border: 1.5px solid #059669;
    color: #047857;
    border-radius: 8px;
    padding: 3px 10px;
    font-size: 11px;
    font-weight: 800;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s;
  }

  .quran-read-btn:hover {
    background: #f0fdf4;
  }

  .quran-ext-link {
    background: #eff6ff;
    border: 1.5px solid #bfdbfe;
    color: #2563eb;
    border-radius: 8px;
    padding: 3px 10px;
    font-size: 11px;
    font-weight: 800;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    text-decoration: none;
    font-family: inherit;
    transition: background 0.15s;
  }

  .quran-ext-link:hover {
    background: #dbeafe;
  }

  .play-icon-badge {
    color: #2563eb;
    font-size: 9px;
  }

  /* ACTION ICONS GROUP */
  .surah-icons-group {
    display: flex;
    align-items: center;
    gap: 5px;
    flex-shrink: 0;
  }

  .action-icon-btn {
    width: 26px;
    height: 26px;
    font-size: 11px;
    border-radius: 8px;
    background: #ffffff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }

  .read-icon-btn {
    border: 1.5px solid #10b981;
    color: #047857;
  }

  .read-icon-btn:hover {
    background: #ecfdf5;
  }

  .edit-icon-btn,
  .delete-icon-btn {
    border: 1.5px solid #cbd5e1;
  }

  .edit-icon-btn:hover,
  .delete-icon-btn:hover {
    background: #f1f5f9;
  }

  /* MODAL STYLES */
  .nav-menu-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(3px);
    z-index: 100000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }

  .nav-menu-dropdown {
    background: #ffffff;
    border: 2.5px solid var(--ink, #141413);
    border-radius: 20px;
    width: min(100%, 440px);
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.25), 0 5px 0 var(--ink, #141413);
  }

  .dropdown-close-btn {
    background: #f1f5f9;
    border: 2px solid var(--ink, #141413);
    border-radius: 50%;
    width: 28px;
    height: 28px;
    font-size: 12px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
</style>
