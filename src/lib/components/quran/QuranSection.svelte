<script>
  import { onMount } from 'svelte';
  import { quranState } from '$lib/stores/quranState.svelte.js';
  import { SURAH_LIST, JUZ_LIST, POPULAR_SURAH_NUMBERS } from '$lib/data/quranData.js';
  import { triggerHaptic } from '$lib/utils/haptics.js';

  let customPageInput = $state('');
  let copyToastMessage = $state('');
  let copyToastTimeout = null;

  onMount(async () => {
    await quranState.init();
  });

  // Filtered Surahs computed
  let filteredSurahs = $derived.by(() => {
    const q = quranState.searchQuery.trim().toLowerCase();
    return SURAH_LIST.filter((s) => {
      // Type or category filter
      if (quranState.filterType === 'meccan' && s.type !== 'Meccan') return false;
      if (quranState.filterType === 'medinan' && s.type !== 'Medinan') return false;
      if (quranState.filterType === 'popular' && !POPULAR_SURAH_NUMBERS.includes(s.number)) return false;
      if (quranState.filterType === 'juz30' && s.juz !== 30) return false;

      // Text search
      if (!q) return true;
      return (
        s.englishName.toLowerCase().includes(q) ||
        s.englishMeaning.toLowerCase().includes(q) ||
        s.name.includes(q) ||
        String(s.number) === q
      );
    });
  });

  function selectSurah(num) {
    triggerHaptic('light');
    quranState.loadSurah(num, true);
  }

  function changeFilter(type) {
    triggerHaptic('selection');
    quranState.filterType = type;
  }

  function copyAyah(ayah) {
    triggerHaptic('light');
    const textToCopy = `${ayah.arabic}\n\n"${ayah.translation}"\n- Surah ${quranState.currentSurahData.englishName} (${quranState.currentSurahNumber}:${ayah.numberInSurah})`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      showToast('Ayah copied to clipboard! 📋');
    }
  }

  function showToast(msg) {
    copyToastMessage = msg;
    if (copyToastTimeout) clearTimeout(copyToastTimeout);
    copyToastTimeout = setTimeout(() => {
      copyToastMessage = '';
    }, 2500);
  }

  function handleSetCustomPages() {
    const p = parseInt(customPageInput, 10);
    if (!isNaN(p) && p >= 0 && p <= 604) {
      const delta = p - quranState.khatmah.pagesRead;
      quranState.logPages(delta);
      customPageInput = '';
      showToast(`Progress set to ${p} pages! ✨`);
    }
  }

  function nextSurah() {
    if (quranState.currentSurahNumber < 114) {
      quranState.loadSurah(quranState.currentSurahNumber + 1, true);
    }
  }

  function prevSurah() {
    if (quranState.currentSurahNumber > 1) {
      quranState.loadSurah(quranState.currentSurahNumber - 1, true);
    }
  }
</script>

