import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiArrowRight, FiSearch, FiX } from "react-icons/fi";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { ConditionFilter, Loading } from "../components";
import CategoryTree from "../components/CategoryTree";
import Footer from "../components/Footer";
import MakeOfferModal from "../components/MakeOfferModal";
import ProductListing from "../components/ProductListing";
import SEO from "../components/SEO";
import "../css/Categories.css";
import { COLLECTION_CITIES } from "../data/data";
import {
  useAddWishListMutation,
  useGetWishListsQuery,
} from "../features/api/itemApi";
import {
  useGetCategoryTreeQuery,
  useGetStoreListingsFeedQuery,
  useGetTop8ProductCategoriesQuery,
} from "../features/api/storeApi";
import { useAddToCart } from "../hooks/useAddTocart";
import { useAppSelector } from "../store";
import type { TListTrans } from "../types/TListTrans";
import type { TQueryDto } from "../types/TQueryDto";
import { sanitizeCategoryKey } from "../util/util";

export const Categories: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addItemToCart } = useAddToCart();
  const { search, pathname } = useLocation();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { email: username, sellerId: sellerProfileId } = useAppSelector(
    (state) => state.userSlice,
  );

  const { data: wishlist = [] } = useGetWishListsQuery();
  const wishlists = wishlist.map((item) => item.listingId);

  //make offer modal
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalData, setModalData] = useState<{
    name: string;
    id: number;
    currentPrice: number;
    isNegotiable: boolean;
  } | null>(null);

  const [selectedSubCat, setSelectedSubCat] = useState<number | null>(null);

  const {
    data: catalogTree = [],
    isLoading,
    error,
  } = useGetCategoryTreeQuery();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const selectedCategory = searchParams.get("category") || "all";
  const condition = searchParams.get("condition") || "";
  const selectedCollectionCity = searchParams.get("collectionCity") || "";
  const isCollectionAvailable =
    searchParams.get("isCollectionAvailable") || "false";

  const queryDto: TQueryDto = {
    category: selectedCategory,
    collectionCity: selectedCollectionCity,
    isCollectionAvailable: isCollectionAvailable === "true" ? true : false,
    search: debouncedSearch,
    condition,
    page,
    size: 50,
  };

  //top categories
  const { data: topCategories = [] } = useGetTop8ProductCategoriesQuery();

  const [addToWish] = useAddWishListMutation();

  const toggleWishlist = async (listingId: number) => {
    if (!username) {
      navigate("/login");
      return;
    }

    await addToWish(listingId);
  };

  const { data, isLoading: isProductsLoading } = useGetStoreListingsFeedQuery(
    queryDto,
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    },
  );

  const products = data?.listings || [];

  const handleClearFilters = () => {
    setSelectedSubCat(null);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("collectionCity");
    nextParams.delete("isCollectionAvailable");
    nextParams.set("page", "1");
    nextParams.delete("condition");
    nextParams.set("category", "all_0");
    navigate(`${window.location.pathname}?${nextParams.toString()}`);
  };

  const findCategory = () => {
    if (!selectedCategory) return null;

    const searchTarget = selectedCategory.substring(
      0,
      selectedCategory.lastIndexOf("_"),
    );

    // Recursive worker helper
    const searchBranches = (nodes: any[]): any | null => {
      for (const node of nodes) {
        // Check both properties dynamically based on your schema fields
        const nodeValue = node.slug.toLowerCase();

        if (nodeValue === searchTarget) {
          return node;
        }

        if (node.subCategories && node.subCategories.length > 0) {
          const foundDeep = searchBranches(node.subCategories);
          if (foundDeep) return foundDeep;
        }
      }
      return null;
    };

    return searchBranches(catalogTree);
  };



  const extractCategoryPath = (path: string) => {
    if (!path) return { parent: null, child: null };

    // Remove leading/trailing slashes and filter out blank segments
    const segments = path.split("/").filter(Boolean);

    return {
      parent: segments[0] || null,
      child: segments[1] || null,
    };
  };

  const category = findCategory();
  // Usage Example:
  const { parent, child } = extractCategoryPath(category ? category.path : "");

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
    navigate(`${pathname}?${searchParams.toString()}#category-products`);
  };

const {hash} = useLocation()

