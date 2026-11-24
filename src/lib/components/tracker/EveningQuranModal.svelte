<script>
  import { onMount, tick } from 'svelte';
  import { SURAH_LIST } from '$lib/data/quranData.js';
  import { storageBridge } from '$lib/stores/storageBridge.js';
  import { triggerHaptic } from '$lib/utils/haptics.js';
  import { getYouTubeEmbedUrl } from '$lib/utils/youtubeParser.js';

  let {
    isOpen = false,
    surahNumber = 2,
    initialStart = 1,
    initialEnd = 286,
    initialVideoUrl = 'https://youtu.be/JZnXtmZk_3M?si=xXxwcQyjEP_KeoFF',
    onClose = () => {}
  } = $props();

  // Internal reactive state
  let selectedSurahNum = $state(2);
  let startAyah = $state(1);
  let endAyah = $state(286);
  let scriptMode = $state('indopak'); // 'indopak' | 'uthmani'
  let isFocusMode = $state(false);
  let isVideoMinimized = $state(false);
  let videoUrl = $state('');

  // Edit Video URL modal
  let showEditUrlModal = $state(false);
  let editUrlInput = $state('');

  // Data & Audio
  let ayahs = $state([]);
  let allLoadedAyahs = $state([]);
  let isLoading = $state(false);
  let loadError = $state(null);
  let playingAyahNum = $state(null);
  let audioElement = null;

  // Selected Surah Meta
  let currentMeta = $derived.by(() => {
    return SURAH_LIST.find((s) => s.number === selectedSurahNum) || SURAH_LIST[1];
  });

  // Embed URL for YouTube
  let embedUrl = $derived.by(() => {
    return getYouTubeEmbedUrl(videoUrl);
  });

  // Slice displayed ayahs
  let displayedAyahs = $derived.by(() => {
    if (!allLoadedAyahs || allLoadedAyahs.length === 0) return [];
    return allLoadedAyahs.filter(
      (a) => a.numberInSurah >= startAyah && a.numberInSurah <= endAyah
    );
  });

  let lastOpenedKey = '';
  $effect(() => {
    if (isOpen) {
      const currentKey = `${surahNumber}_${initialStart}_${initialEnd}_${initialVideoUrl}`;
      if (lastOpenedKey !== currentKey) {
        lastOpenedKey = currentKey;
        selectedSurahNum = surahNumber || 2;
        startAyah = initialStart || 1;
        const meta = SURAH_LIST.find((s) => s.number === selectedSurahNum);
        endAyah = initialEnd || meta?.ayahCount || 286;
        if (initialVideoUrl) videoUrl = initialVideoUrl;
        loadSurahAyahs(selectedSurahNum);
      }
    } else {
      lastOpenedKey = '';
      stopAudio();
    }
  });

  async function loadSurahAyahs(surahNum, forceNet = false) {
    isLoading = true;
    loadError = null;
    stopAudio();

    const cacheKey = `quran_evening_surah_${surahNum}_full`;

    // Try reading from cache first unless forceNet is requested
    if (!forceNet) {
      try {
        const cached = await storageBridge.getItem(cacheKey);
        if (cached && Array.isArray(cached) && cached.length > 0) {
          allLoadedAyahs = cached;
          isLoading = false;
          return;
        }
      } catch (e) {
        console.warn('Cache lookup failed:', e);
      }
    }

    try {
      // Fetch both Indo-Pak script and Urdu translation (Fateh Muhammad Jalandhry)
      // and Uthmani script as fallback/toggle
      const res = await fetch(
        `https://api.alquran.cloud/v1/surah/${surahNum}/editions/quran-indopak,quran-uthmani,ur.jalandhry`
      );

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const json = await res.json();
      if (json && json.data && json.data.length >= 3) {
        const indopakData = json.data[0];
        const uthmaniData = json.data[1];
        const urduData = json.data[2];

        const mapped = indopakData.ayahs.map((ay, idx) => {
          const uthAy = uthmaniData.ayahs[idx] || {};
          const urAy = urduData.ayahs[idx] || {};

          let cleanIndopak = ay.text || '';
          let cleanUthmani = uthAy.text || '';

          // If not Surah 1 and not Surah 9, strip leading Bismillah from verse 1
          if (surahNum !== 1 && surahNum !== 9 && idx === 0) {
            cleanIndopak = cleanIndopak.replace(/^بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ\s*/, '');
            cleanUthmani = cleanUthmani.replace(/^بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\s*/, '');
          }

          return {
            numberInSurah: ay.numberInSurah,
            globalNumber: ay.number,
            arabicIndopak: cleanIndopak.trim(),
            arabicUthmani: cleanUthmani.trim(),
            urduText: (urAy.text || '').trim()
          };
        });

        allLoadedAyahs = mapped;

        // Cache for instant offline access
        try {
          await storageBridge.setItem(cacheKey, mapped);
        } catch {}
      } else {
        throw new Error('Invalid data received from Quran server.');
      }
    } catch (err) {
      console.warn('Failed to load Ayahs from net:', err);
      loadError = 'Could not load verses from the network. Please check your connection or retry.';
    } finally {
      isLoading = false;
    }
  }

  function handleSurahChange(e) {
    const num = parseInt(e.target.value, 10);
    if (!num) return;
    triggerHaptic('light');
    selectedSurahNum = num;
    const meta = SURAH_LIST.find((s) => s.number === num);
    startAyah = 1;
    endAyah = meta ? meta.ayahCount : 10;
    loadSurahAyahs(num);
  }

  function toggleScriptMode() {
    triggerHaptic('selection');
    scriptMode = scriptMode === 'indopak' ? 'uthmani' : 'indopak';
  }

  function toggleFocusMode() {
    triggerHaptic('selection');
    isFocusMode = !isFocusMode;
  }

  function toggleVideoMinimize() {
    triggerHaptic('light');
    isVideoMinimized = !isVideoMinimized;
  }

  function playAyahAudio(ayah) {
    if (playingAyahNum === ayah.numberInSurah) {
      stopAudio();
      return;
    }

    stopAudio();
    playingAyahNum = ayah.numberInSurah;
    triggerHaptic('light');

    const sStr = String(selectedSurahNum).padStart(3, '0');
    const aStr = String(ayah.numberInSurah).padStart(3, '0');
    const audioUrl = `https://everyayah.com/data/Alafasy_128kbps/${sStr}${aStr}.mp3`;

    audioElement = new Audio(audioUrl);
    audioElement.onended = () => {
      // Auto play next verse if within range
      if (ayah.numberInSurah < endAyah) {
        const nextAyah = allLoadedAyahs.find((a) => a.numberInSurah === ayah.numberInSurah + 1);
        if (nextAyah) {
          playAyahAudio(nextAyah);
          return;
        }
      }
      playingAyahNum = null;
    };
    audioElement.onerror = () => {
      playingAyahNum = null;
    };
    audioElement.play().catch(() => {
      playingAyahNum = null;
    });
  }

  function stopAudio() {
    if (audioElement) {
      try {
        audioElement.pause();
        audioElement.currentTime = 0;
      } catch (e) {}
      audioElement = null;
    }
    playingAyahNum = null;
  }

  function handlePrevAyahs() {
    triggerHaptic('light');
    const range = Math.max(1, endAyah - startAyah + 1);
    if (startAyah > 1) {
      const newStart = Math.max(1, startAyah - range);
      const newEnd = Math.max(newStart, startAyah - 1);
      startAyah = newStart;
      endAyah = newEnd;
    } else if (selectedSurahNum > 1) {
      // Go to previous Surah
      selectedSurahNum -= 1;
      const meta = SURAH_LIST.find((s) => s.number === selectedSurahNum);
      startAyah = 1;
      endAyah = meta ? meta.ayahCount : 10;
      loadSurahAyahs(selectedSurahNum);
    }
  }

  function handleNextAyahs() {
    triggerHaptic('light');
    const range = Math.max(1, endAyah - startAyah + 1);
    const meta = currentMeta;
    if (endAyah < meta.ayahCount) {
      const newStart = endAyah + 1;
      const newEnd = Math.min(meta.ayahCount, endAyah + range);
      startAyah = newStart;
      endAyah = newEnd;
    } else if (selectedSurahNum < 114) {
      // Advance to next Surah
      selectedSurahNum += 1;
      const nextMeta = SURAH_LIST.find((s) => s.number === selectedSurahNum);
      startAyah = 1;
      endAyah = nextMeta ? nextMeta.ayahCount : 10;
      loadSurahAyahs(selectedSurahNum);
    }
  }

  function saveCustomVideoUrl() {
    if (editUrlInput.trim()) {
      videoUrl = editUrlInput.trim();
    }
    showEditUrlModal = false;
  }

  function handleClose() {
    stopAudio();
    onClose();
  }
