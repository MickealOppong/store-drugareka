import { useTranslation } from "react-i18next";
import { FiCheckCircle, FiShoppingBag } from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";
import '../css/PaymentConfirmation.css';

export const PaymentConfirmation = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  
  // Extracted session token to display on screen for support cross-references if needed
  const sessionId = searchParams.get("session_id");

  return (
    <main className="success-receipt">
      {/* ==========================================================================
          SUCCESS TRANSACTION RECEIPT EMBED CARD
          ========================================================================== */}
      <section className="success-receipt__card">
        
        {/* Animated Check Vector Hub Icon */}
        <div className="success-receipt__icon-wrapper">
          <FiCheckCircle />
        </div>

        <span className="success-receipt__eyebrow">
          {t("payment_confirmation.success.eyebrow")}
        </span>

        <h1 className="success-receipt__title">
          {t("payment_confirmation.success.title")}
        </h1>

        <p className="success-receipt__description">
          {t("payment_confirmation.success.description")}
        </p>

        {sessionId && (
          <div className="success-receipt__session-badge">
            <span>{t("payment_confirmation.success.session_label")}: </span>
            <code>#{sessionId.substring(0, 12)}...</code>
          </div>
        )}

        <div className="success-receipt__hint-box">
          <strong className="success-receipt__hint-title">
            {t("payment_confirmation.success.next_steps_title")}
          </strong> 
          <p className="success-receipt__hint-desc">
            {t("payment_confirmation.success.next_steps_desc")}
          </p>
        </div>

        <p className="success-receipt__support-text">
          {t("payment_confirmation.success.support_hint")}{" "}
          <a href="mailto:kontakt@kasoa.pl" className="success-receipt__link">
            kontakt@kasoa.pl
          </a>
        </p>

        <Link to="/shop" className="sl-btn sl-btn--primary success-receipt__cta-btn">
          <FiShoppingBag /> {t("payment_confirmation.success.cta_continue")}
        </Link>
      </section>
    </main>
  );
};

export default PaymentConfirmation;
