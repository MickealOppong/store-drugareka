import React, { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import {
    FiArrowLeft,
    FiCheckCircle,
    FiFileText,
    FiLock,
    FiMapPin,
    FiUploadCloud,
    FiUser,
    FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./../css/UserProfile.scss";

type OnboardingStep = "identity_info" | "document_upload" | "completion";

type TUploadedFile = {
  file: File;
  preview: string;
};

const MAX_FILES = 4;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export const PayUAmlOnboarding: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<OnboardingStep>("identity_info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pesel, setPesel] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [documentType, setDocumentType] = useState<"ID_CARD" | "PASSPORT">("ID_CARD");
  const [attachedFiles, setAttachedFiles] = useState<TUploadedFile[]>([]);
  const attachedFilesRef = useRef<TUploadedFile[]>([]);
  attachedFilesRef.current = attachedFiles;

  useEffect(() => {
    return () => {
      attachedFilesRef.current.forEach(({ preview }) => {
        if (preview) URL.revokeObjectURL(preview);
      });
    };
  }, []);

  const validateIdentityStep = (): boolean => {
    setGlobalError(null);

    if (!firstName.trim() || !lastName.trim() || !street.trim() || !city.trim()) {
      setGlobalError(
        t(
          "user_profile.errors.required_fields",
          "Please fill out all mandatory identity and address fields.",
        ),
      );
      return false;
    }

    const normalizedPesel = pesel.trim();
    if (!/^\d{11}$/.test(normalizedPesel)) {
      setGlobalError(
        t("user_profile.errors.invalid_pesel", "Please provide an 11-digit Polish PESEL number."),
      );
      return false;
    }

    if (!/^\d{2}-\d{3}$/.test(postalCode.trim())) {
      setGlobalError(
        t(
          "user_profile.errors.invalid_postal",
          "Postal code must follow the Polish format, for example 97-300.",
        ),
      );
      return false;
    }

    return true;
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    event.target.value = "";
    setGlobalError(null);

    if (selectedFiles.length === 0) return;

    const remainingSlots = MAX_FILES - attachedFiles.length;
    if (remainingSlots <= 0) {
      setGlobalError(`You can upload a maximum of ${MAX_FILES} files.`);
      return;
    }

    const validFiles: TUploadedFile[] = [];
    const errors: string[] = [];

    selectedFiles.forEach((file) => {
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        errors.push(`${file.name}: use JPG, PNG, WEBP, or PDF files.`);
      } else if (file.size > MAX_FILE_SIZE_BYTES) {
        errors.push(`${file.name}: the file must be no larger than 10 MB.`);
      } else if (validFiles.length < remainingSlots) {
        validFiles.push({
          file,
          preview: file.type === "application/pdf" ? "" : URL.createObjectURL(file),
        });
      }
    });

    if (selectedFiles.length > remainingSlots) {
      errors.push(`You can upload a maximum of ${MAX_FILES} files.`);
    }

    setAttachedFiles((previous) => [...previous, ...validFiles].slice(0, MAX_FILES));
    if (errors.length > 0) setGlobalError(errors.join("\n"));
  };

  const removeAttachedFile = (index: number) => {
    const removedFile = attachedFiles[index];
    if (removedFile?.preview) URL.revokeObjectURL(removedFile.preview);
    setAttachedFiles((previous) => previous.filter((_, fileIndex) => fileIndex !== index));
    setGlobalError(null);
  };

  const handleFinalSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGlobalError(null);

    if (attachedFiles.length === 0) {
      setGlobalError(
        t("user_profile.errors.missing_documents", "Please attach at least one identity document."),
      );
      return;
    }

    setIsSubmitting(true);

    const payload = new FormData();
    payload.append("name", `${firstName.trim()} ${lastName.trim()}`);
    payload.append("firstName", firstName.trim());
    payload.append("lastName", lastName.trim());
    payload.append("pesel", pesel.trim());
    payload.append("legalForm", "PRIVATE_PERSON");
    payload.append("street", street.trim());
    payload.append("city", city.trim());
    payload.append("postalCode", postalCode.trim());
    payload.append("country", "PL");
    payload.append("documentType", documentType);

    attachedFiles.forEach(({ file }) => payload.append("images", file));

    try {
      const response = await fetch("/api/aml-verification/v1/onboard-seller", {
        method: "POST",
        body: payload,
      });

      const responseText = await response.text();
      let responseData: Record<string, unknown> = {};
      if (responseText) {
        try {
          responseData = JSON.parse(responseText) as Record<string, unknown>;
        } catch {
          responseData = { message: responseText };
        }
      }

      if (response.ok) {
        setCurrentStep("completion");
        return;
      }

      const errorValue = responseData.error;
      if (errorValue && typeof errorValue === "object") {
        const combinedErrors = Object.values(errorValue as Record<string, unknown>)
          .filter((value) => value !== null && value !== undefined && value !== "")
          .map(String)
          .join("\n");
        setGlobalError(
          combinedErrors ||
            String(responseData.message ?? "Identity verification was rejected. Please check your details."),
        );
      } else {
        setGlobalError(
          String(responseData.message ?? `Identity verification failed (HTTP ${response.status}).`),
        );
      }
    } catch {
      setGlobalError("A network error occurred. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepLabels: { step: OnboardingStep; label: string; number: number }[] = [
    { step: "identity_info", label: t("user_profile.aml.steps.identity", "Identity & Address"), number: 1 },
    { step: "document_upload", label: t("user_profile.aml.steps.documents", "Upload Scans"), number: 2 },
    { step: "completion", label: t("user_profile.aml.steps.done", "Verification"), number: 3 },
  ];

  const currentStepIndex = stepLabels.findIndex(({ step }) => step === currentStep);

  return (
    <main className="usr-profile usr-profile--center">
      <section className="usr-profile__card usr-profile__card--narrow">
        <div
          className="aml-steps-indicator"
          aria-label="Onboarding progress"
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "0.75rem",
            marginBottom: "2rem",
            width: "100%",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "var(--color-text-muted, #64748b)",
          }}
        >
          {stepLabels.map(({ step, label, number }, index) => (
            <span
              key={step}
              aria-current={step === currentStep ? "step" : undefined}
              style={{
                color: index <= currentStepIndex ? "var(--color-primary)" : "inherit",
              }}
            >
              {number}. {label}
            </span>
          ))}
        </div>

        {globalError && (
          <div
            className="usr-profile__alert usr-profile__alert--error"
            style={{ marginBottom: "1.5rem", whiteSpace: "pre-line" }}
            role="alert"
          >
            {globalError}
          </div>
        )}

        {currentStep === "identity_info" && (
          <div className="usr-profile__form-wrapper">
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div className="usr-profile__status-icon" style={{ fontSize: "2.5rem" }}>
                <FiUser aria-hidden="true" />
              </div>
              <h2 className="usr-profile__title" style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>
                {t("user_profile.aml.identity_title", "Seller Onboarding")}
              </h2>
              <p className="usr-profile__description">
                {t(
                  "user_profile.aml.identity_desc",
                  "Enter your personal details and residential address for identity verification.",
                )}
              </p>
            </div>

            <div
              className="usr-profile__grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", textAlign: "left" }}
            >
              <div className="usr-profile__field">
                <label className="usr-profile__label" htmlFor="aml-first-name">
                  {t("user_profile.fields.first_name", "First name")}
                </label>
                <input
                  id="aml-first-name"
                  type="text"
                  className="usr-profile__input"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  autoComplete="given-name"
                  required
                />
              </div>
              <div className="usr-profile__field">
                <label className="usr-profile__label" htmlFor="aml-last-name">
                  {t("user_profile.fields.last_name", "Last name")}
                </label>
                <input
                  id="aml-last-name"
                  type="text"
                  className="usr-profile__input"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  autoComplete="family-name"
                  required
                />
              </div>
            </div>

            <div className="usr-profile__field" style={{ textAlign: "left", marginTop: "1rem" }}>
              <label className="usr-profile__label" htmlFor="aml-pesel">
                {t("user_profile.fields.pesel", "PESEL")}
              </label>
              <div className="usr-profile__input-lock" style={{ display: "flex", alignItems: "center", position: "relative" }}>
                <input
                  id="aml-pesel"
                  type="text"
                  className="usr-profile__input"
                  maxLength={11}
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="11-digit PESEL"
                  value={pesel}
                  onChange={(event) => setPesel(event.target.value.replace(/\D/g, "").slice(0, 11))}
                  style={{ width: "100%", paddingRight: "2.5rem" }}
                  required
                />
                <span className="usr-profile__lock-icon" style={{ position: "absolute", right: "12px", color: "#94a3b8" }}>
                  <FiLock aria-hidden="true" />
                </span>
              </div>
            </div>

            <div
              className="usr-profile__section-divider"
              style={{ borderTop: "1px solid #e2e8f0", margin: "2rem 0 1.5rem", paddingTop: "1rem" }}
            >
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0 0 1rem", color: "#0f172a", textAlign: "left", display: "flex", alignItems: "center", gap: "6px" }}>
                <FiMapPin aria-hidden="true" />
                {t("user_profile.aml.address_heading", "Residential Address")}
              </h3>
            </div>

            <div className="usr-profile__field" style={{ textAlign: "left", marginBottom: "1rem" }}>
              <label className="usr-profile__label" htmlFor="aml-street">
                {t("user_profile.fields.street", "Street and house number")}
              </label>
              <input
                id="aml-street"
                type="text"
                className="usr-profile__input"
                placeholder="ul. Przykładowa 12/3"
                value={street}
                onChange={(event) => setStreet(event.target.value)}
                autoComplete="street-address"
                required
              />
            </div>

            <div
              className="usr-profile__grid"
              style={{ display: "grid", gridTemplateColumns: "minmax(110px, 2fr) minmax(160px, 3fr)", gap: "1rem", textAlign: "left" }}
            >
              <div className="usr-profile__field">
                <label className="usr-profile__label" htmlFor="aml-postal-code">
                  {t("user_profile.fields.postal_code", "Postal code")}
                </label>
                <input
                  id="aml-postal-code"
                  type="text"
                  className="usr-profile__input"
                  placeholder="97-300"
                  maxLength={6}
                  value={postalCode}
                  onChange={(event) => setPostalCode(event.target.value)}
                  autoComplete="postal-code"
                  required
                />
              </div>
              <div className="usr-profile__field">
                <label className="usr-profile__label" htmlFor="aml-city">
                  {t("user_profile.fields.city", "City")}
                </label>
                <input
                  id="aml-city"
                  type="text"
                  className="usr-profile__input"
                  placeholder="Piotrków Trybunalski"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  autoComplete="address-level2"
                  required
                />
              </div>
            </div>

            <button
              type="button"
              className="usr-profile__btn usr-profile__btn--save usr-profile__btn--full"
              style={{ marginTop: "2rem" }}
              onClick={() => {
                if (validateIdentityStep()) setCurrentStep("document_upload");
              }}
            >
              {t("user_profile.buttons.continue", "Continue to Upload")}
            </button>
          </div>
        )}

        {currentStep === "document_upload" && (
          <form onSubmit={handleFinalSubmit}>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div className="usr-profile__status-icon" style={{ fontSize: "2.5rem" }}>
                <FiFileText aria-hidden="true" />
              </div>
              <h2 className="usr-profile__title" style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>
                {t("user_profile.aml.doc_title", "Identity Verification Documents")}
              </h2>
              <p className="usr-profile__description">
                {t(
                  "user_profile.aml.doc_desc",
                  "Upload clear scans or photos of your identity card or passport.",
                )}
              </p>
            </div>

            <div className="usr-profile__field" style={{ textAlign: "left", marginBottom: "1.5rem" }}>
              <label className="usr-profile__label" htmlFor="aml-document-type">
                {t("user_profile.aml.fields.doc_type", "Select Document Type")}
              </label>
              <select
                id="aml-document-type"
                className="usr-profile__input"
                style={{ width: "100%", height: "42px", padding: "0 8px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                value={documentType}
                onChange={(event) => setDocumentType(event.target.value as "ID_CARD" | "PASSPORT")}
              >
                <option value="ID_CARD">{t("user_profile.aml.docs.id_card", "Identity Card (Dowód Osobisty)")}</option>
                <option value="PASSPORT">{t("user_profile.aml.docs.passport", "Passport")}</option>
              </select>
            </div>

            <div className="product-images" style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "1.5rem" }}>
              {attachedFiles.map((fileItem, index) => (
                <div
                  className="product-image"
                  key={`${fileItem.file.name}-${fileItem.file.lastModified}-${index}`}
                  style={{ position: "relative", width: "100px", minHeight: "80px", border: "1px solid #cbd5e1", borderRadius: "8px", overflow: "hidden" }}
                >
                  {fileItem.preview ? (
                    <img src={fileItem.preview} alt={`Preview of ${fileItem.file.name}`} style={{ width: "100%", height: "80px", objectFit: "cover" }} />
                  ) : (
                    <div style={{ minHeight: "80px", display: "flex", alignItems: "center", justifyContent: "center", padding: "0.5rem", textAlign: "center" }}>
                      <FiFileText aria-hidden="true" />
                      <span style={{ fontSize: "0.75rem", overflowWrap: "anywhere" }}>{fileItem.file.name}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeAttachedFile(index)}
                    className="product-image__remove"
                    aria-label={`Remove ${fileItem.file.name}`}
                    style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(15, 23, 42, 0.7)", color: "#fff", border: "none", borderRadius: "50%", padding: "4px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <FiX aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>

            {attachedFiles.length < MAX_FILES && (
              <label
                className="usr-profile__btn usr-profile__btn--cancel"
                htmlFor="aml-document-files"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", cursor: "pointer" }}
              >
                <FiUploadCloud aria-hidden="true" />
                {t("user_profile.aml.upload_files", "Choose files (JPG, PNG, WEBP, PDF; max 10 MB each)")}
                <input
                  id="aml-document-files"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  multiple
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
              </label>
            )}
            <p className="usr-profile__description" style={{ marginTop: "0.5rem" }}>
              {attachedFiles.length} / {MAX_FILES} files selected
            </p>

            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
              <button
                type="button"
                className="usr-profile__btn usr-profile__btn--cancel"
                style={{ flex: 1, justifyContent: "center" }}
                onClick={() => {
                  setGlobalError(null);
                  setCurrentStep("identity_info");
                }}
                disabled={isSubmitting}
              >
                <FiArrowLeft aria-hidden="true" /> {t("user_profile.buttons.back", "Back")}
              </button>
              <button
                type="submit"
                className="usr-profile__btn usr-profile__btn--save"
                style={{ flex: 2, justifyContent: "center" }}
                disabled={isSubmitting || attachedFiles.length === 0}
              >
                {isSubmitting
                  ? t("user_profile.buttons.processing", "Submitting...")
                  : t("user_profile.buttons.submit", "Submit for Verification")}
              </button>
            </div>
          </form>
        )}

        {currentStep === "completion" && (
          <div className="usr-profile__status-wrapper" style={{ padding: "1rem 0", textAlign: "center" }}>
            <div className="usr-profile__status-icon usr-profile__status-icon--success" style={{ fontSize: "4rem" }}>
              <FiCheckCircle aria-hidden="true" />
            </div>
            <h1 className="usr-profile__title" style={{ marginTop: "1rem" }}>
              {t("user_profile.aml.success_title", "Onboarding Submitted")}
            </h1>
            <p className="usr-profile__description" style={{ maxWidth: "400px", margin: "0 auto 2rem" }}>
              {t(
                "user_profile.aml.success_desc",
                "Your identity verification details have been submitted. Verification may still be pending.",
              )}
            </p>
            <button
              type="button"
              className="usr-profile__btn usr-profile__btn--save usr-profile__btn--full"
              onClick={() => navigate("/account/listings/me")}
            >
              {t("user_profile.buttons.go_dashboard", "Go to Dashboard")}
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default PayUAmlOnboarding;
