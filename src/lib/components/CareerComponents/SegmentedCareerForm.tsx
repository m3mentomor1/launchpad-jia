"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "@/lib/context/AppContext";
import {
  CareerDetailsStep,
  CVReviewStep,
  AIInterviewStep,
  ReviewCareerStep,
  StepIndicator,
} from "./CareerFormSteps";
import axios from "axios";
import { candidateActionToast, errorToast } from "@/lib/Utils";
import FullScreenLoadingAnimation from "./FullScreenLoadingAnimation";

export interface CareerFormData {
  jobTitle: string;
  description: string;
  workSetup: string;
  workSetupRemarks: string;
  employmentType: string;
  country: string;
  province: string;
  city: string;
  salaryNegotiable: boolean;
  minimumSalary: string;
  maximumSalary: string;
  screeningSetting: string;
  requireVideo: boolean;
  questions: any[];
  teamMembers: any[];
  cvSecretPrompt?: string;
  preScreeningQuestions?: any[];
  aiSecretPrompt?: string;
}

const STEPS = [
  { id: 1, name: "Career Details & Team Access", key: "details" },
  { id: 2, name: "CV Review & Pre-screening", key: "cv-review" },
  { id: 3, name: "AI Interview Setup", key: "interview" },
  { id: 4, name: "Review Career", key: "review" },
];

const STORAGE_KEY = "career_form_draft";

