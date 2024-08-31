import React from "react";
import { useDragDrop } from "@/context/drag-drop-context";
interface DroppableProps {
  id: string;
  children: React.ReactNode;
  onDrop: (id: string | null) => void;
}

const Droppable: React.FC<DroppableProps> = ({ id, children, onDrop }) => {
  const { draggedElement, setDraggedElement } = useDragDrop();

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    onDrop(draggedElement);
    setDraggedElement(null);
  };

  return (
    <div id={id} onDragOver={handleDragOver} onDrop={handleDrop}>
      {children}
    </div>
  );
};

export default Droppable;
