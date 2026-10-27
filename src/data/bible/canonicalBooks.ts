import { BibleBook } from '../../domain/model/types';

export const CANONICAL_BOOKS: BibleBook[] = [
  // Old Testament (39 books)
  { id: 'GEN', name: 'Genesis', aliases: ['gen', 'ge', 'gn'], testament: 'OT', division: 'Law', order: 1, chapterCount: 50 },
  { id: 'EXO', name: 'Exodus', aliases: ['exo', 'ex', 'exod'], testament: 'OT', division: 'Law', order: 2, chapterCount: 40 },
  { id: 'LEV', name: 'Leviticus', aliases: ['lev', 'le', 'lv'], testament: 'OT', division: 'Law', order: 3, chapterCount: 27 },
  { id: 'NUM', name: 'Numbers', aliases: ['num', 'nu', 'nm', 'nb'], testament: 'OT', division: 'Law', order: 4, chapterCount: 36 },
  { id: 'DEU', name: 'Deuteronomy', aliases: ['deu', 'deut', 'dt'], testament: 'OT', division: 'Law', order: 5, chapterCount: 34 },
  { id: 'JOS', name: 'Joshua', aliases: ['jos', 'josh', 'jsh'], testament: 'OT', division: 'Historical', order: 6, chapterCount: 24 },
  { id: 'JDG', name: 'Judges', aliases: ['jdg', 'judg', 'jg', 'jdgs'], testament: 'OT', division: 'Historical', order: 7, chapterCount: 21 },
  { id: 'RUT', name: 'Ruth', aliases: ['rut', 'rth', 'ru'], testament: 'OT', division: 'Historical', order: 8, chapterCount: 4 },
  { id: '1SA', name: '1 Samuel', aliases: ['1 samuel', '1 sam', '1 sa', '1sam', '1s', 'i samuel', 'i sam'], testament: 'OT', division: 'Historical', order: 9, chapterCount: 31 },
  { id: '2SA', name: '2 Samuel', aliases: ['2 samuel', '2 sam', '2 sa', '2sam', '2s', 'ii samuel', 'ii sam'], testament: 'OT', division: 'Historical', order: 10, chapterCount: 24 },
  { id: '1KI', name: '1 Kings', aliases: ['1 kings', '1 kgs', '1 ki', '1ki', '1k', 'i kings', 'i kgs'], testament: 'OT', division: 'Historical', order: 11, chapterCount: 22 },
  { id: '2KI', name: '2 Kings', aliases: ['2 kings', '2 kgs', '2 ki', '2ki', '2k', 'ii kings', 'ii kgs'], testament: 'OT', division: 'Historical', order: 12, chapterCount: 25 },
  { id: '1CH', name: '1 Chronicles', aliases: ['1 chronicles', '1 chron', '1 chr', '1 ch', '1chr', '1ch', 'i chronicles', 'i chron'], testament: 'OT', division: 'Historical', order: 13, chapterCount: 29 },
  { id: '2CH', name: '2 Chronicles', aliases: ['2 chronicles', '2 chron', '2 chr', '2 ch', '2chr', '2ch', 'ii chronicles', 'ii chron'], testament: 'OT', division: 'Historical', order: 14, chapterCount: 36 },
  { id: 'EZR', name: 'Ezra', aliases: ['ezr', 'ez'], testament: 'OT', division: 'Historical', order: 15, chapterCount: 10 },
  { id: 'NEH', name: 'Nehemiah', aliases: ['neh', 'ne'], testament: 'OT', division: 'Historical', order: 16, chapterCount: 13 },
  { id: 'EST', name: 'Esther', aliases: ['est', 'esth', 'es'], testament: 'OT', division: 'Historical', order: 17, chapterCount: 10 },
  { id: 'JOB', name: 'Job', aliases: ['job', 'jb'], testament: 'OT', division: 'Poetry', order: 18, chapterCount: 42 },
  { id: 'PSA', name: 'Psalms', aliases: ['psalms', 'psalm', 'psa', 'ps', 'pss'], testament: 'OT', division: 'Poetry', order: 19, chapterCount: 150 },
  { id: 'PRO', name: 'Proverbs', aliases: ['proverbs', 'prov', 'pro', 'pr', 'prv'], testament: 'OT', division: 'Poetry', order: 20, chapterCount: 31 },
  { id: 'ECC', name: 'Ecclesiastes', aliases: ['ecclesiastes', 'eccl', 'ecc', 'ec'], testament: 'OT', division: 'Poetry', order: 21, chapterCount: 12 },
  { id: 'SNG', name: 'Song of Solomon', aliases: ['song of solomon', 'song', 'songs', 'sos', 'canticles', 'cant'], testament: 'OT', division: 'Poetry', order: 22, chapterCount: 8 },
  { id: 'ISA', name: 'Isaiah', aliases: ['isaiah', 'isa', 'is'], testament: 'OT', division: 'Major Prophets', order: 23, chapterCount: 66 },
  { id: 'JER', name: 'Jeremiah', aliases: ['jeremiah', 'jer', 'je', 'jr'], testament: 'OT', division: 'Major Prophets', order: 24, chapterCount: 52 },
  { id: 'LAM', name: 'Lamentations', aliases: ['lamentations', 'lam', 'la'], testament: 'OT', division: 'Major Prophets', order: 25, chapterCount: 5 },
  { id: 'EZK', name: 'Ezekiel', aliases: ['ezekiel', 'ezek', 'eze', 'ezk'], testament: 'OT', division: 'Major Prophets', order: 26, chapterCount: 48 },
  { id: 'DAN', name: 'Daniel', aliases: ['daniel', 'dan', 'da', 'dn'], testament: 'OT', division: 'Major Prophets', order: 27, chapterCount: 12 },
  { id: 'HOS', name: 'Hosea', aliases: ['hosea', 'hos', 'ho'], testament: 'OT', division: 'Minor Prophets', order: 28, chapterCount: 14 },
  { id: 'JOL', name: 'Joel', aliases: ['joel', 'joe', 'jl'], testament: 'OT', division: 'Minor Prophets', order: 29, chapterCount: 3 },
  { id: 'AMO', name: 'Amos', aliases: ['amos', 'am'], testament: 'OT', division: 'Minor Prophets', order: 30, chapterCount: 9 },
  { id: 'OBA', name: 'Obadiah', aliases: ['obadiah', 'obad', 'ob'], testament: 'OT', division: 'Minor Prophets', order: 31, chapterCount: 1 },
  { id: 'JON', name: 'Jonah', aliases: ['jonah', 'jon', 'jnh'], testament: 'OT', division: 'Minor Prophets', order: 32, chapterCount: 4 },
  { id: 'MIC', name: 'Micah', aliases: ['micah', 'mic'], testament: 'OT', division: 'Minor Prophets', order: 33, chapterCount: 7 },
  { id: 'NAM', name: 'Nahum', aliases: ['nahum', 'nah', 'na'], testament: 'OT', division: 'Minor Prophets', order: 34, chapterCount: 3 },
  { id: 'HAB', name: 'Habakkuk', aliases: ['habakkuk', 'hab', 'hb'], testament: 'OT', division: 'Minor Prophets', order: 35, chapterCount: 3 },
  { id: 'ZEP', name: 'Zephaniah', aliases: ['zephaniah', 'zeph', 'zep', 'zp'], testament: 'OT', division: 'Minor Prophets', order: 36, chapterCount: 3 },
  { id: 'HAG', name: 'Haggai', aliases: ['haggai', 'hag', 'hg'], testament: 'OT', division: 'Minor Prophets', order: 37, chapterCount: 2 },
  { id: 'ZEC', name: 'Zechariah', aliases: ['zechariah', 'zech', 'zec', 'zc'], testament: 'OT', division: 'Minor Prophets', order: 38, chapterCount: 14 },
  { id: 'MAL', name: 'Malachi', aliases: ['malachi', 'mal', 'ml'], testament: 'OT', division: 'Minor Prophets', order: 39, chapterCount: 4 },

  // New Testament (27 books)
  { id: 'MAT', name: 'Matthew', aliases: ['matthew', 'matt', 'mat', 'mt'], testament: 'NT', division: 'Gospels', order: 40, chapterCount: 28 },
  { id: 'MRK', name: 'Mark', aliases: ['mark', 'mrk', 'mar', 'mk'], testament: 'NT', division: 'Gospels', order: 41, chapterCount: 16 },
  { id: 'LUK', name: 'Luke', aliases: ['luke', 'luk', 'lk'], testament: 'NT', division: 'Gospels', order: 42, chapterCount: 24 },
  { id: 'JHN', name: 'John', aliases: ['john', 'jhn', 'joh', 'jn'], testament: 'NT', division: 'Gospels', order: 43, chapterCount: 21 },
  { id: 'ACT', name: 'Acts', aliases: ['acts', 'act', 'ac'], testament: 'NT', division: 'History', order: 44, chapterCount: 28 },
  { id: 'ROM', name: 'Romans', aliases: ['romans', 'rom', 'ro', 'rm'], testament: 'NT', division: 'Pauline Epistles', order: 45, chapterCount: 16 },
  { id: '1CO', name: '1 Corinthians', aliases: ['1 corinthians', '1 cor', '1 co', '1cor', '1c', 'i corinthians', 'i cor'], testament: 'NT', division: 'Pauline Epistles', order: 46, chapterCount: 16 },
  { id: '2CO', name: '2 Corinthians', aliases: ['2 corinthians', '2 cor', '2 co', '2cor', '2c', 'ii corinthians', 'ii cor'], testament: 'NT', division: 'Pauline Epistles', order: 47, chapterCount: 13 },
  { id: 'GAL', name: 'Galatians', aliases: ['galatians', 'gal', 'ga'], testament: 'NT', division: 'Pauline Epistles', order: 48, chapterCount: 6 },
  { id: 'EPH', name: 'Ephesians', aliases: ['ephesians', 'eph', 'ep'], testament: 'NT', division: 'Pauline Epistles', order: 49, chapterCount: 6 },
  { id: 'PHP', name: 'Philippians', aliases: ['philippians', 'phil', 'php', 'pp'], testament: 'NT', division: 'Pauline Epistles', order: 50, chapterCount: 4 },
  { id: 'COL', name: 'Colossians', aliases: ['colossians', 'col', 'co'], testament: 'NT', division: 'Pauline Epistles', order: 51, chapterCount: 4 },
  { id: '1TH', name: '1 Thessalonians', aliases: ['1 thessalonians', '1 thess', '1 th', '1th', 'i thessalonians', 'i thess'], testament: 'NT', division: 'Pauline Epistles', order: 52, chapterCount: 5 },
  { id: '2TH', name: '2 Thessalonians', aliases: ['2 thessalonians', '2 thess', '2 th', '2th', 'ii thessalonians', 'ii thess'], testament: 'NT', division: 'Pauline Epistles', order: 53, chapterCount: 3 },
  { id: '1TI', name: '1 Timothy', aliases: ['1 timothy', '1 tim', '1 ti', '1ti', 'i timothy', 'i tim'], testament: 'NT', division: 'Pauline Epistles', order: 54, chapterCount: 6 },
  { id: '2TI', name: '2 Timothy', aliases: ['2 timothy', '2 tim', '2 ti', '2ti', 'ii timothy', 'ii tim'], testament: 'NT', division: 'Pauline Epistles', order: 55, chapterCount: 4 },
  { id: 'TIT', name: 'Titus', aliases: ['titus', 'tit', 'ti'], testament: 'NT', division: 'Pauline Epistles', order: 56, chapterCount: 3 },
  { id: 'PHM', name: 'Philemon', aliases: ['philemon', 'philem', 'phm', 'pm'], testament: 'NT', division: 'Pauline Epistles', order: 57, chapterCount: 1 },
  { id: 'HEB', name: 'Hebrews', aliases: ['hebrews', 'heb', 'he'], testament: 'NT', division: 'General Epistles', order: 58, chapterCount: 13 },
  { id: 'JAS', name: 'James', aliases: ['james', 'jas', 'jm'], testament: 'NT', division: 'General Epistles', order: 59, chapterCount: 5 },
  { id: '1PE', name: '1 Peter', aliases: ['1 peter', '1 pet', '1 pe', '1pt', '1p', 'i peter', 'i pet'], testament: 'NT', division: 'General Epistles', order: 60, chapterCount: 5 },
  { id: '2PE', name: '2 Peter', aliases: ['2 peter', '2 pet', '2 pe', '2pt', '2p', 'ii peter', 'ii pet'], testament: 'NT', division: 'General Epistles', order: 61, chapterCount: 3 },
  { id: '1JN', name: '1 John', aliases: ['1 john', '1 jhn', '1 jn', '1jn', '1j', 'i john', 'i jhn'], testament: 'NT', division: 'General Epistles', order: 62, chapterCount: 5 },
  { id: '2JN', name: '2 John', aliases: ['2 john', '2 jhn', '2 jn', '2jn', '2j', 'ii john', 'ii jhn'], testament: 'NT', division: 'General Epistles', order: 63, chapterCount: 1 },
  { id: '3JN', name: '3 John', aliases: ['3 john', '3 jhn', '3 jn', '3jn', '3j', 'iii john', 'iii jhn'], testament: 'NT', division: 'General Epistles', order: 64, chapterCount: 1 },
  { id: 'JUD', name: 'Jude', aliases: ['jude', 'jud', 'jd'], testament: 'NT', division: 'General Epistles', order: 65, chapterCount: 1 },
  { id: 'REV', name: 'Revelation', aliases: ['revelation', 'rev', 're', 'apocalypse'], testament: 'NT', division: 'Apocalyptic', order: 66, chapterCount: 22 },
];

export const BOOK_LOOKUP_MAP = new Map<string, BibleBook>();

CANONICAL_BOOKS.forEach((book) => {
  BOOK_LOOKUP_MAP.set(book.name.toLowerCase(), book);
  BOOK_LOOKUP_MAP.set(book.id.toLowerCase(), book);
  book.aliases.forEach((alias: string) => {
    BOOK_LOOKUP_MAP.set(alias.toLowerCase(), book);
  });
});

export function findCanonicalBook(input: string): BibleBook | undefined {
  if (!input) return undefined;
  const clean = input.trim().toLowerCase().replace(/\./g, '');
  return BOOK_LOOKUP_MAP.get(clean);
}
