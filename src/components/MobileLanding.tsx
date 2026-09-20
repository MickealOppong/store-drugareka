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
import '../css/MobileLanding.css';
import { useGetLandingListingQuery, useGetTop6ProductCategoriesQuery } from "../features/api/storeApi";
import { useAppSelector } from "../store";
import { formatPrice, sanitizeBackendKey } from "../util/util";
import hero from './../assets/hero-large.png';
import heroSmall from './../assets/hero-small.png';
import Footer from "./Footer";
import Loading from "./Loading";




const MobileLanding = () => {
  const {data:topCategories=[],isLoading:isCategoriesLoading} = useGetTop6ProductCategoriesQuery()
  

//
const {t}=useTranslation()



/**
 *  selected products
 */
const {data:listings=[]} = useGetLandingListingQuery()
    


  //user id
  const userId = useAppSelector((state) => state.userSlice.userId);
    

        if(isCategoriesLoading){
            return <Loading/>
          }
          

  return (
    <main className="mobile-landing">
    



 <section className="mobile-hero">
        <div className="mobile-hero__content">
          <span className="mobile-hero__eyebrow">
            {t("landing.hero.eyebrow")}
          </span>

          <h1 className="mobile-hero__title">
            {t("landing.hero.title_line1")}
            <br />
            <em>{t("landing.hero.title_line2")}</em>
          </h1>

          <p className="mobile-hero__description">
            {t("landing.hero.description")}
          </p>

          <div className="mobile-hero__actions">
            <Link to="/shop" className="mobile-button mobile-button--primary">
              <span>{t("landing.hero.cta_shop")}</span>
              <FiArrowRight />
            </Link>

            <Link to="/sell" className="mobile-button mobile-button--secondary">
              {t("landing.hero.cta_sell")}
            </Link>
          </div>
        </div>

        {/* HERO IMAGES */}
        <div className="mobile-hero__visual">
          <div className="mobile-hero__image mobile-hero__image--large">
            <img src={hero} alt="Second-hand fashion" />
          </div>

          <div className="mobile-hero__image mobile-hero__image--small">
            <img src={heroSmall} alt="Second-hand accessory" />
          </div>

          <div className="mobile-hero__verified">
            <FiShield />
            <div>
              <strong>{t("landing.hero.floating_badge")}</strong>
              <span>{t("landing.hero.floating_sub")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TRUST
      ====================================================== */}
 <section className="mobile-trust">
        <div className="mobile-trust__item">
          <FiShield />
          <div>
            <strong>{t("landing.trust_bar.verified_title")}</strong>
            <span>{t("landing.trust_bar.verified_sub")}</span>
          </div>
        </div>

        <div className="mobile-trust__item">
          <FiTruck />
          <div>
            <strong>{t("landing.trust_bar.delivery_title")}</strong>
            <span>{t("landing.trust_bar.delivery_sub")}</span>
          </div>
        </div>

        <div className="mobile-trust__item">
          <FiTag />
          <div>
            <strong>{t("landing.trust_bar.prices_title")}</strong>
            <span>{t("landing.trust_bar.prices_sub")}</span>
          </div>
        </div>

        <div className="mobile-trust__item">
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

 <section className="mobile-categories">
        <div className="mobile-section-heading">
          <div>
            <span className="mobile-section-eyebrow">{t("landing.categories.eyebrow")}</span>
            <h2>{t("landing.categories.title")}</h2>
          </div>

          <Link to="/shop/categories">
            {t("landing.categories.view_all")}
            <FiArrowRight />
          </Link>
        </div>

        <div className="mobile-category-list">
          {topCategories.map((category) => (
            <Link
              key={category.id}
              to={`/shop/${category.name}`}
              className="mobile-category-card"
            >
              <img src={category.image} alt={category.name} />
              <div className="mobile-category-card__overlay">
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

  <section className="mobile-products">
        <div className="mobile-section-heading">
          <div>
            <span className="mobile-section-eyebrow">{t("landing.new_arrivals.eyebrow")}</span>
            <h2>{t("landing.new_arrivals.title")}</h2>
          </div>

          <Link to="/shop">
            {t("landing.new_arrivals.view_all")}
            <FiArrowRight />
          </Link>
        </div>

        <div className="mobile-product-grid" style={{display:listings.length===0?'none':'grid'}}>
          {listings.map((product) => (
            <article key={product.listingId} className="mobile-product-card">
              <Link to={`/shop/listing/${product.listingId}`} className="mobile-product-card__media">
                <img src={product.media[0].image} alt={product.productName} />
              </Link>

              {!userId || userId!==product.sellerId?<button
                type="button"
                className="mobile-product-card__favorite"
                aria-label={`Add ${product.productName} to wishlist`}
                onClick={() => {
                  // Add wishlist logic here
                }}
              >
                  <FiShoppingBag />
              </button>:<button
                type="button"
                className="mobile-product-card__favorite"
                aria-label={`Add ${product.productName} to wishlist`}
                onClick={() => {
                  // Add wishlist logic here
                }}
              >
                  <FiEdit />
              </button>
              }

              <Link to={`/listing/${product.listingId}`} className="mobile-product-card__info">
                <span className="mobile-product-card__condition">
                  {t(`product_conditions.${product.productCondition.toLowerCase()}`)}
                </span>
                <h3>{product.productName}</h3>
                <strong>{formatPrice(product.priceDto.sellerNewPrice)} zl</strong>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* =====================================================
          SELLER CTA
      ====================================================== */}

      <section className="mobile-seller">
        <div className="mobile-seller__content">
          <span className="mobile-section-eyebrow">
            {t("landing.seller_cta.eyebrow")}
          </span>
          <span className="mobile-section-eyebrow">
            {t("landing.seller_cta.sub-eyebrow-1")}
          </span>
          <span className="mobile-section-eyebrow">
            {t("landing.seller_cta.sub-eyebrow-2")}
          </span>

          <h2>
            {t("landing.seller_cta.title_line1")}
            <br />
            <em>{t("landing.seller_cta.title_line2")}</em>
          </h2>

          <p>{t("landing.seller_cta.description")}</p>

          <Link to="/sell" className="mobile-button mobile-button--light">
            <span>{t("landing.seller_cta.cta")}</span>
            <FiArrowRight />
          </Link>
        </div>

        <div className="mobile-seller__steps">
          <div className="mobile-seller__step">
            <span>01</span>
            <div>
              <strong>{t("landing.seller_cta.step1_title")}</strong>
              <p>{t("landing.seller_cta.step1_desc")}</p>
            </div>
          </div>

          <div className="mobile-seller__step">
            <span>02</span>
            <div>
              <strong>{t("landing.seller_cta.step2_title")}</strong>

              <p>{t("landing.seller_cta.step2_desc")}</p>
            </div>
          </div>

          <div className="mobile-seller__step">
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

      <section className="mobile-final-cta">
        <span className="mobile-section-eyebrow">DRUGA RĘKA</span>

        <h2>
          Shop better.
          <br />
          Give things another life.
        </h2>

        <Link
          to="/shop"
          className="mobile-button mobile-button--primary"
        >
          <span>Explore the store</span>
          <FiArrowRight />
        </Link>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

<Footer/>
    </main>
  );
};

export default MobileLanding;
