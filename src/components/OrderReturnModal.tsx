import { useEffect, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  FiAlertTriangle,
  FiArrowUpLeft,
  FiCornerDownRight,
  FiPlus,
  FiX,
} from "react-icons/fi";
import { useReturnItemMutation } from "../features/api/itemApi";
import type { TOrdersDto } from "../types/TOrdersDto";
import { formatPrice } from "../util/util";
import "./../css/OrderReturnModal.scss";

interface PreviewFile {
  file: File;
  previewUrl: string;
}

export const OrderReturnModal = ({
  isOpen,
  onButtonClick,
  orderData,
}: {
  isOpen: boolean;
  onButtonClick: () => void;
  orderData: TOrdersDto;
}) => {
  const { t } = useTranslation();
  const [processReturn, { isLoading, error }] = useReturnItemMutation();

  // State variables
  const [returnReason, setReturnReason] = useState<string>("DAMAGED_GOODS");
  const [buyerComment, setBuyerComment] = useState<string>("");
  const [selectedImages, setSelectedImages] = useState<PreviewFile[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Clean form state hooks and revoke blob memory URLs upon visibility resets
  useEffect(() => {
    if (!isOpen) {
      selectedImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
      setReturnReason("DAMAGED_GOODS");
      setBuyerComment("");
      setSelectedImages([]);
      setValidationError(null);
    }
  }, [isOpen]);

  if (!isOpen || !orderData) return null;

  // Handle incoming multiple files and assign blob URL anchors
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      const newPreviews: PreviewFile[] = filesArray.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file), // Generates a fast memory layout image source path
      }));

      setSelectedImages((prev) => [...prev, ...newPreviews]);
    }
  };

  // Remove a single image from upload list and clean its memory tracking footprint
  const handleRemoveImage = (indexToRemove: number) => {
    setSelectedImages((prev) => {
      URL.revokeObjectURL(prev[indexToRemove].previewUrl); // Clear memory leak hazards
      return prev.filter((_, idx) => idx !== indexToRemove);
    });
  };

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
      formData.append("orderNumber", orderData.orderNumber);
      

      //  Append images array securely under the exact property your Spring Boot Multipart files list expects
      selectedImages.forEach((img) => {
        formData.append("images", img.file);
      });

      //console.log(Object.fromEntries(formData));
      

      const response = await processReturn(formData);
      
      
      if (response.data) {
        onButtonClick(); 
      }
        
    } catch (err: any) {
      console.error("Failed to commit return process state:", err);
    }
  };

  const serverError =
    error && "data" in error
      ? (error.data as any)?.message
      : t("order_return_modal.validation.server_error");

  return (
    <div
      className="po-modal-overlay"
      onClick={onButtonClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="po-modal po-modal--warning"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Block */}
        <header className="po-modal__header">
          <div className="po-modal__badge po-modal__badge--warning">
            <FiArrowUpLeft /> {t("order_return_modal.header.badge")}
          </div>
          <button
            type="button"
            className="po-modal__close-btn"
            onClick={onButtonClick}
            aria-label="Close modal"
          >
            <FiX />
          </button>
        </header>

        {/* Action Form Grid Container */}
        <form
          className="po-modal__form"
          onSubmit={handleFormSubmit}
        >
          <div className="po-modal__body">
            <h2 className="po-modal__title">
              {t("order_return_modal.body.title")}
            </h2>
            <p className="po-modal__description">
              {t("order_return_modal.body.description")}
            </p>

            {/* Financial Ledger Data Metadata Card View */}
            <div className="po-modal__summary-box">
              <div className="po-modal__summary-row">
                <span className="po-modal__summary-label">
                  {t("order_return_modal.body.order_number")}
                </span>
                <strong className="po-modal__summary-value">
                  #{orderData.orderNumber}
                </strong>
              </div>
              <div className="po-modal__summary-row po-modal__summary-row--total">
                <span className="po-modal__summary-label">
                  {t("order_return_modal.body.refund_amount")}
                </span>
                <strong className="po-modal__summary-value po-modal__summary-value--warning">
                  -{formatPrice(orderData.price)}{" "}
                  {orderData.currency.toUpperCase()}
                </strong>
              </div>
            </div>

            {/* Reason Selection Dropdown */}
            <div className="po-modal__field">
              <label
                htmlFor="return-reason-select"
                className="po-modal__label"
              >
                {t("order_return_modal.body.reason_label")}
              </label>
              <select
                id="return-reason-select"
                className="po-modal__select"
                value={returnReason}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setReturnReason(e.target.value)
                }
                disabled={isLoading}
              >
                <option value="DAMAGED_GOODS">
                  {t("order_return_modal.reasons.damaged_goods")}
                </option>
                <option value="WRONG_ITEM">
                  {t("order_return_modal.reasons.wrong_item")}
                </option>
                <option value="NOT_AS_DESCRIBED">
                  {t("order_return_modal.reasons.not_as_described")}
                </option>
                <option value="OTHER">
                  {t("order_return_modal.reasons.other")}
                </option>
              </select>
            </div>

            {/* 📸 COMPLETE IMAGE COMPONENT BLOCK WITH GRID PREVIEWS */}
            <div className="po-modal__field po-modal__image-section">
              <label className="po-modal__label">
                {t(
                  "order_return_modal.body.select_images_label",
                  "Evidence Images",
                )}
              </label>

              <div className="po-modal__image-wrapper">
                {/* Visual File Selector Action Button Trigger Card */}
                <label
                  htmlFor="return-image-upload"
                  className={`po-modal__upload-trigger ${isLoading ? "po-modal__upload-trigger--disabled" : ""}`}
                >
                  <FiPlus className="po-modal__upload-icon" />
                  <span>
                    {t("order_return_modal.body.upload_btn", "Add Image")}
                  </span>
                  <input
                    id="return-image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={isLoading}
                    style={{ display: "none" }}
                  />
                </label>

                {/* Secure Client Side Mapping Render List Thumbnails */}
                {selectedImages.map((image, index) => (
                  <div
                    key={index}
                    className="po-modal__preview-card"
                  >
                    <img
                      src={image.previewUrl}
                      alt={`Evidence Preview ${index + 1}`}
                      className="po-modal__preview-img"
                    />
                    <button
                      type="button"
                      className="po-modal__preview-remove-btn"
                      onClick={() => handleRemoveImage(index)}
                      disabled={isLoading}
                      aria-label="Remove image"
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Conditional Sub-input Field Box */}
            {returnReason === "OTHER" && (
              <div className="po-modal__field po-modal__field--transition">
                <label
                  htmlFor="custom-return-comment"
                  className="po-modal__label"
                >
                  <FiCornerDownRight
                    style={{ marginRight: "4px", verticalAlign: "middle" }}
                  />{" "}
                  {t("order_return_modal.body.problem_description")}
                </label>
                <textarea
                  id="custom-return-comment"
                  className="po-modal__textarea"
                  rows={3}
                  placeholder={t("order_return_modal.body.placeholder")}
                  value={buyerComment}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setBuyerComment(e.target.value)
                  }
                  disabled={isLoading}
                  required
                />
              </div>
            )}

            {/* Financial Warning Informer Disclaimer Notice Box */}
            <div className="po-modal__warning-box">
              <FiAlertTriangle style={{ flexShrink: 0, marginTop: "2px" }} />
              <p>
                <strong>{t("order_return_modal.body.warning_title")}</strong>{" "}
                {t("order_return_modal.body.warning_text")}
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
    className="po-modal__btn po-modal__btn--warning"
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
