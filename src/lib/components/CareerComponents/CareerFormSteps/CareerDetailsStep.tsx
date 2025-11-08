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
}

export default function CareerDetailsStep({
  formData,
  updateFormData,
}: CareerDetailsStepProps) {
  const { user } = useAppContext();
  const [provinceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState("Job Owner");
  const [showCurrentUser, setShowCurrentUser] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: "#181D27",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  className="la la-suitcase"
                  style={{ color: "#FFFFFF", fontSize: 20 }}
                ></i>
              </div>
              <span style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}>
                Career Information
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
                className="form-control"
                placeholder="Enter job title"
                onChange={(e) =>
                  updateFormData({ jobTitle: e.target.value || "" })
                }
              />

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
              <span>Employment Type</span>
              <CustomDropdown
                onSelectSetting={(employmentType) =>
                  updateFormData({ employmentType })
                }
                screeningSetting={formData.employmentType}
                settingList={employmentTypeOptions}
                placeholder="Choose employment type"
              />

              <span>Arrangement</span>
              <CustomDropdown
                onSelectSetting={(workSetup) => updateFormData({ workSetup })}
                screeningSetting={formData.workSetup}
                settingList={workSetupOptions}
                placeholder="Choose work arrangement"
              />

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
                    onSelectSetting={(province) => updateFormData({ province })}
                    screeningSetting={formData.province}
                    settingList={provinceList}
                    placeholder="Choose state / province"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <span>City</span>
                  <CustomDropdown
                    onSelectSetting={(city) => updateFormData({ city })}
                    screeningSetting={formData.city}
                    settingList={cityList}
                    placeholder="Choose city"
                  />
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
                Salary
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 12, color: "#6B7280" }}>
                  Salary Range
                </span>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <label className="switch">
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
                  <span style={{ fontSize: 14 }}>
                    {formData.salaryNegotiable ? "Negotiable" : "Fixed"}
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
                      }}
                    >
                      P
                    </span>
                    <input
                      type="number"
                      className="form-control"
                      style={{ paddingLeft: "28px" }}
                      placeholder="0"
                      min={0}
                      value={formData.minimumSalary}
                      onChange={(e) =>
                        updateFormData({ minimumSalary: e.target.value || "" })
                      }
                    />
                    <span
                      style={{
                        position: "absolute",
                        right: "30px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#6c757d",
                        fontSize: "16px",
                        pointerEvents: "none",
                      }}
                    >
                      PHP
                    </span>
                  </div>
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
                      }}
                    >
                      P
                    </span>
                    <input
                      type="number"
                      className="form-control"
                      style={{ paddingLeft: "28px" }}
                      placeholder="0"
                      min={0}
                      value={formData.maximumSalary}
                      onChange={(e) =>
                        updateFormData({ maximumSalary: e.target.value || "" })
                      }
                    />
                    <span
                      style={{
                        position: "absolute",
                        right: "30px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#6c757d",
                        fontSize: "16px",
                        pointerEvents: "none",
                      }}
                    >
                      PHP
                    </span>
                  </div>
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
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: "#181D27",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  className="la la-file-text"
                  style={{ color: "#FFFFFF", fontSize: 20 }}
                ></i>
              </div>
              <span style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}>
                Job Description
              </span>
            </div>
            <div className="layered-card-content">
              <RichTextEditor
                setText={(text) => updateFormData({ description: text })}
                text={formData.description}
              />
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
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: "#181D27",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  className="la la-users"
                  style={{ color: "#FFFFFF", fontSize: 20 }}
                ></i>
              </div>
              <span style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}>
                Team Access
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
                      if (member === user?.name || member === "Current User") {
                        setShowCurrentUser(true);
                        setCurrentUserRole("Job Owner");
                      }
                    }}
                    screeningSetting="Add member"
                    settingList={[{ name: user?.name || "Current User" }]}
                    placeholder="Add member"
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
                style={{ fontSize: 11, color: "#9CA3AF", fontStyle: "italic" }}
              >
                *Admins can view all careers regardless of specific access
                settings.
              </span>
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
                  Use clear, standard job titles
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "#6B7280",
                    display: "block",
                    marginTop: 4,
                  }}
                >
                  for better searchability (e.g., "Software Engineer" instead of
                  "Code Ninja" or "Tech Rockstar").
                </span>
              </div>
              <div style={{ marginBottom: 16 }}>
                <span
                  style={{ fontSize: 14, fontWeight: 600, color: "#181D27" }}
                >
                  Avoid abbreviations
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "#6B7280",
                    display: "block",
                    marginTop: 4,
                  }}
                >
                  or internal role codes that applicants may not understand
                  (e.g., use "QA Engineer" instead of "QE II" or "QA-TL").
                </span>
              </div>
              <div>
                <span
                  style={{ fontSize: 14, fontWeight: 600, color: "#181D27" }}
                >
                  Keep it concise
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "#6B7280",
                    display: "block",
                    marginTop: 4,
                  }}
                >
                  — job titles should be no more than a few words (2–4 max),
                  avoiding fluff or marketing terms.
                </span>
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
