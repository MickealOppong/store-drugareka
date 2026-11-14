import { useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { FiInfo, FiMessageSquare, FiX } from "react-icons/fi";
import "../css/EnquiryModal.css";
import { useCreateEnquiryMutation } from "../features/api/sellerApi";

interface EnquiryModalProps {
  isOpen: boolean;
  productName: string;
  listingId: number;
  onClose: () => void;
}

const EnquiryModal = ({
  isOpen,
  productName,
  listingId,
  onClose,
}: EnquiryModalProps) => {
  const { t } = useTranslation();
  const [question, setQuestion] = useState("");
  const maxLength = 200;

  const [createEnquiry, { isLoading }] = useCreateEnquiryMutation();

  if (!isOpen) return null;

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isLoading) return;

    try {
      const response = await createEnquiry({
        listingId,
        message: trimmedQuestion,
      }).unwrap();

      if (response === true) {
        setQuestion("");
        onClose();
      }
    } catch (error) {
      console.error("Failed to submit enquiry:", error);
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    setQuestion("");
    onClose();
  };

  return (
    <div className="enquiry-modal-overlay" onClick={handleClose}>
      <div
        className="enquiry-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-modal-title"
      >
        <button
          type="button"
          className="enquiry-modal-close"
          onClick={handleClose}
          aria-label={t("enquiry_modal.close_aria", { defaultValue: "Zamknij" })}
          disabled={isLoading}
        >
          <FiX aria-hidden="true" />
        </button>

        <div className="enquiry-modal-icon">
          <FiMessageSquare aria-hidden="true" />
        </div>

        <h2 id="enquiry-modal-title">
          {t("enquiry_modal.title", {
            defaultValue: "Poproś o brakujące informacje",
          })}
        </h2>

        <p className="enquiry-product-name">{productName}</p>

        <p className="enquiry-description">
          {t("enquiry_modal.description", {
            defaultValue:
              "Brakuje Ci jakiejś informacji? Zadaj pytanie, a przekażemy je sprzedającemu.",
          })}
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="enquiry-question">
            {t("enquiry_modal.question_label", {
              defaultValue: "Twoje pytanie",
            })}
          </label>

          <textarea
            id="enquiry-question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={t("enquiry_modal.question_placeholder", {
              defaultValue:
                "np. dodatkowe informacje pomagające dopasować produkt",
            })}
            maxLength={maxLength}
            rows={5}
            required
            disabled={isLoading}
          />

          <div className="enquiry-character-count">
            {question.length}/{maxLength}
          </div>

          <div className="enquiry-information">
            <FiInfo aria-hidden="true" />
            <p>
              {t("enquiry_modal.privacy_notice", {
                defaultValue:
                  "Sprzedający nie skontaktuje się z Tobą bezpośrednio. Jeśli uzupełni ofertę, poinformujemy Cię o jej aktualizacji.",
              })}
            </p>
          </div>

          <div className="enquiry-modal-actions">
            <button
              type="button"
              className="enquiry-cancel-btn"
              onClick={handleClose}
              disabled={isLoading}
            >
              {t("enquiry_modal.actions.cancel", { defaultValue: "Anuluj" })}
            </button>

            <button
              type="submit"
              className="enquiry-submit-btn"
              disabled={!question.trim() || isLoading}
            >
              {isLoading
                ? t("enquiry_modal.actions.submitting", {
                    defaultValue: "Wysyłanie...",
                  })
                : t("enquiry_modal.actions.submit", {
                    defaultValue: "Wyślij zapytanie",
                  })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnquiryModal;
