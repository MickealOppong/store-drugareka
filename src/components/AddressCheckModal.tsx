import React from "react";
import { useTranslation } from "react-i18next";
import { FiAlertTriangle, FiArrowRight, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router";
import "../css/AddressCheckModal.scss";

interface AddressCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddressCheckModal: React.FC<AddressCheckModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleRouteToProfile = () => {
    onClose();
    // Routes the merchant straight to their private account settings dashboard panel
    navigate("/account/me"); 
  };

  return (
    <div className="address-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="addr-modal-title">
      <div className="address-modal-card">
        <div className="address-modal-card__header">
          <div className="address-modal-card__icon-box">
            <FiAlertTriangle />
          </div>
          <h3 id="addr-modal-title" className="address-modal-card__title">
            {t("address_modal.title", { defaultValue: "Shipping Address Required" })}
          </h3>
        </div>

        <div className="address-modal-card__body">
          <p className="address-modal-card__text">
            {t("address_modal.message", {
              defaultValue: "To list an item on Kasoa.pl, you must first provide a valid pickup/shipping address inside your seller profile. This ensures buyers can accurately calculate logistics rates.",
            })}
          </p>
        </div>

        <div className="address-modal-card__footer">
          <button type="button" className="address-modal-card__btn address-modal-card__btn--cancel" onClick={onClose}>
            {t("address_modal.btn_close", { defaultValue: "Go Back" })}
          </button>
          
          <button type="button" className="address-modal-card__btn address-modal-card__btn--action" onClick={handleRouteToProfile}>
            <FiUser />
            <span>{t("address_modal.btn_profile", { defaultValue: "Add Address Now" })}</span>
            <FiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressCheckModal;
