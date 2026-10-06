import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiAlertCircle, FiCheck, FiX } from "react-icons/fi";
import "../css/CookieBanner.scss"; // Attach to your global dashboard layouts
import { CookieService } from "../util/util";

export const CookieBanner: React.FC = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Check if the user has already saved a consent choice previously
    const storedConsent = CookieService.get("kasoa_cookie_consent");
    
    if (!storedConsent) {
      // Prompt user after a slight delay to allow page rendering to finish smoothly
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    // Tracks all marketing and analytics channels
    CookieService.set("kasoa_cookie_consent", "all", 180);
    setIsVisible(false);
    // Trigger initialization loops for Google Analytics, Meta Pixel, etc. here
  };

  const handleRejectAll = () => {
    //  Denies tracking, keeping ONLY essential session cookies active
    CookieService.set("kasoa_cookie_consent", "essential_only", 180);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-consent-banner" role="alert" aria-live="assertive">
      <div className="cookie-consent-banner__container">
        <div className="cookie-consent-banner__content">
          <div className="cookie-consent-banner__icon-box">
            <FiAlertCircle />
          </div>
          <div className="cookie-consent-banner__text-frame">
            <h4 className="cookie-consent-banner__title">
              {t("cookie_banner.title", { defaultValue: "We Value Your Privacy" })}
            </h4>
            <p className="cookie-consent-banner__description">
              {t("cookie_banner.description", { 
                defaultValue: "Kasoa.pl uses cookies to keep you safely logged in, maintain shopping carts, and optimize marketplace speed. You can customize your preferences or decline tracking entirely." 
              })}
            </p>
          </div>
        </div>

        <div className="cookie-consent-banner__actions">
          <button 
            type="button" 
            className="cookie-consent-banner__btn cookie-consent-banner__btn--reject"
            onClick={handleRejectAll}
          >
            <FiX />
            <span>{t("cookie_banner.btn_reject", { defaultValue: "Essential Only" })}</span>
          </button>
          <button 
            type="button" 
            className="cookie-consent-banner__btn cookie-consent-banner__btn--accept"
            onClick={handleAcceptAll}
          >
            <FiCheck />
            <span>{t("cookie_banner.btn_accept", { defaultValue: "Accept All" })}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
