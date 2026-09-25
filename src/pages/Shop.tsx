import { useMemo, useState } from "react";
import {
  FiChevronDown,
  FiEdit,
  FiHeart,
  FiSearch,
  FiShoppingBag,
  FiSliders,
  FiX,
} from "react-icons/fi";

import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loading, Pagination } from "../components";
import "../css/Shop.css";
import {
  useAddWishListMutation,
  useGetWishListsQuery,
} from "../features/api/itemApi";
import {
  useGetAllCategoriesQuery,
  useGetStoreListingsFeedQuery,
} from "../features/api/storeApi";
import { useAddToCart } from "../hooks/useAddTocart";
import { useRecentViews } from "../hooks/useRecentViews";
import { useAppSelector } from "../store";
import { formatPrice, sanitizeBackendKey } from "../util/util";



const Shop = () => {
  //translation hook
  const { t } = useTranslation();

  //user id
  const userId = useAppSelector((state) => state.userSlice.userId);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addItemToCart } = useAddToCart();
  const { addView } = useRecentViews();

  // 1. Core State Trackers synchronized natively with standard parameters
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("newest");
  const [showFilters, setShowFilters] = useState<boolean>(false);

    const page = parseInt(searchParams.get("page") || "1");

  // Safely extract the default active category from URL line, falling back to global state
  const selectedCategory = searchParams.get("category") || "all";


  const request = {
    queryCategory: selectedCategory,
    page,
    size: 50,
  };

  // Replaced useLazy Query hooks entirely. These automatically trigger an optimized
  // backend network fetch pass the split second a user mounts or lands on this route path!
  const { data, isLoading: isProductsLoading } = useGetStoreListingsFeedQuery(
    request,
    { refetchOnFocus: true, refetchOnMountOrArgChange: true },
  );
  const products = data?.listings || [];


  const { data: categories = [] } = useGetAllCategoriesQuery();

  const { data: wishlist = [] } = useGetWishListsQuery();
  const wishlists = wishlist.map((item) => item.listingId);

  const [addToWish] = useAddWishListMutation();
  const username = useAppSelector((state) => state.userSlice.email);

  // ==========================================================================
  // HIGH-PERFORMANCE CLIENT FILTERS MEMOIZATION MATRIX
  // ==========================================================================
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search Text Parsing Layer
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (product) =>
          product.brand.toLowerCase().includes(query) ||
          product.productName.toLowerCase().includes(query),
      );
    }

    // Chronological and Pricing Sorting Configurations
    switch (sort) {
      case "price-low":
        result.sort(
          (a, b) => a.priceDto.storeNewPrice - b.priceDto.storeNewPrice,
        );
        break;

      case "price-high":
        result.sort(
          (a, b) => b.priceDto.storeNewPrice - a.priceDto.storeNewPrice,
        );
        break;

      case "discount":
        result.sort((a, b) => {
          const discountA =
            ((a.priceDto.storeNewPrice - a.priceDto.storeOldPrice) /
              a.priceDto.storeNewPrice) *
            100;
          const discountB =
            ((b.priceDto.storeNewPrice - b.priceDto.storeOldPrice) /
              b.priceDto.storeOldPrice) *
            100;
          return discountB - discountA;
        });
        break;

      case "oldest":
        result.sort((a, b) => {
          const dateDiff =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          return dateDiff !== 0 ? dateDiff : a.listingId - b.listingId;
        });
        break;

      default: // Newest (Chronological Summary Snapshot Sort)
        result.sort((a, b) => {
          const dateDiff =
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          return dateDiff !== 0 ? dateDiff : b.listingId - a.listingId;
        });
        break;
    }
    return result;
  }, [products, search, sort]);

  // ==========================================================================
  // ACTION CONTROLLER HOOK HANDLERS
  // ==========================================================================
  const handleCategoryButtonClick = (categorySlug: string) => {
    const nextParams = new URLSearchParams(location.search);
    nextParams.set("category", categorySlug);
    // Navigating automatically shifts the reactive 'selectedCategory' token, re-firing the query
    navigate(`${location.pathname}?${nextParams.toString()}`);
  };



  const toggleWishlist = async (listingId: number) => {
    if (!username) return navigate("/login");
    await addToWish(listingId);
  };

  return (
    <main className="shop-page">
      {/* =====================================================
                SHOP HEADER
            ====================================================== */}

      <section className="shop-page__header">
        <div className="shop-page__heading">
          <span className="shop-page__eyebrow">Druga Ręka</span>
          <h1>{t("shop.header.title")}</h1>
          <p>{t("shop.header.description")}</p>
        </div>

        {/* SEARCH */}
        <div className="shop-page__search">
          <FiSearch />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("shop.header.search_placeholder")}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
            >
              <FiX />
            </button>
          )}
        </div>
      </section>

      {/* =====================================================
                CATEGORY NAVIGATION
            ====================================================== */}

      <section className="shop-page__categories">
        <button
          className={selectedCategory === "all" ? "active" : ""}
          onClick={() => handleCategoryButtonClick("all")}
        >
          {t("shop.categories.all")}
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            className={selectedCategory === category.slug ? "active" : ""}
            onClick={() => handleCategoryButtonClick(category.slug)}
          >
            {t(`category_names.${sanitizeBackendKey(category.slug)}`)}
          </button>
        ))}
      </section>

      {/* =====================================================
                TOOLBAR
            ====================================================== */}

      <section className="shop-page__toolbar">
        <div className="shop-page__result-count">
          <strong>{filteredProducts.length}</strong>
          <span> {t("shop.toolbar.products_count")}</span>
        </div>

        <div className="shop-page__toolbar-actions">
          {/* MOBILE FILTER */}
          <button
            className="shop-page__filter-button"
            onClick={() => setShowFilters(true)}
          >
            <FiSliders />
            {t("shop.toolbar.filters")}
          </button>

          {/* SORT */}
          <div className="shop-page__sort">
            <span>{t("shop.toolbar.sort_label")}</span>
            <div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest">
                  {t("shop.toolbar.sort_options.newest")}
                </option>
                <option value="oldest">
                  {t("shop.toolbar.sort_options.oldest")}
                </option>
                <option value="price-low">
                  {t("shop.toolbar.sort_options.price_low")}
                </option>
                <option value="price-high">
                  {t("shop.toolbar.sort_options.price_high")}
                </option>
                <option value="discount">
                  {t("shop.toolbar.sort_options.discount")}
                </option>
              </select>
              <FiChevronDown />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
                PRODUCTS
            ====================================================== */}

      {isProductsLoading ? (
        <Loading />
      ) : (
        <section className="shop-page__products">
          {filteredProducts.length === 0 ? (
            <div className="shop-page__empty">
              <FiSearch />
              <h2>{t("shop.empty.title")}</h2>
              <p>{t("shop.empty.description")}</p>
              <button
                onClick={() => {
                  setSearch("");
                  handleCategoryButtonClick("all");
                }}
              >
                {t("shop.empty.clear_btn")}
              </button>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const isWishlisted = wishlists.includes(product.listingId);
              const discount = Math.round(
                ((product.priceDto.storeNewPrice -
                  product.priceDto.storeOldPrice) /
                  product.priceDto.storeOldPrice) *
                  100,
              );

              return (
                <article
                  className="shop-product-card"
                  key={product.listingId}
                >
                  {/* IMAGE */}
                  <div className="shop-product-card__media">
                    <Link
                      to={`/shop/listing/${product.listingId}`}
                      className="shop-product-card__image-link"
                    >
                      <img
                        src={product?.media[0]?.image}
                        alt={product.productName}
                        loading="lazy"
                        onClick={() => addView(product.listingId)}
                      />
                    </Link>

                    <span className="shop-product-card__discount">
                      -{discount}%
                    </span>

                    <button
                      className={`shop-product-card__wishlist ${isWishlisted ? "active" : ""}`}
                      onClick={() => toggleWishlist(product.listingId)}
                      aria-label={t("shop.product.add_wishlist")}
                      style={{
                        display: product.sellerId === userId ? "none" : "flex",
                      }}
                    >
                      <FiHeart />
                    </button>
                  </div>

                  {/* CONTENT */}
                  <div className="shop-product-card__content">
                    <span className="shop-product-card__brand">
                      {product.brand}
                    </span>

                    <h2>{product.productName}</h2>

                    <div className="shop-product-card__condition">
                      <span>
                         {t(`product_conditions.${sanitizeBackendKey(product.productCondition.toLowerCase())}`)}
                      </span>
                    </div>

                    <div className="shop-product-card__bottom">
                      <div>
                        <strong>
                          {formatPrice(product.priceDto.storeNewPrice) || 0} zł
                        </strong>

                        <del>
                          {formatPrice(product.priceDto.storeOldPrice) || 0} zł
                        </del>
                      </div>

                      {!userId || product.sellerId !== userId ? (
                        <button
                          className="shop-product-card__buy"
                          aria-label="Kup produkt"
                          onClick={() => addItemToCart(product.listingId)}
                        >
                          <FiShoppingBag />
                        </button>
                      ) : (
                        <button
                          className="shop-product-card__buy"
                          aria-label="Kup produkt"
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
            })
          )}
        </section>
      )}
     {
      data &&  <Pagination
        page={page }
        totalPage={data?.totalPages}
        size={data?.pageSize }
        totalElements={data?.totalElements}
      />
     }

      {/* =====================================================
                MOBILE FILTER DRAWER
            ====================================================== */}

      {showFilters && (
        <div className="shop-filter-drawer">
          <div
            className="shop-filter-drawer__backdrop"
            onClick={() => setShowFilters(false)}
          />

          <div className="shop-filter-drawer__panel">
            <div className="shop-filter-drawer__header">
              <h2>{t("shop.filter_drawer.title")}</h2>

              <button onClick={() => setShowFilters(false)}>
                <FiX />
              </button>
            </div>

            <div className="shop-filter-drawer__body">
              <label>{t("shop.filter_drawer.label")}</label>

              <select
                value={selectedCategory}
                onChange={(e) => {
               handleCategoryButtonClick(e.target.value);

                  setShowFilters(false);
                }}
              >
                <option value="all">
                  {t("shop.filter_drawer.all_option")}
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.slug}
                  >
                    {t(`category_names.${sanitizeBackendKey(category.slug)}`)}
                  </option>
                ))}
              </select>
            </div>
      
          </div>
        </div>
      )}
    </main>
  );
};

export default Shop;
