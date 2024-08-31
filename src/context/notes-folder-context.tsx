"use client";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

const defaultFolders = ["Favorites", "Trash", "Archived Notes"];

export interface Note {
  id: number; // Changed from string to number
  title: string;
  content: string;
  folderId: number;
  date: string;
}

export interface Folder {
  id: number;
  name: string;
  default: boolean;
}

export interface AddFolder {
  name: string;
  default: boolean;
}

interface NotesFolderContextType {
  notes: Note[];
  folders: Folder[];
  recentNotes: number[];
  addNote: (note: Omit<Note, "id">) => void;
  updateNote: (id: number, updates: Partial<Note>) => void; // Changed from string to number
  deleteNote: (id: number) => void; // Changed from string to number
  addFolder: (folder: AddFolder) => void;
  updateFolder: (id: number, updates: Folder) => void;
  viewNote: (id: number) => void; // Changed from string to number
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  activeNoteId: number; // Changed from string to number
  setActiveNoteId: React.Dispatch<React.SetStateAction<number>>; // Changed from string to number
  activeFolderId: number;
  setActiveFolderId: React.Dispatch<React.SetStateAction<number>>;
}

const NotesFolderContext = createContext<NotesFolderContextType | undefined>(
  undefined
);

export const useNotesFolder = () => {
  const context = useContext(NotesFolderContext);
  if (!context) {
    throw new Error("useNotesFolder must be used within a NotesFolderProvider");
  }
  return context;
};

export const NotesFolderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [recentNotes, setRecentNotes] = useState<number[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<number>(0); // Changed from string to number, default value 0
  const [activeFolderId, setActiveFolderId] = useState<number>(0);

  const getFolderId = () => {
    return folders.length + 1;
  };

  const getNoteId = () => {
    return notes.length + 1;
  };

  const addNote = (note: Omit<Note, "id">) => {
    const newNote = { ...note, id: getNoteId() };
    setNotes([...notes, newNote]);
    localStorage.setItem("notes", JSON.stringify([...notes, newNote]));
  };

  const updateNote = (id: number, updates: Partial<Note>) => {
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, ...updates } : note))
    );
    localStorage.setItem("notes", JSON.stringify(notes));
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
    setRecentNotes(recentNotes.filter((noteId) => noteId !== id));
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("recentNotes", JSON.stringify(recentNotes));
  };

  const addFolder = (folder: AddFolder) => {
    const newFolder = { ...folder, id: getFolderId() };
    setFolders([...folders, newFolder]);
    localStorage.setItem("folders", JSON.stringify([...folders, newFolder]));
  };

  const updateFolder = (id: number, updates: Folder) => {
    setFolders(
      folders.map((folder) =>
        folder.id === id ? { ...folder, ...updates } : folder
      )
    );
    localStorage.setItem("folders", JSON.stringify(folders));
  };

  const viewNote = (id: number) => {
    const viewedNote = notes.find((note) => note.id === id);
    if (viewedNote) {
      setActiveNoteId(id);
      setRecentNotes((prevRecent) => {
        const filteredRecent = prevRecent.filter((noteId) => noteId !== id);
        return [viewedNote.id, ...filteredRecent].slice(0, 5);
      });
      const filteredRecent = recentNotes.filter((noteId) => noteId !== id);
      let recentNotesArr = [viewedNote.id, ...filteredRecent].slice(0, 5);
      localStorage.setItem("recentNotes", JSON.stringify(recentNotesArr));
    }
  };

  useEffect(() => {
    let cachedFolders = localStorage.getItem("folders");
    if (cachedFolders) {
      setFolders(JSON.parse(cachedFolders));
    } else {
      // Create default folders directly
      const defaultFolderObjects = defaultFolders.map((folderName, index) => ({
        id: index + 1,
        name: folderName,
        default: true,
      }));
      setFolders(defaultFolderObjects);
    }
    let cachedNotes = localStorage.getItem("notes");
    if (cachedNotes) {
      setNotes(JSON.parse(cachedNotes));
    }
    let cachedRecentNotes = localStorage.getItem("recentNotes");
    if (cachedRecentNotes) {
      setRecentNotes(JSON.parse(cachedRecentNotes));
    }
  }, []);

  // ... existing code ...

  const value = {
    notes,
    folders,
    recentNotes,
    addNote,
    updateNote,
    deleteNote,
    addFolder,
    updateFolder,
    viewNote,
    setNotes,
    activeNoteId,
    setActiveNoteId,
    activeFolderId,
    setActiveFolderId,
  };

  return (
    <NotesFolderContext.Provider value={value}>
      {children}
    </NotesFolderContext.Provider>
  );
};
