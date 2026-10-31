import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiAlertCircle, FiCheckCircle, FiClock, FiShoppingBag, FiXCircle } from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";
import { Loading } from "../components";
import '../css/PaymentConfirmation.scss';
import { useGetPaymentStatusQuery } from "../features/api/checkoutApi";

export const PaymentConfirmation: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  
  const orderNumber = searchParams.get("orderNumber") as string;
  const sessionId = searchParams.get('session_id') as string;
  const [shouldPoll, setShouldPoll] = useState(true);
  const [isTimedOut, setIsTimedOut] = useState(false);

  // Unified lookup payload fallback: Resolves either the PayU tracking key or the Stripe Session ID token string
  const paymentId = orderNumber || sessionId;
  

  // Poll every 5 seconds while shouldPoll is active
  const { data: status, isLoading, error } = useGetPaymentStatusQuery(paymentId, {
    pollingInterval: shouldPoll ? 5000 : 0,
    skip: !paymentId // Safety guard: Prevents sending requests if both query params evaluate empty
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    // ⏱ Hard timeout: Stop polling after 1 minute (60000 ms) to prevent infinite loops
    const timeoutTimer = setTimeout(() => {
      setShouldPoll(false);
      
      // If the status isn't PAID, FAILED, or CANCELLED, trigger the timed out fallback layout view
      setIsTimedOut(() => {
        return status !== "PAID" && status !== "CANCELLED" && status !== "FAILED";
       
      });
    }, 60000); 


    return () => clearTimeout(timeoutTimer);
  }, [status]);



  // Stop polling requests as soon as a definitive final state is confirmed from your Spring API
  useEffect(() => {
    if (status === "PAID" || status === "CANCELLED" || status === "FAILED") {
      setShouldPoll(false);
      setIsTimedOut(false); // Reset timeout flag since we reached an explicit outcome
    }
  }, [status]);

  // STATE 1: INITIAL COMPONENT LOADING SPINNER (Awaiting your first network handshake response)
  if (isLoading && !status) {
    return (
      <main className="payment-status payment-status--loading">
        <section className="payment-status__card">
          <Loading />
          <p className="payment-status__loading-text" style={{ marginTop: "1rem", fontWeight: 600 }}>
            {t("payment_confirmation.loading.title", { defaultValue: "Please be patient..." })}
          </p>
          <p className="payment-status__loading-subtext" style={{ color: "var(--color-text-muted, #64748b)" }}>
            {t("payment_confirmation.loading.desc", { defaultValue: "Confirming payment with bank servers..." })}
          </p>
        </section>
      </main>
    );
  }

  // STATE 2: DATABASE SERVER / API NETWORK EXCEPTION FETCH FAILURE
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

  // STATE 3: WEBHOOK ASYNC PROCESSING / TIMEOUT SCREEN
  if (isTimedOut || (status === "PENDING" && shouldPoll)) {
    return (
      <main className="payment-status payment-status--processing">
        <section className="payment-status__card">
          {/* Custom spinning-icon class handles standard smooth rotating animations via CSS */}
          <div className="payment-status__icon-wrapper payment-status__icon-wrapper--processing spinning-icon">
            <FiClock />
          </div>
          <h1 className="payment-status__title">
            {isTimedOut 
              ? t("payment_confirmation.timeout.title", { defaultValue: "Verification taking longer than usual" })
              : t("payment_confirmation.processing.title", { defaultValue: "Processing your payment..." })}
          </h1>
          <p className="payment-status__description">
            {isTimedOut
              ? t("payment_confirmation.timeout.description", { 
                  defaultValue: "We haven't received confirmation from your bank yet. Don't worry, we will notify you by email once it goes through." 
                })
              : t("payment_confirmation.processing.description", { 
                  defaultValue: "Your transaction is currently being finalized with your bank. This can take a few moments. Please do not close or refresh this page." 
                })}
          </p>
          <Link style={{display:'none'}} to="/shop" className="payment-status__cta-btn payment-status__cta-btn--secondary">
            {t("payment_confirmation.processing.cta_shop", { defaultValue: "Return to shop" })}
          </Link>
               <button type="button" className="payment-status__cta-btn" onClick={() => window.location.reload()}>
          {t("payment_confirmation.unknown.cta_refresh", { defaultValue: "Refresh Page View" })}
        </button>
        </section>
      </main>
    );
  }

  // STATE 4: TERMINAL FAILURE FROM WEBHOOK (CANCELLED / REJECTED)
  if (status === "CANCELLED" || status === "FAILED") {
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

  // STATE 5: SUCCESSFUL TRANSACTIONS VERIFIED (PAID / COMPLETED)
  if (status === "PAID") {
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

          {paymentId && (
            <div className="payment-status__session-badge">
              <span>{t("payment_confirmation.success.session_label")}: </span>
              <code>#{paymentId.substring(0,30)}</code>
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

          <Link to="/account/user" className="payment-status__cta-btn">
            <FiShoppingBag /> {t("payment_confirmation.success.cta_continue")}
          </Link>
        </section>
      </main>
    );
  }

  // FALLBACK SECURITY BADGE IF STATE ENGINES EVALUATE UNRECOGNIZED STATUS VALUE
  return (
    <main className="payment-status payment-status--unknown">
      <section className="payment-status__card">
        <div className="payment-status__icon-wrapper payment-status__icon-wrapper--processing">
          <FiAlertCircle />
        </div>
        <h1 className="payment-status__title">
          {t("payment_confirmation.unknown.title", { defaultValue: "We were unable to confirm payment status" })}
        </h1>
        <p className="payment-status__description">
          {t("payment_confirmation.unknown.description", { defaultValue: "Please refresh the page view manually or contact platform support if your balance was deducted." })}
        </p>
        <button type="button" className="payment-status__cta-btn" onClick={() => window.location.reload()}>
          {t("payment_confirmation.unknown.cta_refresh", { defaultValue: "Refresh Page View" })}
        </button>
      </section>
    </main>
  );
};

export default PaymentConfirmation;
