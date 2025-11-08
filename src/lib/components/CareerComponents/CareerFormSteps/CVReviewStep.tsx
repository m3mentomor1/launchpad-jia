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
}: CVReviewStepProps) {
  const [cvSecretPrompt, setCvSecretPrompt] = useState(
    formData.cvSecretPrompt || ""
  );
  const [preScreeningQuestions, setPreScreeningQuestions] = useState<
    PreScreeningQuestion[]
  >(formData.preScreeningQuestions || []);

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
        {/* CV Review Settings */}
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
              <CustomDropdown
                onSelectSetting={(setting: string) =>
                  updateFormData({ screeningSetting: setting })
                }
                screeningSetting={formData.screeningSetting}
                settingList={screeningSettingList}
              />

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
                    CV Secret Prompt
                  </span>
                  <span style={{ fontSize: 12, color: "#6B7280" }}>
                    (optional)
                  </span>
                  <i
                    className="la la-info-circle"
                    style={{ color: "#9CA3AF", fontSize: 16, cursor: "help" }}
                    title="These prompts remain hidden from candidates and the public job portal. Additionally, only Admins and the Job Owner can view the secret prompts."
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
                  placeholder="Enter a secret prompt (e.g., Give higher fit scores to candidates who participate in hackathons or competitions.)"
                  rows={4}
                  value={cvSecretPrompt}
                  onChange={(e) => handleSecretPromptChange(e.target.value)}
                  style={{ resize: "vertical" }}
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
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}
                >
                  2. Pre-Screening Questions
                </span>
                <span style={{ fontSize: 12, color: "#6B7280" }}>
                  (optional)
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
                  borderRadius: "8px",
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

            <div className="layered-card-content">
              {preScreeningQuestions.length === 0 ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <span style={{ fontSize: 14, color: "#6B7280" }}>
                    No pre-screening questions added yet.
                  </span>
                </div>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {preScreeningQuestions.map((question) => (
                    <div
                      key={question.id}
                      style={{
                        border: "1px solid #E9EAEB",
                        borderRadius: "8px",
                        padding: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 12,
                        }}
                      >
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
                          style={{ flex: 1, marginRight: 12 }}
                        />
                        <div style={{ display: "flex", gap: 8 }}>
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
                                : question.type === "range"
                                ? "Range"
                                : "Text"
                            }
                            settingList={[
                              { name: "Dropdown" },
                              { name: "Text" },
                              { name: "Range" },
                            ]}
                          />
                        </div>
                      </div>

                      {question.type === "dropdown" && (
                        <div style={{ marginLeft: 16 }}>
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                marginBottom: 8,
                              }}
                            >
                              <i
                                className="la la-grip-vertical"
                                style={{ color: "#9CA3AF", cursor: "grab" }}
                              ></i>
                              <span
                                style={{
                                  fontSize: 14,
                                  color: "#6B7280",
                                  minWidth: 20,
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
                                style={{ flex: 1 }}
                              />
                              <button
                                onClick={() =>
                                  deleteOption(question.id, optIndex)
                                }
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  cursor: "pointer",
                                  padding: "4px 8px",
                                }}
                              >
                                <i
                                  className="la la-times"
                                  style={{ color: "#EF4444", fontSize: 18 }}
                                ></i>
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addOption(question.id)}
                            style={{
                              background: "transparent",
                              border: "1px dashed #D5D7DA",
                              padding: "6px 12px",
                              borderRadius: "6px",
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
                        </div>
                      )}

                      {question.type === "range" && (
                        <div style={{ marginLeft: 16, marginTop: 12 }}>
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

                      <button
                        onClick={() => deleteQuestion(question.id)}
                        style={{
                          background: "transparent",
                          border: "1px solid #FEE2E2",
                          color: "#EF4444",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 13,
                          marginTop: 12,
                        }}
                      >
                        <i className="la la-trash" style={{ fontSize: 16 }}></i>
                        Delete Question
                      </button>
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
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {SUGGESTED_QUESTIONS.map((suggested, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px",
                          border: "1px solid #E9EAEB",
                          borderRadius: "6px",
                        }}
                      >
                        <div>
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: "#181D27",
                              display: "block",
                            }}
                          >
                            {suggested.title}
                          </span>
                          <span style={{ fontSize: 12, color: "#6B7280" }}>
                            {suggested.question}
                          </span>
                        </div>
                        <button
                          onClick={() => addSuggestedQuestion(suggested)}
                          style={{
                            background: "transparent",
                            border: "1px solid #D5D7DA",
                            padding: "4px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: 13,
                            color: "#414651",
                          }}
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                  to fine-tune how Jia scores and evaluates submitted CVs.
                </span>
              </div>
              <div>
                <span
                  style={{ fontSize: 14, fontWeight: 600, color: "#181D27" }}
                >
                  Add Pre-Screening questions
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "#6B7280",
                    display: "block",
                    marginTop: 4,
                  }}
                >
                  to collect key details such as notice period, work setup, or
                  salary expectations to guide your review and candidate
                  discussions.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
