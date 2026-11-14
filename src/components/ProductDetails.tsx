import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineSafety } from "react-icons/ai";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiHeart,
  FiMapPin,
  FiRefreshCw,
  FiShield,
  FiShoppingBag,
  FiTag,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import defImage from "../assets/default.jpeg";
import "../css/ProductDetails.css";

import {
  useAddWishListMutation,
  useGetWishListsQuery,
} from "../features/api/itemApi";

import {
  useGetListingBySlugQuery,
  useGetSellerListingQuery,
} from "../features/api/storeApi";

import { useAppSelector } from "../store";
import type { TListTrans } from "../types/TListTrans";
import { formatPrice, sanitizeBackendKey } from "../util/util";

import { useStripeBuyNowMutation } from "../features/api/checkoutApi";
import EnquiryModal from "./EnquiryModal";
import Footer from "./Footer";
import Loading from "./Loading";
import MakeOfferModal from "./MakeOfferModal";
import ProductBnpl from "./ProductBnpl";
import SEO from "./SEO";

// Safely translate backend condition values.
const getConditionSlug = (condition: string) => {
  if (!condition) return "good";

  return condition.trim().toLowerCase().replace(/\s+/g, "_");
};

const ProductDetails = () => {
  const { slug } = useParams<string>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [searchParams] = useSearchParams();

  const listingId = searchParams.get("listing");

  //buy now
  const [buyNow] = useStripeBuyNowMutation();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Authenticated user.
  const { email: username, sellerId: sellerProfileId } = useAppSelector(
    (state) => state.userSlice,
  );

  // Modal state.
  const [openModal, setOpenModal] = useState(false);
  const [openEnquiry, setOpenEnquiry] = useState<boolean>(false);

  const [modalData, setModalData] = useState<{
    name: string;
    id: number;
    currentPrice: number;
  } | null>(null);

  // Media state.
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Wishlist.
  const [addToWish] = useAddWishListMutation();

  const { data: wishlist = [] } = useGetWishListsQuery();

  const wishlists = wishlist.map((item) => item.productSlug);

  const isWishlisted = wishlists.includes(String(slug));

  // Product.
  const { data: product, isLoading: productLoading } = useGetListingBySlugQuery(
    { slug: String(slug), id: parseInt(String(listingId)) },
  );

  // Seller listings.
  const sellerId = product?.sellerId;

  const { data: sellerListings = [], isLoading: isProductsLoading } =
    useGetSellerListingQuery(Number(sellerId), {
      skip: !sellerId,
    });

  const isOwner =
    sellerProfileId != null &&
    product != null &&
    String(sellerProfileId) === String(product.sellerId);

  // Wishlist handler.
  const toggleWishlist = async (listingId: number) => {
    if (!username) {
      navigate("/login");
      return;
    }

    await addToWish(listingId);
  };

  // Close offer modal.
  const onModalButtonClick = () => {
    setOpenModal(false);
  };

  // Open offer modal.
  const handleMakeOffer = (listing: TListTrans) => {
    if (!username) {
      navigate("/login");
      return;
    }

    setModalData({
      name: listing.productName,
      id: listing.listingId,
      currentPrice: listing.newPrice,
    });

    setOpenModal(true);
  };

  // Buy at the displayed price.
  // Connect this to your existing cart/checkout implementation.
  const handleBuyNow = async (listingId: number) => {
    if (!username) {
      navigate("/login");
      return;
    }

    if (isCheckoutLoading) return;

    setError(null);
    setIsCheckoutLoading(true);

    try {
      const response = await buyNow(listingId);

      const checkoutURL = response?.data?.data;

      if (!checkoutURL) {
        throw new Error("Checkout URL not returned");
      }

      window.location.assign(checkoutURL);
    } catch (err) {
      console.error("Failed to initiate checkout:", err);

      setError(
        t("checkout.errors.initiation_failed", {
          defaultValue: "Nie udało się rozpocząć płatności. Spróbuj ponownie.",
        }),
      );
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const onCloseButton = () => {
    setOpenEnquiry(false);
  };
  const handleEnquiry = ()=>{
      if (!username) {
      navigate("/login");
      return;
    }
    setOpenEnquiry(true)
  }

  if (productLoading || isCheckoutLoading) {
    return <Loading />;
  }

  if (!product) {
    return (
      <div className="product-details__error-state">
        <div
          className="product-details__error-message"
          role="alert"
        >
          <FiAlertCircle className="product-details__error-icon" />
          <span>{t("product_details.error.generic")}</span>
        </div>
      </div>
    );
  }

  const serviceCharge = product.serviceCharge ?? 0;
  const buyerPrice = product.newPrice + serviceCharge;
  const deliveryCost = product.shippingCost ?? 0;

  const media = product.media ?? [];
  const activeImage = media[activeImageIdx] ?? media[0];

  return (
    <section className="product-details">
      <SEO
        title={`${product.productName} – kup online`}
        description={product.productDescription?.slice(0, 155) ?? ""}
        canonical={`https://kasoa.pl/shop/listing/${product.productSlug}`}
      />

      {error && <span className="product-details__error">{error}</span>}
      {/* BREADCRUMB HEADER */}
      <header className="product-details__nav-header">
        <button
          type="button"
          className="product-details__back-btn"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft />
          {t("product_details.nav.back")}
        </button>

        <span className="product-details__category-crumb">
          {t("product_details.nav.shop_crumb")} /{" "}
          {t(`categories.${product.category.path.split("/")[1]}.name`)}
        </span>
      </header>

      {/* MAKE OFFER MODAL */}
      {openModal && modalData && (
        <MakeOfferModal
          productName={modalData.name}
          id={modalData.id}
          currentPrice={modalData.currentPrice}
          isOpen={openModal}
          isNegotiable={product.negotiable}
          shipment={product.shippingCost}
          service={product.serviceCharge}
          onButtonClick={onModalButtonClick}
          isPerdonalCollectionAvailable={product.personalCollectionAvailable}
        />
      )}

      {/* MAIN PRODUCT */}
      <article className="product-details__main-wrapper">
        {/* PRODUCT MEDIA */}
        <div className="product-details__media-showcase">
          <div className="product-details__primary-viewport">
            <img
              src={activeImage?.image || defImage}
              alt={`${product.productName} - View ${activeImageIdx + 1}`}
              className="product-details__main-image"
            />
          </div>

          {media.length > 1 && (
            <div className="product-details__thumbnails-grid">
              {media.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`product-details__thumb-trigger ${
                    idx === activeImageIdx
                      ? "product-details__thumb-trigger--active"
                      : ""
                  }`}
                  onClick={() => setActiveImageIdx(idx)}
                  aria-label={`View product image ${idx + 1}`}
                  aria-pressed={idx === activeImageIdx}
                >
                  <img
                    src={imgUrl.image || defImage}
                    alt={`Product thumbnail ${idx + 1}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PRODUCT INFORMATION */}
        <div className="product-details__content-panel">
          <span className="product-details__brand-label">{product.brand}</span>

          <h1 className="product-details__product-title">
            {product.productName}
          </h1>

          {/* CONDITION */}
          <div className="product-details__condition-badge">
            <span>
              {t("product_details.info.condition")}:{" "}
              <strong>
                {t(
                  `product_conditions.conditions.${getConditionSlug(
                    product.productCondition,
                  )}`,
                  { defaultValue: product.productCondition },
                )}
              </strong>
            </span>
          </div>

          {/* AVAILABILITY */}
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

          {/* DELIVERY */}
          <div className="product-details__condition-badge">
            <span>
              {t("product_details.info.delivery")}:{" "}
              <strong>{product.shipping}</strong>
            </span>
          </div>

          {/* WEIGHT */}
          <div className="product-details__condition-badge">
            <span>
              {t("product_details.info.weight")}:{" "}
              <strong>
                {t(
                  `add_listing.fields.cargo_sizes.item_size.${product.itemSize?.toLowerCase()}`,
                )}
              </strong>
            </span>
          </div>

          {/* DIMENSIONS */}
          {product.height && (
            <div className="product-details__condition-badge">
              <span>
                {t("product_details.info.height")}:{" "}
                <strong>{product.height} cm</strong>
              </span>
            </div>
          )}

          {product.width && (
            <div className="product-details__condition-badge">
              <span>
                {t("product_details.info.width")}:{" "}
                <strong>{product.width} cm</strong>
              </span>
            </div>
          )}

          {product.depth && (
            <div className="product-details__condition-badge">
              <span>
                {t("product_details.info.depth")}:{" "}
                <strong>{product.depth} cm</strong>
              </span>
            </div>
          )}

          {/* ITEM INFORMATION */}
          {product.itemNumber && (
            <div className="product-details__condition-badge">
              <span>
                {t("product_details.info.item_number")}:{" "}
                <strong>{product.itemNumber}</strong>
              </span>
            </div>
          )}

          {product.productionYear && (
            <div className="product-details__condition-badge">
              <span>
                {t("product_details.info.year")}:{" "}
                <strong>{product.productionYear}</strong>
              </span>
            </div>
          )}

          {/* DESCRIPTION */}
          <p className="product-details__narrative-description">
            {product.productDescription}
          </p>

          {/* PERSONAL COLLECTION */}
          {product.personalCollectionAvailable &&
            product.collectionCity?.trim() && (
              <div className="product-details__personal-collection">
                <FiMapPin />
                <div>
                  <strong>
                    {t("product_details.personal_collection.title")}
                  </strong>

                  <p>
                    {t("product_details.personal_collection.message")}{" "}
                    <strong>{product.collectionCity}</strong>
                  </p>
                </div>
              </div>
            )}

          {/* PRICE AND DELIVERY */}
          <div className="product-details__pricing-matrix">
            <div className="product-details__price-row">
              <strong className="product-details__deal-price">
                {formatPrice(buyerPrice)} zł
              </strong>
            </div>

            {serviceCharge > 0 && (
              <span className="product-details__service">
                {t("shop.product.service_charge_included")}
              </span>
            )}

            <div className="product-details__delivery">
              <FiTruck aria-hidden="true" />

              <span>
                {t("shop.product.delivery_cost_extra")}
                {deliveryCost > 0 && `: ${formatPrice(deliveryCost)} zł`}
              </span>
            </div>
          </div>
          <ProductBnpl />

          {/* BUYER PROTECTION */}
          <div className="product-details__safety-strip">
            <AiOutlineSafety className="product-details__safety-icon" />

            <p className="product-details__safety-text">
              {t("product_details.safety.return_assurance")}
            </p>
          </div>

          {/* BUYER ACTIONS */}
          {!isOwner && (
            <div className="product-details__action-row">
              {/* BUY AT LISTED PRICE */}
              <button
                type="button"
                className="product-details__buy-now-btn"
                onClick={() => handleBuyNow(product.listingId)}
              >
                <FiShoppingBag />
                <span>{t("product_details.actions.buy_now")}</span>
              </button>

              {/* OPTIONAL NEGOTIATION */}
              {product.negotiable && (
                <button
                  type="button"
                  className="product-details__make-offer-btn"
                  onClick={() => handleMakeOffer(product)}
                >
                  <FiTag />
                  <span>
                    {t("shop.product.make_offer", {
                      defaultValue: "Make an offer",
                    })}
                  </span>
                </button>
              )}
              {/** ENQUIRY */}
          <button
                type="button"
                className="product-details__make-offer-btn"
                onClick={() => handleEnquiry()}
              >
                <FiUser />
                <span>
                  {t("shop.product.make_request", {
                    defaultValue: "Request missing information",
                  })}
                </span>
              </button>

              {/* WISHLIST */}
              <button
                type="button"
                className={`product-details__wishlist-btn ${
                  isWishlisted ? "product-details__wishlist-btn--active" : ""
                }`}
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
          )}
        </div>
      </article>

      {/* TRUST BAR */}
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

      {/* OTHER LISTINGS FROM SELLER */}
      {isProductsLoading ? (
        <Loading />
      ) : (
        <section className="products section">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">
                {t("product_details.header")}
              </span>

              <h2>{t("product_details.title")}</h2>
            </div>
          </div>

          <div className="product-grid">
            {sellerListings
              .filter((item) => item.listingId !== product.listingId)
              .map((item) => (
                <Link
                  key={item.listingId}
                  to={`/shop/listing/${item.productSlug}?listing=${item.listingId}`}
                  className="product-card"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <div className="product-card__media">
                    <img
                      src={item.media?.[0]?.image || defImage}
                      alt={item.productName}
                    />
                  </div>

                  <div className="product-card__info">
                    <span className="product-card__condition">
                      {t(
                        `product_conditions.conditions.${sanitizeBackendKey(
                          item.productCondition.toLowerCase(),
                        )}`,
                        { defaultValue: item.productCondition },
                      )}
                    </span>

                    <h3>{item.productName}</h3>

                    <strong>{formatPrice(item.newPrice)} zł</strong>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      )}

      {/* FEATURED PRODUCTS */}
      <section className="product-details__featured-carousel">
        {/* Related products can be added here. */}
      </section>

      <Footer />
      {openEnquiry && (
        <EnquiryModal
          isOpen={openEnquiry}
          productName={product.productName}
          listingId={product.listingId}
          onClose={onCloseButton}
        />
      )}
    </section>
  );
};

export default ProductDetails;
