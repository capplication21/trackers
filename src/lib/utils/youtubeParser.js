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

/**
 * Returns a valid YouTube embed URL whether given a video or a playlist.
 * @param {string} urlOrId
 * @returns {string}
 */
export function getYouTubeEmbedUrl(urlOrId) {
  if (!urlOrId) return "";
  const str = String(urlOrId).trim();
  const playlistMatch = str.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  if (playlistMatch && playlistMatch[1]) {
    return `https://www.youtube.com/embed/videoseries?list=${playlistMatch[1]}`;
  }
  const videoId = extractYouTubeId(str);
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return "";
}
