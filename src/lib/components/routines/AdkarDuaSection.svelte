<script>
  import { onMount } from 'svelte';
  import { adkarState } from '$lib/stores/adkarState.svelte.js';
  import { playPageFlipSound } from '$lib/utils/audioRustle.js';

  const sections = [
    {
      key: 'morning',
      title: 'Morning Adkar',
      arabicTitle: 'أَذْكَارُ الصَّبَاحِ',
      icon: '🌅',
      pdfLabel: 'Morning Adkar PDF',
      pdfUrl: 'https://drive.google.com/file/d/1s1of5xnyzPgy8cRO3RqycT-wbfr_m_9v/view?usp=drivesdk'
    },
    {
      key: 'evening',
      title: 'Evening Adkar',
      arabicTitle: 'أَذْكَارُ المَسَاءِ',
      icon: '🌆',
      pdfLabel: 'Evening Adkar PDF',
      pdfUrl: 'https://drive.google.com/file/d/1s1of5xnyzPgy8cRO3RqycT-wbfr_m_9v/view?usp=drivesdk'
    }
  ];

  let activeSectionKey = $state('morning');
  const activeSection = $derived(sections.find((s) => s.key === activeSectionKey) || sections[0]);

  function goToSection(key) {
    if (activeSectionKey !== key) {
      activeSectionKey = key;
      playPageFlipSound(true);
    }
  }

  function handlePageClick(event) {
    // Ignore clicks on buttons, links, counters, pills, and inputs
    if (
      event.target.closest(
        'button, a, input, select, textarea, .adkar-big-circle, .adkar-duaa-pill, .adkar-reset-btn, .adkar-booklet-btn, .adkar-pdf-link'
      )
    ) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    if (clickX < rect.width / 2) {
      // Click left side -> Morning Adkar
      goToSection('morning');
    } else {
      // Click right side -> Evening Adkar
      goToSection('evening');
    }
  }

  function highlightTitle(title, secKey, duaIdx) {
    if (!title) return '';
    if (duaIdx === 11 || duaIdx === 12) {
      if (secKey === 'morning') {
        return title.replace('Morning', '<mark class="adkar-diff-hl">Morning</mark>');
      } else {
        return title.replace('Evening', '<mark class="adkar-diff-hl">Evening</mark>');
      }
    }
    return title;
  }

  function highlightDiffText(text, secKey, duaIdx, field) {
    if (!text) return '';
    let res = text;
    if (secKey === 'morning') {
      if (duaIdx === 11) {
        // Dua 12: Entering the Morning (differs from Evening)
        if (field === 'arabic') {
          res = res.replace('أَصْبَحْنَا وَأَصْبَحَ', '<mark class="adkar-diff-hl">أَصْبَحْنَا وَأَصْبَحَ</mark>');
          res = res.replace('هَٰذَا الْيَوْمِ، وَخَيْرَ مَا بَعْدَهُ', '<mark class="adkar-diff-hl">هَٰذَا الْيَوْمِ، وَخَيْرَ مَا بَعْدَهُ</mark>');
          res = res.replace('هَٰذَا الْيَوْمِ، وَشَرِّ مَا بَعْدَهُ', '<mark class="adkar-diff-hl">هَٰذَا الْيَوْمِ، وَشَرِّ مَا بَعْدَهُ</mark>');
        } else if (field === 'urdu') {
          res = res.replace('ہم نے صبح کی اور اللہ کے لیے تمام ملک نے صبح کی', '<mark class="adkar-diff-hl">ہم نے صبح کی اور اللہ کے لیے تمام ملک نے صبح کی</mark>');
          res = res.replace('اس دن کی خیر اور اس کے بعد کی خیر', '<mark class="adkar-diff-hl">اس دن کی خیر اور اس کے بعد کی خیر</mark>');
          res = res.replace('اس دن کے شر اور اس کے بعد کے شر', '<mark class="adkar-diff-hl">اس دن کے شر اور اس کے بعد کے شر</mark>');
        } else if (field === 'translit') {
          res = res.replace('Asbahnaa wa asbahal-mulku', '<mark class="adkar-diff-hl">Asbahnaa wa asbahal-mulku</mark>');
          res = res.replace("haadhal-yawmi wa khayra maa ba'dahu", '<mark class="adkar-diff-hl">haadhal-yawmi wa khayra maa ba\'dahu</mark>');
          res = res.replace("haadhal-yawmi wa sharri maa ba'dahu", '<mark class="adkar-diff-hl">haadhal-yawmi wa sharri maa ba\'dahu</mark>');
        } else if (field === 'meaning') {
          res = res.replace('reached the morning', '<mark class="adkar-diff-hl">reached the morning</mark>');
          res = res.replace('this day and what follows it', '<mark class="adkar-diff-hl">this day and what follows it</mark>');
        }
      } else if (duaIdx === 12) {
        // Dua 13: Affirming Morning by Allah's Will (differs from Evening)
        if (field === 'arabic') {
          res = res.replace('أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا', '<mark class="adkar-diff-hl">أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا</mark>');
          res = res.replace('النُّشُورُ', '<mark class="adkar-diff-hl">النُّشُورُ</mark>');
        } else if (field === 'urdu') {
          res = res.replace('ہم نے صبح کی، اور تیرے ہی نام کے ساتھ ہم نے شام کی', '<mark class="adkar-diff-hl">ہم نے صبح کی، اور تیرے ہی نام کے ساتھ ہم نے شام کی</mark>');
          res = res.replace('دوبارہ جی اٹھنا ہے', '<mark class="adkar-diff-hl">دوبارہ جی اٹھنا ہے</mark>');
        } else if (field === 'translit') {
          res = res.replace('asbahnaa, wa bika amsaynaa', '<mark class="adkar-diff-hl">asbahnaa, wa bika amsaynaa</mark>');
          res = res.replace('ilaykan-nushoor', '<mark class="adkar-diff-hl">ilaykan-nushoor</mark>');
        } else if (field === 'meaning') {
          res = res.replace('enter the morning and by You we enter the evening', '<mark class="adkar-diff-hl">enter the morning and by You we enter the evening</mark>');
          res = res.replace('resurrection', '<mark class="adkar-diff-hl">resurrection</mark>');
        }
      } else if (duaIdx === 14) {
        // Dua 15: Natural State of Islam (starts with Asbahnaa)
        if (field === 'arabic') {
          res = res.replace('أَصْبَحْنَا', '<mark class="adkar-diff-hl">أَصْبَحْنَا</mark>');
        } else if (field === 'urdu') {
          res = res.replace('ہم نے صبح کی', '<mark class="adkar-diff-hl">ہم نے صبح کی</mark>');
        } else if (field === 'translit') {
          res = res.replace('Asbahnaa', '<mark class="adkar-diff-hl">Asbahnaa</mark>');
        } else if (field === 'meaning') {
          res = res.replace('reached morning', '<mark class="adkar-diff-hl">reached morning</mark>');
        }
      }
    } else if (secKey === 'evening') {
      if (duaIdx === 11) {
        // Dua 12: Entering the Evening (differs from Morning)
        if (field === 'arabic') {
          res = res.replace('أَمْسَيْنَا وَأَمْسَى', '<mark class="adkar-diff-hl">أَمْسَيْنَا وَأَمْسَى</mark>');
          res = res.replace('هَذِهِ اللَّيْلَةِ، وَخَيْرَ مَا بَعْدَهَا', '<mark class="adkar-diff-hl">هَذِهِ اللَّيْلَةِ، وَخَيْرَ مَا بَعْدَهَا</mark>');
          res = res.replace('هَذِهِ اللَّيْلَةِ، وَشَرِّ مَا بَعْدَهَا', '<mark class="adkar-diff-hl">هَذِهِ اللَّيْلَةِ، وَشَرِّ مَا بَعْدَهَا</mark>');
        } else if (field === 'urdu') {
          res = res.replace('ہم نے شام کی اور اللہ کے لیے تمام ملک نے شام کی', '<mark class="adkar-diff-hl">ہم نے شام کی اور اللہ کے لیے تمام ملک نے شام کی</mark>');
          res = res.replace('اس رات کی خیر اور اس کے بعد کی خیر', '<mark class="adkar-diff-hl">اس رات کی خیر اور اس کے بعد کی خیر</mark>');
          res = res.replace('اس رات کے شر اور اس کے بعد کے شر', '<mark class="adkar-diff-hl">اس رات کے شر اور اس کے بعد کے شر</mark>');
        } else if (field === 'translit') {
          res = res.replace('Amsaynaa wa-amsal mulku', '<mark class="adkar-diff-hl">Amsaynaa wa-amsal mulku</mark>');
          res = res.replace("hadhi-hil laylah, wa khayra ma b'adahaa", '<mark class="adkar-diff-hl">hadhi-hil laylah, wa khayra ma b\'adahaa</mark>');
          res = res.replace("hadhi-hil laylah, wa sharri maa b'adahaa", '<mark class="adkar-diff-hl">hadhi-hil laylah, wa sharri maa b\'adahaa</mark>');
        } else if (field === 'meaning') {
          res = res.replace('entered the evening', '<mark class="adkar-diff-hl">entered the evening</mark>');
          res = res.replace('this night and what comes after it', '<mark class="adkar-diff-hl">this night and what comes after it</mark>');
        }
      } else if (duaIdx === 12) {
        // Dua 13: Affirming Evening by Allah's Will (differs from Morning)
        if (field === 'arabic') {
          res = res.replace('أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا', '<mark class="adkar-diff-hl">أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا</mark>');
          res = res.replace('الْمَصِيرُ', '<mark class="adkar-diff-hl">الْمَصِيرُ</mark>');
        } else if (field === 'urdu') {
          res = res.replace('ہم نے شام کی، اور تیرے ہی نام کے ساتھ ہم نے صبح کی', '<mark class="adkar-diff-hl">ہم نے شام کی، اور تیرے ہی نام کے ساتھ ہم نے صبح کی</mark>');
          res = res.replace('پلٹ کر جانا ہے', '<mark class="adkar-diff-hl">پلٹ کر جانا ہے</mark>');
        } else if (field === 'translit') {
          res = res.replace('amsaynaa, wa-bika asbahnaa', '<mark class="adkar-diff-hl">amsaynaa, wa-bika asbahnaa</mark>');
          res = res.replace('ilaykal maseer', '<mark class="adkar-diff-hl">ilaykal maseer</mark>');
        } else if (field === 'meaning') {
          res = res.replace('enter the evening and by You we enter the morning', '<mark class="adkar-diff-hl">enter the evening and by You we enter the morning</mark>');
          res = res.replace('final return', '<mark class="adkar-diff-hl">final return</mark>');
        }
      }
    }
    return res;
  }

  onMount(async () => {
    await adkarState.init();
  });
