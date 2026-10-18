import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FiArrowRight,
  FiEdit,
  FiHeart,
  FiSearch,
  FiShoppingBag,
  FiX
} from "react-icons/fi";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Loading } from "../components";
import CategoryTree from "../components/CategoryTree";
import MakeOfferModal from "../components/MakeOfferModal";
import "../css/Categories.scss";
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

  //make offer modal
  const[openModal,setOpenModal] = useState<boolean>(false)
    const[modalData,setModalData] = useState<{name:string,id:number,currentPrice:number,isNegotiable:boolean}|null>(null)


  const [selectedSubCat, setSelectedSubCat] = useState<number | null>(null);

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
    request,
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    },
  );

  const products = data?.listings || [];


  const handleClearFilters = () => {
    setSelectedSubCat(null);

    const nextParams = new URLSearchParams(window.location.search);
    nextParams.set("category", "all");

    navigate(`${window.location.pathname}?${nextParams.toString()}`);
  };

 
const findCategory = () => {
  if (!selectedCategory) return null;

  const searchTarget = selectedCategory.toLowerCase();


  // Recursive worker helper
  const searchBranches = (nodes: any[]): any | null => {
    for (const node of nodes) {
      // Check both properties dynamically based on your schema fields
      const nodeValue = (node.slug).toLowerCase();
      
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


const category = findCategory()
// Usage Example:
const { parent, child } = extractCategoryPath(category?category.path:'');


  //handle modal state
  const onModalButtonClick =()=>{
    setOpenModal(false)
  }

  //handle make offer click
  const handleMakeOffer = (product:TListTrans)=>{
   if (!username) return navigate("/login");
    if(product){
    setModalData({name:product.productName,id:product.listingId,currentPrice:product.priceDto.sellerNewPrice,isNegotiable:product.priceDto.sellerNewPrice!==product.priceDto.sellerNewPrice})
    setOpenModal(true)
    }
  
  }


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
    <section className="catalog-page">
      <div className="catalog-browser">
        {/* SIDEBAR NAVIGATION */}
        <aside className="catalog-browser__sidebar">
          <h2
            className="catalog-browser__sidebar-title"
            onClick={() => navigate("/shop/categories")}
            role="button"
          >
            {t("categories.header.title", {
              defaultValue: "Categories",
            })}
          </h2>
          {/** CATEGORY TREEE */}
     
          <CategoryTree />
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
                  key={category.id}
                  to={`/shop/categories?category=${category.slug}_${category.id}`}
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
                ? t(
                    `categories.${sanitizeCategoryKey(parent as string)}.name`
                  )
                : t("categories.feed.all_listing", {
                    defaultValue: "All Available Listings",
                  })}
            </h1>
            <h4>
                {child &&
               t(
                    `categories.${sanitizeCategoryKey(parent as string)}.subcategories.${sanitizeCategoryKey(child as string)}`
                  )
                }
            </h4>

              <h4 className="catalog-browser__feed-title">
              {selectedSubCat
                ? t(
                  ""  
                  )
                : ""
}
            </h4>
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
            <div className="category-page__products">
              {products.map((product) => {
                const isWishlisted = wishlists.includes(product.listingId);
                const oldPrice = product.priceDto.sellerOldPrice;
                const newPrice = product.priceDto.sellerNewPrice;

                const discount =
                  oldPrice > 0
                    ? Math.round(((oldPrice - newPrice) / oldPrice) * 100)
                    : 0;

                const conditionKey = sanitizeBackendKey(
                  product.productCondition.toLowerCase(),
                );

                return (
                  <article
                    className="category-product-card"
                    key={product.listingId}
                  >
                    {/* ==========================================================================
            MEDIA REGION: THUMBNAILS, DISCOUNTS & WISHLIST OVERLAYS
            ========================================================================== */}
                    <div className="category-product-card__media">
                      <Link
                        to={`/shop/listing/${product.listingId}`}
                        className="category-product-card__image-link"
                      >
                        <img
                          src={product?.media?.[0]?.image}
                          alt={product.productName}
                          loading="lazy"
                        />
                      </Link>

                      {discount > 0 && (
                        <span className="category-product-card__discount">
                          -{discount}%
                        </span>
                      )}

                      <button
                        type="button"
                        className={`category-product-card__wishlist ${isWishlisted ? "active" : ""}`}
                        onClick={() => toggleWishlist(product.listingId)}
                        aria-label={t("shop.product.add_wishlist", {
                          defaultValue: "Add to wishlist",
                        })}
                        aria-pressed={isWishlisted}
                        style={{
                          display:
                            product.sellerId === userId ? "none" : "flex",
                        }}
                      >
                        <FiHeart />
                      </button>
                    </div>

                    {/* ==========================================================================
            CONTENT REGION: METADATA & TYPOGRAPHY INFO HIERARCHIES
            ========================================================================== */}
                    <div className="category-product-card__content">
                      <span className="category-product-card__brand">
                        {product.brand}
                      </span>

                      <h2>
                        <Link to={`/shop/listing/${product.listingId}`}>
                          {product.productName}
                        </Link>
                      </h2>

                      <div className="category-product-card__condition">
                        <span>
                          {t(`product_conditions.${conditionKey}`, {
                            defaultValue: product.productCondition,
                          })}
                        </span>
                                {
                      product.priceDto.sellerMinPrice!==null&& product.priceDto.sellerMinPrice!==product.priceDto.sellerNewPrice 
                      &&  <button className="make_offer" onClick={()=>handleMakeOffer(product)}>{t("shop.product.make_offer")}</button>
                     }
                      </div>

                      {/* ==========================================================================
              BOTTOM REGION: PRICE MARKERS & INTERACTIVE ACTION BUTTONCTAS
              ========================================================================== */}
                      <div className="category-product-card__bottom">
                        <div>
                          <strong>{formatPrice(newPrice) || 0} zł</strong>
                          {oldPrice > 0 && (
                            <del>{formatPrice(oldPrice) || 0} zł</del>
                          )}
                        </div>
                   

                        {product.sellerId !== userId ? (
                          <button
                            type="button"
                            className="category-product-card__buy"
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
                            className="category-product-card__buy"
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
                         {/** MAKE OFFER MODAL */}
                          {
                        openModal && <MakeOfferModal  productName={modalData?.name || ''} id={modalData?.id || 0} currentPrice={modalData?.currentPrice || 0} isOpen={openModal} onButtonClick={onModalButtonClick} isNegotiable={Boolean(modalData?.isNegotiable)}/>
                    }
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
     
    </section>
  );
};

export default Categories;
