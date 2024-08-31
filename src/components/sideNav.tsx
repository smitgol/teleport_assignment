import React from "react";
import Button from "./ui/button";
import { useNotesFolder } from "@/context/notes-folder-context";
import { toast } from "react-toastify";
import { SearchIcon } from "./svgs/search-icon";

const SideNav: React.FC = () => {
  const { addNote, activeFolderId } = useNotesFolder();
  const AddNotesFunc = () => {
    if (activeFolderId === 0) {
      toast.error("Please select a folder");
      return;
    }
    addNote({
      title: "Untitled notes",
      content: "",
      date: new Date().toISOString(),
      folderId: activeFolderId,
    });
  };
  return (
    <div className="text-white w-64 max-sm:w-full p-4">
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-2xl font-bold italic"
          style={{ fontFamily: "Kaushan Script" }}
        >
          Nowted
        </h1>
        <button className="text-gray-400 hover:text-white">
          <SearchIcon />
        </button>
      </div>
      <Button
        className="bg-dark-gray hover:bg-light-gray text-sm rounded-sm"
        onClick={() => AddNotesFunc()}
      >
        + New Note
      </Button>
    </div>
  );
};

export default SideNav;
