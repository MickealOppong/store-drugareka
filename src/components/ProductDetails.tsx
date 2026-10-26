import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineSafety } from "react-icons/ai";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiHeart,
  FiRefreshCw,
  FiShield,
  FiShoppingBag,
  FiTag,
  FiTruck,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import "../css/ProductDetails.css";

import {
  useAddWishListMutation,
  useGetWishListsQuery,
} from "../features/api/itemApi";
import { useGetListingBySlugQuery } from "../features/api/storeApi";
import { useAppSelector } from "../store";
import type { TListTrans } from "../types/TListTrans";
import { formatPrice, sanitizeCategoryKey } from "../util/util";
import Footer from "./Footer";
import Loading from "./Loading";
import MakeOfferModal from "./MakeOfferModal";
import SEO from "./SEO";

// Helper function to safely translate backend condition data strings to localized dictionary keys
const getConditionSlug = (condition: string) => {
  if (!condition) return "good";
  return condition.trim().toLowerCase().replace(/\s+/g, "_");
};

const ProductDetails = () => {
  const { slug } = useParams<string>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  //userId to prevent seller buying own product
  const userId = useAppSelector((state) => state.userSlice.userId);
  const username = useAppSelector((state) => state.userSlice.email);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalData, setModalData] = useState<{
    name: string;
    id: number;
    currentPrice: number;
  } | null>(null);

  const [addToWish] = useAddWishListMutation();
  const { data: wishlist = [] } = useGetWishListsQuery();
  const wishlists = wishlist.map((item) => item.productSlug);
  const isWishlisted = wishlists.includes(String(slug));

  // Local interface states for media interactions
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);

  /**
   * fetch product
   */
  const { data: product, isLoading: productLoading } = useGetListingBySlugQuery(String(slug));

  const toggleWishlist = async (listingId: number) => {
    if (!username) return navigate("/login");
    await addToWish(listingId);
  };

  //handle modal state
  const onModalButtonClick = () => {
    setOpenModal(false);
  };

  //handle make offer click
  const handleMakeOffer = (product: TListTrans) => {
    if (!username) return navigate("/login");
    if (product) {
      setModalData({
        name: product.productName,
        id: product.listingId,
        currentPrice: product.newPrice,
      });
      setOpenModal(true);
    }
  };

  if (productLoading) {
    return <Loading />;
  }

  if (product) {
    // Dynamic values derivation layer
    const savingsAmount = product?.newPrice - product?.oldPrice;
    const savingsPercent = Math.round(
      (savingsAmount / product?.oldPrice) * 100,
    );

    return (
      <section className="product-details">
        <SEO
          title={`${product.productName} – kup online`}
          description={product.productDescription.slice(0, 155)}
          canonical={`https://kasoa.pl/shop/listing/${product.productSlug}`}
        />
        {/* 1. STRUCTURAL BREADCRUMB HEADER NAV */}
        <header className="product-details__nav-header">
          <button
            type="button"
            className="product-details__back-btn"
            onClick={() => navigate(-1)}
          >
            <FiArrowLeft /> {t("product_details.nav.back")}
          </button>
          <span className="product-details__category-crumb">
            {t("product_details.nav.shop_crumb")} /{" "}
            {t(`categories.${sanitizeCategoryKey(product.category.name)}.name`)}
          </span>
        </header>

        {/** MAKE OFFER MODAL */}
        {openModal && (
          <MakeOfferModal
            productName={modalData?.name || ""}
            id={modalData?.id || 0}
            currentPrice={modalData?.currentPrice || 0}
            isOpen={openModal}
            isNegotiable={product.negotiable}
            shipment={product?.shippingCost}
            service={product?.serviceCharge}
            onButtonClick={onModalButtonClick}
          />
        )}

        {/* =====================================================
               2. PRIMARY SINGLE PRODUCT GRID WINDOW CONTAINER
            ====================================================== */}
        <article className="product-details__main-wrapper">
          {/* MEDIA DISPLAY COLUMN CONTAINER */}
          <div className="product-details__media-showcase">
            <div className="product-details__primary-viewport">
              <img
                src={product.media[activeImageIdx].image}
                alt={`${product?.productName} - View ${activeImageIdx + 1}`}
                className="product-details__main-image"
              />
            </div>

            {product?.media.length > 1 && (
              <div className="product-details__thumbnails-grid">
                {product.media.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`product-details__thumb-trigger ${idx === activeImageIdx ? "product-details__thumb-trigger--active" : ""}`}
                    onClick={() => setActiveImageIdx(idx)}
                  >
                    <img
                      src={imgUrl.image}
                      alt={`Thumbnail preview window indicator slot ${idx + 1}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INTERACTIVE INFORMATION DESCRIPTIONS METRICS COLUMN */}
          <div className="product-details__content-panel">
            <span className="product-details__brand-label">
              {product.brand}
            </span>
            <h1 className="product-details__product-title">
              {product.productName}
            </h1>

            <div className="product-details__condition-badge">
              <span>
                {t("product_details.info.condition")}:{" "}
                <strong>
                  {t(
                    `product_conditions.${getConditionSlug(product.productCondition)}`,
                    { defaultValue: product.productCondition },
                  )}
                </strong>
              </span>
            </div>
            <div className="product-details__condition-badge">
              <span>
                {t("product_details.info.availability")}:{" "}
                <strong>
                  {t(
                    `user_products.table.statuses.${product.inventoryStatus?.toLowerCase()}`,
                    { defaultValue: product.inventoryStatus },
                  )}
                </strong>
              </span>
            </div>

            <div className="product-details__condition-badge">
              <span>
                {t("product_details.info.delivery")}:{" "}
                <strong>{product.shipping}</strong>
              </span>
            </div>

            <p className="product-details__narrative-description">
              {product.productDescription}
            </p>

            {/* FINANCIAL PRICING SUMMARY GROUPS */}
            <div className="product-details__pricing-matrix">
              <div className="product-details__price-row">
                <strong className="product-details__deal-price">
                  {formatPrice(product.newPrice)} zł
                </strong>
                {product.oldPrice > product.newPrice && (
                  <del className="product-details__strike-price">
                    {formatPrice(product.oldPrice)} zł
                  </del>
                )}
              </div>
              {product.newPrice > product.oldPrice && (
                <p className="product-details__savings-banner">
                  {t("product_details.pricing.savings", {
                    amount: formatPrice(savingsAmount),
                    percent: savingsPercent,
                  })}
                </p>
              )}
            </div>

            {/* ECO-SYSTEM SECURITY ASSURANCES BADGES */}
            <div className="product-details__safety-strip">
              <AiOutlineSafety className="product-details__safety-icon" />
              <p className="product-details__safety-text">
                {t("product_details.safety.return_assurance")}
              </p>
            </div>

            {/* ACTION BUTTON TRANSACTIONS CONSOLE */}
            <div
              className="product-details__action-row"
              style={{ display: userId === product.sellerId ? "none" : "flex" }}
            >
              <button
                type="button"
                className="product-details__buy-now-btn"
                onClick={() => handleMakeOffer(product)}
              >
                <FiShoppingBag />{" "}
                <span>{t("product_details.actions.buy_now")}</span>
              </button>

              <button
                type="button"
                className={`product-details__wishlist-btn ${isWishlisted ? "product-details__wishlist-btn--active" : ""}`}
                onClick={() => toggleWishlist(product.listingId)}
              >
                <FiHeart />
                <span>
                  {isWishlisted
                    ? t("product_details.actions.wishlist_active")
                    : t("product_details.actions.wishlist_add")}
                </span>
              </button>
            </div>
          </div>
        </article>

        {/* =====================================================
               3. TRUST STATEMENT VALUE BAR PROPOSITIONS
            ====================================================== */}
        <section className="product-details__trust-bar">
          <div className="product-details__trust-item">
            <FiShield className="product-details__trust-icon" />
            <div className="product-details__trust-text-group">
              <strong>{t("landing.trust_bar.verified_title")}</strong>
              <span>{t("product_details.trust.verified_sub")}</span>
            </div>
          </div>

          <div className="product-details__trust-item">
            <FiTruck className="product-details__trust-icon" />
            <div className="product-details__trust-text-group">
              <strong>{t("product_details.trust.delivery_title")}</strong>
              <span>{t("product_details.trust.delivery_sub")}</span>
            </div>
          </div>

          <div className="product-details__trust-item">
            <FiTag className="product-details__trust-icon" />
            <div className="product-details__trust-text-group">
              <strong>{t("product_details.trust.prices_title")}</strong>
              <span>{t("product_details.trust.prices_sub")}</span>
            </div>
          </div>

          <div className="product-details__trust-item">
            <FiRefreshCw className="product-details__trust-icon" />
            <div className="product-details__trust-text-group">
              <strong>{t("product_details.trust.protection_title")}</strong>
              <span>{t("product_details.trust.protection_sub")}</span>
            </div>
          </div>
        </section>

        {/* =====================================================
               4. COMPONENT FOOTER FEATURED PRODUCTS SLIDER 
            ====================================================== */}
        <section className="product-details__featured-carousel">
          {/* Related item cards map injections insert loop blocks mount layer */}
        </section>
        <Footer />
      </section>
    );
  } else {
 return (
      <div className="product-details__error-state">
        <div className="product-details__error-message" role="alert">
          <FiAlertCircle className="product-details__error-icon" />
          <span>{t("product_details.error.generic")}</span>
        </div>
      </div>
    );
  }
};

export default ProductDetails;