useEffect(() => {
  if (hash !== "#category-products" || isProductsLoading) return;

  const frame = requestAnimationFrame(() => {
    const element = document.getElementById("category-products");
    if (!element) return;

    const position =
      element.getBoundingClientRect().top + window.scrollY - 100;

    window.scrollTo({
      top: position,
      behavior: "smooth",
    });
  });

  return () => cancelAnimationFrame(frame);
}, [hash, pathname, search, isProductsLoading, products.length]);


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
    <main >
      <SEO
        title={
          parent
            ? `${t(`categories.${parent}.name`)} na sprzedaż | Kasoa.pl`
            : "Wszystkie produkty na sprzedaż | Kasoa.pl"
        }
        description={
          parent
            ? `Przeglądaj ${t(
                `categories.${parent}.name`,
              )} na Kasoa.pl. Odkrywaj oferty, porównuj ceny i znajdź produkty dopasowane do swoich potrzeb.`
            : "Przeglądaj produkty na Kasoa.pl. Odkrywaj oferty z różnych kategorii i znajdź produkty dopasowane do swoich potrzeb."
        }
        canonical={
          category
            ? `https://kasoa.pl/shop/categories?category=${encodeURIComponent(selectedCategory)}`
            : "https://kasoa.pl/shop/categories"
        }
      />
      <section className="catalog-page">
        <div className="catalog-browser">
          {/* SIDEBAR NAVIGATION */}
          <aside className="catalog-browser__sidebar">
            <h2
              className="catalog-browser__sidebar-title"
              onClick={() => navigate("/shop/categories?category=all_0")}
              role="button"
            >
              {t("categories.header.title", {
                defaultValue: "Categories",
              })}
            </h2>
            {/** CATEGORY TREEE */}

            <CategoryTree />
            <ConditionFilter />
          </aside>

          {/* PRODUCT FEED */}
          <div className="catalog-browser__feed">
            {/* =====================================================
                        CATEGORIES
                    ====================================================== */}

            <section className="catalog-top-categories top-categories">
              <div className="top-categories-heading">
                <div>
                  <h2>{t("categories.feed.title")}</h2>
                </div>
              </div>

              <div className="top-categories-grid">
                {topCategories.map((category) => (
                  <Link
                  id="products"
                    key={category.id}
                    to={`/shop/categories?category=${category.slug}_${category.id}#category-products`}
                    className="category-card"
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                    />
                    <div className="top-categories-card__overlay">
                      <h3>
                        {" "}
                        {t(
                          `categories.${sanitizeCategoryKey(category.name)}.name`,
                        )}
                      </h3>
                      <FiArrowRight />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
            <header className="catalog-browser__feed-header">
              <h1 className="catalog-browser__feed-title">
                {parent
                  ? t(`categories.${parent as string}.name`)
                  : t("categories.feed.all_listing", {
                      defaultValue: "All Available Listings",
                    })}
              </h1>
              <h4>
                {child &&
                  t(
                    `categories.${parent as string}.subcategories.${child as string}`,
                  )}
              </h4>

              <h4 className="catalog-browser__feed-title">
                {selectedSubCat ? t("") : ""}
              </h4>
            </header>

            {/** GENERIC SEARCH  */}

            {!isProductsLoading && (
              <div className="catalog-condition-search">
                <label
                  className="catalog-condition-search__label"
                  htmlFor="catalog-condition-search-input"
                >
                  {t("catalog-browser.condition_search.label")}
                </label>

                <div className="catalog-condition-search__control">
                  <FiSearch aria-hidden="true" />

                  <input
                    id="catalog-condition-search-input"
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder={t(
                      "catalog-browser.condition_search.placeholder",
                    )}
                    aria-label={t("categories.condition_search.label")}
                  />

                  {searchTerm && (
                    <button
                      type="button"
                      className="catalog-condition-search__clear"
                      onClick={() => setSearchTerm("")}
                      aria-label={t("categories.condition_search.clear")}
                    >
                      <FiX />
                    </button>
                  )}
                </div>
              </div>
            )}

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
                  {COLLECTION_CITIES.toSorted((a, b) => {
                    return a.label.localeCompare(b.label, "pl");
                  }).map((city) => {
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
            ) : /* PRODUCT GRID */
            products.length === 0 ? (
              <div className="catalog-browser__empty-feed">
                <div className="catalog-browser__empty-icon-box">
                  <FiSearch />
                </div>
                <h3 className="catalog-browser__empty-title">
                  {t("categories.condition_search.no_results", {
                    defaultValue: "No products match your search.",
                  })}
                </h3>
                <button
                  type="button"
                  className="catalog-browser__empty-reset-btn"
                  onClick={() => setSearchTerm("")}
                >
                  <FiX />
                  <span>
                    {t("categories.condition_search.clear", {
                      defaultValue: "Clear search",
                    })}
                  </span>
                </button>
              </div>
            ) : (
              <div className="category-page__products" id="category-products">
                {products.map((product) => (
                  <ProductListing
                    key={product.listingId}
                    product={product}
                    isWishlisted={wishlists.includes(product.listingId)}
                    isOwner={product.sellerId === sellerProfileId}
                    variant="category"
                    onToggleWishlist={toggleWishlist}
                    onMakeOffer={handleMakeOffer}
                    onAddToCart={addItemToCart}
                    onEdit={(listingId) =>
                      navigate(`/account/listings/${listingId}/edit`)
                    }
                  />
                ))}
              </div>
            )}

            {openModal && (
              <MakeOfferModal
                productName={modalData?.name || ""}
                id={modalData?.id || 0}
                currentPrice={modalData?.currentPrice || 0}
                isOpen={openModal}
                onButtonClick={onModalButtonClick}
                isNegotiable={Boolean(modalData?.isNegotiable)}
              />
            )}
          </div>
        </div>

      </section>
    <Footer/>
    </main>
  );
};

export default Categories;
