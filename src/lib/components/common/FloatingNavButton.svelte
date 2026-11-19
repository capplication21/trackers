<script>
  import { navigationState } from '$lib/stores/navigationState.svelte.js';
</script>

{#if navigationState.activeTab !== 'navigator'}
  <button
    type="button"
    class="floating-nav-pill"
    id="floatingNavBtn"
    onclick={() => navigationState.setTab('navigator')}
    title="Open Navigators"
  >
    <span class="floating-icon">🧭</span> Navigators
  </button>
{/if}
