import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FiChevronDown,
  FiChevronRight,
  FiEdit,
  FiHeart,
  FiSearch,
  FiShoppingBag,
  FiX,
} from "react-icons/fi";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Loading } from "../components";
import "../css/Categories.scss";
import { CATEGORY_HEADERS } from "../data/data";
import {
  useAddWishListMutation,
  useGetWishListsQuery,
} from "../features/api/itemApi";
import {
  useGetCategoryTreeQuery,
  useGetStoreListingsFeedQuery,
} from "../features/api/storeApi";
import { useAddToCart } from "../hooks/useAddTocart";
import { useAppSelector } from "../store";
import type { TCategoryTreeDto, TSubCategory } from "../types/TCategoryTreeDto";
import {
  formatPrice,
  sanitizeBackendKey,
  sanitizeCategoryKey,
} from "../util/util";

export const Categories: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addItemToCart } = useAddToCart();

  const userId = useAppSelector((state) => state.userSlice.userId);
  const username = useAppSelector((state) => state.userSlice.email);

  const { data: wishlist = [] } = useGetWishListsQuery();
  const wishlists = wishlist.map((item) => item.listingId);

  const [expandedMainCat, setExpandedMainCat] = useState<number | null>(null);
  const [selectedSubCat, setSelectedSubCat] = useState<number | null>(null);
  const [selectedNode, setSelectedNode] = useState<TSubCategory | null>(null);

  const {
    data: catalogTree = [],
    isLoading,
    error,
  } = useGetCategoryTreeQuery();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const selectedCategory = searchParams.get("category") || "all";


  const request = {
    queryCategory: selectedCategory,
    page,
    size: 50,
  };

  const [addToWish] = useAddWishListMutation();

  const toggleWishlist = async (listingId: number) => {
    if (!username) {
      navigate("/login");
      return;
    }

    await addToWish(listingId);
  };

  const { data, isLoading: isProductsLoading } = useGetStoreListingsFeedQuery(
    request,
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    },
  );

  const products = data?.listings || [];

  // Sync expanded categories from URL params if page reloads.
  useEffect(() => {
    if (selectedCategory !== "all" && catalogTree.length > 0) {
      const activeParent = catalogTree.find(
        (main) =>
          main.slug === selectedCategory ||
          main.subCategories.some((sub) => sub.slug === selectedCategory),
      );

      if (activeParent) {
        setExpandedMainCat(activeParent.id);

        const activeSub = activeParent.subCategories.find(
          (sub) => sub.slug === selectedCategory,
        );

        setSelectedSubCat(activeSub?.id ?? null);
      } else {
        setExpandedMainCat(null);
        setSelectedSubCat(null);
      }
    } else {
      setExpandedMainCat(null);
      setSelectedSubCat(null);
    }
  }, [selectedCategory, catalogTree]);

  const handleMainCategoryClick = (parentCategory: TCategoryTreeDto) => {
    setExpandedMainCat((prev) =>
      prev === parentCategory.id ? null : parentCategory.id,
    );

    const nextParams = new URLSearchParams(window.location.search);
    nextParams.set("category", parentCategory.slug);

    navigate(`${window.location.pathname}?${nextParams.toString()}`);
  };

  const handleSubCategorySelect = (category: TSubCategory) => {
    setSelectedNode(category);
    setSelectedSubCat(category.id);

    const nextParams = new URLSearchParams(window.location.search);
    nextParams.set("category", category.slug);

    navigate(`${window.location.pathname}?${nextParams.toString()}`);
  };

  const handleClearFilters = () => {
    setExpandedMainCat(null);
    setSelectedSubCat(null);

    const nextParams = new URLSearchParams(window.location.search);
    nextParams.set("category", "all");

    navigate(`${window.location.pathname}?${nextParams.toString()}`);
  };


  if (isLoading) {
    return (
      <div className="catalog-browser__loading">
        {t("categories.feed.loading", {
          defaultValue: "Loading Catalog Tree...",
        })}
      </div>
    );
  }

  if (error) {
    return (
      <div className="catalog-browser__error">
        {t("categories.feed.error", {
          defaultValue: "Failed to load category layout fields.",
        })}
      </div>
    );
  }

  return (
    <section className="catalog-browser">
      {/* SIDEBAR NAVIGATION */}
      <aside className="catalog-browser__sidebar">
        <h2 className="catalog-browser__sidebar-title"    onClick={() => navigate('/shop/categories')}
                  role="button">
          {t("categories.header.title", {
            defaultValue: "Categories",
          })}
        </h2>

        <ul className="catalog-browser__tree">
          {catalogTree.map((mainCat: TCategoryTreeDto) => {
            const isExpanded = expandedMainCat === mainCat.id;

            const localizedMainName = t(
              `categories.${sanitizeCategoryKey(mainCat.name)}.name`,
            );

            {/** CATEGORY ICONS */}
            const Icon = CATEGORY_HEADERS.find(
              (item) => item.key === sanitizeCategoryKey(mainCat.name),
            )?.icon;

             const IconColor= CATEGORY_HEADERS.find(
              (item) => item.key === sanitizeCategoryKey(mainCat.name),
            )?.color;
            return (
              <li
                key={mainCat.id}
                className={`catalog-browser__node ${
                  isExpanded ? "catalog-browser__node--expanded" : ""
                }`}
              >
                <div
                  className="catalog-browser__parent-row"
                  onClick={() => handleMainCategoryClick(mainCat)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleMainCategoryClick(mainCat);
                    }
                  }}
                >
                  <span className="catalog-browser__parent-label">
                    {Icon && <Icon style={{color:IconColor}}/>}
                    {localizedMainName}
                  </span>

                  {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
                </div>

                {isExpanded && (
                  <ul className="catalog-browser__sub-list">
                    {mainCat.subCategories.map((subCat: TSubCategory) => {
                      const isSelected = selectedSubCat === subCat.id;

                      const localizedSubName = t(
                        `categories.${sanitizeCategoryKey(
                          mainCat.name,
                        )}.subcategories.${sanitizeCategoryKey(subCat.name)}`,
                      );

                      return (
                        <li
                          key={subCat.id}
                          className={`catalog-browser__sub-item ${
                            isSelected
                              ? "catalog-browser__sub-item--active"
                              : ""
                          }`}
                        >
                          <button
                            type="button"
                            className="catalog-browser__sub-button"
                            onClick={() => handleSubCategorySelect(subCat)}
                            aria-pressed={isSelected}
                          >
                            {localizedSubName}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </aside>

      {/* PRODUCT FEED */}
      <div className="catalog-browser__feed">
        <header className="catalog-browser__feed-header">
          <h1 className="catalog-browser__feed-title">
            {selectedSubCat
              ? t(
                  `categories.${sanitizeCategoryKey(selectedNode?.parent as string)}.subcategories.${sanitizeCategoryKey(selectedNode?.name as string)}`,
                )
              : expandedMainCat
                ? t(`categories.${selectedCategory}.name`)
                : t("categories.feed.all_listing", {
                    defaultValue: "All Available Listings",
                  })}
          </h1>
        </header>

        {isProductsLoading ? (
          <Loading />
        ) : products.length === 0 ? (
          /* EMPTY RESULTS */
          <div className="catalog-browser__empty-feed">
            <div className="catalog-browser__empty-icon-box">
              <FiSearch />
            </div>

            <h3 className="catalog-browser__empty-title">
              {t("categories.empty_search.title", {
                defaultValue: "No Matching Listings Found",
              })}
            </h3>

            <p className="catalog-browser__empty-text">
              {t("categories.empty_search.message", {
                defaultValue:
                  "We couldn't find any items matching your active category profile. Try expanding your search queries or resetting the active parameters.",
              })}
            </p>

            <button
              type="button"
              className="catalog-browser__empty-reset-btn"
              onClick={handleClearFilters}
            >
              <FiX />

              <span>
                {t("categories.empty_search.clear_btn", {
                  defaultValue: "Clear Active Filters",
                })}
              </span>
            </button>
          </div>
        ) : (
          /* PRODUCT GRID */
          <div className="shop-page__products">
            {products.map((product) => {
              const isWishlisted = wishlists.includes(product.listingId);
              const oldPrice = product.priceDto.storeOldPrice;
              const newPrice = product.priceDto.storeNewPrice;

              const discount =
                oldPrice > 0
                  ? Math.round(((oldPrice - newPrice) / oldPrice) * 100)
                  : 0;

              const conditionKey = sanitizeBackendKey(
                product.productCondition.toLowerCase(),
              );

              return (
                <article
                  className="shop-product-card"
                  key={product.listingId}
                >
                  {/* ==========================================================================
            MEDIA REGION: THUMBNAILS, DISCOUNTS & WISHLIST OVERLAYS
            ========================================================================== */}
                  <div className="shop-product-card__media">
                    <Link
                      to={`/shop/listing/${product.listingId}`}
                      className="shop-product-card__image-link"
                    >
                      <img
                        src={product?.media?.[0]?.image}
                        alt={product.productName}
                        loading="lazy"
                      />
                    </Link>

                    {discount > 0 && (
                      <span className="shop-product-card__discount">
                        -{discount}%
                      </span>
                    )}

                    <button
                      type="button"
                      className={`shop-product-card__wishlist ${isWishlisted ? "active" : ""}`}
                      onClick={() => toggleWishlist(product.listingId)}
                      aria-label={t("shop.product.add_wishlist", {
                        defaultValue: "Add to wishlist",
                      })}
                      aria-pressed={isWishlisted}
                      style={{
                        display: product.sellerId === userId ? "none" : "flex",
                      }}
                    >
                      <FiHeart />
                    </button>
                  </div>

                  {/* ==========================================================================
            CONTENT REGION: METADATA & TYPOGRAPHY INFO HIERARCHIES
            ========================================================================== */}
                  <div className="shop-product-card__content">
                    <span className="shop-product-card__brand">
                      {product.brand}
                    </span>

                    <h2>
                      <Link to={`/shop/listing/${product.listingId}`}>
                        {product.productName}
                      </Link>
                    </h2>

                    <div className="shop-product-card__condition">
                      <span>
                        {t(`product_conditions.${conditionKey}`, {
                          defaultValue: product.productCondition,
                        })}
                      </span>
                    </div>

                    {/* ==========================================================================
              BOTTOM REGION: PRICE MARKERS & INTERACTIVE ACTION BUTTONCTAS
              ========================================================================== */}
                    <div className="shop-product-card__bottom">
                      <div>
                        <strong>{formatPrice(newPrice) || 0} zł</strong>
                        {oldPrice > 0 && (
                          <del>{formatPrice(oldPrice) || 0} zł</del>
                        )}
                      </div>

                      {product.sellerId !== userId ? (
                        <button
                          type="button"
                          className="shop-product-card__buy"
                          aria-label={t("shop.product.add_to_cart", {
                            defaultValue: "Add to cart",
                          })}
                          onClick={() => addItemToCart(product.listingId)}
                        >
                          <FiShoppingBag />
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="shop-product-card__buy"
                          aria-label={t("shop.product.edit_listing", {
                            defaultValue: "Edit listing",
                          })}
                          onClick={() =>
                            navigate(
                              `/account/listings/${product.listingId}/edit`,
                            )
                          }
                        >
                          <FiEdit />
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;
