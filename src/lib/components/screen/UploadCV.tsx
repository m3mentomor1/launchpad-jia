// TODO (Vince) - Replace alert and windows.confirm
// TODO (Vince) - Check all API call

"use client";

import styles from "@/lib/styles/screen/uploadCV.module.scss";
import { contextProvider } from "@/lib/context/Context";
import { CORE_API_URL } from "@/lib/Utils";
import axios from "axios";
import Markdown from "react-markdown";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function () {
  const pathname = usePathname();
  const fileInputRef = useRef(null);
  const { user, setModalType } = contextProvider();
  const [buildingCV, setBuildingCV] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [digitalCV, setDigitalCV] = useState(null);
  const [editingCV, setEditingCV] = useState(null);
  const [file, setFile] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [interviewData, setInterviewData] = useState(null);
  const [screeningResult, setScreeningResult] = useState(null);
  const [userCV, setUserCV] = useState(null);
  const [preScreeningAnswers, setPreScreeningAnswers] = useState({});
  const cvSections = [
    "Introduction",
    "Current Position",
    "Contact Info",
    "Skills",
    "Experience",
    "Education",
    "Projects",
    "Certifications",
    "Awards",
  ];
  const step = ["Submit CV", "Pre-screening Questions", "Review"];
  console.log("UploadCV step array:", step);

  function checkFile(file) {
    if (file.length > 1) {
      alert("Only one file is allowed.");
      return false;
    }

    if (file[0].size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB.");
      return false;
    }

    if (
      ![
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ].includes(file[0].type)
    ) {
      alert("Only PDF, DOC, DOCX, or TXT files are allowed.");
      return false;
    }

    return file[0];
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e) {
    e.preventDefault();
    handleFile(e.dataTransfer.files);
  }

  function handleEditChange() {
    setEditingCV(null);
  }

  function handleEditCV(section) {
    setEditingCV(section);

    setTimeout(() => {
      const sectionDetails = document.getElementById(section);
      sectionDetails.focus();
    }, 100);
  }

  function handleFile(files) {
    const file = checkFile(files);

    if (file) {
      setFile(file);
      handleFileSubmit(file);
    }
  }

  function handleFileChange(e) {
    const files = e.target.files;

    if (files.length > 0) {
      handleFile(files);
    }
  }

  function handleRemoveFile(e) {
    e.stopPropagation();
    e.target.value = "";

    setFile(null);
    setHasChanges(false);
    setUserCV(null);

    const storedCV = localStorage.getItem("userCV");

    if (storedCV != "null") {
      setDigitalCV(storedCV);
    } else {
      setDigitalCV(null);
    }
  }

  function handleReviewCV() {
    const parsedUserCV = JSON.parse(digitalCV);
    const formattedCV = {};

    cvSections.map((section, index) => {
      formattedCV[section] = parsedUserCV.digitalCV[index].content?.trim();
    });

    setFile(parsedUserCV.fileInfo);
    setUserCV(formattedCV);
  }

  function handleUploadCV() {
    fileInputRef.current.click();
  }

  function handleRedirection(type) {
    setModalType("loading");
    localStorage.removeItem("interviewData");
    localStorage.removeItem("interviews");

    if (type == "dashboard") {
      window.location.href = "/whitecloak/applicant";
    }

    if (type == "interview") {
      // sessionStorage.setItem("interviewRedirection", pathname);
      window.location.href = `/interview/${interviewData.interviewID}`;
    }
  }

  useEffect(() => {
    const interviewData = localStorage.getItem("interviewData");
    const storedCV = localStorage.getItem("userCV");

    if (storedCV && storedCV != "null") {
      setDigitalCV(storedCV);
    }

    if (interviewData) {
      const parsedInterviewData = JSON.parse(interviewData);

      setCurrentStep(step[0]);
      setInterviewData(parsedInterviewData);
      setLoading(false);
    } else {
      Promise.resolve(
        window.confirm("No application is currently being managed.")
      ).then(() => {
        window.location.href = "/whitecloak/applicant";
      });
    }
  }, []);

  useEffect(() => {
    if (loading) {
      setModalType("loading");
    } else {
      setModalType(null);
    }
  }, [loading]);

  useEffect(() => {
    sessionStorage.setItem("hasChanges", JSON.stringify(hasChanges));
  }, [hasChanges]);

  function isAllPreScreeningAnswered() {
    if (
      !interviewData?.preScreeningQuestions ||
      interviewData.preScreeningQuestions.length === 0
    ) {
      return true;
    }

    return interviewData.preScreeningQuestions.every((question: any) => {
      const answer = preScreeningAnswers[question.id];
      if (question.type === "text" || question.type === "dropdown") {
        return answer && answer.trim().length > 0;
      }
      if (question.type === "range") {
        return answer && answer.min && answer.max;
      }
      return false;
    });
  }

  function handlePreScreeningSubmit() {
    // Check if career has pre-screening questions
    if (
      !interviewData?.preScreeningQuestions ||
      interviewData.preScreeningQuestions.length === 0
    ) {
      // No pre-screening questions, skip to CV screening
      performCVScreening();
      return;
    }

    // Validate all questions are answered
    if (!isAllPreScreeningAnswered()) {
      alert("Please answer all pre-screening questions.");
      return;
    }

    // Save pre-screening answers to the interview
    axios({
      method: "POST",
      url: "/api/update-interview",
      data: {
        uid: interviewData._id,
        data: {
          preScreeningAnswers,
          updatedAt: Date.now(),
        },
      },
    })
      .then(() => {
        // Move to CV screening step
        performCVScreening();
      })
      .catch((err) => {
        alert("Error saving pre-screening answers. Please try again.");
        console.log(err);
      });
  }

  async function handleSubmitCV() {
    if (editingCV != null) {
      alert("Please save the changes first.");
      return false;
    }

    if (!userCV) {
      alert("Please upload your CV first.");
      return false;
    }

    const allEmpty = Object.values(userCV).every(
      (value: any) => value?.trim() === ""
    );

    if (allEmpty) {
      alert("No details to be save.");
      return false;
    }

    let parsedDigitalCV = {
      errorRemarks: null,
      digitalCV: null,
    };

    if (digitalCV) {
      parsedDigitalCV = JSON.parse(digitalCV);

      if (parsedDigitalCV.errorRemarks) {
        alert(
          "Please fix the errors in the CV first.\n\n" +
            parsedDigitalCV.errorRemarks
        );
        return false;
      }
    }

    // Save CV and move to pre-screening
    if (hasChanges) {
      const formattedUserCV = cvSections.map((section) => ({
        name: section,
        content: userCV[section]?.trim() || "",
      }));

      parsedDigitalCV.digitalCV = formattedUserCV;

      const data = {
        name: user.name,
        cvData: parsedDigitalCV,
        email: user.email,
        fileInfo: null,
      };

      if (file) {
        data.fileInfo = {
          name: file.name,
          size: file.size,
          type: file.type,
        };
      }
      await axios({
        method: "POST",
        url: `/api/whitecloak/save-cv`,
        data,
      })
        .then(async () => {
          setHasChanges(false);
          localStorage.setItem("userCV", JSON.stringify(parsedDigitalCV));
          // Move to pre-screening step after CV is saved
          setCurrentStep(step[1]);
        })
        .catch((err) => {
          alert("Error saving CV. Please try again.");
          console.log(err);
        });
    } else {
      // If no changes, just move to pre-screening
      setCurrentStep(step[1]);
    }
  }

  async function performCVScreening() {
    // Set to screening state
    setCurrentStep("CV Screening");
    setHasChanges(false);

    await axios({
      url: "/api/whitecloak/screen-cv",
      method: "POST",
      data: {
        interviewID: interviewData.interviewID,
        userEmail: interviewData.email,
      },
    })
      .then(async (res) => {
        const result = await res.data;
        if (result.error) {
          alert(result.message);
          setCurrentStep(step[1]);
        } else {
          setScreeningResult(result.status);
          // Move to final "Review" step (index 2)
          setCurrentStep(step[2]);
        }
      })
      .catch((err) => {
        alert("Error screening CV. Please try again.");
        setCurrentStep(step[1]);
        console.log(err);
      });
  }

  async function handleFileSubmit(file) {
    setBuildingCV(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fName", file.name);
    formData.append("userEmail", user.email);

    await axios({
      method: "POST",
      url: `${CORE_API_URL}/upload-cv`,
      data: formData,
    })
      .then(async (res) => {
        await axios({
          method: "POST",
          url: `/api/whitecloak/digitalize-cv`,
          data: { chunks: res.data.cvChunks },
        })
          .then(async (res) => {
            const result = await res.data.result;
            const parsedUserCV = JSON.parse(result);
            const formattedCV = {};

            cvSections.map((section, index) => {
              formattedCV[section] =
                parsedUserCV.digitalCV[index].content?.trim();
            });

            setDigitalCV(result);
            setHasChanges(true);
            setUserCV(formattedCV);
          })
          .catch((err) => {
            alert("Error building CV. Please try again.");
            console.log(err);
          })
          .finally(() => {
            setBuildingCV(false);
          });
      })
      .catch((err) => {
        alert("Error building CV. Please try again.");
        console.log(err);
      })
      .finally(() => {
        setBuildingCV(false);
      });
  }

  return (
    <>
      <div className={styles.bg} />

      {interviewData && !loading && (
        <div className={styles.uploadCVContainer}>
          <div className={styles.uploadCVHeader}>
            <span className={styles.tag}>
              <img alt="zap" src="/icons/zap.svg" />
              You're applying for
            </span>
            <span className={styles.title}>{interviewData.jobTitle}</span>
            {interviewData.location && (
              <span className={styles.location}>
                <img alt="map-pin" src="/icons/map-pin.svg" />
                {interviewData.location}
                {interviewData.workSetup && (
                  <>
                    <hr /> {interviewData.workSetup}
                  </>
                )}
              </span>
            )}
          </div>

          <div className={styles.stepContainer}>
            <div className={styles.step}>
              {step.map((_, index) => (
                <div className={styles.stepBar} key={index}>
                  <img
                    alt="step"
                    src={`/icons/${
                      step.indexOf(currentStep) == index
                        ? "in-progress"
                        : step.indexOf(currentStep) > index
                        ? "completed"
                        : "pending"
                    }.svg`}
                  />
                  {index < step.length - 1 && (
                    <hr
                      className={`${
                        step.indexOf(currentStep) > index ? styles.done : ""
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className={styles.step}>
              {step.map((item, index) => (
                <span
                  className={`${styles.stepDetails} ${
                    step.indexOf(currentStep) < index ? styles.pending : ""
                  }`}
                  key={index}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {currentStep == step[0] &&
            (userCV || buildingCV ? (
              <>
                {file ? (
                  <div className={styles.fileContainer}>
                    <img alt="completed" src="/icons/completed.svg" />
                    <span className={styles.title}>{file.name}</span>
                    {buildingCV ? (
                      <span className={styles.description}>
                        Building your profile...
                      </span>
                    ) : (
                      <img
                        alt="x"
                        className={styles.xIcon}
                        onClick={handleRemoveFile}
                        src="/icons/xV2.svg"
                      />
                    )}
                  </div>
                ) : (
                  <div
                    className={styles.fileContainer}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <img alt="upload" src="/icons/upload.svg" />
                    <span className={styles.title}>
                      Click to upload or drag and drop
                    </span>
                    <button onClick={handleUploadCV}>Upload CV</button>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      style={{ display: "none" }}
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </div>
                )}

                {!buildingCV && (
                  <>
                    <div className={styles.cvDetailsContainer}>
                      {cvSections.map((section, index) => (
                        <div className={styles.cvDetailsCard} key={index}>
                          <span
                            className={`${styles.sectionTitle} ${
                              editingCV == section ? styles.forEditing : ""
                            }`}
                          >
                            {section}

                            {editingCV == section ? (
                              <button onClick={handleEditChange}>
                                Save Changes
                              </button>
                            ) : (
                              <img
                                alt="square-pen"
                                src="/icons/square-pen.svg"
                                onClick={() => handleEditCV(section)}
                              />
                            )}
                          </span>

                          <hr />

                          {editingCV == section ? (
                            <>
                              <textarea
                                id={section}
                                value={userCV ? userCV[section] : ""}
                                placeholder="Upload your CV to auto-fill this section."
                                onBlur={(e) => {
                                  e.target.placeholder =
                                    "Upload your CV to auto-fill this section.";
                                }}
                                onClick={(e) => {
                                  (e.target as HTMLInputElement).placeholder =
                                    "";
                                }}
                                onChange={(e) => {
                                  setUserCV({
                                    ...userCV,
                                    [section]: e.target.value,
                                  });
                                  setHasChanges(true);
                                }}
                              />
                            </>
                          ) : (
                            <span
                              className={`${styles.sectionDetails} ${
                                userCV && userCV[section]?.trim()
                                  ? styles.withDetails
                                  : ""
                              }`}
                            >
                              <Markdown>
                                {userCV && userCV[section]?.trim()
                                  ? userCV[section]?.trim()
                                  : "Upload your CV to auto-fill this section."}
                              </Markdown>
                            </span>
                          )}
                        </div>
                      ))}

                      <button onClick={handleSubmitCV}>Continue</button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className={styles.cvManageContainer}>
                <div
                  className={`${styles.cvContainer} ${styles.forUpload}`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <img alt="upload" src={`/icons/upload.svg`} />
                  <button onClick={handleUploadCV}>Upload CV</button>
                  <span>
                    Choose or drag and drop a file here. Our AI tools will
                    automatically pre-fill your CV and also check how well it
                    matches the role.
                  </span>
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />

                <div className={`${styles.cvContainer} ${styles.forReview}`}>
                  <img alt="scan-search" src={`/icons/scan-search.svg`} />
                  <button
                    className={`${digitalCV ? "" : styles.disabled}`}
                    disabled={!digitalCV}
                    onClick={handleReviewCV}
                  >
                    Review Current CV
                  </button>
                  <span>
                    Already uploaded a CV? Take a moment to review your details
                    before we proceed.
                  </span>
                </div>
              </div>
            ))}

          {currentStep == step[1] &&
            interviewData?.preScreeningQuestions &&
            interviewData.preScreeningQuestions.length > 0 && (
              <div className={styles.cvDetailsContainer}>
                <div
                  style={{
                    marginBottom: "24px",
                    textAlign: "center",
                  }}
                >
                  <h2 style={{ fontSize: "24px", marginBottom: "8px" }}>
                    Quick Pre-screening
                  </h2>
                  <p style={{ color: "#6B7280", fontSize: "14px" }}>
                    Just a few short questions to help your recruiters assess
                    you faster. Takes less than a minute.
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  {interviewData.preScreeningQuestions.map(
                    (question: any, index: number) => (
                      <div
                        key={question.id}
                        style={{
                          padding: "20px",
                          backgroundColor: "#F9FAFB",
                          borderRadius: "12px",
                          border: "1px solid #E9EAEB",
                        }}
                      >
                        <label
                          style={{
                            display: "block",
                            marginBottom: "12px",
                            fontWeight: 600,
                            color: "#181D27",
                            fontSize: "16px",
                          }}
                        >
                          {question.question}
                          <span style={{ color: "#EF4444" }}> *</span>
                        </label>

                        {question.type === "text" && (
                          <textarea
                            placeholder="Enter your answer..."
                            value={preScreeningAnswers[question.id] || ""}
                            onChange={(e) =>
                              setPreScreeningAnswers((prev) => ({
                                ...prev,
                                [question.id]: e.target.value,
                              }))
                            }
                            style={{
                              width: "100%",
                              minHeight: "100px",
                              padding: "12px",
                              borderRadius: "8px",
                              border: "1px solid #D5D7DA",
                              fontSize: "14px",
                              resize: "vertical",
                              fontFamily: "inherit",
                            }}
                          />
                        )}

                        {question.type === "dropdown" && (
                          <select
                            value={preScreeningAnswers[question.id] || ""}
                            onChange={(e) =>
                              setPreScreeningAnswers((prev) => ({
                                ...prev,
                                [question.id]: e.target.value,
                              }))
                            }
                            style={{
                              width: "100%",
                              padding: "12px",
                              borderRadius: "8px",
                              border: "1px solid #D5D7DA",
                              fontSize: "14px",
                              backgroundColor: "#fff",
                            }}
                          >
                            <option value="">Select an option...</option>
                            {question.options?.map(
                              (option: string, optIdx: number) => (
                                <option key={optIdx} value={option}>
                                  {option}
                                </option>
                              )
                            )}
                          </select>
                        )}

                        {question.type === "range" && (
                          <div
                            style={{
                              display: "flex",
                              gap: "16px",
                              alignItems: "center",
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <label
                                style={{
                                  display: "block",
                                  marginBottom: "6px",
                                  fontSize: "12px",
                                  color: "#6B7280",
                                  fontWeight: 500,
                                }}
                              >
                                Minimum Salary
                              </label>
                              <div style={{ position: "relative" }}>
                                <span
                                  style={{
                                    position: "absolute",
                                    left: "12px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#6B7280",
                                    fontSize: "14px",
                                  }}
                                >
                                  ₱
                                </span>
                                <input
                                  type="number"
                                  placeholder="0"
                                  value={
                                    preScreeningAnswers[question.id]?.min || ""
                                  }
                                  onChange={(e) =>
                                    setPreScreeningAnswers((prev) => ({
                                      ...prev,
                                      [question.id]: {
                                        ...prev[question.id],
                                        min: e.target.value,
                                      },
                                    }))
                                  }
                                  style={{
                                    width: "100%",
                                    padding: "12px 12px 12px 28px",
                                    borderRadius: "8px",
                                    border: "1px solid #D5D7DA",
                                    fontSize: "14px",
                                  }}
                                />
                              </div>
                            </div>
                            <span
                              style={{
                                color: "#6B7280",
                                paddingTop: "20px",
                              }}
                            >
                              -
                            </span>
                            <div style={{ flex: 1 }}>
                              <label
                                style={{
                                  display: "block",
                                  marginBottom: "6px",
                                  fontSize: "12px",
                                  color: "#6B7280",
                                  fontWeight: 500,
                                }}
                              >
                                Maximum Salary
                              </label>
                              <div style={{ position: "relative" }}>
                                <span
                                  style={{
                                    position: "absolute",
                                    left: "12px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#6B7280",
                                    fontSize: "14px",
                                  }}
                                >
                                  ₱
                                </span>
                                <input
                                  type="number"
                                  placeholder="0"
                                  value={
                                    preScreeningAnswers[question.id]?.max || ""
                                  }
                                  onChange={(e) =>
                                    setPreScreeningAnswers((prev) => ({
                                      ...prev,
                                      [question.id]: {
                                        ...prev[question.id],
                                        max: e.target.value,
                                      },
                                    }))
                                  }
                                  style={{
                                    width: "100%",
                                    padding: "12px 12px 12px 28px",
                                    borderRadius: "8px",
                                    border: "1px solid #D5D7DA",
                                    fontSize: "14px",
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>

                <button
                  onClick={handlePreScreeningSubmit}
                  disabled={!isAllPreScreeningAnswered()}
                  style={{
                    marginTop: "24px",
                    background: isAllPreScreeningAnswered()
                      ? "#181D27"
                      : "#D5D7DA",
                    color: isAllPreScreeningAnswered() ? "white" : "#9CA3AF",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "20px",
                    cursor: isAllPreScreeningAnswered()
                      ? "pointer"
                      : "not-allowed",
                    fontSize: "14px",
                    fontWeight: 500,
                    opacity: isAllPreScreeningAnswered() ? 1 : 0.6,
                    transition: "all 0.2s ease",
                  }}
                >
                  Continue
                </button>
              </div>
            )}

          {currentStep == "CV Screening" && (
            <div className={styles.cvScreeningContainer}>
              <img alt="cv-screening" src="/gifs/cv-screening.gif" />
              <span className={styles.title}>Sit tight!</span>

              <span className={`mobileView ${styles.description}`}>
                Our smart reviewer is checking your qualifications. We'll let
                you know what's next in just a moment.
              </span>

              <span className={`webView ${styles.description}`}>
                Our smart reviewer is checking your qualifications.
              </span>
              <span className={`webView ${styles.description}`}>
                We'll let you know what's next in just a moment.
              </span>
            </div>
          )}

          {currentStep == step[2] && (
            <div
              className={`${styles.cvResultContainer} ${
                screeningResult == "For AI Interview"
                  ? styles.forInterview
                  : styles.forReview
              }`}
            >
              {screeningResult == "For AI Interview" ? (
                <>
                  <img alt="party-popper" src="/icons/party-popper.svg" />
                  <span className={`${styles.title} ${styles.withMargin}`}>
                    Hooray! You’re a strong fit for this role.
                  </span>
                  <span className={styles.description}>
                    Our AI reviewer thinks you might be a great match.
                  </span>
                  <span className={`${styles.description} ${styles.bold}`}>
                    Ready to take the next step?
                  </span>
                  <span className={styles.description}>
                    You may start your AI interview now.
                  </span>
                  <div className={styles.buttonContainer}>
                    <button onClick={() => handleRedirection("interview")}>
                      Start AI Interview
                    </button>
                    <button
                      className={styles.secondaryBtn}
                      onClick={() => handleRedirection("dashboard")}
                    >
                      View Dashboard
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <img alt="user-check" src="/icons/user-check.svg" />
                  <span className={styles.title}>Your CV is now being</span>
                  <span className={styles.title}>
                    reviewed by the hiring team.
                  </span>
                  <span className={styles.description}>
                    We’ll be in touch soon with updates about your application.
                  </span>
                  <div className={styles.buttonContainer}>
                    <button onClick={() => handleRedirection("dashboard")}>
                      View Dashboard
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