</script>

<div class="tab-content active" id="tab-adkar" style="display: block;">
  <!-- Header Row with ADKAR Badge and Mode Switcher Pills -->
  <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap;">
    <div style="display: inline-flex; align-items: center; gap: 6px; background: #ffffff; border: 2.5px solid var(--ink); border-radius: 999px; padding: 6px 16px; font-weight: 800; font-size: 13px; box-shadow: 0 2px 0 var(--ink);">
      <span style="font-size: 15px;">📿</span> ADKAR
    </div>

    <!-- Morning / Evening Switcher Pills -->
    <div style="display: flex; gap: 6px;">
      <button
        type="button"
        onclick={() => goToSection('morning')}
        style="padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; transition: all 0.15s ease; {activeSectionKey === 'morning' ? 'background: #0f766e; color: #ffffff; border: 2px solid var(--ink); box-shadow: 0 2px 0 var(--ink);' : 'background: #ffffff; color: #475569; border: 1.5px solid #cbd5e1;'}"
      >
        <span>🌅</span> Morning
      </button>
      <button
        type="button"
        onclick={() => goToSection('evening')}
        style="padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; transition: all 0.15s ease; {activeSectionKey === 'evening' ? 'background: #3730a3; color: #ffffff; border: 2px solid var(--ink); box-shadow: 0 2px 0 var(--ink);' : 'background: #ffffff; color: #475569; border: 1.5px solid #cbd5e1;'}"
      >
        <span>🌆</span> Evening
      </button>
    </div>
  </div>

  <!-- Interactive Adkar Book Container with Left/Right Click Turning -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    class="adkar-book-container"
    onclick={handlePageClick}
    onkeydown={(e) => {
      if (e.key === 'ArrowLeft') goToSection('morning');
      if (e.key === 'ArrowRight') goToSection('evening');
    }}
    role="region"
    aria-label="Adkar Page Flip"
    tabindex="0"
    style="cursor: pointer; position: relative; outline: none;"
  >
    {#if activeSection}
      {@const sec = activeSection}
      {@const items = sec.key === 'morning' ? adkarState.morningItems : adkarState.eveningItems}
      {@const st = adkarState.sectionState[sec.key]}
      {@const duaIdx = adkarState.duaIndex[sec.key]}
      {@const isOpen = adkarState.duaOpen[sec.key]}
      {@const currentDua = items[duaIdx] || items[0]}

      <div class="adkar-section-wrap {sec.key === 'evening' ? 'evening-mode' : ''}" style="position: relative;">
        <!-- Header -->
        <div class="adkar-section-head">
          <div>
            <div class="adkar-section-arabic" dir="rtl">{sec.arabicTitle}</div>
            <div class="adkar-section-sub">{sec.icon} {sec.title}</div>
          </div>
          <a
            class="adkar-pdf-link"
            href={sec.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            onclick={(e) => e.stopPropagation()}
          >
            <span>📄</span> {sec.pdfLabel}
          </a>
        </div>

        <!-- Big Tap Counter Panel -->
        <div class="adkar-counter-panel">
          <button
            type="button"
            class="adkar-big-circle {st.count >= 1000 ? 'done' : ''}"
            onclick={(e) => {
              e.stopPropagation();
              adkarState.tapCounter(sec.key);
            }}
            title="Tap to count"
          >
            <span class="adkar-big-count">{st.count}</span>
            <span class="adkar-big-goal">/ 1000</span>
          </button>

          <div class="adkar-counter-footer">
            <span>Total {sec.title}: <strong>{st.total}</strong></span>
            <button
              type="button"
              class="adkar-reset-btn"
              onclick={(e) => {
                e.stopPropagation();
                adkarState.resetCounter(sec.key);
              }}
            >
              ↺ Reset Count
            </button>
          </div>
        </div>

        <!-- Duaa Reader Booklet -->
        <div class="adkar-booklet-wrap">
          <div class="adkar-booklet-topbar">
            <div class="adkar-booklet-heading">
              <span>📖</span> {sec.title} (Duaa {duaIdx + 1} of {items.length})
            </div>
            <div class="adkar-booklet-controls">
              <button
                type="button"
                class="adkar-booklet-btn"
                onclick={(e) => {
                  e.stopPropagation();
                  adkarState.toggleDuaOpen(sec.key);
                }}
              >
                {isOpen ? '▲ Hide Duaa' : '▼ Show Duaa'}
              </button>
            </div>
          </div>

          {#if isOpen}
            <!-- 16 Duaa Pagination Pills -->
            <div class="adkar-duaa-pills">
              {#each items as _, i}
                <button
                  type="button"
                  class="adkar-duaa-pill {i === duaIdx ? 'active' : ''}"
                  onclick={(e) => {
                    e.stopPropagation();
                    adkarState.setDuaIndex(sec.key, i);
                  }}
                  title="Duaa {i + 1}"
                >
                  {i + 1}
                </button>
              {/each}
            </div>

            <!-- Current Duaa Card -->
            {#if currentDua}
              <div class="adkar-pdf-block">
                {#if currentDua.banner}
                  <div class="adkar-pdf-banner">
                    {currentDua.banner}
                  </div>
                {/if}

                {#if currentDua.title}
                  <div style="font-size: 13.5px; font-weight: 800; color: {sec.key === 'evening' ? '#4338ca' : '#0f766e'}; margin-bottom: 10px; text-align: center;">
                    {@html highlightTitle(currentDua.title, sec.key, duaIdx)}
                  </div>
                {/if}

                <div class="adkar-pdf-arabic" dir="rtl">
                  {@html highlightDiffText(currentDua.arabic, sec.key, duaIdx, 'arabic')}
                </div>

                {#if currentDua.urdu}
                  <div class="adkar-pdf-urdu" dir="rtl">
                    {@html highlightDiffText(currentDua.urdu, sec.key, duaIdx, 'urdu')}
                  </div>
                {/if}

                <div class="adkar-pdf-trans">
                  {@html highlightDiffText(currentDua.meaning, sec.key, duaIdx, 'meaning')}
                </div>

                <div style="display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; margin-top: 12px;">
                  {#if currentDua.repeat}
                    <span
                      class="adkar-pdf-repeat"
                      style="margin: 0; background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 999px; border: 1px solid #fde68a; font-weight: 700; font-size: 11px;"
                    >
                      🔁 {currentDua.repeat}
                    </span>
                  {/if}
                  {#if currentDua.ref}
                    <span
                      class="adkar-pdf-ref"
                      style="margin: 0; background: #eff6ff; color: #1e40af; padding: 4px 12px; border-radius: 999px; border: 1px solid #bfdbfe; font-weight: 700; font-size: 11px;"
                    >
                      📖 {currentDua.ref}
                    </span>
                  {/if}
                </div>
              </div>
            {/if}
          {/if}
        </div>

        <!-- Bottom Page Navigation Indicator & Direct Page Turn Action -->
        <div class="adkar-footer-row">
          {#if sec.key === 'morning'}
            <span class="adkar-footer-badge morning-badge">
              Page 1 of 2 · 🌅 Morning Adkar
            </span>
            <button
              type="button"
              class="adkar-turn-btn to-evening-btn"
              onclick={(e) => {
                e.stopPropagation();
                goToSection('evening');
              }}
              title="Turn page to Evening Adkar"
            >
              <span>Turn to Evening ➔</span>
            </button>
          {:else}
            <button
              type="button"
              class="adkar-turn-btn to-morning-btn"
              onclick={(e) => {
                e.stopPropagation();
                goToSection('morning');
              }}
              title="Turn page to Morning Adkar"
            >
              <span>◀ Turn to Morning</span>
            </button>
            <span class="adkar-footer-badge evening-badge">
              Page 2 of 2 · 🌆 Evening Adkar
            </span>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .adkar-footer-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-top: 14px;
    padding: 10px 14px;
    background: rgba(255, 255, 255, 0.75);
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.08);
  }

  .adkar-footer-badge {
    padding: 4px 12px;
    border-radius: 999px;
    font-weight: 800;
    font-size: 11px;
    white-space: nowrap;
  }
  .morning-badge {
    background: #ccfbf1;
    color: #0f766e;
    border: 1px solid #99f6e4;
  }
  .evening-badge {
    background: #e0e7ff;
    color: #3730a3;
    border: 1px solid #c7d2fe;
  }

  .adkar-turn-btn {
    border: 2px solid var(--ink);
    border-radius: 999px;
    padding: 6px 16px;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 2.5px 0 var(--ink);
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.12s ease;
    white-space: nowrap;
  }
  .adkar-turn-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 3.5px 0 var(--ink);
  }
  .to-evening-btn {
    background: #3730a3;
    color: #ffffff;
  }
  .to-evening-btn:hover {
    background: #312e81;
  }
  .to-morning-btn {
    background: #0f766e;
    color: #ffffff;
  }
  .to-morning-btn:hover {
    background: #115e59;
  }
  /* Evening Adkar Twilight Palette */
  :global(.adkar-section-wrap.evening-mode) {
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #4338ca 100%) !important;
  }
  :global(.adkar-section-wrap.evening-mode .adkar-big-circle) {
    background: linear-gradient(145deg, #ede9fe 0%, #c7d2fe 100%) !important;
  }
  :global(.adkar-section-wrap.evening-mode .adkar-big-circle.done) {
    background: linear-gradient(145deg, #fbcfe8 0%, #f472b6 100%) !important;
  }
  :global(.adkar-section-wrap.evening-mode .adkar-booklet-heading) {
    color: #4338ca !important;
  }
  :global(.adkar-section-wrap.evening-mode .adkar-duaa-pill.active) {
    background: #4338ca !important;
    border-color: var(--ink) !important;
    color: #ffffff !important;
  }
  :global(.adkar-section-wrap.evening-mode .adkar-booklet-btn:hover:not(:disabled)) {
    background: #ede9fe !important;
  }
  :global(.adkar-section-wrap.evening-mode .adkar-pdf-link) {
    background: rgba(255, 255, 255, 0.16) !important;
    border-color: rgba(199, 210, 254, 0.6) !important;
  }
  :global(.adkar-section-wrap.evening-mode .adkar-pdf-link:hover) {
    background: rgba(255, 255, 255, 0.28) !important;
  }

  /* Highlighting for Morning vs Evening Differing Lines/Phrases */
  :global(mark.adkar-diff-hl) {
    background: #fef08a;
    color: #854d0e;
    font-weight: 800;
    padding: 1px 5px;
    border-radius: 4px;
    border-bottom: 2px solid #eab308;
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
    display: inline;
    box-shadow: 0 1px 3px rgba(234, 179, 8, 0.22);
  }

  :global(.adkar-pdf-arabic mark.adkar-diff-hl) {
    background: #fef08a;
    color: #0f172a;
    font-weight: bold;
    padding: 0 6px;
    border-radius: 5px;
    border-bottom: 2.5px solid #d97706;
    line-height: 1.8;
  }

  :global(.adkar-pdf-urdu) {
    font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', 'Jameel Noori Nastaleeq', 'Amiri', serif, system-ui;
    direction: rtl;
    font-size: 14.5px;
    font-weight: 700;
    color: #b48216; /* same golden amber colour as transliteration */
    line-height: 1.95;
    margin-bottom: 9px;
    text-align: center;
  }

  :global(.adkar-pdf-urdu mark.adkar-diff-hl) {
    background: #fef08a;
    color: #0f172a;
    font-weight: bold;
    padding: 0 5px;
    border-radius: 4px;
    border-bottom: 2px solid #d97706;
  }

  :global(.adkar-pdf-translit mark.adkar-diff-hl) {
    background: #fef08a;
    color: #78350f;
    font-weight: 800;
    border-bottom: 2px solid #ca8a04;
  }

  :global(.adkar-pdf-trans mark.adkar-diff-hl) {
    background: #fef08a;
    color: #1e293b;
    font-weight: 700;
    border-bottom: 2px solid #eab308;
  }

  /* Evening Twilight Theme Highlight */
  :global(.adkar-section-wrap.evening-mode mark.adkar-diff-hl) {
    background: #fed7aa;
    color: #7c2d12;
    border-bottom: 2px solid #ea580c;
    box-shadow: 0 1px 3px rgba(234, 88, 12, 0.22);
  }

  :global(.adkar-section-wrap.evening-mode .adkar-pdf-arabic mark.adkar-diff-hl) {
    background: #fed7aa;
    color: #18181b;
    border-bottom: 2.5px solid #c2410c;
  }

  :global(.adkar-section-wrap.evening-mode .adkar-pdf-urdu mark.adkar-diff-hl) {
    background: #fed7aa;
    color: #18181b;
    border-bottom: 2px solid #ea580c;
  }

  :global(.adkar-section-wrap.evening-mode .adkar-pdf-translit mark.adkar-diff-hl) {
    background: #fed7aa;
    color: #7c2d12;
    border-bottom: 2px solid #ea580c;
  }

  :global(.adkar-section-wrap.evening-mode .adkar-pdf-trans mark.adkar-diff-hl) {
    background: #fed7aa;
    color: #1c1917;
    border-bottom: 2px solid #ea580c;
  }
</style>
