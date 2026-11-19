<script>
  import { onMount } from 'svelte';
  import { storageBridge } from '$lib/stores/storageBridge.js';

  const defaultChores = [
    {
      key: 'mattress',
      theme: 'theme-mattress',
      icon: '🛏️',
      title: 'Turn & Flip Mattress',
      subtitle: 'Recommended every 3–6 months',
      defaultLogs: [
        { date: '30-08-26' },
        { date: '06-08-26' }
      ]
    },
    {
      key: 'room',
      theme: 'theme-room',
      icon: '🧹',
      title: 'Deep Room Cleaning',
      subtitle: 'Dusting, vacuuming & tidying',
      defaultLogs: [
        { date: '30-08-26' },
        { date: '06-08-26' }
      ]
    },
    {
      key: 'computer',
      theme: 'theme-computer',
      icon: '💻',
      title: 'Clean Computer & Desk',
      subtitle: 'Screen wipe, keyboard & cables',
      defaultLogs: [
        { date: '10-08-26' }
      ]
    }
  ];

  let choreLogs = $state({
    mattress: [],
    room: [],
    computer: []
  });

  let choreDates = $state({
    mattress: '',
    room: '',
    computer: ''
  });

  let dateInputs = {};

  onMount(async () => {
    for (const chore of defaultChores) {
      const stored = await storageBridge.getItem(`chore_log_${chore.key}_v1`);
      if (Array.isArray(stored) && stored.length > 0) {
        choreLogs[chore.key] = stored;
      } else {
        // Initialize with default seed logs so it matches the netlify design
        choreLogs[chore.key] = chore.defaultLogs;
        await storageBridge.setItem(`chore_log_${chore.key}_v1`, chore.defaultLogs);
      }
    }
  });

  function calculateDaysAgo(dateStr) {
    if (!dateStr) return null;
    let d, m, y;
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts[0].length === 4) {
        y = parseInt(parts[0], 10);
        m = parseInt(parts[1], 10) - 1;
        d = parseInt(parts[2], 10);
      } else {
        d = parseInt(parts[0], 10);
        m = parseInt(parts[1], 10) - 1;
        y = parts[2].length === 2 ? 2000 + parseInt(parts[2], 10) : parseInt(parts[2], 10);
      }
    }
    if (!d || isNaN(d) || isNaN(m) || isNaN(y)) return null;
    const entryDate = new Date(y, m, d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    entryDate.setHours(0, 0, 0, 0);
    const diffTime = today - entryDate;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  function formatChoreDaysAgoText(days) {
    if (days === null || isNaN(days)) return '';
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 0) return 'Future date';
    if (days < 30) return `${days}d ago`;
    if (days < 60) return '1mo ago';
    return `${Math.floor(days / 30)}mo ago`;
  }

  function getChoreBadge(entries) {
    if (!entries || entries.length === 0) {
      return { class: 'is-empty', text: '🌱 No logs yet' };
    }
    const days = calculateDaysAgo(entries[0].date);
    if (days === 0) {
      return { class: 'is-recent', text: '✨ Done Today' };
    } else if (days !== null && days <= 14) {
      return { class: 'is-recent', text: `⏳ ${formatChoreDaysAgoText(days)}` };
    } else if (days !== null && days <= 60) {
      return { class: 'is-moderate', text: `⚠️ ${formatChoreDaysAgoText(days)}` };
    } else {
      return { class: 'is-old', text: `⚠️ ${formatChoreDaysAgoText(days) || entries[0].date}` };
    }
  }

  function formatTodayDDMMYY() {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  }

  function isoToDDMMYY(iso) {
    if (!iso) return '';
    const parts = iso.split('-');
    if (parts.length === 3) {
      const year = parts[0].slice(-2);
      return `${parts[2]}-${parts[1]}-${year}`;
    }
    return iso;
  }

  async function logChoreToday(key) {
    const dateFormatted = formatTodayDDMMYY();
    const updated = [{ date: dateFormatted }, ...(choreLogs[key] || [])].slice(0, 50);
    choreLogs[key] = updated;
    await storageBridge.setItem(`chore_log_${key}_v1`, updated);
  }

  async function addChoreCustomDate(key) {
    const val = choreDates[key];
    if (!val) return;
    const dateFormatted = isoToDDMMYY(val);
    const updated = [{ date: dateFormatted }, ...(choreLogs[key] || [])].slice(0, 50);
    choreLogs[key] = updated;
    choreDates[key] = '';
    await storageBridge.setItem(`chore_log_${key}_v1`, updated);
  }

  async function deleteChoreEntry(key, index) {
    if (typeof window !== 'undefined' && !window.confirm('Delete this history record?')) {
      return;
    }
    const list = [...(choreLogs[key] || [])];
    list.splice(index, 1);
    choreLogs[key] = list;
    await storageBridge.setItem(`chore_log_${key}_v1`, list);
  }

  function openPicker(key) {
    const el = dateInputs[key];
    if (el) {
      if (typeof el.showPicker === 'function') {
        try {
          el.showPicker();
        } catch {
          el.focus();
        }
      } else {
        el.focus();
      }
    }
  }
