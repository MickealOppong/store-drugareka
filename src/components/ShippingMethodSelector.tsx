import React from "react";
import { useTranslation } from "react-i18next";
import { FiBox, FiCheckCircle, FiTruck } from "react-icons/fi";
import "../css/ShippingMethodSelector.css";

export type ShippingMethod = "LOCKER" | "HOME";

interface ShippingMethodSelectorProps {
  selectedMethod: string
  onChange: (method:string) => void;
}

export const ShippingMethodSelector: React.FC<ShippingMethodSelectorProps> = ({
  selectedMethod,
  onChange,
}) => {
  const { t } = useTranslation();
 


  
  return (
    <div className="mkt-shipping-selector">
      <h3 className="mkt-shipping-selector__title">
        {t("cart.shipping_selector.title", { defaultValue: "Delivery Method" })}
      </h3>
      
      <p className="mkt-shipping-selector__description">
        {t("cart.shipping_selector.description", { 
          defaultValue: "Choose how you want your package dispatched." 
        })}
      </p>

      <div className="mkt-shipping-selector__grid">
        {/* OPTION A: PARCEL LOCKER (PACZKOMAT / INPOST) */}
        <button
          type="button"
          className={`mkt-shipping-option ${selectedMethod === "LOCKER" ? "mkt-shipping-option--selected" : ""}`}
          onClick={() => onChange("LOCKER")}
          aria-pressed={selectedMethod === "LOCKER"}
        >
          <div className="mkt-shipping-option__icon-wrapper">
            <FiBox />
          </div>
          
          <div className="mkt-shipping-option__body">
            <strong className="mkt-shipping-option__label">
              {t("cart.shipping_selector.locker_title", { defaultValue: "Parcel Locker" })}
            </strong>
            <small className="mkt-shipping-option__hint">
              {t("cart.shipping_selector.locker_desc", { defaultValue: "InPost Paczkomat, DPD Pickup" })}
            </small>
          </div>

                 <div className="mkt-shipping-option__check">
            <FiCheckCircle />
          </div>
        </button>

        {/* OPTION B: HOME COURIER DELIVERY */}
        <button
          type="button"
          className={`mkt-shipping-option ${selectedMethod === "COURIER" ? "mkt-shipping-option--selected" : ""}`}
          onClick={() => onChange("COURIER")}
          aria-pressed={selectedMethod === "COURIER"}
        >
          <div className="mkt-shipping-option__icon-wrapper">
            <FiTruck />
          </div>
          
          <div className="mkt-shipping-option__body">
            <strong className="mkt-shipping-option__label">
              {t("cart.shipping_selector.home_title", { defaultValue: "Home Delivery" })}
            </strong>
            <small className="mkt-shipping-option__hint">
              {t("cart.shipping_selector.home_desc", { defaultValue: "Courier directly to your door" })}
            </small>
          </div>

          <div className="mkt-shipping-option__check">
            <FiCheckCircle />
          </div>
        </button>
      </div>
    </div>
  );
};

export default ShippingMethodSelector;
