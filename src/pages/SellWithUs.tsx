import { useTranslation } from "react-i18next";
import {
  FiArrowRight,
  FiCheck,
  FiCreditCard,
  FiPackage,
  FiRefreshCw,
  FiShield,
  FiTag,
  FiTruck,
} from "react-icons/fi";
import { Link } from "react-router-dom";

import "../css/SellWithUs.scss";
import { useGetTop6ProductCategoriesQuery } from "../features/api/storeApi";
import { useAppSelector } from "../store";
import { sanitizeCategoryKey } from "../util/util";

import hero from "../assets/hero-large.png";
import heroSmall from "../assets/hero-small.png";
import Footer from "../components/Footer";
import SEO from "../components/SEO";

const SellWithUs = () => {
  const { t } = useTranslation();
  const roles = useAppSelector((state) => state.userSlice.roles) || [];
  const { data: topCategories = [] } = useGetTop6ProductCategoriesQuery();

  const accountPath = roles.includes("ROLE_ADMIN")
    ? "/account/admin/listings"
    : "/account/listings/me/";

  return (
    <main className="sell-with-us-page sell-with-us-page">
      <SEO
        title="Sprzedaj z nami na Kasoa"
  description="Masz przedmioty, których już nie potrzebujesz — używane lub nowe, pozostające w dobrym stanie? Kupuj i sprzedawaj odzież damską i męską, elektronikę, części samochodowe,meble, produkty dla dzieci, dom i ogród oraz wiele więcej."
        canonical="https://kasoa.pl/sell"
      />

      <div className="sell-with-us-page__container">
        {/* DESKTOP LANDING: MARKETPLACE HERO */}
        <section className="sell-with-us-page__marketplace-hero">
          <div className="sell-with-us-page__marketplace-hero__content">
            <span className="sell-with-us-page__marketplace-hero__eyebrow">{t("landing.hero.eyebrow")}</span>

            <h1>
              {t("landing.hero.title_line1")}
              <br />
              <em>{t("landing.hero.title_line2")}</em>
            </h1>

            <p>{t("landing.hero.description")}</p>

            <div className="sell-with-us-page__marketplace-hero__actions">
              <Link to="/shop?category=all_0" className="sell-with-us-page__button sell-with-us-page__button--primary">
                {t("landing.hero.cta_shop")}
                <FiArrowRight />
              </Link>

              <a href="#sell-with-us-details" className="sell-with-us-page__button sell-with-us-page__button--secondary">
                {t("landing.hero.cta_sell")}
              </a>
            </div>
          </div>

          <div className="sell-with-us-page__marketplace-hero__visual">
            <div className="sell-with-us-page__hero-card sell-with-us-page__hero-card--large">
              <img
                src={hero}
                alt={t("landing.hero.image_alt", {
                  defaultValue: "Różnorodne produkty z drugiej ręki",
                })}
              />
            </div>

            <div className="sell-with-us-page__hero-card sell-with-us-page__hero-card--small">
              <img src={heroSmall} alt="" />
            </div>

            <div className="sell-with-us-page__hero-floating-card">
              <FiShield />
              <div>
                <strong>{t("landing.hero.floating_badge")}</strong>
                <span>{t("landing.hero.floating_sub")}</span>
              </div>
            </div>
          </div>
        </section>

        {/* DESKTOP LANDING: TRUST BAR */}
        <section className="sell-with-us-page__trust-bar">
          <div className="sell-with-us-page__trust-item">
            <FiShield />
            <div>
              <strong>{t("landing.trust_bar.verified_title")}</strong>
              <span>{t("landing.trust_bar.verified_sub")}</span>
            </div>
          </div>

          <div className="sell-with-us-page__trust-item">
            <FiTruck />
            <div>
              <strong>{t("landing.trust_bar.delivery_title")}</strong>
              <span>{t("landing.trust_bar.delivery_sub")}</span>
            </div>
          </div>

          <div className="sell-with-us-page__trust-item">
            <FiTag />
            <div>
              <strong>{t("landing.trust_bar.prices_title")}</strong>
              <span>{t("landing.trust_bar.prices_sub")}</span>
            </div>
          </div>

          <div className="sell-with-us-page__trust-item">
            <FiRefreshCw />
            <div>
              <strong>{t("landing.trust_bar.protection_title")}</strong>
              <span>{t("landing.trust_bar.protection_sub")}</span>
            </div>
          </div>
        </section>

        {/* DESKTOP LANDING: CATEGORIES */}
        {topCategories.length > 0 && (
          <section className="sell-with-us-page__categories sell-with-us-page__section">
            <div className="sell-with-us-page__section-heading">
              <div>
                <h2>{t("landing.categories.title")}</h2>
              </div>

              <Link to="/shop/categories">
                {t("landing.categories.view_all")}
                <FiArrowRight />
              </Link>
            </div>

            <div className="sell-with-us-page__category-grid">
              {topCategories.map((category) => (
                <Link
                  key={category.id}
                  to={`/shop?category=${category.slug}_${category.id}#category-products`}
                  className="sell-with-us-page__category-card"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                  />
                  <div className="sell-with-us-page__category-card__overlay">
                    <h3>
                      {t(
                        `categories.${sanitizeCategoryKey(category.name)}.name`,
                      )}
                    </h3>
                    <FiArrowRight />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* SELL PAGE: SELLER HERO */}
        <section className="sell-with-us-page__hero" id="sell-with-us-details">
          <div className="sell-with-us-page__hero-content">
            <span className="sell-with-us-page__eyebrow">
              {t("sell_page.hero.eyebrow")}
            </span>

            <h2 className="sell-with-us-page__hero-title">
              {t("sell_page.hero.title_line1")}
              <br />
              {t("sell_page.hero.title_line2")}
            </h2>

            <p className="sell-with-us-page__lead">{t("sell_page.hero.lead")}</p>

            <div className="sell-with-us-page__actions">
              <Link
                to={accountPath}
                className="sell-with-us-page__button sell-with-us-page__button--primary"
              >
                {t("sell_page.hero.cta_primary")}
                <FiArrowRight />
              </Link>

              <a
                href="#sell-with-us-process"
                className="sell-with-us-page__button sell-with-us-page__button--secondary"
              >
                {t("sell_page.hero.cta_secondary")}
              </a>
            </div>
          </div>

          <div className="sell-with-us-page__hero-visual" aria-hidden="true">
            <div className="sell-with-us-page__visual-card">
              <span className="sell-with-us-page__visual-icon">
                <FiPackage />
              </span>
              <span className="sell-with-us-page__visual-label">
                {t("sell_page.hero.composition_label")}
              </span>
              <strong>{t("sell_page.hero.composition_text")}</strong>
            </div>

            <div className="sell-with-us-page__floating-card">
              <span className="sell-with-us-page__floating-icon">
                <FiCheck />
              </span>
              <span>
                <strong>{t("sell_page.hero.badge_title")}</strong>
                <small>{t("sell_page.hero.badge_sub")}</small>
              </span>
            </div>
          </div>
        </section>

        {/* DESKTOP LANDING: SELLER MESSAGE AND THREE STEPS */}
        <section className="sell-with-us-page__intro">
          <div className="sell-with-us-page__intro-copy">
            <span className="sell-with-us-page__eyebrow">
              {t("landing.seller_cta.eyebrow")}
            </span>
            <h2>
              {t("landing.seller_cta.title_line1")}
              <br />
              <em>{t("landing.seller_cta.title_line2")}</em>
            </h2>
            <p>{t("landing.seller_cta.description")}</p>
            <Link
              to={accountPath}
              className="sell-with-us-page__button sell-with-us-page__button--primary"
            >
              {t("landing.seller_cta.cta")}
              <FiArrowRight />
            </Link>
          </div>

          <div className="sell-with-us-page__intro-steps">
            {[1, 2, 3].map((step) => (
              <article className="sell-with-us-page__intro-step" key={step}>
                <span>{String(step).padStart(2, "0")}</span>
                <div>
                  <strong>{t(`landing.seller_cta.step${step}_title`)}</strong>
                  <p>{t(`landing.seller_cta.step${step}_desc`)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* SELL PAGE: FOUR-STEP PROCESS */}
        <section
          className="sell-with-us-page__section"
          id="sell-with-us-process"
        >
          <header className="sell-with-us-page__section-heading">
            <span className="sell-with-us-page__eyebrow">
              {t("sell_page.process.eyebrow")}
            </span>
            <h2>{t("sell_page.process.title")}</h2>
            <p>{t("sell_page.process.description")}</p>
          </header>

          <div className="sell-with-us-page__process-grid">
            {[
              {
                number: "01",
                icon: <FiPackage />,
                title: "step1_title",
                description: "step1_desc",
              },
              {
                number: "02",
                icon: <FiTag />,
                title: "step2_title",
                description: "step2_desc",
              },
              {
                number: "03",
                icon: <FiTruck />,
                title: "step3_title",
                description: "step3_desc",
              },
              {
                number: "04",
                icon: <FiCreditCard />,
                title: "step4_title",
                description: "step4_desc",
              },
            ].map((step) => (
              <article
                className="sell-with-us-page__process-card"
                key={step.number}
              >
                <div className="sell-with-us-page__process-meta">
                  <span>{step.number}</span>
                  <i>{step.icon}</i>
                </div>
                <h3>{t(`sell_page.process.${step.title}`)}</h3>
                <p>{t(`sell_page.process.${step.description}`)}</p>
              </article>
            ))}
          </div>
        </section>

        {/* SELL PAGE: BENEFITS */}
        <section className="sell-with-us-page__benefits">
          <div className="sell-with-us-page__benefits-copy">
            <span className="sell-with-us-page__eyebrow">
              {t("sell_page.benefits.eyebrow")}
            </span>
            <h2>{t("sell_page.benefits.title")}</h2>
            <p className="sell-with-us-page__section-description">
              {t("sell_page.benefits.description")}
            </p>

            <h3>{t("sell_page.benefits.sub_title-1")}</h3>
            <p className="sell-with-us-page__section-description">
              {t("sell_page.benefits.sub_title-2")}
            </p>

            <ul className="sell-with-us-page__benefit-list">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <li key={item}>
                  <FiCheck />
                  <span>{t(`sell_page.benefits.bullet${item}`)}</span>
                </li>
              ))}
            </ul>

            <Link
              to={accountPath}
              className="sell-with-us-page__button sell-with-us-page__button--primary"
            >
              {t("sell_page.benefits.cta")}
              <FiArrowRight />
            </Link>
          </div>

          <div className="sell-with-us-page__shield-card">
            <FiShield />
            <h3>{t("sell_page.benefits.shield_title")}</h3>
            <strong>{t("sell_page.benefits.shield_bold")}</strong>
            <p>{t("sell_page.benefits.shield_desc")}</p>
          </div>
        </section>

        {/* SELL PAGE: FEES / PRICING */}
        <section className="sell-with-us-page__section sell-with-us-page__pricing">
          <header className="sell-with-us-page__section-heading">
            <span className="sell-with-us-page__eyebrow">
              {t("sell_page.pricing.eyebrow")}
            </span>
            <h2>{t("sell_page.pricing.title")}</h2>
            <p>{t("sell_page.pricing.description")}</p>
          </header>

          <div className="sell-with-us-page__pricing-flow">
            <article className="sell-with-us-page__pricing-card">
              <span>{t("sell_page.pricing.seller_card_tag")}</span>
              <strong className="sell-with-us-page__seller-price">X</strong>
              <p>{t("sell_page.pricing.seller_card_desc")}</p>
            </article>

            <div className="sell-with-us-page__pricing-arrow">
              <FiArrowRight />
            </div>

            <article className="sell-with-us-page__pricing-card sell-with-us-page__pricing-card--highlight">
              <span>{t("sell_page.pricing.store_card_tag")}</span>
              <strong>{t("sell_page.pricing.store_card_price")}</strong>
              <p>{t("sell_page.pricing.store_card_desc")}</p>
            </article>
          </div>
        </section>

        {/* SELL PAGE: FINAL CTA */}
        <section className="sell-with-us-page__final">
          <span className="sell-with-us-page__eyebrow">
            {t("sell_page.final_cta.eyebrow")}
          </span>
          <h2>{t("sell_page.final_cta.title")}</h2>
          <p>{t("sell_page.final_cta.description")}</p>
          <Link
            to={accountPath}
            className="sell-with-us-page__button sell-with-us-page__button--primary"
          >
            {t("sell_page.final_cta.cta")}
            <FiArrowRight />
          </Link>
        </section>

      
      </div>

      <Footer />
    </main>
  );
};

export default SellWithUs;
