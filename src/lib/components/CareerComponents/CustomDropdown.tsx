"use client";
import { useState } from "react";

export default function CustomDropdown(props) {
  const {
    onSelectSetting,
    screeningSetting,
    settingList,
    placeholder,
    hasError,
    customStyle,
  } = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div
      className={customStyle ? "dropdown" : "dropdown w-100"}
      style={customStyle}
    >
      <button
        disabled={settingList.length === 0}
        className={`dropdown-btn fade-in-bottom ${
          hasError ? "error-border" : ""
        }`}
        style={
          customStyle
            ? {
                width: "100%",
                textTransform: "capitalize",
                border: "none",
                backgroundColor: "transparent",
                padding: "0 16px 0 8px",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }
            : {
                width: "100%",
                textTransform: "capitalize",
              }
        }
        type="button"
        onClick={() => setDropdownOpen((v) => !v)}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <i
            className={
              settingList.find((setting) => setting.name === screeningSetting)
                ?.icon
            }
            style={{ fontSize: "18px", color: "#6B7280" }}
          ></i>
          {screeningSetting?.replace("_", " ") || placeholder}
        </span>
        <i
          className="la la-angle-down"
          style={
            customStyle
              ? { marginLeft: "8px", marginRight: "12px" }
              : { marginLeft: "8px" }
          }
        ></i>
      </button>
      <div
        className={`dropdown-menu w-100 mt-1 org-dropdown-anim${
          dropdownOpen ? " show" : ""
        }`}
        style={{
          padding: "10px",
          maxHeight: 200,
          overflowY: "auto",
          overflowX: "hidden",
          width: "100%",
          minWidth: "100%",
        }}
      >
        {settingList.map((setting, index) => (
          <div style={{ borderBottom: "1px solid #ddd" }} key={index}>
            <button
              className="dropdown-item d-flex align-items-center"
              style={{
                borderRadius: screeningSetting === setting.name ? 0 : 10,
                overflow: "hidden",
                paddingBottom: 10,
                paddingTop: 10,
                color: "#181D27",
                fontWeight: screeningSetting === setting.name ? 700 : 500,
                background:
                  screeningSetting === setting.name ? "#F8F9FC" : "transparent",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                whiteSpace: "wrap",
                textTransform: "capitalize",
              }}
              onClick={() => {
                onSelectSetting(setting.name);
                setDropdownOpen(false);
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {setting.icon && (
                  <i
                    className={setting.icon}
                    style={{ fontSize: "18px", color: "#6B7280" }}
                  ></i>
                )}
                {setting.name?.replace("_", " ")}
              </div>
              {setting.name === screeningSetting && (
                <i
                  className="la la-check"
                  style={{
                    fontSize: "20px",
                    background:
                      "linear-gradient(180deg, #9FCAED 0%, #CEB6DA 33%, #EBACC9 66%, #FCCEC0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                ></i>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
