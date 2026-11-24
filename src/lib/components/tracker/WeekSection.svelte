<script>
  import { onMount } from 'svelte';
  import { trackerState } from '$lib/stores/trackerState.svelte.js';
  import { openExternalUrl } from '$lib/utils/openLink.js';
  import { playPageFlipSound } from '$lib/utils/audioRustle.js';

  let activeWeekPage = $state(/** @type {'zad' | 'uq'} */ ('zad'));

  let showZadModal = $state(false);
  let zadName = $state('');
  let zadLectures = $state(25);
  let zadUrl = $state('');

  let showUqModal = $state(false);
  let uqName = $state('');
  let uqLectures = $state(20);
  let uqUrl = $state('');

  // Editing state (null = adding a new subject)
  let editingZadId = $state(/** @type {string | null} */ (null));
  let editingUqId = $state(/** @type {string | null} */ (null));

  onMount(() => {
    trackerState.init();
  });

  /**
   * @param {'zad' | 'uq'} page
   */
  function goToWeekPage(page) {
    if (activeWeekPage !== page) {
      activeWeekPage = page;
      playPageFlipSound(true);
    }
  }

  /**
   * @param {MouseEvent} event
   */
  function handlePageClick(event) {
    // Ignore clicks on buttons, links, inputs, and interactive elements
    const target = /** @type {HTMLElement} */ (event.target);
    if (
      target.closest(
        'button, a, input, select, textarea, .hair-wash-btn, .small-blue-link, .grammar-add-topic-btn, .channel-header-btn'
      )
    ) {
      return;
    }
    const currentTarget = /** @type {HTMLElement} */ (event.currentTarget);
    const rect = currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    if (clickX < rect.width / 2) {
      goToWeekPage('zad');
    } else {
      goToWeekPage('uq');
    }
  }

  /**
   * @param {{ id: string; name: string; playlistUrl?: string }} subj
   */
  function getZadUrl(subj) {
    if (subj.playlistUrl && subj.playlistUrl.trim() && subj.playlistUrl !== 'https://youtube.com/@academyzaden' && !subj.playlistUrl.includes('search_query=')) {
      return subj.playlistUrl.trim();
    }
    const name = subj.name.toLowerCase();
    if (subj.id === 'aqeedah' || name.includes('aqeedah') || name.includes('alqedah')) {
      return 'https://www.youtube.com/playlist?list=PLDOc9rkFwfwA7LVnGN1E9CWhZZ0DL0VWm';
    }
    if (subj.id === 'fiqh' || name.includes('fiqh')) {
      return 'https://www.youtube.com/playlist?list=PLDOc9rkFwfwD4Yxk6qCwcfnUIXiA6iIeU';
    }
    if (subj.id === 'seerah' || name.includes('seerah') || name.includes('serah')) {
      return 'https://www.youtube.com/playlist?list=PLDOc9rkFwfwBA0g3JSYqdoQlqw0tum0Fd';
    }
    if (subj.id === 'tarbiyah' || name.includes('tarbiyah') || name.includes('education')) {
      return 'https://www.youtube.com/playlist?list=PLDOc9rkFwfwDl5V60aZu-qgSRl99lxubI';
    }
    return subj.playlistUrl?.trim() || 'https://www.youtube.com/@academyzaden/playlists';
  }

  /**
   * @param {{ id: string; name: string; playlistUrl?: string }} subj
   */
  function getUqUrl(subj) {
    if (subj.playlistUrl && subj.playlistUrl.trim() && !subj.playlistUrl.endsWith('@understandquran') && !subj.playlistUrl.includes('search_query=')) {
      return subj.playlistUrl.trim();
    }
    const name = subj.name.toLowerCase();
    if (subj.id === 'quran_course_2' || name.includes('grammar')) {
      return 'https://www.youtube.com/playlist?list=PL62RQxDpIL7VhZuvQkggarKVAe9YvaePR';
    }
    return 'https://www.youtube.com/playlist?list=PL62RQxDpIL7Uz-AUKjxMqdIKErqpRmESh';
  }

  function openZadAdd() {
    editingZadId = null;
    zadName = '';
    zadLectures = 25;
    zadUrl = '';
    showZadModal = true;
  }

  /** @param {{ id: string; name: string; totalLectures: number; playlistUrl?: string }} subj */
  function openZadEdit(subj) {
    editingZadId = subj.id;
    zadName = subj.name;
    zadLectures = subj.totalLectures;
    zadUrl = subj.playlistUrl || getZadUrl(subj);
    showZadModal = true;
  }

  function closeZadModal() {
    showZadModal = false;
    editingZadId = null;
    zadName = '';
    zadUrl = '';
  }

  async function handleAddZad() {
    if (zadName.trim()) {
      const lectures = Number(zadLectures) || 25;
      if (editingZadId) {
        await trackerState.updateZadSubject(editingZadId, zadName.trim(), lectures, zadUrl.trim());
      } else {
        await trackerState.addZadSubject(zadName.trim(), lectures, zadUrl.trim());
      }
      closeZadModal();
    }
  }

  function openUqAdd() {
    editingUqId = null;
    uqName = '';
    uqLectures = 20;
    uqUrl = '';
    showUqModal = true;
  }

  /** @param {{ id: string; name: string; totalLectures: number; playlistUrl?: string }} subj */
  function openUqEdit(subj) {
    editingUqId = subj.id;
    uqName = subj.name;
    uqLectures = subj.totalLectures;
    uqUrl = subj.playlistUrl || getUqUrl(subj);
    showUqModal = true;
  }

  function closeUqModal() {
    showUqModal = false;
    editingUqId = null;
    uqName = '';
    uqUrl = '';
  }

  async function handleAddUq() {
    if (uqName.trim()) {
      const lectures = Number(uqLectures) || 20;
      if (editingUqId) {
        await trackerState.updateUqSubject(editingUqId, uqName.trim(), lectures, uqUrl.trim());
      } else {
        await trackerState.addUqSubject(uqName.trim(), lectures, uqUrl.trim());
      }
      closeUqModal();
    }
  }
