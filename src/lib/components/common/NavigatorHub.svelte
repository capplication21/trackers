<script>
  import { navigationState } from '$lib/stores/navigationState.svelte.js';

  const hubCards = [
    { id: 'reading', icon: '📚', badge: 'READING', title: 'Reading Book' },
    { id: 'schedule', icon: '⏰', badge: 'DAILY', title: 'Schedule' },
    { id: 'water', icon: '✅', badge: 'HABITS', title: 'Tracker' },
    { id: 'week', icon: '📅', badge: '3X/WEEK', title: '3x/Week' },
    { id: 'history', icon: '📜', badge: 'ARCHIVE', title: 'History' },
    { id: 'period', icon: '🩸', badge: 'HEALTH', title: 'Period' },
    { id: 'recipe', icon: '🍳', badge: 'KITCHEN', title: 'Recipe Book' },
    { id: 'english', icon: '🔤', badge: 'TOOLKIT', title: 'Toolkit' },
    { id: 'englishtest', icon: '📝', badge: 'EXAM', title: 'English Test' },
    { id: 'mathtest', icon: '🧮', badge: 'MATHS', title: 'Math Test' },
    { id: 'notes', icon: '🤲', badge: 'DUAAS', title: 'Duaa Book' },
    { id: 'pdf', icon: '📖', badge: 'BOOKS', title: 'PDF Reader' },
    { id: 'summary', icon: '📊', badge: 'STATS', title: 'Summary' },
    { id: 'templates', icon: '📋', badge: 'TEMPLATES', title: 'Template Book' },
    { id: 'adkar', icon: '📿', badge: 'ADKAR', title: 'Adkar' }
  ];
</script>

<div class="tab-content active" id="tab-navigator" style="display: block;">
  <div class="nav-hub-wrapper">
    <div class="nav-hub-header">
      <span class="nav-hub-badge">🧭 NAVIGATOR</span>
      <span class="nav-hub-sub">{hubCards.length} Apps</span>
    </div>

    <div class="hub-cards-grid" id="hubCardsGrid">
      {#each hubCards as card (card.id)}
        <div
          class="hub-card"
          onclick={() => navigationState.setTab(card.id)}
          onkeydown={(e) => { if (e.key === 'Enter') navigationState.setTab(card.id); }}
          tabindex="0"
          role="button"
        >
          <div class="hub-card-top">
            <span class="hub-card-icon">{card.icon}</span>
            <span class="hub-card-badge">{card.badge}</span>
          </div>
          <div class="hub-card-title">{card.title}</div>
        </div>
      {/each}
    </div>
  </div>
</div>
