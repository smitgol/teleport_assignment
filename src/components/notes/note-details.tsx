"use client";
import React, { useState } from "react";
import DropdownButton from "../svgs/dropdown-button";
import CalendarIcon from "../svgs/calander-icon";
import { FolderIcon } from "../svgs/folder-icon";
import RichTextEditor from "../ui/rich-text-editor";
import { useNotesFolder } from "@/context/notes-folder-context";
import EmptyNote from "./empty-note";
import { Popover } from "react-tiny-popover";
import { FavoritesFolder } from "../svgs/favorites-folder";
import { ArchivedFolder } from "../svgs/archived-folder";
import { TrashFolder } from "../svgs/trash-folder";
import { formatDate } from "@/utils";

const NoteDetails: React.FC = () => {
  const { activeNoteId, notes, folders, updateNote } = useNotesFolder();
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleContentChange = (content: string) => {
    setContent(content);
    updateNote(activeNoteId, { content });
  };

  const getTitle = () => {
    const note = notes.find((note) => note.id === activeNoteId);
    return note?.title || "";
  };
  const getDate = () => {
    const note = notes.find((note) => note.id === activeNoteId);
    return note?.date || "";
  };
  const getFolderName = () => {
    const note = notes.find((note) => note.id === activeNoteId);
    const folder = folders.find((folder) => folder.id === note?.folderId);
    return folder?.name || "";
  };
  const getNoteContent = (noteId: number) => {
    const note = notes.find((note) => note.id === noteId);
    return note?.content || "";
  };

  const addTo = (folderName: string) => {
    let folderId = folders.find((folder) => folder.name === folderName)?.id;
    if (folderId) {
      updateNote(activeNoteId, { folderId });
    }
  };

  const updateTitle = (title: string) => {
    updateNote(activeNoteId, { title });
  };

  const dropdownContent = () => {
    return (
      <div className="bg-light-gray p-4 rounded-md flex flex-col gap-4 w-full">
        <p
          className="text-sm text-gray-100 w-full flex items-center gap-2 cursor-pointer"
          onClick={() => addTo("Favorites")}
        >
          <FavoritesFolder /> Add to favorites
        </p>
        <p
          className="text-sm text-gray-100 w-full flex items-center gap-2 cursor-pointer"
          onClick={() => addTo("Archived Notes")}
        >
          <ArchivedFolder /> Archived
        </p>
        <hr />
        <p
          className="text-sm text-gray-100 w-full flex items-center gap-2 cursor-pointer"
          onClick={() => addTo("Trash")}
        >
          <TrashFolder /> Delete note
        </p>
      </div>
    );
  };

  return (
    <>
      {activeNoteId ? (
        <div className="text-white p-12 max-sm:px-4 max-sm:py-8">
          <div className="flex justify-between items-center">
            {isEditing ? (
              <input
                type="text"
                className=" bg-transparent border border-white rounded-md p-2 font-bold"
                value={getTitle()}
                onChange={(e) => updateTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsEditing(false);
                  }
                }}
              />
            ) : (
              <h1
                className="text-2xl font-bold"
                onClick={() => setIsEditing(true)}
              >
                {getTitle()}
              </h1>
            )}
            <Popover
              isOpen={isOpen}
              positions={["bottom", "left"]}
              padding={10}
              containerStyle={{ left: "-4%" }}
              content={dropdownContent()}
            >
              <button onClick={() => setIsOpen(!isOpen)}>
                <DropdownButton />
              </button>
            </Popover>
          </div>
          <div className="mt-7">
            <div className="grid grid-cols-8 items-center text-sm text-gray-400 py-3 border-b border-light-gray">
              <div className="flex items-center gap-8 col-start-1 col-end-3 ">
                <CalendarIcon />
                <span className="text-gray">Date</span>
              </div>
              <span className="text-white underline">
                {formatDate(getDate())}
              </span>
            </div>
            <div className="grid grid-cols-8 items-center text-sm text-gray-400 py-3 border-b border-light-gray">
              <div className="flex items-center gap-8 col-start-1 col-end-3">
                <FolderIcon />
                <span className="text-gray">Folder</span>
              </div>
              <span className="text-white underline">{getFolderName()}</span>
            </div>
          </div>
          <RichTextEditor
            content={getNoteContent(activeNoteId)}
            onContentChange={handleContentChange}
          />
        </div>
      ) : (
        <EmptyNote />
      )}
    </>
  );
};

export default NoteDetails;
