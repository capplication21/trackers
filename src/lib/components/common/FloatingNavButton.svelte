<script>
  import { navigationState } from '$lib/stores/navigationState.svelte.js';
</script>

{#if navigationState.activeTab !== 'navigator'}
  <button
    type="button"
    class="floating-nav-pill"
    id="floatingNavBtn"
    style="display: inline-flex !important; position: fixed !important; bottom: 20px !important; right: 20px !important; z-index: 999999 !important;"
    onclick={() => navigationState.setTab('navigator')}
    title="Open Navigators Hub"
  >
    <span class="floating-icon">🧭</span> Navigators
  </button>
{:else}
  <button
    type="button"
    class="floating-nav-pill floating-nav-hub-return"
    id="floatingNavBtn"
    style="display: inline-flex !important; position: fixed !important; bottom: 20px !important; right: 20px !important; z-index: 999999 !important; background: linear-gradient(135deg, #0e7a78 0%, #159895 100%) !important;"
    onclick={() => navigationState.setTab(navigationState.previousTab || 'schedule')}
    title="Return to last visited app"
  >
    <span class="floating-icon">⚡</span> Last App
  </button>
{/if}
