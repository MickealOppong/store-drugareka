import { useTranslation } from "react-i18next";
import {
  FiArrowRight,
  FiHeart,
  FiRefreshCw,
  FiShield,
  FiTag,
  FiTruck
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { appName } from "../data/data";
import { useGetTop6ProductCategoriesQuery } from "../features/api/storeApi";
import heroSmall from './../assets/hero-small.png';
import hero from './../assets/hero.png';
import './../css/DesktopLanding.css';
import LanguageSwitcher from "./LanguageSwitcher";
import Loading from "./Loading";

const products = [
  {
    id: 1,
    name: "Nike Air Max",
    condition: "Very Good",
    price: "€69",
    image: "https://muvio.pl/images/sv270/126000-127000/Buty-Nike-Air-Force-1-07-Czarne-DZ4514-001_%5B126078%5D_480.jpg",
  },
  {
    id: 2,
    name: "The North Face Jacket",
    condition: "Excellent",
    price: "€79",
    image: "https://img01.ztat.net/article/spp-media-p1/7c9ba579a8d44553b07a1c5b098ecf5f/30d9a7787af0407d8f0af9c5e5428a30.jpg?imwidth=762",
  },
  {
    id: 3,
    name: "BabyBjörn Bliss",
    condition: "Very Good",
    price: "€65",
    image: "https://img.smyk.com/pl/pl/760x/https://bin.smyk.com/pl/pl/media/product/1600/1/babybjrn-bliss-mesh-lezaczek-szary-bez-7657413.jpg",
  },
  {
    id: 4,
    name: "Apple Watch",
    condition: "Good",
    price: "€139",
    image: "https://prod-api.mediaexpert.pl/api/images/gallery_500_500/thumbnails/images/81/8128821/Apple_Watch_Series_11_42mm_GPS_Jet_Black_Aluminum_Sport_Band_Black_PDP_Image_Position_1__pl-PL.jpg",
  },
];
// Helper function to dynamically map status strings into matching JSON keys
const getConditionKey = (condition:string) => {
  if (!condition) return "good";
  return condition.toLowerCase().replace(/\s+/g, '_');
};

export default function DesktopLanding() {
const {data:topCategories=[],isLoading} = useGetTop6ProductCategoriesQuery()

/**
 * Translation
 */
const {t} = useTranslation()

if(isLoading){
  return <Loading/>
}
    
  return (
    <main className="landing-page">
      <div className="landing-center">
              

         
        {/* =====================================================
                  HERO
            ====================================================== */}
        <section className="hero">
          <div className="hero__content">
            <span className="hero__eyebrow">{t("landing.hero.eyebrow")}</span>

            <h1>
              {t("landing.hero.title_line1")}
              <br />
              <em>{t("landing.hero.title_line2")}</em>
            </h1>

            <p>{t("landing.hero.description")}</p>

            <div className="hero__actions">
              <Link to="/shop" className="button button--primary">
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
              <img src={hero} alt="Second-hand fashion" />
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

       {/* =====================================================
                TRUST BAR
            ====================================================== */}

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


      {/* =====================================================
                CATEGORIES
            ====================================================== */}

 <section className="categories section">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">{t("landing.categories.eyebrow")}</span>
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
                to={`/shop?category=${category.slug}`}
                className="category-card"
              >
                <img src={category.image} alt={category.name} />
                <div className="category-card__overlay">
                  <h3>{category.name}</h3>
                  <FiArrowRight />
                </div>
              </Link>
            ))}
          </div>
        </section>

      {/* =====================================================
                NEW ARRIVALS
            ====================================================== */}

<section className="products section">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">{t("landing.new_arrivals.eyebrow")}</span>
              <h2>{t("landing.new_arrivals.title")}</h2>
            </div>

            <Link to="/shop">
              {t("landing.new_arrivals.view_all")}
              <FiArrowRight />
            </Link>
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="product-card"
              >
                <div className="product-card__media">
                  <img src={product.image} alt={product.name} />
                  <button
                    className="product-card__favorite"
                    aria-label={`Add ${product.name} to wishlist`}
                    onClick={(event) => {
                      event.preventDefault();
                    }}
                  >
                    <FiHeart />
                  </button>
                </div>

                <div className="product-card__info">
                  <span className="product-card__condition">
                    {t(`landing.new_arrivals.conditions.${getConditionKey(product.condition)}`)}
                  </span>
                  <h3>{product.name}</h3>
                  <strong>{product.price}</strong>
                </div>
              </Link>
            ))}
          </div>
        </section>

      {/* =====================================================
                SELLER CTA
            ====================================================== */}

  <section className="seller-section">
          <div className="seller-section__content">
            <span className="section-eyebrow">{t("landing.seller_cta.eyebrow")}</span>

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

      {/* =====================================================
                FINAL CTA
            ====================================================== */}

      <section className="final-cta">
        <span className="section-eyebrow">DRUGA RĘKA</span>

        <h2>
          Shop better.
          <br />
          Give things another life.
        </h2>

        <Link
          to="/shop"
          className="button button--primary"
        >
          Explore the store
          <FiArrowRight />
        </Link>
      </section>


      {/* =====================================================
                FOOTER
            ====================================================== */}

      <footer className="landing-footer">
        <div className="landing-footer__brand">
          <Link
            to="/"
            className="brand"
          >
            {appName}<span>.pl</span>
          </Link>

          <p>{t("landing.footer.tagline")}</p>
        </div>

        <div className="landing-footer__links">
          <div>
            <h4>{t("landing.footer.heading_shop")}</h4>

            <Link to="/shop">{t("landing.footer.link_all_products")}</Link>

            <Link to="/shop/categories">{t("landing.footer.link_categories")}</Link>

            <Link to="/shop">{t("landing.footer.link_new_arrivals")}</Link>
          </div>

          <div>
            <h4>{t("landing.footer.heading_sell")}</h4>

            <Link to="/sell">{t("landing.footer.link_how_it_works")}</Link>

            <Link to="/sell">{t("landing.footer.link_start_selling")}</Link>
          </div>

          <div>
            <h4>{t("landing.footer.heading_help")}</h4>

            <Link to="/sell">{t("landing.footer.link_help_centre")}</Link>

            <Link to="/contact">{t("landing.footer.link_contact")}</Link>
          </div>
        </div>
        <LanguageSwitcher/>
      </footer>

      </div>
    </main>
  );
}
