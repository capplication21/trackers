/**
 * Extracts the 11-character YouTube video ID from various URL formats
 * or returns the string if already a video ID.
 * @param {string} urlOrId
 * @returns {string}
 */
export function extractYouTubeId(urlOrId) {
  if (!urlOrId) return "";
  const str = String(urlOrId).trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) return str;
  const regExp = new RegExp("(?:youtu\\.be/|youtube\\.com/(?:embed/|v/|watch\\?v=|watch\\?.+&v=))([\\w-]{11})");
  const match = str.match(regExp);
  return match && match[1] ? match[1] : "";
}
