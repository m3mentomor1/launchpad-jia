"use client";

import { useEffect, useState } from "react";
import RichTextEditor from "../RichTextEditor";
import CustomDropdown from "../CustomDropdown";
import philippineCitiesAndProvinces from "../../../../../public/philippines-locations.json";
import { CareerFormData } from "../SegmentedCareerForm";
import { useAppContext } from "@/lib/context/AppContext";
import DeleteMemberModal from "./DeleteMemberModal";

const workSetupOptions = [
  { name: "Fully Remote" },
  { name: "Onsite" },
  { name: "Hybrid" },
];

const employmentTypeOptions = [{ name: "Full-Time" }, { name: "Part-Time" }];

interface CareerDetailsStepProps {
  formData: CareerFormData;
  updateFormData: (updates: Partial<CareerFormData>) => void;
  showValidationErrors?: boolean;
  validationErrors?: { [key: string]: string };
}

export default function CareerDetailsStep({
  formData,
  updateFormData,
  showValidationErrors = false,
  validationErrors = {},
}: CareerDetailsStepProps) {
  const { user } = useAppContext();
  const [provinceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState("Job Owner");
  const [showCurrentUser, setShowCurrentUser] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [organizationMembers, setOrganizationMembers] = useState([]);

  useEffect(() => {
    setProvinceList(philippineCitiesAndProvinces.provinces);
    const defaultProvince = philippineCitiesAndProvinces.provinces[0];

    if (!formData.province) {
      updateFormData({ province: defaultProvince.name });
    }

    const cities = philippineCitiesAndProvinces.cities.filter(
      (city) =>
        city.province ===
        (formData.province
          ? philippineCitiesAndProvinces.provinces.find(
              (p) => p.name === formData.province
            )?.key
          : defaultProvince.key)
    );
    setCityList(cities);

    if (!formData.city && cities.length > 0) {
      updateFormData({ city: cities[0].name });
    }

    // Fetch organization members
    if (user?.orgID) {
      fetch("/api/fetch-members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgID: user.orgID }),
      })
        .then((res) => res.json())
        .then((members) => {
          setOrganizationMembers(members);
        })
        .catch((error) => {
          console.error("Error fetching members:", error);
        });
    }
  }, []);

  useEffect(() => {
    if (formData.province) {
      const provinceObj = provinceList.find(
        (p) => p.name === formData.province
      );
      if (provinceObj) {
        const cities = philippineCitiesAndProvinces.cities.filter(
          (city) => city.province === provinceObj.key
        );
        setCityList(cities);
        if (
          cities.length > 0 &&
          !cities.find((c) => c.name === formData.city)
        ) {
          updateFormData({ city: cities[0].name });
        }
      }
    }
  }, [formData.province, provinceList]);

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
            gap: 8,
          }}
        >
          {/* Career Information Card */}
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
                  1. Career Information
                </span>
              </div>
              <div className="layered-card-content">
                <span
                  style={{
                    fontSize: 14,
                    color: "#181D27",
                    fontWeight: 600,
                    marginBottom: 4,
                  }}
                >
                  Basic Information
                </span>
                <span>Job Title</span>
                <input
                  value={formData.jobTitle}
                  className={`form-control ${
                    showValidationErrors && validationErrors.jobTitle
                      ? "error-border"
                      : ""
                  }`}
                  placeholder="Enter job title"
                  onChange={(e) =>
                    updateFormData({ jobTitle: e.target.value || "" })
                  }
                />
                {showValidationErrors && validationErrors.jobTitle && (
                  <span
                    style={{
                      fontSize: 12,
                      color: "#DC2626",
                      marginTop: 4,
                      display: "block",
                    }}
                  >
                    {validationErrors.jobTitle}
                  </span>
                )}

                <span
                  style={{
                    fontSize: 14,
                    color: "#181D27",
                    fontWeight: 600,
                    marginTop: 16,
                    marginBottom: 4,
                  }}
                >
                  Work Setting
                </span>
                <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <span>Employment Type</span>
                    <CustomDropdown
                      onSelectSetting={(employmentType) =>
                        updateFormData({ employmentType })
                      }
                      screeningSetting={formData.employmentType}
                      settingList={employmentTypeOptions}
                      placeholder="Choose employment type"
                      hasError={
                        showValidationErrors &&
                        !!validationErrors.employmentType
                      }
                    />
                    {showValidationErrors &&
                      validationErrors.employmentType && (
                        <span
                          style={{
                            fontSize: 12,
                            color: "#DC2626",
                            marginTop: 4,
                            display: "block",
                          }}
                        >
                          {validationErrors.employmentType}
                        </span>
                      )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span>Arrangement</span>
                    <CustomDropdown
                      onSelectSetting={(workSetup) =>
                        updateFormData({ workSetup })
                      }
                      screeningSetting={formData.workSetup}
                      settingList={workSetupOptions}
                      placeholder="Choose work arrangement"
                      hasError={
                        showValidationErrors && !!validationErrors.workSetup
                      }
                    />
                    {showValidationErrors && validationErrors.workSetup && (
                      <span
                        style={{
                          fontSize: 12,
                          color: "#DC2626",
                          marginTop: 4,
                          display: "block",
                        }}
                      >
                        {validationErrors.workSetup}
                      </span>
                    )}
                  </div>
                </div>

                <span
                  style={{
                    fontSize: 14,
                    color: "#181D27",
                    fontWeight: 600,
                    marginTop: 16,
                    marginBottom: 4,
                  }}
                >
                  Location
                </span>
                <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <span>Country</span>
                    <CustomDropdown
                      onSelectSetting={(country) => updateFormData({ country })}
                      screeningSetting={formData.country}
                      settingList={[{ name: "Philippines" }]}
                      placeholder="Select Country"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span>State / Province</span>
                    <CustomDropdown
                      onSelectSetting={(province) =>
                        updateFormData({ province })
                      }
                      screeningSetting={formData.province}
                      settingList={provinceList}
                      placeholder="Choose state / province"
                      hasError={
                        showValidationErrors && !!validationErrors.province
                      }
                    />
                    {showValidationErrors && validationErrors.province && (
                      <span
                        style={{
                          fontSize: 12,
                          color: "#DC2626",
                          marginTop: 4,
                          display: "block",
                        }}
                      >
                        {validationErrors.province}
                      </span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span>City</span>
                    <CustomDropdown
                      onSelectSetting={(city) => updateFormData({ city })}
                      screeningSetting={formData.city}
                      settingList={cityList}
                      placeholder="Choose city"
                      hasError={showValidationErrors && !!validationErrors.city}
                    />
                    {showValidationErrors && validationErrors.city && (
                      <span
                        style={{
                          fontSize: 12,
                          color: "#DC2626",
                          marginTop: 4,
                          display: "block",
                        }}
                      >
                        {validationErrors.city}
                      </span>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 16,
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      color: "#181D27",
                      fontWeight: 600,
                    }}
                  >
                    Salary
                  </span>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <label className="switch" style={{ margin: 0 }}>
                      <input
                        type="checkbox"
                        checked={formData.salaryNegotiable}
                        onChange={() =>
                          updateFormData({
                            salaryNegotiable: !formData.salaryNegotiable,
                          })
                        }
                      />
                      <span className="slider round"></span>
                    </label>
                    <span
                      style={{
                        fontSize: 14,
                        lineHeight: "24px",
                        height: "24px",
                        display: "inline-block",
                      }}
                    >
                      Negotiable
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <span>Minimum Salary</span>
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
                          zIndex: 1,
                        }}
                      >
                        {formData.currency === "USD"
                          ? "$"
                          : formData.currency === "EUR"
                          ? "€"
                          : "₱"}
                      </span>
                      <input
                        type="number"
                        className={`form-control ${
                          showValidationErrors && validationErrors.minimumSalary
                            ? "error-border"
                            : ""
                        }`}
                        style={{
                          paddingLeft: "28px",
                          paddingRight: "100px",
                        }}
                        placeholder="0"
                        min={0}
                        value={formData.minimumSalary}
                        onChange={(e) =>
                          updateFormData({
                            minimumSalary: e.target.value || "",
                          })
                        }
                      />
                      <CustomDropdown
                        onSelectSetting={(currency: string) =>
                          updateFormData({ currency })
                        }
                        screeningSetting={formData.currency || "PHP"}
                        settingList={[
                          { name: "PHP" },
                          { name: "USD" },
                          { name: "EUR" },
                        ]}
                        placeholder="PHP"
                        customStyle={{
                          position: "absolute",
                          right: "0",
                          top: "0",
                          bottom: "0",
                          width: "95px",
                        }}
                      />
                    </div>
                    {showValidationErrors && validationErrors.minimumSalary && (
                      <span
                        style={{
                          fontSize: 12,
                          color: "#DC2626",
                          marginTop: 4,
                          display: "block",
                        }}
                      >
                        {validationErrors.minimumSalary}
                      </span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span>Maximum Salary</span>
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
                          zIndex: 1,
                        }}
                      >
                        {formData.currency === "USD"
                          ? "$"
                          : formData.currency === "EUR"
                          ? "€"
                          : "₱"}
                      </span>
                      <input
                        type="number"
                        className={`form-control ${
                          showValidationErrors && validationErrors.maximumSalary
                            ? "error-border"
                            : ""
                        }`}
                        style={{
                          paddingLeft: "28px",
                          paddingRight: "100px",
                        }}
                        placeholder="0"
                        min={0}
                        value={formData.maximumSalary}
                        onChange={(e) =>
                          updateFormData({
                            maximumSalary: e.target.value || "",
                          })
                        }
                      />
                      <CustomDropdown
                        onSelectSetting={(currency: string) =>
                          updateFormData({ currency })
                        }
                        screeningSetting={formData.currency || "PHP"}
                        settingList={[
                          { name: "PHP" },
                          { name: "USD" },
                          { name: "EUR" },
                        ]}
                        placeholder="PHP"
                        customStyle={{
                          position: "absolute",
                          right: "0",
                          top: "0",
                          bottom: "0",
                          width: "95px",
                        }}
                      />
                    </div>
                    {showValidationErrors && validationErrors.maximumSalary && (
                      <span
                        style={{
                          fontSize: 12,
                          color: "#DC2626",
                          marginTop: 4,
                          display: "block",
                        }}
                      >
                        {validationErrors.maximumSalary}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Description Card */}
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
                  2. Job Description
                </span>
              </div>
              <div className="layered-card-content">
                <RichTextEditor
                  setText={(text) => updateFormData({ description: text })}
                  text={formData.description}
                  hasError={
                    showValidationErrors && !!validationErrors.description
                  }
                />
                {showValidationErrors && validationErrors.description && (
                  <span
                    style={{
                      fontSize: 12,
                      color: "#DC2626",
                      marginTop: 8,
                      display: "block",
                    }}
                  >
                    {validationErrors.description}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Team Access Card */}
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
                  3. Team Access
                </span>
              </div>
              <div className="layered-card-content">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: 14,
                        color: "#181D27",
                        fontWeight: 600,
                        display: "block",
                      }}
                    >
                      Add more members
                    </span>
                    <span style={{ fontSize: 12, color: "#6B7280" }}>
                      You can add other members to collaborate on this career.
                    </span>
                  </div>
                  <div style={{ minWidth: 200 }}>
                    <CustomDropdown
                      onSelectSetting={(member: string) => {
                        if (
                          member === user?.name ||
                          member === "Current User"
                        ) {
                          setShowCurrentUser(true);
                          setCurrentUserRole("Job Owner");
                        }
                      }}
                      screeningSetting="Add Member"
                      settingList={organizationMembers.map((member: any) => ({
                        name: member.name || member.email,
                      }))}
                      placeholder="Add Member"
                    />
                  </div>
                </div>

                {/* Current User */}
                {showCurrentUser && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px",
                      backgroundColor: "#F9FAFB",
                      borderRadius: "8px",
                      marginBottom: 8,
                      border: "1px solid #E9EAEB",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
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
                          overflow: "hidden",
                        }}
                      >
                        {user?.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <i
                            className="la la-user"
                            style={{ fontSize: 20, color: "#6B7280" }}
                          ></i>
                        )}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: "#181D27",
                          }}
                        >
                          {user?.name || "Current User"} (You)
                        </div>
                        <div style={{ fontSize: 12, color: "#6B7280" }}>
                          {user?.email || ""}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div style={{ minWidth: 150 }}>
                        <CustomDropdown
                          onSelectSetting={(role: string) =>
                            setCurrentUserRole(role)
                          }
                          screeningSetting={currentUserRole}
                          settingList={[
                            { name: "Job Owner" },
                            { name: "Contributor" },
                          ]}
                        />
                      </div>
                      <button
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "6px",
                        }}
                        onClick={() => setShowDeleteModal(true)}
                      >
                        <i
                          className="la la-trash"
                          style={{ fontSize: 20, color: "#EF4444" }}
                        ></i>
                      </button>
                    </div>
                  </div>
                )}

                <span
                  style={{
                    fontSize: 11,
                    color: "#9CA3AF",
                    fontStyle: "italic",
                  }}
                >
                  *Admins can view all careers regardless of specific access
                  settings.
                </span>
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
                    <span style={{ fontWeight: 600 }}>
                      Use clear, standard job titles
                    </span>{" "}
                    <span style={{ color: "#6B7280" }}>
                      for better searchability (e.g., "Software Engineer"
                      instead of "Code Ninja" or "Tech Rockstar").
                    </span>
                  </span>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 14, color: "#181D27" }}>
                    <span style={{ fontWeight: 600 }}>Avoid abbreviations</span>{" "}
                    <span style={{ color: "#6B7280" }}>
                      or internal role codes that applicants may not understand
                      (e.g., use "QA Engineer" instead of "QE II" or "QA-TL").
                    </span>
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: 14, color: "#181D27" }}>
                    <span style={{ fontWeight: 600 }}>Keep it concise</span>{" "}
                    <span style={{ color: "#6B7280" }}>
                      — job titles should be no more than a few words (2–4 max),
                      avoiding fluff or marketing terms.
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Member Modal */}
      <DeleteMemberModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => setShowCurrentUser(false)}
        memberName={user?.name || "yourself"}
      />
    </div>
  );
}
