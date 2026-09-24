import { useTranslation } from "react-i18next";
import {
  FiArrowRight,
  FiEdit,
  FiRefreshCw,
  FiShield,
  FiShoppingBag,
  FiTag,
  FiTruck
} from "react-icons/fi";
import { Link } from "react-router-dom";
import '../css/DesktopLanding.css';
import { useGetLandingListingQuery, useGetTop6ProductCategoriesQuery } from "../features/api/storeApi";
import { useAddToCart } from "../hooks/useAddTocart";
import { useAppSelector } from "../store";
import { formatPrice, sanitizeBackendKey } from "../util/util";
import hero from './../assets/hero-large.png';
import heroSmall from './../assets/hero-small.png';
import Footer from "./Footer";
import Loading from "./Loading";


export default function DesktopLanding() {
const {data:topCategories=[],isLoading} = useGetTop6ProductCategoriesQuery()

/**
 *  selected products
 */
const {data:listings=[]} = useGetLandingListingQuery()

/**
 *  ADD TO CART
 */
const {addItemToCart} = useAddToCart()


  //user id
  const userId = useAppSelector((state) => state.userSlice.userId);
  

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
                  <h3> {t(`category_names.${sanitizeBackendKey(category.slug)}`)}</h3>
                  <FiArrowRight />
                </div>
              </Link>
            ))}
          </div>
        </section>

      {/* =====================================================
                NEW ARRIVALS
            ====================================================== */}

<section className="products section" style={{display:listings.length===0?'none':'grid'}}>
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
            {listings.map((product) => (
              <Link
                key={product.listingId}
                to={`/shop/listing/${product.listingId}`}
                className="product-card"
              >
                <div className="product-card__media">
                  <img src={product.media[0].image} alt={product.productName} />
                 {
                  !userId || userId!==product.sellerId? <button
                    className="product-card__favorite"
                    aria-label={`Add ${product.productName} to wishlist`}
                    onClick={(event) => {
                      event.preventDefault();
                      addItemToCart(product.listingId)
                    }}
                  >
                  
          <FiShoppingBag/>
                  </button>: <button
                    className="product-card__favorite"
                    aria-label={`Add ${product.productName} to wishlist`}
                    onClick={(event) => {
                      event.preventDefault();
                      addItemToCart(product.listingId)
                    }}
                  >
                  
          <FiEdit />
                  </button>
                 }
                </div>

                <div className="product-card__info">
                  <span className="product-card__condition">
                     {t(`product_conditions.${sanitizeBackendKey(product.productCondition.toLowerCase())}`)}
                  </span>
                  <h3>{product.productName}</h3>
                  <strong>{formatPrice(product.priceDto.storeNewPrice)} zl</strong>
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
            <span className="section-eyebrow">{t("landing.seller_cta.sub-eyebrow-1")}</span>
            <span className="section-eyebrow">{t("landing.seller_cta.sub-eyebrow-2")}</span>

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

<Footer/>
      </div>
    </main>
  );
}
