import React, { useState } from "react";
import { DocumentIcon } from "../svgs/document-icon";

const EmptyNote: React.FC = () => {
  return (
    <div className="h-screen w-full flex flex-col gap-4 justify-center items-center">
      <div className="text-2xl">
        <DocumentIcon />
      </div>
      <h1 className="text-2xl font-bold">Select note to view</h1>
      <p className="text-gray-400 text-sm w-80 text-center text-gray">
        Choose a note from the list on the left to view its contents, or create
        a new note to add to your collection.
      </p>
    </div>
  );
};

export default EmptyNote;
