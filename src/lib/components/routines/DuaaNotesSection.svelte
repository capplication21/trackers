<script>
  import { onMount } from 'svelte';
  import { storageBridge } from '$lib/stores/storageBridge.js';
  import { playPageFlipSound } from '$lib/utils/audioRustle.js';

  const DEFAULT_DUAAS = [
    {
      id: 'duaa_starter_1',
      title: 'Dua for Good in Dunya & Akhirah',
      category: 'Quranic',
      source: 'Surah Al-Baqarah 2:201',
      arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
      transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar",
      text: 'Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.',
      recitedCount: 3,
      favorite: true,
      createdAt: 1700000000000
    },
    {
      id: 'duaa_starter_2',
      title: 'Dua for Parents (والدین کے لیے دعا)',
      category: 'Personal',
      source: 'Surah Al-Isra 17:24',
      arabic: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
      transliteration: 'Rabbi-rhamhuma kama rabbayani sagheera',
      text: 'My Lord, have mercy upon them as they brought me up [when I was] small.',
      recitedCount: 1,
      favorite: true,
      createdAt: 1700000001000
    },
    {
      id: 'duaa_starter_3',
      title: 'Dua for Well-being & Afiyah (عافیت)',
      category: 'Sunnah',
      source: 'Sunan Abi Dawud',
      arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ',
      transliteration: "Allahumma inni as'aluka al-'afwa wal-'afiyata fid-dunya wal-akhirah",
      text: 'O Allah, I ask You for forgiveness and well-being in this world and in the Hereafter.',
      recitedCount: 0,
      favorite: false,
      createdAt: 1700000002000
    }
  ];

  let duaas = $state([]);
  let searchQuery = $state('');

  // Add / Edit Modal State
  let showModal = $state(false);
  let editId = $state(null);
  let modalTitle = $state('');
  let modalCategory = $state('Quranic');
  let modalSource = $state('');
  let modalArabic = $state('');
  let modalTransliteration = $state('');
  let modalText = $state('');

  // Duaa Book Reader Modal State
  let showBookReader = $state(false);
  let currentBookIndex = $state(0);
  let isSoundEnabled = $state(true);

  onMount(async () => {
    try {
      const stored = await storageBridge.getItem('duaa_book_data_v1');
      if (stored) {
        const parsed = typeof stored === 'string' ? JSON.parse(stored) : stored;
        if (Array.isArray(parsed?.notes) && parsed.notes.length > 0) {
          duaas = parsed.notes;
        } else if (Array.isArray(parsed) && parsed.length > 0) {
          duaas = parsed;
        } else {
          duaas = DEFAULT_DUAAS;
        }
      } else {
        duaas = DEFAULT_DUAAS;
        await saveDuaas(DEFAULT_DUAAS);
      }
    } catch (e) {
      duaas = DEFAULT_DUAAS;
    }
  });

  async function saveDuaas(newDuaas) {
    duaas = newDuaas;
    const payload = { notes: newDuaas };
    await storageBridge.setItem('duaa_book_data_v1', JSON.stringify(payload));
    await storageBridge.setItem('notes_data_v1', JSON.stringify(payload));
  }

  function incrementRecited(id) {
    const next = duaas.map((d) => (d.id === id ? { ...d, recitedCount: (d.recitedCount || 0) + 1 } : d));
    saveDuaas(next);
  }

  function toggleFavorite(id) {
    const next = duaas.map((d) => (d.id === id ? { ...d, favorite: !d.favorite } : d));
    saveDuaas(next);
  }

  function openAddModal() {
    editId = null;
    modalTitle = '';
    modalCategory = 'Quranic';
    modalSource = '';
    modalArabic = '';
    modalTransliteration = '';
    modalText = '';
    showModal = true;
  }

  function openEditModal(item) {
    editId = item.id;
    modalTitle = item.title || '';
    modalCategory = item.category || 'Quranic';
    modalSource = item.source || '';
    modalArabic = item.arabic || '';
    modalTransliteration = item.transliteration || '';
    modalText = item.text || '';
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    editId = null;
  }

  async function handleSaveDuaa() {
    if (!modalTitle.trim() && !modalArabic.trim() && !modalText.trim()) return;

    if (editId) {
      const next = duaas.map((d) =>
        d.id === editId
          ? {
              ...d,
              title: modalTitle.trim() || 'My Duaa',
              category: modalCategory,
              source: modalSource.trim(),
              arabic: modalArabic.trim(),
              transliteration: modalTransliteration.trim(),
              text: modalText.trim(),
              updatedAt: Date.now()
            }
          : d
      );
      await saveDuaas(next);
    } else {
      const newDua = {
        id: 'duaa_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        title: modalTitle.trim() || 'My Duaa',
        category: modalCategory,
        source: modalSource.trim(),
        arabic: modalArabic.trim(),
        transliteration: modalTransliteration.trim(),
        text: modalText.trim(),
        recitedCount: 0,
        favorite: false,
        createdAt: Date.now()
      };
      await saveDuaas([newDua, ...duaas]);
    }
    closeModal();
  }

  async function handleDeleteDuaa(id) {
    if (!confirm('Are you sure you want to delete this Duaa?')) return;
    const next = duaas.filter((d) => d.id !== id);
    await saveDuaas(next);
  }

  function openBookAt(index = 0) {
    currentBookIndex = Math.max(0, Math.min(index, filteredDuaas.length - 1));
    showBookReader = true;
  }

  function nextBookPage() {
    if (currentBookIndex < filteredDuaas.length - 1) {
      currentBookIndex++;
      playPageFlipSound(isSoundEnabled);
    }
  }

  function prevBookPage() {
    if (currentBookIndex > 0) {
      currentBookIndex--;
      playPageFlipSound(isSoundEnabled);
    }
  }

  const filteredDuaas = $derived.by(() => {
    if (!searchQuery.trim()) return duaas;
    const q = searchQuery.toLowerCase();
    return duaas.filter(
      (d) =>
        (d.title || '').toLowerCase().includes(q) ||
        (d.arabic || '').includes(q) ||
        (d.transliteration || '').toLowerCase().includes(q) ||
        (d.text || '').toLowerCase().includes(q) ||
        (d.category || '').toLowerCase().includes(q) ||
        (d.source || '').toLowerCase().includes(q)
    );
  });
