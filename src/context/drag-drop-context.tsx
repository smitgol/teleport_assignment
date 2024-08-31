"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface DragDropContextProps {
  draggedElement: string | null;
  setDraggedElement: (id: string | null) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
}

const DragDropContext = createContext<DragDropContextProps | null>(null);

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error("useDragDrop must be used within a DragDropProvider");
  }
  return context;
};

interface DragDropProviderProps {
  children: ReactNode;
}

export const DragDropProvider: React.FC<DragDropProviderProps> = ({
  children,
}) => {
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  return (
    <DragDropContext.Provider
      value={{ draggedElement, setDraggedElement, isDragging, setIsDragging }}
    >
      {children}
    </DragDropContext.Provider>
  );
};
