import React, { useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next"; // 🚀 Import translation hook tools
import { FiCalendar, FiMessageSquare, FiSave, FiTruck, FiX } from "react-icons/fi";
import '../css/ShipmentStatusModal.css';
import { useUpdateReturnShipmentStatusMutation, useUpdateShipmentStatusMutation } from "../features/api/itemApi";
import type { TShipment } from "../types/TShipment";

interface ShipmentStatusModalProps {
  shipment: TShipment;
  onClose: () => void;
  onSaveSuccess: () => void;
  type: string;
}

export interface ShipmentRequest {
  status: string;
  shipmentId: number;
  comment: string;
  trackingNumber: string;
  createdAt: string;
}

const SHIPMENT_STATUSES = ["AWAITING_SHIPMENT", "SHIPPED", "DELIVERED", "RETURNED", "CREATED"] as const; 

const ShipmentStatusModal: React.FC<ShipmentStatusModalProps> = ({ shipment, onClose, onSaveSuccess, type }) => {
  const { t } = useTranslation(); // 🚀 Active hook anchor instantiation
  const [updateShipmentStatus, { isLoading: isSaving }] = useUpdateShipmentStatusMutation(); 
  const [updateReturnShipmentStatus, { isLoading: isReturnSaving }] = useUpdateReturnShipmentStatusMutation(); 

  const [status, setStatus] = useState<string>(shipment.status || ""); 
  const [trackingNumber, setTrackingNumber] = useState<string>(shipment.trackingNumber || ""); 
  const [comment, setComment] = useState<string>(shipment.comment || ""); 
  
  // Format incoming date or default to today's local date string (YYYY-MM-DD format)
  const [createdAt, setCreatedAt] = useState<string>(
   shipment.shippedAt 
      ? new Date(shipment.shippedAt).toISOString().split("T")[0] 
      : new Date().toISOString().split("T")[0]
  );
  const [errorLog, setErrorLog] = useState<string>(""); 

  const isCreatedOrAwaiting = status === "CREATED" || status === "AWAITING_SHIPMENT";
  const isCurrentlyProcessing = isSaving || isReturnSaving;

  const handleFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    if (!status || isCurrentlyProcessing) return; 
    setErrorLog(""); 

    // Validation Guard: Tracking number mandate check
    if ((status === "SHIPPED" || status === "DELIVERED" || status === "RETURNED") && !trackingNumber.trim()) {
      setErrorLog(t("logistics_modal.validation.tracking_required"));
      return;
    }

    // Validation Guard: Calendar deadline check
    if (!isCreatedOrAwaiting && !createdAt) {
      setErrorLog(t("logistics_modal.validation.date_required"));
      return;
    }

    const requestPayload: ShipmentRequest = {
      status,
      shipmentId: shipment.id,
      comment,
      trackingNumber,
      createdAt,
    };
    
    try {
      let response;
      if (type === 'ACTUAL') {
         response = await updateShipmentStatus(requestPayload);
      }
      if (type === 'RETURN') {
          response = await updateReturnShipmentStatus(requestPayload);
      } 
      
      if (response && !('error' in response)) {
        onSaveSuccess();
      } else if (response && 'error' in response) {
        const errorData = response.error as any;
        console.error(errorData);
        setErrorLog(errorData?.data?.message || t("logistics_modal.validation.server_error"));
      }
    } catch (error) {
      console.error("Failed to commit status updates:", error);
      setErrorLog(t("logistics_modal.validation.network_error"));
    }
  };

  return (
    <div
      className="mn-backdrop mn-backdrop--modal" 
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isCurrentlyProcessing) onClose(); 
      }}
    >
      <div className="logistics-modal" role="dialog" aria-modal="true"> 
        
        {/* MODAL HEADER CONTAINER */}
        <div className="logistics-modal__header"> 
          <div className="logistics-modal__title-group">
            <h3 className="logistics-modal__title">
              {t("logistics_modal.header.title", { id: shipment.id })}
            </h3> 
            <span className="logistics-modal__subtitle">
              {t("logistics_modal.header.seller", { name: shipment.seller })}
            </span> 
          </div>
          <button
            type="button"
            className="logistics-modal__close-btn" 
            onClick={onClose} 
            disabled={isCurrentlyProcessing} 
            aria-label="Close"
          >
            <FiX /> 
          </button>
        </div>

        {/* MODAL EDITING CONTAINER BODY */}
        <form onSubmit={handleFormSubmit} className="logistics-modal__form"> 
          {errorLog && (
            <div className="panel-view__error-box logistics-modal__error">{errorLog}</div> 
          )}

          <div className="logistics-modal__fields-group">
            {/* DYNAMIC SELECT INPUT DROP-DOWN PANEL */}
            <div className="logistics-modal__field"> 
              <label htmlFor="modal-shipment-status" className="logistics-modal__label"> 
                {t("logistics_modal.fields.status_label")}
              </label>
              <select
                id="modal-shipment-status"
                value={status} 
                onChange={(e) => setStatus(e.target.value)} 
                className="logistics-modal__select" 
                disabled={isCurrentlyProcessing} 
              >
                <option value="" disabled>{t("logistics_modal.fields.select_placeholder")}</option> 
                {SHIPMENT_STATUSES.map((stateOption) => (
                  <option key={stateOption} value={stateOption}>
                    {t(`logistics_modal.statuses.${stateOption.toLowerCase()}`, { defaultValue: stateOption.replace(/_/g, " ") })} 
                  </option>
                ))}
              </select>
            </div>

            {/* Date and Tracking options remain hidden for CREATED & AWAITING_SHIPMENT */}
            {status && !isCreatedOrAwaiting && (
              <>
                {/* SHIPPING DATE / CALENDAR DATE INPUT FIELD */}
                <div className="logistics-modal__field">
                  <label htmlFor="modal-shipped-date" className="logistics-modal__label logistics-modal__label--icon">
                    <FiCalendar /> {t("logistics_modal.fields.date_label")} <span style={{ color: "#E36B53" }}>*</span>
                  </label>
                  <input
                    id="modal-shipped-date"
                    type="date"
                    value={createdAt} 
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setCreatedAt(e.target.value)}
                    className="logistics-modal__input"
                    disabled={isCurrentlyProcessing}
                  />
                </div>

                {/* SHIPPING / TRACKING NUMBER INPUT FIELD */}
                <div className="logistics-modal__field">
                  <label htmlFor="modal-tracking-number" className="logistics-modal__label logistics-modal__label--icon">
                    <FiTruck /> {t("logistics_modal.fields.tracking_label")} {status === "SHIPPED" && <span style={{ color: "#E36B53" }}>*</span>}
                  </label>
                  <input
                    id="modal-tracking-number"
                    type="text"
                    placeholder={t("logistics_modal.fields.tracking_placeholder")}
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="logistics-modal__input"
                    disabled={isCurrentlyProcessing}
                  />
                </div>
              </>
            )}

            {/* WORKFLOW NOTES TEXTAREA */}
            <div className="logistics-modal__field"> 
              <label htmlFor="modal-shipment-notes" className="logistics-modal__label logistics-modal__label--icon"> 
                <FiMessageSquare /> {t("logistics_modal.fields.comment_label")}
              </label>
              <textarea
                id="modal-shipment-notes"
                rows={3} 
                placeholder={t("logistics_modal.fields.comment_placeholder")} 
                value={comment} 
                onChange={(e) => setComment(e.target.value)} 
                className="logistics-modal__textarea" 
                disabled={isCurrentlyProcessing} 
              />
            </div>
          </div>

          {/* MODAL FOOTER BUTTON LAYER TRIGGERS */}
          <div className="logistics-modal__footer"> 
            <button
              type="button"
              className="data-table__action-link logistics-modal__btn-cancel" 
              onClick={onClose} 
              disabled={isCurrentlyProcessing} 
            >
              {t("logistics_modal.actions.cancel")}
            </button>
            <button
              type="submit"
              disabled={!status || isCurrentlyProcessing} 
              className="cart-address-save-btn logistics-modal__btn-save" 
            >
              <FiSave /> <span>{isCurrentlyProcessing ? t("logistics_modal.validation.saving") : t("logistics_modal.actions.save")}</span> 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShipmentStatusModal;
