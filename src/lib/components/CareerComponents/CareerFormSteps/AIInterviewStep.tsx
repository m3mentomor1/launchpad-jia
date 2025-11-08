"use client";

import { useState } from "react";
import CustomDropdown from "../CustomDropdown";
import { CareerFormData } from "../SegmentedCareerForm";
import AddQuestionModal from "./AddQuestionModal";

const screeningSettingList = [
  { name: "Good Fit and above", icon: "la la-check" },
  { name: "Only Strong Fit", icon: "la la-check-double" },
  { name: "No Automatic Promotion", icon: "la la-times" },
];

interface AIInterviewStepProps {
  formData: CareerFormData;
  updateFormData: (updates: Partial<CareerFormData>) => void;
}

export default function AIInterviewStep({
  formData,
  updateFormData,
}: AIInterviewStepProps) {
  const [aiSecretPrompt, setAiSecretPrompt] = useState(
    formData.aiSecretPrompt || ""
  );
  const [editingQuestion, setEditingQuestion] = useState<{
    categoryId: number;
    questionId: string;
    text: string;
  } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalCategory, setAddModalCategory] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [draggedItem, setDraggedItem] = useState<{
    categoryId: number;
    questionIndex: number;
  } | null>(null);

  const handleSecretPromptChange = (value: string) => {
    setAiSecretPrompt(value);
    updateFormData({ aiSecretPrompt: value });
  };

  const totalQuestions = formData.questions.reduce(
    (sum, category) => sum + category.questions.length,
    0
  );
  const hasMinimumQuestions = totalQuestions >= 5;

  const handleGenerateAllQuestions = () => {
    // TODO: Implement generate all questions functionality
    console.log("Generate all questions");
  };

  const handleGenerateQuestions = (categoryId: number) => {
    // TODO: Implement generate questions for specific category
    console.log("Generate questions for category:", categoryId);
  };

  const handleManuallyAdd = (categoryId: number, categoryName: string) => {
    setAddModalCategory({ id: categoryId, name: categoryName });
    setShowAddModal(true);
  };

  const handleAddQuestion = (questionText: string) => {
    if (addModalCategory) {
      const updatedQuestions = formData.questions.map((cat) =>
        cat.id === addModalCategory.id
          ? {
              ...cat,
              questions: [
                ...cat.questions,
                {
                  id: Date.now().toString(),
                  question: questionText,
                },
              ],
            }
          : cat
      );
      updateFormData({ questions: updatedQuestions });
    }
  };

  const handleEditQuestion = (
    categoryId: number,
    questionId: string,
    currentText: string
  ) => {
    setEditingQuestion({ categoryId, questionId, text: currentText });
  };

  const handleSaveEdit = () => {
    if (editingQuestion) {
      const updatedQuestions = formData.questions.map((cat) =>
        cat.id === editingQuestion.categoryId
          ? {
              ...cat,
              questions: cat.questions.map((q: any) =>
                q.id === editingQuestion.questionId
                  ? { ...q, question: editingQuestion.text }
                  : q
              ),
            }
          : cat
      );
      updateFormData({ questions: updatedQuestions });
      setEditingQuestion(null);
    }
  };

  const handleDeleteQuestion = (categoryId: number, questionId: string) => {
    const updatedQuestions = formData.questions.map((cat) =>
      cat.id === categoryId
        ? {
            ...cat,
            questions: cat.questions.filter((q: any) => q.id !== questionId),
          }
        : cat
    );
    updateFormData({ questions: updatedQuestions });
  };

  const handleDragStart = (categoryId: number, questionIndex: number) => {
    setDraggedItem({ categoryId, questionIndex });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (
    categoryId: number,
    dropIndex: number,
    e: React.DragEvent
  ) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.categoryId !== categoryId) return;

    const category = formData.questions.find((cat) => cat.id === categoryId);
    if (!category) return;

    const questions = [...category.questions];
    const [draggedQuestion] = questions.splice(draggedItem.questionIndex, 1);
    questions.splice(dropIndex, 0, draggedQuestion);

    const updatedQuestions = formData.questions.map((cat) =>
      cat.id === categoryId ? { ...cat, questions } : cat
    );

    updateFormData({ questions: updatedQuestions });
    setDraggedItem(null);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        gap: 16,
        alignItems: "flex-start",
      }}
    >
      {/* Left Column - Main Content */}
      <div
        style={{
          width: "60%",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* AI Interview Settings */}
        <div className="layered-card-outer">
          <div className="layered-card-middle">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <span style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}>
                1. AI Interview Settings
              </span>
            </div>
            <div className="layered-card-content">
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#181D27",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                AI Interview Screening
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: "#6B7280",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Jia automatically endorses candidates who meet the chosen
                criteria.
              </span>
              <CustomDropdown
                onSelectSetting={(setting: string) =>
                  updateFormData({ screeningSetting: setting })
                }
                screeningSetting={formData.screeningSetting}
                settingList={screeningSettingList}
              />

              <div style={{ marginTop: 24 }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#181D27",
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  Require Video on Interview
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "#6B7280",
                    display: "block",
                    marginBottom: 12,
                  }}
                >
                  Require candidates to keep their camera on. Recordings will
                  appear on their analysis page.
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <i
                    className="la la-video"
                    style={{ color: "#414651", fontSize: 20 }}
                  ></i>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>
                    Require Video Interview
                  </span>
                  <label className="switch" style={{ marginLeft: "auto" }}>
                    <input
                      type="checkbox"
                      checked={formData.requireVideo}
                      onChange={() =>
                        updateFormData({ requireVideo: !formData.requireVideo })
                      }
                    />
                    <span className="slider round"></span>
                  </label>
                  <span style={{ fontSize: 14, color: "#414651" }}>
                    {formData.requireVideo ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: 24 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <i
                    className="la la-magic"
                    style={{ color: "#414651", fontSize: 18 }}
                  ></i>
                  <span
                    style={{ fontSize: 14, fontWeight: 600, color: "#181D27" }}
                  >
                    AI Interview Secret Prompt
                  </span>
                  <span style={{ fontSize: 12, color: "#6B7280" }}>
                    (optional)
                  </span>
                  <i
                    className="la la-info-circle"
                    style={{ color: "#9CA3AF", fontSize: 16, cursor: "help" }}
                    title="Secret Prompts give you extra control over Jia's evaluation style, complementing her accurate assessment of requirements from the job description."
                  ></i>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    color: "#6B7280",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Secret Prompts give you extra control over Jia's evaluation
                  style, complementing her accurate assessment of requirements
                  from the job description.
                </span>
                <textarea
                  className="form-control"
                  placeholder="Enter a secret prompt (e.g., Treat candidates who speak in Taglish, English, or Tagalog equally. Focus on clarity, coherence, and confidence rather than language preference or accent.)"
                  rows={4}
                  value={aiSecretPrompt}
                  onChange={(e) => handleSecretPromptChange(e.target.value)}
                  style={{ resize: "vertical" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI Interview Questions */}
        <div className="layered-card-outer">
          <div className="layered-card-middle">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}
                >
                  2. AI Interview Questions
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#181D27",
                    backgroundColor: "#F3F4F6",
                    padding: "2px 8px",
                    borderRadius: "12px",
                  }}
                >
                  {totalQuestions}
                </span>
              </div>
              <button
                onClick={handleGenerateAllQuestions}
                style={{
                  background: "#181D27",
                  color: "#fff",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                }}
              >
                <i className="la la-magic" style={{ fontSize: 16 }}></i>
                Generate all questions
              </button>
            </div>

            <div className="layered-card-content">
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {formData.questions.map((category) => (
                  <div key={category.id}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 12,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#181D27",
                        }}
                      >
                        {category.category}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 12,
                      }}
                    >
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => handleGenerateQuestions(category.id)}
                          style={{
                            background: "#181D27",
                            color: "#fff",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 13,
                          }}
                        >
                          <i
                            className="la la-magic"
                            style={{ fontSize: 16 }}
                          ></i>
                          Generate questions
                        </button>
                        <button
                          onClick={() =>
                            handleManuallyAdd(category.id, category.category)
                          }
                          style={{
                            background: "transparent",
                            color: "#414651",
                            border: "1px solid #D5D7DA",
                            padding: "6px 12px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 13,
                          }}
                        >
                          <i
                            className="la la-plus-circle"
                            style={{ fontSize: 16 }}
                          ></i>
                          Manually add
                        </button>
                      </div>
                      {category.questions.length > 0 && (
                        <span style={{ fontSize: 12, color: "#6B7280" }}>
                          # of questions to ask{" "}
                          <span style={{ fontWeight: 600, color: "#181D27" }}>
                            {category.questions.length}
                          </span>
                        </span>
                      )}
                    </div>

                    {/* Display questions for this category */}
                    {category.questions.length > 0 && (
                      <div style={{ marginTop: 12 }}>
                        {category.questions.map(
                          (question: any, idx: number) => (
                            <div
                              key={question.id || idx}
                              draggable
                              onDragStart={() =>
                                handleDragStart(category.id, idx)
                              }
                              onDragOver={handleDragOver}
                              onDrop={(e) => handleDrop(category.id, idx, e)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                marginBottom: 8,
                                padding: "12px",
                                backgroundColor: "#FFFFFF",
                                border: "1px solid #E9EAEB",
                                borderRadius: "8px",
                                cursor: "move",
                              }}
                            >
                              <i
                                className="la la-grip-vertical"
                                style={{
                                  color: "#9CA3AF",
                                  cursor: "grab",
                                  fontSize: 16,
                                }}
                              ></i>
                              {editingQuestion?.questionId === question.id ? (
                                <input
                                  type="text"
                                  className="form-control"
                                  value={editingQuestion.text}
                                  onChange={(e) =>
                                    setEditingQuestion({
                                      ...editingQuestion,
                                      text: e.target.value,
                                    })
                                  }
                                  onBlur={handleSaveEdit}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSaveEdit();
                                    if (e.key === "Escape")
                                      setEditingQuestion(null);
                                  }}
                                  autoFocus
                                  style={{ flex: 1 }}
                                />
                              ) : (
                                <span
                                  style={{
                                    fontSize: 14,
                                    color: "#414651",
                                    flex: 1,
                                  }}
                                >
                                  {question.question}
                                </span>
                              )}
                              <button
                                onClick={() =>
                                  handleEditQuestion(
                                    category.id,
                                    question.id,
                                    question.question
                                  )
                                }
                                style={{
                                  background: "transparent",
                                  border: "1px solid #D5D7DA",
                                  padding: "4px 8px",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                  fontSize: 13,
                                  color: "#414651",
                                }}
                              >
                                <i
                                  className="la la-pen"
                                  style={{ fontSize: 14 }}
                                ></i>
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteQuestion(category.id, question.id)
                                }
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  cursor: "pointer",
                                  padding: "4px",
                                }}
                              >
                                <i
                                  className="la la-trash"
                                  style={{ color: "#EF4444", fontSize: 18 }}
                                ></i>
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Tips */}
      <div style={{ width: "40%", position: "sticky", top: 100 }}>
        <div className="layered-card-outer">
          <div className="layered-card-middle">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <i
                className="la la-lightbulb"
                style={{ color: "#F59E0B", fontSize: 24 }}
              ></i>
              <span style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}>
                Tips
              </span>
            </div>
            <div className="layered-card-content">
              <div style={{ marginBottom: 16 }}>
                <span
                  style={{ fontSize: 14, fontWeight: 600, color: "#181D27" }}
                >
                  Add a Secret Prompt
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "#6B7280",
                    display: "block",
                    marginTop: 4,
                  }}
                >
                  to fine-tune how Jia scores and evaluates the interview
                  responses.
                </span>
              </div>
              <div>
                <span
                  style={{ fontSize: 14, fontWeight: 600, color: "#181D27" }}
                >
                  Use "Generate Questions"
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "#6B7280",
                    display: "block",
                    marginTop: 4,
                  }}
                >
                  to quickly create tailored interview questions, then refine or
                  mix them with your own for balanced results.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Question Modal */}
      <AddQuestionModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setAddModalCategory(null);
        }}
        onAdd={handleAddQuestion}
        categoryName={addModalCategory?.name || ""}
      />
    </div>
  );
}
