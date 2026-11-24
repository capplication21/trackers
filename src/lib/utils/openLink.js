/**
 * Opens a URL in the system browser when in Tauri, or in a new browser tab when in standard web.
 * Handles desktop Tauri webviews, pop-up blocker fallbacks, and mobile views.
 * @param {string | undefined | null} url
 */
export async function openExternalUrl(url) {
  if (!url || typeof window === 'undefined') return;

  const target = String(url).trim();
  if (!target) return;

  // 1. Try Tauri opener plugin if running inside Tauri
  const isTauri = Boolean(/** @type {any} */ (window).__TAURI_INTERNALS__);
  if (isTauri) {
    try {
      const { openUrl } = await import('@tauri-apps/plugin-opener');
      await openUrl(target);
      return;
    } catch (err) {
      console.warn('Tauri openUrl error, attempting fallback:', err);
    }
  }

  // 2. Standard Web fallback: window.open
  try {
    const win = window.open(target, '_blank', 'noopener,noreferrer');
    if (win) {
      win.focus?.();
      return;
    }
  } catch (err) {
    console.warn('window.open failed, trying click fallback:', err);
  }

  // 3. Fallback: simulate an anchor element click
  try {
    const a = document.createElement('a');
    a.href = target;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    window.location.href = target;
  }
}
