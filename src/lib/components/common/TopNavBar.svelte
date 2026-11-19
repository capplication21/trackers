<script>
  import { navigationState } from '$lib/stores/navigationState.svelte.js';

  let isMenuOpen = $state(false);

  const navItems = [
    { id: 'schedule', icon: '⏰', badge: 'DAILY', title: 'Schedule' },
    { id: 'water', icon: '✅', badge: 'HABITS', title: 'Habit Tracker' },
    { id: 'week', icon: '📅', badge: '3X/WEEK', title: '3x/Week' },
    { id: 'history', icon: '📜', badge: 'ARCHIVE', title: 'History' },
    { id: 'period', icon: '🩸', badge: 'HEALTH', title: 'Period Tracker' },
    { id: 'recipe', icon: '🍳', badge: 'KITCHEN', title: 'Recipe Book' },
    { id: 'english', icon: '🔤', badge: 'TOOLKIT', title: 'English Toolkit' },
    { id: 'englishtest', icon: '📝', badge: 'EXAM', title: 'English Test' },
    { id: 'mathtest', icon: '🧮', badge: 'MATHS', title: 'Math Test' },
    { id: 'notes', icon: '🤲', badge: 'DUAAS', title: 'Duaa Book' },
    { id: 'pdf', icon: '📖', badge: 'BOOKS', title: 'PDF Reader' },
    { id: 'summary', icon: '📊', badge: 'STATS', title: 'Summary' },
    { id: 'templates', icon: '📋', badge: 'TEMPLATES', title: 'Template Book' },
    { id: 'adkar', icon: '📿', badge: 'ADKAR', title: 'Adkar' },
    { id: 'reading', icon: '📚', badge: 'READING', title: 'Reading Book' }
  ];

  const currentItem = $derived(
    navItems.find((item) => item.id === navigationState.activeTab) || navItems[0]
  );

  function selectTab(id) {
    navigationState.setTab(id);
    isMenuOpen = false;
  }
</script>

