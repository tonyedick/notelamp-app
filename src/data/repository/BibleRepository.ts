import { BibleBook, BibleReference, BibleVerse } from '../../domain/model/types';
import { CANONICAL_BOOKS, findCanonicalBook } from '../bible/canonicalBooks';
import { VERIFIED_KJV_VERSES } from '../bible/kjvDataset';

class BibleRepositoryImpl {
  private versesMap = new Map<string, BibleVerse>();
  private allVerses: BibleVerse[] = [];

  constructor() {
    this.allVerses = [...VERIFIED_KJV_VERSES];
    this.indexVerses();
  }

  private indexVerses() {
    this.versesMap.clear();
    for (const v of this.allVerses) {
      // Key format: "JHN.3.16" and "john.3.16"
      this.versesMap.set(`${v.bookId.toUpperCase()}.${v.chapter}.${v.verse}`, v);
      this.versesMap.set(`${v.bookName.toLowerCase()}.${v.chapter}.${v.verse}`, v);
    }
  }

  public getBooks(): BibleBook[] {
    return CANONICAL_BOOKS;
  }

  public getBook(idOrName: string): BibleBook | undefined {
    return findCanonicalBook(idOrName);
  }

  public getVerse(bookIdOrName: string, chapter: number, verse: number): BibleVerse | undefined {
    const book = findCanonicalBook(bookIdOrName);
    if (!book) return undefined;
    return this.versesMap.get(`${book.id.toUpperCase()}.${chapter}.${verse}`);
  }

  public getChapterVerses(bookIdOrName: string, chapter: number): BibleVerse[] {
    const book = findCanonicalBook(bookIdOrName);
    if (!book) return [];

    return this.allVerses
      .filter((v) => v.bookId.toUpperCase() === book.id.toUpperCase() && v.chapter === chapter)
      .sort((a, b) => a.verse - b.verse);
  }

  /**
   * Retrieves verses matching a BibleReference.
   * If single verse: [verse]
   * If range: [v1, v2, v3]
   * If comma-separated: [v1, v2]
   */
  public getVersesForReference(ref: BibleReference): BibleVerse[] {
    const book = findCanonicalBook(ref.bookName || ref.bookId);
    if (!book) return [];

    const found: BibleVerse[] = [];

    if (ref.toVerse && ref.toVerse >= ref.fromVerse) {
      for (let v = ref.fromVerse; v <= ref.toVerse; v++) {
        const verse = this.getVerse(book.id, ref.chapter, v);
        if (verse) found.push(verse);
      }
    } else {
      const v1 = this.getVerse(book.id, ref.chapter, ref.fromVerse);
      if (v1) found.push(v1);

      if (ref.additionalVerses && ref.additionalVerses.length > 0) {
        for (const addV of ref.additionalVerses) {
          const vNext = this.getVerse(book.id, ref.chapter, addV);
          if (vNext) found.push(vNext);
        }
      }
    }

    return found;
  }

  /**
   * Full-text search for words, exact phrases, or topics.
   */
  public searchVerses(
    query: string,
    filter: 'all' | 'exact' | 'book' | 'topic' = 'all',
    selectedBookId?: string
  ): BibleVerse[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return this.allVerses.filter((v) => {
      if (selectedBookId && v.bookId.toUpperCase() !== selectedBookId.toUpperCase()) {
        return false;
      }

      const textLower = v.text.toLowerCase();

      if (filter === 'exact') {
        return textLower.includes(q);
      }

      if (filter === 'topic') {
        const words = q.split(/\s+/).filter(Boolean);
        return words.some((word) => textLower.includes(word));
      }

      // Default: match all words
      const words = q.split(/\s+/).filter(Boolean);
      return words.every((word) => textLower.includes(word));
    });
  }

  /**
   * Import custom external verified KJV dataset
   */
  public importVerses(newVerses: BibleVerse[]) {
    this.allVerses.push(...newVerses);
    this.indexVerses();
  }

  public getAvailableVersesCount(): number {
    return this.allVerses.length;
  }
}

export const BibleRepository = new BibleRepositoryImpl();
