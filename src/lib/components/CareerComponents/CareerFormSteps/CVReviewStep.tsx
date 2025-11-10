"use client";

import { useState } from "react";
import CustomDropdown from "../CustomDropdown";
import { CareerFormData } from "../SegmentedCareerForm";

const screeningSettingList = [
  { name: "Good Fit and above", icon: "la la-check" },
  { name: "Only Strong Fit", icon: "la la-check-double" },
  { name: "No Automatic Promotion", icon: "la la-times" },
];

interface PreScreeningQuestion {
  id: string;
  question: string;
  type: "dropdown" | "text" | "range";
  options: string[];
  rangeMin?: string;
  rangeMax?: string;
}

interface CVReviewStepProps {
  formData: CareerFormData;
  updateFormData: (updates: Partial<CareerFormData>) => void;
  showValidationErrors?: boolean;
  validationErrors?: { [key: string]: string };
}

const SUGGESTED_QUESTIONS = [
  {
    title: "Notice Period",
    question: "How long is your notice period?",
    options: ["Immediately", "< 30 days", "> 30 days"],
  },
  {
    title: "Work Setup",
    question: "How often are you willing to report to the office?",
    options: [
      "At most 1-2x a week",
      "At most 3-4x a week",
      "Open to fully onsite work",
      "Only open to fully remote work",
    ],
  },
  {
    title: "Asking Salary",
    question: "How much is your expected monthly salary?",
    options: [],
    type: "range",
  },
];

