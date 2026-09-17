import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FiArrowRight,
  FiHeart,
  FiRefreshCw,
  FiShield,
  FiTag,
  FiTruck
} from "react-icons/fi";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { appName } from "../data/data";
import { useLogoutMutation } from "../features/api/authApi";
import { useGetTop6ProductCategoriesQuery } from "../features/api/storeApi";
import { logoutUser } from "../features/slice/userSlice";
import { useAppSelector } from "../store";
import heroSmall from './../assets/hero-small.png';
import hero from './../assets/hero.png';
import './../css/MobileLanding.css';
import LanguageSwitcher from "./LanguageSwitcher";
import Loading from "./Loading";

const products = [
  {
    id: 1,
    name: "Nike Air Max",
    condition: "Very Good",
    price: "€69",
    image:
      "https://muvio.pl/images/sv270/126000-127000/Buty-Nike-Air-Force-1-07-Czarne-DZ4514-001_%5B126078%5D_480.jpg",
  },
  {
    id: 2,
    name: "The North Face Jacket",
    condition: "Excellent",
    price: "€79",
    image:
      "https://img01.ztat.net/article/spp-media-p1/7c9ba579a8d44553b07a1c5b098ecf5f/30d9a7787af0407d8f0af9c5e5428a30.jpg?imwidth=762",
  },
  {
    id: 3,
    name: "BabyBjörn Bliss",
    condition: "Very Good",
    price: "€65",
    image:
      "https://img.smyk.com/pl/pl/760x/https://bin.smyk.com/pl/pl/media/product/1600/1/babybjrn-bliss-mesh-lezaczek-szary-bez-7657413.jpg",
  },
  {
    id: 4,
    name: "Apple Watch",
    condition: "Good",
    price: "€139",
    image:
      "https://prod-api.mediaexpert.pl/api/images/gallery_500_500/thumbnails/images/81/8128821/Apple_Watch_Series_11_42mm_GPS_Jet_Black_Aluminum_Sport_Band_Black_PDP_Image_Position_1__pl-PL.jpg",
  },
];
// Helper function to dynamically map status strings into matching JSON keys
const getConditionKey = (condition:string) => {
  if (!condition) return "good";
  return condition.toLowerCase().replace(/\s+/g, '_');
};


