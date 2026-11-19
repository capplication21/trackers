class NavigationStore {
  activeTab = $state('navigator'); // Default to Navigator Hub (15 Apps menu)
  previousTab = $state('schedule');

  constructor() {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash && hash !== '') {
        this.activeTab = hash;
      } else {
        this.activeTab = 'navigator';
      }

      window.addEventListener('hashchange', () => {
        const newHash = window.location.hash.replace('#', '').trim();
        if (newHash && newHash !== this.activeTab) {
          if (this.activeTab !== 'navigator') {
            this.previousTab = this.activeTab;
          }
          this.activeTab = newHash;
        } else if (!newHash) {
          this.activeTab = 'navigator';
        }
      });
    }
  }

  setTab(tab) {
    if (!tab) tab = 'navigator';
    if (this.activeTab !== 'navigator' && this.activeTab !== tab) {
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
