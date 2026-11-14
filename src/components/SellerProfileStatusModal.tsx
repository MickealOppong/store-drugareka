
import { useEffect, useState, type ChangeEvent } from "react";
import { FiAlertCircle, FiUser, FiX } from "react-icons/fi";
import "../css/SellerProfileStatusModal.css";
import { useUpdateSellerStatusMutation } from "../features/api/sellerApi";

export interface SellerStatusOption {
  value: string;
  label: string;
}

  const STATUSES = ["BLOCKED", "ACTIVE", "SUSPENDED", "PENDING"] as const; 
const SellerProfileStatusModal = ({
  isOpen,
  sellerId,
  sellerName,
  currentStatus,
  onClose,
}:{  isOpen: boolean;
  sellerId: number;
  sellerName: string;
  currentStatus: string;
  onClose: () => void}) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [reason, setReason] = useState("");


  //upodate hook
  const [updateStatus,{isLoading}] = useUpdateSellerStatusMutation()

  useEffect(() => {
    if (isOpen) {
      setSelectedStatus(currentStatus);
      setReason("");
    }
  }, [isOpen, currentStatus]);

  if (!isOpen) return null;

  const hasChanged = selectedStatus !== currentStatus;

const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!hasChanged || isLoading) return;

  const formData = new FormData();

  formData.append("status", selectedStatus);
  formData.append("reason", reason.trim());
  formData.append("sellerId", String(sellerId));

  try {
    const response = await updateStatus(formData).unwrap();

    if (response === true) {
      onClose();
    }
  } catch (error) {
    console.error("Failed to update seller status:", error);
  }
};
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  

  return (
    <div
      className="seller-status-modal-overlay"
      onMouseDown={handleOverlayClick}
    >
      <div
        className="seller-status-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="seller-status-modal-title"
      >
        <div className="seller-status-modal__header">
          <div>
            <h2 id="seller-status-modal-title">
              Update seller status
            </h2>
            <p>Change the account status for this seller.</p>
          </div>

          <button
            type="button"
            className="seller-status-modal__close"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="seller-status-modal__seller">
            <div className="seller-status-modal__avatar">
              <FiUser />
            </div>

            <div>
              <strong>{sellerName || "Unknown seller"}</strong>
              <span>Seller ID: {sellerId}</span>
            </div>
          </div>

          <div className="seller-status-modal__field">
            <label htmlFor="seller-status">
              Account status
            </label>

            <select
              id="seller-status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              disabled={isLoading}
              required
            >
              {STATUSES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <span className="seller-status-modal__current">
              Current status: <strong>{currentStatus}</strong>
            </span>
          </div>

          <div className="seller-status-modal__field">
            <label htmlFor="seller-status-reason">
              Reason <span>(optional)</span>
            </label>

            <textarea
              id="seller-status-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter a reason for changing this seller's status..."
              rows={3}
              maxLength={500}
              disabled={isLoading}
            />

            <span className="seller-status-modal__character-count">
              {reason.length}/500
            </span>
          </div>

          {selectedStatus !== currentStatus && (
            <div className="seller-status-modal__notice">
              <FiAlertCircle />
              <span>
                You are changing this seller's status from{" "}
                <strong>{currentStatus}</strong> to{" "}
                <strong>{selectedStatus}</strong>.
              </span>
            </div>
          )}

          <div className="seller-status-modal__footer">
            <button
              type="button"
              className="seller-status-modal__cancel"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="seller-status-modal__submit"
              disabled={!hasChanged || isLoading}
            >
              {isLoading ? "Updating..." : "Update status"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerProfileStatusModal;