<div class="quran-app-wrapper">
  <!-- Toast Notification -->
  {#if copyToastMessage}
    <div class="quran-toast">
      {copyToastMessage}
    </div>
  {/if}

  <!-- Header Section -->
  <div class="quran-main-header">
    <div class="header-left">
      <div class="quran-badge">
        <span class="badge-icon">📖</span>
        <span class="badge-text">QUR'AN</span>
      </div>
      <div class="header-titles">
        <h1 class="header-arabic-title">القُرْآن الكَرِيم</h1>
        <p class="header-subtitle">The Noble Qur'an • Read, Listen &amp; Track</p>
      </div>
    </div>

    <!-- Quick Navigation Tabs -->
    <div class="view-toggle-bar">
      <button
        type="button"
        class="view-toggle-btn"
        class:active={quranState.activeView === 'directory'}
        onclick={() => { triggerHaptic('selection'); quranState.activeView = 'directory'; }}
      >
        <span>📑</span> Surahs
      </button>
      <button
        type="button"
        class="view-toggle-btn"
        class:active={quranState.activeView === 'reader'}
        onclick={() => { triggerHaptic('selection'); quranState.activeView = 'reader'; }}
      >
        <span>📖</span> Reader
      </button>
      <button
        type="button"
        class="view-toggle-btn"
        class:active={quranState.activeView === 'khatmah'}
        onclick={() => { triggerHaptic('selection'); quranState.activeView = 'khatmah'; }}
      >
        <span>📊</span> Khatmah
      </button>
      <button
        type="button"
        class="view-toggle-btn"
        class:active={quranState.activeView === 'bookmarks'}
        onclick={() => { triggerHaptic('selection'); quranState.activeView = 'bookmarks'; }}
      >
        <span>🔖</span> Bookmarks ({quranState.bookmarks.length})
      </button>
    </div>
  </div>

  <!-- Quick Info Bar (Last Read & Khatmah Glance) -->
  <div class="quran-glance-bar">
    <div
      class="glance-card last-read-glance"
      onclick={() => quranState.loadSurah(quranState.lastRead.surahNumber, true)}
      role="button"
      tabindex="0"
      onkeydown={(e) => { if (e.key === 'Enter') quranState.loadSurah(quranState.lastRead.surahNumber, true); }}
    >
      <div class="glance-icon">📍</div>
      <div class="glance-info">
        <span class="glance-label">CONTINUE READING</span>
        <span class="glance-val">
          Surah {quranState.lastRead.surahName} (Ayah {quranState.lastRead.ayahNumber})
        </span>
      </div>
      <span class="glance-arrow">➔</span>
    </div>

    <div
      class="glance-card khatmah-glance"
      onclick={() => { quranState.activeView = 'khatmah'; }}
      role="button"
      tabindex="0"
      onkeydown={(e) => { if (e.key === 'Enter') quranState.activeView = 'khatmah'; }}
    >
      <div class="glance-icon">🎯</div>
      <div class="glance-info">
        <span class="glance-label">KHATMAH PROGRESS</span>
        <span class="glance-val">
          {quranState.khatmah.pagesRead} / 604 Pages ({((quranState.khatmah.pagesRead / 604) * 100).toFixed(1)}%)
        </span>
      </div>
      <div class="glance-meter-mini">
        <div class="meter-fill" style="width: {Math.min(100, (quranState.khatmah.pagesRead / 604) * 100)}%;"></div>
      </div>
    </div>
  </div>

  <!-- Daily Ayah Inspiration Banner -->
  {#if quranState.dailyReflection}
    <div class="daily-reflection-card">
      <div class="reflection-top">
        <span class="reflection-tag">✨ AYAH OF THE DAY • {quranState.dailyReflection.theme}</span>
        <span class="reflection-ref">{quranState.dailyReflection.surah} {quranState.dailyReflection.ayahRef}</span>
      </div>
      <div class="reflection-arabic" dir="rtl">
        {quranState.dailyReflection.arabic}
      </div>
      <div class="reflection-trans">
        "{quranState.dailyReflection.translation}"
      </div>
    </div>
  {/if}

  <!-- ================= VIEW 1: SURAHS DIRECTORY ================= -->
  {#if quranState.activeView === 'directory'}
    <div class="directory-container">
      <!-- Search & Filters -->
      <div class="search-filter-section">
        <div class="search-input-wrap">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            class="search-input"
            placeholder="Search Surah by name (e.g. Mulk, Yasin, Kahf) or number..."
            bind:value={quranState.searchQuery}
          />
          {#if quranState.searchQuery}
            <button
              type="button"
              class="clear-search-btn"
              onclick={() => { quranState.searchQuery = ''; }}
              title="Clear search"
            >
              ✕
            </button>
          {/if}
        </div>

        <!-- Filter Chips -->
        <div class="filter-chips-row">
          <button
            type="button"
            class="filter-chip"
            class:selected={quranState.filterType === 'all'}
            onclick={() => changeFilter('all')}
          >
            All Surahs (114)
          </button>
          <button
            type="button"
            class="filter-chip"
            class:selected={quranState.filterType === 'popular'}
            onclick={() => changeFilter('popular')}
          >
            ⭐ Most Recited
          </button>
          <button
            type="button"
            class="filter-chip"
            class:selected={quranState.filterType === 'juz30'}
            onclick={() => changeFilter('juz30')}
          >
            Juz 30 ('Amma)
          </button>
          <button
            type="button"
            class="filter-chip"
            class:selected={quranState.filterType === 'meccan'}
            onclick={() => changeFilter('meccan')}
          >
            Meccan (86)
          </button>
          <button
            type="button"
            class="filter-chip"
            class:selected={quranState.filterType === 'medinan'}
            onclick={() => changeFilter('medinan')}
          >
            Medinan (28)
          </button>
          <button
            type="button"
            class="filter-chip"
            class:selected={quranState.filterType === 'juz'}
            onclick={() => changeFilter('juz')}
          >
            📚 Browse by 30 Juz
          </button>
        </div>
      </div>

      <!-- If 'juz' filter is chosen, show 30 Juz grid -->
      {#if quranState.filterType === 'juz'}
        <div class="juz-grid">
          {#each JUZ_LIST as j (j.number)}
            <div
              class="juz-card"
              onclick={() => {
                const targetSurah = SURAH_LIST.find((s) => s.juz === j.number);
                if (targetSurah) selectSurah(targetSurah.number);
              }}
              role="button"
              tabindex="0"
              onkeydown={(e) => {
                if (e.key === 'Enter') {
                  const targetSurah = SURAH_LIST.find((s) => s.juz === j.number);
                  if (targetSurah) selectSurah(targetSurah.number);
                }
              }}
            >
              <div class="juz-num-pill">{j.number}</div>
              <div class="juz-info">
                <div class="juz-arabic-name" dir="rtl">{j.nameArabic}</div>
                <div class="juz-title">{j.nameEnglish}</div>
                <div class="juz-meta">{j.pagesCount} pages • Starts with {j.startSurah}</div>
              </div>
              <span class="juz-open-btn">Open ➔</span>
            </div>
          {/each}
        </div>
      {:else}
        <!-- Surahs Grid -->
        <div class="surah-grid">
          {#each filteredSurahs as s (s.number)}
            <button
              type="button"
              class="surah-card"
              onclick={() => selectSurah(s.number)}
            >
              <div class="surah-num-box">
                <span class="surah-number">{s.number}</span>
              </div>
              <div class="surah-center-info">
                <div class="surah-en-name">{s.englishName}</div>
                <div class="surah-en-meaning">{s.englishMeaning}</div>
                <div class="surah-tags">
                  <span class="surah-type-tag {s.type.toLowerCase()}">{s.type}</span>
                  <span class="surah-verses-tag">{s.ayahCount} Verses</span>
                  <span class="surah-juz-tag">Juz {s.juz}</span>
                </div>
              </div>
              <div class="surah-ar-box" dir="rtl">
                <div class="surah-ar-name">{s.name}</div>
              </div>
            </button>
          {/each}
        </div>
      {/if}
    </div>

  <!-- ================= VIEW 2: SURAH READER ================= -->
  {:else if quranState.activeView === 'reader'}
    <div class="reader-container">
      <!-- Reader Navigation Bar -->
      <div class="reader-nav-header">
        <button
          type="button"
          class="reader-back-btn"
          onclick={() => { triggerHaptic('light'); quranState.activeView = 'directory'; }}
        >
          <span>←</span> Back to Surahs
        </button>

        <div class="reader-surah-switcher">
          <button
            type="button"
            class="switch-surah-btn"
            disabled={quranState.currentSurahNumber <= 1}
            onclick={prevSurah}
            title="Previous Surah"
          >
            ◀
          </button>
          <span class="current-surah-indicator">
            {quranState.currentSurahNumber}. {quranState.currentSurahData.englishName}
          </span>
          <button
            type="button"
            class="switch-surah-btn"
            disabled={quranState.currentSurahNumber >= 114}
            onclick={nextSurah}
            title="Next Surah"
          >
            ▶
          </button>
        </div>

        <!-- Controls Toolbar -->
        <div class="reader-settings-toolbar">
          <div class="font-size-adjuster">
            <span class="font-label">Font:</span>
            <button
              type="button"
              class="font-btn"
              onclick={() => {
                quranState.arabicFontSize = Math.max(20, quranState.arabicFontSize - 2);
                quranState.saveSettings();
              }}
              title="Decrease Font Size"
            >
              A-
            </button>
            <span class="font-val">{quranState.arabicFontSize}px</span>
            <button
              type="button"
              class="font-btn"
              onclick={() => {
                quranState.arabicFontSize = Math.min(46, quranState.arabicFontSize + 2);
                quranState.saveSettings();
              }}
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          <div class="toggle-group">
            <button
              type="button"
              class="toggle-chip"
              class:active={quranState.showTranslation}
              onclick={() => {
                quranState.showTranslation = !quranState.showTranslation;
                quranState.saveSettings();
              }}
            >
              EN Translation
            </button>
            <button
              type="button"
              class="toggle-chip"
              class:active={quranState.showTransliteration}
              onclick={() => {
                quranState.showTransliteration = !quranState.showTransliteration;
                quranState.saveSettings();
              }}
            >
              Transliteration
            </button>
            <button
              type="button"
              class="toggle-chip mode-chip"
              onclick={() => {
                quranState.readingMode = quranState.readingMode === 'verses' ? 'mushaf' : 'verses';
                quranState.saveSettings();
              }}
            >
              {quranState.readingMode === 'verses' ? '📖 Mushaf Style' : '📋 Verse Cards'}
            </button>
          </div>
        </div>
      </div>

      <!-- Surah Banner Card -->
      <div class="surah-banner-card">
        <div class="banner-top">
          <span class="banner-badge">{quranState.currentSurahData.type}</span>
          <span class="banner-badge">{quranState.currentSurahData.ayahCount} Ayahs</span>
        </div>
        <div class="banner-ar-title" dir="rtl">
          {quranState.currentSurahData.name}
        </div>
        <div class="banner-en-title">
          Surah {quranState.currentSurahData.englishName}
        </div>
        <div class="banner-meaning">
          "{quranState.currentSurahData.englishMeaning}"
        </div>

        {#if quranState.currentSurahData.bismillahPre}
          <div class="banner-bismillah" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
        {/if}
      </div>

      <!-- Audio Status Bar if audio is active -->
      {#if quranState.isPlaying || quranState.audioLoading || quranState.currentPlayingAyah}
        <div class="audio-floating-bar">
          <div class="audio-status-info">
            <span class="sound-wave">🔊</span>
            <span class="audio-text">
              {#if quranState.audioLoading}
                Buffering recitation...
              {:else if quranState.isPlaying}
                Reciting Ayah {quranState.currentPlayingAyah} of {quranState.currentSurahData.englishName} (Mishary Alafasy)
              {:else}
                Paused at Ayah {quranState.currentPlayingAyah}
              {/if}
            </span>
          </div>
          <div class="audio-actions">
            {#if quranState.isPlaying}
              <button type="button" class="audio-ctrl-btn" onclick={() => quranState.pauseAudio()}>
                ⏸ Pause
              </button>
            {:else}
              <button type="button" class="audio-ctrl-btn play" onclick={() => quranState.resumeAudio()}>
                ▶ Resume
              </button>
            {/if}
            <button type="button" class="audio-ctrl-btn stop" onclick={() => quranState.stopAudio()}>
              ✕ Stop
            </button>
          </div>
        </div>
      {/if}

      <!-- Loading or Error States -->
      {#if quranState.isLoadingSurah}
        <div class="quran-loader-wrap">
          <div class="quran-spinner"></div>
          <p>Loading Surah {quranState.currentSurahNumber}... Rendering holy verses</p>
        </div>
      {:else if quranState.loadError}
        <div class="quran-error-wrap">
          <span class="error-icon">⚠️</span>
          <p>{quranState.loadError}</p>
          <div style="display: flex; gap: 8px; justify-content: center; margin-top: 10px;">
            <button
              type="button"
              class="retry-btn"
              onclick={() => quranState.loadSurah(quranState.currentSurahNumber, true)}
            >
              ↺ Retry
            </button>
            <button
              type="button"
              class="retry-btn"
              onclick={() => quranState.loadSurah(67, true)}
            >
              📖 Open Surah Al-Mulk (Offline)
            </button>
          </div>
        </div>
      {:else}
        <!-- ================= VERSE CARDS MODE ================= -->
        {#if quranState.readingMode === 'verses'}
          <div class="verses-list">
            {#each quranState.currentSurahData.ayahs as ayah (ayah.numberInSurah)}
              {@const isPlayingThis = quranState.isPlaying && quranState.currentPlayingAyah === ayah.numberInSurah}
              {@const bookmarked = quranState.isBookmarked(quranState.currentSurahNumber, ayah.numberInSurah)}
              {@const isLastRead = quranState.lastRead.surahNumber === quranState.currentSurahNumber && quranState.lastRead.ayahNumber === ayah.numberInSurah}

              <div
                class="ayah-card"
                class:active-reciting={isPlayingThis}
                class:last-read-active={isLastRead}
                id="ayah-{ayah.numberInSurah}"
              >
                <!-- Top Row: Ayah Number Badge & Tools -->
                <div class="ayah-card-topbar">
                  <div class="ayah-badge">
                    <span class="ayah-badge-pill">{quranState.currentSurahNumber}:{ayah.numberInSurah}</span>
                    {#if isLastRead}
                      <span class="last-read-tag">📍 Last Read</span>
                    {/if}
                  </div>

                  <div class="ayah-action-icons">
                    <!-- Play Audio Button -->
                    <button
                      type="button"
                      class="ayah-tool-btn play"
                      class:playing={isPlayingThis}
                      onclick={() => quranState.playAyahAudio(ayah)}
                      title="Play recitation audio for this Ayah"
                    >
                      {isPlayingThis ? '⏸ Pause' : '▶ Listen'}
                    </button>

                    <!-- Bookmark Button -->
                    <button
                      type="button"
                      class="ayah-tool-btn bookmark"
                      class:active={bookmarked}
                      onclick={() => quranState.toggleBookmark(ayah)}
                      title="Bookmark this Ayah"
                    >
                      {bookmarked ? '★ Saved' : '☆ Bookmark'}
                    </button>

                    <!-- Mark Last Read Button -->
                    <button
                      type="button"
                      class="ayah-tool-btn lastread"
                      onclick={() => {
                        triggerHaptic('light');
                        quranState.saveLastRead(quranState.currentSurahNumber, ayah.numberInSurah);
                        showToast(`Marked Ayah ${ayah.numberInSurah} as last read! 📍`);
                      }}
                      title="Mark as current reading position"
                    >
                      📍 Set Mark
                    </button>

                    <!-- Copy Ayah -->
                    <button
                      type="button"
                      class="ayah-tool-btn copy"
                      onclick={() => copyAyah(ayah)}
                      title="Copy Arabic & Translation"
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>

                <!-- Arabic Verse Text -->
                <div
                  class="ayah-arabic-text"
                  dir="rtl"
                  style="font-size: {quranState.arabicFontSize}px; line-height: {quranState.arabicFontSize * 1.95}px;"
                >
                  {ayah.arabic}
                  <span class="ayah-end-sign">۝{ayah.numberInSurah}</span>
                </div>

                <!-- Transliteration (if available and enabled) -->
                {#if quranState.showTransliteration && ayah.transliteration}
                  <div class="ayah-transliteration">
                    {ayah.transliteration}
                  </div>
                {/if}

                <!-- English Translation (if enabled) -->
                {#if quranState.showTranslation && ayah.translation}
                  <div class="ayah-translation">
                    {ayah.translation}
                  </div>
                {/if}
              </div>
            {/each}
          </div>

        <!-- ================= MUSHAF CONTINUOUS MODE ================= -->
        {:else}
          <div class="mushaf-view-container">
            <div class="mushaf-page-frame">
              <div
                class="mushaf-continuous-text"
                dir="rtl"
                style="font-size: {quranState.arabicFontSize}px; line-height: {quranState.arabicFontSize * 2.1}px;"
              >
                {#each quranState.currentSurahData.ayahs as ayah (ayah.numberInSurah)}
                  <span
                    class="mushaf-verse-span"
                    class:reciting-span={quranState.isPlaying && quranState.currentPlayingAyah === ayah.numberInSurah}
                    onclick={() => quranState.playAyahAudio(ayah)}
                    role="button"
                    tabindex="0"
                    onkeydown={(e) => { if (e.key === 'Enter') quranState.playAyahAudio(ayah); }}
                    title="Tap to listen to Ayah {ayah.numberInSurah}"
                  >
                    {ayah.arabic}
                    <span class="mushaf-end-glyph">۝{ayah.numberInSurah}</span>
                  </span>
                  {' '}
                {/each}
              </div>
            </div>
            <p class="mushaf-footer-hint">
              💡 Tip: Tap on any verse in Mushaf mode to listen to its recitation.
            </p>
          </div>
        {/if}
      {/if}
    </div>

  <!-- ================= VIEW 3: KHATMAH TRACKER ================= -->
  {:else if quranState.activeView === 'khatmah'}
    <div class="khatmah-container">
      <div class="khatmah-hero-card">
        <div class="khatmah-hero-head">
          <div>
            <h2 class="khatmah-title">🎯 Quran Khatmah Tracker</h2>
            <p class="khatmah-sub">Track your journey to completing the recitation of the 604 pages of the Holy Qur'an.</p>
          </div>
          <button
            type="button"
            class="khatmah-reset-btn"
            onclick={() => quranState.resetKhatmah()}
            title="Reset Khatmah progress"
          >
            ↺ Reset Cycle
          </button>
        </div>

        <div class="khatmah-stat-circle-row">
          <div class="stat-bubble">
            <div class="stat-bubble-val">{quranState.khatmah.pagesRead}</div>
            <div class="stat-bubble-lbl">Pages Read</div>
          </div>
          <div class="stat-bubble highlight">
            <div class="stat-bubble-val">{((quranState.khatmah.pagesRead / 604) * 100).toFixed(1)}%</div>
            <div class="stat-bubble-lbl">Completed</div>
          </div>
          <div class="stat-bubble">
            <div class="stat-bubble-val">{604 - quranState.khatmah.pagesRead}</div>
            <div class="stat-bubble-lbl">Pages Left</div>
          </div>
          <div class="stat-bubble">
            <div class="stat-bubble-val">{quranState.khatmah.completedJuz.length} / 30</div>
            <div class="stat-bubble-lbl">Juz Finished</div>
          </div>
        </div>

        <!-- Big Progress Bar -->
        <div class="khatmah-main-meter">
          <div
            class="meter-bar-fill"
            style="width: {Math.min(100, (quranState.khatmah.pagesRead / 604) * 100)}%;"
          ></div>
        </div>

        <!-- Quick Log Buttons -->
        <div class="quick-log-section">
          <span class="quick-log-lbl">Quick Add Pages Read:</span>
          <div class="quick-btn-group">
            <button type="button" class="quick-add-btn" onclick={() => quranState.logPages(1)}>+1 Page</button>
            <button type="button" class="quick-add-btn" onclick={() => quranState.logPages(2)}>+2 Pages</button>
            <button type="button" class="quick-add-btn" onclick={() => quranState.logPages(5)}>+5 Pages</button>
            <button type="button" class="quick-add-btn" onclick={() => quranState.logPages(10)}>+10 Pages</button>
            <button type="button" class="quick-add-btn juz-add" onclick={() => quranState.logPages(20)}>+1 Juz (~20 p.)</button>
            <button type="button" class="quick-add-btn minus" onclick={() => quranState.logPages(-1)}>-1</button>
          </div>
        </div>

        <!-- Manual Page Input -->
        <div class="manual-page-input-row">
          <span>Set Exact Current Page (1-604):</span>
          <input
            type="number"
            min="0"
            max="604"
            placeholder="e.g. 150"
            class="manual-num-input"
            bind:value={customPageInput}
            onkeydown={(e) => { if (e.key === 'Enter') handleSetCustomPages(); }}
          />
          <button type="button" class="manual-submit-btn" onclick={handleSetCustomPages}>
            Update
          </button>
        </div>
      </div>

      <!-- 30 Juz Checklist Grid -->
      <div class="juz-checklist-card">
        <h3 class="checklist-title">
          <span>🕋</span> 30 Juz Completion Checklist
        </h3>
        <p class="checklist-sub">Tap a Juz box to mark it as read during your current Khatmah cycle:</p>

        <div class="juz-matrix-grid">
          {#each JUZ_LIST as j (j.number)}
            {@const isDone = quranState.khatmah.completedJuz.includes(j.number)}
            <button
              type="button"
              class="juz-matrix-item"
              class:done={isDone}
              onclick={() => quranState.toggleJuzCompletion(j.number)}
            >
              <span class="juz-matrix-num">Juz {j.number}</span>
              <span class="juz-matrix-status">{isDone ? '✓ DONE' : '○ Pending'}</span>
              <span class="juz-matrix-name">{j.nameEnglish}</span>
            </button>
          {/each}
        </div>
      </div>
    </div>

  <!-- ================= VIEW 4: BOOKMARKS & NOTES ================= -->
  {:else if quranState.activeView === 'bookmarks'}
    <div class="bookmarks-container">
      <div class="bookmarks-head">
        <h2 class="bookmarks-title">🔖 Saved Verses &amp; Bookmarks</h2>
        <span class="bookmarks-count">{quranState.bookmarks.length} Verses</span>
      </div>

      {#if quranState.bookmarks.length === 0}
        <div class="empty-bookmarks-card">
          <span class="empty-icon">📖</span>
          <h3>No Bookmarked Verses Yet</h3>
          <p>While reading any Surah, tap the <strong>☆ Bookmark</strong> button on an Ayah to save it here for quick review and reflection.</p>
          <button
            type="button"
            class="explore-btn"
            onclick={() => { quranState.activeView = 'directory'; }}
          >
            Explore Surahs ➔
          </button>
        </div>
      {:else}
        <div class="bookmarks-list">
          {#each quranState.bookmarks as bm (bm.id)}
            <div class="bookmark-card">
              <div class="bm-header">
                <span class="bm-surah-tag">Surah {bm.surahName} ({bm.surahNumber}:{bm.ayahNumber})</span>
                <span class="bm-date">{bm.date}</span>
              </div>
              <div class="bm-arabic" dir="rtl">
                {bm.arabic}
              </div>
              <div class="bm-translation">
                "{bm.translation}"
              </div>
              <div class="bm-actions">
                <button
                  type="button"
                  class="bm-read-btn"
                  onclick={() => {
                    quranState.loadSurah(bm.surahNumber, true);
                  }}
                >
                  📖 Open Surah ➔
                </button>
                <button
                  type="button"
                  class="bm-delete-btn"
                  onclick={() => quranState.removeBookmark(bm.id)}
                  title="Remove Bookmark"
                >
                  ✕ Remove
                </button>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .quran-app-wrapper {
    max-width: 960px;
    margin: 0 auto;
    padding-bottom: 50px;
    font-family: inherit;
  }

  /* Toast Notification */
  .quran-toast {
    position: fixed;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: #0f172a;
    color: #f8fafc;
    border: 2px solid var(--ink, #141413);
    border-radius: 999px;
    padding: 10px 24px;
    font-weight: 800;
    font-size: 13.5px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
    z-index: 100000;
    animation: toastPop 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes toastPop {
    from {
      opacity: 0;
      transform: translate(-50%, -10px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }

  /* Main Header */
  .quran-main-header {
    background: #ffffff;
    border: 2.5px solid var(--ink, #141413);
    border-radius: 20px;
    padding: 18px 22px;
    margin-bottom: 16px;
    box-shadow: 0 4px 0 var(--ink, #141413);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .quran-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #ecfdf5;
    color: #047857;
    border: 2px solid var(--ink, #141413);
    border-radius: 999px;
    padding: 6px 14px;
    font-weight: 800;
    font-size: 13px;
    box-shadow: 0 2px 0 var(--ink, #141413);
  }

  .header-arabic-title {
    font-family: 'Amiri', 'Scheherazade New', serif;
    font-size: clamp(24px, 4vw, 32px);
    font-weight: 700;
    color: #064e3b;
    line-height: 1.1;
    margin: 0;
  }

  .header-subtitle {
    font-size: 12.5px;
    font-weight: 700;
    color: #475569;
    margin: 2px 0 0 0;
  }

  /* View Toggle Buttons */
  .view-toggle-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .view-toggle-btn {
    background: #f8fafc;
    border: 2px solid var(--ink, #141413);
    border-radius: 12px;
    padding: 8px 14px;
    font-size: 13px;
    font-weight: 800;
    color: #334155;
    cursor: pointer;
    box-shadow: 0 2px 0 var(--ink, #141413);
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: transform 0.1s, background 0.15s;
  }

  .view-toggle-btn:hover {
    background: #f1f5f9;
  }

  .view-toggle-btn:active {
    transform: translateY(2px);
    box-shadow: none;
  }

  .view-toggle-btn.active {
    background: #047857;
    color: #ffffff;
    border-color: var(--ink, #141413);
  }

  /* Glance Bar */
  .quran-glance-bar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 12px;
    margin-bottom: 16px;
  }

  .glance-card {
    background: #ffffff;
    border: 2.5px solid var(--ink, #141413);
    border-radius: 16px;
    padding: 12px 16px;
    box-shadow: 0 3px 0 var(--ink, #141413);
    display: flex;
    align-items: center;
    gap: 14px;
    cursor: pointer;
    transition: transform 0.1s, background 0.15s;
  }

  .glance-card:hover {
    background: #fdfaf3;
  }

  .glance-card:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 var(--ink, #141413);
  }

  .glance-icon {
    font-size: 24px;
    background: #ecfdf5;
    border: 2px solid var(--ink, #141413);
    border-radius: 12px;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .glance-info {
    flex: 1;
    min-width: 0;
  }

  .glance-label {
    display: block;
    font-size: 10.5px;
    font-weight: 800;
    color: #047857;
    letter-spacing: 0.5px;
  }

  .glance-val {
    display: block;
    font-size: 13.5px;
    font-weight: 800;
    color: #0f172a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .glance-arrow {
    font-size: 16px;
    font-weight: 900;
    color: #047857;
  }

  .glance-meter-mini {
    width: 70px;
    height: 10px;
    background: #e2e8f0;
    border: 1.5px solid var(--ink, #141413);
    border-radius: 999px;
    overflow: hidden;
  }

  .meter-fill {
    height: 100%;
    background: #10b981;
    border-radius: 999px;
  }

  /* Daily Reflection Card */
  .daily-reflection-card {
    background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
    border: 2.5px solid var(--ink, #141413);
    border-radius: 16px;
    padding: 16px 20px;
    margin-bottom: 20px;
    box-shadow: 0 3px 0 var(--ink, #141413);
  }

  .reflection-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 11.5px;
    font-weight: 800;
  }

  .reflection-tag {
    color: #047857;
  }

  .reflection-ref {
    color: #475569;
    background: #ffffff;
    border: 1.5px solid #cbd5e1;
    border-radius: 6px;
    padding: 2px 8px;
  }

  .reflection-arabic {
    font-family: 'Amiri', 'Scheherazade New', serif;
    font-size: clamp(20px, 3.5vw, 24px);
    color: #064e3b;
    font-weight: 700;
    line-height: 1.8;
    margin-bottom: 6px;
    text-align: right;
  }

  .reflection-trans {
    font-size: 13.5px;
    font-style: italic;
    color: #334155;
    font-weight: 600;
    line-height: 1.5;
  }

  /* Search & Filter Section */
  .search-filter-section {
    background: #ffffff;
    border: 2.5px solid var(--ink, #141413);
    border-radius: 18px;
    padding: 14px 18px;
    margin-bottom: 20px;
    box-shadow: 0 3px 0 var(--ink, #141413);
  }

  .search-input-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #f8fafc;
    border: 2px solid var(--ink, #141413);
    border-radius: 12px;
    padding: 8px 14px;
    margin-bottom: 12px;
  }

  .search-icon {
    font-size: 16px;
  }

  .search-input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 14px;
    font-weight: 700;
    color: #0f172a;
    outline: none;
    font-family: inherit;
  }

  .clear-search-btn {
    background: #e2e8f0;
    border: none;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    font-size: 11px;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .filter-chips-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .filter-chip {
    background: #f1f5f9;
    border: 1.5px solid var(--ink, #141413);
    border-radius: 999px;
    padding: 5px 12px;
    font-size: 12px;
    font-weight: 800;
    color: #334155;
    cursor: pointer;
    transition: background 0.15s;
  }

  .filter-chip:hover {
    background: #e2e8f0;
  }

  .filter-chip.selected {
    background: #047857;
    color: #ffffff;
  }

  /* Surah Grid */
  .surah-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
  }

  .surah-card {
    background: #ffffff;
    border: 2.5px solid var(--ink, #141413);
    border-radius: 16px;
    padding: 12px 14px;
    box-shadow: 0 3px 0 var(--ink, #141413);
    display: flex;
    align-items: center;
    gap: 12px;
    text-align: left;
    cursor: pointer;
    transition: transform 0.1s, background 0.15s;
    font-family: inherit;
  }

  .surah-card:hover {
    background: #fdfaf3;
  }

  .surah-card:active {
    transform: translateY(2px);
    box-shadow: 0 1px 0 var(--ink, #141413);
  }

  .surah-num-box {
    background: #ecfdf5;
    border: 2px solid var(--ink, #141413);
    border-radius: 12px;
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .surah-number {
    font-size: 15px;
    font-weight: 900;
    color: #047857;
  }

  .surah-center-info {
    flex: 1;
    min-width: 0;
  }

  .surah-en-name {
    font-size: 15px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.2;
  }

  .surah-en-meaning {
    font-size: 11.5px;
    font-weight: 600;
    color: #64748b;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .surah-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    font-size: 10.5px;
    font-weight: 800;
  }

  .surah-type-tag {
    padding: 1px 6px;
    border-radius: 4px;
    border: 1px solid #cbd5e1;
    background: #f8fafc;
    color: #475569;
  }

  .surah-type-tag.meccan {
    background: #fef3c7;
    color: #92400e;
    border-color: #fde68a;
  }

  .surah-type-tag.medinan {
    background: #dbeafe;
    color: #1e40af;
    border-color: #bfdbfe;
  }

  .surah-verses-tag,
  .surah-juz-tag {
    padding: 1px 6px;
    border-radius: 4px;
    background: #f1f5f9;
    color: #475569;
  }

  .surah-ar-box {
    flex-shrink: 0;
  }

  .surah-ar-name {
    font-family: 'Amiri', 'Scheherazade New', serif;
    font-size: 20px;
    font-weight: 700;
    color: #064e3b;
  }

  /* Juz Grid */
  .juz-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
  }

  .juz-card {
    background: #ffffff;
    border: 2.5px solid var(--ink, #141413);
    border-radius: 16px;
    padding: 14px 16px;
    box-shadow: 0 3px 0 var(--ink, #141413);
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: transform 0.1s, background 0.15s;
  }

  .juz-card:hover {
    background: #fdfaf3;
  }

  .juz-num-pill {
    background: #fef3c7;
    border: 2px solid var(--ink, #141413);
    border-radius: 12px;
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 14px;
    color: #92400e;
    flex-shrink: 0;
  }

  .juz-info {
    flex: 1;
    min-width: 0;
  }

  .juz-arabic-name {
    font-family: 'Amiri', serif;
    font-size: 17px;
    font-weight: 700;
    color: #064e3b;
  }

  .juz-title {
    font-size: 14px;
    font-weight: 800;
    color: #0f172a;
  }

  .juz-meta {
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
  }

  .juz-open-btn {
    font-size: 12px;
    font-weight: 800;
    color: #047857;
  }

  /* ================= READER STYLES ================= */
  .reader-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .reader-nav-header {
    background: #ffffff;
    border: 2.5px solid var(--ink, #141413);
    border-radius: 18px;
    padding: 12px 18px;
    box-shadow: 0 3px 0 var(--ink, #141413);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .reader-back-btn {
    background: #f8fafc;
    border: 2px solid var(--ink, #141413);
    border-radius: 10px;
    padding: 6px 14px;
    font-size: 13px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 2px 0 var(--ink, #141413);
  }

  .reader-surah-switcher {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .switch-surah-btn {
    background: #f1f5f9;
    border: 2px solid var(--ink, #141413);
    border-radius: 8px;
    padding: 4px 10px;
    font-weight: 800;
    cursor: pointer;
  }

  .switch-surah-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .current-surah-indicator {
    font-size: 14px;
    font-weight: 800;
    color: #0f172a;
  }

  .reader-settings-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
  }

  .font-size-adjuster {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #f8fafc;
    border: 1.5px solid #cbd5e1;
    border-radius: 8px;
    padding: 2px 6px;
  }

  .font-label {
    font-size: 11px;
    font-weight: 800;
    color: #64748b;
  }

  .font-btn {
    background: #ffffff;
    border: 1.5px solid var(--ink, #141413);
    border-radius: 6px;
    font-size: 11px;
    font-weight: 800;
    padding: 2px 6px;
    cursor: pointer;
  }

  .font-val {
    font-size: 11px;
    font-weight: 800;
  }

  .toggle-group {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .toggle-chip {
    background: #f1f5f9;
    border: 1.5px solid var(--ink, #141413);
    border-radius: 8px;
    padding: 4px 10px;
    font-size: 11.5px;
    font-weight: 800;
    color: #475569;
    cursor: pointer;
  }

  .toggle-chip.active {
    background: #047857;
    color: #ffffff;
  }

  .toggle-chip.mode-chip {
    background: #fef3c7;
    color: #92400e;
  }

  /* Surah Banner Card */
  .surah-banner-card {
    background: radial-gradient(circle at top right, #f0fdf4 0%, #ffffff 100%);
    border: 2.5px solid var(--ink, #141413);
    border-radius: 20px;
    padding: 22px 20px;
    text-align: center;
    box-shadow: 0 4px 0 var(--ink, #141413);
  }

  .banner-top {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .banner-badge {
    background: #ecfdf5;
    color: #047857;
    border: 1.5px solid #a7f3d0;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 800;
    padding: 2px 10px;
  }

  .banner-ar-title {
    font-family: 'Amiri', 'Scheherazade New', serif;
    font-size: clamp(34px, 6vw, 48px);
    font-weight: 700;
    color: #064e3b;
    margin: 4px 0;
  }

  .banner-en-title {
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
  }

  .banner-meaning {
    font-size: 13.5px;
    font-weight: 600;
    color: #64748b;
    font-style: italic;
  }

  .banner-bismillah {
    font-family: 'Amiri', serif;
    font-size: clamp(24px, 4vw, 30px);
    font-weight: 700;
    color: #047857;
    margin-top: 18px;
    padding-top: 14px;
    border-top: 1.5px dashed #cbd5e1;
  }

  /* Audio Floating Bar */
  .audio-floating-bar {
    position: sticky;
    top: 16px;
    z-index: 1000;
    background: #0f172a;
    color: #ffffff;
    border: 2.5px solid var(--ink, #141413);
    border-radius: 16px;
    padding: 10px 18px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .audio-status-info {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12.5px;
    font-weight: 700;
  }

  .sound-wave {
    font-size: 18px;
    animation: wavePulse 1s infinite alternate;
  }

  @keyframes wavePulse {
    from { transform: scale(0.9); }
    to { transform: scale(1.15); }
  }

  .audio-actions {
    display: flex;
    gap: 8px;
  }

  .audio-ctrl-btn {
    border: none;
    border-radius: 8px;
    padding: 5px 12px;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
  }

  .audio-ctrl-btn.play {
    background: #10b981;
    color: #ffffff;
  }

  .audio-ctrl-btn.stop {
    background: #334155;
    color: #cbd5e1;
  }

  /* Verse Cards */
  .verses-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .ayah-card {
    background: #ffffff;
    border: 2.5px solid var(--ink, #141413);
    border-radius: 18px;
    padding: 18px 20px;
    box-shadow: 0 3px 0 var(--ink, #141413);
    transition: background 0.15s, border-color 0.15s;
  }

  .ayah-card.active-reciting {
    background: #f0fdf4;
    border-color: #059669;
    box-shadow: 0 4px 0 #059669;
  }

  .ayah-card.last-read-active {
    border-left: 8px solid #f59e0b;
  }

  .ayah-card-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    padding-bottom: 12px;
    margin-bottom: 14px;
    border-bottom: 1.5px solid #f1f5f9;
  }

  .ayah-badge {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ayah-badge-pill {
    background: #ecfdf5;
    color: #047857;
    border: 1.5px solid #a7f3d0;
    border-radius: 8px;
    padding: 3px 10px;
    font-size: 12px;
    font-weight: 900;
  }

  .last-read-tag {
    background: #fef3c7;
    color: #b45309;
    border: 1.5px solid #fde68a;
    border-radius: 6px;
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 800;
  }

  .ayah-action-icons {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .ayah-tool-btn {
    background: #f8fafc;
    border: 1.5px solid var(--ink, #141413);
    border-radius: 8px;
    padding: 3px 10px;
    font-size: 11.5px;
    font-weight: 800;
    color: #334155;
    cursor: pointer;
    transition: background 0.15s;
  }

  .ayah-tool-btn:hover {
    background: #e2e8f0;
  }

  .ayah-tool-btn.play {
    background: #ecfdf5;
    color: #047857;
  }

  .ayah-tool-btn.play.playing {
    background: #047857;
    color: #ffffff;
  }

  .ayah-tool-btn.bookmark.active {
    background: #fef3c7;
    color: #92400e;
    border-color: #f59e0b;
  }

  .ayah-arabic-text {
    font-family: 'Amiri', 'Scheherazade New', serif;
    color: #0f172a;
    text-align: right;
    font-weight: 600;
    letter-spacing: 0.3px;
    margin-bottom: 14px;
    word-spacing: 3px;
  }

  .ayah-end-sign {
    font-family: 'Amiri', serif;
    color: #047857;
    font-weight: 700;
    font-size: 0.9em;
    margin-right: 6px;
    display: inline-block;
  }

  .ayah-transliteration {
    font-size: 13.5px;
    font-style: italic;
    color: #475569;
    margin-bottom: 8px;
    line-height: 1.5;
  }

  .ayah-translation {
    font-size: 14.5px;
    font-weight: 600;
    color: #1e293b;
    line-height: 1.6;
    padding-top: 6px;
    border-top: 1px dashed #e2e8f0;
  }

  /* Mushaf Continuous Mode */
  .mushaf-view-container {
    background: #ffffff;
    border: 2.5px solid var(--ink, #141413);
    border-radius: 20px;
    padding: 24px clamp(16px, 4vw, 36px);
    box-shadow: 0 4px 0 var(--ink, #141413);
  }

  .mushaf-page-frame {
    background: #fdfcf7;
    border: 2px solid #e7e0c9;
    border-radius: 14px;
    padding: 24px clamp(14px, 3vw, 32px);
  }

  .mushaf-continuous-text {
    font-family: 'Amiri', 'Scheherazade New', serif;
    color: #1a1a1a;
    text-align: justify;
    text-align-last: center;
    font-weight: 600;
    word-spacing: 4px;
  }

  .mushaf-verse-span {
    cursor: pointer;
    border-radius: 4px;
    padding: 2px 4px;
    transition: background 0.15s;
  }

  .mushaf-verse-span:hover {
    background: #fef9c3;
  }

  .mushaf-verse-span.reciting-span {
    background: #a7f3d0;
    color: #064e3b;
  }

  .mushaf-end-glyph {
    color: #047857;
    font-weight: 800;
    font-size: 0.85em;
    padding: 0 4px;
  }

  .mushaf-footer-hint {
    text-align: center;
    font-size: 12px;
    color: #64748b;
    margin-top: 14px;
    font-weight: 700;
  }

  /* Loader & Error */
  .quran-loader-wrap,
  .quran-error-wrap {
    background: #ffffff;
    border: 2.5px solid var(--ink, #141413);
    border-radius: 18px;
    padding: 30px;
    text-align: center;
    box-shadow: 0 3px 0 var(--ink, #141413);
  }

  .quran-spinner {
    width: 36px;
    height: 36px;
    border: 4px solid #e2e8f0;
    border-top-color: #047857;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 12px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .retry-btn {
    background: #f8fafc;
    border: 2px solid var(--ink, #141413);
    border-radius: 10px;
    padding: 6px 16px;
    font-weight: 800;
    font-size: 13px;
    cursor: pointer;
  }

  /* ================= KHATMAH TRACKER ================= */
  .khatmah-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .khatmah-hero-card {
    background: #ffffff;
    border: 2.5px solid var(--ink, #141413);
    border-radius: 20px;
    padding: 22px;
    box-shadow: 0 4px 0 var(--ink, #141413);
  }

  .khatmah-hero-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 20px;
  }

  .khatmah-title {
    font-size: 20px;
    font-weight: 900;
    color: #0f172a;
    margin: 0;
  }

  .khatmah-sub {
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    margin: 4px 0 0;
  }

  .khatmah-reset-btn {
    background: #fef2f2;
    color: #dc2626;
    border: 2px solid var(--ink, #141413);
    border-radius: 10px;
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 2px 0 var(--ink, #141413);
  }

  .khatmah-stat-circle-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 12px;
    margin-bottom: 20px;
  }

  .stat-bubble {
    background: #f8fafc;
    border: 2px solid var(--ink, #141413);
    border-radius: 16px;
    padding: 14px 10px;
    text-align: center;
  }

  .stat-bubble.highlight {
    background: #ecfdf5;
    border-color: var(--ink, #141413);
  }

  .stat-bubble-val {
    font-size: clamp(20px, 3vw, 26px);
    font-weight: 900;
    color: #0f172a;
  }

  .stat-bubble.highlight .stat-bubble-val {
    color: #047857;
  }

  .stat-bubble-lbl {
    font-size: 11px;
    font-weight: 800;
    color: #64748b;
    margin-top: 2px;
  }

  .khatmah-main-meter {
    height: 18px;
    background: #f1f5f9;
    border: 2px solid var(--ink, #141413);
    border-radius: 999px;
    overflow: hidden;
    margin-bottom: 22px;
  }

  .meter-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #10b981 0%, #059669 100%);
    border-radius: 999px;
    transition: width 0.3s ease;
  }

  .quick-log-section {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1.5px solid #f1f5f9;
  }

  .quick-log-lbl {
    font-size: 12.5px;
    font-weight: 800;
    color: #334155;
  }

  .quick-btn-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .quick-add-btn {
    background: #ffffff;
    border: 2px solid var(--ink, #141413);
    border-radius: 10px;
    padding: 6px 14px;
    font-size: 12.5px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 2px 0 var(--ink, #141413);
    transition: transform 0.1s, background 0.15s;
  }

  .quick-add-btn:active {
    transform: translateY(2px);
    box-shadow: none;
  }

  .quick-add-btn.juz-add {
    background: #ecfdf5;
    color: #047857;
  }

  .quick-add-btn.minus {
    background: #fef2f2;
    color: #dc2626;
  }

  .manual-page-input-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    font-size: 12.5px;
    font-weight: 800;
    color: #475569;
  }

  .manual-num-input {
    width: 90px;
    background: #f8fafc;
    border: 2px solid var(--ink, #141413);
    border-radius: 8px;
    padding: 6px 10px;
    font-weight: 800;
    font-size: 13.5px;
    text-align: center;
    outline: none;
  }

  .manual-submit-btn {
    background: #047857;
    color: #ffffff;
    border: 2px solid var(--ink, #141413);
    border-radius: 8px;
    padding: 6px 14px;
    font-size: 12.5px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 2px 0 var(--ink, #141413);
  }

  /* Juz Checklist Card */
  .juz-checklist-card {
    background: #ffffff;
    border: 2.5px solid var(--ink, #141413);
    border-radius: 20px;
    padding: 22px;
    box-shadow: 0 4px 0 var(--ink, #141413);
  }

  .checklist-title {
    font-size: 18px;
    font-weight: 900;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
  }

  .checklist-sub {
    font-size: 12.5px;
    color: #64748b;
    font-weight: 600;
    margin: 4px 0 16px;
  }

  .juz-matrix-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 10px;
  }

  .juz-matrix-item {
    background: #f8fafc;
    border: 2px solid var(--ink, #141413);
    border-radius: 12px;
    padding: 10px 8px;
    text-align: center;
    cursor: pointer;
    transition: transform 0.1s, background 0.15s;
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-family: inherit;
  }

  .juz-matrix-item:active {
    transform: translateY(2px);
  }

  .juz-matrix-item.done {
    background: #ecfdf5;
    border-color: #059669;
  }

  .juz-matrix-num {
    font-size: 13.5px;
    font-weight: 900;
    color: #0f172a;
  }

  .juz-matrix-status {
    font-size: 10px;
    font-weight: 800;
    color: #64748b;
  }

  .juz-matrix-item.done .juz-matrix-status {
    color: #059669;
  }

  .juz-matrix-name {
    font-size: 10.5px;
    font-weight: 600;
    color: #94a3b8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ================= BOOKMARKS ================= */
  .bookmarks-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .bookmarks-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ffffff;
    border: 2.5px solid var(--ink, #141413);
    border-radius: 18px;
    padding: 14px 20px;
    box-shadow: 0 3px 0 var(--ink, #141413);
  }

  .bookmarks-title {
    font-size: 18px;
    font-weight: 900;
    color: #0f172a;
    margin: 0;
  }

  .bookmarks-count {
    background: #fef3c7;
    color: #92400e;
    border: 1.5px solid #fde68a;
    border-radius: 999px;
    padding: 3px 12px;
    font-size: 12px;
    font-weight: 800;
  }

  .empty-bookmarks-card {
    background: #ffffff;
    border: 2.5px solid var(--ink, #141413);
    border-radius: 20px;
    padding: 40px 20px;
    text-align: center;
    box-shadow: 0 4px 0 var(--ink, #141413);
  }

  .empty-icon {
    font-size: 44px;
    display: block;
    margin-bottom: 12px;
  }

  .empty-bookmarks-card h3 {
    font-size: 18px;
    font-weight: 900;
    color: #0f172a;
    margin-bottom: 6px;
  }

  .empty-bookmarks-card p {
    font-size: 13.5px;
    color: #64748b;
    max-width: 440px;
    margin: 0 auto 18px;
    line-height: 1.5;
  }

  .explore-btn {
    background: #047857;
    color: #ffffff;
    border: 2px solid var(--ink, #141413);
    border-radius: 12px;
    padding: 10px 22px;
    font-size: 13.5px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 3px 0 var(--ink, #141413);
  }

  .bookmarks-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .bookmark-card {
    background: #ffffff;
    border: 2.5px solid var(--ink, #141413);
    border-radius: 18px;
    padding: 18px 20px;
    box-shadow: 0 3px 0 var(--ink, #141413);
  }

  .bm-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 12px;
    font-weight: 800;
  }

  .bm-surah-tag {
    background: #ecfdf5;
    color: #047857;
    border: 1.5px solid #a7f3d0;
    border-radius: 6px;
    padding: 2px 8px;
  }

  .bm-date {
    color: #94a3b8;
  }

  .bm-arabic {
    font-family: 'Amiri', 'Scheherazade New', serif;
    font-size: 22px;
    color: #064e3b;
    text-align: right;
    line-height: 1.8;
    margin-bottom: 8px;
    font-weight: 700;
  }

  .bm-translation {
    font-size: 14px;
    color: #334155;
    font-style: italic;
    line-height: 1.5;
    margin-bottom: 12px;
  }

  .bm-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  .bm-read-btn {
    background: #047857;
    color: #ffffff;
    border: 1.5px solid var(--ink, #141413);
    border-radius: 8px;
    padding: 5px 14px;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 2px 0 var(--ink, #141413);
  }

  .bm-delete-btn {
    background: #fef2f2;
    color: #dc2626;
    border: 1.5px solid var(--ink, #141413);
    border-radius: 8px;
    padding: 5px 12px;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
  }
</style>
