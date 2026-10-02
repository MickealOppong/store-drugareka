import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiAlertCircle, FiCheckCircle, FiShoppingBag, FiXCircle } from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";
import { Loading } from "../components";
import '../css/PaymentConfirmation.scss';
import { useGetPaymentStatusQuery } from "../features/api/authApi";

export const PaymentConfirmation: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  
  const orderNumber = searchParams.get("orderNumber") as string;
  const { data: status, isLoading, error } = useGetPaymentStatusQuery(orderNumber);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  //  STATE 1: RUNTIME LOADING SPINNER
  if (isLoading) {
    return <Loading />;
  }

  // ❌ STATE 2: DATABASE SERVER / API NETWORK EXCEPTION FETCH FAILURE
  if (error) {
    return (
      <main className="payment-status payment-status--error">
        <section className="payment-status__card">
          <div className="payment-status__icon-wrapper payment-status__icon-wrapper--error">
            <FiAlertCircle />
          </div>
          <h1 className="payment-status__title">
            {t("payment_confirmation.error.title")}
          </h1>
          <p className="payment-status__description">
            {t("payment_confirmation.error.description")}
          </p>
          <Link to="/cart" className="payment-status__cta-btn payment-status__cta-btn--secondary">
            {t("payment_confirmation.error.cta_back")}
          </Link>
        </section>
      </main>
    );
  }

 

  // ❌ STATE 3: PAYMENT CANCELED / REJECTED STATUS
  if (status === "CANCELLED" ||status === "FAILED") {
    return (
      <main className="payment-status payment-status--cancelled">
        <section className="payment-status__card">
          <div className="payment-status__icon-wrapper payment-status__icon-wrapper--cancelled">
            <FiXCircle />
          </div>
          
          <span className="payment-status__eyebrow">
            {t("payment_confirmation.cancelled.eyebrow")}
          </span>
          <h1 className="payment-status__title">
            {t("payment_confirmation.cancelled.title")}
          </h1>
          <p className="payment-status__description">
            {t("payment_confirmation.cancelled.description")}
          </p>
          
          <Link to="/cart" className="payment-status__cta-btn payment-status__cta-btn--secondary">
            {t("payment_confirmation.cancelled.cta_retry")}
          </Link>
        </section>
      </main>
    );
  }

  //  STATE 4: SUCCESSFUL TRANSACTIONS VERIFIED (PAID / COMPLETED)
  return (
    <main className="payment-status payment-status--success">
      <section className="payment-status__card">
        
        <div className="payment-status__icon-wrapper payment-status__icon-wrapper--success">
          <FiCheckCircle />
        </div>

        <span className="payment-status__eyebrow">
          {t("payment_confirmation.success.eyebrow")}
        </span>

        <h1 className="payment-status__title">
          {t("payment_confirmation.success.title")}
        </h1>

        <p className="payment-status__description">
          {t("payment_confirmation.success.description")}
        </p>

        {orderNumber && (
          <div className="payment-status__session-badge">
            <span>{t("payment_confirmation.success.session_label")}: </span>
            <code>#{orderNumber}</code>
          </div>
        )}

        <div className="payment-status__hint-box">
          <strong className="payment-status__hint-title">
            {t("payment_confirmation.success.next_steps_title")}
          </strong> 
          <p className="payment-status__hint-desc">
            {t("payment_confirmation.success.next_steps_desc")}
          </p>
        </div>

        <p className="payment-status__support-text">
          {t("payment_confirmation.success.support_hint")}{" "}
          <a href="mailto:kontakt@kasoa.pl" className="payment-status__link">
            kontakt@kasoa.pl
          </a>
        </p>

        <Link to="/shop" className="payment-status__cta-btn">
          <FiShoppingBag /> {t("payment_confirmation.success.cta_continue")}
        </Link>
      </section>
    </main>
  );
};

export default PaymentConfirmation;
