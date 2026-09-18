import { useTranslation } from "react-i18next";
import {
  FiArrowRight,
  FiCheck,
  FiCreditCard,
  FiPackage,
  FiShield,
  FiTag,
  FiTruck
} from "react-icons/fi";
import { Link } from "react-router-dom";

import { useAppSelector } from "../store";
import "./../css/Sell.css"; // Imports the newly structured, isolated styles cleanly

const Sell = () => {
  // Default to empty array fallback to prevent guest user NullPointerExceptions
  const roles = useAppSelector((state) => state.userSlice.roles) || [];
  const { t } = useTranslation();

  const buttonRedirectPath = roles.includes("ROLE_ADMIN") 
    ? "/account/admin" 
    : "/account/user/";

  return (
    <main className="sl-view">

      {/* =====================================================
          1. HERO HEADER AREA
      ====================================================== */}
      <section className="sl-hero">
        <div className="sl-hero__content">
          <span className="sl-eyebrow">{t("sell_page.hero.eyebrow")}</span>
          <h1 className="sl-hero__title">
            {t("sell_page.hero.title_line1")}<br />{t("sell_page.hero.title_line2")}
          </h1>
          <p className="sl-hero__lead">
            {t("sell_page.hero.lead")}
          </p>

          <div className="sl-hero__actions">
            <Link to={buttonRedirectPath} className="sl-btn sl-btn--primary">
              {t("sell_page.hero.cta_primary")} <FiArrowRight />
            </Link>
            <a href="#how-it-works" className="sl-btn sl-btn--secondary">
              {t("sell_page.hero.cta_secondary")}
            </a>
          </div>
        </div>

        <div className="sl-hero__visual">
          <div className="sl-composition-card sl-composition-card--large">
            <div className="sl-composition-card__icon-wrap">
              <FiPackage />
            </div>
            <span className="sl-composition-card__label">{t("sell_page.hero.composition_label")}</span>
            <strong className="sl-composition-card__text">{t("sell_page.hero.composition_text")}</strong>
          </div>

          <div className="sl-floating-badge">
            <div className="sl-floating-badge__icon">
              <FiCheck />
            </div>
            <div className="sl-floating-badge__info">
              <strong>{t("sell_page.hero.badge_title")}</strong>
              <span>{t("sell_page.hero.badge_sub")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          2. HOW IT WORKS GRID TIMELINE
      ====================================================== */}
      <section className="sl-process" id="how-it-works">
        <header className="sl-header-center">
          <span className="sl-eyebrow">{t("sell_page.process.eyebrow")}</span>
          <h2 className="sl-section-title">{t("sell_page.process.title")}</h2>
          <p className="sl-section-desc">
            {t("sell_page.process.description")}
          </p>
        </header>

        <div className="sl-process__grid">
          <article className="sl-step">
            <div className="sl-step__meta-bar">
              <span className="sl-step__count">01</span>
              <div className="sl-step__icon"><FiPackage /></div>
            </div>
            <h3 className="sl-step__title">{t("sell_page.process.step1_title")}</h3>
            <p className="sl-step__desc">
              {t("sell_page.process.step1_desc")}
            </p>
          </article>

          <article className="sl-step">
            <div className="sl-step__meta-bar">
              <span className="sl-step__count">02</span>
              <div className="sl-step__icon"><FiTag /></div>
            </div>
            <h3 className="sl-step__title">{t("sell_page.process.step2_title")}</h3>
            <p className="sl-step__desc">
              {t("sell_page.process.step2_desc")}
            </p>
          </article>

          <article className="sl-step">
            <div className="sl-step__meta-bar">
              <span className="sl-step__count">03</span>
              <div className="sl-step__icon"><FiTruck /></div>
            </div>
            <h3 className="sl-step__title">{t("sell_page.process.step3_title")}</h3>
            <p className="sl-step__desc">
              {t("sell_page.process.step3_desc")}
            </p>
          </article>

          <article className="sl-step">
            <div className="sl-step__meta-bar">
              <span className="sl-step__count">04</span>
              <div className="sl-step__icon"><FiCreditCard /></div>
            </div>
            <h3 className="sl-step__title">{t("sell_page.process.step4_title")}</h3>
            <p className="sl-step__desc">
              {t("sell_page.process.step4_desc")}
            </p>
          </article>
        </div>
      </section>

      {/* =====================================================
          3. SELLER BENEFITS split block
      ====================================================== */}
      <section className="sl-benefits">
        <div className="sl-benefits__content">
          <span className="sl-eyebrow">{t("sell_page.benefits.eyebrow")}</span>
          
          <h2 className="sl-section-title">
            {t("sell_page.benefits.title")}
          </h2>
          <p className="sl-section-desc">
            {t("sell_page.benefits.description")}
          </p>

          <ul className="sl-benefits__list">
            <li><FiCheck /> <span>{t("sell_page.benefits.bullet1")}</span></li>
            <li><FiCheck /> <span>{t("sell_page.benefits.bullet2")}</span></li>
            <li><FiCheck /> <span>{t("sell_page.benefits.bullet3")}</span></li>
            <li><FiCheck /> <span>{t("sell_page.benefits.bullet4")}</span></li>
          </ul>

          <Link to={buttonRedirectPath} className="sl-btn sl-btn--primary">
            {t("sell_page.benefits.cta")} <FiArrowRight />
          </Link>
        </div>

        <div className="sl-benefits__visual">
          <div className="sl-benefits-shield-card">
            <FiShield />
            <h3>{t("sell_page.benefits.shield_title")}</h3>
            <strong>{t("sell_page.benefits.shield_bold")}</strong>
            <p>{t("sell_page.benefits.shield_desc")}</p>
          </div>
        </div>
      </section>

      {/* =====================================================
          4. COHESIVE FEES MODEL ESTIMATOR
      ====================================================== */}
      <section className="sl-model">
        <header className="sl-header-center">
          <span className="sl-eyebrow">{t("sell_page.pricing.eyebrow")}</span>
          <h2 className="sl-section-title">{t("sell_page.pricing.title")}</h2>
          <p className="sl-section-desc">
            {t("sell_page.pricing.description")}
          </p>
        </header>

        <div className="sl-model__flex">
          <div className="sl-model-card">
            <span className="sl-model-card__tag">{t("sell_page.pricing.seller_card_tag")}</span>
            <strong className="sl-model-card__price" style={{ fontStyle: "italic", fontFamily: "serif" }}>X</strong>
            <p className="sl-model-card__text">
              {t("sell_page.pricing.seller_card_desc")}
            </p>
          </div>

          <div className="sl-model__arrow-divider">
            <FiArrowRight />
          </div>

          <div className="sl-model-card sl-model-card--highlight">
            <span className="sl-model-card__tag">{t("sell_page.pricing.store_card_tag")}</span>
            <strong className="sl-model-card__price">{t("sell_page.pricing.store_card_price")}</strong>
            <p className="sl-model-card__text">
              {t("sell_page.pricing.store_card_desc")}
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          6. TERMINAL FINAL CALL TO ACTION
      ====================================================== */}
      <section className="sl-final-cta">
        <span className="sl-eyebrow">{t("sell_page.final_cta.eyebrow")}</span>
        <h2 className="sl-final-cta__title">{t("sell_page.final_cta.title")}</h2>
        <p className="sl-final-cta__desc">{t("sell_page.final_cta.description")}</p>
        <Link to={buttonRedirectPath} className="sl-btn sl-btn--primary">
          {t("sell_page.final_cta.cta")} <FiArrowRight />
        </Link>
      </section>
    </main>
  );
};

export default Sell;
