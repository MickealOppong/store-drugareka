import { useTranslation } from "react-i18next";
import { FiHeart, FiShoppingBag, FiTrash2 } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import '../css/wishlist.scss';
import { useAddWishListMutation, useGetWishListsQuery } from "../features/api/itemApi";
import { useAddToCart } from "../hooks/useAddTocart";
import { formatPrice } from "../util/util";

const WishList = () => {
  const { data: wishlistItems = [] } = useGetWishListsQuery();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [addToWish, { isLoading }] = useAddWishListMutation();
  const { addItemToCart } = useAddToCart();

  const onRemoveWishlist = async (listingId: number) => {
    await addToWish(listingId);
  };

  if (isLoading) {
    return (
      <div className="wishlist-page__loading">
        <div className="wishlist-page__spinner"></div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-page__empty">
        <div className="wishlist-page__empty-icon">
          <FiHeart />
        </div>

        <h3>{t("wishlist.empty.title")}</h3>

        <p>{t("wishlist.empty.description")}</p>

        <Link to="/shop" className="wishlist-page__empty-link">
          {t("wishlist.empty.explore_btn")}
        </Link>
      </div>
    );
  }

  return (
    <main className="wishlist-page">

      {/* Header */}
      <header className="wishlist-page__header">
        <div className="wishlist-page__header-content">
          <h2>{t("wishlist.header.title")}</h2>
          <p>{t("wishlist.header.description")}</p>
        </div>

        <span className="wishlist-page__count">
          {wishlistItems.length}{" "}
          {wishlistItems.length === 1 
            ? t("wishlist.header.count_singular") 
            : t("wishlist.header.count_plural")}
        </span>
      </header>

      {/* Wishlist Grid */}
      <section className="wishlist-page__grid">

        {wishlistItems.map((item) => (
          <article
            key={item.id}
            className="wishlist-card"
          >

            {/* Product Image */}
            <figure className="wishlist-card__media">

              <img
                src={
                  item.image ||
                  "/images/placeholder-product.png"
                }
                alt={item.productName}
                loading="lazy"
              />

              <button
                type="button"
                className="wishlist-card__remove"
                onClick={() => onRemoveWishlist(item.listingId)}
                title={t("wishlist.card.remove_hint")}
                aria-label={`${t("wishlist.card.remove_hint")} ${item.productName}`}
              >
                <FiTrash2 />
              </button>

              {item.inventoryStatus !== "AVAILABLE" && (
                <mark className="wishlist-card__status">
                  {t(`user_products.table.statuses.${item.inventoryStatus.toLowerCase()}`, { defaultValue: item.inventoryStatus.replace("_", " ") })}
                </mark>
              )}
              <mark className="wishlist-card__status">
                {t(`user_products.table.statuses.${item.inventoryStatus.toLowerCase()}`, { defaultValue: item.inventoryStatus })}
              </mark>

            </figure>

            {/* Product Information */}
            <div className="wishlist-card__content">

              <div className="wishlist-card__info">

                <Link
                  to={`/shop/listing/${item.listingId}`}
                  className="wishlist-card__product-link"
                >
                  <h4>{item.productName}</h4>
                </Link>

                <p>
                  {t("wishlist.card.added_on")}{" "}
                  {new Date(item.createAt).toLocaleDateString()}
                </p>

              </div>

              {/* Price & Buy */}
              <footer className="wishlist-card__footer">

                <strong>
                  {formatPrice(item.sellerPrice)} zl
                </strong>

                <button
                  type="button"
                  className="wishlist-card__buy"
                  disabled={
                    item.inventoryStatus !== "AVAILABLE"
                  }
                  onClick={() => {
                    addItemToCart(item.listingId);
                    navigate('/cart');
                  }}
                >
                  <FiShoppingBag />
                  <span>{t("wishlist.card.buy_btn")}</span>
                </button>

              </footer>

            </div>

          </article>
        ))}

      </section>
    </main>
  );
};

export default WishList;
