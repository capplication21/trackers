let tauriStore = null;

function isTauriEnvironment() {
  return typeof window !== 'undefined' && Boolean(window.__TAURI_INTERNALS__);
}

async function getTauriStore() {
  if (!isTauriEnvironment()) return null;
  if (!tauriStore) {
    try {
      const { load } = await import('@tauri-apps/plugin-store');
      tauriStore = await load('tracker_data.json', { autoSave: true });
    } catch (err) {
      console.warn('Tauri store load failed, falling back to localStorage:', err);
      return null;
    }
  }
  return tauriStore;
}

export const storageBridge = {
  isTauri: isTauriEnvironment,

  async getItem(key, defaultValue = null) {
    if (typeof window === 'undefined') return defaultValue;
    const store = await getTauriStore();
    if (store) {
      try {
        const val = await store.get(key);
        return val !== undefined && val !== null ? val : defaultValue;
      } catch (e) {
        console.warn(`Tauri store get error for ${key}:`, e);
      }
    }
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return defaultValue;
      try {
        return JSON.parse(raw);
      } catch {
        return raw;
      }
    } catch {
      return defaultValue;
    }
  },

  async setItem(key, value) {
    if (typeof window === 'undefined') return;
    const store = await getTauriStore();
    if (store) {
      try {
        await store.set(key, value);
        await store.save();
      } catch (e) {
        console.warn(`Tauri store set error for ${key}:`, e);
      }
    }
    // Also mirror to localStorage for seamless cross-mode dev
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (err) {
      console.warn('localStorage setItem failed:', err);
    }
  },

  async removeItem(key) {
    if (typeof window === 'undefined') return;
    const store = await getTauriStore();
    if (store) {
      try {
        await store.delete(key);
        await store.save();
      } catch (e) {}
    }
    try {
      localStorage.removeItem(key);
    } catch {}
  },

  async importFromLocalStorage() {
    if (typeof window === 'undefined') return 0;
    const store = await getTauriStore();
    if (!store) return 0;
    let count = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          let val = localStorage.getItem(key);
          try {
            val = JSON.parse(val);
          } catch {}
          await store.set(key, val);
          count++;
        }
      }
      await store.save();
    } catch (err) {
      console.error('Failed to import localStorage keys:', err);
    }
    return count;
  }
};
