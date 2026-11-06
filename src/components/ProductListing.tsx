import { useTranslation } from "react-i18next";
import { FiEdit, FiHeart, FiShoppingBag, FiTruck } from "react-icons/fi";
import { Link } from "react-router-dom";

import '../css/ProductListing.css';

import type { TListTrans } from "../types/TListTrans";
import { formatPrice, sanitizeBackendKey } from "../util/util";

interface ProductListingProps {
  product: TListTrans;
  isWishlisted: boolean;
  isOwner: boolean;
  variant?: "shop" | "category";
  onToggleWishlist: (listingId: number) => void;
  onMakeOffer: (product: TListTrans) => void;
  onAddToCart: (listingId: number) => void;
  onEdit: (listingId: number) => void;
  onView?: (listingId: number) => void;
}

const ProductListing = ({
  product,
  isWishlisted,
  isOwner,
  variant = "shop",
  onToggleWishlist,
  onMakeOffer,
  onAddToCart,
  onEdit,
  onView,
}: ProductListingProps) => {
  const { t } = useTranslation();
  const isCategory = variant === "category";

  const discount =
    product.oldPrice > 0 && product.oldPrice > product.newPrice
      ? Math.round(
          ((product.oldPrice - product.newPrice) / product.oldPrice) * 100,
        )
      : 0;

  const displayedPrice = product.newPrice + (product.serviceCharge ?? 0);

  const cardClass = isCategory ? "category-product-card" : "shop-product-card";

  return (
    <article className={cardClass}>
      <div className={`${cardClass}__media`}>
        <Link
          to={`/shop/listing/${product.productSlug}`}
          className={`${cardClass}__image-link`}
        >
          <img
            src={product.media?.[0]?.image}
            alt={product.productName}
            loading="lazy"
            onClick={() => onView?.(product.listingId)}
          />
        </Link>

        {(discount > 0 || !isCategory) && (
          <span className={`${cardClass}__discount`}>-{discount}%</span>
        )}

        {!isOwner && (
          <button
            type="button"
            className={`${cardClass}__wishlist ${isWishlisted ? "active" : ""}`}
            onClick={() => onToggleWishlist(product.listingId)}
            aria-label={t("shop.product.add_wishlist", {
              defaultValue: "Add to wishlist",
            })}
            aria-pressed={isWishlisted}
          >
            <FiHeart />
          </button>
        )}
      </div>

      <div className={`${cardClass}__content`}>
        <span className={`${cardClass}__brand`}>{product.brand}</span>

        <h2>
          {isCategory ? (
            <Link to={`/shop/listing/${product.listingId}`}>
              {product.productName}
            </Link>
          ) : (
            product.productName
          )}
        </h2>

        <div className={`${cardClass}__condition`}>
          <span>
            {t(
              `product_conditions.conditions.${sanitizeBackendKey(
                product.productCondition.toLowerCase(),
              )}`,
              { defaultValue: product.productCondition },
            )}
          </span>
        </div>

        <div className={`${cardClass}__bottom product-listing__footer`}>
          <div className="shop-product-card__price product-listing__price">
            <strong>{formatPrice(displayedPrice)} zł</strong>

            {product.serviceCharge > 0 && (
              <span className="shop-product-card__service">
                {t("shop.product.service_charge_included")}
              </span>
            )}

            <span className="shop-product-card__delivery">
              <FiTruck/>
              {t("shop.product.delivery_cost_extra")}
            </span>
          </div>

          <div className={`${cardClass}__actions product-listing__actions`}>
            {isOwner ? (
              <button
                type="button"
                className={`${cardClass}__buy product-listing__action`}
                aria-label={t("shop.product.edit_listing", {
                  defaultValue: "Edit listing",
                })}
                onClick={() => onEdit(product.listingId)}
              >
                <FiEdit />
                <span>{t("shop.product.edit_listing", { defaultValue: "Edit listing" })}</span>
              </button>
            ) : product.negotiable ? (
              <button
                type="button"
                className={`${isCategory ? "nake-offer-btn" : "make_offer"} product-listing__action`}
                onClick={() => onMakeOffer(product)}
              >
                {t("shop.product.make_offer")}
              </button>
            ) : (
              <button
                type="button"
                className={`${cardClass}__buy product-listing__action`}
                aria-label={t("shop.product.add_to_cart", {
                  defaultValue: "Add to cart",
                })}
                onClick={() => onAddToCart(product.listingId)}
              >
                <FiShoppingBag />
                <span>{t("shop.product.add_to_cart", { defaultValue: "Add to cart" })}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductListing;
