import { useEffect, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { FiAlertCircle, FiCalendar, FiCreditCard, FiX } from "react-icons/fi";

import { useUpdatePayoutStatusMutation } from "../features/api/userApi";
import type { TPayout } from "../types/TPayout";
import type { TResponseDto } from "../types/TResponseDto";
import { formatPrice } from "../util/util";
import "./../css/PayoutStatusModal.scss";

export const PayoutStatusModal = ({
  isOpen,
  onButtonClick,
  data
}: {
  isOpen: boolean;
  onButtonClick: () => void;
  data: TPayout;
}) => {
  const { t } = useTranslation();
  const [updatePayoutStatus, { isLoading, error }] = useUpdatePayoutStatusMutation();

  // INTERACTIVE FORM STATES MODELED
  const [isMarkedAsPaid, setIsMarkedAsPaid] = useState<boolean>(false);
  const [paidAtDate, setPaidAtDate] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Reset form states cleanly whenever the modal closes or changes data profiles
  useEffect(() => {
    if (!isOpen) {
      setIsMarkedAsPaid(false);
      setPaidAtDate("");
      setValidationError(null);
    } else {
      // Default the payment date selector parameter tracking lines to today's date placeholder string
      const todayString = new Date().toISOString().split("T")[0];
      setPaidAtDate(todayString);
    }
  }, [isOpen, data]);

  if (!isOpen) return null;

  const handleFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Safety Enforcements: Block submissions if user checks box but drops date picker variables
    if (!isMarkedAsPaid) {
      setValidationError(t("payout_status_modal.validation.checkbox_required"));
      return;
    }
    if (!paidAtDate) {
      setValidationError(t("payout_status_modal.validation.date_required"));
      return;
    }

    try {
      setValidationError(null);
      
      console.log({ 
        payoutId: data.id, 
        paidAt: paidAtDate ,
      });
      

      const response= await updatePayoutStatus({ 
        payoutId: data.id, 
        paidAt: paidAtDate ,
      }).unwrap();

      const {message,httpStatus} = response as TResponseDto
      if(httpStatus===403){
        setValidationError(message)
      }
      
     if(httpStatus===200){
         // Trigger the default close function passed from the parent grid layout row anchor
      onButtonClick();
     }
    } catch (err:any) {
                
      console.error("Failed to commit administrative payout checklist: ", err);
    }
  };

  const serverError = error && "data" in error 
    ? (error.data as any)?.message 
    : t("payout_status_modal.validation.generic_error");

  return (
    <div className="po-modal-overlay" onClick={onButtonClick} role="dialog" aria-modal="true">
      <div className="po-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Header Block */}
        <header className="po-modal__header">
          <div className="po-modal__badge">
            <FiCreditCard /> {t("payout_status_modal.header.badge")}
          </div>
          <button type="button" className="po-modal__close-btn" onClick={onButtonClick} aria-label="Close modal">
            <FiX />
          </button>
        </header>

        {/* Form Container Element */}
        <form className="po-modal__form" onSubmit={handleFormSubmit}>
          <div className="po-modal__body">
            <h2 className="po-modal__title">{t("payout_status_modal.body.title")}</h2>
            <p className="po-modal__description">
              {t("payout_status_modal.body.description")}
            </p>

            {/* METADATA SUMMARY PANEL: Groups Order, Amount, and Dynamic Currency */}
            <div className="po-modal__summary-box">
              <div className="po-modal__summary-row">
                <span className="po-modal__summary-label">{t("payout_status_modal.summary.order_label")}</span>
                <strong className="po-modal__summary-value">#{data.orderNumber}</strong>
              </div>
              <div className="po-modal__summary-row po-modal__summary-row--total">
                <span className="po-modal__summary-label">{t("payout_status_modal.summary.amount_label")}</span>
                <strong className="po-modal__summary-value po-modal__summary-value--price">
                  {formatPrice(data.amount)} {data.currency.toUpperCase()}
                </strong>
              </div>
            </div>

            {/* INPUT FIELD A: "MARKED AS PAID" CHECKBOX ELEMENT */}
            <div className="po-modal__field">
              <label className="po-modal__checkbox-wrapper">
                <input
                  type="checkbox"
                  className="po-modal__checkbox-input"
                  checked={isMarkedAsPaid}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setIsMarkedAsPaid(e.target.checked)}
                  disabled={isLoading}
                />
                <span className="po-modal__checkbox-label">{t("payout_status_modal.fields.checkbox_label")}</span>
              </label>
            </div>

            {/* "DATE PAID" WITH CONDITIONAL UNLOCK */}
            <div className={`po-modal__field po-modal__field--transition ${!isMarkedAsPaid ? "is-locked" : ""}`}>
              <label htmlFor="payout-date" className="po-modal__label">
                {t("payout_status_modal.fields.date_label")}
              </label>
              <div className="po-modal__input-wrapper">
                <FiCalendar className="po-modal__input-icon" />
                <input
                  id="payout-date"
                  type="date"
                  className="po-modal__input"
                  value={paidAtDate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPaidAtDate(e.target.value)}
                  disabled={!isMarkedAsPaid || isLoading}
                />
              </div>
            </div>

            {/* Protective Warning Banner Injected */}
            <div className="po-modal__warning-box">
              <FiAlertCircle />
              <p>
                <strong>{t("payout_status_modal.warning.bold")}</strong>
                {t("payout_status_modal.warning.text")}
              </p>
            </div>

            {/* Validation & Server Error Handlers Container */}
            {(validationError || error) && (
              <div className="po-modal__alert po-modal__alert--error">
                {validationError || serverError}
              </div>
            )}
          </div>

          {/* Form Actions Footer Segments */}
          <footer className="po-modal__actions">
            <button
              type="button"
              className="po-modal__btn po-modal__btn--cancel"
              disabled={isLoading}
              onClick={onButtonClick}
            >
              {t("payout_status_modal.buttons.cancel")}
            </button>
            
            <button
              type="submit"
              className="po-modal__btn po-modal__btn--confirm"
              disabled={isLoading || !isMarkedAsPaid}
            >
              {isLoading ? t("payout_status_modal.buttons.processing") : t("payout_status_modal.buttons.confirm")}
            </button>
          </footer>
        </form>

      </div>
    </div>
  );
};

export default PayoutStatusModal;
