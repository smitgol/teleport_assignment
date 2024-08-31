import React from "react";
import { useNotesFolder } from "@/context/notes-folder-context";
import { DocumentIcon } from "../svgs/document-icon";

const RecentNotes: React.FC = () => {
  const { recentNotes, activeNoteId, viewNote, notes } = useNotesFolder();
  const getNoteTitle = (noteId: number) => {
    const note = notes.find((note) => note.id === noteId);
    return note?.title || "";
  };

  return (
    <div>
      <h2 className="text-gray-400 text-sm font-semibold py-2 px-4">Recents</h2>
      <ul className="w-full">
        {recentNotes.map((noteId) => (
          <li
            className={`flex items-center gap-3 text-gray-400 py-3 px-4 cursor-pointer hover:text-white hover:bg-primary ${
              activeNoteId === noteId ? "text-white bg-primary" : ""
            }`}
            key={noteId}
            onClick={() => viewNote(noteId)}
          >
            <DocumentIcon />
            <span className="text-white text-sm text-gray">
              {getNoteTitle(noteId)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentNotes;
