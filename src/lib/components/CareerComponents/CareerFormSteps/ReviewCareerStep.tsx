"use client";

import { useState } from "react";
import { CareerFormData } from "../SegmentedCareerForm";

interface ReviewCareerStepProps {
  formData: CareerFormData;
  onEditStep?: (step: number) => void;
}

export default function ReviewCareerStep({
  formData,
  onEditStep,
}: ReviewCareerStepProps) {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    careerDetails: true,
    cvReview: true,
    aiInterview: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const totalQuestions = formData.questions.reduce(
    (sum, category) => sum + category.questions.length,
    0
  );

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
          marginBottom: "8px",
        }}
      ></div>

      <div
        style={{
          maxWidth: "1150px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          margin: "0 auto",
        }}
      >
        {/* Career Details & Team Access */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E9EAEB",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <div
            onClick={() => toggleSection("careerDetails")}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 20px",
              cursor: "pointer",
              backgroundColor: "#F9FAFB",
              borderBottom: expandedSections.careerDetails
                ? "1px solid #E9EAEB"
                : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <i
                className={`la la-chevron-${
                  expandedSections.careerDetails ? "down" : "right"
                }`}
                style={{ fontSize: 16, color: "#6B7280" }}
              ></i>
              <span style={{ fontSize: 16, fontWeight: 600, color: "#181D27" }}>
                Career Details & Team Access
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditStep?.(1);
              }}
              style={{
                background: "#FFFFFF",
                border: "1px solid #E9EAEB",
                borderRadius: "50%",
                cursor: "pointer",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              }}
            >
              <i
                className="la la-pen"
                style={{ fontSize: 16, color: "#6B7280" }}
              ></i>
            </button>
          </div>

          {expandedSections.careerDetails && (
            <div style={{ padding: "20px" }}>
              <div style={{ marginBottom: 20 }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#6B7280",
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  Job Title
                </span>
                <span style={{ fontSize: 16, color: "#181D27" }}>
                  {formData.jobTitle || "Not specified"}
                </span>
              </div>

              {/* Divider */}
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "#E9EAEB",
                  marginBottom: "20px",
                }}
              ></div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 20,
                  marginBottom: 20,
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#6B7280",
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    Employment Type
                  </span>
                  <span style={{ fontSize: 14, color: "#181D27" }}>
                    {formData.employmentType || "Not specified"}
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#6B7280",
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    Work Arrangement
                  </span>
                  <span style={{ fontSize: 14, color: "#181D27" }}>
                    {formData.workSetup || "Not specified"}
                  </span>
                </div>
                <div></div>
              </div>

              {/* Divider */}
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "#E9EAEB",
                  marginBottom: "20px",
                }}
              ></div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 20,
                  marginBottom: 20,
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#6B7280",
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    Country
                  </span>
                  <span style={{ fontSize: 14, color: "#181D27" }}>
                    {formData.country}
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#6B7280",
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    State / Province
                  </span>
                  <span style={{ fontSize: 14, color: "#181D27" }}>
                    {formData.province}
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#6B7280",
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    City
                  </span>
                  <span style={{ fontSize: 14, color: "#181D27" }}>
                    {formData.city}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "#E9EAEB",
                  marginBottom: "20px",
                }}
              ></div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 20,
                  marginBottom: 20,
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#6B7280",
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    Minimum Salary
                  </span>
                  <span style={{ fontSize: 14, color: "#181D27" }}>
                    {formData.minimumSalary
                      ? formData.salaryNegotiable
                        ? "Negotiable"
                        : `₱${Number(formData.minimumSalary).toLocaleString()}`
                      : "Negotiable"}
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#6B7280",
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    Maximum Salary
                  </span>
                  <span style={{ fontSize: 14, color: "#181D27" }}>
                    {formData.maximumSalary
                      ? formData.salaryNegotiable
                        ? "Negotiable"
                        : `₱${Number(formData.maximumSalary).toLocaleString()}`
                      : "Negotiable"}
                  </span>
                </div>
                <div></div>
              </div>

              {/* Divider */}
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "#E9EAEB",
                  marginBottom: "20px",
                }}
              ></div>

              <div style={{ marginBottom: 20 }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#6B7280",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Job Description
                </span>
                <div
                  style={{
                    fontSize: 14,
                    color: "#181D27",
                    lineHeight: 1.6,
                  }}
                  dangerouslySetInnerHTML={{
                    __html: formData.description || "Not specified",
                  }}
                />
              </div>

              {formData.teamMembers && formData.teamMembers.length > 0 && (
                <>
                  {/* Divider */}
                  <div
                    style={{
                      width: "100%",
                      height: "1px",
                      backgroundColor: "#E9EAEB",
                      marginBottom: "20px",
                    }}
                  ></div>

                  <div>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#6B7280",
                        display: "block",
                        marginBottom: 12,
                      }}
                    >
                      Team Access
                    </span>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      {formData.teamMembers.map((member: any, idx: number) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "12px",
                            backgroundColor: "#F9FAFB",
                            borderRadius: "8px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                            }}
                          >
                            <div
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                backgroundColor: "#E9EAEB",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <i
                                className="la la-user"
                                style={{ fontSize: 20, color: "#6B7280" }}
                              ></i>
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: 14,
                                  fontWeight: 500,
                                  color: "#181D27",
                                }}
                              >
                                {member.name}
                              </div>
                              <div style={{ fontSize: 12, color: "#6B7280" }}>
                                {member.email}
                              </div>
                            </div>
                          </div>
                          <span
                            style={{
                              fontSize: 13,
                              color: "#6B7280",
                              padding: "4px 12px",
                              backgroundColor: "#FFFFFF",
                              borderRadius: "6px",
                              border: "1px solid #E9EAEB",
                            }}
                          >
                            {member.role || "Contributor"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* CV Review & Pre-Screening Questions */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E9EAEB",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <div
            onClick={() => toggleSection("cvReview")}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 20px",
              cursor: "pointer",
              backgroundColor: "#F9FAFB",
              borderBottom: expandedSections.cvReview
                ? "1px solid #E9EAEB"
                : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <i
                className={`la la-chevron-${
                  expandedSections.cvReview ? "down" : "right"
                }`}
                style={{ fontSize: 16, color: "#6B7280" }}
              ></i>
              <span style={{ fontSize: 16, fontWeight: 600, color: "#181D27" }}>
                CV Review & Pre-Screening Questions
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditStep?.(2);
              }}
              style={{
                background: "#FFFFFF",
                border: "1px solid #E9EAEB",
                borderRadius: "50%",
                cursor: "pointer",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              }}
            >
              <i
                className="la la-pen"
                style={{ fontSize: 16, color: "#6B7280" }}
              ></i>
            </button>
          </div>

          {expandedSections.cvReview && (
            <div style={{ padding: "20px" }}>
              <div style={{ marginBottom: 20 }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#6B7280",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  CV Screening
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, color: "#181D27" }}>
                    Automatically endorse candidates who are
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#0066CC",
                      padding: "4px 12px",
                      backgroundColor: "#EBF5FF",
                      borderRadius: "20px",
                      border: "1px solid #B3D9FF",
                    }}
                  >
                    {formData.screeningSetting
                      ?.replace(" and above", "")
                      .replace(" And Above", "")}
                  </span>
                  <span style={{ fontSize: 14, color: "#181D27" }}>
                    and above
                  </span>
                </div>
              </div>

              {formData.cvSecretPrompt && (
                <>
                  {/* Divider */}
                  <div
                    style={{
                      width: "100%",
                      height: "1px",
                      backgroundColor: "#E9EAEB",
                      marginBottom: "20px",
                    }}
                  ></div>

                  <div style={{ marginBottom: 20 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 8,
                      }}
                    >
                      <i
                        className="la la-magic"
                        style={{ fontSize: 16, color: "#6B7280" }}
                      ></i>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#6B7280",
                        }}
                      >
                        CV Secret Prompt
                      </span>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      {formData.cvSecretPrompt.split("\n").map((line, idx) => (
                        <li
                          key={idx}
                          style={{
                            fontSize: 14,
                            color: "#181D27",
                            marginBottom: 4,
                          }}
                        >
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {formData.preScreeningQuestions &&
                formData.preScreeningQuestions.length > 0 && (
                  <>
                    {/* Divider */}
                    <div
                      style={{
                        width: "100%",
                        height: "1px",
                        backgroundColor: "#E9EAEB",
                        marginBottom: "20px",
                      }}
                    ></div>

                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          marginBottom: 12,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#6B7280",
                          }}
                        >
                          Pre-Screening Questions
                        </span>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minWidth: "28px",
                            height: "28px",
                            padding: "0 6px",
                            backgroundColor: "#F3F4F6",
                            border: "1px solid #E5E7EB",
                            borderRadius: "50%",
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#181D27",
                          }}
                        >
                          {formData.preScreeningQuestions.length}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 12,
                        }}
                      >
                        {formData.preScreeningQuestions.map(
                          (question: any, idx: number) => (
                            <div key={idx}>
                              <div
                                style={{
                                  fontSize: 14,
                                  fontWeight: 500,
                                  color: "#181D27",
                                  marginBottom: 4,
                                }}
                              >
                                {idx + 1}. {question.question}
                              </div>
                              {question.type === "dropdown" &&
                                question.options.length > 0 && (
                                  <ul style={{ margin: 0, paddingLeft: 32 }}>
                                    {question.options.map(
                                      (option: string, optIdx: number) => (
                                        <li
                                          key={optIdx}
                                          style={{
                                            fontSize: 13,
                                            color: "#6B7280",
                                            marginBottom: 2,
                                          }}
                                        >
                                          {option}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                )}
                              {question.type === "range" &&
                                (question.rangeMin || question.rangeMax) && (
                                  <div
                                    style={{
                                      fontSize: 13,
                                      color: "#6B7280",
                                      marginLeft: 32,
                                    }}
                                  >
                                    Preferred: PHP{" "}
                                    {question.rangeMin
                                      ? Number(
                                          question.rangeMin
                                        ).toLocaleString()
                                      : "0"}{" "}
                                    - PHP{" "}
                                    {question.rangeMax
                                      ? Number(
                                          question.rangeMax
                                        ).toLocaleString()
                                      : "0"}
                                  </div>
                                )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </>
                )}
            </div>
          )}
        </div>

        {/* AI Interview Setup */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E9EAEB",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <div
            onClick={() => toggleSection("aiInterview")}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 20px",
              cursor: "pointer",
              backgroundColor: "#F9FAFB",
              borderBottom: expandedSections.aiInterview
                ? "1px solid #E9EAEB"
                : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <i
                className={`la la-chevron-${
                  expandedSections.aiInterview ? "down" : "right"
                }`}
                style={{ fontSize: 16, color: "#6B7280" }}
              ></i>
              <span style={{ fontSize: 16, fontWeight: 600, color: "#181D27" }}>
                AI Interview Setup
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditStep?.(3);
              }}
              style={{
                background: "#FFFFFF",
                border: "1px solid #E9EAEB",
                borderRadius: "50%",
                cursor: "pointer",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              }}
            >
              <i
                className="la la-pen"
                style={{ fontSize: 16, color: "#6B7280" }}
              ></i>
            </button>
          </div>

          {expandedSections.aiInterview && (
            <div style={{ padding: "20px" }}>
              <div style={{ marginBottom: 20 }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#6B7280",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  AI Interview Screening
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, color: "#181D27" }}>
                    Automatically endorse candidates who are
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#0066CC",
                      padding: "4px 12px",
                      backgroundColor: "#EBF5FF",
                      borderRadius: "20px",
                      border: "1px solid #B3D9FF",
                    }}
                  >
                    {formData.screeningSetting
                      ?.replace(" and above", "")
                      .replace(" And Above", "")}
                  </span>
                  <span style={{ fontSize: 14, color: "#181D27" }}>
                    and above
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "#E9EAEB",
                  marginBottom: "20px",
                }}
              ></div>

              <div
                style={{
                  marginBottom: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#181D27",
                  }}
                >
                  Require Video on Interview
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, color: "#181D27" }}>
                    {formData.requireVideo ? "Yes" : "No"}
                  </span>
                  {formData.requireVideo && (
                    <i
                      className="la la-check-circle"
                      style={{ fontSize: 18, color: "#10B981" }}
                    ></i>
                  )}
                </div>
              </div>

              {formData.aiSecretPrompt && (
                <>
                  {/* Divider */}
                  <div
                    style={{
                      width: "100%",
                      height: "1px",
                      backgroundColor: "#E9EAEB",
                      marginBottom: "20px",
                    }}
                  ></div>

                  <div style={{ marginBottom: 20 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 8,
                      }}
                    >
                      <i
                        className="la la-magic"
                        style={{ fontSize: 16, color: "#6B7280" }}
                      ></i>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#6B7280",
                        }}
                      >
                        AI Interview Secret Prompt
                      </span>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      {formData.aiSecretPrompt.split("\n").map((line, idx) => (
                        <li
                          key={idx}
                          style={{
                            fontSize: 14,
                            color: "#181D27",
                            marginBottom: 4,
                          }}
                        >
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {/* Divider */}
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "#E9EAEB",
                  marginBottom: "20px",
                }}
              ></div>

              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#6B7280",
                    }}
                  >
                    Interview Questions
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "28px",
                      height: "28px",
                      padding: "0 6px",
                      backgroundColor: "#F3F4F6",
                      border: "1px solid #E5E7EB",
                      borderRadius: "50%",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#181D27",
                    }}
                  >
                    {totalQuestions}
                  </span>
                </div>
                {(() => {
                  let questionNumber = 1;
                  return formData.questions.map((category) => {
                    if (category.questions.length === 0) return null;
                    return (
                      <div key={category.id} style={{ marginBottom: 16 }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#181D27",
                            marginBottom: 8,
                          }}
                        >
                          {category.category}
                        </div>
                        <div style={{ margin: 0, paddingLeft: 32 }}>
                          {category.questions.map(
                            (question: any, idx: number) => {
                              const currentNumber = questionNumber++;
                              return (
                                <div
                                  key={idx}
                                  style={{
                                    fontSize: 14,
                                    color: "#414651",
                                    marginBottom: 6,
                                    display: "flex",
                                    gap: 8,
                                  }}
                                >
                                  <span style={{ flexShrink: 0 }}>
                                    {currentNumber}.
                                  </span>
                                  <span>{question.question}</span>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
