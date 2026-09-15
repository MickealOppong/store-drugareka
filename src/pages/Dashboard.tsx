import { Link } from "react-router-dom";
import "./../css/Dashboard.css";

import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiHeart,
  FiPackage,
  FiPlus,
  FiShoppingBag,
  FiTruck,
} from "react-icons/fi";

import { useEffect, useState } from "react";
import type { Store } from "redux";
import { useAddWishListMutation, useGetUserDashboardQuery, useGetWishListsQuery, useLazyGetRecentViewsQuery } from "../features/api/itemApi";
import { useAppSelector, type RootState } from "../store";
import type { TDashboard } from "../types/TDashboard";
import { formatPrice } from "../util/util";
import type { TListTrans } from "./../types/TListTrans";


const sellingActivity = [
  {
    id: 1,
    name: "Nike Air Max",
    status: "Sold",
    type: "sold",
  },
  {
    id: 2,
    name: "Baby stroller",
    status: "Awaiting shipment",
    type: "shipping",
  },
  {
    id: 3,
    name: "Zara Jacket",
    status: "Active",
    type: "active",
  },
];
const dashboardDef:TDashboard = {
  ordersCount: 0,
  awaitingShipmentCount: 0,
  itemSoldCount: 0,
  listingCount: 0,
  outstandingPayout: 0,
  wishlistCount: 0
}
export const loader = (store: Store<RootState>) => async () => {
  /*
  const dispatch = store.dispatch as AppDispatch;
  const response = await dispatch(
    itemApi.endpoints.getUserDashboard.initiate(),
  );
  */
  return null;
};

