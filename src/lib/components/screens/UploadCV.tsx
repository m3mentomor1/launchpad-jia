// TODO (Job Portal) - Check API

"use client";

import Loader from "@/lib/components/commonV2/Loader";
import styles from "@/lib/styles/screens/uploadCV.module.scss";
import { useAppContext } from "@/lib/context/ContextV2";
import { assetConstants, pathConstants } from "@/lib/utils/constantsV2";
import { checkFile } from "@/lib/utils/helpersV2";
import { CORE_API_URL } from "@/lib/Utils";
import axios from "axios";
import Markdown from "react-markdown";
import { useEffect, useRef, useState } from "react";

export default function () {
  const fileInputRef = useRef(null);
  const { user, setModalType } = useAppContext();
  const [buildingCV, setBuildingCV] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [digitalCV, setDigitalCV] = useState(null);
  const [editingCV, setEditingCV] = useState(null);
  const [file, setFile] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState(null);
  const [screeningResult, setScreeningResult] = useState(null);
  const [userCV, setUserCV] = useState(null);
  const [preScreeningAnswers, setPreScreeningAnswers] = useState({});
  const [openDropdownId, setOpenDropdownId] = useState(null);
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
  const stepStatus = ["Completed", "Pending", "In Progress"];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openDropdownId !== null) {
        const dropdowns = document.querySelectorAll(
          `.${styles.customDropdown}`
        );
        let clickedInside = false;

        dropdowns.forEach((dropdown) => {
          if (dropdown.contains(e.target)) {
            clickedInside = true;
          }
        });

        if (!clickedInside) {
          setOpenDropdownId(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdownId]);

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e) {
    e.preventDefault();
    handleFile(e.dataTransfer.files);
  }

  function handleEditCV(section) {
    setEditingCV(section);

    if (section != null) {
      setTimeout(() => {
        const sectionDetails = document.getElementById(section);

        if (sectionDetails) {
          sectionDetails.focus();
        }
      }, 100);
    }
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

  function handleModal() {
    setModalType("jobDescription");
  }

  function handleRedirection(type) {
    if (type == "dashboard") {
      window.location.href = pathConstants.dashboard;
    }

    if (type == "interview") {
      sessionStorage.setItem("interviewRedirection", pathConstants.dashboard);
      window.location.href = `/interview/${interview.interviewID}`;
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

    cvSections.forEach((section, index) => {
      formattedCV[section] = parsedUserCV.digitalCV[index].content.trim() || "";
    });

    setFile(parsedUserCV.fileInfo);
    setUserCV(formattedCV);
  }

  function handleUploadCV() {
    fileInputRef.current.click();
  }

  function processState(index, isAdvance = false) {
    const currentStepIndex = step.indexOf(currentStep);

    if (currentStepIndex == index) {
      if (index == stepStatus.length - 1) {
        return stepStatus[0];
      }

      return isAdvance || userCV || buildingCV ? stepStatus[2] : stepStatus[1];
    }

    if (currentStepIndex > index) {
      return stepStatus[0];
    }

    return stepStatus[1];
  }

  useEffect(() => {
    const storedSelectedCareer = sessionStorage.getItem("selectedCareer");
    const storedCV = localStorage.getItem("userCV");

    if (storedCV && storedCV != "null") {
      setDigitalCV(storedCV);
    }

    if (storedSelectedCareer) {
      const parseStoredSelectedCareer = JSON.parse(storedSelectedCareer);
      fetchInterview(parseStoredSelectedCareer.id);
    } else {
      alert("No application is currently being managed.");
      window.location.href = pathConstants.dashboard;
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("hasChanges", JSON.stringify(hasChanges));
  }, [hasChanges]);

  function fetchInterview(interviewID) {
    axios({
      method: "POST",
      url: "/api/job-portal/fetch-interviews",
      data: { email: user.email, interviewID },
    })
      .then((res) => {
        const result = res.data;

        if (result.error) {
          alert(result.error);
          window.location.href = pathConstants.dashboard;
        } else {
          if (result[0].cvStatus) {
            alert("This application has already been processed.");
            window.location.href = pathConstants.dashboard;
          } else {
            setCurrentStep(step[0]);
            setInterview(result[0]);
            setLoading(false);
          }
        }
      })
      .catch((err) => {
        alert("Error fetching existing applied jobs.");
        window.location.href = pathConstants.dashboard;
        console.log(err);
      });
  }

  function isAllPreScreeningAnswered() {
    if (
      !interview?.preScreeningQuestions ||
      interview.preScreeningQuestions.length === 0
    ) {
      return true;
    }

    return interview.preScreeningQuestions.every((question: any) => {
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
      !interview?.preScreeningQuestions ||
      interview.preScreeningQuestions.length === 0
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
        uid: interview._id,
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

  function handleSubmitCV() {
    if (editingCV != null) {
      alert("Please save the changes first.");
      return false;
    }

    if (!userCV) {
      alert("Please upload your CV first.");
      return false;
    }

    const allEmpty = Object.values(userCV).every(
      (value: any) => value.trim() == ""
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

      axios({
        method: "POST",
        url: `/api/whitecloak/save-cv`,
        data,
      })
        .then(() => {
          localStorage.setItem(
            "userCV",
            JSON.stringify({ ...data, ...data.cvData })
          );
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

  function performCVScreening() {
    // Set to screening state
    setCurrentStep("CV Screening");
    setHasChanges(false);

    axios({
      url: "/api/whitecloak/screen-cv",
      method: "POST",
      data: {
        interviewID: interview.interviewID,
        userEmail: user.email,
      },
    })
      .then((res) => {
        const result = res.data;

        if (result.error) {
          alert(result.message);
          setCurrentStep(step[1]);
        } else {
          setCurrentStep(step[2]);
          setScreeningResult(result);
        }
      })
      .catch((err) => {
        alert("Error screening CV. Please try again.");
        setCurrentStep(step[1]);
        console.log(err);
      });
  }

  function handleFileSubmit(file) {
    setBuildingCV(true);
    setHasChanges(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fName", file.name);
    formData.append("userEmail", user.email);

    axios({
      method: "POST",
      url: `${CORE_API_URL}/upload-cv`,
      data: formData,
    })
      .then((res) => {
        axios({
          method: "POST",
          url: `/api/whitecloak/digitalize-cv`,
          data: { chunks: res.data.cvChunks },
        })
          .then((res) => {
            const result = res.data.result;
            const parsedUserCV = JSON.parse(result);
            const formattedCV = {};

            cvSections.forEach((section, index) => {
              formattedCV[section] =
                parsedUserCV.digitalCV[index].content.trim();
            });

            setDigitalCV(result);
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
        setBuildingCV(false);
        console.log(err);
      });
  }

  return (
    <>
      {loading && <Loader loaderData={""} loaderType={""} />}

      {interview && (
        <div className={styles.uploadCVContainer}>
          <div className={styles.uploadCVHeader}>
            {interview.organization && interview.organization.image && (
              <img alt="" src={interview.organization.image} />
            )}
            <div className={styles.textContainer}>
              <span className={styles.tag}>You're applying for</span>
              <span className={styles.title}>{interview.jobTitle}</span>
              {interview.organization && interview.organization.name && (
                <span className={styles.name}>
                  {interview.organization.name}
                </span>
              )}
              <span className={styles.description} onClick={handleModal}>
                View job description
              </span>
            </div>
          </div>

          <div className={styles.stepContainer}>
            <div className={styles.step}>
              {step.map((_, index) => (
                <div className={styles.stepBar} key={index}>
                  <img
                    alt=""
                    src={
                      assetConstants[
                        processState(index, true)
                          .toLowerCase()
                          .replace(" ", "_")
                      ]
                    }
                  />
                  {index < step.length - 1 && (
                    <hr
                      className={
                        styles[
                          processState(index).toLowerCase().replace(" ", "_")
                        ]
                      }
                    />
                  )}
                </div>
              ))}
            </div>

            <div className={styles.step}>
              {step.map((item, index) => (
                <span
                  className={`${styles.stepDetails} ${
                    styles[
                      processState(index, true).toLowerCase().replace(" ", "_")
                    ]
                  }`}
                  key={index}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {currentStep == step[0] && (
            <>
              {!buildingCV && !userCV && !file && (
                <div className={styles.cvManageContainer}>
                  <div
                    className={styles.cvContainer}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <img alt="" src={assetConstants.uploadV2} />
                    <button onClick={handleUploadCV}>Upload CV</button>
                    <span>
                      Choose or drag and drop a file here. Our AI tools will
                      automatically pre-fill your CV and also check how well it
                      matches the role.
                    </span>
                    <button
                      onClick={() => setCurrentStep(step[1])}
                      style={{
                        marginTop: "16px",
                        background: "transparent",
                        color: "#6B7280",
                        border: "1px solid #D5D7DA",
                        padding: "10px 20px",
                        borderRadius: "20px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: 500,
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#F9FAFB";
                        e.currentTarget.style.borderColor = "#9CA3AF";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.borderColor = "#D5D7DA";
                      }}
                    >
                      Skip to Next Step
                    </button>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />

                  <div className={styles.cvContainer}>
                    <img alt="" src={assetConstants.review} />
                    <button
                      className={`${digitalCV ? "" : "disabled"}`}
                      disabled={!digitalCV}
                      onClick={handleReviewCV}
                    >
                      Review Current CV
                    </button>
                    <span>
                      Already uploaded a CV? Take a moment to review your
                      details before we proceed.
                    </span>
                  </div>
                </div>
              )}

              {buildingCV && file && (
                <div className={styles.cvDetailsContainer}>
                  <div className={styles.gradient}>
                    <div className={styles.cvDetailsCard}>
                      <span className={styles.sectionTitle}>
                        <img alt="" src={assetConstants.account} />
                        Submit CV
                      </span>
                      <div className={styles.detailsContainer}>
                        <span className={styles.fileTitle}>
                          <img alt="" src={assetConstants.completed} />
                          {file.name}
                        </span>
                        <div className={styles.loadingContainer}>
                          <img alt="" src={assetConstants.loading} />
                          <div className={styles.textContainer}>
                            <span className={styles.title}>
                              Extracting information from your CV...
                            </span>
                            <span className={styles.description}>
                              Jia is building your profile...
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!buildingCV && userCV && (
                <div className={styles.cvDetailsContainer}>
                  <div className={styles.gradient}>
                    <div className={styles.cvDetailsCard}>
                      <span className={styles.sectionTitle}>
                        <img alt="" src={assetConstants.account} />
                        Submit CV
                        <div className={styles.editIcon}>
                          <img
                            alt=""
                            src={
                              file ? assetConstants.xV2 : assetConstants.save
                            }
                            onClick={file ? handleRemoveFile : handleUploadCV}
                            onContextMenu={(e) => e.preventDefault()}
                          />
                        </div>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          style={{ display: "none" }}
                          ref={fileInputRef}
                          onChange={handleFileChange}
                        />
                      </span>

                      <div className={styles.detailsContainer}>
                        {file ? (
                          <span className={styles.fileTitle}>
                            <img alt="" src={assetConstants.completed} />
                            {file.name}
                          </span>
                        ) : (
                          <span className={styles.fileTitle}>
                            <img alt="" src={assetConstants.fileV2} />
                            You can also upload your CV and let our AI
                            automatically fill in your profile information.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {cvSections.map((section, index) => (
                    <div key={index} className={styles.gradient}>
                      <div className={styles.cvDetailsCard}>
                        <span className={styles.sectionTitle}>
                          {section}

                          <div className={styles.editIcon}>
                            <img
                              alt=""
                              src={
                                editingCV == section
                                  ? assetConstants.save
                                  : assetConstants.edit
                              }
                              onClick={() =>
                                handleEditCV(
                                  editingCV == section ? null : section
                                )
                              }
                              onContextMenu={(e) => e.preventDefault()}
                            />
                          </div>
                        </span>

                        <div className={styles.detailsContainer}>
                          {editingCV == section ? (
                            <textarea
                              id={section}
                              placeholder="Upload your CV to auto-fill this section."
                              value={
                                userCV && userCV[section] ? userCV[section] : ""
                              }
                              onBlur={(e) => {
                                e.target.placeholder =
                                  "Upload your CV to auto-fill this section.";
                              }}
                              onChange={(e) => {
                                setUserCV({
                                  ...userCV,
                                  [section]: e.target.value,
                                });
                                setHasChanges(true);
                              }}
                              onFocus={(e) => {
                                e.target.placeholder = "";
                              }}
                            />
                          ) : (
                            <span
                              className={`${styles.sectionDetails} ${
                                userCV &&
                                userCV[section] &&
                                userCV[section].trim()
                                  ? styles.withDetails
                                  : ""
                              }`}
                            >
                              <Markdown>
                                {userCV &&
                                userCV[section] &&
                                userCV[section].trim()
                                  ? userCV[section].trim()
                                  : "Upload your CV to auto-fill this section."}
                              </Markdown>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={handleSubmitCV}>Submit CV</button>
                </div>
              )}
            </>
          )}

          {currentStep == step[1] &&
            interview?.preScreeningQuestions &&
            interview.preScreeningQuestions.length > 0 && (
              <div className={styles.cvDetailsContainer}>
                <div
                  style={{
                    marginBottom: "24px",
                    textAlign: "left",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "24px",
                      marginBottom: "8px",
                      color: "#181D27",
                      fontWeight: 600,
                    }}
                  >
                    Quick Pre-screening
                  </h2>
                  <p style={{ color: "#6B7280", fontSize: "14px" }}>
                    Just a few short questions to help your recruiters assess
                    you faster. Takes less than a minute.
                  </p>
                </div>

                {interview.preScreeningQuestions.map(
                  (question: any, index: number) => (
                    <div key={question.id} className={styles.gradient}>
                      <div className={styles.cvDetailsCard}>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "0",
                            fontWeight: 600,
                            color: "#181D27",
                            fontSize: "16px",
                          }}
                        >
                          {question.question}
                        </label>

                        <div className={styles.detailsContainer}>
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
                                backgroundColor: "#fff",
                              }}
                            />
                          )}

                          {question.type === "dropdown" && (
                            <div className={styles.customDropdown}>
                              <button
                                type="button"
                                className={`${styles.dropdownButton} ${
                                  openDropdownId === question.id
                                    ? styles.open
                                    : ""
                                } ${
                                  !preScreeningAnswers[question.id]
                                    ? styles.placeholder
                                    : ""
                                }`}
                                onClick={() =>
                                  setOpenDropdownId(
                                    openDropdownId === question.id
                                      ? null
                                      : question.id
                                  )
                                }
                              >
                                <span>
                                  {preScreeningAnswers[question.id] ||
                                    "Select an option..."}
                                </span>
                                <svg
                                  className={`${styles.arrow} ${
                                    openDropdownId === question.id
                                      ? styles.open
                                      : ""
                                  }`}
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5 7.5L10 12.5L15 7.5"
                                    stroke="#181D27"
                                    strokeWidth="1.67"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                              {openDropdownId === question.id && (
                                <div className={styles.dropdownMenu}>
                                  {question.options?.map(
                                    (option: string, optIdx: number) => (
                                      <div
                                        key={optIdx}
                                        className={styles.dropdownOption}
                                        onClick={() => {
                                          setPreScreeningAnswers((prev) => ({
                                            ...prev,
                                            [question.id]: option,
                                          }));
                                          setOpenDropdownId(null);
                                        }}
                                      >
                                        {option}
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {question.type === "range" && (
                            <div
                              style={{
                                display: "flex",
                                gap: "16px",
                                alignItems: "flex-start",
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
                                      preScreeningAnswers[question.id]?.min ||
                                      ""
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
                                      backgroundColor: "#fff",
                                    }}
                                  />
                                </div>
                              </div>
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
                                      preScreeningAnswers[question.id]?.max ||
                                      ""
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
                                      backgroundColor: "#fff",
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                )}

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
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  Continue
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.16669 10H15.8334M15.8334 10L10 4.16669M15.8334 10L10 15.8334"
                      stroke="currentColor"
                      strokeWidth="1.67"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            )}

          {currentStep == "CV Screening" && (
            <div className={styles.cvScreeningContainer}>
              <img alt="" src={assetConstants.loading} />
              <span className={styles.title}>Sit tight!</span>
              <span className={styles.description}>
                Our smart reviewer is checking your qualifications.
              </span>
              <span className={styles.description}>
                We'll let you know what's next in just a moment.
              </span>
            </div>
          )}

          {currentStep == step[2] && screeningResult && (
            <div className={styles.cvResultContainer}>
              {screeningResult.applicationStatus == "Dropped" ? (
                <>
                  <img alt="" src={assetConstants.userRejected} />
                  <span className={styles.title}>
                    This role may not be the best match.
                  </span>
                  <span className={styles.description}>
                    Based on your CV, it looks like this position might not be
                    the right fit at the moment.
                  </span>
                  <br />
                  <span className={styles.description}>
                    Review your screening results and see recommended next
                    steps.
                  </span>
                  <div className={styles.buttonContainer}>
                    <button onClick={() => handleRedirection("dashboard")}>
                      View Dashboard
                    </button>
                  </div>
                </>
              ) : screeningResult.status == "For AI Interview" ? (
                <>
                  <img alt="" src={assetConstants.checkV3} />
                  <span className={styles.title}>
                    Hooray! You’re a strong fit for this role.
                  </span>
                  <span className={styles.description}>
                    Jia thinks you might be a great match.
                  </span>
                  <br />
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
                      className="secondaryBtn"
                      onClick={() => handleRedirection("dashboard")}
                    >
                      View Dashboard
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <img alt="" src={assetConstants.userCheck} />
                  <span className={styles.title}>
                    Your CV is now being reviewed by the hiring team.
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