</script>

<div class="tab-content active" id="tab-notes" style="display: block;">
  <!-- Section Title Badge -->
  <div class="section-title duaa-title">
    <span>🤲</span> DUAA BOOK &amp; JOURNAL
  </div>

  <!-- Hero Book Banner -->
  <div class="duaa-hero-card">
    <div class="duaa-hero-top">
      <div class="duaa-hero-icon-wrap">
        <span class="duaa-hero-icon">📖</span>
      </div>
      <div class="duaa-hero-info">
        <div class="duaa-hero-title">كِتَابُ الدُّعَاءِ • My Duaa Book</div>
        <div class="duaa-hero-desc">
          Collect powerful Duas, screenshots &amp; reflections. Read page by page like a book.
        </div>
      </div>
    </div>
    <div class="duaa-hero-actions" style="display: flex; gap: 8px; flex-wrap: wrap;">
      <button
        type="button"
        class="duaa-hero-btn primary-book-btn"
        onclick={() => openBookAt(0)}
        style="background: #f59e0b; color: #18181b; border: 2px solid var(--ink); border-radius: 10px; font-weight: 800; padding: 8px 18px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 0 var(--ink);"
      >
        <span>📖</span> Open Duaa Book
      </button>
      <button
        type="button"
        class="duaa-hero-btn secondary-add-btn"
        onclick={openAddModal}
        style="background: #ffffff; color: #6d28d9; border: 2px solid var(--ink); border-radius: 10px; font-weight: 800; padding: 8px 18px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 2px 0 var(--ink);"
      >
        <span>➕</span> Add Duaa
      </button>
    </div>
  </div>

  <!-- Search Duaas -->
  <div class="recipe-search-row" style="margin-bottom: 14px;">
    <input
      type="text"
      class="input-field"
      placeholder="Search Arabic, translation, title, topic..."
      bind:value={searchQuery}
      style="margin: 0; font-size: 13.5px;"
    />
    <button class="recipe-search-btn" type="button" title="Search">
      🔍
    </button>
  </div>

  <!-- Duaa Cards List -->
  <div style="display: flex; flex-direction: column; gap: 14px;">
    {#each filteredDuaas as d, idx (d.id)}
      <div
        style="background: #ffffff; border: 2px solid #059669; border-radius: 16px; padding: 16px; box-shadow: 0 3px 0 #059669;"
      >
        <!-- Card Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; gap: 8px;">
          <div>
            <div style="font-size: 16px; font-weight: 800; color: #1e293b; margin-bottom: 4px;">
              {d.title}
            </div>
            {#if d.source}
              <div
                style="display: inline-flex; align-items: center; gap: 4px; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; border-radius: 6px; padding: 2px 8px; font-size: 11px; font-weight: 700;"
              >
                <span>📖</span> {d.source}
              </div>
            {/if}
          </div>

          <div style="display: flex; align-items: center; gap: 6px;">
            <span
              style="background: #f0fdf4; color: #047857; border: 1px solid #86efac; border-radius: 6px; padding: 2px 8px; font-size: 11px; font-weight: 700;"
            >
              {d.category || 'Quranic'}
            </span>
            <button
              type="button"
              onclick={() => toggleFavorite(d.id)}
              style="background: transparent; border: none; font-size: 18px; cursor: pointer; padding: 0;"
              title="Bookmark"
            >
              {d.favorite ? '⭐' : '☆'}
            </button>
          </div>
        </div>

        <!-- Arabic Container -->
        {#if d.arabic}
          <div
            style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin: 10px 0; text-align: center;"
          >
            <div
              style="font-family: 'Amiri', 'Traditional Arabic', serif; font-size: 24px; color: #064e3b; direction: rtl; line-height: 2;"
            >
              {d.arabic}
            </div>
          </div>
        {/if}

        <!-- Transliteration -->
        {#if d.transliteration}
          <div style="color: #92400e; font-style: italic; font-size: 13px; line-height: 1.5; margin-bottom: 8px;">
            "{d.transliteration}"
          </div>
        {/if}

        <!-- English Translation -->
        {#if d.text}
          <div style="color: #334155; font-size: 13.5px; line-height: 1.5; margin-bottom: 12px;">
            {d.text}
          </div>
        {/if}

        <!-- Recitation Counter Bar -->
        <div
          style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px 12px; margin-bottom: 12px;"
        >
          <div style="font-size: 12.5px; font-weight: 700; color: #475569; display: flex; align-items: center; gap: 4px;">
            <span>📿</span> Times Recited: <strong style="color: #047857;">{d.recitedCount || 0}</strong>
          </div>
          <button
            type="button"
            onclick={() => incrementRecited(d.id)}
            style="background: #047857; color: #ffffff; border: none; border-radius: 999px; padding: 4px 14px; font-weight: 800; font-size: 11.5px; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,0.1);"
          >
            +1 Recited
          </button>
        </div>

        <!-- Action Buttons Row -->
        <div style="display: flex; justify-content: flex-end; align-items: center; gap: 6px; border-top: 1px dashed #e2e8f0; padding-top: 10px;">
          <button
            type="button"
            onclick={() => openBookAt(idx)}
            style="background: #fef08a; color: #854d0e; border: 1.5px solid var(--ink); border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 1px 0 var(--ink);"
          >
            <span>📖</span> Read in Book
          </button>
          <button
            type="button"
            onclick={() => openEditModal(d)}
            style="background: #f1f5f9; color: #334155; border: 1.5px solid var(--ink); border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 1px 0 var(--ink);"
          >
            <span>✏️</span> Edit
          </button>
          <button
            type="button"
            onclick={() => handleDeleteDuaa(d.id)}
            style="background: #fee2e2; color: #991b1b; border: 1.5px solid var(--ink); border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 1px 0 var(--ink);"
          >
            <span>🗑️</span> Delete
          </button>
        </div>
      </div>
    {/each}

    {#if filteredDuaas.length === 0}
      <div style="background: #ffffff; border: 2px dashed #94a3b8; border-radius: 16px; padding: 36px 20px; text-align: center; color: #64748b;">
        <div style="font-size: 32px; margin-bottom: 8px;">🤲</div>
        <div style="font-size: 15px; font-weight: 800; color: #1e293b; margin-bottom: 4px;">No Duas Found</div>
        <div style="font-size: 12.5px; color: #64748b; margin-bottom: 12px;">Add your favorite supplications or adjust search</div>
        <button
          type="button"
          class="reading-tool-btn active"
          onclick={openAddModal}
          style="padding: 6px 16px; font-size: 12px;"
        >
          + Add New Duaa
        </button>
      </div>
    {/if}
  </div>
</div>

<!-- ==================== ADD / EDIT DUAA MODAL ==================== -->
{#if showModal}
  <div
    class="modal-overlay show"
    role="presentation"
    onclick={(e) => e.target === e.currentTarget && closeModal()}
    onkeydown={(e) => e.key === 'Escape' && closeModal()}
  >
    <div class="modal-card" style="max-width: 520px; max-height: 90vh; overflow-y: auto;">
      <div class="modal-title">
        {editId ? '✏️ Edit Duaa' : '🤲 Add to Duaa Book'}
      </div>
      <div class="modal-subtitle">
        Save powerful supplications, Arabic text, pronunciation &amp; English translation
      </div>

      <div class="input-group">
        <label class="input-label" for="duaaTitleInput">Duaa Title</label>
        <input
          type="text"
          class="input-field"
          id="duaaTitleInput"
          placeholder="e.g. Dua for Patience / Morning Protection"
          bind:value={modalTitle}
        />
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div class="input-group">
          <label class="input-label" for="duaaCategorySelect">Category</label>
          <select class="input-field" id="duaaCategorySelect" bind:value={modalCategory}>
            <option value="Quranic">Quranic</option>
            <option value="Sunnah">Sunnah</option>
            <option value="Personal">Personal</option>
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
          </select>
        </div>

        <div class="input-group">
          <label class="input-label" for="duaaSourceInput">Source / Reference</label>
          <input
            type="text"
            class="input-field"
            id="duaaSourceInput"
            placeholder="e.g. Surah Al-Baqarah 2:201"
            bind:value={modalSource}
          />
        </div>
      </div>

      <div class="input-group">
        <label class="input-label" for="duaaArabicInput">Arabic Text</label>
        <textarea
          class="input-field"
          id="duaaArabicInput"
          placeholder="أدخل النص العربي للدعاء هنا..."
          rows="3"
          style="font-family: 'Amiri', 'Traditional Arabic', serif; font-size: 20px; direction: rtl; text-align: right; line-height: 1.8;"
          bind:value={modalArabic}
        ></textarea>
      </div>

      <div class="input-group">
        <label class="input-label" for="duaaTranslitInput">Transliteration (Pronunciation)</label>
        <input
          type="text"
          class="input-field"
          id="duaaTranslitInput"
          placeholder="e.g. Rabbana atina fid-dunya hasanatan..."
          bind:value={modalTransliteration}
        />
      </div>

      <div class="input-group">
        <label class="input-label" for="duaaTextInput">English Translation &amp; Reflection</label>
        <textarea
          class="input-field"
          id="duaaTextInput"
          placeholder="Write English meaning or reflections..."
          rows="3"
          bind:value={modalText}
        ></textarea>
      </div>

      <div class="modal-buttons">
        <button class="modal-btn modal-btn-cancel" type="button" onclick={closeModal}>
          Cancel
        </button>
        <button class="modal-btn modal-btn-save" type="button" onclick={handleSaveDuaa}>
          {editId ? 'Save Changes' : 'Save Duaa'}
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- ==================== DUAA BOOK READER MODAL ==================== -->
{#if showBookReader && filteredDuaas.length > 0}
  {@const currentDua = filteredDuaas[currentBookIndex]}
  <div
    class="modal-overlay show"
    role="presentation"
    onclick={(e) => e.target === e.currentTarget && (showBookReader = false)}
    onkeydown={(e) => e.key === 'Escape' && (showBookReader = false)}
  >
    <div
      class="modal-card"
      style="max-width: 600px; width: 95%; max-height: 90vh; padding: 0; border-radius: 20px; overflow: hidden; background: linear-gradient(175deg, #ffffff 0%, #fdfbf7 55%, #f9f4ea 100%); display: flex; flex-direction: column;"
    >
      <!-- Book Header Top Bar -->
      <div
        style="background: #064e3b; color: #ffffff; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--ink);"
      >
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 18px;">📖</span>
          <span style="font-weight: 800; font-size: 14px;">كِتَابُ الدُّعَاءِ • Duaa Flipbook</span>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 12px; font-weight: 700; background: rgba(255,255,255,0.2); padding: 2px 10px; border-radius: 999px;">
            Page {currentBookIndex + 1} of {filteredDuaas.length}
          </span>
          <button
            type="button"
            onclick={() => (showBookReader = false)}
            style="background: transparent; border: none; color: white; font-size: 16px; font-weight: 800; cursor: pointer; padding: 2px 6px;"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Book Page Content Body -->
      <div style="padding: 24px 20px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div style="font-size: 18px; font-weight: 900; color: #064e3b;">
              {currentDua.title}
            </div>
            {#if currentDua.source}
              <span
                style="background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; border-radius: 6px; padding: 2px 8px; font-size: 11px; font-weight: 700;"
              >
                {currentDua.source}
              </span>
            {/if}
          </div>

          <!-- Arabic Display -->
          {#if currentDua.arabic}
            <div
              style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 14px; padding: 22px 16px; margin: 16px 0; text-align: center; box-shadow: inset 0 2px 4px rgba(0,0,0,0.03);"
            >
              <div
                style="font-family: 'Amiri', 'Traditional Arabic', serif; font-size: 28px; color: #064e3b; direction: rtl; line-height: 2.2;"
              >
                {currentDua.arabic}
              </div>
            </div>
          {/if}

          <!-- Transliteration -->
          {#if currentDua.transliteration}
            <div
              style="color: #92400e; font-style: italic; font-size: 14.5px; line-height: 1.6; margin-bottom: 12px; text-align: center; font-family: 'Georgia', serif;"
            >
              "{currentDua.transliteration}"
            </div>
          {/if}

          <!-- Translation -->
          {#if currentDua.text}
            <div
              style="color: #334155; font-size: 14.5px; line-height: 1.6; text-align: center; padding: 0 10px; margin-bottom: 20px;"
            >
              {currentDua.text}
            </div>
          {/if}
        </div>

        <!-- Recitation & Quick Counter -->
        <div
          style="display: flex; justify-content: center; align-items: center; gap: 12px; margin-top: auto; padding-top: 14px; border-top: 1px dashed #cbd5e1;"
        >
          <span style="font-size: 13px; font-weight: 700; color: #475569;">
            Recited {currentDua.recitedCount || 0} times
          </span>
          <button
            type="button"
            onclick={() => incrementRecited(currentDua.id)}
            style="background: #047857; color: #ffffff; border: none; border-radius: 999px; padding: 6px 18px; font-weight: 800; font-size: 12.5px; cursor: pointer; box-shadow: 0 2px 0 #064e3b;"
          >
            +1 Recite Now 📿
          </button>
        </div>
      </div>

      <!-- Book Bottom Flip Navigation Controls -->
      <div
        style="background: #f1f5f9; padding: 10px 16px; display: flex; justify-content: space-between; align-items: center; border-top: 1.5px solid #cbd5e1;"
      >
        <button
          type="button"
          class="reading-tool-btn"
          disabled={currentBookIndex <= 0}
          onclick={prevBookPage}
          style="font-size: 12.5px; font-weight: 800; padding: 6px 14px;"
        >
          ◀ Previous Page
        </button>

        <span style="font-size: 12px; font-weight: 800; color: #64748b;">
          {currentBookIndex + 1} / {filteredDuaas.length}
        </span>

        <button
          type="button"
          class="reading-tool-btn active"
          disabled={currentBookIndex >= filteredDuaas.length - 1}
          onclick={nextBookPage}
          style="font-size: 12.5px; font-weight: 800; padding: 6px 14px;"
        >
          Next Page ▶
        </button>
      </div>
    </div>
  </div>
{/if}