</script>

<div class="tab-content active" id="tab-history" style="display: block;">
  <!-- Section Title Badge -->
  <div class="section-title water-title" style="margin-bottom: 14px;">
    <span>📜</span> ROUTINE HISTORY &amp; CHORES
  </div>

  <!-- Hero Banner -->
  <div class="history-hero-banner" style="margin-bottom: 16px;">
    <div class="history-hero-text">
      <h3>🏡 Home &amp; Hygiene Tracker</h3>
      <p>Keep track of when you last performed your regular routines.</p>
    </div>
    <div class="history-hero-icon">🧹</div>
  </div>

  <!-- Chore Cards -->
  <div style="display: flex; flex-direction: column; gap: 16px;">
    {#each defaultChores as chore (chore.key)}
      {@const entries = choreLogs[chore.key] || []}
      {@const badge = getChoreBadge(entries)}
      <div class="chore-hero-card {chore.theme}" id="choreCard-{chore.key}">
        <!-- Header -->
        <div class="chore-card-header">
          <div class="chore-card-title-wrap">
            <div class="chore-card-icon-badge">{chore.icon}</div>
            <div>
              <div class="chore-card-title">{chore.title}</div>
              <div class="chore-card-subtitle">{chore.subtitle}</div>
            </div>
          </div>
          <div class="chore-last-done-badge {badge.class}">
            {badge.text}
          </div>
        </div>

        <!-- Action Panel -->
        <div class="chore-action-panel">
          <div class="chore-action-row">
            <button
              type="button"
              class="chore-quick-today-btn"
              onclick={() => logChoreToday(chore.key)}
            >
              <span>✨</span> Log Today
            </button>

            <!-- Date Picker Box -->
            <div
              class="lecture-stat-box date-stat-box"
              style="position: relative; cursor: pointer; display: flex; align-items: center; gap: 6px; padding: 6px 12px; border: 1.5px solid var(--ink); border-radius: 10px; background: #ffffff; flex: 1; min-width: 120px;"
              onclick={() => openPicker(chore.key)}
              onkeydown={(e) => { if (e.key === 'Enter') openPicker(chore.key); }}
              role="button"
              tabindex="0"
            >
              <span class="lecture-date-icon">📅</span>
              <span class="typing-date-display" style="font-size: 12px; font-weight: 700; color: {choreDates[chore.key] ? 'var(--ink)' : '#64748b'};">
                {choreDates[chore.key] ? isoToDDMMYY(choreDates[chore.key]) : 'Select date'}
              </span>
              <input
                type="date"
                bind:this={dateInputs[chore.key]}
                bind:value={choreDates[chore.key]}
                style="position: absolute; opacity: 0; width: 100%; height: 100%; top: 0; left: 0; cursor: pointer;"
              />
            </div>

            <button
              type="button"
              class="chore-log-custom-btn"
              onclick={() => addChoreCustomDate(chore.key)}
            >
              <span>➕</span> Log
            </button>
          </div>
        </div>

        <!-- Log History -->
        <div class="chore-history-container">
          <div class="chore-history-header">
            <span>📜 LOG HISTORY</span>
            <span class="chore-history-count-tag">{entries.length} {entries.length === 1 ? 'LOG' : 'LOGS'}</span>
          </div>

          <div class="chore-history-list">
            {#if entries.length === 0}
              <div class="chore-history-empty" style="font-size: 11px; color: #7a7460; font-style: italic; padding: 8px 0;">
                No history recorded yet. Tap "Log Today" or select a date.
              </div>
            {:else}
              {#each entries as entry, index}
                {@const itemDays = calculateDaysAgo(entry.date)}
                {@const agoStr = formatChoreDaysAgoText(itemDays)}
                <div class="chore-history-item {index === 0 ? 'is-first' : ''}">
                  <div class="chore-history-date-info" style="display: flex; align-items: center; gap: 8px;">
                    <span class="chore-history-date">📅 {entry.date}</span>
                    {#if agoStr}
                      <span class="chore-history-ago">{agoStr}</span>
                    {/if}
                    {#if index === 0}
                      <span title="Latest Record" style="font-size: 11px;">⭐</span>
                    {/if}
                  </div>
                  <button
                    type="button"
                    class="chore-history-del-btn"
                    onclick={() => deleteChoreEntry(chore.key, index)}
                    title="Delete record"
                    style="background: transparent; border: none; cursor: pointer; font-size: 13px; padding: 2px 4px;"
                  >
                    🗑️
                  </button>
                </div>
              {/each}
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
