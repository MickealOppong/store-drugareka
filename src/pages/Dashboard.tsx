import { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiHeart,
  FiPackage,
  FiShoppingBag,
  FiTruck,
} from "react-icons/fi";
import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";
import {
  useAddWishListMutation,
  useGetUserDashboardQuery,
  useGetWishListsQuery,
  useLazyGetRecentViewsQuery,
} from "../features/api/itemApi";
import { useGetRecentSellerActivityQuery } from "../features/api/storeApi";
import { useAppSelector } from "../store";
import type { TDashboard } from "../types/TDashboard";
import { formatPrice } from "../util/util";
import "./../css/Dashboard.css"; // Imports your non-inline decoupled BEM style rules cleanly
import type { TListTrans } from "./../types/TListTrans";

const dashboardDef: TDashboard = {
  ordersCount: 0,
  awaitingShipmentCount: 0,
  itemSoldCount: 0,
  itemSoldCancelledCount: 0,
  listingCount: 0,
  outstandingPayout: 0,
  wishlistCount: 0,
};


const Dashboard = () => {
  const { data: dashboard = dashboardDef } = useGetUserDashboardQuery();

  //recent seller activity
const {data:sellingActivity=[]} = useGetRecentSellerActivityQuery()


  const {
    firstName,
    lastName,
    roles = [],
  } = useAppSelector((state) => state.userSlice);

  // Fallback array constraint blocks runtime trace rejections
  const isSeller = (roles || []).includes("ROLE_SELLER");

  /**
   * RECENT VIEWS PIPELINE
   */
  const [recentProducts, setRecentProducts] = useState<TListTrans[]>([]);
  const [fetchViewedItems] = useLazyGetRecentViewsQuery();

  /**
   * translation
   */
  const {t} = useTranslation()
  
  async function getRecentViews() {
    const rawIds = localStorage.getItem("recent_views");
    if (rawIds) {
      try {
        const ids: number[] = JSON.parse(rawIds);
        if (Array.isArray(ids) && ids.length > 0) {
          const response = await fetchViewedItems(ids);
          setRecentProducts((response.data as TListTrans[]) || []);
        }
      } catch (err) {
        console.error(
          "Failed to map historical browser view tracking logs:",
          err,
        );
      }
    }
  }

  /**
   * TOGGLE WISHLIST ACTION
   */
  const [addToWish] = useAddWishListMutation();
  const toggleWishlist = async (listingId: number) => {
    await addToWish(listingId);
  };

  /**
   * FETCH WISHLIST REGISTER MATRIX
   */
  const { data: wishlists = [] } = useGetWishListsQuery();
  const isWishlisted = wishlists.map((item) => item.listingId);

  useEffect(() => {
    getRecentViews();
  }, []);

  return (
    <section className="db-view">
      {/* =================================================
                1. MASTER ACCOUNT RUNTIME HEADER
          ================================================= */}
     <header className="db-view__header">
        <div className="db-view__header-meta">
          <span className="db-eyebrow">{t("dashboard.header.eyebrow")}</span>
          <h1 className="db-view__title">
            {t("dashboard.header.welcome")}, {firstName} {lastName}.
          </h1>
          <p className="db-view__description">
            {t("dashboard.header.description")}
          </p>
        </div>

        <Link to="/shop" className="db-shop-btn">
          <span>{t("dashboard.header.cta_shop")}</span>
          <FiArrowRight />
        </Link>
      </header>

      {/* =================================================
                2. HIGH-DENSITY METRICS STATS BLOCKS
          ================================================= */}
   <section className="db-stats-row">
        <Link to="/account/orders" className="db-stat-card">
          <div className="db-stat-card__icon">
            <FiShoppingBag />
          </div>
          <div className="db-stat-card__body">
            <span className="db-stat-card__label">{t("dashboard.stats.orders")}</span>
            <strong className="db-stat-card__value">
              {dashboard.ordersCount}
            </strong>
          </div>
          <FiArrowRight className="db-stat-card__arrow" />
        </Link>

        <Link to="/account/wishlist" className="db-stat-card">
          <div className="db-stat-card__icon">
            <FiHeart />
          </div>
          <div className="db-stat-card__body">
            <span className="db-stat-card__label">{t("dashboard.stats.wishlist")}</span>
            <strong className="db-stat-card__value">
              {dashboard.wishlistCount}
            </strong>
          </div>
          <FiArrowRight className="db-stat-card__arrow" />
        </Link>

        {isSeller && (
          <Link to="/account/listings" className="db-stat-card">
            <div className="db-stat-card__icon">
              <FiPackage />
            </div>
            <div className="db-stat-card__body">
              <span className="db-stat-card__label">{t("dashboard.stats.active_listings")}</span>
              <strong className="db-stat-card__value">
                {dashboard.listingCount}
              </strong>
            </div>
            <FiArrowRight className="db-stat-card__arrow" />
          </Link>
        )}
      </section>

      {/* =================================================
                3. PURCHASES USER ACTION PORTALS
          ================================================= */}
     <section className="db-section">
        <div className="db-section__header">
          <div>
            <span className="db-eyebrow">{t("dashboard.shopping_section.eyebrow")}</span>
            <h2 className="db-section__title">{t("dashboard.shopping_section.title")}</h2>
          </div>
          <Link to="/account/orders" className="db-section__header-link">
            <span>{t("dashboard.shopping_section.view_orders")}</span> <FiArrowRight />
          </Link>
        </div>

        <div className="db-actions-grid">
          <Link to="/shop" className="db-action-item db-action-item--primary">
            <div className="db-action-item__icon">
              <FiShoppingBag />
            </div>
            <div className="db-action-item__body">
              <strong>{t("dashboard.shopping_section.grid.shop_title")}</strong>
              <span>{t("dashboard.shopping_section.grid.shop_desc")}</span>
            </div>
            <FiArrowRight className="db-action-item__arrow" />
          </Link>

          <Link to="/account/wishlist" className="db-action-item">
            <div className="db-action-item__icon">
              <FiHeart />
            </div>
            <div className="db-action-item__body">
              <strong>{t("dashboard.shopping_section.grid.wishlist_title")}</strong>
              <span>
                {t("dashboard.shopping_section.grid.wishlist_desc", { count: dashboard.wishlistCount })}
              </span>
            </div>
            <FiArrowRight className="db-action-item__arrow" />
          </Link>

          <Link to="/account/orders" className="db-action-item">
            <div className="db-action-item__icon">
              <FiTruck />
            </div>
            <div className="db-action-item__body">
              <strong>{t("dashboard.shopping_section.grid.orders_title")}</strong>
              <span>{t("dashboard.shopping_section.grid.orders_desc")}</span>
            </div>
            <FiArrowRight className="db-action-item__arrow" />
          </Link>
        </div>
      </section>

      {/* =================================================
                4. SELLER INSIGHTS LOGISTICS SPLIT BLOCKS
          ================================================= */}
   {isSeller ? (
        <section className="db-section db-section--selling">
          <div className="db-section__header">
            <div>
              <span className="db-eyebrow">{t("dashboard.selling_section.eyebrow")}</span>
              <h2 className="db-section__title">{t("dashboard.selling_section.title")}</h2>
            </div>
            <Link to="/account/orders" className="db-section__header-link">
              <span>{t("dashboard.selling_section.view_dashboard")}</span> <FiArrowRight />
            </Link>
          </div>

          <div className="db-seller-stats">
            <div className="db-seller-metric">
              <span className="db-seller-metric__label">{t("dashboard.selling_section.metrics.active")}</span>
              <strong className="db-seller-metric__value">
                {dashboard.listingCount}
              </strong>
            </div>
            <div className="db-seller-metric">
              <span className="db-seller-metric__label">{t("dashboard.selling_section.metrics.sold")}</span>
              <strong className="db-seller-metric__value">
                {dashboard.itemSoldCount}
              </strong>
            </div>
            <div className="db-seller-metric">
              <span className="db-seller-metric__label">{t("dashboard.selling_section.metrics.cancelled")}</span>
              <strong className="db-seller-metric__value">
                {dashboard.itemSoldCancelledCount}
              </strong>
            </div>
            <div className="db-seller-metric">
              <span className="db-seller-metric__label">{t("dashboard.selling_section.metrics.awaiting")}</span>
              <strong className="db-seller-metric__value">
                {dashboard.awaitingShipmentCount}
              </strong>
            </div>
            <div className="db-seller-metric">
              <span className="db-seller-metric__label">{t("dashboard.selling_section.metrics.payout")}</span>
              <strong className="db-seller-metric__value">
                {formatPrice(dashboard.outstandingPayout)} zł
              </strong>
            </div>
          </div>

         <div className="db-activity-panel">
            <div className="db-activity-panel__header">
              <h3>{t("dashboard.selling_section.activity.title")}</h3>
              <Link to="/account/listings/me" className="db-section__header-link">
               {t("dashboard.selling_section.activity.view_listings")}
              </Link>
            </div>

            <div className="db-activity-panel__list">
              {sellingActivity.map((item) => (
                <div
                  key={item.id}
                  className="db-item-row"
                >
                  <div className="db-item-row__media">
                    <FiPackage />
                  </div>
                  <div className="db-item-row__info">
                    <strong>{item.name}</strong>
                  </div>
                  <div
                    className={`db-item-row__status db-item-row__status--${item.type}`}
                  >
                    {item.type === "sold" && <FiCheckCircle />}
                    {item.type === "shipping" && <FiTruck />}
                    {item.type === "active" && <FiClock />}
                    <span>{item.status}</span>
                  </div>
                  <Link
                    to={item.path}
                    className="db-item-row__action"
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
                   5. NON-SELLER UPGRADE REGISTRATION CTA
                ================================================= */
        <section className="db-sell-cta">
          <div className="db-sell-cta__content">
            HAVE SOMETHING YOU NO LONGER USE?Turn unused thingsinto money.List
            your item with DrugaRęka and let us handle the selling.
          </div>
        </section>
      )}
    </section>
  );
};

export default Dashboard;



