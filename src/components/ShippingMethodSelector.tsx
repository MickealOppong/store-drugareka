import React from "react";
import { useTranslation } from "react-i18next";
import {
  FiBox,
  FiCheckCircle,
  FiHome,
  FiLayers,
  FiMapPin,
  FiTruck
} from "react-icons/fi";
import "../css/ShippingMethodSelector.css";
import { CHECKOUT_OPTIONS } from "../data/data";

interface ShippingMethodSelectorProps {
  selectedMethod: string;
  onChange: (method: string) => void;
}

/**
 * DYNAMIC CARRIER RESOLUTION LAYER
 * Maps your DELIVERY_OPTIONS lookup tags to semantic courier icons
 */
const getDeliveryIcon = (label: string) => {
  if (!label) return <FiBox />;
  
  const cleanLabel = label.trim().toUpperCase();
  
  // Custom carrier matching matrix routines
  if (cleanLabel.includes("LOCKER") || cleanLabel.includes("INPOST") || cleanLabel.includes("PACZKOMAT")) {
    return <FiBox />; // Parcel lockers / boxes
  }
  if (cleanLabel.includes("HOME") || cleanLabel.includes("COURIER") || cleanLabel.includes("DPD")) {
    return <FiTruck />; // Home delivery vehicles
  }
  if (cleanLabel.includes("PICKUP") || cleanLabel.includes("POINT") || cleanLabel.includes("ZABKA")) {
    return <FiMapPin />; // Local corner shop drop points
  }
  if (cleanLabel.includes("POST") || cleanLabel.includes("POCZTA")) {
    return <FiHome />; // National postal services
  }
  
  return <FiLayers />; // Generic fallback block
};


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
        {CHECKOUT_OPTIONS.map((option) => (
          <button
            key={option.label}
            type="button"
            className={`mkt-shipping-option ${selectedMethod === option.value? "mkt-shipping-option--selected" : ""}`}
            onClick={() => onChange(option.value)}
            aria-pressed={selectedMethod === option.label}
          >
            {/* FIXED: Dynamic Icon Resolution Injection */}
            <div className="mkt-shipping-option__icon-wrapper">
              {getDeliveryIcon(option.label)}
            </div>
            
            <div className="mkt-shipping-option__body">
              <strong className="mkt-shipping-option__label">
              {t(`cart.checkoutOptions.${option.value}.label`)}
              </strong>
              <small className="mkt-shipping-option__hint">
              {t(`cart.checkoutOptions.${option.value}.desc`)}
              </small>
            </div>

            <div className="mkt-shipping-option__check">
              <FiCheckCircle />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShippingMethodSelector;
