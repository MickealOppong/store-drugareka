import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiAlertCircle, FiCheckCircle, FiPackage } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import '../css/DeliveryConfirmation.css';
import { useConfirmDeliveryMutation } from "../features/api/storeApi";

export const DeliveryConfirmation = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); 
  const { t } = useTranslation();

  const [confirmDelivery, { isLoading }] = useConfirmDeliveryMutation();
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleConfirm = async () => {
    if (!token) return;
    
    try {
      setError(null);
      // Fires token string directly to Spring Boot to process escrow updates
      await confirmDelivery(token).unwrap();
      setIsSuccess(true);
    } catch (err: any) {
      setError(err?.data?.message || t("delivery_confirmation.error.fallback"));
    }
  };

  // 🟢 SUCCESS VIEW
  if (isSuccess) {
    return (
      <div className="dc-layout">
        <div className="dc-card">
          <div className="dc-icon dc-icon--success"><FiCheckCircle /></div>
          <h1>{t("delivery_confirmation.success.title")}</h1>
          <p>{t("delivery_confirmation.success.description")}</p>
        </div>
      </div>
    );
  }

  // 🔴 MISSING TOKEN VIEW
  if (!token) {
    return (
      <div className="dc-layout">
        <div className="dc-card">
          <div className="dc-icon dc-icon--error"><FiAlertCircle /></div>
          <h1>{t("delivery_confirmation.invalid_token.title")}</h1>
          <p>{t("delivery_confirmation.invalid_token.description")}</p>
        </div>
      </div>
    );
  }

  // 🟡 ACTION VIEW
  return (
    <div className="dc-layout">
      <div className="dc-card">
        <div className="dc-icon"><FiPackage /></div>
        <span className="dc-eyebrow">{t("delivery_confirmation.action.eyebrow")}</span>
        <h1>{t("delivery_confirmation.action.title")}</h1>
        <p>{t("delivery_confirmation.action.description")}</p>

        {error && <div className="dc-error">{error}</div>}

        <button
          type="button"
          className="dc-btn"
          disabled={isLoading}
          onClick={handleConfirm}
        >
          {isLoading ? t("delivery_confirmation.action.processing") : t("delivery_confirmation.action.confirm_btn")}
        </button>
      </div>
    </div>
  );
};

export default DeliveryConfirmation;
