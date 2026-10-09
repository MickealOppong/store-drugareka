import { type ChangeEvent } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import { useCancelOrderMutation } from "../features/api/itemApi";
import type { TOrdersDto } from "../types/TOrdersDto";
import { formatPrice } from "../util/util";
import "./../css/OrderCancelModal.scss";



export const OrderCancelModal= ({orderData,isOpen,onButtonClick}:{orderData:TOrdersDto,isOpen:boolean,onButtonClick:()=>void}) => {
  const [cancelOrder, { isLoading, error}] = useCancelOrderMutation();

  console.log(orderData);
  

  if (!isOpen || !orderData) return null;

  const handleFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Direct backend cancellation call
    const response =await cancelOrder(orderData.id);
    
    
    if (response && !('error' in response)) {
        onButtonClick();
      }
    } catch (err) {
      console.error("Failed to commit order cancellation:", err);
    }
  };

  const serverError = error && "data" in error 
    ? (error.data as any)?.message 
    : "Wystąpił nieoczekiwany błąd serwera podczas anulowania transakcji.";

  return (
    <div className="po-modal-overlay" onClick={onButtonClick} role="dialog" aria-modal="true">
      <div className="po-modal po-modal--danger" onClick={(e) => e.stopPropagation()}>
        
        {/* Header Block */}
        <header className="po-modal__header">
          <div className="po-modal__badge po-modal__badge--danger">
            <FiAlertTriangle /> Anulowanie Zamówienia
          </div>
          <button type="button" className="po-modal__close-btn" onClick={onButtonClick} aria-label="Close modal">
            <FiX />
          </button>
        </header>

        {/* Action Form Container */}
        <form className="po-modal__form" onSubmit={handleFormSubmit}>
          <div className="po-modal__body">
            <h2 className="po-modal__title">Czy na pewno chcesz anulować to zamówienie?</h2>
            <p className="po-modal__description">
              Potwierdzenie tej operacji natychmiast przywróci asortyment na witrynę sklepu i oznaczy płatność do zwrotu.
            </p>

            {/*  ISOLATED SUMMARY PANEL: Displays ONLY order number and amount */}
            <div className="po-modal__summary-box">
              <div className="po-modal__summary-row">
                <span className="po-modal__summary-label">Numer Zamówienia:</span>
                <strong className="po-modal__summary-value">#{orderData.orderNumber}</strong>
              </div>
              <div className="po-modal__summary-row po-modal__summary-row--total">
                <span className="po-modal__summary-label">Kwota do Zwrotu:</span>
                <strong className="po-modal__summary-value po-modal__summary-value--danger">
                  -{formatPrice(orderData.price+orderData.shipping)} {orderData.currency.toUpperCase()}
                </strong>
              </div>
            </div>

            {/* Error Message Display Handler */}
            {error && (
              <div className="po-modal__alert po-modal__alert--error">
                {serverError}
              </div>
            )}
          </div>

          {/* Form Actions Footer */}
          <footer className="po-modal__actions">
            <button
              type="button"
              className="po-modal__btn po-modal__btn--cancel"
              disabled={isLoading}
              onClick={onButtonClick}
            >
              Cofnij
            </button>
            <button
              type="submit"
              className="po-modal__btn po-modal__btn--confirm po-modal__btn--danger"
              disabled={isLoading}
            >
              {isLoading ? "Przetwarzanie..." : "Potwierdź Anulowanie"}
            </button>
          </footer>
        </form>

      </div>
    </div>
  );
};

export default OrderCancelModal;
