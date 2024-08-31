"use client";
import React from "react";
import { DragDropProvider, useDragDrop } from "@/context/drag-drop-context";
import Droppable from "@/components/ui/drag-drop/droppable";
import Draggable from "@/components/ui/drag-drop/draggable";
import { Note, Folder, useNotesFolder } from "@/context/notes-folder-context";
import { formatDate } from "@/utils";

interface NoteListProps {
  folderName?: string;
  notes: Note[];
  activeNoteId: number;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  setActiveNoteId: React.Dispatch<React.SetStateAction<number>>;
}

interface NoteListComponentProps extends NoteListProps {
  activeFolderId: number;
  folders: Folder[];
}

const NoteListComponent: React.FC<NoteListProps> = ({
  folderName,
  notes,
  activeNoteId,
  setNotes,
  setActiveNoteId,
}) => {
  const { isDragging } = useDragDrop();
  const { viewNote, activeFolderId } = useNotesFolder();

  const handleDrop = (draggedId: string | null, targetId: string) => {
    if (!draggedId) return;

    const draggedIndex = notes.findIndex(
      (note) => note.id.toString() === draggedId
    );
    const targetIndex = notes.findIndex(
      (note) => note.id.toString() === targetId
    );

    setNotes((prevNotes) => {
      const updatedNotes = [...prevNotes];
      const [draggedNote] = updatedNotes.splice(draggedIndex, 1);
      updatedNotes.splice(targetIndex, 0, draggedNote);
      return updatedNotes;
    });
  };
  const getNoteContent = (content: string) => {
    let htmlContent = content;
    let textContent = htmlContent.replace(/<[^>]*>?/g, "");
    return textContent.slice(0, 100);
  };

  return (
    <div className="text-gray-300 p-4 py-5 w-full h-screen overflow-y-auto">
      <h2 className="text-lg font-semibold mb-5">{folderName}</h2>
      <ul className={isDragging ? "outline outline-blue-700" : ""}>
        {notes
          .filter((note) => note.folderId === activeFolderId)
          .map((note) => (
            <Droppable
              key={note.id}
              id={note.id.toString()}
              onDrop={(draggableId) =>
                handleDrop(draggableId, note.id.toString())
              }
            >
              <Draggable id={note.id.toString()}>
                <li
                  className={`mb-3 cursor-pointer p-4 bg-dark-gray rounded ${
                    note.id === activeNoteId
                      ? "bg-light-gray"
                      : "hover:bg-light-gray"
                  }`}
                  onClick={() => viewNote(note.id)}
                >
                  <h3 className="text-sm font-medium">{note.title}</h3>
                  <p className="text-xs text-gray-400 text-light-gray">
                    {formatDate(note.date)}
                  </p>
                  <p className="text-xs mt-1 truncate text-gray">
                    {getNoteContent(note.content)}...
                  </p>
                </li>
              </Draggable>
            </Droppable>
          ))}
      </ul>
      {notes.filter((note) => note.folderId === activeFolderId).length ===
        0 && (
        <div className="flex items-center justify-center mt-48">
          <p className="text-gray-400 text-center">No notes found</p>
        </div>
      )}
    </div>
  );
};

const NoteList: React.FC<NoteListComponentProps> = ({
  activeFolderId,
  folders,
  ...props
}) => {
  const getFolderName = (folderId: number, folders: Folder[]) =>
    folders.find((folder) => folder.id === folderId)?.name || "";

  return (
    <DragDropProvider>
      <NoteListComponent
        folderName={getFolderName(activeFolderId, folders)}
        {...props}
      />
    </DragDropProvider>
  );
};

export default NoteList;
