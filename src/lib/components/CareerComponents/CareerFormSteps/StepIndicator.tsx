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
}

export default function StepIndicator({
  steps,
  currentStep,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "0 20px",
      }}
    >
      {steps.map((step, index) => (
        <div
          key={step.id}
          style={{ display: "flex", alignItems: "center", flex: 1 }}
        >
          {/* Step Circle */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >
            <div
              onClick={() => onStepClick(step.id)}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: currentStep >= step.id ? "#181D27" : "#E9EAEB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                zIndex: 2,
              }}
            >
              {currentStep > step.id ? (
                <i
                  className="la la-check"
                  style={{ color: "#fff", fontSize: 20 }}
                ></i>
              ) : (
                <span
                  style={{
                    color: currentStep === step.id ? "#fff" : "#9CA3AF",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {step.id}
                </span>
              )}
            </div>
            <span
              style={{
                marginTop: 8,
                fontSize: 12,
                color: currentStep === step.id ? "#181D27" : "#6B7280",
                fontWeight: currentStep === step.id ? 600 : 400,
                textAlign: "center",
                maxWidth: 120,
              }}
            >
              {step.name}
            </span>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              style={{
                flex: 1,
                height: 2,
                backgroundColor: currentStep > step.id ? "#181D27" : "#E9EAEB",
                marginLeft: 8,
                marginRight: 8,
                marginBottom: 30,
                transition: "all 0.3s ease",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
