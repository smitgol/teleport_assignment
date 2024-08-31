import React from "react";
import { useDragDrop } from "@/context/drag-drop-context";

interface DraggableProps {
  id: string;
  children: React.ReactNode;
}

const Draggable: React.FC<DraggableProps> = ({ id, children }) => {
  const { setDraggedElement, setIsDragging, isDragging } = useDragDrop();

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    setDraggedElement(id);
    event.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
  };

  const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(false);
  };

  return (
    <div
      id={id}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={"opacity-100"}
    >
      {children}
    </div>
  );
};

export default Draggable;
