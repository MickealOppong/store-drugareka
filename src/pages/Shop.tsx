import { useEffect, useMemo, useState } from "react";
import {
  FiChevronDown,
  FiSearch,
  FiX,
} from "react-icons/fi";

import { useTranslation } from "react-i18next";
import {
  useLocation,
  useNavigate,
  useSearchParams
} from "react-router-dom";
import { Loading, Pagination } from "../components";
import { ErrorToast } from "../components/ErrorTaost";
import Footer from "../components/Footer";
import MakeOfferodal from "../components/MakeOfferModal";
import ProductListing from "../components/ProductListing";
import SEO from "../components/SEO";
import ShopBanner from "../components/ShopBanner";
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
import { sanitizeCategoryKey } from "../util/util";

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
      `${location.pathname}?${nextParams.toString()}_${category ? category.id : "0"}#shop-products`,
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

  const handleClearFilters = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("collectionCity");
    nextParams.delete("isCollectionAvailable");
    nextParams.set("page", "1");
    nextParams.delete("condition");
    nextParams.set("category", "all_0");
    navigate(`${window.location.pathname}?${nextParams.toString()}`);
  };

const {hash} = useLocation()

useEffect(() => {
  if (hash !== "#shop-products" || isProductsLoading) return;

  const frame = requestAnimationFrame(() => {
    const element = document.getElementById("shop-products");
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

  return (
    <>
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
         
          </div>
        </section>

         {/* SHOP HEADER */}

        <ShopBanner/>

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
  <div className="collection-city-filter__toggle">
    <div className="collection-city-filter__info">
      <strong>
        {t("categories.collection.collection_available")}
      </strong>
      <span>
        {t("categories.collection.collection_description", {
          defaultValue:
            "Find products you can collect directly from the seller.",
        })}
      </span>
    </div>

    <input
      type="checkbox"
      id="isCollectionAvailable"
      checked={isCollectionAvailable === "true"}
      onChange={(e) => hanldeIsAvailableParam(e.target.checked)}
    />
  </div>

  {isCollectionAvailable === "true" && (
    <div className="collection-city-filter__locations">
      <div className="collection-city-filter__header">
        <span className="collection-city-filter__title">
          {t("categories.collection.city_list")}
        </span>

        {selectedCollectionCity && (
          <button
            type="button"
            onClick={() => hanldeSelectedCityParam("")}
          >
            {t("categories.collection.clear_location")}
            <FiX />
          </button>
        )}
      </div>

      <div className="collection-city-filter__options">
        {COLLECTION_CITIES
          .toSorted((a, b) => a.label.localeCompare(b.label, "pl"))
          .map((city) => {
            const isSelected = selectedCollectionCity === city.label;

            return (
              <button
                key={city.value}
                type="button"
                className={`collection-city-filter__option ${
                  isSelected ? "is-selected" : ""
                }`}
                onClick={() =>
                  hanldeSelectedCityParam(
                    isSelected ? "" : city.label
                  )
                }
                aria-pressed={isSelected}
              >
                {city.label}
                {isSelected && <FiX />}
              </button>
            );
          })}
      </div>
    </div>
  )}
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
          <section className="shop-page__products"   id="shop-products">
            {filteredProducts.length === 0 ? (
              <div className="shop-page__empty">
                <FiSearch />
                <h2>{t("shop.empty.title")}</h2>
                <p>{t("shop.empty.description")}</p>
                <button
                  onClick={() => {
                    handleClearFilters();
                  }}
                >
                  {t("shop.empty.clear_btn")}
                </button>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <ProductListing
                  key={product.listingId}
                  product={product}
                  isWishlisted={wishlists.includes(product.listingId)}
                  isOwner={Number(sellerProfileId) === product.sellerId}
                  variant="shop"
                  onToggleWishlist={toggleWishlist}
                  onMakeOffer={handleMakeOffer}
                  onAddToCart={addItemToCart}
                  onEdit={(listingId) =>
                    navigate(`/account/listings/${listingId}/edit`)
                  }
                  onView={addView}
                />
              ))
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
        <Footer/>
      </main>

    </>
  );
};

export default Shop;
