"use client";

import { useState } from "react";

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (question: string) => void;
  categoryName: string;
}

export default function AddQuestionModal({
  isOpen,
  onClose,
  onAdd,
  categoryName,
}: AddQuestionModalProps) {
  const [questionText, setQuestionText] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (questionText.trim()) {
      onAdd(questionText.trim());
      setQuestionText("");
      onClose();
    }
  };

  const handleCancel = () => {
    setQuestionText("");
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleCancel}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9998,
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          zIndex: 9999,
          width: "90%",
          maxWidth: "500px",
          padding: "24px",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#181D27",
              marginBottom: 4,
            }}
          >
            Add Interview Question
          </h3>
          <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
            Add a new question to{" "}
            <span style={{ fontWeight: 600 }}>{categoryName}</span>
          </p>
        </div>

        {/* Input */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "#181D27",
              display: "block",
              marginBottom: 8,
            }}
          >
            Question
          </label>
          <textarea
            className="form-control"
            placeholder="Enter your interview question..."
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            rows={4}
            style={{
              resize: "vertical",
              fontSize: 14,
            }}
          />
          <span
            style={{
              fontSize: 12,
              color: "#6B7280",
              marginTop: 4,
              display: "block",
            }}
          >
            Press Enter to add, Escape to cancel
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button
            onClick={handleCancel}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid #D5D7DA",
              backgroundColor: "#FFFFFF",
              color: "#414651",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!questionText.trim()}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: questionText.trim() ? "#181D27" : "#D5D7DA",
              color: "#FFFFFF",
              fontSize: 14,
              fontWeight: 500,
              cursor: questionText.trim() ? "pointer" : "not-allowed",
            }}
          >
            Add Question
          </button>
        </div>
      </div>
    </>
  );
}
