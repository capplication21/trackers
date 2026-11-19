<script>
  import { onMount } from 'svelte';
  import { adkarState } from '$lib/stores/adkarState.svelte.js';

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

  onMount(async () => {
    await adkarState.init();
  });
</script>

<div class="tab-content active" id="tab-adkar" style="display: block;">
  <!-- Pill Header Badge -->
  <div style="display: inline-flex; align-items: center; gap: 6px; background: #ffffff; border: 2.5px solid var(--ink); border-radius: 999px; padding: 6px 16px; font-weight: 800; font-size: 13px; margin-bottom: 14px; box-shadow: 0 2px 0 var(--ink);">
    <span style="font-size: 15px;">📿</span> ADKAR
  </div>

  <div style="display: flex; flex-direction: column; gap: 20px;">
    {#each sections as sec (sec.key)}
      {@const items = sec.key === 'morning' ? adkarState.morningItems : adkarState.eveningItems}
      {@const st = adkarState.sectionState[sec.key]}
      {@const duaIdx = adkarState.duaIndex[sec.key]}
      {@const isOpen = adkarState.duaOpen[sec.key]}
      {@const currentDua = items[duaIdx] || items[0]}

      <div class="adkar-section-wrap" style="position: relative;">
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
          >
            <span>📄</span> {sec.pdfLabel}
          </a>
        </div>

        <!-- Big Tap Counter Panel -->
        <div class="adkar-counter-panel">
          <button
            type="button"
            class="adkar-big-circle {st.count >= 1000 ? 'done' : ''}"
            onclick={() => adkarState.tapCounter(sec.key)}
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
              onclick={() => adkarState.resetCounter(sec.key)}
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
                onclick={() => adkarState.toggleDuaOpen(sec.key)}
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
                  onclick={() => adkarState.setDuaIndex(sec.key, i)}
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
                  <div style="font-size: 13.5px; font-weight: 800; color: #0f766e; margin-bottom: 10px; text-align: center;">
                    {currentDua.title}
                  </div>
                {/if}

                <div class="adkar-pdf-arabic" dir="rtl">
                  {currentDua.arabic}
                </div>

                <div class="adkar-pdf-translit">
                  {currentDua.translit}
                </div>

                <div class="adkar-pdf-trans">
                  {currentDua.meaning}
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
      </div>
    {/each}
  </div>
</div>