</script>

{#if isOpen}
  <div
    class="evening-quran-overlay"
    onclick={handleClose}
    onkeydown={(e) => { if (e.key === 'Escape') handleClose(); }}
    role="button"
    tabindex="-1"
  >
    <div
      class="evening-quran-dialog"
      class:focus-mode={isFocusMode}
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="dialog"
      tabindex="0"
    >
      <!-- TOP BAR -->
      <div class="modal-top-bar">
        <div class="top-title-group">
          <div class="title-with-icon">
            <span class="book-icon">📖</span>
            <span class="title-text">
              Surah {selectedSurahNum}: {currentMeta.englishName} · {currentMeta.name}
            </span>
          </div>
          <div class="ayat-pill-badge">
            Ayat {startAyah} – {endAyah} of {currentMeta.ayahCount}
          </div>
        </div>

        <div class="top-actions-group">
          <!-- PK Indo-Pak Button -->
          <button
            type="button"
            class="top-pill-btn pk-btn"
            class:active={scriptMode === 'indopak'}
            onclick={toggleScriptMode}
            title="Toggle between Indo-Pak and Uthmani script"
          >
            <span class="pk-flag">PK</span>
            <span>{scriptMode === 'indopak' ? 'Indo-Pak' : 'Uthmani'}</span>
          </button>

          <!-- Focus Button -->
          <button
            type="button"
            class="top-pill-btn focus-btn"
            class:active={isFocusMode}
            onclick={toggleFocusMode}
            title="Toggle Focus Reading Mode"
          >
            <span>📖</span>
            <span>Focus</span>
          </button>

          <!-- Close Button -->
          <button
            type="button"
            class="close-round-btn"
            onclick={handleClose}
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- SURAH & AYAH RANGE SELECTOR CONTROLS -->
      <div class="selector-controls-row">
        <select
          class="surah-dropdown"
          value={selectedSurahNum}
          onchange={handleSurahChange}
        >
          {#each SURAH_LIST as s (s.number)}
            <option value={s.number}>
              {s.number}. {s.englishName} ({s.name})
            </option>
          {/each}
        </select>

        <div class="range-inputs-wrap">
          <input
            type="number"
            class="range-num-input"
            min="1"
            max={currentMeta.ayahCount}
            bind:value={startAyah}
          />
          <span class="range-sep">-</span>
          <input
            type="number"
            class="range-num-input"
            min="1"
            max={currentMeta.ayahCount}
            bind:value={endAyah}
          />
        </div>

        <button
          type="button"
          class="load-net-btn"
          onclick={() => loadSurahAyahs(selectedSurahNum, true)}
          title="Fetch latest verses from network"
        >
          <span class="reload-icon">🔄</span> Load from Net
        </button>
      </div>

      <!-- YOUTUBE RECITATION CONTAINER -->
      {#if !isFocusMode}
        <div class="youtube-player-card">
          <div class="yt-header-bar">
            <div class="yt-title">
              <span class="yt-play-icon">▶</span>
              <span>YouTube Recitation</span>
            </div>
            <div class="yt-actions">
              <button
                type="button"
                class="yt-ctrl-btn min-btn"
                onclick={toggleVideoMinimize}
              >
                {isVideoMinimized ? '▲ Show Video' : '▼ Minimize Video'}
              </button>
              {#if videoUrl}
                <a
                  class="yt-open-link"
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open ↗
                </a>
              {/if}
              <button
                type="button"
                class="yt-edit-btn"
                onclick={() => {
                  editUrlInput = videoUrl;
                  showEditUrlModal = true;
                }}
                title="Edit YouTube URL"
              >
                ✏️
              </button>
            </div>
          </div>

          {#if !isVideoMinimized}
            <div class="yt-video-wrapper">
              {#if embedUrl}
                <iframe
                  src={embedUrl}
                  title="YouTube Quran Recitation"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  class="yt-iframe"
                ></iframe>
              {:else}
                <div class="yt-placeholder">
                  <p>No video player configured.</p>
                  <button
                    type="button"
                    class="set-video-btn"
                    onclick={() => {
                      editUrlInput = videoUrl;
                      showEditUrlModal = true;
                    }}
                  >
                    Set YouTube Recitation Link
                  </button>
                </div>
              {/if}
            </div>
          {/if}
        </div>
      {/if}

      <!-- BISMILLAH CALLIGRAPHY BANNER -->
      {#if selectedSurahNum !== 9}
        <div class="bismillah-banner-box">
          <div class="bismillah-calligraphy" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
        </div>
      {/if}

      <!-- SCROLLABLE AYAH CARDS -->
      <div class="ayah-cards-scroll-container">
        {#if isLoading}
          <div class="loader-state">
            <div class="spinner"></div>
            <p>Loading verses &amp; Urdu translation...</p>
          </div>
        {:else if loadError}
          <div class="error-state">
            <p>⚠️ {loadError}</p>
            <button
              type="button"
              class="retry-btn"
              onclick={() => loadSurahAyahs(selectedSurahNum, true)}
            >
              ↺ Retry Loading
            </button>
          </div>
        {:else if displayedAyahs.length === 0}
          <div class="empty-state">
            <p>No verses to display in range {startAyah} – {endAyah}.</p>
          </div>
        {:else}
          {#each displayedAyahs as ayah (ayah.numberInSurah)}
            {@const isPlaying = playingAyahNum === ayah.numberInSurah}
            <div class="single-ayah-card" class:playing={isPlaying}>
              <div class="ayah-card-head">
                <span class="ayah-number-badge">
                  Ayah {ayah.numberInSurah}
                </span>

                <button
                  type="button"
                  class="ayah-play-btn"
                  class:active={isPlaying}
                  onclick={() => playAyahAudio(ayah)}
                  title={isPlaying ? 'Pause recitation' : 'Listen to Ayah'}
                >
                  {#if isPlaying}
                    <span>⏸</span>
                  {:else}
                    <span class="play-symbol">▶</span>
                  {/if}
                </button>
              </div>

              <!-- Arabic Text -->
              <div
                class="arabic-verse-line"
                class:indopak={scriptMode === 'indopak'}
                dir="rtl"
              >
                {scriptMode === 'indopak' ? ayah.arabicIndopak : ayah.arabicUthmani}
              </div>

              <!-- Dashed Divider -->
              <div class="dashed-divider"></div>

              <!-- Urdu Meaning / Translation -->
              {#if ayah.urduText}
                <div class="urdu-meaning-line" dir="rtl">
                  {ayah.urduText}
                </div>
              {/if}
            </div>
          {/each}
        {/if}
      </div>

      <!-- FOOTER BUTTONS -->
      <div class="modal-footer-bar">
        <button
          type="button"
          class="footer-pill-btn prev-btn"
          onclick={handlePrevAyahs}
        >
          ◀ Prev Ayahs
        </button>

        <button
          type="button"
          class="footer-pill-btn next-btn"
          onclick={handleNextAyahs}
        >
          Next Ayahs ▶
        </button>

        <button
          type="button"
          class="footer-pill-btn close-btn"
          onclick={handleClose}
        >
          ✕ Close
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- EDIT YOUTUBE URL MODAL -->
{#if showEditUrlModal}
  <div
    class="edit-url-overlay"
    onclick={() => (showEditUrlModal = false)}
    role="button"
    tabindex="-1"
  >
    <div
      class="edit-url-box"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      tabindex="0"
    >
      <h3>✏️ Edit YouTube Recitation Link</h3>
      <p style="font-size: 12px; color: #64748b; margin-bottom: 8px;">
        Paste a YouTube video URL or playlist URL (e.g. https://youtu.be/... or https://youtube.com/playlist?list=...):
      </p>
      <input
        type="text"
        class="edit-url-input"
        bind:value={editUrlInput}
        placeholder="https://youtu.be/..."
      />
      <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 12px;">
        <button
          type="button"
          class="cancel-btn"
          onclick={() => (showEditUrlModal = false)}
        >
          Cancel
        </button>
        <button
          type="button"
          class="save-btn"
          onclick={saveCustomVideoUrl}
        >
          Save Link
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .evening-quran-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.65);
    backdrop-filter: blur(4px);
    z-index: 100000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(10px, 2vw, 20px);
  }

  .evening-quran-dialog {
    background: #ffffff;
    border: 2.5px solid var(--ink, #141413);
    border-radius: clamp(16px, 2.5vw, 24px);
    width: min(100%, 640px);
    height: min(92vh, 880px);
    display: flex;
    flex-direction: column;
    padding: clamp(14px, 2vw, 18px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 6px 0 var(--ink, #141413);
    overflow: hidden;
    animation: modalEnter 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .evening-quran-dialog.focus-mode {
    width: min(100%, 780px);
    height: 95vh;
  }

  @keyframes modalEnter {
    from {
      opacity: 0;
      transform: translateY(-14px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* TOP BAR */
  .modal-top-bar {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
    padding-bottom: 12px;
  }

  .top-title-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  .title-with-icon {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: clamp(14px, 2.2vw, 16.5px);
    font-weight: 800;
    color: #0f172a;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .book-icon {
    font-size: 16px;
    flex-shrink: 0;
  }

  .ayat-pill-badge {
    background: #ede9fe;
    color: #6d28d9;
    font-size: 11px;
    font-weight: 800;
    padding: 2px 10px;
    border-radius: 999px;
    width: fit-content;
  }

  .top-actions-group {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  .top-pill-btn {
    background: #ffffff;
    border-radius: 999px;
    padding: 4px 10px;
    font-size: 11.5px;
    font-weight: 800;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: all 0.15s;
  }

  .top-pill-btn.pk-btn {
    border: 1.5px solid #10b981;
    color: #059669;
  }

  .top-pill-btn.pk-btn.active {
    background: #ecfdf5;
  }

  .pk-flag {
    font-size: 9.5px;
    background: #10b981;
    color: #ffffff;
    padding: 1px 4px;
    border-radius: 3px;
    font-weight: 900;
  }

  .top-pill-btn.focus-btn {
    border: 1.5px solid #0d9488;
    color: #0f766e;
  }

  .top-pill-btn.focus-btn.active {
    background: #0d9488;
    color: #ffffff;
  }

  .close-round-btn {
    background: #ffffff;
    border: 1.5px solid var(--ink, #141413);
    border-radius: 8px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 900;
    color: #0f172a;
    cursor: pointer;
    transition: background 0.15s;
  }

  .close-round-btn:hover {
    background: #fee2e2;
  }

  /* SELECTOR CONTROLS ROW */
  .selector-controls-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    flex-wrap: wrap;
  }

  .surah-dropdown {
    flex: 1;
    min-width: 170px;
    background: #ffffff;
    border: 2px solid #cbd5e1;
    border-radius: 10px;
    padding: 6px 10px;
    font-size: 13.5px;
    font-weight: 700;
    color: #0f172a;
    outline: none;
  }

  .surah-dropdown:focus {
    border-color: #059669;
  }

  .range-inputs-wrap {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .range-num-input {
    width: 52px;
    background: #ffffff;
    border: 2px solid #cbd5e1;
    border-radius: 8px;
    padding: 5px 6px;
    font-size: 13.5px;
    font-weight: 800;
    text-align: center;
    color: #0f172a;
    outline: none;
  }

  .range-num-input:focus {
    border-color: #059669;
  }

  .range-sep {
    font-weight: 800;
    color: #64748b;
  }

  .load-net-btn {
    background: #f59e0b;
    color: #000000;
    border: 2px solid var(--ink, #141413);
    border-radius: 10px;
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 2px 0 var(--ink, #141413);
    display: inline-flex;
    align-items: center;
    gap: 5px;
    transition: transform 0.1s;
    white-space: nowrap;
  }

  .load-net-btn:active {
    transform: translateY(2px);
    box-shadow: none;
  }

  .reload-icon {
    font-size: 13px;
  }

  /* YOUTUBE CARD */
  .youtube-player-card {
    background: #0f172a;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .yt-header-bar {
    background: #0f172a;
    padding: 7px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .yt-title {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #ffffff;
    font-size: 12px;
    font-weight: 800;
  }

  .yt-play-icon {
    background: #2563eb;
    color: #ffffff;
    width: 17px;
    height: 17px;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
  }

  .yt-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .yt-ctrl-btn {
    background: #1e293b;
    border: 1px solid #334155;
    color: #93c5fd;
    border-radius: 6px;
    padding: 3px 8px;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
  }

  .yt-open-link {
    color: #cbd5e1;
    font-size: 11px;
    font-weight: 700;
    text-decoration: none;
  }

  .yt-open-link:hover {
    color: #ffffff;
    text-decoration: underline;
  }

  .yt-edit-btn {
    background: transparent;
    border: none;
    font-size: 12px;
    cursor: pointer;
    padding: 2px;
  }

  .yt-video-wrapper {
    position: relative;
    width: 100%;
    height: 195px;
    background: #000000;
  }

  .yt-iframe {
    width: 100%;
    height: 100%;
    border: none;
  }

  .yt-placeholder {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    font-size: 13px;
    gap: 8px;
  }

  .set-video-btn {
    background: #2563eb;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    padding: 5px 12px;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
  }

  /* BISMILLAH BANNER */
  .bismillah-banner-box {
    background: #ecfdf5;
    border: 1.5px solid #a7f3d0;
    border-radius: 12px;
    padding: 10px;
    margin-bottom: 10px;
    text-align: center;
  }

  .bismillah-calligraphy {
    font-family: 'Scheherazade New', 'Amiri', serif;
    font-size: clamp(22px, 3.5vw, 26px);
    font-weight: 700;
    color: #047857;
    line-height: 1.4;
  }

  /* AYAH CARDS SCROLL CONTAINER */
  .ayah-cards-scroll-container {
    flex: 1;
    overflow-y: auto;
    padding-right: 4px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f8fafc;
  }

  .ayah-cards-scroll-container::-webkit-scrollbar {
    width: 6px;
  }

  .ayah-cards-scroll-container::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 999px;
  }

  .single-ayah-card {
    background: #ffffff;
    border: 1.5px solid #e2e8f0;
    border-radius: 14px;
    padding: 12px 14px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    transition: border-color 0.15s, background 0.15s;
  }

  .single-ayah-card.playing {
    border-color: #059669;
    background: #f0fdf4;
  }

  .ayah-card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .ayah-number-badge {
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    color: #475569;
    font-size: 11px;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 6px;
  }

  .ayah-play-btn {
    background: #f0fdfa;
    border: 1.5px solid #0d9488;
    border-radius: 8px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    color: #0d9488;
    cursor: pointer;
    transition: all 0.15s;
  }

  .ayah-play-btn:hover {
    background: #ccfbf1;
  }

  .ayah-play-btn.active {
    background: #0d9488;
    color: #ffffff;
  }

  .play-symbol {
    margin-left: 2px;
  }

  .arabic-verse-line {
    font-size: clamp(22px, 3.5vw, 26px);
    font-weight: 600;
    color: #0f172a;
    text-align: right;
    line-height: 1.9;
    word-spacing: 3px;
    font-family: 'Amiri', 'Scheherazade New', serif;
  }

  .arabic-verse-line.indopak {
    font-family: 'Scheherazade New', 'Noto Nastaliq Urdu', 'Amiri', serif;
    line-height: 2.1;
  }

  .dashed-divider {
    border-bottom: 1px dashed #cbd5e1;
    margin: 10px 0;
  }

  .urdu-meaning-line {
    font-family: 'Noto Nastaliq Urdu', 'Scheherazade New', serif;
    font-size: 15.5px;
    line-height: 2.1;
    color: #334155;
    text-align: right;
  }

  /* LOADER & ERROR */
  .loader-state,
  .error-state,
  .empty-state {
    padding: 30px 16px;
    text-align: center;
    color: #64748b;
  }

  .spinner {
    width: 30px;
    height: 30px;
    border: 3px solid #e2e8f0;
    border-top-color: #059669;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 10px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .retry-btn {
    margin-top: 8px;
    background: #f1f5f9;
    border: 1.5px solid var(--ink, #141413);
    border-radius: 6px;
    padding: 5px 12px;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
  }

  /* FOOTER BAR */
  .modal-footer-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-top: 10px;
    margin-top: 8px;
    border-top: 1px solid #f1f5f9;
  }

  .footer-pill-btn {
    border-radius: 999px;
    padding: 7px 16px;
    font-size: 12.5px;
    font-weight: 800;
    cursor: pointer;
    transition: transform 0.1s;
    font-family: inherit;
  }

  .footer-pill-btn:active {
    transform: translateY(2px);
  }

  .footer-pill-btn.prev-btn {
    background: #ffffff;
    color: #0284c7;
    border: 2px solid #0284c7;
  }

  .footer-pill-btn.next-btn {
    background: #f59e0b;
    color: #000000;
    border: 2px solid var(--ink, #141413);
    box-shadow: 0 2px 0 var(--ink, #141413);
  }

  .footer-pill-btn.close-btn {
    flex: 1;
    background: #ffffff;
    color: #ef4444;
    border: 2px solid #ef4444;
    text-align: center;
  }

  /* EDIT URL MODAL */
  .edit-url-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100010;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }

  .edit-url-box {
    background: #ffffff;
    border: 2px solid var(--ink, #141413);
    border-radius: 16px;
    padding: 18px;
    width: min(100%, 420px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
  }

  .edit-url-input {
    width: 100%;
    border: 2px solid #cbd5e1;
    border-radius: 8px;
    padding: 8px 10px;
    font-size: 13px;
    font-weight: 600;
    outline: none;
  }

  .edit-url-input:focus {
    border-color: #2563eb;
  }

  .cancel-btn {
    background: #f1f5f9;
    border: 1.5px solid #cbd5e1;
    border-radius: 8px;
    padding: 6px 14px;
    font-weight: 700;
    font-size: 12px;
    cursor: pointer;
  }

  .save-btn {
    background: #059669;
    color: #ffffff;
    border: 1.5px solid var(--ink, #141413);
    border-radius: 8px;
    padding: 6px 16px;
    font-weight: 800;
    font-size: 12px;
    cursor: pointer;
  }
</style>
