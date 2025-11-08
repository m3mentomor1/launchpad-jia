"use client";

interface DeleteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  memberName: string;
}

export default function DeleteMemberModal({
  isOpen,
  onClose,
  onConfirm,
  memberName,
}: DeleteMemberModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9998,
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          zIndex: 9999,
          width: "90%",
          maxWidth: "400px",
          padding: "24px",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 16 }}>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#181D27",
              marginBottom: 8,
            }}
          >
            Remove Access
          </h3>
          <p
            style={{
              fontSize: 14,
              color: "#6B7280",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Are you sure you want to remove{" "}
            <span style={{ fontWeight: 600 }}>{memberName}</span>'s access to
            this career? You can add them back later.
          </p>
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 24,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid #D5D7DA",
              backgroundColor: "#FFFFFF",
              color: "#414651",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#EF4444",
              color: "#FFFFFF",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Remove
          </button>
        </div>
      </div>
    </>
  );
}
