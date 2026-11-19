import adkarDataset from '$lib/data/adkarData.json';
import { storageBridge } from './storageBridge.js';

class AdkarStore {
  morningItems = $state(adkarDataset.morning || []);
  eveningItems = $state(adkarDataset.evening || []);

  sectionState = $state({
    morning: { count: 0, total: 0 },
    evening: { count: 0, total: 0 }
  });

  duaIndex = $state({
    morning: 0,
    evening: 0
  });

  duaOpen = $state({
    morning: true,
    evening: true
  });

  isInitialized = false;

  async init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    for (const sec of ['morning', 'evening']) {
      const saved = await storageBridge.getItem(`adkar_section_${sec}_v1`);
      if (saved && typeof saved === 'object') {
        this.sectionState[sec] = {
          count: Math.min(Number(saved.count) || 0, 1000),
          total: Number(saved.total) || 0
        };
      }

      const savedDuaIdx = await storageBridge.getItem(`adkar_dua_idx_${sec}`);
      if (typeof savedDuaIdx === 'number') {
        this.duaIndex[sec] = savedDuaIdx;
      }
    }
  }

  async tapCounter(sec) {
    const st = this.sectionState[sec];
    if (st.count >= 1000) return;
    st.count = (Number(st.count) || 0) + 1;
    st.total = (Number(st.total) || 0) + 1;
    await storageBridge.setItem(`adkar_section_${sec}_v1`, $state.snapshot(st));

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(st.count === 1000 ? [25, 35, 25] : 10);
      } catch {}
    }
  }

  async resetCounter(sec) {
    if (
      this.sectionState[sec].count > 0 &&
      typeof window !== 'undefined' &&
      !window.confirm('Are you sure you want to reset this counter?')
    ) {
      return;
    }
    this.sectionState[sec].count = 0;
    await storageBridge.setItem(`adkar_section_${sec}_v1`, $state.snapshot(this.sectionState[sec]));
  }

  async setDuaIndex(sec, idx) {
    const max = sec === 'morning' ? this.morningItems.length : this.eveningItems.length;
    this.duaIndex[sec] = Math.max(0, Math.min(max - 1, idx));
    await storageBridge.setItem(`adkar_dua_idx_${sec}`, this.duaIndex[sec]);
  }

  toggleDuaOpen(sec) {
    this.duaOpen[sec] = !this.duaOpen[sec];
  }
}

export const adkarState = new AdkarStore();
