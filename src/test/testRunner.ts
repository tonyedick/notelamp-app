import { parseBibleReferences, parseSingleReference, formatBibleReference } from '../domain/parser/bibleReferenceParser';
import { BibleRepository } from '../data/repository/BibleRepository';
import { NoteRepository } from '../data/repository/NoteRepository';
import { PdfRepository } from '../data/repository/PdfRepository';

export interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  message?: string;
  durationMs: number;
}

export function runAllPulpitNotesTests(): TestResult[] {
  const results: TestResult[] = [];

  function assert(suite: string, name: string, fn: () => void) {
    const t0 = performance.now();
    try {
      fn();
      results.push({ suite, name, passed: true, durationMs: Math.round(performance.now() - t0) });
    } catch (err: any) {
      results.push({
        suite,
        name,
        passed: false,
        message: err?.message || String(err),
        durationMs: Math.round(performance.now() - t0),
      });
    }
  }

  // Suite 1: Bible Reference Parser
  assert('Reference Parser', 'Parses single verse "John 3:16"', () => {
    const refs = parseBibleReferences('God so loved the world in John 3:16 today.');
    if (refs.length !== 1) throw new Error(`Expected 1 ref, got ${refs.length}`);
    if (refs[0].bookName !== 'John' || refs[0].chapter !== 3 || refs[0].fromVerse !== 16) {
      throw new Error(`Parsed values mismatch: ${JSON.stringify(refs[0])}`);
    }
    if (!refs[0].isValid) throw new Error('Reference should be valid');
  });

  assert('Reference Parser', 'Parses verse range with hyphen and en-dash "1 Corinthians 13:4-7" & "Hebrews 11:1–3"', () => {
    const ref1 = parseSingleReference('1 Corinthians 13:4-7');
    if (!ref1 || ref1.bookName !== '1 Corinthians' || ref1.chapter !== 13 || ref1.fromVerse !== 4 || ref1.toVerse !== 7) {
      throw new Error(`Failed to parse 1 Cor 13:4-7: ${JSON.stringify(ref1)}`);
    }

    const ref2 = parseSingleReference('Hebrews 11:1–3'); // unicode en-dash
    if (!ref2 || ref2.fromVerse !== 1 || ref2.toVerse !== 3) {
      throw new Error(`Failed to parse en-dash Hebrews 11:1–3: ${JSON.stringify(ref2)}`);
    }
  });

  assert('Reference Parser', 'Parses numbered book "2 Chronicles 5:14"', () => {
    const ref = parseSingleReference('2 Chronicles 5:14');
    if (!ref || ref.bookName !== '2 Chronicles' || ref.chapter !== 5 || ref.fromVerse !== 14) {
      throw new Error(`Failed to parse 2 Chronicles 5:14`);
    }
  });

  assert('Reference Parser', 'Parses whole chapter "Psalm 23"', () => {
    const ref = parseSingleReference('Psalm 23');
    if (!ref || ref.bookName !== 'Psalms' || ref.chapter !== 23 || ref.toVerse !== undefined) {
      throw new Error(`Failed to parse Psalm 23 whole chapter: ${JSON.stringify(ref)}`);
    }
  });

  assert('Reference Parser', 'Parses comma-separated verses "John 3:16,18"', () => {
    const ref = parseSingleReference('John 3:16,18');
    if (!ref || ref.fromVerse !== 16 || !ref.additionalVerses?.includes(18)) {
      throw new Error(`Failed to parse comma verses: ${JSON.stringify(ref)}`);
    }
  });

  assert('Reference Parser', 'Rejects out-of-bounds chapter "John 99:1"', () => {
    const ref = parseSingleReference('John 99:1');
    if (!ref) throw new Error('Expected candidate to be captured');
    if (ref.isValid) throw new Error('Chapter 99 of John should be marked invalid');
  });

  assert('Reference Parser', 'Ignores ordinary numbers and non-biblical sentences', () => {
    const text = 'In 2025, there are 4 people attending section 12 at 3:30 pm.';
    const refs = parseBibleReferences(text);
    if (refs.length > 0) {
      throw new Error(`False positives detected: ${JSON.stringify(refs)}`);
    }
  });

  // Suite 2: Verse Retrieval
  assert('Verse Retrieval', 'Exact KJV Scripture retrieval for John 3:16', () => {
    const verse = BibleRepository.getVerse('John', 3, 16);
    if (!verse) throw new Error('Verse John 3:16 not found in KJV repository');
    if (!verse.text.includes('For God so loved the world')) {
      throw new Error(`Unexpected text: ${verse.text}`);
    }
  });

  assert('Verse Retrieval', 'Exact KJV Scripture retrieval for 2 Chronicles 5:14', () => {
    const verse = BibleRepository.getVerse('2CH', 5, 14);
    if (!verse) throw new Error('Verse 2 Chronicles 5:14 not found');
    if (!verse.text.includes('glory of the LORD had filled the house of God')) {
      throw new Error(`Unexpected text: ${verse.text}`);
    }
  });

  assert('Verse Retrieval', 'Exact KJV Scripture retrieval for Hebrews 11:1', () => {
    const verse = BibleRepository.getVerse('HEB', 11, 1);
    if (!verse) throw new Error('Verse Hebrews 11:1 not found');
    if (!verse.text.includes('Now faith is the substance of things hoped for')) {
      throw new Error(`Unexpected text: ${verse.text}`);
    }
  });

  assert('Verse Retrieval', 'Passage retrieval for range 1 Corinthians 13:4-7', () => {
    const ref = parseSingleReference('1 Corinthians 13:4-7')!;
    const verses = BibleRepository.getVersesForReference(ref);
    if (verses.length !== 4) {
      throw new Error(`Expected 4 verses (4, 5, 6, 7), got ${verses.length}`);
    }
  });

  assert('Verse Retrieval', 'Full text search for "peace"', () => {
    const results = BibleRepository.searchVerses('peace');
    if (results.length < 3) {
      throw new Error(`Expected at least 3 peace search results, got ${results.length}`);
    }
  });

  // Suite 3: Note Persistence & Debounced Autosave
  assert('Note Repository', 'Note creation, debounced update, and retrieval', () => {
    const initialCount = NoteRepository.getAllNotes().length;
    const testNote = NoteRepository.createNote('Diagnostic Test Sermon', 'Testing 2 Chronicles 5:14 in sermon.');
    if (!testNote.id) throw new Error('Created note has no ID');
    if (NoteRepository.getAllNotes().length !== initialCount + 1) {
      throw new Error('Note count did not increment');
    }

    // Update with immediate commit
    const updated = NoteRepository.updateNote(
      testNote.id,
      { content: 'Updated content with John 3:16.' },
      true
    );
    if (!updated || !updated.content.includes('John 3:16')) {
      throw new Error('Immediate update failed');
    }
    if (updated.detectedReferences.length === 0) {
      throw new Error('Did not detect John 3:16 in updated note');
    }

    // Cleanup
    NoteRepository.deleteNote(testNote.id);
    if (NoteRepository.getAllNotes().length !== initialCount) {
      throw new Error('Delete note did not restore previous count');
    }
  });

  // Suite 4: PDF Reading Position
  assert('PDF Repository', 'Persists and restores PDF page position', () => {
    const doc = PdfRepository.getDocument('doc_1');
    if (!doc) throw new Error('Default document doc_1 missing');
    const originalPage = doc.currentPage;

    PdfRepository.updateReadingPosition('doc_1', 6);
    const updated = PdfRepository.getDocument('doc_1');
    if (updated?.currentPage !== 6) {
      throw new Error(`Expected page 6, got ${updated?.currentPage}`);
    }

    // Restore original
    PdfRepository.updateReadingPosition('doc_1', originalPage);
  });

  return results;
}
