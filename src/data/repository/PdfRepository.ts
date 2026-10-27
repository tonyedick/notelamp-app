import { ImportedDocument } from '../../domain/model/types';
import { Storage, STORAGE_KEYS, INITIAL_DOCUMENTS } from '../local/storage';

export interface SermonPage {
  pageNumber: number;
  title?: string;
  paragraphs: string[];
}

export const SAMPLE_SERMON_PAGES: Record<string, SermonPage[]> = {
  doc_1: [
    {
      pageNumber: 1,
      title: 'Faith That Moves Mountains',
      paragraphs: [
        'A comprehensive study guide on walking in divine confidence, overcoming fear, and standing on the immutable promises of God.',
        'Author: Pastor James Henderson | Grace Fellowship Series',
        'Key Passages: Hebrews 11:1-6, 2 Corinthians 5:7, Mark 11:22-24',
      ],
    },
    {
      pageNumber: 2,
      title: 'The Foundation of Mountain-Moving Faith',
      paragraphs: [
        'Before faith can move mountains, it must first be anchored in the character and sovereignty of God.',
        'Many believers mistake positive thinking for biblical faith. Positive thinking looks at human willpower; faith looks steadfastly at Christ.',
        'Proverbs 3:5-6 instructs us: "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths."',
      ],
    },
    {
      pageNumber: 3,
      title: 'Overcoming the Valley of Doubt',
      paragraphs: [
        'Doubt is not necessarily the absence of faith, but an invitation to seek deeper revelation.',
        'When Jesus spoke to the disciples about moving mountains, they were facing a situation where human strength had proven entirely ineffective.',
        'Romans 10:17 gives the divine remedy: "So then faith cometh by hearing, and hearing by the word of God."',
      ],
    },
    {
      pageNumber: 4,
      title: 'Walking in Faith',
      paragraphs: [
        'Faith means trusting God even when we cannot see the whole picture.',
        'Hebrews 11:1 provides the foundational definition: "Now faith is the substance of things hoped for, the evidence of things not seen."',
        'Our confidence comes from God’s promises, not merely from what is visible in the temporal realm.',
        '“Now faith is the substance of things hoped for, the evidence of things not seen.” When we embrace this truth, spiritual stability replaces emotional fluctuation.',
      ],
    },
    {
      pageNumber: 5,
      title: 'The Evidence of Things Unseen',
      paragraphs: [
        'Notice the two profound words used by the writer of Hebrews: substance and evidence.',
        'In the original Greek, substance (hypostasis) refers to an underlying title deed or concrete foundation.',
        '2 Corinthians 5:7 reminds the Church: "(For we walk by faith, not by sight:)"',
        'When you possess a deed to a property, you do not need to stand on every square foot to know it belongs to you.',
      ],
    },
    {
      pageNumber: 6,
      title: 'The Prayer of Faith and Action',
      paragraphs: [
        'True faith is never passive. Faith always steps forward in obedient action.',
        'James 2:17 warns that faith without works is dead. Faith breathes through our obedience and prayer.',
        'Philippians 4:6-7: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus."',
      ],
    },
    {
      pageNumber: 7,
      title: 'Enduring When Prayers Seem Delayed',
      paragraphs: [
        'What happens when the mountain does not move immediately? We remain steadfast.',
        'Romans 8:28 promises: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose."',
        'God often uses the mountain to build our spiritual muscles before He levels it before our feet.',
      ],
    },
    {
      pageNumber: 8,
      title: 'Benediction & Pastoral Application',
      paragraphs: [
        'Take courage, saints of God. No obstacle before you is greater than the One residing within you.',
        'Isaiah 26:3 declares: "Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee."',
        'Go forth this week with mountain-moving faith in the Living God!',
      ],
    },
  ],
};

class PdfRepositoryImpl {
  private documents: ImportedDocument[] = [];

  constructor() {
    this.documents = Storage.getItem<ImportedDocument[]>(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
  }

  private save() {
    Storage.setItem(STORAGE_KEYS.DOCUMENTS, this.documents);
  }

  public getAllDocuments(): ImportedDocument[] {
    return [...this.documents].sort((a, b) => b.lastReadAt - a.lastReadAt);
  }

  public getDocument(id: string): ImportedDocument | undefined {
    return this.documents.find((d) => d.id === id);
  }

  public updateReadingPosition(id: string, pageNumber: number) {
    const doc = this.documents.find((d) => d.id === id);
    if (doc) {
      doc.currentPage = Math.min(Math.max(1, pageNumber), doc.pageCount);
      doc.lastReadAt = Date.now();
      this.save();
    }
  }

  public addDocument(doc: ImportedDocument) {
    this.documents.unshift(doc);
    this.save();
  }

  public deleteDocument(id: string) {
    this.documents = this.documents.filter((d) => d.id !== id);
    this.save();
  }

  public getPagesForDocument(docId: string): SermonPage[] {
    if (SAMPLE_SERMON_PAGES[docId]) {
      return SAMPLE_SERMON_PAGES[docId];
    }
    // Fallback for user-uploaded documents
    return [
      {
        pageNumber: 1,
        title: 'Uploaded Document',
        paragraphs: [
          'This PDF document was imported into PulpitNotes.',
          'Key Scripture: Hebrews 11:1, 2 Chronicles 5:14, John 3:16',
          'Highlight any Bible reference in the text to instantly open the Scripture Toolkit!',
        ],
      },
    ];
  }
}

export const PdfRepository = new PdfRepositoryImpl();
