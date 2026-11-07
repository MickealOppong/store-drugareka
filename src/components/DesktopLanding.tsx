import { useTranslation } from "react-i18next";
import {
  FiArrowRight,
  FiRefreshCw,
  FiShield,
  FiTag,
  FiTruck,
} from "react-icons/fi";
import { Link } from "react-router-dom";

import "../css/DesktopLanding.css";
import { useGetLandingListingQuery, useGetTop6ProductCategoriesQuery } from "../features/api/storeApi";
import { sanitizeCategoryKey } from "../util/util";
import hero from "./../assets/hero-large.png";
import heroSmall from "./../assets/hero-small.png";
import CookieBanner from "./CookieBanner";
import Footer from "./Footer";
import SEO from "./SEO";

export default function DesktopLanding() {
  const { t } = useTranslation();

  // Curated products for the editorial showcase.
  const { data: listings = [] } = useGetLandingListingQuery();
  const { data: topCategories = [] } = useGetTop6ProductCategoriesQuery();

  return (
    <main className="landing-page">
      <SEO
        title="Kupuj i sprzedawaj na Kasoa"
        description="Odkrywaj produkty z drugiej ręki na Kasoa.pl. Przeglądaj oferty, proponuj własną cenę i korzystaj z wygodnej obsługi transakcji."
        canonical="https://kasoa.pl/"
      />

      <div className="landing-center">
        {/* HERO */}
        <section className="hero">
          <div className="hero__content">
            <span className="hero__eyebrow">
              {t("landing.hero.eyebrow")}
            </span>

            <h1>
              {t("landing.hero.title_line1")}
              <br />
              <em>{t("landing.hero.title_line2")}</em>
            </h1>

            <p>{t("landing.hero.description")}</p>

            <div className="hero__actions">
              <Link to="/shop?category=all_0" className="button button--primary">
                {t("landing.hero.cta_shop")}
                <FiArrowRight />
              </Link>

              <Link to="/sell" className="button button--secondary">
                {t("landing.hero.cta_sell")}
              </Link>
            </div>
          </div>

          <div className="hero__visual">
            <div className="hero-card hero-card--large">
              <img
                src={hero}
                alt={t("landing.hero.image_alt", {
                  defaultValue: "Różnorodne produkty z drugiej ręki",
                })}
              />
            </div>

            <div className="hero-card hero-card--small">
              <img src={heroSmall} alt="" />
            </div>

            <div className="hero-floating-card">
              <FiShield />
              <div>
                <strong>{t("landing.hero.floating_badge")}</strong>
                <span>{t("landing.hero.floating_sub")}</span>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST BAR */}
        <section className="trust-bar">
          <div className="trust-item">
            <FiShield />
            <div>
              <strong>{t("landing.trust_bar.verified_title")}</strong>
              <span>{t("landing.trust_bar.verified_sub")}</span>
            </div>
          </div>

          <div className="trust-item">
            <FiTruck />
            <div>
              <strong>{t("landing.trust_bar.delivery_title")}</strong>
              <span>{t("landing.trust_bar.delivery_sub")}</span>
            </div>
          </div>

          <div className="trust-item">
            <FiTag />
            <div>
              <strong>{t("landing.trust_bar.prices_title")}</strong>
              <span>{t("landing.trust_bar.prices_sub")}</span>
            </div>
          </div>

          <div className="trust-item">
            <FiRefreshCw />
            <div>
              <strong>{t("landing.trust_bar.protection_title")}</strong>
              <span>{t("landing.trust_bar.protection_sub")}</span>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        {topCategories.length > 0 && (
          <section className="categories section">
            <div className="section-heading">
              <div>
                <span className="section-eyebrow">
                  {t("landing.categories.eyebrow")}
                </span>
                <h2>{t("landing.categories.title")}</h2>
              </div>

              <Link to="/shop/categories">
                {t("landing.categories.view_all")}
                <FiArrowRight />
              </Link>
            </div>

            <div className="category-grid">
              {topCategories.map((category) => (
                <Link
                  key={category.id}
                  to={`/shop?category=${category.slug}_${category.id}`}
                  className="category-card"
                >
                  <img src={category.image} alt={category.name} loading="lazy" />
                  <div className="category-card__overlay">
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

        {/* EDITORIAL PRODUCT DISCOVERY
            These cards are intentionally simple links: no cart, wishlist or offer actions. */}

        {/* SELLER CTA */}
        <section className="seller-section">
          <div className="seller-section__content">
            <span className="section-eyebrow">
              {t("landing.seller_cta.eyebrow")}
            </span>

            <h2>
              {t("landing.seller_cta.title_line1")}
              <br />
              <em>{t("landing.seller_cta.title_line2")}</em>
            </h2>

            <p>{t("landing.seller_cta.description")}</p>

            <Link to="/sell" className="button button--light">
              {t("landing.seller_cta.cta")}
              <FiArrowRight />
            </Link>
          </div>

          <div className="seller-section__steps">
            <div className="seller-step">
              <span>01</span>
              <div>
                <strong>{t("landing.seller_cta.step1_title")}</strong>
                <p>{t("landing.seller_cta.step1_desc")}</p>
              </div>
            </div>

            <div className="seller-step">
              <span>02</span>
              <div>
                <strong>{t("landing.seller_cta.step2_title")}</strong>
                <p>{t("landing.seller_cta.step2_desc")}</p>
              </div>
            </div>

            <div className="seller-step">
              <span>03</span>
              <div>
                <strong>{t("landing.seller_cta.step3_title")}</strong>
                <p>{t("landing.seller_cta.step3_desc")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="final-cta">
          <span className="section-eyebrow">
            {t("landing.closing_cta.eyebrow", { defaultValue: "DRUGA RĘKA" })}
          </span>

          <h2>
            {t("landing.closing_cta.title_line1", {
              defaultValue: "Kupuj lepiej.",
            })}
            <br />
            {t("landing.closing_cta.title_line2", {
              defaultValue: "Daj przedmiotom drugie życie.",
            })}
          </h2>

          <Link to="/shop?category=all_0" className="button button--primary">
            <span>
              {t("landing.closing_cta.cta", {
                defaultValue: "Odkryj sklep",
              })}
            </span>
            <FiArrowRight />
          </Link>
        </section>

        <Footer />
        <CookieBanner />
      </div>
    </main>
  );
}
