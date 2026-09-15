import { useState } from "react";
import { AiOutlineSafety } from "react-icons/ai";
import {
  FiArrowLeft,
  FiHeart,
  FiRefreshCw,
  FiShield,
  FiShoppingBag,
  FiTag,
  FiTruck,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { useAddWishListMutation, useGetWishListsQuery } from "../features/api/itemApi";
import { useGetListingQuery } from "../features/api/storeApi";
import "./../css/ProductDetails.css";



const ProductDetails = () => {
  const { listingId } = useParams<string>();
  const navigate = useNavigate();

  //add to cart
  const [addToWish]= useAddWishListMutation()
  const {data:wishlist=[]} = useGetWishListsQuery()
  const Wishlists= wishlist.map((item)=>item.listingId)

  //error
  const [error,setError] = useState<string>('')


  
  // Local interface states for media interactions
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  //const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

  /**
   *
   *  fetch product
   */
  const {data:product,isLoading}= useGetListingQuery(parseInt(listingId as string))


  // Currency Converter Formatter Helper Block
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pl-PL", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  
  if(error){
    return <div>
       <p>{error}</p>
      <button  onClick={()=>navigate(-1)}>
      Return
      </button>
    </div>
  }


  if (isLoading) {
    return <p>Loading</p>;
  }


  if(product){

      // Dynamic values derivation layer
  const savingsAmount =product?.priceDto.storeNewPrice - product?.priceDto.storeOldPrice;
  const savingsPercent = Math.round(
    (savingsAmount / product?.priceDto.storeOldPrice) * 100,
  );




    return (
    <section className="product-details">
      {/* 1. STRUCTURAL BREADCRUMB HEADER NAV */}
      <header className="product-details__nav-header">
        <button
          type="button"
          className="product-details__back-btn"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft /> Wróć
        </button>
        <span className="product-details__category-crumb">
          Sklep / {product.category}
        </span>
      </header>

      {/* =====================================================
             2. PRIMARY SINGLE PRODUCT GRID WINDOW CONTAINER
          ====================================================== */}
      <article className="product-details__main-wrapper">
        {/* MEDIA DISPLAY COLUMN CONTAINER */}
        <div className="product-details__media-showcase">
          <div className="product-details__primary-viewport">
            <img
              src={product.media[activeImageIdx].image}
              alt={`${product?.productName} - View ${activeImageIdx + 1}`}
              className="product-details__main-image"
            />
          </div>

          {product?.media.length > 1 && (
            <div className="product-details__thumbnails-grid">
              {product.media.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`product-details__thumb-trigger ${idx === activeImageIdx ? "product-details__thumb-trigger--active" : ""}`}
                  onClick={() => setActiveImageIdx(idx)}
                >
                  <img
                    src={imgUrl.image}
                    alt={`Thumbnail preview window indicator slot ${idx + 1}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INTERACTIVE INFORMATION DESCRIPTIONS METRICS COLUMN */}
        <div className="product-details__content-panel">
          <span className="product-details__brand-label">{product.brand}</span>
          <h1 className="product-details__product-title">{product.productName}</h1>

          <div className="product-details__condition-badge">
            <span>
              Stan: <strong>{product.productCondition}</strong>
            </span>
          </div>
             <div className="product-details__condition-badge">
            <span>
              Dostepnosc: <strong>{product.inventoryStatus}</strong>
            </span>
          </div>

          <p className="product-details__narrative-description">
            {product.productDescription}
          </p>

          {/* FINANCIAL PRICING SUMMARY GROUPS */}
          <div className="product-details__pricing-matrix">
            <div className="product-details__price-row">
              <strong className="product-details__deal-price">
                {formatPrice(product.priceDto.storeNewPrice)} zł
              </strong>
              {product.priceDto.storeOldPrice > product.priceDto.storeNewPrice && (
                <del className="product-details__strike-price">
                  {formatPrice(product.priceDto.storeOldPrice)} zł
                </del>
              )}
            </div>
            {product.priceDto.storeOldPrice > product.priceDto.storeNewPrice && (
              <p className="product-details__savings-banner">
                Oszczędzasz {formatPrice(savingsAmount)} zł ({savingsPercent}%)
              </p>
            )}
          </div>

          {/* ECO-SYSTEM SECURITY ASSURANCES BADGES */}
          <div className="product-details__safety-strip">
            <AiOutlineSafety className="product-details__safety-icon" />
            <p className="product-details__safety-text">
              Bezpieczny zakup z 14-dniowym prawem do zwrotu towaru
            </p>
          </div>

          {/* ACTION BUTTON TRANSACTIONS CONSOLE */}
          <div className="product-details__action-row">
            <button
              type="button"
              className="product-details__buy-now-btn"
            >
              <FiShoppingBag /> <span>Kup teraz</span>
            </button>

            <button
              type="button"
              className={`product-details__wishlist-btn ${Wishlists.includes(product.listingId) ? "product-details__wishlist-btn--active" : ""}`}
              onClick={() =>addToWish(product.listingId)}
            >
              <FiHeart />
              <span>
                {Wishlists.includes(product.listingId)? "Obserwujesz" : "Dodaj do obserwowanych"}
              </span>
            </button>
          </div>
        </div>
      </article>

      {/* =====================================================
             3. TRUST STATEMENT VALUE VALUE BAR PROPOSITIONS
          ====================================================== */}
      <section className="product-details__trust-bar">
        <div className="product-details__trust-item">
          <FiShield className="product-details__trust-icon" />
          <div className="product-details__trust-text-group">
            <strong>Zweryfikowani sprzedawcy</strong>
            <span>Wszyscy użytkownicy przechodzą proces autoryzacji</span>
          </div>
        </div>

        <div className="product-details__trust-item">
          <FiTruck className="product-details__trust-icon" />
          <div className="product-details__trust-text-group">
            <strong>Ubezpieczona dostawa</strong>
            <span>Pełna możliwość śledzenia przesyłki kurierskiej</span>
          </div>
        </div>

        <div className="product-details__trust-item">
          <FiTag className="product-details__trust-icon" />
          <div className="product-details__trust-text-group">
            <strong>Okazyjne ceny rynkowe</strong>
            <span>Świetne produkty, mniej zmarnowanych zasobów</span>
          </div>
        </div>

        <div className="product-details__trust-item">
          <FiRefreshCw className="product-details__trust-icon" />
          <div className="product-details__trust-text-group">
            <strong>Program Ochrony Kupujących</strong>
            <span>Kupuj z poczuciem pełnego bezpieczeństwa</span>
          </div>
        </div>
      </section>

      {/* =====================================================
             4. COMPONENT FOOTER FEATURED PRODUCTS SLIDER 
          ====================================================== */}
      <section className="product-details__featured-carousel">
        {/* Related item cards map injections insert loop blocks mount layer */}
      </section>
    </section>
  );
  }else{
    return <p>Oops error</p>
  }

};

export default ProductDetails;