<header class="app-top-nav-bar">
  <div class="top-nav-inner">
    <div class="brand-badge">
      <span class="brand-icon">🌟</span>
      <span class="brand-title">TRACKER</span>
    </div>

    <div class="current-section-badge">
      <span class="section-icon">{currentItem.icon}</span>
      <span class="section-name">{currentItem.title}</span>
    </div>

    <button
      type="button"
      class="nav-menu-toggle-btn"
      class:active={isMenuOpen}
      onclick={() => (isMenuOpen = !isMenuOpen)}
      title="Open All Apps Menu"
    >
      <span class="menu-icon">{isMenuOpen ? '✕' : '☰'}</span>
      <span class="menu-text">Menu</span>
    </button>
  </div>

  {#if isMenuOpen}
    <div
      class="nav-menu-overlay"
      onclick={() => (isMenuOpen = false)}
      onkeydown={(e) => { if (e.key === 'Escape') isMenuOpen = false; }}
      role="button"
      tabindex="-1"
    >
      <div
        class="nav-menu-dropdown"
        onclick={(e) => e.stopPropagation()}
        onkeydown={(e) => e.stopPropagation()}
        role="dialog"
        tabindex="0"
      >
        <div class="dropdown-header">
          <div class="dropdown-title">
            <span class="title-icon">🧭</span>
            <span>All Apps & Tools</span>
            <span class="app-count">{navItems.length}</span>
          </div>
          <button
            type="button"
            class="dropdown-close-btn"
            onclick={() => (isMenuOpen = false)}
            title="Close menu"
          >
            ✕
          </button>
        </div>

        <div class="dropdown-grid">
          {#each navItems as item (item.id)}
            <button
              type="button"
              class="dropdown-item"
              class:selected={navigationState.activeTab === item.id}
              onclick={() => selectTab(item.id)}
            >
              <div class="item-icon-box">{item.icon}</div>
              <div class="item-info">
                <span class="item-name">{item.title}</span>
                <span class="item-badge">{item.badge}</span>
              </div>
            </button>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</header>

<style>
  .app-top-nav-bar {
    width: 100%;
    margin-bottom: 12px;
    position: sticky;
    top: 0;
    z-index: 9999;
    user-select: none;
  }

  .top-nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    background: #ffffff;
    border: 2.5px solid var(--ink, #141413);
    border-radius: 14px;
    padding: 8px 12px;
    box-shadow: 0 3px 0 var(--ink, #141413);
  }

  .brand-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #fef08a;
    border: 2px solid var(--ink, #141413);
    border-radius: 999px;
    padding: 4px 10px;
    font-size: 11.5px;
    font-weight: 900;
    letter-spacing: 0.5px;
    color: #141413;
    flex-shrink: 0;
  }

  .brand-icon {
    font-size: 13px;
  }

  .current-section-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 800;
    color: #1e1b4b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  }

  .section-icon {
    font-size: 15px;
  }

  .nav-menu-toggle-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    color: #ffffff;
    border: 2px solid var(--ink, #141413);
    border-radius: 999px;
    padding: 6px 14px;
    font-size: 13px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 2px 0 var(--ink, #141413);
    transition: all 0.15s ease;
    flex-shrink: 0;
  }

  .nav-menu-toggle-btn:hover {
    transform: translateY(-1.5px);
    box-shadow: 0 3.5px 0 var(--ink, #141413);
  }

  .nav-menu-toggle-btn:active {
    transform: translateY(1px);
    box-shadow: 0 1px 0 var(--ink, #141413);
  }

  .nav-menu-toggle-btn.active {
    background: #dc2626;
  }

  .nav-menu-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(3px);
    z-index: 100000;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: max(16px, env(safe-area-inset-top, 0px)) 12px 20px;
  }

  .nav-menu-dropdown {
    background: #ffffff;
    border: 2.5px solid var(--ink, #141413);
    border-radius: 20px;
    width: 100%;
    max-width: 440px;
    max-height: calc(100vh - 50px);
    overflow-y: auto;
    padding: 16px;
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.25), 0 5px 0 var(--ink, #141413);
    animation: menuSlideDown 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes menuSlideDown {
    from {
      opacity: 0;
      transform: translateY(-12px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .dropdown-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 12px;
    margin-bottom: 12px;
    border-bottom: 2px solid #e2e8f0;
  }

  .dropdown-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 900;
    color: #1e1b4b;
  }

  .app-count {
    background: #ede9fe;
    color: #6d28d9;
    font-size: 11px;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 999px;
  }

  .dropdown-close-btn {
    background: #f1f5f9;
    border: 2px solid var(--ink, #141413);
    border-radius: 50%;
    width: 30px;
    height: 30px;
    font-size: 14px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .dropdown-close-btn:hover {
    background: #fee2e2;
    color: #dc2626;
  }

  .dropdown-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #f8fafc;
    border: 2px solid var(--ink, #141413);
    border-radius: 12px;
    padding: 10px 12px;
    cursor: pointer;
    text-align: left;
    box-shadow: 0 2px 0 var(--ink, #141413);
    transition: all 0.15s ease;
  }

  .dropdown-item:hover {
    transform: translateY(-2px);
    background: #ffffff;
    box-shadow: 0 4px 0 var(--ink, #141413);
  }

  .dropdown-item.selected {
    background: #eff6ff;
    border-color: #3b82f6;
  }

  .item-icon-box {
    font-size: 20px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    border: 1.5px solid var(--ink, #141413);
    border-radius: 8px;
    flex-shrink: 0;
  }

  .item-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .item-name {
    font-size: 13px;
    font-weight: 800;
    color: #1e1b4b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .item-badge {
    font-size: 9.5px;
    font-weight: 800;
    color: #64748b;
    letter-spacing: 0.3px;
  }
</style>
