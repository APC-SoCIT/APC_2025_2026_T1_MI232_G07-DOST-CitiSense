import React, { useState } from "react";
import { Checkbox } from "../components/ui/checkbox";

interface TermsAndConditionsPopupProps {
  open: boolean;
  onClose: () => void;
  onAgree: () => void;
}

const TermsAndConditionsPopup: React.FC<TermsAndConditionsPopupProps> = ({
  open,
  onClose,
  onAgree,
}) => {
  // State to track if the user has agreed to the terms
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  // Handler for the "Accept & Continue" button
  const handleOk = () => {
    if (agreed) {
      setError("");
      onAgree();
    } else {
      setError("You must agree to the Terms and Conditions to register.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(4px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "12px",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          width: "100%",
          maxWidth: "500px",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{ padding: "24px 32px", borderBottom: "1px solid #e2e8f0" }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#1e293b",
            }}
          >
            Terms and Conditions
          </h2>
          <p
            style={{
              margin: "8px 0 0",
              fontSize: "0.875rem",
              color: "#64748b",
            }}
          >
            <strong>Project:</strong> CitiSense | <strong>Agency:</strong> DOST
          </p>
        </div>

        <div
          style={{
            padding: "24px 32px",
            overflowY: "auto",
            fontSize: "0.95rem",
            color: "#334155",
            lineHeight: "1.6",
            backgroundColor: "#f8fafc",
          }}
        >
          <section style={{ marginBottom: "20px" }}>
            <h3
              style={{
                fontSize: "1rem",
                color: "#0f172a",
                marginBottom: "8px",
              }}
            >
              1. Acceptance of Terms
            </h3>
            <p>
              By accessing or using CitiSense (the “System”), you agree to
              comply with these Terms and Conditions and the DOST Privacy
              Policy. Use of this System constitutes agreement to follow all
              internal ICT policies of the Department.
            </p>
          </section>

          <section style={{ marginBottom: "20px" }}>
            <h3
              style={{
                fontSize: "1rem",
                color: "#0f172a",
                marginBottom: "8px",
              }}
            >
              2. Purpose of the System
            </h3>
            <p>
              CitiSense is a Research and Development (R&D) tool designed to
              provide automated sentiment insights from text-based data to
              support data-driven decision-making.
            </p>
          </section>

          <section style={{ marginBottom: "20px" }}>
            <h3
              style={{
                fontSize: "1rem",
                color: "#0f172a",
                marginBottom: "8px",
              }}
            >
              3. Data Privacy and Protection
            </h3>
            <p style={{ marginBottom: "8px" }}>
              In compliance with Republic Act No. 10173:
            </p>
            <ul style={{ paddingLeft: "20px", margin: 0 }}>
              <li>
                <strong>Data Collection:</strong> Uploading Sensitive Personal
                Information is prohibited unless strictly necessary.
              </li>
              <li>
                <strong>Access Control:</strong> Use of another person’s account
                violates DOST AO No. 002.
              </li>
            </ul>
          </section>

          <section style={{ marginBottom: "20px" }}>
            <h3
              style={{
                fontSize: "1rem",
                color: "#0f172a",
                marginBottom: "8px",
              }}
            >
              4. Intellectual Property
            </h3>
            <ul style={{ paddingLeft: "20px", margin: 0 }}>
              <li>
                <strong>Ownership:</strong> Algorithms remain the property of
                DOST.
              </li>
              <li>
                <strong>Attribution:</strong> Publications must credit CitiSense
                and DOST.
              </li>
            </ul>
          </section>

          <section>
            <h3
              style={{
                fontSize: "1rem",
                color: "#0f172a",
                marginBottom: "8px",
              }}
            >
              5. Acceptable Use Policy
            </h3>
            <p>
              Users agree NOT to use CitiSense for political/religious
              promotion, commercial gain without TLA, or malicious activity.
            </p>
          </section>
        </div>

        <div style={{ padding: "24px 32px", borderTop: "1px solid #e2e8f0" }}>
          {error && (
            <div
              style={{
                marginBottom: "16px",
                color: "#b91c1c",
                background: "#fef2f2",
                padding: "10px",
                borderRadius: "6px",
                fontSize: "0.85rem",
                border: "1px solid #fee2e2",
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <Checkbox
              id="agree-checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <label
              htmlFor="agree-checkbox"
              style={{
                fontSize: "0.9rem",
                cursor: "pointer",
                userSelect: "none",
                color: "#475569",
              }}
            >
              I have read and agree to the Terms and Conditions
            </label>
          </div>

          <div
            style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}
          >
            <button
              onClick={onClose}
              style={{
                padding: "10px 20px",
                background: "transparent",
                color: "#64748b",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "0.9rem",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleOk}
              style={{
                padding: "10px 24px",
                background: agreed ? "#2563eb" : "#94a3b8",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: agreed ? "pointer" : "not-allowed",
                fontWeight: "600",
                fontSize: "0.9rem",
                transition: "background 0.2s",
              }}
            >
              Accept & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPopup;
