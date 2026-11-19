<script>
  import { onMount } from 'svelte';
  import { trackerState } from '$lib/stores/trackerState.svelte.js';

  let showZadModal = $state(false);
  let zadName = $state('');
  let zadLectures = $state(25);
  let zadUrl = $state('');

  let showUqModal = $state(false);
  let uqName = $state('');
  let uqLectures = $state(20);
  let uqUrl = $state('');

  onMount(() => {
    trackerState.init();
  });

  async function handleAddZad() {
    if (zadName.trim()) {
      await trackerState.addZadSubject(zadName.trim(), Number(zadLectures) || 25, zadUrl.trim());
      zadName = '';
      zadUrl = '';
      showZadModal = false;
    }
  }

  async function handleAddUq() {
    if (uqName.trim()) {
      await trackerState.addUqSubject(uqName.trim(), Number(uqLectures) || 20, uqUrl.trim());
      uqName = '';
      uqUrl = '';
      showUqModal = false;
    }
  }
</script>

<div class="tab-content active" id="tab-week" style="display: block;">
  <div class="section-title week-title">
    <span>📅</span> 3 DAYS A WEEK (COURSES &amp; LECTURES)
  </div>

  <!-- Zad Academy Section -->
  <div class="week-section zad-card" style="padding: clamp(12px, 2vw, 18px); margin-bottom: 16px;">
    <div class="week-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span class="zad-icon" style="font-size:24px;">🎓</span>
        <span class="week-header-title" style="font-size:16px;font-weight:800;color:var(--ink);">@academyzaden</span>
      </div>
      <button
        type="button"
        class="grammar-add-topic-btn"
        onclick={() => (showZadModal = true)}
        title="Add new subject/playlist to Zad Academy"
        style="font-size: 11.5px; padding: 4px 10px;"
      >
        <span>➕</span> Add Subject
      </button>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); gap: clamp(10px, 1.5vw, 14px);">
      {#each trackerState.zadSubjects as subj (subj.id)}
        <div style="background: #ffffff; border: 1.5px solid var(--ink); border-radius: 12px; padding: 12px; box-shadow: 0 2px 0 var(--ink); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; flex-wrap: wrap; gap: 4px;">
              <div style="font-weight: 800; font-size: 13.5px; color: var(--ink);">{subj.name}</div>
              <div style="font-size: 12px; font-weight: 800; color: #d97706;">
                Lecture {subj.currentLecture} / {subj.totalLectures}
              </div>
            </div>
            <!-- Progress bar -->
            <div style="width: 100%; height: 8px; background: #fef3c7; border-radius: 999px; overflow: hidden; margin-bottom: 10px; border: 1px solid #fde68a;">
              <div style="width: {(subj.currentLecture / subj.totalLectures) * 100}%; height: 100%; background: #f59e0b;"></div>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px;">
            <a
              href={subj.playlistUrl || 'https://youtube.com/@academyzaden'}
              target="_blank"
              rel="noopener noreferrer"
              class="reading-tool-btn"
              style="font-size: 11px; padding: 4px 8px; text-decoration: none;"
            >
              ▶ Playlist
            </a>
            <div style="display: flex; gap: 6px;">
              <button
                type="button"
                class="hair-wash-btn"
                onclick={() => trackerState.updateZadLecture(subj.id, -1)}
                style="padding: 2px 10px;"
              >
                −1
              </button>
              <button
                type="button"
                class="hair-wash-btn hair-wash-plus"
                onclick={() => trackerState.updateZadLecture(subj.id, 1)}
                style="padding: 2px 10px;"
              >
                +1 Next
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Understand Quran Section -->
  <div class="week-section zad-card" style="padding: clamp(12px, 2vw, 18px); margin-bottom: 16px;">
    <div class="week-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span class="zad-icon" style="font-size:24px;">📖</span>
        <span class="week-header-title" style="font-size:16px;font-weight:800;color:var(--ink);">@understandquran</span>
      </div>
      <button
        type="button"
        class="grammar-add-topic-btn"
        onclick={() => (showUqModal = true)}
        title="Add new course/playlist to Understand Quran"
        style="font-size: 11.5px; padding: 4px 10px;"
      >
        <span>➕</span> Add Course
      </button>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); gap: clamp(10px, 1.5vw, 14px);">
      {#each trackerState.uqSubjects as subj (subj.id)}
        <div style="background: #ffffff; border: 1.5px solid var(--ink); border-radius: 12px; padding: 12px; box-shadow: 0 2px 0 var(--ink); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; flex-wrap: wrap; gap: 4px;">
              <div style="font-weight: 800; font-size: 13.5px; color: var(--ink);">{subj.name}</div>
              <div style="font-size: 12px; font-weight: 800; color: #059669;">
                Lesson {subj.currentLecture} / {subj.totalLectures}
              </div>
            </div>
            <!-- Progress bar -->
            <div style="width: 100%; height: 8px; background: #ecfdf5; border-radius: 999px; overflow: hidden; margin-bottom: 10px; border: 1px solid #a7f3d0;">
              <div style="width: {(subj.currentLecture / subj.totalLectures) * 100}%; height: 100%; background: #10b981;"></div>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px;">
            <a
              href={subj.playlistUrl || 'https://youtube.com/@understandquran'}
              target="_blank"
              rel="noopener noreferrer"
              class="reading-tool-btn"
              style="font-size: 11px; padding: 4px 8px; text-decoration: none;"
            >
              ▶ Playlist
            </a>
            <div style="display: flex; gap: 6px;">
              <button
                type="button"
                class="hair-wash-btn"
                onclick={() => trackerState.updateUqLecture(subj.id, -1)}
                style="padding: 2px 10px;"
              >
                −1
              </button>
              <button
                type="button"
                class="hair-wash-btn hair-wash-plus"
                onclick={() => trackerState.updateUqLecture(subj.id, 1)}
                style="padding: 2px 10px;"
              >
                +1 Next
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<!-- Zad Add Subject Modal -->
{#if showZadModal}
  <div class="reading-modal-overlay">
    <div class="reading-modal-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div style="font-size: 15px; font-weight: 800; color: #fef08a;">🎓 Add Zad Academy Subject</div>
        <button type="button" class="reading-tool-btn" onclick={() => (showZadModal = false)}>✕</button>
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
        <button type="button" class="reading-tool-btn" onclick={() => (showZadModal = false)}>Cancel</button>
        <button type="button" class="reading-tool-btn active" onclick={handleAddZad}>Save Subject</button>
      </div>
    </div>
  </div>
{/if}

<!-- UQ Add Course Modal -->
{#if showUqModal}
  <div class="reading-modal-overlay">
    <div class="reading-modal-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div style="font-size: 15px; font-weight: 800; color: #fef08a;">📖 Add Understand Quran Course</div>
        <button type="button" class="reading-tool-btn" onclick={() => (showUqModal = false)}>✕</button>
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
        <button type="button" class="reading-tool-btn" onclick={() => (showUqModal = false)}>Cancel</button>
        <button type="button" class="reading-tool-btn active" onclick={handleAddUq}>Save Course</button>
      </div>
    </div>
  </div>
{/if}
