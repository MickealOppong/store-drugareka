
import React, {
  useEffect,
  useState,
  type ChangeEvent,
} from "react";
import { useTranslation } from "react-i18next";
import {
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiMaximize2,
  FiMessageSquare,
  FiX,
} from "react-icons/fi";

import defImage from "../assets/default.jpeg";
import "../css/ComplaintImageModal.scss";
import { useUpdateOrderDisputeAdminMutation } from "../features/api/itemApi";

interface ComplaintImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  originalImages: string[];
  complaintImages: string[];
}

type AdminDecision =
  | "approve"
  | "reject"
  | "not_justified";

export const ComplaintImageModal: React.FC<
  ComplaintImageModalProps
> = ({
  isOpen,
  onClose,
  orderNumber,
  originalImages = [],
  complaintImages = [],
}) => {
  const { t } = useTranslation();

  // Image carousel states
  const [originalIdx, setOriginalIdx] = useState(0);
  const [complaintIdx, setComplaintIdx] = useState(0);

  // Admin decision states
  const [alertError, setAlertError] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsProcessing] = useState(false);

  // Fullscreen image
  const [fullscreenImage, setFullscreenImage] =
    useState<string | null>(null);

  // API mutation
  const [updateDisputeStatus] =
    useUpdateOrderDisputeAdminMutation();

  // Close modal using Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (fullscreenImage) {
          setFullscreenImage(null);
        } else if (!isSubmitting) {
          onClose();
        }
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, fullscreenImage, onClose, isSubmitting]);

  // Reset modal when opened or order changes
  useEffect(() => {
    if (isOpen) {
      setAlertError("");
      setComment("");
      setOriginalIdx(0);
      setComplaintIdx(0);
      setFullscreenImage(null);
    }
  }, [isOpen, orderNumber]);

  const originalPhotos =
    originalImages.length > 0 ? originalImages : [defImage];

  const complaintPhotos =
    complaintImages.length > 0 ? complaintImages : [defImage];

  // Original listing navigation
  const handlePrevOriginal = () => {
    setOriginalIdx((prev) =>
      prev === 0 ? originalPhotos.length - 1 : prev - 1
    );
  };

  const handleNextOriginal = () => {
    setOriginalIdx((prev) =>
      prev === originalPhotos.length - 1 ? 0 : prev + 1
    );
  };

  // Complaint evidence navigation
  const handlePrevComplaint = () => {
    setComplaintIdx((prev) =>
      prev === 0 ? complaintPhotos.length - 1 : prev - 1
    );
  };

  const handleNextComplaint = () => {
    setComplaintIdx((prev) =>
      prev === complaintPhotos.length - 1 ? 0 : prev + 1
    );
  };

  // Submit admin decision
  const handleDecisionSubmit = async (
    actionType: AdminDecision
  ) => {
    if (isSubmitting || !comment.trim()) return;

    setAlertError("");
    setIsProcessing(true);

    try {
      await updateDisputeStatus({
        orderNumber,
        decision: actionType,
        reason: comment.trim(),
      }).unwrap();

      setComment("");
      onClose();
    } catch (error: unknown) {
      let message = t(
        "complaint_modal.errors.processing_failed",
        {
          defaultValue:
            "Nie udało się zapisać decyzji. Spróbuj ponownie.",
        }
      );

      if (typeof error === "object" && error !== null) {
        const err = error as {
          data?:
            | { message?: unknown; detail?: unknown }
            | string;
          error?: string;
          message?: string;
        };

        if (
          typeof err.data === "string" &&
          err.data.trim()
        ) {
          message = err.data;
        } else if (
          err.data &&
          typeof err.data === "object"
        ) {
          if (
            typeof err.data.message === "string" &&
            err.data.message.trim()
          ) {
            message = err.data.message;
          } else if (
            typeof err.data.detail === "string" &&
            err.data.detail.trim()
          ) {
            message = err.data.detail;
          }
        } else if (
          typeof err.error === "string" &&
          err.error.trim()
        ) {
          message = err.error;
        }
      }

      setAlertError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="cmp-modal-overlay"
        onClick={() => {
          if (!isSubmitting) onClose();
        }}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="cmp-modal"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <header className="cmp-modal__header">
            <div className="cmp-modal__badge">
              <FiAlertCircle />

              <span>
                {t("complaint_modal.header.badge", {
                  defaultValue: "Weryfikacja reklamacji",
                })}
              </span>

              <span className="cmp-modal__order-tag">
                #{orderNumber}
              </span>
            </div>

            <button
              type="button"
              className="cmp-modal__close-btn"
              onClick={onClose}
              disabled={isSubmitting}
              aria-label="Zamknij"
            >
              <FiX />
            </button>
          </header>

          {/* IMAGE COMPARISON */}
          <div className="cmp-modal__body">
            {/* ORIGINAL LISTING */}
            <section className="cmp-panel">
              <div className="cmp-panel__title-bar">
                <FiFileText />

                <h3>
                  {t(
                    "complaint_modal.panels.original_title",
                    {
                      defaultValue:
                        "Zdjęcia z ogłoszenia",
                    }
                  )}
                </h3>
              </div>

              <div className="cmp-panel__display-frame">
                <img
                  src={originalPhotos[originalIdx]}
                  alt="Zdjęcie produktu z ogłoszenia"
                  loading="lazy"
                />

                <button
                  type="button"
                  className="cmp-panel__zoom-trigger"
                  onClick={() =>
                    setFullscreenImage(
                      originalPhotos[originalIdx]
                    )
                  }
                  title="Powiększ zdjęcie"
                >
                  <FiMaximize2 />
                </button>

                {originalPhotos.length > 1 && (
                  <div className="cmp-panel__controls">
                    <button
                      type="button"
                      onClick={handlePrevOriginal}
                      className="cmp-panel__arrow"
                      aria-label="Poprzednie zdjęcie"
                    >
                      <FiChevronLeft />
                    </button>

                    <span className="cmp-panel__indicator">
                      {originalIdx + 1} /{" "}
                      {originalPhotos.length}
                    </span>

                    <button
                      type="button"
                      onClick={handleNextOriginal}
                      className="cmp-panel__arrow"
                      aria-label="Następne zdjęcie"
                    >
                      <FiChevronRight />
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* BUYER COMPLAINT IMAGES */}
            <section className="cmp-panel cmp-panel--complaint">
              <div className="cmp-panel__title-bar">
                <FiAlertCircle />

                <h3>
                  {t(
                    "complaint_modal.panels.complaint_title",
                    {
                      defaultValue:
                        "Zdjęcia dołączone do reklamacji",
                    }
                  )}
                </h3>
              </div>

              <div className="cmp-panel__display-frame">
                <img
                  src={complaintPhotos[complaintIdx]}
                  alt="Zdjęcie przesłane przez kupującego"
                  loading="lazy"
                />

                <button
                  type="button"
                  className="cmp-panel__zoom-trigger"
                  onClick={() =>
                    setFullscreenImage(
                      complaintPhotos[complaintIdx]
                    )
                  }
                  title="Powiększ zdjęcie"
                >
                  <FiMaximize2 />
                </button>

                {complaintPhotos.length > 1 && (
                  <div className="cmp-panel__controls">
                    <button
                      type="button"
                      onClick={handlePrevComplaint}
                      className="cmp-panel__arrow"
                      aria-label="Poprzednie zdjęcie"
                    >
                      <FiChevronLeft />
                    </button>

                    <span className="cmp-panel__indicator">
                      {complaintIdx + 1} /{" "}
                      {complaintPhotos.length}
                    </span>

                    <button
                      type="button"
                      onClick={handleNextComplaint}
                      className="cmp-panel__arrow"
                      aria-label="Następne zdjęcie"
                    >
                      <FiChevronRight />
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* ERROR MESSAGE */}
          {alertError && (
            <div
              className="cmp-modal__alert"
              role="alert"
            >
              <FiAlertCircle />
              <span>{alertError}</span>
            </div>
          )}

          {/* ADMIN DECISION FOOTER */}
          <footer className="cmp-modal__footer">
            <form
              className="cmp-footer-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="cmp-footer-form__field">
                <label
                  htmlFor="complaint-comment"
                  className="cmp-footer-form__label"
                >
                  <FiMessageSquare />

                  <span>
                    {t(
                      "complaint_modal.footer.comment_label",
                      {
                        defaultValue:
                          "Uzasadnienie decyzji administratora",
                      }
                    )}
                  </span>
                </label>

                <textarea
                  id="complaint-comment"
                  className="cmp-footer-form__textarea"
                  value={comment}
                  onChange={(
                    e: ChangeEvent<HTMLTextAreaElement>
                  ) => {
                    setComment(e.target.value);

                    if (alertError) {
                      setAlertError("");
                    }
                  }}
                  placeholder={t(
                    "complaint_modal.footer.placeholder",
                    {
                      defaultValue:
                        "Podaj uzasadnienie podjętej decyzji...",
                    }
                  )}
                  disabled={isSubmitting}
                  maxLength={1000}
                  required
                />
              </div>

              <div className="cmp-footer-form__actions">
                {/* REJECT */}
                <button
                  type="button"
                  className="cmp-footer-form__btn cmp-footer-form__btn--reject"
                  onClick={() =>
                    void handleDecisionSubmit("reject")
                  }
                  disabled={
                    isSubmitting || !comment.trim()
                  }
                >
                  {t(
                    "complaint_modal.footer.buttons.reject",
                    {
                      defaultValue: "Odrzuć",
                    }
                  )}
                </button>

                {/* NOT JUSTIFIED - BUYER FAULT */}
                <button
                  type="button"
                  className="cmp-footer-form__btn cmp-footer-form__btn--not-justified"
                  onClick={() =>
                    void handleDecisionSubmit(
                      "not_justified"
                    )
                  }
                  disabled={
                    isSubmitting || !comment.trim()
                  }
                >
                  {t(
                    "complaint_modal.footer.buttons.not_justified",
                    {
                      defaultValue:
                        "Nieuzasadniona odmowa odbioru",
                    }
                  )}
                </button>

                {/* JUSTIFIED */}
                <button
                  type="button"
                  className="cmp-footer-form__btn cmp-footer-form__btn--approve"
                  onClick={() =>
                    void handleDecisionSubmit("approve")
                  }
                  disabled={
                    isSubmitting || !comment.trim()
                  }
                >
                  {t(
                    "complaint_modal.footer.buttons.approve",
                    {
                      defaultValue: "Uzasadniona",
                    }
                  )}
                </button>
              </div>
            </form>
          </footer>
        </div>
      </div>

      {/* FULLSCREEN IMAGE VIEWER */}
      {fullscreenImage && (
        <div
          className="cmp-lightbox-overlay"
          onClick={() => setFullscreenImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="cmp-lightbox-close"
            onClick={() => setFullscreenImage(null)}
            aria-label="Zamknij podgląd"
          >
            <FiX />
          </button>

          <img
            src={fullscreenImage}
            alt="Powiększone zdjęcie"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};
