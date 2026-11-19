/**
 * Triggers subtle physical vibration on Android/iOS devices when running inside Tauri.
 * Safely no-ops on desktop Windows/macOS or browser preview.
 * @param {'light' | 'medium' | 'heavy' | 'selection'} type
 */
export async function triggerHaptic(type = 'light') {
  if (typeof window === 'undefined' || !window.__TAURI_INTERNALS__) return;
  try {
    const { impactFeedback, selectionFeedback } = await import('@tauri-apps/plugin-haptics');
    if (type === 'selection') {
      await selectionFeedback();
    } else {
      await impactFeedback(type);
    }
  } catch {
    // Desktop or haptics unavailable
  }
}