</script>

<div class="tab-content active" id="tab-week" style="display: block;">
  <!-- Header Row with 3 DAYS A WEEK Badge and Page Switcher Pills -->
  <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap;">
    <div style="display: inline-flex; align-items: center; gap: 6px; background: #ffffff; border: 2.5px solid var(--ink); border-radius: 999px; padding: 6px 16px; font-weight: 800; font-size: 13px; box-shadow: 0 2px 0 var(--ink);">
      <span style="font-size: 15px;">📅</span> 3 DAYS A WEEK
    </div>

    <!-- Zad Academy vs Understand Quran Mode Switcher Pills -->
    <div style="display: flex; gap: 6px;">
      <button
        type="button"
        onclick={() => goToWeekPage('zad')}
        class="week-switcher-pill"
        style="{activeWeekPage === 'zad'
          ? 'background: #b45309; color: #ffffff; border: 2px solid var(--ink); box-shadow: 0 2px 0 var(--ink); font-weight: 800;'
          : 'background: #ffffff; color: #78350f; border: 1.5px solid #fde68a; font-weight: 700;'}"
        title="View Page 1: Zad Academy"
      >
        <span>🎓</span> Zad Academy
      </button>
      <button
        type="button"
        onclick={() => goToWeekPage('uq')}
        class="week-switcher-pill"
        style="{activeWeekPage === 'uq'
          ? 'background: #047857; color: #ffffff; border: 2px solid var(--ink); box-shadow: 0 2px 0 var(--ink); font-weight: 800;'
          : 'background: #ffffff; color: #065f46; border: 1.5px solid #a7f3d0; font-weight: 700;'}"
        title="View Page 2: Understand Quran"
      >
        <span>📖</span> Understand Quran
      </button>
    </div>
  </div>

  <!-- Interactive Multi-Page Container with Left/Right Click Turning -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    class="week-book-container"
    onclick={handlePageClick}
    onkeydown={(e) => {
      if (e.key === 'ArrowLeft') goToWeekPage('zad');
      if (e.key === 'ArrowRight') goToWeekPage('uq');
    }}
    role="region"
    aria-label="3x Per Week Page Flip"
    tabindex="0"
    style="cursor: pointer; position: relative; outline: none;"
  >
    {#if activeWeekPage === 'zad'}
      <!-- PAGE 1: ZAD ACADEMY (@academyzaden - WARM SCHOLAR GOLD THEME) -->
      <div class="week-page-wrap zad-page-mode">
        <div class="week-header">
          <button
            type="button"
            class="channel-header-btn zad-header-btn"
            onclick={() => openExternalUrl('https://youtube.com/@academyzaden')}
            title="Open @academyzaden YouTube Channel"
          >
            <span class="zad-icon" style="font-size: 26px;">🎓</span>
            <div style="text-align: left;">
              <span class="week-header-title zad-title-text">@academyzaden</span>
              <div style="font-size: 11px; color: #92400e; font-weight: 600;">Zad Academy English · Islamic Studies</div>
            </div>
            <span class="channel-arrow zad-channel-arrow">↗</span>
          </button>
          <button
            type="button"
            class="grammar-add-topic-btn zad-add-btn"
            onclick={() => openZadAdd()}
            title="Add new subject/playlist to Zad Academy"
          >
            <span>➕</span> Add Subject
          </button>
        </div>

        <div class="subject-grid">
          {#each trackerState.zadSubjects as subj (subj.id)}
            {@const videoUrl = getZadUrl(subj)}
            <div class="subject-card zad-sub-card">
              <div>
                <div class="subject-card-top">
                  <button
                    type="button"
                    class="subject-title-btn"
                    onclick={() => openExternalUrl(videoUrl)}
                    title="Open {subj.name} video / playlist"
                  >
                    {subj.name}
                  </button>
                  <div class="subject-counter-row">
                    <div class="lecture-badge zad-lecture-badge">
                      Lecture {subj.currentLecture} / {subj.totalLectures}
                    </div>
                    <button
                      type="button"
                      class="hair-wash-btn"
                      onclick={() => openZadEdit(subj)}
                      title="Edit subject name, lectures or playlist link"
                      style="padding: 2px 7px; font-size: 11px; line-height: 1;"
                    >
                      ✏️
                    </button>
                  </div>
                </div>

                <!-- Small link with blue underline -->
                <button
                  type="button"
                  class="small-blue-link"
                  onclick={() => openExternalUrl(videoUrl)}
                  title="Open link: {videoUrl}"
                >
                  {videoUrl}
                </button>

                <!-- Progress bar -->
                <div class="subject-progress-bg zad-progress-bg">
                  <div class="subject-progress-bar zad-progress-bar" style="width: {(subj.currentLecture / subj.totalLectures) * 100}%;"></div>
                </div>
              </div>

              <div class="subject-actions-row">
                <div class="lecture-stepper">
                  <button
                    type="button"
                    class="hair-wash-btn zad-step-btn"
                    onclick={() => trackerState.updateZadLecture(subj.id, -1)}
                    style="padding: 2px 10px;"
                    title="Previous lecture"
                  >
                    −1
                  </button>
                  <button
                    type="button"
                    class="hair-wash-btn hair-wash-plus zad-plus-btn"
                    onclick={() => trackerState.updateZadLecture(subj.id, 1)}
                    style="padding: 2px 10px;"
                    title="Next lecture"
                  >
                    +1 Next
                  </button>
                </div>
              </div>
            </div>
          {/each}
        </div>

        <!-- Bottom Page Indicator (Matches Adkar) -->
        <div class="week-page-footer zad-footer">
          <span class="footer-hint">Click right to turn to Understand Quran ➔</span>
          <span class="footer-badge zad-footer-badge">
            Page 1 of 2 · @academyzaden
          </span>
        </div>
      </div>
    {:else}
      <!-- PAGE 2: UNDERSTAND QURAN (@understandquran - QURANIC EMERALD / TEAL THEME) -->
      <div class="week-page-wrap uq-page-mode">
        <div class="week-header">
          <button
            type="button"
            class="channel-header-btn uq-header-btn"
            onclick={() => openExternalUrl('https://www.youtube.com/@understandquran')}
            title="Open @understandquran YouTube Channel"
          >
            <span class="zad-icon" style="font-size: 26px;">📖</span>
            <div style="text-align: left;">
              <span class="week-header-title uq-title-text">@understandquran</span>
              <div style="font-size: 11px; color: #047857; font-weight: 600;">Understand Al-Qur'an Academy · Easy Grammar</div>
            </div>
            <span class="channel-arrow uq-channel-arrow">↗</span>
          </button>
          <button
            type="button"
            class="grammar-add-topic-btn uq-add-btn"
            onclick={() => openUqAdd()}
            title="Add new course/playlist to Understand Quran"
          >
            <span>➕</span> Add Course
          </button>
        </div>

        <div class="subject-grid">
          {#each trackerState.uqSubjects as subj (subj.id)}
            {@const videoUrl = getUqUrl(subj)}
            <div class="subject-card uq-sub-card">
              <div>
                <div class="subject-card-top">
                  <button
                    type="button"
                    class="subject-title-btn"
                    onclick={() => openExternalUrl(videoUrl)}
                    title="Open {subj.name} video / playlist"
                  >
                    {subj.name}
                  </button>
                  <div class="subject-counter-row">
                    <div class="lecture-badge uq-lecture-badge">
                      Lesson {subj.currentLecture} / {subj.totalLectures}
                    </div>
                    <button
                      type="button"
                      class="hair-wash-btn"
                      onclick={() => openUqEdit(subj)}
                      title="Edit course name, lessons or playlist link"
                      style="padding: 2px 7px; font-size: 11px; line-height: 1;"
                    >
                      ✏️
                    </button>
                  </div>
                </div>

                <!-- Small link with blue underline -->
                <button
                  type="button"
                  class="small-blue-link"
                  onclick={() => openExternalUrl(videoUrl)}
                  title="Open link: {videoUrl}"
                >
                  {videoUrl}
                </button>

                <!-- Progress bar -->
                <div class="subject-progress-bg uq-progress-bg">
                  <div class="subject-progress-bar uq-progress-bar" style="width: {(subj.currentLecture / subj.totalLectures) * 100}%;"></div>
                </div>
              </div>

              <div class="subject-actions-row">
                <div class="lecture-stepper">
                  <button
                    type="button"
                    class="hair-wash-btn uq-step-btn"
                    onclick={() => trackerState.updateUqLecture(subj.id, -1)}
                    style="padding: 2px 10px;"
                    title="Previous lesson"
                  >
                    −1
                  </button>
                  <button
                    type="button"
                    class="hair-wash-btn hair-wash-plus uq-plus-btn"
                    onclick={() => trackerState.updateUqLecture(subj.id, 1)}
                    style="padding: 2px 10px;"
                    title="Next lesson"
                  >
                    +1 Next
                  </button>
                </div>
              </div>
            </div>
          {/each}
        </div>

        <!-- Bottom Page Indicator (Matches Adkar) -->
        <div class="week-page-footer uq-footer">
          <span class="footer-hint">◀ Click left to turn to Zad Academy</span>
          <span class="footer-badge uq-footer-badge">
            Page 2 of 2 · @understandquran
          </span>
        </div>
      </div>
    {/if}
  </div>
</div>

<!-- Zad Add Subject Modal -->
{#if showZadModal}
  <div class="reading-modal-overlay">
    <div class="reading-modal-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div style="font-size: 15px; font-weight: 800; color: #fef08a;">{editingZadId ? '✏️ Edit Zad Academy Subject' : '🎓 Add Zad Academy Subject'}</div>
        <button type="button" class="reading-tool-btn" onclick={closeZadModal}>✕</button>
      </div>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <div>
          <label for="zadSubjName" style="font-size: 11px; font-weight: 800; color: #cbd5e1; display: block; margin-bottom: 4px;">Subject / Playlist Name *</label>
          <input id="zadSubjName" type="text" bind:value={zadName} placeholder="e.g. Fiqh of Purification" style="width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: #ffffff; box-sizing: border-box;" />
        </div>
        <div>
          <label for="zadTotalLec" style="font-size: 11px; font-weight: 800; color: #cbd5e1; display: block; margin-bottom: 4px;">Total Lectures</label>
          <input id="zadTotalLec" type="number" bind:value={zadLectures} min="1" max="200" style="width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: #ffffff; box-sizing: border-box;" />
        </div>
        <div>
          <label for="zadUrl" style="font-size: 11px; font-weight: 800; color: #cbd5e1; display: block; margin-bottom: 4px;">YouTube Playlist URL (Optional)</label>
          <input id="zadUrl" type="url" bind:value={zadUrl} placeholder="https://youtube.com/playlist?list=..." style="width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: #ffffff; box-sizing: border-box;" />
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 14px;">
        <button type="button" class="reading-tool-btn" onclick={closeZadModal}>Cancel</button>
        <button type="button" class="reading-tool-btn active" onclick={handleAddZad}>{editingZadId ? 'Update Subject' : 'Save Subject'}</button>
      </div>
    </div>
  </div>
{/if}

<!-- UQ Add Course Modal -->
{#if showUqModal}
  <div class="reading-modal-overlay">
    <div class="reading-modal-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div style="font-size: 15px; font-weight: 800; color: #fef08a;">{editingUqId ? '✏️ Edit Understand Quran Course' : '📖 Add Understand Quran Course'}</div>
        <button type="button" class="reading-tool-btn" onclick={closeUqModal}>✕</button>
      </div>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <div>
          <label for="uqCourseName" style="font-size: 11px; font-weight: 800; color: #cbd5e1; display: block; margin-bottom: 4px;">Course Name *</label>
          <input id="uqCourseName" type="text" bind:value={uqName} placeholder="e.g. 50% of Quranic Words" style="width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: #ffffff; box-sizing: border-box;" />
        </div>
        <div>
          <label for="uqTotalLec" style="font-size: 11px; font-weight: 800; color: #cbd5e1; display: block; margin-bottom: 4px;">Total Lessons</label>
          <input id="uqTotalLec" type="number" bind:value={uqLectures} min="1" max="200" style="width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: #ffffff; box-sizing: border-box;" />
        </div>
        <div>
          <label for="uqUrl" style="font-size: 11px; font-weight: 800; color: #cbd5e1; display: block; margin-bottom: 4px;">YouTube Playlist URL (Optional)</label>
          <input id="uqUrl" type="url" bind:value={uqUrl} placeholder="https://youtube.com/playlist?list=..." style="width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: #ffffff; box-sizing: border-box;" />
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 14px;">
        <button type="button" class="reading-tool-btn" onclick={closeUqModal}>Cancel</button>
        <button type="button" class="reading-tool-btn active" onclick={handleAddUq}>{editingUqId ? 'Update Course' : 'Save Course'}</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .week-switcher-pill {
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 12px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.15s ease;
    user-select: none;
  }

  .week-book-container {
    width: 100%;
  }

  .week-page-wrap {
    padding: clamp(14px, 2.5vw, 20px);
    border-radius: 16px;
    border: 2px solid var(--ink);
    box-shadow: 0 3px 0 var(--ink);
    animation: weekPageFadeSlide 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    transition: background 0.25s ease, border-color 0.25s ease;
  }

  @keyframes weekPageFadeSlide {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ================== PAGE 1: ZAD ACADEMY (SCHOLAR GOLD THEME) ================== */
  .week-page-wrap.zad-page-mode {
    background: linear-gradient(145deg, #fffbeb 0%, #fef3c7 50%, #fed7aa 100%);
    border-color: #92400e;
  }

  .zad-title-text {
    font-size: 16px;
    font-weight: 800;
    color: #78350f;
  }

  .zad-channel-arrow {
    color: #b45309;
  }

  .zad-add-btn {
    background: #f59e0b !important;
    color: #451a03 !important;
    border: 1.5px solid #78350f !important;
    box-shadow: 0 2px 0 #78350f !important;
    font-size: 11.5px;
    padding: 5px 12px;
    font-weight: 800;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.12s ease;
  }
  .zad-add-btn:hover {
    transform: translateY(-1px);
    background: #d97706 !important;
    color: #ffffff !important;
  }

  .zad-sub-card {
    border-color: #b45309 !important;
    box-shadow: 0 2px 0 #b45309 !important;
  }
  .zad-sub-card:hover {
    box-shadow: 0 4px 0 #b45309 !important;
  }

  .zad-lecture-badge {
    color: #b45309;
  }

  .zad-progress-bg {
    background: #fde68a;
    border: 1px solid #fcd34d;
  }
  .zad-progress-bar {
    height: 100%;
    background: #d97706;
    transition: width 0.2s ease;
  }

  .zad-step-btn {
    background: #ffffff;
    border-color: #b45309;
    color: #78350f;
  }
  .zad-plus-btn {
    background: #f59e0b !important;
    border-color: #78350f !important;
    color: #451a03 !important;
  }

  .zad-footer {
    background: rgba(254, 243, 199, 0.75);
    border: 1px solid #fde68a;
  }
  .zad-footer-badge {
    background: #fde68a;
    color: #78350f;
  }

  /* ================== PAGE 2: UNDERSTAND QURAN (EMERALD JADE THEME) ================== */
  .week-page-wrap.uq-page-mode {
    background: linear-gradient(145deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%);
    border-color: #064e3b;
  }

  .uq-title-text {
    font-size: 16px;
    font-weight: 800;
    color: #064e3b;
  }

  .uq-channel-arrow {
    color: #059669;
  }

  .uq-add-btn {
    background: #10b981 !important;
    color: #022c22 !important;
    border: 1.5px solid #064e3b !important;
    box-shadow: 0 2px 0 #064e3b !important;
    font-size: 11.5px;
    padding: 5px 12px;
    font-weight: 800;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.12s ease;
  }
  .uq-add-btn:hover {
    transform: translateY(-1px);
    background: #059669 !important;
    color: #ffffff !important;
  }

  .uq-sub-card {
    border-color: #059669 !important;
    box-shadow: 0 2px 0 #059669 !important;
  }
  .uq-sub-card:hover {
    box-shadow: 0 4px 0 #059669 !important;
  }

  .uq-lecture-badge {
    color: #047857;
  }

  .uq-progress-bg {
    background: #a7f3d0;
    border: 1px solid #6ee7b7;
  }
  .uq-progress-bar {
    height: 100%;
    background: #059669;
    transition: width 0.2s ease;
  }

  .uq-step-btn {
    background: #ffffff;
    border-color: #059669;
    color: #064e3b;
  }
  .uq-plus-btn {
    background: #10b981 !important;
    border-color: #064e3b !important;
    color: #022c22 !important;
  }

  .uq-footer {
    background: rgba(209, 250, 229, 0.75);
    border: 1px solid #a7f3d0;
  }
  .uq-footer-badge {
    background: #a7f3d0;
    color: #064e3b;
  }

  /* ================== COMMON WEEK COMPONENTS ================== */
  .week-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
    flex-wrap: wrap;
    gap: 8px;
  }

  .channel-header-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: transparent;
    border: none;
    padding: 4px 6px;
    border-radius: 8px;
    cursor: pointer;
    text-align: left;
    transition: background 0.15s ease, transform 0.12s ease;
  }
  .channel-header-btn:hover {
    background: rgba(0, 0, 0, 0.05);
    transform: translateY(-1px);
  }
  .channel-arrow {
    font-size: 13px;
    font-weight: 800;
    opacity: 0.8;
  }

  .subject-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
    gap: clamp(10px, 1.5vw, 14px);
  }

  .subject-card {
    background: #ffffff;
    border: 1.5px solid var(--ink);
    border-radius: 12px;
    padding: 12px;
    box-shadow: 0 2px 0 var(--ink);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .subject-card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    flex-wrap: wrap;
    gap: 6px;
  }

  .subject-title-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: transparent;
    border: none;
    padding: 0;
    font-weight: 800;
    font-size: 13.5px;
    color: var(--ink);
    cursor: pointer;
    text-align: left;
    line-height: 1.3;
  }
  .subject-title-btn:hover {
    color: #2563eb;
    text-decoration: underline;
  }

  .subject-counter-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .lecture-badge {
    font-size: 12px;
    font-weight: 800;
  }

  .small-blue-link {
    background: transparent;
    border: none;
    padding: 0;
    margin: 2px 0 8px 0;
    font-size: 11px;
    font-weight: 600;
    color: #2563eb;
    text-decoration: underline;
    text-decoration-color: #3b82f6;
    cursor: pointer;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    text-align: left;
    direction: ltr;
    font-family: inherit;
    transition: color 0.15s ease, text-decoration-color 0.15s ease;
  }
  .small-blue-link:hover {
    color: #1d4ed8;
    text-decoration-color: #1d4ed8;
  }

  .subject-progress-bg {
    width: 100%;
    height: 8px;
    border-radius: 999px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .subject-actions-row {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 2px;
  }
  .lecture-stepper {
    display: flex;
    gap: 6px;
  }

  .week-page-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11.5px;
    color: #64748b;
    font-weight: 700;
    margin-top: 16px;
    padding: 10px 14px;
    border-radius: 12px;
    user-select: none;
  }
  .footer-hint {
    font-size: 11.5px;
    opacity: 0.9;
  }
  .footer-badge {
    padding: 3px 12px;
    border-radius: 999px;
    font-weight: 800;
    font-size: 11px;
  }
</style>

<!-- Zad Add Subject Modal -->
{#if showZadModal}
  <div class="reading-modal-overlay">
    <div class="reading-modal-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div style="font-size: 15px; font-weight: 800; color: #fef08a;">{editingZadId ? '✏️ Edit Zad Academy Subject' : '🎓 Add Zad Academy Subject'}</div>
        <button type="button" class="reading-tool-btn" onclick={closeZadModal}>✕</button>
      </div>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <div>
          <label for="zadSubjName" style="font-size: 11px; font-weight: 800; color: #cbd5e1; display: block; margin-bottom: 4px;">Subject / Playlist Name *</label>
          <input id="zadSubjName" type="text" bind:value={zadName} placeholder="e.g. Fiqh of Purification" style="width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: #ffffff; box-sizing: border-box;" />
        </div>
        <div>
          <label for="zadTotalLec" style="font-size: 11px; font-weight: 800; color: #cbd5e1; display: block; margin-bottom: 4px;">Total Lectures</label>
          <input id="zadTotalLec" type="number" bind:value={zadLectures} min="1" max="200" style="width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: #ffffff; box-sizing: border-box;" />
        </div>
        <div>
          <label for="zadUrl" style="font-size: 11px; font-weight: 800; color: #cbd5e1; display: block; margin-bottom: 4px;">YouTube Playlist URL (Optional)</label>
          <input id="zadUrl" type="url" bind:value={zadUrl} placeholder="https://youtube.com/playlist?list=..." style="width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: #ffffff; box-sizing: border-box;" />
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 14px;">
        <button type="button" class="reading-tool-btn" onclick={closeZadModal}>Cancel</button>
        <button type="button" class="reading-tool-btn active" onclick={handleAddZad}>{editingZadId ? 'Update Subject' : 'Save Subject'}</button>
      </div>
    </div>
  </div>
{/if}

<!-- UQ Add Course Modal -->
{#if showUqModal}
  <div class="reading-modal-overlay">
    <div class="reading-modal-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div style="font-size: 15px; font-weight: 800; color: #fef08a;">{editingUqId ? '✏️ Edit Understand Quran Course' : '📖 Add Understand Quran Course'}</div>
        <button type="button" class="reading-tool-btn" onclick={closeUqModal}>✕</button>
      </div>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <div>
          <label for="uqCourseName" style="font-size: 11px; font-weight: 800; color: #cbd5e1; display: block; margin-bottom: 4px;">Course Name *</label>
          <input id="uqCourseName" type="text" bind:value={uqName} placeholder="e.g. 50% of Quranic Words" style="width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: #ffffff; box-sizing: border-box;" />
        </div>
        <div>
          <label for="uqTotalLec" style="font-size: 11px; font-weight: 800; color: #cbd5e1; display: block; margin-bottom: 4px;">Total Lessons</label>
          <input id="uqTotalLec" type="number" bind:value={uqLectures} min="1" max="200" style="width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: #ffffff; box-sizing: border-box;" />
        </div>
        <div>
          <label for="uqUrl" style="font-size: 11px; font-weight: 800; color: #cbd5e1; display: block; margin-bottom: 4px;">YouTube Playlist URL (Optional)</label>
          <input id="uqUrl" type="url" bind:value={uqUrl} placeholder="https://youtube.com/playlist?list=..." style="width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: #ffffff; box-sizing: border-box;" />
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 14px;">
        <button type="button" class="reading-tool-btn" onclick={closeUqModal}>Cancel</button>
        <button type="button" class="reading-tool-btn active" onclick={handleAddUq}>{editingUqId ? 'Update Course' : 'Save Course'}</button>
      </div>
    </div>
  </div>
{/if}
