import templatesDataset from '$lib/data/templatesData.json';
import { storageBridge } from './storageBridge.js';

class NotesStore {
  notesText = $state('');
  templates = $state(templatesDataset);
  isInitialized = false;

  async init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    const savedNotes = await storageBridge.getItem('journal_notes_content_v1');
    if (typeof savedNotes === 'string') {
      this.notesText = savedNotes;
    }
  }

  async saveNotes(text) {
    this.notesText = text;
    await storageBridge.setItem('journal_notes_content_v1', text);
  }

  applyTemplate(templateContent) {
    this.notesText = (this.notesText ? this.notesText + '\n\n' : '') + templateContent;
    this.saveNotes(this.notesText);
  }
}

export const notesState = new NotesStore();
