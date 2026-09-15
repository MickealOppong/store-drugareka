import { useMemo, useState } from "react";
import {
  FiChevronDown,
  FiHeart,
  FiSearch,
  FiShoppingBag,
  FiSliders,
  FiX,
} from "react-icons/fi";

import { Link, useNavigate, useSearchParams } from "react-router-dom";
import type { Store } from "redux";
import { Loading, Pagination } from "../components";
import {
  useAddWishListMutation,
  useGetWishListsQuery,
} from "../features/api/itemApi";
import { useGetAllCategoriesQuery, useGetStoreListingsFeedQuery } from "../features/api/storeApi";
import { useAddToCart } from "../hooks/useAddTocart";
import { useRecentViews } from "../hooks/useRecentViews";
import { useAppSelector, type RootState } from "../store";
import { formatPrice } from "../util/util";
import "./../css/Shop.css";

export const loader =
  (store: Store<RootState>) =>
  async ({ request }: { request: Request }) => {
    
    /*
    const url = new URLSearchParams(request.url.split("?")[1]);
    const queryCategory = url.get("category") as string;

    const dispatch = store.dispatch as AppDispatch;

    const promise = await dispatch(
      storeApi.endpoints.getStoreListingsFeed.initiate({
    queryCategory,
    page: 0,
    size: 20},
{
        forceRefetch: true,
      }),
    );

    const data: TListPageDto = promise.data as TListPageDto

    console.log(data);
    
    return data || { listings:[],totalPages:0,page:0,totalElements:0}
    */
   return null;

  };


const Shop = () => {

  //const data = useLoaderData()  as TListPageDto
  //const products = data.listings || [];
  //console.log(d);
  
const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addItemToCart} = useAddToCart();
  const { addView } = useRecentViews();

  // 1. Core State Trackers synchronized natively with standard parameters
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("newest");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  //const [wishlist, setWishlist] = useState<number[]>([]);

// Safely extract the default active category from URL line, falling back to global state
  const selectedCategory = searchParams.get("category") || "all";

  
  const request ={
    queryCategory:selectedCategory,
    page: 0,
    size: 50}

  // Replaced useLazy Query hooks entirely. These automatically trigger an optimized 
  // backend network fetch pass the split second a user mounts or lands on this route path!
  const {  data, isLoading: isProductsLoading  } =useGetStoreListingsFeedQuery(request,{refetchOnFocus:true,refetchOnMountOrArgChange:true})
  const products = data?.listings || []
  
  
  
  const { 
    data: categories = [] } =useGetAllCategoriesQuery();

  
    

  const {data:wishlist=[]} = useGetWishListsQuery();
     const wishlists = wishlist.map((item) => item.listingId);

  const [addToWish] = useAddWishListMutation();
  const username = useAppSelector((state) => state.userSlice.username);


  
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
          product.productName.toLowerCase().includes(query)
      );
    }

    // Chronological and Pricing Sorting Configurations
    switch (sort) {
      case "price-low":
        result.sort((a, b) => a.priceDto.storeNewPrice - b.priceDto.storeNewPrice);
        break;

      case "price-high":
        result.sort((a, b) => b.priceDto.storeNewPrice - a.priceDto.storeNewPrice);
        break;

      case "discount":
        result.sort((a, b) => {
          const discountA = ((a.priceDto.storeNewPrice - a.priceDto.storeOldPrice) / a.priceDto.storeNewPrice) * 100;
          const discountB = ((b.priceDto.storeNewPrice - b.priceDto.storeOldPrice) / b.priceDto.storeOldPrice) * 100;
          return discountB - discountA;
        });
        break;

      case "oldest":
        result.sort((a, b) => {
          const dateDiff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          return dateDiff !== 0 ? dateDiff : a.listingId - b.listingId;
        });
        break;

      default: // Newest (Chronological Summary Snapshot Sort)
        result.sort((a, b) => {
          const dateDiff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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

          <h1>Znajdź coś wyjątkowego</h1>

          <p>Sprawdzone produkty z drugiej ręki w atrakcyjnych cenach.</p>
        </div>

        {/* SEARCH */}

        <div className="shop-page__search">
          <FiSearch />

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Szukaj produktów, marek..."
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
          Wszystko
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            className={selectedCategory === category.slug ? "active" : ""}
            onClick={() => handleCategoryButtonClick(category.slug)}
          >
            {category.name}
          </button>
        ))}
      </section>

      {/* =====================================================
                TOOLBAR
            ====================================================== */}

      <section className="shop-page__toolbar">
        <div className="shop-page__result-count">
          <strong>{filteredProducts.length}</strong>

          <span>produktów</span>
        </div>

        <div className="shop-page__toolbar-actions">
          {/* MOBILE FILTER */}

          <button
            className="shop-page__filter-button"
            onClick={() => setShowFilters(true)}
          >
            <FiSliders />
            Filtry
          </button>

          {/* SORT */}

          <div className="shop-page__sort">
            <span>Sortuj:</span>

            <div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest">Najnowsze</option>
                <option value="oldest">Najstarze</option>

                <option value="price-low">Cena: rosnąco</option>

                <option value="price-high">Cena: malejąco</option>

                <option value="discount">Największa okazja</option>
              </select>

              <FiChevronDown />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
                PRODUCTS
            ====================================================== */}

          {
            isProductsLoading ?<Loading/>:
              <section className="shop-page__products">
        {filteredProducts.length === 0 ? (
          <div className="shop-page__empty">
            <FiSearch />

            <h2>Nie znaleziono produktów</h2>

            <p>Spróbuj zmienić wyszukiwanie lub wybrać inną kategorię.</p>

            <button
              onClick={() => {
                setSearch("");
                handleCategoryButtonClick("all");
              }}
            >
              Wyczyść filtry
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
                      src={product?.media[0].image}
                      alt={product.productName}
                      loading="lazy"
                      onClick={() => addView(product.listingId)}
                    />
                  </Link>

                  <span className="shop-product-card__discount">
                    -{discount}%
                  </span>

                  <button
                    className={`shop-product-card__wishlist ${
                      isWishlisted ? "active" : ""
                    }`}
                    onClick={() => toggleWishlist(product.listingId)}
                    aria-label="Dodaj do ulubionych"
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
                    <span>{product.productCondition}</span>
                  </div>

                  <div className="shop-product-card__bottom">
                    <div>
                      <strong>
                        {formatPrice(product.priceDto.storeNewPrice)||0} zł
                      </strong>

                      <del>
                        {formatPrice(product.priceDto.storeOldPrice)||0} zł
                      </del>
                    </div>

                    <button
                      className="shop-product-card__buy"
                      aria-label="Kup produkt"
                      onClick={()=>addItemToCart(product.listingId)}
                    >
                      <FiShoppingBag />
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>
          }
          <Pagination page={data?.page as number} totalPage={data?.totalPages as number} size={data?.pageSize as number}/>

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
              <h2>Filtry</h2>

              <button onClick={() => setShowFilters(false)}>
                <FiX />
              </button>
            </div>

            <div className="shop-filter-drawer__body">
              <label>Kategoria</label>

              <select
                value={selectedCategory}
                onChange={() => {
                  //setSelectedCategory(selectedCategory);

                  setShowFilters(false);
                }}
              >
                <option value="all">Wszystkie</option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.name}
                  >
                    {category.name}
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


export default Shop


