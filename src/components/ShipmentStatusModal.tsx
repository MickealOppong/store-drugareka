import React, { useState, type ChangeEvent } from "react";
import { FiCalendar, FiMessageSquare, FiSave, FiTruck, FiX } from "react-icons/fi";
import { useUpdateShipmentStatusMutation } from "../features/api/itemApi";
import type { TShipment } from "../types/TShipment";
import "./../css/ShipmentStatusModal.css";

interface ShipmentStatusModalProps {
  shipment: TShipment;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export interface ShipmentRequest {
  status: string;
  shipmentId: number;
  comment: string;
  trackingNumber: string;
  createdAt:string
}

const SHIPMENT_STATUSES = ["AWAITING_SHIPMENT", "SHIPPED", "DELIVERED", "RETURNED", "CREATED"] as const; 

const ShipmentStatusModal: React.FC<ShipmentStatusModalProps> = ({ shipment, onClose, onSaveSuccess }) => {
  const [updateShipmentStatus, { isLoading: isSaving }] = useUpdateShipmentStatusMutation(); 

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

  // Dynamic flags to control visibility based on your business rules
  const isCreatedOrAwaiting = status === "CREATED" || status === "AWAITING_SHIPMENT";

  const handleFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    if (!status || isSaving) return; 
    setErrorLog(""); 

    // Validation Guard: If explicitly marked as SHIPPED, tracking number is strictly mandatory
    if ((status === "SHIPPED"  || status === "DELIVERED"  ||status === "RETURNED" ) && !trackingNumber.trim()) {
      setErrorLog("Wymagane jest podanie numeru śledzenia przesyłki (np. InPost) przed oznaczeniem paczki jako wysłana.");
      return;
    }

    // Validation Guard: Enforce calendar dates for active post-shipment logistics steps
    if (!isCreatedOrAwaiting && !createdAt) {
      setErrorLog("Proszę wskazać prawidłową datę powiązaną z wybranym statusem przesyłki.");
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
      const response = await updateShipmentStatus(requestPayload);
      
      if (response && !('error' in response)) {
        onSaveSuccess();
      } else if (response && 'error' in response) {
        const errorData = response.error as any;
        setErrorLog(errorData?.data?.error || "Nie udało się zaktualizować statusu przesyłki.");
      }
    } catch (error) {
      console.error("Failed to commit status updates:", error);
      setErrorLog("Wystąpił nieoczekiwany błąd sieciowy po stronie serwera.");
    }
      
  };

  return (
    <div
      className="mn-backdrop mn-backdrop--modal" 
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isSaving) onClose(); 
      }}
    >
      <div className="logistics-modal" role="dialog" aria-modal="true"> 
        
        {/* MODAL HEADER CONTAINER */}
        <div className="logistics-modal__header"> 
          <div className="logistics-modal__title-group">
            <h3 className="logistics-modal__title">
              Aktualizacja Przesyłki #{shipment.id}
            </h3> 
            <span className="logistics-modal__subtitle">Sprzedawca: {shipment.seller}</span> 
          </div>
          <button
            type="button"
            className="logistics-modal__close-btn" 
            onClick={onClose} 
            disabled={isSaving} 
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
                Status logistyczny paczki
              </label>
              <select
                id="modal-shipment-status"
                value={status} 
                onChange={(e) => setStatus(e.target.value)} 
                className="logistics-modal__select" 
                disabled={isSaving} 
              >
                <option value="" disabled>Select status</option> 
                {SHIPMENT_STATUSES.map((stateOption) => (
                  <option key={stateOption} value={stateOption}>
                    {stateOption.replace(/_/g, " ")} 
                  </option>
                ))}
              </select>
            </div>

            {/* FIXED: Date and Tracking options remain hidden for CREATED & AWAITING_SHIPMENT */}
            {status && !isCreatedOrAwaiting && (
              <>
                {/* SHIPPING DATE / CALENDAR DATE INPUT FIELD */}
                <div className="logistics-modal__field">
                  <label htmlFor="modal-shipped-date" className="logistics-modal__label logistics-modal__label--icon">
                    <FiCalendar /> Data powiązana ze statusem (Wysyłka/Doręczenie) <span style={{ color: "#E36B53" }}>*</span>
                  </label>
                  <input
                    id="modal-shipped-date"
                    type="date"
                    value={createdAt as string} 
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setCreatedAt(e.target.value)}
                    className="logistics-modal__input"
                    disabled={isSaving}
                  />
                </div>

                {/* SHIPPING / TRACKING NUMBER INPUT FIELD */}
                <div className="logistics-modal__field">
                  <label htmlFor="modal-tracking-number" className="logistics-modal__label logistics-modal__label--icon">
                    <FiTruck /> Numer śledzenia przesyłki {status === "SHIPPED" && <span style={{ color: "#E36B53" }}>*</span>}
                  </label>
                  <input
                    id="modal-tracking-number"
                    type="text"
                    placeholder="np. 612345678901234567890123 (InPost Waybill)"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="logistics-modal__input"
                    disabled={isSaving}
                  />
                </div>
              </>
            )}

            {/* DAILY WORKFLOW RUN COMMENT NOTE TEXTAREA */}
            <div className="logistics-modal__field"> 
              <label htmlFor="modal-shipment-notes" className="logistics-modal__label logistics-modal__label--icon"> 
                <FiMessageSquare /> Komentarz logistyczny sprzedawcy 
              </label>
              <textarea
                id="modal-shipment-notes"
                rows={3} 
                placeholder="Dodaj wewnętrzną notatkę lub status kurierski..." 
                value={comment} 
                onChange={(e) => setComment(e.target.value)} 
                className="logistics-modal__textarea" 
                disabled={isSaving} 
              />
            </div>
          </div>

          {/* MODAL FOOTER BUTTON LAYER TRIGGERS */}
          <div className="logistics-modal__footer"> 
            <button
              type="button"
              className="data-table__action-link logistics-modal__btn-cancel" 
              onClick={onClose} 
              disabled={isSaving} 
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!status || isSaving} 
              className="cart-address-save-btn logistics-modal__btn-save" 
            >
              <FiSave /> <span>{isSaving ? "Saving..." : "Save Status"}</span> 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShipmentStatusModal;
