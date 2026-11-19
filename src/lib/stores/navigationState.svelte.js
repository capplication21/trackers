class NavigationStore {
  activeTab = $state('schedule'); // Default to daily schedule
  previousTab = $state('water');

  constructor() {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash && hash !== '' && hash !== 'navigator') {
        this.activeTab = hash;
      } else {
        this.activeTab = 'schedule';
      }

      window.addEventListener('hashchange', () => {
        const newHash = window.location.hash.replace('#', '').trim();
        if (newHash && newHash !== this.activeTab && newHash !== 'navigator') {
          this.previousTab = this.activeTab;
          this.activeTab = newHash;
        } else if (!newHash || newHash === 'navigator') {
          this.activeTab = 'schedule';
        }
      });
    }
  }

  setTab(tab) {
    if (!tab || tab === 'navigator') tab = 'schedule';
    if (this.activeTab !== tab) {
      this.previousTab = this.activeTab;
    }
    this.activeTab = tab;
    if (typeof window !== 'undefined') {
      window.location.hash = tab;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

export const navigationState = new NavigationStore();
