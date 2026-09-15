import { useState } from "react";
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

const MobileLanding = () => {
  const {data:topCategories=[],isLoading:isCategoriesLoading} = useGetTop6ProductCategoriesQuery()
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
    const username = useAppSelector((state)=>state.userSlice.username)


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
            SECOND-HAND, DONE DIFFERENTLY
          </span>

          <h1 className="mobile-hero__title">
            Good things.
            <br />
            <em>A second chance.</em>
          </h1>

          <p className="mobile-hero__description">
            Discover quality pre-owned products in one trusted place. Better
            finds, better prices, less waste.
          </p>

          <div className="mobile-hero__actions">
            <Link
              to="/shop"
              className="mobile-button mobile-button--primary"
            >
              <span>Start shopping</span>
              <FiArrowRight />
            </Link>

            <Link
              to="/sell"
              className="mobile-button mobile-button--secondary"
            >
              I have something to sell
            </Link>
          </div>
        </div>

        {/* HERO IMAGES */}

        <div className="mobile-hero__visual">
          <div className="mobile-hero__image mobile-hero__image--large">
            <img
                      src={hero}
              alt="Second-hand fashion"
            />
          </div>

          <div className="mobile-hero__image mobile-hero__image--small">
            <img
                src={heroSmall}
              alt="Second-hand accessory"
            />
          </div>

          <div className="mobile-hero__verified">
            <FiShield />

            <div>
              <strong>Verified sellers</strong>
              <span>Shop with confidence</span>
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
            <strong>Verified sellers</strong>
            <span>Sellers are checked</span>
          </div>
        </div>

        <div className="mobile-trust__item">
          <FiTruck />

          <div>
            <strong>Secure delivery</strong>
            <span>Tracked shipping</span>
          </div>
        </div>

        <div className="mobile-trust__item">
          <FiTag />

          <div>
            <strong>Better prices</strong>
            <span>Great products, less waste</span>
          </div>
        </div>

        <div className="mobile-trust__item">
          <FiRefreshCw />

          <div>
            <strong>Buyer protection</strong>
            <span>Shop with confidence</span>
          </div>
        </div>
      </section>

      {/* =====================================================
          CATEGORIES
      ====================================================== */}

      <section className="mobile-categories">
        <div className="mobile-section-heading">
          <div>
            <span className="mobile-section-eyebrow">DISCOVER</span>

            <h2>What are you looking for?</h2>
          </div>

          <Link to="/shop/categories">
            All
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
              <img
                src={category.image}
                alt={category.name}
              />

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
            <span className="mobile-section-eyebrow">NEW ARRIVALS</span>

            <h2>Just added</h2>
          </div>

          <Link to="/shop">
            View all
            <FiArrowRight />
          </Link>
        </div>

        <div className="mobile-product-grid">
          {products.map((product) => (
            <article
              key={product.id}
              className="mobile-product-card"
            >
              <Link
                to={`/product/${product.id}`}
                className="mobile-product-card__media"
              >
                <img
                  src={product.image}
                  alt={product.name}
                />
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

              <Link
                to={`/product/${product.id}`}
                className="mobile-product-card__info"
              >
                <span className="mobile-product-card__condition">
                  {product.condition}
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
            HAVE THINGS YOU NO LONGER USE?
          </span>

          <h2>
            You list it.
            <br />
            <em>We sell it.</em>
          </h2>

          <p>
            List your items in minutes. Set the amount you want to receive and
            let us take care of the selling.
          </p>

          <Link
            to="/sell"
            className="mobile-button mobile-button--light"
          >
            <span>Start selling</span>
            <FiArrowRight />
          </Link>
        </div>

        <div className="mobile-seller__steps">
          <div className="mobile-seller__step">
            <span>01</span>

            <div>
              <strong>List your item</strong>

              <p>Add photos, condition and the amount you want to receive.</p>
            </div>
          </div>

          <div className="mobile-seller__step">
            <span>02</span>

            <div>
              <strong>We find the buyer</strong>

              <p>Your item becomes part of the DrugaRęka store.</p>
            </div>
          </div>

          <div className="mobile-seller__step">
            <span>03</span>

            <div>
              <strong>Ship and get paid</strong>

              <p>When it sells, we give you everything you need to ship it.</p>
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

      <footer className="mobile-footer">
        <div className="mobile-footer__brand">
          <Link
            to="/"
            className="mobile-brand"
          >
            <span>Druga</span>Ręka
          </Link>

          <p>A better way to buy and sell pre-owned products.</p>
        </div>

        <div className="mobile-footer__links">
          <div>
            <h4>Shop</h4>

            <Link to="/shop">All products</Link>

            <Link to="/shop/categories">Categories</Link>

            <Link to="/shop">New arrivals</Link>
          </div>

          <div>
            <h4>Sell</h4>

            <Link to="/sell">How it works</Link>

            <Link to="/sell">Start selling</Link>
          </div>

          <div>
            <h4>Help</h4>

            <Link to="/sell">Help centre</Link>

            <Link to="/contact">Contact us</Link>
          </div>
        </div>

        <div className="mobile-footer__bottom">
          <span>© {new Date().getFullYear()} DrugaRęka</span>

          <div>
            <Link to="/privacy">Privacy</Link>

            <Link to="/terms">Terms</Link>
          </div>
        </div>
           <LanguageSwitcher/>
      </footer>
    </main>
  );
};

export default MobileLanding;
