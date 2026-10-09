import { useEffect, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { FiAlertTriangle, FiArrowUpLeft, FiCornerDownRight, FiX } from "react-icons/fi";
import { useReturnItemMutation } from "../features/api/itemApi";
import type { TOrdersDto } from "../types/TOrdersDto";
import { formatPrice } from "../util/util";
import "./../css/OrderReturnModal.scss";

export const OrderReturnModal = ({
  isOpen,
  onButtonClick,
  orderData
}: {
  isOpen: boolean;
  onButtonClick: () => void;
  orderData: TOrdersDto;
}) => {
  const { t } = useTranslation();
  const [processReturn, { isLoading, error }] = useReturnItemMutation();

  // state variables
  const [returnReason, setReturnReason] = useState<string>("DAMAGED_GOODS");
  const [buyerComment, setBuyerComment] = useState<string>(" ");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Clean form state hooks upon visibility resets
  useEffect(() => {
    if (!isOpen) {
      setReturnReason("DAMAGED_GOODS");
      setBuyerComment("");
      setValidationError(null);
    }
  }, [isOpen]);

  if (!isOpen || !orderData) return null;

  const handleFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);

    if (returnReason === "OTHER" && !buyerComment.trim()) {
      setValidationError(t("order_return_modal.validation.required_reason"));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("buyerComment", buyerComment);
      formData.append("orderItemId", String(orderData.id));
      formData.append("returnReason", returnReason);

      const response = await processReturn(formData);
      if (response.data) {
        onButtonClick(); // Close cleanly on database update success
      }
    } catch (err: any) {
      console.error("Failed to commit return process state:", err);
    }
  };

  const serverError = error && "data" in error 
    ? (error.data as any)?.message 
    : t("order_return_modal.validation.server_error");

  return (
    <div className="po-modal-overlay" onClick={onButtonClick} role="dialog" aria-modal="true">
      <div className="po-modal po-modal--warning" onClick={(e) => e.stopPropagation()}>
        
        {/* Header Block */}
        <header className="po-modal__header">
          <div className="po-modal__badge po-modal__badge--warning">
            <FiArrowUpLeft /> {t("order_return_modal.header.badge")}
          </div>
          <button type="button" className="po-modal__close-btn" onClick={onButtonClick} aria-label="Close modal">
            <FiX />
          </button>
        </header>

        {/* Action Form Grid Container */}
        <form className="po-modal__form" onSubmit={handleFormSubmit}>
          <div className="po-modal__body">
            <h2 className="po-modal__title">{t("order_return_modal.body.title")}</h2>
            <p className="po-modal__description">{t("order_return_modal.body.description")}</p>

            {/* Financial Ledger Data Metadata Card View */}
            <div className="po-modal__summary-box">
              <div className="po-modal__summary-row">
                <span className="po-modal__summary-label">{t("order_return_modal.body.order_number")}</span>
                <strong className="po-modal__summary-value">#{orderData.orderNumber}</strong>
              </div>
              <div className="po-modal__summary-row po-modal__summary-row--total">
                <span className="po-modal__summary-label">{t("order_return_modal.body.refund_amount")}</span>
                <strong className="po-modal__summary-value po-modal__summary-value--warning">
                  -{formatPrice(orderData.price)} {orderData.currency.toUpperCase()}
                </strong>
              </div>
            </div>

            {/* Reason Selection Dropdown */}
            <div className="po-modal__field">
              <label htmlFor="return-reason-select" className="po-modal__label">{t("order_return_modal.body.reason_label")}</label>
              <select
                id="return-reason-select"
                className="po-modal__select"
                value={returnReason}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setReturnReason(e.target.value)}
                disabled={isLoading}
              >
                <option value="DAMAGED_GOODS">{t("order_return_modal.reasons.damaged_goods")}</option>
                <option value="WRONG_ITEM">{t("order_return_modal.reasons.wrong_item")}</option>
                <option value="NOT_AS_DESCRIBED">{t("order_return_modal.reasons.not_as_described")}</option>
                <option value="OTHER">{t("order_return_modal.reasons.other")}</option>
              </select>
            </div>

            {/* Conditional Sub-input Field Box */}
            {returnReason === "OTHER" && (
              <div className="po-modal__field po-modal__field--transition">
                <label htmlFor="custom-return-comment" className="po-modal__label">
                  <FiCornerDownRight style={{ marginRight: "4px", verticalAlign: "middle" }} /> {t("order_return_modal.body.problem_description")}
                </label>
                <textarea
                  id="custom-return-comment"
                  className="po-modal__textarea"
                  rows={3}
                  placeholder={t("order_return_modal.body.placeholder")}
                  value={buyerComment}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setBuyerComment(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            )}

            {/* Financial Warning Informer Disclaimer Notice Box */}
            <div className="po-modal__warning-box">
              <FiAlertTriangle style={{ flexShrink: 0, marginTop: "2px" }} />
              <p>
                <strong>{t("order_return_modal.body.warning_title")}</strong> {t("order_return_modal.body.warning_text")}
              </p>
            </div>

            {/* Application Crash Banner Errors Grid */}
            {(validationError || error) && (
              <div className="po-modal__alert po-modal__alert--error">
                {validationError || serverError}
              </div>
            )}
          </div>

          {/* Action Control Button Call Row */}
          <footer className="po-modal__actions">
            <button
              type="button"
              className="po-modal__btn po-modal__btn--cancel"
              disabled={isLoading}
              onClick={onButtonClick}
            >
              {t("order_return_modal.actions.cancel")}
            </button>
            <button
              type="submit"
              className="po-modal__btn po-modal__btn--confirm po-modal__btn--warning"
              disabled={isLoading}
            >
              {isLoading ? t("order_return_modal.validation.processing") : t("order_return_modal.actions.confirm")}
            </button>
          </footer>
        </form>

      </div>
    </div>
  );
};

export default OrderReturnModal;
