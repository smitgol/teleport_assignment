"use client";
import React, { useState } from "react";
import { FavoritesFolder } from "./svgs/favorites-folder";
import { TrashFolder } from "./svgs/trash-folder";
import { ArchivedFolder } from "./svgs/archived-folder";
import { FolderIcon } from "./svgs/folder-icon";
import { FolderOpened } from "./svgs/folder-opened";
import { useNotesFolder } from "@/context/notes-folder-context";
import { CreateFolder } from "./svgs/create-folder";

const Folder: React.FC = () => {
  const [showMore, setShowMore] = useState(false);
  const {
    folders,
    activeFolderId,
    addFolder,
    updateFolder,
    setActiveFolderId,
  } = useNotesFolder();
  const [editingFolderId, setEditingFolderId] = useState<number | null>(null);

  const defaultFolders = [
    {
      name: "Favorites",
      icon: <FavoritesFolder />,
    },
    {
      name: "Trash",
      icon: <TrashFolder />,
    },
    {
      name: "Archived Notes",
      icon: <ArchivedFolder />,
    },
  ];

  const addFolderFunc = () => {
    addFolder({ name: "New Folder", default: false });
    setEditingFolderId(folders.length + 1);
  };

  return (
    <div className="overflow-y-auto h-[62vh]">
      <div className="flex flex-row justify-between items-end py-4 px-4">
        <h2 className="text-gray-400 text-sm font-semibold">Folders</h2>
        <div onClick={() => addFolderFunc()} className="cursor-pointer">
          <CreateFolder />
        </div>
      </div>
      <div>
        <ul>
          {showMore
            ? folders
                .filter((folder) => !folder.default)
                .map((folder, index) => (
                  <li
                    key={index}
                    className={`flex flex-row py-2 px-4 items-center gap-3 cursor-pointer ${
                      folder.id === activeFolderId
                        ? "bg-dark-gray"
                        : "hover:text-white hover:bg-dark-gray"
                    }`}
                  >
                    {folder.id === activeFolderId ? (
                      <FolderOpened />
                    ) : (
                      <FolderIcon />
                    )}
                    <p className="text-gray">{folder.name}</p>
                  </li>
                ))
            : folders
                .filter((folder) => !folder.default)
                .slice(0, 5)
                .map((folder, index) => (
                  <li
                    key={index}
                    className={`flex flex-row py-2 px-4 items-center gap-3 cursor-pointer ${
                      folder.id === activeFolderId
                        ? "bg-dark-gray"
                        : "hover:text-white hover:bg-dark-gray"
                    }`}
                    onDoubleClick={() => setEditingFolderId(folder.id)}
                    onClick={() => setActiveFolderId(folder.id)}
                  >
                    {folder.id === activeFolderId ? (
                      <FolderOpened />
                    ) : (
                      <FolderIcon />
                    )}
                    {folder.id === editingFolderId ? (
                      <input
                        type="text"
                        className=" w-full bg-transparent border border-white text-white"
                        value={folder.name}
                        onChange={(e) =>
                          updateFolder(folder.id, {
                            name: e.target.value,
                            id: folder.id,
                            default: folder.default,
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setEditingFolderId(null);
                          }
                        }}
                      />
                    ) : (
                      <p className="text-gray">{folder.name}</p>
                    )}
                  </li>
                ))}
        </ul>
      </div>
      <p
        className="text-gray text-sm px-4 pt-5 cursor-pointer"
        onClick={() => setShowMore(!showMore)}
      >
        {showMore ? "less" : "more"}
      </p>
      <div className="pt-3">
        <ul>
          {folders
            .filter((folder) => folder.default)
            .map((folder, index) => (
              <li
                key={index}
                className={`flex flex-row py-2 px-4 items-center gap-3 cursor-pointer ${
                  folder.id === activeFolderId
                    ? "bg-dark-gray"
                    : "hover:text-white hover:bg-dark-gray"
                }`}
              >
                {
                  defaultFolders.find(
                    (defaultFolder) => defaultFolder.name === folder.name
                  )?.icon
                }
                <p className="text-gray">{folder.name}</p>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Folder;
