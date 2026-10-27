export type Testament = 'OT' | 'NT';

export type BookDivision =
  | 'Law'
  | 'Historical'
  | 'Poetry'
  | 'Major Prophets'
  | 'Minor Prophets'
  | 'Gospels'
  | 'History'
  | 'Pauline Epistles'
  | 'General Epistles'
  | 'Apocalyptic';

export interface BibleBook {
  id: string; // e.g., 'JHN', 'GEN', '2CH'
  name: string; // 'John', 'Genesis', '2 Chronicles'
  aliases: string[]; // ['jn', 'jhn', 'joh']
  testament: Testament;
  division: BookDivision;
  order: number; // 1 to 66
  chapterCount: number;
  versesPerChapter?: number[]; // verse counts for validation
}

export interface BibleVerse {
  id: string; // e.g. "JHN.3.16"
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string; // default "KJV"
}

export interface BibleReference {
  raw: string; // e.g. "John 3:16-18"
  bookId: string;
  bookName: string;
  chapter: number;
  fromVerse: number;
  toVerse?: number;
  additionalVerses?: number[];
  isValid: boolean;
  validationError?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string; // Markdown or rich text with Bible references
  folderId?: string;
  folderName?: string;
  tags: string[];
  detectedReferences: BibleReference[];
  createdAt: number;
  updatedAt: number;
  pinned?: boolean;
  series?: string;
  keyScripture?: string;
}

export interface Folder {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  noteCount: number;
  createdAt: number;
}

export interface Bookmark {
  id: string;
  reference: BibleReference;
  verseText: string;
  noteId?: string;
  createdAt: number;
  label?: string;
}

export interface ImportedDocument {
  id: string;
  title: string;
  fileName: string;
  fileSize: number;
  pageCount: number;
  currentPage: number;
  createdAt: number;
  lastReadAt: number;
  contentSnippet?: string;
  detectedReferences?: string[];
  pdfDataUrl?: string; // base64 or object URL
}

export type AppTheme = 'cream' | 'light' | 'dark' | 'sepia';
export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

export interface AppSettings {
  theme: AppTheme;
  fontSize: FontSize;
  preacherKeepScreenAwake: boolean;
  preacherFontSize: number; // pt size e.g. 26
  preacherHighContrast: boolean;
  autoDetectScripture: boolean;
  bibleVersion: string; // "KJV"
  userName: string;
  userEmail: string;
  userRole: string;
  offlineStatus: 'ready' | 'downloading' | 'error';
  lastSyncTimestamp: number;
}

export type AutosaveStatus = 'saved' | 'saving' | 'failed' | 'idle';
