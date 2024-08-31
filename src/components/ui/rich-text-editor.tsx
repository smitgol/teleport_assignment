"use client";
import React, { useState, useRef, useEffect } from "react";

interface RichTextEditorProps {
  content: string;
  onContentChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onContentChange,
}) => {
  const [text, setText] = useState("<p></p>");
  const [fontSize, setFontSize] = useState(16);
  const [activeStyles, setActiveStyles] = useState<string[]>([]);
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedTag, setSelectedTag] = useState("p");

  const handleTextChange = (e: React.ChangeEvent<HTMLDivElement>) => {
    let newText = e.target.innerHTML;
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    if (
      (e.target.childNodes.length === 2 &&
        e.target.childNodes[0].nodeName === "#text") ||
      e.target.childNodes.length === 1
    ) {
      let textElement = e.target.childNodes[0] as HTMLElement;
      let textContent = textElement.textContent;
      newText = `<p>${textContent}</p>`;
      e.target.innerHTML = newText;
      // Move the cursor to the end of the new element
      const newRange = document.createRange();
      newRange.selectNodeContents(e.target);
      newRange.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(newRange);
    }
    setText(newText);
    onContentChange(newText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);

      if (range && editorRef.current) {
        // Create a new element with the selected tag
        const newElement = document.createElement(selectedTag);
        newElement.innerHTML = "<br>";
        newElement.style.fontSize = `${fontSize}px`;

        // Add the new element to the children
        editorRef.current.appendChild(newElement);

        // Move the cursor to the end of the new element
        const newRange = document.createRange();
        newRange.setStartAfter(newElement);
        newRange.collapse(true);

        selection?.removeAllRanges();
        selection?.addRange(newRange);

        // Update the text state
        setText(editorRef.current.innerHTML);
      }
    }
  };

  const applyStyle = (style: string) => {
    document.execCommand(style);
    updateActiveStyles();
  };

  const applyHeading = (level: string) => {
    setSelectedTag(level);
    document.execCommand("formatBlock", false, level);
    setText(editorRef.current?.innerHTML || "");
    updateActiveStyles();
  };

  const applyList = (type: string) => {
    const listTag = type === "insertOrderedList" ? "ol" : "ul";
    const listClass =
      type === "insertOrderedList" ? "list-decimal" : "list-disc";

    // Apply the list command
    document.execCommand(type);

    const selection = window.getSelection();
    if (selection && editorRef.current) {
      // Get all child elements of the editor
      const childElements = Array.from(editorRef.current.children);

      // Find existing list or create a new one
      let list = childElements.find(
        (el) => el.tagName.toLowerCase() === listTag
      ) as HTMLElement;
      if (!list) {
        list = document.createElement(listTag);
        list.classList.add(listClass);
        editorRef.current.appendChild(list);
      }

      childElements.forEach((element) => {
        // Only convert paragraphs and headings into li elements
        if (element.tagName === "P" || element.tagName.match(/^H[1-6]$/)) {
          const li = document.createElement("li");
          li.innerHTML = element.innerHTML;
          // Append to the existing list instead of replacing
          list.appendChild(li);
          element.remove();
        }
      });

      setText(editorRef.current.innerHTML);
      updateActiveStyles();
    }
  };

  const updateActiveStyles = () => {
    const selection = window.getSelection();
    if (selection) {
      const range = selection?.getRangeAt(0);
      const container =
        range.commonAncestorContainer.nodeType === 1
          ? (range.commonAncestorContainer as HTMLElement)
          : (range.commonAncestorContainer.parentNode as HTMLElement);

      const styles: string[] = [];
      const computedStyle = window.getComputedStyle(container);

      if (
        computedStyle.fontWeight === "bold" ||
        parseInt(computedStyle.fontWeight, 10) >= 700
      ) {
        styles.push("bold");
      }
      if (computedStyle.fontStyle === "italic") {
        styles.push("italic");
      }
      if (computedStyle.textDecorationLine.includes("underline")) {
        styles.push("underline");
      }

      const fontSizeInPixels = parseInt(computedStyle.fontSize, 10);
      setFontSize(fontSizeInPixels);

      const tagName = container.tagName.toLowerCase();
      if (tagName.startsWith("h")) {
        styles.push(tagName);
      } else {
        styles.push("p");
      }
      setActiveStyles(styles);
    }
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
    setFontSize(newSize);

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement("span");
      span.style.fontSize = `${newSize}px`;
      range.surroundContents(span);
    }
    setText(editorRef.current?.innerHTML || "");
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.innerHTML = content || "<p></p>";
      setText(editor.innerHTML);
      editor.addEventListener("mouseup", updateActiveStyles);
      editor.addEventListener("keyup", updateActiveStyles);
    }
    return () => {
      if (editor) {
        editor.removeEventListener("mouseup", updateActiveStyles);
        editor.removeEventListener("keyup", updateActiveStyles);
      }
    };
  }, []);

  return (
    <div className="w-full mx-auto p-4 pl-0 rounded shadow">
      <div className="pb-4 flex flex-row gap-4 border-b-2 border-light-gray">
        <select
          className="py-1 rounded-sm bg-transparent text-white"
          value={selectedTag}
          onChange={(e) => applyHeading(e.target.value)}
        >
          <option value="p" className="bg-secondary text-white">
            Paragraph
          </option>
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <option
              key={level}
              value={`h${level}`}
              className="text-white bg-secondary"
            >
              Heading {level}
            </option>
          ))}
        </select>
        <select
          className="px-2 py-1 rounded-sm bg-transparent text-white"
          value={fontSize}
          onChange={handleFontSizeChange}
        >
          {[8, 10, 12, 14, 16, 18, 24, 36].map((size) => (
            <option key={size} value={size} className="bg-secondary text-white">
              {size}px
            </option>
          ))}
        </select>
        <button
          className={`px-2 py-1 rounded ${
            activeStyles.includes("bold") ? "border-2 border-white" : ""
          }`}
          onClick={() => applyStyle("bold")}
        >
          B
        </button>
        <button
          className={`px-2 py-1 rounded italic ${
            activeStyles.includes("italic") ? "border-2 border-white" : ""
          }`}
          onClick={() => applyStyle("italic")}
        >
          I
        </button>
        <button
          className={`px-2 py-1 rounded underline ${
            activeStyles.includes("underline") ? "border-2 border-white" : ""
          }`}
          onClick={() => applyStyle("underline")}
        >
          U
        </button>
        <button
          className="px-2 py-1 rounded"
          onClick={() => applyList("insertOrderedList")}
        >
          1._
        </button>
        <button
          className="px-2 py-1 rounded"
          onClick={() => applyList("insertUnorderedList")}
        >
          &#x2022;_
        </button>
      </div>
      <div
        ref={editorRef}
        className="w-full min-h-[200px] p-2 mt-4 rounded focus:outline-none "
        contentEditable
        onInput={handleTextChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default RichTextEditor;