const Dashboard = () => {
  const {data:dashboard=dashboardDef} = useGetUserDashboardQuery()

  const { firstName, lastName, roles } = useAppSelector(
    (state) => state.userSlice,
  );
  const isSeller = roles.includes("ROLE_SELLER");

  /**
   *  RECENT VIEWS
   */
  const [recentProducts, setRecentProducts] = useState<TListTrans[]>([]);


  const [fetchViewedItems] = useLazyGetRecentViewsQuery();
  const ids: number[] = JSON.parse(
    localStorage.getItem("recent_views") as string,
  );

  async function getRecentViews() {
    if (ids!==null) {
      const response = await fetchViewedItems(ids);
      setRecentProducts((response.data as TListTrans[]) || []);
    }
  }

  /**
   * TOGGLE WISHLIST
   */

   const [addToWish] = useAddWishListMutation();
  
    const toggleWishlist = async (listingId: number) => {

      await addToWish(listingId);
    
    };

    /**
     * fetch wish list
     */
  const {data:wishlists=[]} = useGetWishListsQuery();
    const isWishlisted = wishlists.map((item) => item.listingId);


  useEffect(() => {

    getRecentViews();
  }, []);


 
  

  return (
    <section className="dashboard">
      {/* =================================================
                HEADER
            ================================================= */}

      <header className="dashboard__header">
        <div>
          <span className="dashboard__eyebrow">MY ACCOUNT</span>

          <h1>Welcome {`${firstName} ${lastName}`}.</h1>

          <p>Manage your shopping and selling activity from one place.</p>
        </div>

        <Link
          to="/shop"
          className="dashboard__shop-button"
        >
          Continue shopping
          <FiArrowRight />
        </Link>
      </header>

      {/* =================================================
                QUICK STATS
            ================================================= */}

      <section className="dashboard__stats">
        <Link
          to="/account/orders"
          className="dashboard-stat"
        >
          <div className="dashboard-stat__icon">
            <FiShoppingBag />
          </div>

          <div className="dashboard-stat__content">
            <span>Orders</span>

            <strong>{dashboard.ordersCount}</strong>
          </div>

          <FiArrowRight className="dashboard-stat__arrow" />
        </Link>

        <Link
          to="/account/wishlist"
          className="dashboard-stat"
        >
          <div className="dashboard-stat__icon">
            <FiHeart />
          </div>

          <div className="dashboard-stat__content">
            <span>Wishlist</span>

            <strong>{dashboard.wishlistCount}</strong>
          </div>

          <FiArrowRight className="dashboard-stat__arrow" />
        </Link>

        {isSeller && (
          <Link
            to="/account/listings"
            className="dashboard-stat"
          >
            <div className="dashboard-stat__icon">
              <FiPackage />
            </div>

            <div className="dashboard-stat__content">
              <span>Active listings</span>

              <strong>{dashboard.listingCount}</strong>
            </div>

            <FiArrowRight className="dashboard-stat__arrow" />
          </Link>
        )}
      </section>

      {/* =================================================
                SHOPPING SECTION
            ================================================= */}

      <section className="dashboard-section">
        <div className="dashboard-section__header">
          <div>
            <span className="dashboard-section__eyebrow">SHOPPING</span>

            <h2>Your shopping</h2>
          </div>

          <Link to="/account/orders">
            View orders
            <FiArrowRight />
          </Link>
        </div>

        <div className="dashboard-actions">
          <Link
            to="/shop"
            className="dashboard-action dashboard-action--primary"
          >
            <div className="dashboard-action__icon">
              <FiShoppingBag />
            </div>

            <div>
              <strong>Continue shopping</strong>

              <span>Discover something new</span>
            </div>

            <FiArrowRight />
          </Link>

          <Link
            to="/account/wishlist"
            className="dashboard-action"
          >
            <div className="dashboard-action__icon">
              <FiHeart />
            </div>

            <div>
              <strong>Your wishlist</strong>

              <span>{`${dashboard.wishlistCount} saved items`}</span>
            </div>

            <FiArrowRight />
          </Link>

          <Link
            to="/account/orders"
            className="dashboard-action"
          >
            <div className="dashboard-action__icon">
              <FiTruck />
            </div>

            <div>
              <strong>Your orders</strong>

              <span>Track your purchases</span>
            </div>

            <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* =================================================
                SELLING SECTION
            ================================================= */}

      {isSeller ? (
        <section className="dashboard-section dashboard-section--selling">
          <div className="dashboard-section__header">
            <div>
              <span className="dashboard-section__eyebrow">SELLING</span>

              <h2>Your selling</h2>
            </div>

            <Link to="/account/listings">
              Seller dashboard
              <FiArrowRight />
            </Link>
          </div>

          {/* SELLING STATS */}

          <div className="selling-stats">
            <div className="selling-stat">
              <span>Active listings</span>

              <strong>{dashboard.listingCount}</strong>
            </div>

            <div className="selling-stat">
              <span>Items sold</span>

              <strong>{dashboard.itemSoldCount}</strong>
            </div>

            <div className="selling-stat">
              <span>Awaiting shipment</span>

              <strong>{dashboard.awaitingShipmentCount}</strong>
            </div>

            <div className="selling-stat">
              <span>Available payout</span>

              <strong>{dashboard.outstandingPayout}</strong>
            </div>
          </div>

          {/* SELLING ACTIVITY */}

          <div className="selling-activity">
            <div className="selling-activity__header">
              <h3>Recent activity</h3>

              <Link to="/account/listings">View listings</Link>
            </div>

            <div className="selling-activity__list">
              {sellingActivity.map((item) => (
                <div
                  key={item.id}
                  className="selling-item"
                >
                  <div className="selling-item__image">
                    <FiPackage />
                  </div>

                  <div className="selling-item__name">
                    <strong>{item.name}</strong>
                  </div>

                  <div
                    className={`
                                            selling-item__status
                                            selling-item__status--${item.type}
                                        `}
                  >
                    {item.type === "sold" && <FiCheckCircle />}

                    {item.type === "shipping" && <FiTruck />}

                    {item.type === "active" && <FiClock />}

                    <span>{item.status}</span>
                  </div>

                  <Link
                    to={`/account/listings/${item.id}`}
                    className="selling-item__arrow"
                  >
                    <FiArrowRight />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        /* =================================================
                   NON SELLER
                ================================================= */

        <section className="dashboard-sell-cta">
          <div className="dashboard-sell-cta__content">
            <span>HAVE SOMETHING YOU NO LONGER USE?</span>

            <h2>
              Turn unused things
              <br />
              into money.
            </h2>

            <p>List your item with DrugaRęka and let us handle the selling.</p>

            <Link
              to="/sell"
              className="dashboard-sell-cta__button"
            >
              Start selling
              <FiArrowRight />
            </Link>
          </div>

          <div className="dashboard-sell-cta__icon">
            <FiPlus />
          </div>
        </section>
      )}

      {/* =================================================
                RECENTLY VIEWED
            ================================================= */}

      <section className="dashboard-section">
        <div className="dashboard-section__header">
          <div>
            <span className="dashboard-section__eyebrow">DISCOVER</span>

            <h2>Recently viewed</h2>
          </div>

          <Link to="/shop">
            Explore the store
            <FiArrowRight />
          </Link>
        </div>

        <div className="dashboard-products">
          {recentProducts.map((product) => (

            <div
              key={product.listingId}
        
              className="dashboard-product"
            >
              <Link       to={`/shop/listing/${product.listingId}`} className="dashboard-product__image">
                <img
                  src={product.media[0].image}
                  alt={product.productName}
                />
              </Link>
                <button
                  className={`dashboard-product__favorite ${
                      isWishlisted.includes(product.listingId) ? "active" : ""
                    }`}
                  onClick={() => {
                    toggleWishlist(product.inventoryId)
                  }}
                  
                >
                  <FiHeart />
                </button>

              <div className="dashboard-product__info">
             
                <span>{product.productCondition}</span>

                <h3>{product.brand}</h3>

                <strong>{formatPrice(product.priceDto.storeNewPrice)} zł</strong>
                
              </div>
              
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};
export default Dashboard;
