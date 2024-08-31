"use client";
import React, { useState } from "react";
import SideNav from "./sideNav";
import RecentNotes from "./notes/recent-notes";
import Folder from "./folder";
import NoteList from "./notes/note-list";
import NoteDetails from "./notes/note-details";
import { useNotesFolder } from "../context/notes-folder-context";

const Dashboard: React.FC = () => {
  const {
    notes,
    setNotes,
    activeNoteId,
    setActiveNoteId,
    activeFolderId,
    folders,
  } = useNotesFolder();
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="flex flex-col md:grid md:grid-cols-12 h-screen relative">
      {/* Mobile sidebar toggle */}
      <button
        className="md:hidden absolute top-8 left-6 p-2 bg-dark-gray border border-white text-white rounded-lg w-10 h-10 flex items-center justify-center z-10"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {showSidebar ? "×" : "☰"}
      </button>

      {/* Sidebar */}
      <div
        className={`${showSidebar ? "block" : "hidden"} md:block md:col-span-2`}
      >
        <SideNav />
        <RecentNotes />
        <Folder />
      </div>

      {/* Note list */}
      <div className="md:col-span-3 bg-secondary">
        <NoteList
          activeFolderId={activeFolderId}
          folders={folders}
          notes={notes}
          activeNoteId={activeNoteId}
          setNotes={setNotes}
          setActiveNoteId={setActiveNoteId}
        />
      </div>

      {/* Note details */}
      <div className="md:col-span-7">
        <NoteDetails />
      </div>
    </div>
  );
};

export default Dashboard;