const MobileLanding = () => {
  const {data:topCategories=[],isLoading:isCategoriesLoading} = useGetTop6ProductCategoriesQuery()
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
    const username = useAppSelector((state)=>state.userSlice.username)

//
const {t}=useTranslation()
     //dispatcher
      const dispatch = useDispatch()
  
      //nivaget hook
      const navigate = useNavigate();
  
      //refresh token
      const refreshToken = localStorage.getItem('rtk') as string;
  
      //logout hook
      const [logout,{isLoading}]= useLogoutMutation()
    
      const handleAccountLogout =async ()=>{
  
      const response=  await logout(refreshToken)
  
        if(response.data===true){
            dispatch(logoutUser())
            navigate('/')
        }
  
        
      }

        if(isLoading || isCategoriesLoading){
            return <Loading/>
          }
          

  return (
    <main className="mobile-landing">
      {/* =====================================================
          MOBILE HEADER
      ====================================================== */}




      {/* =====================================================
          HERO
      ====================================================== */}

 <section className="mobile-hero">
        <div className="mobile-hero__content">
          <span className="mobile-hero__eyebrow">
            {t("landing.hero.eyebrow")}
          </span>

          <h1 className="mobile-hero__title">
            {t("landing.hero.title_line1")}
            <br />
            <em>{t("landing.hero.title_line2")}</em>
          </h1>

          <p className="mobile-hero__description">
            {t("landing.hero.description")}
          </p>

          <div className="mobile-hero__actions">
            <Link to="/shop" className="mobile-button mobile-button--primary">
              <span>{t("landing.hero.cta_shop")}</span>
              <FiArrowRight />
            </Link>

            <Link to="/sell" className="mobile-button mobile-button--secondary">
              {t("landing.hero.cta_sell")}
            </Link>
          </div>
        </div>

        {/* HERO IMAGES */}
        <div className="mobile-hero__visual">
          <div className="mobile-hero__image mobile-hero__image--large">
            <img src={hero} alt="Second-hand fashion" />
          </div>

          <div className="mobile-hero__image mobile-hero__image--small">
            <img src={heroSmall} alt="Second-hand accessory" />
          </div>

          <div className="mobile-hero__verified">
            <FiShield />
            <div>
              <strong>{t("landing.hero.floating_badge")}</strong>
              <span>{t("landing.hero.floating_sub")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TRUST
      ====================================================== */}
 <section className="mobile-trust">
        <div className="mobile-trust__item">
          <FiShield />
          <div>
            <strong>{t("landing.trust_bar.verified_title")}</strong>
            <span>{t("landing.trust_bar.verified_sub")}</span>
          </div>
        </div>

        <div className="mobile-trust__item">
          <FiTruck />
          <div>
            <strong>{t("landing.trust_bar.delivery_title")}</strong>
            <span>{t("landing.trust_bar.delivery_sub")}</span>
          </div>
        </div>

        <div className="mobile-trust__item">
          <FiTag />
          <div>
            <strong>{t("landing.trust_bar.prices_title")}</strong>
            <span>{t("landing.trust_bar.prices_sub")}</span>
          </div>
        </div>

        <div className="mobile-trust__item">
          <FiRefreshCw />
          <div>
            <strong>{t("landing.trust_bar.protection_title")}</strong>
            <span>{t("landing.trust_bar.protection_sub")}</span>
          </div>
        </div>
      </section>

      {/* =====================================================
          CATEGORIES
      ====================================================== */}

 <section className="mobile-categories">
        <div className="mobile-section-heading">
          <div>
            <span className="mobile-section-eyebrow">{t("landing.categories.eyebrow")}</span>
            <h2>{t("landing.categories.title")}</h2>
          </div>

          <Link to="/shop/categories">
            {t("landing.categories.view_all")}
            <FiArrowRight />
          </Link>
        </div>

        <div className="mobile-category-list">
          {topCategories.map((category) => (
            <Link
              key={category.id}
              to={`/shop/${category.name}`}
              className="mobile-category-card"
            >
              <img src={category.image} alt={category.name} />
              <div className="mobile-category-card__overlay">
                <h3>{category.name}</h3>
                <FiArrowRight />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =====================================================
          NEW ARRIVALS
      ====================================================== */}

  <section className="mobile-products">
        <div className="mobile-section-heading">
          <div>
            <span className="mobile-section-eyebrow">{t("landing.new_arrivals.eyebrow")}</span>
            <h2>{t("landing.new_arrivals.title")}</h2>
          </div>

          <Link to="/shop">
            {t("landing.new_arrivals.view_all")}
            <FiArrowRight />
          </Link>
        </div>

        <div className="mobile-product-grid">
          {products.map((product) => (
            <article key={product.id} className="mobile-product-card">
              <Link to={`/product/${product.id}`} className="mobile-product-card__media">
                <img src={product.image} alt={product.name} />
              </Link>

              <button
                type="button"
                className="mobile-product-card__favorite"
                aria-label={`Add ${product.name} to wishlist`}
                onClick={() => {
                  // Add wishlist logic here
                }}
              >
                <FiHeart />
              </button>

              <Link to={`/product/${product.id}`} className="mobile-product-card__info">
                <span className="mobile-product-card__condition">
                  {t(`landing.new_arrivals.conditions.${getConditionKey(product.condition)}`)}
                </span>
                <h3>{product.name}</h3>
                <strong>{product.price}</strong>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* =====================================================
          SELLER CTA
      ====================================================== */}

      <section className="mobile-seller">
        <div className="mobile-seller__content">
          <span className="mobile-section-eyebrow">
            {t("landing.seller_cta.eyebrow")}
          </span>

          <h2>
            {t("landing.seller_cta.title_line1")}
            <br />
            <em>{t("landing.seller_cta.title_line2")}</em>
          </h2>

          <p>{t("landing.seller_cta.description")}</p>

          <Link to="/sell" className="mobile-button mobile-button--light">
            <span>{t("landing.seller_cta.cta")}</span>
            <FiArrowRight />
          </Link>
        </div>

        <div className="mobile-seller__steps">
          <div className="mobile-seller__step">
            <span>01</span>
            <div>
              <strong>{t("landing.seller_cta.step1_title")}</strong>
              <p>{t("landing.seller_cta.step1_desc")}</p>
            </div>
          </div>

          <div className="mobile-seller__step">
            <span>02</span>
            <div>
              <strong>{t("landing.seller_cta.step2_title")}</strong>

              <p>{t("landing.seller_cta.step2_desc")}</p>
            </div>
          </div>

          <div className="mobile-seller__step">
            <span>03</span>

            <div>
              <strong>{t("landing.seller_cta.step3_title")}</strong>

              <p>{t("landing.seller_cta.step3_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section className="mobile-final-cta">
        <span className="mobile-section-eyebrow">DRUGA RĘKA</span>

        <h2>
          Shop better.
          <br />
          Give things another life.
        </h2>

        <Link
          to="/shop"
          className="mobile-button mobile-button--primary"
        >
          <span>Explore the store</span>
          <FiArrowRight />
        </Link>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

       <footer className="landing-footer">
            <div className="landing-footer__brand">
              <Link
                to="/"
                className="brand"
              >
                {appName}<span>.pl</span>
              </Link>
    
              <p>{t("landing.footer.tagline")}</p>
            </div>
    
            <div className="landing-footer__links">
              <div>
                <h4>{t("landing.footer.heading_shop")}</h4>
    
                <Link to="/shop">{t("landing.footer.link_all_products")}</Link>
    
                <Link to="/shop/categories">{t("landing.footer.link_categories")}</Link>
    
                <Link to="/shop">{t("landing.footer.link_new_arrivals")}</Link>
              </div>
    
              <div>
                <h4>{t("landing.footer.heading_sell")}</h4>
    
                <Link to="/sell">{t("landing.footer.link_how_it_works")}</Link>
    
                <Link to="/sell">{t("landing.footer.link_start_selling")}</Link>
              </div>
    
              <div>
                <h4>{t("landing.footer.heading_help")}</h4>
    
                <Link to="/sell">{t("landing.footer.link_help_centre")}</Link>
    
                <Link to="/contact">{t("landing.footer.link_contact")}</Link>
              </div>
            </div>
            <LanguageSwitcher/>
          </footer>
    </main>
  );
};

export default MobileLanding;
