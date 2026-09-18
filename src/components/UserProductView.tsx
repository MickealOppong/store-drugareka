import { useState } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { useGetMylistingsQuery } from "../features/api/itemApi";
import { useAppSelector } from "../store";
import type { TListTrans } from "../types/TListTrans";
import { isFetchBaseQueryError } from "../util/util";
import "./../css/GenericViewLayout.css"; // Reuses your unified generic layout styles seamlessly

const UserProductView = () => {
    const [searchParams,] = useSearchParams();
  // Read active pagination location straight from URL parameters (1-indexed base)
  const page = parseInt(searchParams.get("page" )as string)||1;
  const size = 30;
  const { data, isLoading: productsLoading, error } = useGetMylistingsQuery({ page, size });
  console.log(data);
  
  const productListings = data?.listings as TListTrans[];
  const [search, setSearch] = useState("");
  const [deletingId] = useState<number | null>(null);

  /**
   * ROLE AUTH CHECK
   */
  const roles = useAppSelector((state) => state.userSlice.roles);

  /**
   *  translation
   */
  const {t} = useTranslation()

  /*
   * Delete Handler Action
   */
  const handleDelete = async (product: TListTrans) => {
    const confirmed = window.confirm(
      `Czy na pewno chcesz usunąć produkt ID: "${product.productId}"?`,
    );

    if (!confirmed) {
      return;
    }
    // Handle actual deletion hook logic here if needed
  };

  if (!productListings) {
    return null;
  }

  /*
   * Filtering logic calculation based on input string
   */
  const filteredList = productListings.filter((product) =>
    product.productName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="panel-view">
      {/* =====================================================
                GENERIC HEADER BLOCK
            ====================================================== */}
    <header className="panel-view__header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span className="panel-view__eyebrow">{t("user_products.header.eyebrow")}</span>
          <h1 className="panel-view__title">{t("user_products.header.title")}</h1>
          <p className="panel-view__description">{t("user_products.header.description")}</p>
        </div>

        {/* Dynamic add button using your standard Sage Green styling elements */}
        {!roles.includes("ROLE_ADMIN") && (
          <Link
            to="/account/listings/new"
            className="data-table__action-link"
            style={{ display: "flex", gap: "0.5rem", padding: "0 1rem", width: "auto", minWidth: "130px", height: "40px", backgroundColor: "#66704A", color: "#ffffff", borderColor: "#66704A", borderRadius: "12px", textDecoration: "none", fontWeight: 600, fontSize: "14px" }}
          >
            <FiPlus />
            {t("user_products.header.add_btn")}
          </Link>
        )}
      </header>


      {/* =====================================================
                GENERIC TOOLBAR GRID
            ====================================================== */}
   <div className="panel-view__toolbar">
        <div className="panel-view__search-wrapper">
          <FiSearch />
          <input
            type="text"
            placeholder={t("user_products.toolbar.search_placeholder")}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="panel-view__metrics-counter">
          {filteredList.length}{" "}
          {filteredList.length === 1 
            ? t("user_products.toolbar.count_singular") 
            : t("user_products.toolbar.count_plural")}
        </div>
      </div>

      {/* =====================================================
                GENERIC ERROR ROW MAPPER
            ====================================================== */}
     {error && (
        <div className="panel-view__error-box">
          {isFetchBaseQueryError(error)}
        </div>
      )}

      {/* =====================================================
                GENERIC COMPONENT CONTAINER CARD
            ====================================================== */}
      <section className="panel-view__content-card">
        {productsLoading ? (
          <div className="panel-view__loading-overlay">{t("user_products.table.loading")}</div>
        ) : filteredList.length === 0 ? (
          <div className="panel-view__empty-state">
            <div className="panel-view__empty-title">{t("user_products.empty.title")}</div>
            <p>
              {search
                ? t("user_products.empty.search_desc")
                : t("user_products.empty.default_desc")}
            </p>
          </div>
        ) : (
          <div className="panel-view__scroll-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("user_products.table.headers.name")}</th>
                  <th>{t("user_products.table.headers.id")}</th>
                  <th>{t("user_products.table.headers.description")}</th>
                  {roles.includes("ROLE_ADMIN") && <th>{t("user_products.table.headers.seller_id")}</th>}
                  <th>{t("user_products.table.headers.slug")}</th>
                  <th>{t("user_products.table.headers.brand")}</th>
                  <th>{t("user_products.table.headers.category")}</th>
                  <th>{t("user_products.table.headers.price")}</th>
                  <th>{t("user_products.table.headers.product_status")}</th>
                  <th>{t("user_products.table.headers.listing_status")}</th>
                  <th className="data-table__actions-header">{t("user_products.table.headers.actions")}</th>
                </tr>
              </thead>

              <tbody>
                {filteredList.map((product) => (
                  <tr key={product.productId}>
                    {/* AVATAR ICON + PRODUCT NAME */}
                    <td>
                      <div className="data-table__user-profile">
                        <span className="data-table__avatar-badge">
                          {product.productName?.charAt(0)?.toUpperCase()}
                        </span>
                        <span className="font-semibold text-main">{product.productName}</span>
                      </div>
                    </td>

                    {/* PRODUCT ID */}
                    <td>
                      <span className="data-table__text text-muted">
                        #{product.productId}
                      </span>
                    </td>

                    {/* DESCRIPTION PREVIEW */}
                    <td>
                      <span className="data-table__text text-muted" title={product.productDescription}>
                        {product.productDescription ? `${product.productDescription.substring(0, 30)}...` : ''}
                      </span>
                    </td>

                    {/* ROLE-RESTRICTED SELLER LINK ROW */}
                    {roles.includes("ROLE_ADMIN") && (
                      <td>
                        <span className="data-table__text text-muted">
                          {product.sellerId}
                        </span>
                      </td>
                    )}

                    {/* SLUG */}
                    <td>
                      <span className="data-table__text text-muted">
                        {product.productSlug}
                      </span>
                    </td>

                    {/* BRAND */}
                    <td>
                      <span className="data-table__text font-semibold">
                        {product.brand}
                      </span>
                    </td>

                    {/* CATEGORY */}
                    <td>
                      <span className="data-table__text">
                        {product.category}
                      </span>
                    </td>

                    {/* PRICE IN PLN */}
                    <td>
                      <span className="data-table__text font-bold text-primary">
                        {product.priceDto.sellerNewPrice} zł
                      </span>
                    </td>

                    {/* PHYSICAL ITEM AVAILABILITY BADGE */}
                    <td>
                      <span className={`status-badge status-badge--${product.inventoryStatus?.toLowerCase().replace(/_/g, "-")}`}>
                        {t(`user_products.table.statuses.${product.inventoryStatus?.toLowerCase()}`, { defaultValue: product.inventoryStatus?.replace(/_/g, " ") })}
                      </span>
                    </td>

                    {/* PUBLIC LISTING FEED DISPLAY BADGE */}
                    <td>
                      <span className={`status-badge status-badge--${product.listingStatus?.toLowerCase().replace(/_/g, "-")}`}>
                        {t(`user_products.table.statuses.${product.listingStatus?.toLowerCase()}`, { defaultValue: product.listingStatus?.replace(/_/g, " ") })}
                      </span>
                    </td>

                    {/* MULTI-ACTION SELECTION MATRIX COLUMN */}
                    <td>
                      <div className="data-table__actions" style={{ gap: "0.5rem" }}>
                        <Link
                          to={`/account/listings/${product.listingId}/edit`}
                          className="data-table__action-link"
                          title={t("user_products.actions.edit_hint")}
                          style={{ display: product.inventoryStatus === 'SOLD' ? 'none' : 'flex' }}
                        >
                          <FiEdit2 />
                        </Link>

                        <button
                          type="button"
                          className="data-table__action-link"
                          style={{ color: "#e11d48" ,display:product.inventoryStatus==='AVAILABLE'?'flex':'none'}}
                          title={t("user_products.actions.delete_hint")}
                          disabled={deletingId === product.productId}
                          onClick={() => handleDelete(product)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
};

export default UserProductView;