export default function SegmentedCareerForm({
  career,
  formType,
  setShowEditModal,
}: {
  career?: any;
  formType: string;
  setShowEditModal?: (show: boolean) => void;
}) {
  const { user, orgID } = useAppContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);

  const [formData, setFormData] = useState<CareerFormData>({
    jobTitle: career?.jobTitle || "",
    description: career?.description || "",
    workSetup: career?.workSetup || "",
    workSetupRemarks: career?.workSetupRemarks || "",
    employmentType: career?.employmentType || "Full-Time",
    country: career?.country || "Philippines",
    province: career?.province || "",
    city: career?.location || "",
    salaryNegotiable: career?.salaryNegotiable ?? true,
    minimumSalary: career?.minimumSalary || "",
    maximumSalary: career?.maximumSalary || "",
    screeningSetting: career?.screeningSetting || "Good Fit and above",
    requireVideo: career?.requireVideo ?? true,
    questions: career?.questions || [
      {
        id: 1,
        category: "CV Validation / Experience",
        questionCountToAsk: null,
        questions: [],
      },
      { id: 2, category: "Technical", questionCountToAsk: null, questions: [] },
      {
        id: 3,
        category: "Behavioral",
        questionCountToAsk: null,
        questions: [],
      },
      {
        id: 4,
        category: "Analytical",
        questionCountToAsk: null,
        questions: [],
      },
      { id: 5, category: "Others", questionCountToAsk: null, questions: [] },
    ],
    teamMembers: career?.teamMembers || [],
    cvSecretPrompt: career?.cvSecretPrompt || "",
    preScreeningQuestions: career?.preScreeningQuestions || [],
    aiSecretPrompt: career?.aiSecretPrompt || "",
  });

  // Load draft from localStorage on mount (only for new careers)
  useEffect(() => {
    if (formType === "add" && !career) {
      const savedDraft = localStorage.getItem(STORAGE_KEY);
      if (savedDraft) {
        setHasSavedDraft(true);
        try {
          const { formData: savedFormData, step } = JSON.parse(savedDraft);
          setFormData(savedFormData);
          setCurrentStep(step);
        } catch (error) {
          console.error("Failed to load draft:", error);
        }
      }
    }
  }, [formType, career]);

  // Clear draft function
  const clearDraft = () => {
    if (
      window.confirm(
        "Are you sure you want to clear the saved draft and start fresh?"
      )
    ) {
      localStorage.removeItem(STORAGE_KEY);
      setHasSavedDraft(false);
      // Reset to initial state
      setFormData({
        jobTitle: "",
        description: "",
        workSetup: "",
        workSetupRemarks: "",
        employmentType: "Full-Time",
        country: "Philippines",
        province: "",
        city: "",
        salaryNegotiable: true,
        minimumSalary: "",
        maximumSalary: "",
        screeningSetting: "Good Fit and above",
        requireVideo: true,
        questions: [
          {
            id: 1,
            category: "CV Validation / Experience",
            questionCountToAsk: null,
            questions: [],
          },
          {
            id: 2,
            category: "Technical",
            questionCountToAsk: null,
            questions: [],
          },
          {
            id: 3,
            category: "Behavioral",
            questionCountToAsk: null,
            questions: [],
          },
          {
            id: 4,
            category: "Analytical",
            questionCountToAsk: null,
            questions: [],
          },
          {
            id: 5,
            category: "Others",
            questionCountToAsk: null,
            questions: [],
          },
        ],
        teamMembers: [],
        cvSecretPrompt: "",
        preScreeningQuestions: [],
        aiSecretPrompt: "",
      });
      setCurrentStep(1);
    }
  };

  // Save draft to localStorage whenever formData changes
  const saveDraft = () => {
    if (formType === "add") {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ formData, step: currentStep })
      );
    }
  };

  const updateFormData = (updates: Partial<CareerFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        // Required: Job Title, Employment Type, Work Setup (Arrangement), Province, City, Min/Max Salary, Job Description
        return (
          formData.jobTitle.trim().length > 0 &&
          formData.employmentType.trim().length > 0 &&
          formData.workSetup.trim().length > 0 &&
          formData.province.trim().length > 0 &&
          formData.city.trim().length > 0 &&
          formData.minimumSalary.trim().length > 0 &&
          formData.maximumSalary.trim().length > 0 &&
          formData.description.trim().length > 0
        );
      case 2:
        // Required: At least 1 pre-screening question
        return (
          formData.preScreeningQuestions &&
          formData.preScreeningQuestions.length > 0 &&
          formData.preScreeningQuestions.every((q: any) => {
            // Question text must not be empty
            if (!q.question || q.question.trim().length === 0) return false;
            // Dropdown questions must have at least one non-empty option
            if (q.type === "dropdown") {
              return (
                q.options &&
                q.options.length > 0 &&
                q.options.some((opt: string) => opt.trim().length > 0)
              );
            }
            return true;
          })
        );
      case 3:
        // Required: At least 5 interview questions
        const totalQuestions = formData.questions.reduce(
          (sum, q) => sum + q.questions.length,
          0
        );
        return totalQuestions >= 5;
      case 4:
        return true; // Review step - no validation needed
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isStepValid(currentStep)) {
      saveDraft();
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleSaveAsUnpublished = async () => {
    await saveCareer("inactive");
  };

  const handleSaveAndPublish = async () => {
    await saveCareer("active");
  };

  const saveCareer = async (status: string) => {
    if (
      Number(formData.minimumSalary) &&
      Number(formData.maximumSalary) &&
      Number(formData.minimumSalary) > Number(formData.maximumSalary)
    ) {
      errorToast("Minimum salary cannot be greater than maximum salary", 1300);
      return;
    }

    setIsSaving(true);
    const userInfoSlice = {
      image: user.image,
      name: user.name,
      email: user.email,
    };

    const careerData = {
      jobTitle: formData.jobTitle,
      description: formData.description,
      workSetup: formData.workSetup,
      workSetupRemarks: formData.workSetupRemarks,
      questions: formData.questions,
      lastEditedBy: userInfoSlice,
      createdBy: userInfoSlice,
      screeningSetting: formData.screeningSetting,
      orgID,
      requireVideo: formData.requireVideo,
      salaryNegotiable: formData.salaryNegotiable,
      minimumSalary: isNaN(Number(formData.minimumSalary))
        ? null
        : Number(formData.minimumSalary),
      maximumSalary: isNaN(Number(formData.maximumSalary))
        ? null
        : Number(formData.maximumSalary),
      country: formData.country,
      province: formData.province,
      location: formData.city,
      status,
      employmentType: formData.employmentType,
      cvSecretPrompt: formData.cvSecretPrompt,
      preScreeningQuestions: formData.preScreeningQuestions,
      aiSecretPrompt: formData.aiSecretPrompt,
      teamMembers: formData.teamMembers,
    };

    try {
      if (formType === "add") {
        console.log("Attempting to save career with data:", careerData);
        const response = await axios.post("/api/add-career", careerData);
        console.log("Response received:", response);
        if (response.status === 200) {
          localStorage.removeItem(STORAGE_KEY); // Clear draft
          candidateActionToast(
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginLeft: 8,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: "#181D27" }}>
                Career added {status === "active" ? "and published" : ""}
              </span>
            </div>,
            1300,
            <i
              className="la la-check-circle"
              style={{ color: "#039855", fontSize: 32 }}
            ></i>
          );
          setTimeout(() => {
            window.location.href = `/recruiter-dashboard/careers`;
          }, 1300);
        }
      } else {
        const response = await axios.post("/api/update-career", {
          ...careerData,
          _id: career._id,
          updatedAt: Date.now(),
        });
        if (response.status === 200) {
          candidateActionToast(
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginLeft: 8,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: "#181D27" }}>
                Career updated
              </span>
            </div>,
            1300,
            <i
              className="la la-check-circle"
              style={{ color: "#039855", fontSize: 32 }}
            ></i>
          );
          setTimeout(() => {
            window.location.href = `/recruiter-dashboard/careers/manage/${career._id}`;
          }, 1300);
        }
      }
    } catch (error: any) {
      console.error("Full error object:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      console.error("Error config:", error.config);
      errorToast(
        `Failed to ${formType === "add" ? "add" : "update"} career`,
        1300
      );
    } finally {
      setIsSaving(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CareerDetailsStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 2:
        return (
          <CVReviewStep formData={formData} updateFormData={updateFormData} />
        );
      case 3:
        return (
          <AIInterviewStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 4:
        return (
          <ReviewCareerStep
            formData={formData}
            onEditStep={(step) => {
              saveDraft();
              setCurrentStep(step);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="col">
      {/* Header */}
      <div
        style={{
          marginBottom: "35px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 550, color: "#111827" }}>
            {formType === "add" ? "Add new career" : "Edit Career Details"}
          </h1>
          {hasSavedDraft && (
            <span style={{ fontSize: "14px", color: "#6B7280" }}>
              <i
                className="la la-info-circle"
                style={{ marginRight: "4px" }}
              ></i>
              Draft restored from previous session
            </span>
          )}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {formType === "add" && hasSavedDraft && (
            <button
              style={{
                width: "fit-content",
                color: "#DC2626",
                background: "#fff",
                border: "1px solid #FCA5A5",
                padding: "8px 16px",
                borderRadius: "60px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
              onClick={clearDraft}
            >
              Clear Draft
            </button>
          )}
          {formType === "edit" && (
            <button
              style={{
                width: "fit-content",
                color: "#414651",
                background: "#fff",
                border: "1px solid #D5D7DA",
                padding: "8px 16px",
                borderRadius: "60px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
              onClick={() => setShowEditModal?.(false)}
            >
              Cancel
            </button>
          )}
          <button
            disabled={!isStepValid(currentStep) || isSaving}
            style={{
              width: "fit-content",
              color: "#414651",
              background: "#fff",
              border: "1px solid #D5D7DA",
              padding: "8px 16px",
              borderRadius: "60px",
              cursor:
                !isStepValid(currentStep) || isSaving
                  ? "not-allowed"
                  : "pointer",
              whiteSpace: "nowrap",
            }}
            onClick={handleSaveAsUnpublished}
          >
            Save as Unpublished
          </button>
          {currentStep < STEPS.length ? (
            <button
              disabled={!isStepValid(currentStep) || isSaving}
              style={{
                width: "fit-content",
                background:
                  !isStepValid(currentStep) || isSaving ? "#D5D7DA" : "black",
                color: "#fff",
                border: "1px solid #E9EAEB",
                padding: "8px 16px",
                borderRadius: "60px",
                cursor:
                  !isStepValid(currentStep) || isSaving
                    ? "not-allowed"
                    : "pointer",
                whiteSpace: "nowrap",
              }}
              onClick={handleNext}
            >
              Save and Continue
              <i
                className="la la-arrow-right"
                style={{ color: "#fff", fontSize: 20, marginLeft: 8 }}
              ></i>
            </button>
          ) : (
            <button
              disabled={!isStepValid(currentStep) || isSaving}
              style={{
                width: "fit-content",
                background:
                  !isStepValid(currentStep) || isSaving ? "#D5D7DA" : "black",
                color: "#fff",
                border: "1px solid #E9EAEB",
                padding: "8px 16px",
                borderRadius: "60px",
                cursor:
                  !isStepValid(currentStep) || isSaving
                    ? "not-allowed"
                    : "pointer",
                whiteSpace: "nowrap",
              }}
              onClick={handleSaveAndPublish}
            >
              <i
                className="la la-check-circle"
                style={{ color: "#fff", fontSize: 20, marginRight: 8 }}
              ></i>
              Save as Published
            </button>
          )}
        </div>
      </div>

      {/* Step Indicator */}
      <StepIndicator
        steps={STEPS}
        currentStep={currentStep}
        onStepClick={(step) => {
          // Only allow clicking on completed steps or the current step
          // Don't allow skipping ahead if current step is invalid
          if (step <= currentStep || isStepValid(currentStep)) {
            saveDraft();
            setCurrentStep(step);
          }
        }}
      />

      {/* Step Content */}
      <div style={{ marginTop: "24px", marginBottom: "80px" }}>
        {renderStep()}
      </div>

      {isSaving && (
        <FullScreenLoadingAnimation
          title={formType === "add" ? "Saving career..." : "Updating career..."}
          subtext={`Please wait while we are ${
            formType === "add" ? "saving" : "updating"
          } the career`}
        />
      )}
    </div>
  );
}
