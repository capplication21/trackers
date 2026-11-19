import adkarDataset from '$lib/data/adkarData.json';
import { storageBridge } from './storageBridge.js';

class AdkarStore {
  activeSection = $state('morning'); // 'morning' | 'evening' | 'surahs'
  morningItems = $state(adkarDataset.morning);
  eveningItems = $state(adkarDataset.evening);
  surahs = $state(adkarDataset.surahs);
  counters = $state({}); // { [itemId]: number }
  isInitialized = false;

  async init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    const savedCounters = await storageBridge.getItem('adkar_counters_v1');
    if (savedCounters && typeof savedCounters === 'object') {
      this.counters = savedCounters;
    }
  }

  get currentItems() {
    if (this.activeSection === 'morning') return this.morningItems;
    if (this.activeSection === 'evening') return this.eveningItems;
    return [];
  }

  async increment(id, max = 1) {
    const cur = this.counters[id] || 0;
    if (cur < max) {
      this.counters = { ...this.counters, [id]: cur + 1 };
      await storageBridge.setItem('adkar_counters_v1', this.counters);
    }
  }

  async resetCounters() {
    this.counters = {};
    await storageBridge.setItem('adkar_counters_v1', {});
  }
}

export const adkarState = new AdkarStore();
