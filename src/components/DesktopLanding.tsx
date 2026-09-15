import {
  FiArrowRight,
  FiHeart,
  FiRefreshCw,
  FiShield,
  FiTag,
  FiTruck
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useGetTop6ProductCategoriesQuery } from "../features/api/storeApi";
import heroSmall from './../assets/hero-small.png';
import hero from './../assets/hero.png';
import './../css/DesktopLanding.css';
import LanguageSwitcher from "./LanguageSwitcher";
import Loading from "./Loading";

const products = [
  {
    id: 1,
    name: "Nike Air Max",
    condition: "Very Good",
    price: "€69",
    image: "https://muvio.pl/images/sv270/126000-127000/Buty-Nike-Air-Force-1-07-Czarne-DZ4514-001_%5B126078%5D_480.jpg",
  },
  {
    id: 2,
    name: "The North Face Jacket",
    condition: "Excellent",
    price: "€79",
    image: "https://img01.ztat.net/article/spp-media-p1/7c9ba579a8d44553b07a1c5b098ecf5f/30d9a7787af0407d8f0af9c5e5428a30.jpg?imwidth=762",
  },
  {
    id: 3,
    name: "BabyBjörn Bliss",
    condition: "Very Good",
    price: "€65",
    image: "https://img.smyk.com/pl/pl/760x/https://bin.smyk.com/pl/pl/media/product/1600/1/babybjrn-bliss-mesh-lezaczek-szary-bez-7657413.jpg",
  },
  {
    id: 4,
    name: "Apple Watch",
    condition: "Good",
    price: "€139",
    image: "https://prod-api.mediaexpert.pl/api/images/gallery_500_500/thumbnails/images/81/8128821/Apple_Watch_Series_11_42mm_GPS_Jet_Black_Aluminum_Sport_Band_Black_PDP_Image_Position_1__pl-PL.jpg",
  },
];

export default function DesktopLanding() {
const {data:topCategories=[],isLoading} = useGetTop6ProductCategoriesQuery()


if(isLoading){
  return <Loading/>
}
    
  return (
    <main className="landing-page">
      <div className="landing-center">
              

      {/* =====================================================
                HERO
            ====================================================== */}

      <section className="hero">
        <div className="hero__content">
          <span className="hero__eyebrow">SECOND-HAND, DONE DIFFERENTLY</span>

          <h1>
            Good things.
            <br />
            <em>A second chance.</em>
          </h1>

          <p>
            Discover quality pre-owned products in one trusted place. Better
            finds, better prices, less waste.
          </p>

          <div className="hero__actions">
            <Link
              to="/shop"
              className="button button--primary"
            >
              Start shopping
              <FiArrowRight />
            </Link>

            <Link
              to="/sell"
              className="button button--secondary"
            >
              I have something to sell
            </Link>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero-card hero-card--large">
            <img
              src={hero}
              alt="Second-hand fashion"
            />
          </div>

          <div className="hero-card hero-card--small">
            <img
              src={heroSmall}
              alt=""
            />
          </div>

          <div className="hero-floating-card">
            <FiShield />

            <div>
              <strong>Verified sellers</strong>

              <span>Shop with confidence</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
                TRUST BAR
            ====================================================== */}

      <section className="trust-bar">
        <div className="trust-item">
          <FiShield />

          <div>
            <strong>Verified sellers</strong>

            <span>Sellers are checked</span>
          </div>
        </div>

        <div className="trust-item">
          <FiTruck />

          <div>
            <strong>Secure delivery</strong>

            <span>Tracked shipping</span>
          </div>
        </div>

        <div className="trust-item">
          <FiTag />

          <div>
            <strong>Better prices</strong>

            <span>Great products, less waste</span>
          </div>
        </div>

        <div className="trust-item">
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

      <section className="categories section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">DISCOVER</span>

            <h2>What are you looking for?</h2>
          </div>

          <Link to="/shop/categories">
            All categories
            <FiArrowRight />
          </Link>
        </div>

        <div className="category-grid">
          {topCategories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.slug}`}
              className="category-card"
            >
              <img
                src={category.image}
                alt={category.name}
              />

              <div className="category-card__overlay">
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

      <section className="products section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">NEW ARRIVALS</span>

            <h2>Just added</h2>
          </div>

          <Link to="/shop">
            View all
            <FiArrowRight />
          </Link>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="product-card"
            >
              <div className="product-card__media">
                <img
                  src={product.image}
                  alt={product.name}
                />

                <button
                  className="product-card__favorite"
                  aria-label={`Add ${product.name} to wishlist`}
                  onClick={(event) => {
                    event.preventDefault();
                  }}
                >
                  <FiHeart />
                </button>
              </div>

              <div className="product-card__info">
                <span className="product-card__condition">
                  {product.condition}
                </span>

                <h3>{product.name}</h3>

                <strong>{product.price}</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =====================================================
                SELLER CTA
            ====================================================== */}

      <section className="seller-section">
        <div className="seller-section__content">
          <span className="section-eyebrow">
            HAVE THINGS YOU NO LONGER USE OR BOUGHT SOMETHING BY MISTAKE AND CAN'T RETURN IT?
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
            className="button button--light"
          >
            Start selling
            <FiArrowRight />
          </Link>
        </div>

        <div className="seller-section__steps">
          <div className="seller-step">
            <span>01</span>

            <div>
              <strong>List your item</strong>

              <p>Add photos, condition and the amount you want to receive.</p>
            </div>
          </div>

          <div className="seller-step">
            <span>02</span>

            <div>
              <strong>We find the buyer</strong>

              <p>Your item becomes part of the DrugaRęka store.</p>
            </div>
          </div>

          <div className="seller-step">
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

      <section className="final-cta">
        <span className="section-eyebrow">DRUGA RĘKA</span>

        <h2>
          Shop better.
          <br />
          Give things another life.
        </h2>

        <Link
          to="/shop"
          className="button button--primary"
        >
          Explore the store
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
            <span>Druga</span>Ręka
          </Link>

          <p>A better way to buy and sell pre-owned products.</p>
        </div>

        <div className="landing-footer__links">
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
        <LanguageSwitcher/>
      </footer>
      </div>
    </main>
  );
}
