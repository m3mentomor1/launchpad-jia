"use client";

interface Step {
  id: number;
  name: string;
  key: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
  showValidationErrors?: boolean;
  hasValidationErrors?: boolean;
}

export default function StepIndicator({
  steps,
  currentStep,
  onStepClick,
  showValidationErrors = false,
  hasValidationErrors = false,
}: StepIndicatorProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        width: "100%",
        padding: "0",
      }}
    >
      {steps.map((step, index) => (
        <div
          key={step.id}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            flex: 1,
            position: "relative",
          }}
        >
          {/* Icon and Line Container */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              marginBottom: "8px",
            }}
          >
            {/* Step Icon */}
            <div
              onClick={() => onStepClick(step.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
                width: 28,
                height: 28,
              }}
            >
              {showValidationErrors &&
              hasValidationErrors &&
              currentStep === step.id ? (
                <i
                  className="la la-exclamation-triangle"
                  style={{
                    color: "#EF4444",
                    fontSize: 28,
                  }}
                ></i>
              ) : currentStep > step.id ? (
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    backgroundColor: "#181D27",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <i
                    className="la la-check"
                    style={{
                      color: "#fff",
                      fontSize: 14,
                      lineHeight: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                    }}
                  ></i>
                </div>
              ) : (
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    backgroundColor: "transparent",
                    border:
                      currentStep === step.id
                        ? "3px solid #181D27"
                        : "2px solid #D1D5DB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor:
                        currentStep === step.id ? "#181D27" : "#D1D5DB",
                    }}
                  ></div>
                </div>
              )}
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 6,
                  background:
                    currentStep > step.id
                      ? "linear-gradient(to right, #93C5FD, #DDD6FE, #FBCFE8)"
                      : "#E9EAEB",
                  marginLeft: "12px",
                  marginRight: "12px",
                  borderRadius: "3px",
                }}
              ></div>
            )}
          </div>

          {/* Step Name */}
          <span
            style={{
              fontSize: 14,
              color: currentStep === step.id ? "#181D27" : "#9CA3AF",
              fontWeight: currentStep === step.id ? 600 : 400,
              lineHeight: "1.4",
            }}
          >
            {step.name}
          </span>
        </div>
      ))}
    </div>
  );
}
