import builtinStories from '$lib/data/stories.json';
import { storageBridge } from './storageBridge.js';
import { extractYouTubeId } from '$lib/utils/youtubeParser.js';

class ReadingStore {
  storyId = $state('story_linda');
  currentPage = $state(0);
  fontSize = $state(16);
  isSoundEnabled = $state(true);
  mediaMode = $state('compact'); // 'compact' | 'expanded'
  isMediaVisible = $state(true);
  activeFilter = $state('all'); // 'all' | 'level1' | 'level2'
  customVideoUrls = $state({});
  userStories = $state([]);
  bookmarks = $state({}); // { [storyId]: pageIndex }

  pageFlipInstance = null;
  isInitialized = false;

  constructor() {}

  async init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Load persistent state
    const saved = await storageBridge.getItem('english2flow_reading_state');
    if (saved && typeof saved === 'object') {
      this.storyId = 'story_linda'; // Only "A Mother's Secret: Love & Sacrifice" in book form
      if (typeof saved.currentPage === 'number') this.currentPage = saved.currentPage;
      if (typeof saved.fontSize === 'number') this.fontSize = saved.fontSize;
      if (typeof saved.isSoundEnabled === 'boolean') this.isSoundEnabled = saved.isSoundEnabled;
      if (saved.mediaMode) this.mediaMode = saved.mediaMode;
      if (typeof saved.isMediaVisible === 'boolean') this.isMediaVisible = saved.isMediaVisible;
      if (saved.activeFilter) this.activeFilter = saved.activeFilter;
      if (saved.customVideoUrls) this.customVideoUrls = saved.customVideoUrls;
    }

    const savedBookmarks = await storageBridge.getItem('english2flow_bookmarks');
    if (savedBookmarks && typeof savedBookmarks === 'object') {
      this.bookmarks = savedBookmarks;
    }
  }

  get allStories() {
    return builtinStories.filter(s => s.id === 'story_linda');
  }

  get currentStory() {
    return this.allStories.find((s) => s.id === this.storyId) || this.allStories[0] || builtinStories[0];
  }

  get currentVideoId() {
    const story = this.currentStory;
    if (this.customVideoUrls && this.customVideoUrls[story.id]) {
      const customId = extractYouTubeId(this.customVideoUrls[story.id]);
      if (customId) return customId;
    }
    return extractYouTubeId(story.videoUrl) || '3L_Oh4p-Ufg';
  }

  get filteredStories() {
    return this.allStories.filter((s) => {
      if (this.activeFilter === 'level1') return s.level.toLowerCase().includes('level 1');
      if (this.activeFilter === 'level2') return s.level.toLowerCase().includes('level 2');
      return true;
    });
  }

  async saveState() {
    await storageBridge.setItem('english2flow_reading_state', {
      storyId: this.storyId,
      currentPage: this.currentPage,
      fontSize: this.fontSize,
      isSoundEnabled: this.isSoundEnabled,
      mediaMode: this.mediaMode,
      isMediaVisible: this.isMediaVisible,
      activeFilter: this.activeFilter,
      customVideoUrls: this.customVideoUrls
    });
  }

  async setStory(id) {
    this.storyId = id;
    const bm = this.getStoryBookmark(id);
    this.currentPage = bm !== null ? bm : 0;
    await this.saveState();
  }

  getStoryBookmark(storyId) {
    const val = this.bookmarks[storyId];
    return typeof val === 'number' ? val : null;
  }

  isPageBookmarked(storyId, page) {
    return this.bookmarks[storyId] === page;
  }

  async toggleBookmark(storyId, page) {
    if (this.bookmarks[storyId] === page) {
      const updated = { ...this.bookmarks };
      delete updated[storyId];
      this.bookmarks = updated;
    } else {
      this.bookmarks = { ...this.bookmarks, [storyId]: page };
    }
    await storageBridge.setItem('english2flow_bookmarks', this.bookmarks);
  }

  async setFilter(filter) {
    this.activeFilter = filter;
    await this.saveState();
  }

  async toggleMediaMode() {
    this.mediaMode = this.mediaMode === 'compact' ? 'expanded' : 'compact';
    await this.saveState();
  }

  async toggleMediaVisibility() {
    this.isMediaVisible = !this.isMediaVisible;
    await this.saveState();
  }

  async toggleSound() {
    this.isSoundEnabled = !this.isSoundEnabled;
    await this.saveState();
  }

  async adjustFontSize(delta) {
    this.fontSize = Math.max(13, Math.min(23, this.fontSize + delta));
    await this.saveState();
  }

  async setCustomVideoUrl(storyId, url) {
    this.customVideoUrls = { ...this.customVideoUrls, [storyId]: url };
    await this.saveState();
  }

  async resetVideoUrl(storyId) {
    const updated = { ...this.customVideoUrls };
    delete updated[storyId];
    this.customVideoUrls = updated;
    await this.saveState();
  }

  async addUserStory(newStory) {
    this.userStories = [...this.userStories, newStory];
    await storageBridge.setItem('english2flow_user_stories', this.userStories);
    this.storyId = newStory.id;
    this.currentPage = 0;
    await this.saveState();
  }
}

export const readingState = new ReadingStore();
