import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiAlertCircle, FiCheckCircle, FiPackage } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import '../css/DeliveryConfirmation.css';
import { useConfirmReturnMutation, useIsReturnConfirmedQuery } from "../features/api/storeApi";

export const ReturnConfirmation = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); 
  const { t } = useTranslation();

  const [confirmDelivery, { isLoading }] = useConfirmReturnMutation()
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  
  //  Distinct state flag to explicitly track token expiration/rejection errors
  const [isTokenInvalid, setIsTokenInvalid] = useState<boolean>(false);

  // Check whether confirmation has already been processed by the user or the cron engine
  const { data: isConfirmed, isLoading: isCheckLoading } = useIsReturnConfirmedQuery(
    token as string,
    { skip: !token, refetchOnMountOrArgChange: true }
  );





  const handleConfirm = async () => {
    if (!token) return;
    
    try {
      setError(null);
      setIsTokenInvalid(false);
      
      // Fires token string directly to Spring Boot to process escrow updates
      const response = await confirmDelivery(token).unwrap();
      
      // If the backend returns a flat false, it means the token is invalid or expired
      if (response === false) {
        setIsTokenInvalid(true);
        return;
      }

      setIsSuccess(response);
    } catch (err: any) {
      // If the background scheduler processed the token right before the click
      if (err?.status === 409 || err?.data?.message?.includes("already confirmed")) {
        setIsSuccess(true); // Treat as active platform success state to prevent alarming the customer
      } else {
        setError(err?.data?.message || t("delivery_confirmation.error.fallback", { defaultValue: "An error occurred during verification." }));
      }
    }
  };

  //  PRE-FLIGHT AUTH LOADING STATE
  if (isCheckLoading) {
    return (
      <div className="dc-layout">
        <div className="dc-card">
          <div className="dc-loading-spinner" />
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

  //  🔴 EXPLICIT EXPIRED / INVALID TOKEN EXCEPTION STATE VIEW
  if (isTokenInvalid) {
    return (
      <div className="dc-layout">
        <div className="dc-card">
          {/* 🚀 THE FIX: Restored the proper error alert circle icon style */}
          <div className="dc-icon dc-icon--error"><FiAlertCircle /></div>
          <h1 style={{ color: "#e11d48" }}>{t("delivery_confirmation.expired_token.title", { defaultValue: "Link Expired or Invalid" })}</h1>
          <p>
            {t("delivery_confirmation.expired_token.description", { 
              defaultValue: "This confirmation link has either expired past its 72-hour window or does not exist in our systems. If the delivery time threshold has passed, this order may have been automatically finalized by the platform background security engines." 
            })}
          </p>
        </div>
      </div>
    );
  }

  // 🟢 ALREADY CONFIRMED STATE VIEW (Proactive Check Output)
  if (isConfirmed) {
    return (
      <div className="dc-layout">
        <div className="dc-card">
          <div className="dc-icon dc-icon--success"><FiCheckCircle /></div>
          <h1>{t("delivery_confirmation.already_confirmed.title", { defaultValue: "Delivery Already Confirmed" })}</h1>
          <p>
            {t("delivery_confirmation.already_confirmed.description", { 
              defaultValue: "This order has already been finalized and the payout funds have been successfully released to the seller." 
            })}
          </p>
        </div>
      </div>
    );
  }

  // 🟢 SUCCESS VIEW (Direct Click Update Output)
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

  // 🟡 ACTION VIEW (Active interaction state awaiting verification token clearance)
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

export default ReturnConfirmation
