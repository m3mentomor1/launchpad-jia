"use client";

import React, { useRef, useEffect, useState } from "react";

export default function RichTextEditor({ setText, text, hasError = false }) {
  const descriptionEditorRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    insertOrderedList: false,
    insertUnorderedList: false,
  });

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    descriptionEditorRef.current?.focus();
    // Delay to ensure DOM updates before checking state
    setTimeout(() => {
      updateActiveFormats();
    }, 10);
  };

  const updateActiveFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strikeThrough: document.queryCommandState("strikeThrough"),
      insertOrderedList: document.queryCommandState("insertOrderedList"),
      insertUnorderedList: document.queryCommandState("insertUnorderedList"),
    });
  };

  const handleDescriptionChange = () => {
    if (descriptionEditorRef.current) {
      setText(descriptionEditorRef.current.innerHTML);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    // Get plain text from clipboard
    const text = e.clipboardData.getData("text/plain");

    // Insert the plain text at cursor position
    document.execCommand("insertText", false, text);

    // Update the state
    handleDescriptionChange();
  };

  // Handle placeholder for contenteditable div
  useEffect(() => {
    const editor = descriptionEditorRef.current;
    if (editor) {
      const handleFocus = () => {
        if (editor.innerHTML === "" || editor.innerHTML === "<br>") {
          editor.innerHTML = "";
        }
      };

      const handleBlur = () => {
        if (editor.innerHTML === "" || editor.innerHTML === "<br>") {
          editor.innerHTML = "";
        }
      };

      const handleSelectionChange = () => {
        updateActiveFormats();
      };

      editor.addEventListener("focus", handleFocus);
      editor.addEventListener("blur", handleBlur);
      editor.addEventListener("keyup", handleSelectionChange);
      editor.addEventListener("mouseup", handleSelectionChange);
      document.addEventListener("selectionchange", handleSelectionChange);

      return () => {
        editor.removeEventListener("focus", handleFocus);
        editor.removeEventListener("blur", handleBlur);
        editor.removeEventListener("keyup", handleSelectionChange);
        editor.removeEventListener("mouseup", handleSelectionChange);
        document.removeEventListener("selectionchange", handleSelectionChange);
      };
    }
  }, []);

  useEffect(() => {
    if (
      descriptionEditorRef.current &&
      !descriptionEditorRef.current.innerHTML &&
      text
    ) {
      descriptionEditorRef.current.innerHTML = text;
    }
  }, []);

  return (
    <div
      style={{
        border: hasError ? "1px solid #DC2626" : "1px solid #E9EAEB",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <div
        ref={descriptionEditorRef}
        contentEditable={true}
        style={{
          height: "300px",
          overflowY: "auto",
          padding: "12px",
          lineHeight: "1.5",
          position: "relative",
          border: "none",
          outline: "none",
        }}
        onInput={handleDescriptionChange}
        onBlur={handleDescriptionChange}
        onPaste={handlePaste}
        data-placeholder="Enter job description..."
      ></div>
      {/* Rich Text Editor Toolbar */}
      <div
        style={{
          borderTop: "1px solid #E9EAEB",
          backgroundColor: "#FFFFFF",
          display: "flex",
          gap: "8px",
          padding: "8px 12px",
          alignItems: "center",
        }}
      >
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => formatText("bold")}
          title="Bold"
          style={{
            padding: "4px 8px",
            fontSize: 18,
            color: activeFormats.bold ? "#181D27" : "#6B7280",
            border: "none",
            background: activeFormats.bold ? "#F3F4F6" : "transparent",
            borderRadius: "4px",
          }}
        >
          <i className="la la-bold"></i>
        </button>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => formatText("italic")}
          title="Italic"
          style={{
            padding: "4px 8px",
            fontSize: 18,
            color: activeFormats.italic ? "#181D27" : "#6B7280",
            border: "none",
            background: activeFormats.italic ? "#F3F4F6" : "transparent",
            borderRadius: "4px",
          }}
        >
          <i className="la la-italic"></i>
        </button>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => formatText("underline")}
          title="Underline"
          style={{
            padding: "4px 8px",
            fontSize: 18,
            color: activeFormats.underline ? "#181D27" : "#6B7280",
            border: "none",
            background: activeFormats.underline ? "#F3F4F6" : "transparent",
            borderRadius: "4px",
          }}
        >
          <i className="la la-underline"></i>
        </button>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => formatText("strikeThrough")}
          title="Strikethrough"
          style={{
            padding: "4px 8px",
            fontSize: 18,
            color: activeFormats.strikeThrough ? "#181D27" : "#6B7280",
            border: "none",
            background: activeFormats.strikeThrough ? "#F3F4F6" : "transparent",
            borderRadius: "4px",
          }}
        >
          <i className="la la-strikethrough"></i>
        </button>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => formatText("insertOrderedList")}
          title="Numbered List"
          style={{
            padding: "4px 8px",
            fontSize: 18,
            color: activeFormats.insertOrderedList ? "#181D27" : "#6B7280",
            border: "none",
            background: activeFormats.insertOrderedList
              ? "#F3F4F6"
              : "transparent",
            borderRadius: "4px",
          }}
        >
          <i className="la la-list-ol"></i>
        </button>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => formatText("insertUnorderedList")}
          title="Bullet List"
          style={{
            padding: "4px 8px",
            fontSize: 18,
            color: activeFormats.insertUnorderedList ? "#181D27" : "#6B7280",
            border: "none",
            background: activeFormats.insertUnorderedList
              ? "#F3F4F6"
              : "transparent",
            borderRadius: "4px",
          }}
        >
          <i className="la la-list-ul"></i>
        </button>
      </div>
      <style jsx>{`
        [data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #6c757d;
          pointer-events: none;
          position: absolute;
          top: 12px;
          left: 12px;
        }
      `}</style>
    </div>
  );
}
