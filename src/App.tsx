import React, { useState, useEffect, useRef } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { HomeScreen } from './components/HomeScreen';
import { NotesEditorScreen } from './components/NotesEditorScreen';
import { BibleReaderScreen } from './components/BibleReaderScreen';
import { PdfReaderScreen } from './components/PdfReaderScreen';
import { PreacherModeScreen } from './components/PreacherModeScreen';
import { VerseSearchScreen } from './components/VerseSearchScreen';
import { NotesLibraryScreen } from './components/NotesLibraryScreen';
import { NoteDetailScreen } from './components/NoteDetailScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { BottomNav, TabType } from './components/BottomNav';
import { ScriptureToolkitSheet } from './components/ScriptureToolkitSheet';
import { DeviceFrame } from './components/DeviceFrame';
import { NoteRepository } from './data/repository/NoteRepository';
import { PdfRepository } from './data/repository/PdfRepository';
import { SettingsRepository } from './data/repository/SettingsRepository';
import { BibleReference, BibleVerse, AppSettings } from './domain/model/types';
import { parseSingleReference } from './domain/parser/bibleReferenceParser';

type ScreenType =
  | 'splash'
  | 'home'
  | 'editor'
  | 'bible'
  | 'pdf'
  | 'preacher'
  | 'search'
  | 'library'
  | 'note_detail'
  | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [activeNoteId, setActiveNoteId] = useState<string>('note_1');
  const [activeDocId, setActiveDocId] = useState<string>('doc_1');
  const [isFramed, setIsFramed] = useState<boolean>(true);
  const [settings, setSettings] = useState<AppSettings>(SettingsRepository.getSettings());

  // Bible Reader initial coordinates
  const [bibleTarget, setBibleTarget] = useState<{
    book: string;
    chapter: number;
    verse: number;
  }>({
    book: 'John',
    chapter: 3,
    verse: 16,
  });

  // Scripture Toolkit Sheet state
  const [scriptureToolkitRef, setScriptureToolkitRef] = useState<BibleReference | null>(null);

  // Hidden file input for PDF import
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = SettingsRepository.subscribe((s) => {
      setSettings(s);
      document.documentElement.setAttribute('data-theme', s.theme);
      document.documentElement.setAttribute('data-font-size', s.fontSize);
      if (s.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
    return () => unsub();
  }, []);

  const handleTabChange = (tab: TabType) => {
    setCurrentTab(tab);
    switch (tab) {
      case 'home':
        setCurrentScreen('home');
        break;
      case 'notes':
        setCurrentScreen('library');
        break;
      case 'bible':
        setCurrentScreen('bible');
        break;
      case 'library':
        setCurrentScreen('library');
        break;
      case 'settings':
        setCurrentScreen('settings');
        break;
    }
  };

  const handleCreateNewNote = () => {
    const newNote = NoteRepository.createNote('New Sermon Note', '');
    setActiveNoteId(newNote.id);
    setCurrentScreen('editor');
  };

  const handleCreateNoteWithVerse = (verse: BibleVerse) => {
    const title = `${verse.bookName} ${verse.chapter}:${verse.verse} Study`;
    const content = `Key Scripture: ${verse.bookName} ${verse.chapter}:${verse.verse}\n\n"${verse.text}" (${verse.translation})\n\nSermon Notes & Application:\n• `;
    const newNote = NoteRepository.createNote(title, content);
    setActiveNoteId(newNote.id);
    setCurrentScreen('editor');
  };

  const handleOpenInBible = (ref: BibleReference) => {
    setBibleTarget({
      book: ref.bookName || 'John',
      chapter: ref.chapter || 1,
      verse: ref.fromVerse || 1,
    });
    setCurrentTab('bible');
    setCurrentScreen('bible');
  };

  const handleOpenPreacherMode = (noteId: string) => {
    setActiveNoteId(noteId);
    setCurrentScreen('preacher');
  };

  const handleImportPdfClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePdfFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newDocId = `doc_${Date.now()}`;
    const newDoc = {
      id: newDocId,
      title: file.name,
      fileName: file.name,
      fileSize: file.size,
      pageCount: 5,
      currentPage: 1,
      createdAt: Date.now(),
      lastReadAt: Date.now(),
      contentSnippet: `Imported sermon notes document from ${file.name}.`,
      detectedReferences: ['John 3:16', 'Hebrews 11:1'],
    };

    PdfRepository.addDocument(newDoc);
    setActiveDocId(newDocId);
    setCurrentScreen('pdf');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return (
          <SplashScreen
            onGetStarted={() => {
              setCurrentScreen('home');
              setCurrentTab('home');
            }}
          />
        );

      case 'home':
        return (
          <HomeScreen
            onNavigateToNote={(id) => {
              setActiveNoteId(id);
              setCurrentScreen('editor');
            }}
            onNavigateToPreacher={(id) => handleOpenPreacherMode(id)}
            onNavigateToBible={(refStr) => {
              if (refStr) {
                const parsed = parseSingleReference(refStr);
                if (parsed) {
                  handleOpenInBible(parsed);
                  return;
                }
              }
              setCurrentTab('bible');
              setCurrentScreen('bible');
            }}
            onNavigateToPdf={(id) => {
              setActiveDocId(id);
              setCurrentScreen('pdf');
            }}
            onNavigateToLibrary={() => {
              setCurrentTab('library');
              setCurrentScreen('library');
            }}
            onNavigateToSearch={() => setCurrentScreen('search')}
            onCreateNewNote={handleCreateNewNote}
            onImportPdf={handleImportPdfClick}
          />
        );

      case 'editor':
        return (
          <NotesEditorScreen
            noteId={activeNoteId}
            onBack={() => {
              setCurrentScreen('home');
              setCurrentTab('home');
            }}
            onOpenInBible={handleOpenInBible}
            onOpenPreacherMode={handleOpenPreacherMode}
            onOpenScriptureToolkit={(ref) => setScriptureToolkitRef(ref)}
          />
        );

      case 'bible':
        return (
          <BibleReaderScreen
            initialBookName={bibleTarget.book}
            initialChapter={bibleTarget.chapter}
            initialVerse={bibleTarget.verse}
            onNavigateToSearch={() => setCurrentScreen('search')}
            onCreateNoteWithVerse={handleCreateNoteWithVerse}
            onOpenScriptureToolkit={(ref) => setScriptureToolkitRef(ref)}
          />
        );

      case 'pdf':
        return (
          <PdfReaderScreen
            documentId={activeDocId}
            onBack={() => {
              setCurrentScreen('home');
              setCurrentTab('home');
            }}
            onOpenScriptureToolkit={(ref) => setScriptureToolkitRef(ref)}
            onOpenInBible={handleOpenInBible}
            onImportNewPdf={handleImportPdfClick}
          />
        );

      case 'preacher':
        return (
          <PreacherModeScreen
            noteId={activeNoteId}
            onExit={() => setCurrentScreen('editor')}
            onOpenScripture={(ref) => setScriptureToolkitRef(ref)}
          />
        );

      case 'search':
        return (
          <VerseSearchScreen
            onBack={() => setCurrentScreen('home')}
            onSelectVerse={(verse) => {
              setBibleTarget({
                book: verse.bookName,
                chapter: verse.chapter,
                verse: verse.verse,
              });
              setCurrentTab('bible');
              setCurrentScreen('bible');
            }}
            onCreateNoteWithVerse={handleCreateNoteWithVerse}
          />
        );

      case 'library':
        return (
          <NotesLibraryScreen
            onSelectNote={(id) => {
              setActiveNoteId(id);
              setCurrentScreen('note_detail');
            }}
            onSelectPdf={(id) => {
              setActiveDocId(id);
              setCurrentScreen('pdf');
            }}
            onCreateNewNote={handleCreateNewNote}
          />
        );

      case 'note_detail':
        return (
          <NoteDetailScreen
            noteId={activeNoteId}
            onBack={() => setCurrentScreen('library')}
            onEdit={(id) => {
              setActiveNoteId(id);
              setCurrentScreen('editor');
            }}
            onPreach={handleOpenPreacherMode}
            onOpenInBible={handleOpenInBible}
            onOpenScriptureToolkit={(ref) => setScriptureToolkitRef(ref)}
          />
        );

      case 'settings':
        return (
          <SettingsScreen
            isDeviceFrameActive={isFramed}
            onToggleDeviceFrame={() => setIsFramed(!isFramed)}
          />
        );

      default:
        return null;
    }
  };

  const showBottomNav =
    currentScreen !== 'preacher' &&
    currentScreen !== 'splash' &&
    currentScreen !== 'editor' &&
    currentScreen !== 'pdf';

  return (
    <DeviceFrame
      isFramed={isFramed}
      onToggleFrame={() => setIsFramed(!isFramed)}
      theme={settings.theme}
      fontSize={settings.fontSize}
    >
      {/* Hidden file picker for PDF upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handlePdfFileSelected}
      />

      {/* Main Screen Router */}
      {renderCurrentScreen()}

      {/* Bottom Navigation Bar */}
      {showBottomNav && (
        <BottomNav currentTab={currentTab} onTabChange={handleTabChange} />
      )}

      {/* Global Scripture Toolkit Bottom Sheet (Screen 6) */}
      {scriptureToolkitRef && (
        <ScriptureToolkitSheet
          reference={scriptureToolkitRef}
          onClose={() => setScriptureToolkitRef(null)}
          onOpenInBible={handleOpenInBible}
          onInsertIntoNote={(text) => {
            if (activeNoteId) {
              const current = NoteRepository.getNoteById(activeNoteId);
              if (current) {
                NoteRepository.updateNote(
                  activeNoteId,
                  { content: `${current.content}\n\n${text}` },
                  true
                );
              }
            }
          }}
        />
      )}
    </DeviceFrame>
  );
}
