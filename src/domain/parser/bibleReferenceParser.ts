import { BibleReference } from '../model/types';
import { CANONICAL_BOOKS, findCanonicalBook } from '../../data/bible/canonicalBooks';

// Regex pattern to capture Bible references:
// 1. Optional book prefix: (?:[1-3]|I{1,3})\s*
// 2. Book name letters / spaces / periods
// 3. Chapter number
// 4. Optional colon / dot and verse numbers (ranges, commas)
// Dash variations: - (hyphen), – (en-dash), — (em-dash), − (minus)
const DASH_REGEX = /[-–—−]/;

// Match reference candidates in text
// Group 1: Book name with optional leading numeral (e.g. "1 Corinthians", "Psalm", "2 Chron", "Jn")
// Group 2: Chapter number
// Group 3: Optional verse part (e.g. ":16", ":4-7", ":16,18", " 16-18")
const REFERENCE_CANDIDATE_REGEX =
  /\b((?:[1-3]|I{1,3})\s+[A-Za-z]+|[A-Za-z]+(?:\s+of\s+[A-Za-z]+)?)\s+(\d{1,3})(?:[:\.](\d{1,3}(?:[–—−\-]\d{1,3})?(?:,\s*\d{1,3})*))?\b/gi;

/**
 * Parses all valid Bible references found within an arbitrary string of text.
 */
export function parseBibleReferences(text: string): BibleReference[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const results: BibleReference[] = [];
  const matches = Array.from(text.matchAll(REFERENCE_CANDIDATE_REGEX));

  for (const match of matches) {
    const rawMatch = match[0];
    const bookStr = match[1].trim();
    const chapterStr = match[2];
    const verseStr = match[3]; // may be undefined for "Psalm 23"

    const canonicalBook = findCanonicalBook(bookStr);
    if (!canonicalBook) {
      continue; // Not a recognized Bible book
    }

    const chapter = parseInt(chapterStr, 10);
    if (isNaN(chapter) || chapter <= 0) {
      continue;
    }

    // Validate chapter boundary against canonical book chapter count
    if (chapter > canonicalBook.chapterCount) {
      results.push({
        raw: rawMatch,
        bookId: canonicalBook.id,
        bookName: canonicalBook.name,
        chapter,
        fromVerse: 1,
        isValid: false,
        validationError: `${canonicalBook.name} has only ${canonicalBook.chapterCount} chapters (requested ${chapter})`,
      });
      continue;
    }

    // Parse verses
    if (!verseStr) {
      // Whole chapter reference (e.g., "Psalm 23")
      results.push({
        raw: rawMatch,
        bookId: canonicalBook.id,
        bookName: canonicalBook.name,
        chapter,
        fromVerse: 1,
        toVerse: undefined,
        isValid: true,
      });
      continue;
    }

    // Handle comma-separated verses e.g. "16,18" or "16, 18, 20"
    if (verseStr.includes(',')) {
      const parts = verseStr.split(',').map((p) => p.trim());
      const first = parseInt(parts[0], 10);
      const additional: number[] = [];

      for (let i = 1; i < parts.length; i++) {
        const v = parseInt(parts[i], 10);
        if (!isNaN(v) && v > 0) {
          additional.push(v);
        }
      }

      if (!isNaN(first) && first > 0) {
        results.push({
          raw: rawMatch,
          bookId: canonicalBook.id,
          bookName: canonicalBook.name,
          chapter,
          fromVerse: first,
          additionalVerses: additional,
          isValid: true,
        });
      }
      continue;
    }

    // Handle range with unicode dash variants e.g. "4-7", "16–18"
    if (DASH_REGEX.test(verseStr)) {
      const parts = verseStr.split(DASH_REGEX).map((p) => p.trim());
      const from = parseInt(parts[0], 10);
      const to = parseInt(parts[1], 10);

      if (!isNaN(from) && from > 0 && !isNaN(to) && to >= from) {
        results.push({
          raw: rawMatch,
          bookId: canonicalBook.id,
          bookName: canonicalBook.name,
          chapter,
          fromVerse: from,
          toVerse: to,
          isValid: true,
        });
      } else {
        results.push({
          raw: rawMatch,
          bookId: canonicalBook.id,
          bookName: canonicalBook.name,
          chapter,
          fromVerse: from || 1,
          isValid: false,
          validationError: `Invalid verse range in ${rawMatch}`,
        });
      }
      continue;
    }

    // Single verse e.g. "16"
    const singleVerse = parseInt(verseStr, 10);
    if (!isNaN(singleVerse) && singleVerse > 0) {
      results.push({
        raw: rawMatch,
        bookId: canonicalBook.id,
        bookName: canonicalBook.name,
        chapter,
        fromVerse: singleVerse,
        isValid: true,
      });
    }
  }

  // Deduplicate matches with identical raw text & canonical coordinates
  const seen = new Set<string>();
  return results.filter((ref) => {
    const key = `${ref.bookId}:${ref.chapter}:${ref.fromVerse}:${ref.toVerse || ''}:${ref.raw}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Parses a single reference string (e.g. from a user search or lookup input).
 */
export function parseSingleReference(input: string): BibleReference | null {
  const list = parseBibleReferences(input.trim());
  return list.length > 0 ? list[0] : null;
}

/**
 * Format a reference cleanly into canonical display string (e.g. "2 Chronicles 5:14" or "John 3:16-18")
 */
export function formatBibleReference(ref: BibleReference): string {
  let str = `${ref.bookName} ${ref.chapter}`;
  if (ref.fromVerse) {
    if (ref.toVerse) {
      str += `:${ref.fromVerse}-${ref.toVerse}`;
    } else if (ref.additionalVerses && ref.additionalVerses.length > 0) {
      str += `:${ref.fromVerse}, ${ref.additionalVerses.join(', ')}`;
    } else {
      str += `:${ref.fromVerse}`;
    }
  }
  return str;
}
