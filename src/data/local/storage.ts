import { Folder, Note, ImportedDocument, AppSettings } from '../../domain/model/types';
import { parseBibleReferences } from '../../domain/parser/bibleReferenceParser';

const STORAGE_KEYS = {
  NOTES: 'notelamp_notes_v1',
  FOLDERS: 'notelamp_folders_v1',
  DOCUMENTS: 'notelamp_docs_v1',
  SETTINGS: 'notelamp_settings_v1',
  BOOKMARKS: 'notelamp_bookmarks_v1',
};

export const INITIAL_FOLDERS: Folder[] = [
  { id: 'f_sermons', name: 'Sermons', noteCount: 12, createdAt: Date.now() - 30 * 86400000 },
  { id: 'f_biblestudy', name: 'Bible Study', noteCount: 8, createdAt: Date.now() - 25 * 86400000 },
  { id: 'f_reflections', name: 'Personal Reflections', noteCount: 6, createdAt: Date.now() - 20 * 86400000 },
  { id: 'f_booknotes', name: 'Book Notes', noteCount: 4, createdAt: Date.now() - 15 * 86400000 },
  { id: 'f_romans', name: 'Romans Series', noteCount: 5, createdAt: Date.now() - 10 * 86400000 },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note_1',
    title: "The Power of God's Presence",
    folderId: 'f_sermons',
    folderName: 'Sermon Notes',
    tags: ['Presence', 'Worship', 'Glory'],
    series: 'Sunday Morning Sermons',
    keyScripture: '2 Chronicles 5:14',
    content: `The presence of God makes the difference in the life of a believer.

2 Chronicles 5:14
When the priests came out of the holy place, the glory of the Lord filled the house of God.

When we seek God's presence, there is transformation, power and peace.

I. The Result of His Presence
• He fills the house (2 Chronicles 5:14)
• Human effort bows before divine majesty
• The priests could not stand to minister because of the weight of glory

II. How We Enter His Gates
• Thanksgiving in the outer court
• Praise in the holy place
• Reverence and surrender in the Holy of Holies (John 3:16)

Conclusion:
Live where the cloud settles. Prioritise His presence over performance.`,
    detectedReferences: parseBibleReferences(`2 Chronicles 5:14
John 3:16`),
    createdAt: new Date('2025-01-12T09:00:00Z').getTime(),
    updatedAt: new Date('2025-01-12T11:30:00Z').getTime(),
    pinned: true,
  },
  {
    id: 'note_2',
    title: 'Walking in Faith',
    folderId: 'f_sermons',
    folderName: 'Sermon Notes',
    tags: ['Faith', 'Trust', 'Christian Walk'],
    series: 'Faith Series',
    keyScripture: 'Hebrews 11:1',
    content: `Faith means trusting God even when we cannot see the whole picture.

Key Scriptures:
• Hebrews 11:1 - Now faith is the substance of things hoped for, the evidence of things not seen.
• 2 Corinthians 5:7 - For we walk by faith, not by sight.
• Romans 10:17 - So then faith cometh by hearing, and hearing by the word of God.

Sermon Outline:
1. What is Faith?
   - A confident trust in God's promises regardless of circumstance.
   - It is substance and evidence inside the spirit.

2. Walking by Faith
   - Daily surrender and obedience.
   - Not dictated by sight, emotion, or worldly logic.

3. The Source of Faith
   - Faith grows as we hear and assimilate the Word of God.`,
    detectedReferences: parseBibleReferences(`Hebrews 11:1
2 Corinthians 5:7
Romans 10:17`),
    createdAt: new Date('2025-01-05T09:00:00Z').getTime(),
    updatedAt: new Date('2025-01-05T12:00:00Z').getTime(),
    pinned: true,
  },
  {
    id: 'note_3',
    title: "God's Plan in the Waiting",
    folderId: 'f_sermons',
    folderName: 'Sermon Notes',
    tags: ['Waiting', 'Hope', 'Purpose'],
    series: 'Sunday Morning Sermons',
    keyScripture: 'Romans 8:28',
    content: `Waiting is never wasted time in God's kingdom. God is actively forming character while we wait for circumstances to shift.

Romans 8:28
And we know that all things work together for good to them that love God, to them who are the called according to his purpose.

1. God is Sovereign over the Delay
   - Joseph waited in prison (Genesis).
   - Moses spent forty years in the wilderness.

2. Peace during the Process
   - Philippians 4:7: The peace of God guards your heart.
   - Isaiah 26:3: Perfect peace for minds stayed on Him.

Remember: God works in the silent seasons.`,
    detectedReferences: parseBibleReferences(`Romans 8:28
Philippians 4:7
Isaiah 26:3`),
    createdAt: new Date('2024-12-29T09:00:00Z').getTime(),
    updatedAt: new Date('2024-12-29T11:45:00Z').getTime(),
  },
];

export const INITIAL_DOCUMENTS: ImportedDocument[] = [
  {
    id: 'doc_1',
    title: 'Faith That Moves Mountains.pdf',
    fileName: 'Faith That Moves Mountains.pdf',
    fileSize: 1420000,
    pageCount: 8,
    currentPage: 4,
    createdAt: new Date('2025-01-02T10:00:00Z').getTime(),
    lastReadAt: new Date('2025-01-14T14:20:00Z').getTime(),
    contentSnippet:
      'Faith means trusting God even when we cannot see the whole picture. Hebrews 11:1 tells us: Now faith is the substance of things hoped for, the evidence of things not seen...',
    detectedReferences: ['Hebrews 11:1', '2 Corinthians 5:7'],
  },
];

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'cream',
  fontSize: 'medium',
  preacherKeepScreenAwake: true,
  preacherFontSize: 24,
  preacherHighContrast: true,
  autoDetectScripture: true,
  bibleVersion: 'KJV',
  userName: 'Pastor James',
  userEmail: 'pastor.james@email.com',
  userRole: 'Senior Pastor',
  offlineStatus: 'ready',
  lastSyncTimestamp: Date.now(),
};

/**
 * Storage helpers with fallback to in-memory store if localStorage is blocked
 */
class LocalStorageManager {
  private memStore = new Map<string, string>();

  public getItem<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const val = window.localStorage.getItem(key);
        if (val) return JSON.parse(val);
      }
    } catch (e) {
      console.warn('LocalStorage error reading key:', key, e);
    }
    const memVal = this.memStore.get(key);
    return memVal ? JSON.parse(memVal) : defaultValue;
  }

  public setItem<T>(key: string, value: T): boolean {
    const serialized = JSON.stringify(value);
    this.memStore.set(key, serialized);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, serialized);
        return true;
      }
    } catch (e) {
      console.warn('LocalStorage error writing key:', key, e);
    }
    return true;
  }
}

export const Storage = new LocalStorageManager();
export { STORAGE_KEYS };
