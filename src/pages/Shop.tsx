import { useEffect, useMemo, useState } from "react";
import {
  FiChevronDown,
  FiEdit,
  FiHeart,
  FiSearch,
  FiShoppingBag,
  FiX
} from "react-icons/fi";

import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Loading, Pagination } from "../components";
import { ErrorToast } from "../components/ErrorTaost";
import MakeOfferodal from "../components/MakeOfferModal";
import SEO from "../components/SEO";
import "../css/Shop.css";
import { COLLECTION_CITIES } from "../data/data";
import {
  useAddWishListMutation,
  useGetWishListsQuery,
} from "../features/api/itemApi";
import {
  useGetAllParentCategoriesQuery,
  useGetStoreListingsFeedQuery,
} from "../features/api/storeApi";
import { useAddToCart } from "../hooks/useAddTocart";
import { useRecentViews } from "../hooks/useRecentViews";
import { useAppSelector } from "../store";
import type { TListTrans } from "../types/TListTrans";
import type { TQueryDto } from "../types/TQueryDto";
import {
  formatPrice,
  sanitizeBackendKey,
  sanitizeCategoryKey,
} from "../util/util";

const Shop = () => {
  //translation hook
  const { t } = useTranslation();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalData, setModalData] = useState<{
    name: string;
    id: number;
    currentPrice: number;
    isNegotiable: boolean;
  } | null>(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addItemToCart, isLoading: addCartLoading, error } = useAddToCart();
  const { addView } = useRecentViews();

    const { search, pathname } = useLocation();

  //GENERIC SEARCH
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedSearch(searchTerm.trim());
      }, 500);
  
      return () => clearTimeout(timer);
    }, [searchTerm]);

  // 1. Core State Trackers synchronized natively with standard parameters
  const [sort, setSort] = useState<string>("newest");

  // Safely extract the default active category from URL line, falling back to global state
    const page = parseInt(searchParams.get("page") || "1", 10);
    const selectedCategory = searchParams.get("category") || "all";
    const selectedCollectionCity = searchParams.get("collectionCity") || "";
    const isCollectionAvailable =
      searchParams.get("isCollectionAvailable") || "false";
  
    const queryDto: TQueryDto = {
      category: selectedCategory,
      collectionCity: selectedCollectionCity,
      isCollectionAvailable: isCollectionAvailable === "true" ? true : false,
      search: debouncedSearch,
      page,
      size: 50,
    };


  // Replaced useLazy Query hooks entirely. These automatically trigger an optimized
  // backend network fetch pass the split second a user mounts or lands on this route path!
  const { data, isLoading: isProductsLoading } = useGetStoreListingsFeedQuery(
    queryDto,
    { refetchOnFocus: true, refetchOnMountOrArgChange: true },
  );
  const products = data?.listings || [];
  

  const { data: categories = [] } = useGetAllParentCategoriesQuery();

  const { data: wishlist = [] } = useGetWishListsQuery();
  const wishlists = wishlist.map((item) => item.listingId);

  const [addToWish] = useAddWishListMutation();
  const { email, sellerId: sellerProfileId } = useAppSelector(
    (state) => state.userSlice,
  );


  
  // ==========================================================================
  // HIGH-PERFORMANCE CLIENT FILTERS MEMOIZATION MATRIX
  // ==========================================================================
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Chronological and Pricing Sorting Configurations
    switch (sort) {
      case "price-low":
        result.sort((a, b) => a.newPrice - b.newPrice);
        break;

      case "price-high":
        result.sort((a, b) => b.oldPrice - a.oldPrice);
        break;

      case "discount":
        result.sort((a, b) => {
          const discountA = ((a.oldPrice - a.newPrice) / a.newPrice) * 100;
          const discountB = ((b.newPrice - b.oldPrice) / b.oldPrice) * 100;
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
  }, [products, searchTerm, sort]);

  // ==========================================================================
  // ACTION CONTROLLER HOOK HANDLERS
  // ==========================================================================
  const handleCategoryButtonClick = (categorySlug: string) => {
    const nextParams = new URLSearchParams(location.search);
    const category = categories.find((item) => item.slug === categorySlug);
    nextParams.set("category", categorySlug);
    // Navigating automatically shifts the reactive 'selectedCategory' token, re-firing the query
    navigate(
      `${location.pathname}?${nextParams.toString()}_${category ? category.id : "0"}`,
    );
  };

  const toggleWishlist = async (listingId: number) => {
    if (!email) return navigate("/login");
    await addToWish(listingId);
  };

  //handle modal state
  const onModalButtonClick = () => {
    setOpenModal(false);
  };

  //handle make offer click
  const handleMakeOffer = (product: TListTrans) => {
    if (!email) return navigate("/login");
    if (product) {
      setModalData({
        name: product.productName,
        id: product.listingId,
        currentPrice: product.newPrice,
        isNegotiable: product.negotiable,
      });
      setOpenModal(true);
    }
  };

    const hanldeSelectedCityParam = (city: string) => {
    const searchParams = new URLSearchParams(search);
    searchParams.set("collectionCity", city);
    navigate(`${pathname}?${searchParams.toString()}`);
  };

  const hanldeIsAvailableParam = (selected: boolean) => {
    const searchParams = new URLSearchParams(search);
    searchParams.set("isCollectionAvailable", String(selected));
    navigate(`${pathname}?${searchParams.toString()}`);
  };

  return (
    <main className="shop-page">
      <SEO
        title="Kupuj i sprzedawaj na Kasoa"
        description="Odkrywaj wyjątkowe produkty na Kasoa.pl. Wystawiaj przedmioty na sprzedaż bez negocjacji i bez bezpośredniego kontaktu z kupującymi."
        canonical="https://kasoa.pl/"
      />
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("shop.header.search_placeholder")}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
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
          className={selectedCategory === "all_0" ? "active" : ""}
          onClick={() => handleCategoryButtonClick("all")}
        >
          {t("shop.categories.all")}
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            className={
              selectedCategory === `${category.slug}_${category.id}`
                ? "active"
                : ""
            }
            onClick={() => handleCategoryButtonClick(category.slug)}
          >
            {t(`categories.${sanitizeCategoryKey(category.name)}.name`)}
          </button>
        ))}
      </section>

        {/** FILTER BY CITY FOR PRODUCTS WITH PERSONAL COLLECTION ENABLED */}
                  <div className="collection-city-filter">
                    <div>
                      <label htmlFor="isCollectionAvialable">
                        {t("categories.collection.collection_available")}
                      </label>
                      <input
                        type="checkbox"
                        id="isCollectionAvailable"
                        checked={isCollectionAvailable === "true" ? true : false}
                        name="isCollectionAvailable"
                        onChange={(e) => hanldeIsAvailableParam(e.target.checked)}
                      />
                    </div>
                    <div className="collection-city-filter__header">
                      <span className="collection-city-filter__title">
                        {t("categories.collection.city_list")}
                      </span>
      
                      {selectedCollectionCity && (
                        <button
                          type="button"
                          className="collection-city-filter__clear"
                          onClick={() => hanldeSelectedCityParam("")}
                        >
                          {t("catalog-browser.location.clear", {
                            defaultValue: "Clear",
                          })}
                          <FiX />
                        </button>
                      )}
                    </div>
      
                    <article>
                      <div className="collection-city-filter__options">
                        {COLLECTION_CITIES.map((city) => {
                          const isSelected = selectedCollectionCity === city.label;
      
                          return (
                            <button
                              key={city.value}
                              type="button"
                              className={`collection-city-filter__option ${
                                isSelected ? "is-selected" : ""
                              }`}
                              onClick={() =>
                                hanldeSelectedCityParam(isSelected ? "" : city.label)
                              }
                              aria-pressed={isSelected}
                            >
                              <span>{city.label}</span>
      
                              {isSelected && <FiX aria-hidden="true" />}
                            </button>
                          );
                        })}
                      </div>
                    </article>
                  </div>

      {/* =====================================================
                TOOLBAR
            ====================================================== */}

      <section className="shop-page__toolbar">
        <div className="shop-page__result-count">
          <strong>{filteredProducts.length}</strong>
          <span> {t("shop.toolbar.products_count")}</span>
        </div>

        <div className="shop-page__toolbar-actions">
         

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

      {error && <ErrorToast errorMessage={error} />}

      {/* =====================================================
                PRODUCTS
            ====================================================== */}

      {isProductsLoading || addCartLoading ? (
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
                  handleCategoryButtonClick("all");
                }}
              >
                {t("shop.empty.clear_btn")}
              </button>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const isWishlisted = wishlists.includes(product.listingId);

              const discount =
                product.oldPrice > 0 && product.oldPrice > product.newPrice
                  ? Math.round(
                      ((product.oldPrice - product.newPrice) /
                        product.oldPrice) *
                        100,
                    )
                  : 0;

              return (
                <article
                  className="shop-product-card"
                  key={product.listingId}
                >
                  {/* IMAGE */}
                  <div className="shop-product-card__media">
                    <Link
                      to={`/shop/listing/${product.productSlug}`}
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
                        display:
                          product.sellerId === Number(sellerProfileId)
                            ? "none"
                            : "flex",
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
                        {t(
                          `product_conditions.conditions.${sanitizeBackendKey(product.productCondition.toLowerCase())}`,
                        )}
                      </span>
                    </div>

                                 <div className="shop-product-card__bottom">
                      <div>
                        <strong>{formatPrice(product.newPrice) || 0} zł</strong>
                        {product.oldPrice && <del>{formatPrice(product.oldPrice) || 0} zł</del>}
                      </div>

                      {/* If it's the seller's own product, show ONLY the Edit button */}
                      {Number(sellerProfileId) === product.sellerId ? (
                        <button
                          className="shop-product-card__buy"
                          aria-label="Edytuj produkt"
                          onClick={() => navigate(`/account/listings/${product.listingId}/edit`)}
                        >
                          <FiEdit />
                        </button>
                      ) : (
                        /* If it's a buyer, show both Make Offer (if negotiable) and Buy buttons mutually */
                        <>
                          {product.negotiable? (
                            <button
                              className="make_offer"
                              onClick={() => handleMakeOffer(product)}
                            >
                              {t("shop.product.make_offer")}
                            </button>
                          ) :
                          <button
                            className="shop-product-card__buy"
                            aria-label="Kup produkt"
                            onClick={() => addItemToCart(product.listingId)}
                          >
                            <FiShoppingBag />
                          </button>
                        }
                         
                        </>
                      )}
                    </div>

                  </div>
                </article>
              );
            })
          )}
        </section>
      )}
      {/** MAKE OFFER MODAL */}
      {openModal && (
        <MakeOfferodal
          isNegotiable={Boolean(modalData?.isNegotiable)}
          productName={modalData?.name || ""}
          id={modalData?.id || 0}
          currentPrice={modalData?.currentPrice || 0}
          isOpen={openModal}
          onButtonClick={onModalButtonClick}
        />
      )}
      {data && (
        <Pagination
          accumulated={data.accumulatedItems}
          page={page}
          totalPage={data?.totalPages}
          size={data?.pageSize}
          totalElements={data?.totalElements}
        />
      )}
    </main>
  );
};

export default Shop;
