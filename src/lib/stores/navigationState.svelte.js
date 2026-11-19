class NavigationStore {
  activeTab = $state('reading'); // default to reading or navigator

  constructor() {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        this.activeTab = hash;
      }
      window.addEventListener('hashchange', () => {
        const newHash = window.location.hash.replace('#', '');
        if (newHash && newHash !== this.activeTab) {
          this.activeTab = newHash;
        }
      });
    }
  }

  setTab(tab) {
    this.activeTab = tab;
    if (typeof window !== 'undefined') {
      window.location.hash = tab;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

export const navigationState = new NavigationStore();
