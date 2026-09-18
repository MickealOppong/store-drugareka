import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { BuyerView, SellerView } from "../components";
import '../css/GenericViewLayout.css';
type UserOrderViewType = "buying" | "selling";

const Orders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  
  const currentView = (searchParams.get("view") as UserOrderViewType) || 
                      localStorage.getItem("view") || 
                      "buying";

  const handleViewChange = (view: UserOrderViewType) => {
    setSearchParams({ view, page: "1" });
    localStorage.setItem("view", view);
  };

  return (
    <main className="panel-view">
      {/* =================================================
                UNIVERSAL STATIC HEADER BLOCK
            ================================================== */}
      <header className="panel-view__header">
        <div>
          <span className="panel-view__eyebrow">{t("orders_view.header.eyebrow")}</span>
          <h1 className="panel-view__title">
            {currentView === "buying" 
              ? t("orders_view.header.title_buying") 
              : t("orders_view.header.title_selling")}
          </h1>
          <p className="panel-view__description">
            {currentView === "buying"
              ? t("orders_view.header.description_buying")
              : t("orders_view.header.description_selling")}
          </p>
        </div>
      </header>

      {/* =================================================
                TAB CONTEXT SWITCH SELECTION MODULE
            ================================================== */}
      <div className="panel-view__tab-group">
        <button
          type="button"
          className={`panel-view__tab-btn ${currentView === "buying" ? "is-active" : ""}`}
          onClick={() => handleViewChange("buying")}
        >
          {t("orders_view.tabs.buying")}
        </button>
        <button
          type="button"
          className={`panel-view__tab-btn ${currentView === "selling" ? "is-active" : ""}`}
          onClick={() => handleViewChange("selling")}
        >
          {t("orders_view.tabs.selling")}
        </button>
      </div>

      {/* =================================================
                SELF-CONTAINED SUB-VIEW MOUNT POINT
            ================================================== */}
      {currentView === "selling" ? <SellerView /> : <BuyerView />}
    </main>
  );
};

export default Orders;
