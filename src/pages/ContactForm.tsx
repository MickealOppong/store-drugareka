import React from "react";
import { useTranslation } from "react-i18next";
import { FiExternalLink, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import '../css/ContactForm.css';

export const ContactForm: React.FC = () => {
  const { t } = useTranslation();

  // Build a pre-formatted subject line template loop
  const mailtoUri = "mailto:admin.kasoa.pl@gmail.com";

  return (
    <main className="contact-form-page">
      {/* =====================================================
          HEADER TITLE BLOCK
          ====================================================== */}
      <header className="contact-form-page__header">
        <div>
          <span className="contact-form-page__eyebrow">{t("contact_form.header.eyebrow")}</span>
          <h1 className="contact-form-page__title">{t("contact_form.header.title")}</h1>
          <p className="contact-form-page__description">{t("contact_form.header.description")}</p>
        </div>
      </header>

      {/* =====================================================
          SUPPORT CHANNELS BOARD SELECTION VIEW
          ====================================================== */}
      <section className="contact-form-page__layout-grid contact-form-page__layout-grid--center">
        
        <div className="contact-form-page__info-card contact-form-page__info-card--full">
          <h2 className="contact-form-page__info-title">{t("contact_form.info_card.title")}</h2>
          <p className="contact-form-page__info-description">{t("contact_form.info_card.description")}</p>

          <ul className="contact-form-page__channels-list">
            
            {/* 🚀 THE DIRECT EMAIL HUB TRIGGER */}
            <li className="contact-form-page__channel-item">
              <div className="contact-form-page__icon-wrapper">
                <FiMail />
              </div>
              <div className="contact-form-page__text-wrapper">
                <strong>{t("contact_form.info_card.email_title")}</strong>
                <p>admin.kasoa.pl@gmail.com</p>
                <a 
                  href={mailtoUri} 
                  className="contact-form-page__action-anchor"
                >
                  <span>{t("contact_form.buttons.launch_email")}p</span>
                  <FiExternalLink />
                </a>
              </div>
            </li>
            
            <li className="contact-form-page__channel-item">
              <div className="contact-form-page__icon-wrapper">
                <FiPhone />
              </div>
              <div className="contact-form-page__text-wrapper">
                <strong>{t("contact_form.info_card.call_title")}</strong>
                <p>+48 722 364 131</p>
                <a href="tel:+48722364131" className="contact-form-page__action-anchor">
                  <span>{t("contact_form.buttons.call_now")}</span>
                </a>
              </div>
            </li>
            
            <li className="contact-form-page__channel-item">
              <div className="contact-form-page__icon-wrapper">
                <FiMapPin />
              </div>
              <div className="contact-form-page__text-wrapper">
                <strong>{t("contact_form.info_card.address_title")}</strong>
                <p>{t("contact_form.info_card.address_building")}</p>
                <p>{t("contact_form.info_card.address_street")}</p>
                <p>{t("contact_form.info_card.address_city")}</p>
              </div>
            </li>
          </ul>
        </div>

      </section>
    </main>
  );
};

export default ContactForm;