export default function CVReviewStep({
  formData,
  updateFormData,
  showValidationErrors = false,
  validationErrors = {},
}: CVReviewStepProps) {
  const [cvSecretPrompt, setCvSecretPrompt] = useState(
    formData.cvSecretPrompt || ""
  );
  const [preScreeningQuestions, setPreScreeningQuestions] = useState<
    PreScreeningQuestion[]
  >(formData.preScreeningQuestions || []);
  const [draggedQuestionIndex, setDraggedQuestionIndex] = useState<
    number | null
  >(null);
  const [draggedOption, setDraggedOption] = useState<{
    questionId: string;
    optionIndex: number;
  } | null>(null);

  const handleSecretPromptChange = (value: string) => {
    setCvSecretPrompt(value);
    updateFormData({ cvSecretPrompt: value });
  };

  const addCustomQuestion = () => {
    const newQuestion: PreScreeningQuestion = {
      id: Date.now().toString(),
      question: "",
      type: "dropdown",
      options: [""],
    };
    const updated = [...preScreeningQuestions, newQuestion];
    setPreScreeningQuestions(updated);
    updateFormData({ preScreeningQuestions: updated });
  };

  const addSuggestedQuestion = (suggested: (typeof SUGGESTED_QUESTIONS)[0]) => {
    const newQuestion: PreScreeningQuestion = {
      id: Date.now().toString(),
      question: suggested.question,
      type: (suggested.type as "dropdown" | "text" | "range") || "dropdown",
      options: suggested.options.length > 0 ? suggested.options : [""],
      rangeMin: "",
      rangeMax: "",
    };
    const updated = [...preScreeningQuestions, newQuestion];
    setPreScreeningQuestions(updated);
    updateFormData({ preScreeningQuestions: updated });
  };

  const updateQuestion = (
    id: string,
    field: keyof PreScreeningQuestion,
    value: any
  ) => {
    const updated = preScreeningQuestions.map((q) =>
      q.id === id ? { ...q, [field]: value } : q
    );
    setPreScreeningQuestions(updated);
    updateFormData({ preScreeningQuestions: updated });
  };

  const deleteQuestion = (id: string) => {
    const updated = preScreeningQuestions.filter((q) => q.id !== id);
    setPreScreeningQuestions(updated);
    updateFormData({ preScreeningQuestions: updated });
  };

  const addOption = (questionId: string) => {
    const updated = preScreeningQuestions.map((q) =>
      q.id === questionId ? { ...q, options: [...q.options, ""] } : q
    );
    setPreScreeningQuestions(updated);
    updateFormData({ preScreeningQuestions: updated });
  };

  const updateOption = (
    questionId: string,
    optionIndex: number,
    value: string
  ) => {
    const updated = preScreeningQuestions.map((q) =>
      q.id === questionId
        ? {
            ...q,
            options: q.options.map((opt, idx) =>
              idx === optionIndex ? value : opt
            ),
          }
        : q
    );
    setPreScreeningQuestions(updated);
    updateFormData({ preScreeningQuestions: updated });
  };

  const deleteOption = (questionId: string, optionIndex: number) => {
    const updated = preScreeningQuestions.map((q) =>
      q.id === questionId
        ? { ...q, options: q.options.filter((_, idx) => idx !== optionIndex) }
        : q
    );
    setPreScreeningQuestions(updated);
    updateFormData({ preScreeningQuestions: updated });
  };

  const handleQuestionDragStart = (index: number) => {
    setDraggedQuestionIndex(index);
  };

  const handleQuestionDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleQuestionDrop = (dropIndex: number, e: React.DragEvent) => {
    e.preventDefault();
    if (draggedQuestionIndex === null || draggedQuestionIndex === dropIndex)
      return;

    const questions = [...preScreeningQuestions];
    const [draggedQuestion] = questions.splice(draggedQuestionIndex, 1);
    questions.splice(dropIndex, 0, draggedQuestion);

    setPreScreeningQuestions(questions);
    updateFormData({ preScreeningQuestions: questions });
    setDraggedQuestionIndex(null);
  };

  const handleOptionDragStart = (questionId: string, optionIndex: number) => {
    setDraggedOption({ questionId, optionIndex });
  };

  const handleOptionDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleOptionDrop = (
    questionId: string,
    dropIndex: number,
    e: React.DragEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedOption || draggedOption.questionId !== questionId) return;
    if (draggedOption.optionIndex === dropIndex) return;

    const updated = preScreeningQuestions.map((q) => {
      if (q.id === questionId) {
        const options = [...q.options];
        const [draggedOpt] = options.splice(draggedOption.optionIndex, 1);
        options.splice(dropIndex, 0, draggedOpt);
        return { ...q, options };
      }
      return q;
    });

    setPreScreeningQuestions(updated);
    updateFormData({ preScreeningQuestions: updated });
    setDraggedOption(null);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: 16,
      }}
    >
      {/* Divider */}
      <div
        style={{
          width: "100%",
          height: "1px",
          backgroundColor: "#E9EAEB",
        }}
      ></div>

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
            width: "75%",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* CV Review Settings */}
          <div className="layered-card-outer">
            <div className="layered-card-middle">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 20px",
                }}
              >
                <span
                  style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}
                >
                  1. CV Review Settings
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
                  CV Screening
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
                <div style={{ maxWidth: "380px" }}>
                  <CustomDropdown
                    onSelectSetting={(setting: string) =>
                      updateFormData({ screeningSetting: setting })
                    }
                    screeningSetting={formData.screeningSetting}
                    settingList={screeningSettingList}
                  />
                </div>

                <div style={{ marginTop: 24 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                      position: "relative",
                    }}
                  >
                    <i
                      className="la la-magic"
                      style={{ color: "#414651", fontSize: 18 }}
                    ></i>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#181D27",
                      }}
                    >
                      CV Secret Prompt
                    </span>
                    <span style={{ fontSize: 12, color: "#6B7280" }}>
                      (optional)
                    </span>
                    <div
                      style={{ position: "relative", display: "inline-block" }}
                      className="tooltip-container"
                    >
                      <i
                        className="la la-info-circle"
                        style={{
                          color: "#9CA3AF",
                          fontSize: 16,
                          cursor: "help",
                        }}
                      ></i>
                      <div
                        className="custom-tooltip"
                        style={{
                          position: "absolute",
                          bottom: "calc(100% + 8px)",
                          left: "50%",
                          transform: "translateX(-50%)",
                          backgroundColor: "#1F2937",
                          color: "#FFFFFF",
                          padding: "12px 16px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          lineHeight: "1.5",
                          whiteSpace: "normal",
                          width: "455px",
                          textAlign: "center",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                          zIndex: 1000,
                          opacity: 0,
                          visibility: "hidden",
                          transition: "opacity 0.2s, visibility 0.2s",
                          pointerEvents: "none",
                        }}
                      >
                        These prompts remain hidden from candidates and the
                        public job portal. Additionally, only Admins and the Job
                        Owner can view the secret prompts.
                        <div
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: 0,
                            height: 0,
                            borderLeft: "6px solid transparent",
                            borderRight: "6px solid transparent",
                            borderTop: "6px solid #1F2937",
                          }}
                        ></div>
                      </div>
                    </div>
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
                    placeholder="Enter a secret prompt (e.g., Give higher fit scores to candidates who participate in hackathons or competitions.)"
                    rows={3}
                    value={cvSecretPrompt}
                    onChange={(e) => handleSecretPromptChange(e.target.value)}
                    style={{
                      resize: "none",
                      maxHeight: "150px",
                      overflowY: "auto",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pre-Screening Questions */}
          <div className="layered-card-outer">
            <div className="layered-card-middle">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "6px 20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}
                  >
                    2. Pre-Screening Questions
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
                    {preScreeningQuestions.length}
                  </span>
                </div>
                <button
                  onClick={addCustomQuestion}
                  style={{
                    background: "#181D27",
                    color: "#fff",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 13,
                  }}
                >
                  <i className="la la-plus" style={{ fontSize: 16 }}></i>
                  Add custom
                </button>
              </div>

              {showValidationErrors &&
                validationErrors.preScreeningQuestions && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 16,
                    }}
                  >
                    <i
                      className="la la-exclamation-triangle"
                      style={{ color: "#EF4444", fontSize: 18 }}
                    ></i>
                    <span style={{ fontSize: 14, color: "#DC2626" }}>
                      {validationErrors.preScreeningQuestions}
                    </span>
                  </div>
                )}

              <div className="layered-card-content">
                {preScreeningQuestions.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "24px 0" }}>
                    <span style={{ fontSize: 14, color: "#6B7280" }}>
                      No pre-screening questions added yet.
                    </span>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    {preScreeningQuestions.map((question, qIndex) => (
                      <div
                        key={question.id}
                        draggable
                        onDragStart={() => handleQuestionDragStart(qIndex)}
                        onDragOver={handleQuestionDragOver}
                        onDrop={(e) => handleQuestionDrop(qIndex, e)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          cursor: "move",
                        }}
                      >
                        <div
                          style={{
                            cursor: "grab",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <i
                            className="la la-grip-vertical"
                            style={{
                              color: "#9CA3AF",
                              fontSize: 20,
                            }}
                          ></i>
                        </div>
                        <div
                          style={{
                            border: "1px solid #E9EAEB",
                            borderRadius: "8px",
                            overflow: "hidden",
                            flex: 1,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              backgroundColor: "#F8F9FC",
                              padding: "16px",
                            }}
                          >
                            <div style={{ flex: 1, marginRight: 12 }}>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Enter your question"
                                value={question.question}
                                onChange={(e) =>
                                  updateQuestion(
                                    question.id,
                                    "question",
                                    e.target.value
                                  )
                                }
                                style={{
                                  width: "100%",
                                  borderColor:
                                    showValidationErrors &&
                                    validationErrors[
                                      `preScreeningQuestion_${qIndex}_question`
                                    ]
                                      ? "#EF4444"
                                      : undefined,
                                }}
                              />
                              {showValidationErrors &&
                                validationErrors[
                                  `preScreeningQuestion_${qIndex}_question`
                                ] && (
                                  <span
                                    style={{
                                      fontSize: 12,
                                      color: "#DC2626",
                                      marginTop: 4,
                                      display: "block",
                                    }}
                                  >
                                    {
                                      validationErrors[
                                        `preScreeningQuestion_${qIndex}_question`
                                      ]
                                    }
                                  </span>
                                )}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                gap: 8,
                                minWidth: "250px",
                              }}
                            >
                              <CustomDropdown
                                onSelectSetting={(type: string) =>
                                  updateQuestion(
                                    question.id,
                                    "type",
                                    type.toLowerCase()
                                  )
                                }
                                screeningSetting={
                                  question.type === "dropdown"
                                    ? "Dropdown"
                                    : "Range"
                                }
                                settingList={[
                                  {
                                    name: "Dropdown",
                                    icon: "la la-chevron-circle-down",
                                  },
                                  {
                                    name: "Range",
                                    icon: "la la-sort-numeric-down",
                                  },
                                ]}
                              />
                            </div>
                          </div>

                          {question.type === "dropdown" && (
                            <div style={{ padding: "16px 16px 16px 16px" }}>
                              {question.options.map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  draggable
                                  onDragStart={() =>
                                    handleOptionDragStart(question.id, optIndex)
                                  }
                                  onDragOver={handleOptionDragOver}
                                  onDrop={(e) =>
                                    handleOptionDrop(question.id, optIndex, e)
                                  }
                                  className="option-drag-container"
                                  style={{
                                    marginBottom: 8,
                                    cursor: "move",
                                  }}
                                >
                                  <i
                                    className="la la-grip-vertical option-grip-icon"
                                    style={{
                                      color: "#9CA3AF",
                                      cursor: "grab",
                                      flexShrink: 0,
                                    }}
                                  ></i>
                                  <div
                                    className="option-input-wrapper"
                                    style={{
                                      position: "relative",
                                      flex: 1,
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <span
                                      style={{
                                        position: "absolute",
                                        left: "0",
                                        width: "32px",
                                        textAlign: "center",
                                        fontSize: 14,
                                        color: "#6B7280",
                                        fontWeight: 500,
                                        pointerEvents: "none",
                                        zIndex: 1,
                                      }}
                                    >
                                      {optIndex + 1}
                                    </span>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Option text"
                                      value={option}
                                      onChange={(e) =>
                                        updateOption(
                                          question.id,
                                          optIndex,
                                          e.target.value
                                        )
                                      }
                                      style={{
                                        flex: 1,
                                        paddingLeft: "44px",
                                        borderLeft: "none",
                                        borderImage:
                                          "linear-gradient(to right, #9c99a4 32px, transparent 32px, transparent 34px, #9c99a4 34px) 2",
                                        borderImageSlice: 1,
                                      }}
                                    />
                                    <span
                                      style={{
                                        position: "absolute",
                                        left: "32px",
                                        top: 0,
                                        bottom: 0,
                                        width: "2px",
                                        backgroundColor: "#9c99a4",
                                        pointerEvents: "none",
                                        zIndex: 2,
                                      }}
                                    ></span>
                                  </div>
                                  <button
                                    className="option-delete-btn"
                                    onClick={() =>
                                      deleteOption(question.id, optIndex)
                                    }
                                    style={{
                                      background: "transparent",
                                      border: "1.5px solid #D1D5DB",
                                      cursor: "pointer",
                                      padding: "0",
                                      marginLeft: "24px",
                                      borderRadius: "50%",
                                      width: "32px",
                                      height: "32px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      flexShrink: 0,
                                      position: "relative",
                                    }}
                                  >
                                    <i
                                      className="la la-times"
                                      style={{
                                        color: "#6B7280",
                                        fontSize: 16,
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                      }}
                                    ></i>
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => addOption(question.id)}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  padding: "6px 0",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                  fontSize: 13,
                                  color: "#414651",
                                  marginTop: 8,
                                }}
                              >
                                <i
                                  className="la la-plus"
                                  style={{ fontSize: 16 }}
                                ></i>
                                Add Option
                              </button>
                              {showValidationErrors &&
                                validationErrors[
                                  `preScreeningQuestion_${qIndex}_options`
                                ] && (
                                  <span
                                    style={{
                                      fontSize: 12,
                                      color: "#DC2626",
                                      marginTop: 8,
                                      display: "block",
                                    }}
                                  >
                                    {
                                      validationErrors[
                                        `preScreeningQuestion_${qIndex}_options`
                                      ]
                                    }
                                  </span>
                                )}
                            </div>
                          )}

                          {question.type === "range" && (
                            <div style={{ padding: "16px 16px 16px 16px" }}>
                              <div
                                style={{
                                  display: "flex",
                                  gap: 16,
                                  alignItems: "center",
                                }}
                              >
                                <div style={{ flex: 1 }}>
                                  <span
                                    style={{
                                      fontSize: 12,
                                      color: "#6B7280",
                                      display: "block",
                                      marginBottom: 4,
                                    }}
                                  >
                                    Minimum
                                  </span>
                                  <div style={{ position: "relative" }}>
                                    <span
                                      style={{
                                        position: "absolute",
                                        left: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#6c757d",
                                        fontSize: "16px",
                                        pointerEvents: "none",
                                      }}
                                    >
                                      P
                                    </span>
                                    <input
                                      type="number"
                                      className="form-control"
                                      style={{
                                        paddingLeft: "28px",
                                        paddingRight: "50px",
                                      }}
                                      placeholder="0"
                                      min={0}
                                      value={question.rangeMin || ""}
                                      onChange={(e) =>
                                        updateQuestion(
                                          question.id,
                                          "rangeMin",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <span
                                      style={{
                                        position: "absolute",
                                        right: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#6c757d",
                                        fontSize: "14px",
                                        pointerEvents: "none",
                                      }}
                                    >
                                      PHP
                                    </span>
                                  </div>
                                </div>
                                <div style={{ flex: 1 }}>
                                  <span
                                    style={{
                                      fontSize: 12,
                                      color: "#6B7280",
                                      display: "block",
                                      marginBottom: 4,
                                    }}
                                  >
                                    Maximum
                                  </span>
                                  <div style={{ position: "relative" }}>
                                    <span
                                      style={{
                                        position: "absolute",
                                        left: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#6c757d",
                                        fontSize: "16px",
                                        pointerEvents: "none",
                                      }}
                                    >
                                      P
                                    </span>
                                    <input
                                      type="number"
                                      className="form-control"
                                      style={{
                                        paddingLeft: "28px",
                                        paddingRight: "50px",
                                      }}
                                      placeholder="0"
                                      min={0}
                                      value={question.rangeMax || ""}
                                      onChange={(e) =>
                                        updateQuestion(
                                          question.id,
                                          "rangeMax",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <span
                                      style={{
                                        position: "absolute",
                                        right: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#6c757d",
                                        fontSize: "14px",
                                        pointerEvents: "none",
                                      }}
                                    >
                                      PHP
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          <div
                            style={{
                              borderTop: "1px solid #E9EAEB",
                              margin: "0 16px",
                              padding: "12px 0 16px 0",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <button
                                className="delete-question-btn"
                                onClick={() => deleteQuestion(question.id)}
                                style={{
                                  background: "transparent",
                                  border: "1px solid #EF4444",
                                  color: "#EF4444",
                                  padding: "6px 12px",
                                  borderRadius: "20px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                  fontSize: 13,
                                }}
                              >
                                <i
                                  className="la la-trash"
                                  style={{ fontSize: 16 }}
                                ></i>
                                Delete Question
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested Questions */}
                {preScreeningQuestions.length < 10 && (
                  <div
                    style={{
                      marginTop: 24,
                      paddingTop: 24,
                      borderTop: "1px solid #E9EAEB",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#181D27",
                        display: "block",
                        marginBottom: 12,
                      }}
                    >
                      Suggested Pre-screening Questions:
                    </span>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      {SUGGESTED_QUESTIONS.map((suggested, idx) => {
                        const isAlreadyAdded = preScreeningQuestions.some(
                          (q) => q.question === suggested.question
                        );
                        return (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "12px 0",
                              border: "none",
                              borderRadius: "6px",
                            }}
                          >
                            <div>
                              <span
                                style={{
                                  fontSize: 14,
                                  fontWeight: 600,
                                  color: isAlreadyAdded ? "#9CA3AF" : "#181D27",
                                  display: "block",
                                }}
                              >
                                {suggested.title}
                              </span>
                              <span
                                style={{
                                  fontSize: 12,
                                  color: isAlreadyAdded ? "#9CA3AF" : "#6B7280",
                                }}
                              >
                                {suggested.question}
                              </span>
                            </div>
                            {isAlreadyAdded ? (
                              <span
                                style={{
                                  background: "#E5E7EB",
                                  color: "#9CA3AF",
                                  padding: "6px 16px",
                                  borderRadius: "20px",
                                  fontSize: 13,
                                  fontWeight: 500,
                                }}
                              >
                                Added
                              </span>
                            ) : (
                              <button
                                onClick={() => addSuggestedQuestion(suggested)}
                                style={{
                                  background: "transparent",
                                  border: "1px solid #D5D7DA",
                                  padding: "4px 12px",
                                  borderRadius: "20px",
                                  cursor: "pointer",
                                  fontSize: 13,
                                  color: "#414651",
                                }}
                              >
                                Add
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Tips */}
        <div style={{ width: "25%", position: "sticky", top: 100 }}>
          <div className="layered-card-outer">
            <div className="layered-card-middle">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 20px",
                }}
              >
                <i
                  className="la la-lightbulb"
                  style={{ color: "#F59E0B", fontSize: 24 }}
                ></i>
                <span
                  style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}
                >
                  Tips
                </span>
              </div>
              <div className="layered-card-content">
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 14, color: "#181D27" }}>
                    <span style={{ fontWeight: 600 }}>Add a Secret Prompt</span>{" "}
                    <span style={{ color: "#6B7280" }}>
                      to fine-tune how Jia scores and evaluates submitted CVs.
                    </span>
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: 14, color: "#181D27" }}>
                    <span style={{ fontWeight: 600 }}>
                      Add Pre-Screening questions
                    </span>{" "}
                    <span style={{ color: "#6B7280" }}>
                      to collect key details such as notice period, work setup,
                      or salary expectations to guide your review and candidate
                      discussions.
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
