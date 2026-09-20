import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiEye, FiFlag, FiSearch } from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";

import { useGetSaleOrdersQuery } from "../features/api/itemApi";
import type { TOrdersDto } from "../types/TOrdersDto";
import { formatPrice } from "../util/util";
import Pagination from "./Pagination";

const BuyerView: React.FC = () => {
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  
  const page = parseInt(searchParams.get("page") || "1");

  // ISOLATED API COMPONENT FETCH
  const { data, isLoading, isError } = useGetSaleOrdersQuery({
    page,
    size:5,
  });

  const orders = (data?.orders as TOrdersDto[]) || [];

  // ISOLATED SEARCH FILTER ENGINE
  const filteredList = orders.filter((order) => {
    const query = search.toLowerCase().trim();
    if (!query) return true;
    return (
      String(order.orderNumber || order.id).includes(query) ||
      order.seller?.toLowerCase().includes(query)
    );
  });

  return (
    <>
      {/* LOCALIZED INDEPENDENT TOOLBAR */}
      <div className="panel-view__toolbar">
        <div className="panel-view__search-wrapper">
          <FiSearch />
          <input
            type="text"
            placeholder={t("buyer_view.toolbar.search_placeholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="panel-view__metrics-counter">
          {filteredList.length}{" "}
          {filteredList.length === 1 
            ? t("buyer_view.toolbar.count_singular") 
            : t("buyer_view.toolbar.count_plural")}
        </div>
      </div>

      {isError && (
        <div className="panel-view__error-box">{t("buyer_view.table.error")}</div>
      )}

      <section className="panel-view__content-card">
        {isLoading ? (
          <div className="panel-view__loading-overlay">{t("buyer_view.table.loading")}</div>
        ) : filteredList.length === 0 ? (
          <div className="panel-view__empty-state">
            <div className="panel-view__empty-title">{t("buyer_view.empty.title")}</div>
            <p>{search ? t("buyer_view.empty.search_desc") : t("buyer_view.empty.default_desc")}</p>
          </div>
        ) : (
          <div className="panel-view__scroll-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("buyer_view.table.headers.order")}</th>
                  <th>{t("buyer_view.table.headers.seller")}</th>
                  <th>{t("buyer_view.table.headers.subtotal")}</th>
                  <th>{t("buyer_view.table.headers.shipping")}</th>
                  <th>{t("buyer_view.table.headers.total")}</th>
                  <th>{t("buyer_view.table.headers.status")}</th>
                  <th>{t("buyer_view.table.headers.ordered_date")}</th>
                  <th className="data-table__actions-header">{t("buyer_view.table.headers.action")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="data-table__text font-semibold text-main">
                        #{order.orderNumber || order.id}
                      </span>
                    </td>
                    <td>
                      <div className="data-table__user-profile">
                        <span className="data-table__avatar-badge">
                          {order.seller?.charAt(0)?.toUpperCase()}
                        </span>
                        <span>{order.seller}</span>
                      </div>
                    </td>
                    <td>
                      <span className="data-table__text">{formatPrice(order.orderTotal)} {order.currency}</span>
                    </td>
                    <td>
                      <span className="data-table__text">{formatPrice(order.shipping)} {order.currency}</span>
                    </td>
                    <td>
                      <span className="data-table__text font-bold text-primary">
                        {formatPrice(order.orderTotal + order.shipping)} {order.currency}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-badge--${order.orderStatus?.toLowerCase().replace(/_/g, "-")}`}>
                        {t(`buyer_view.table.statuses.${order.orderStatus?.toLowerCase()}`, { defaultValue: order.orderStatus?.replace(/_/g, " ") })}
                      </span>
                    </td>
              
                    <td>
                      <span className="data-table__text text-muted">
                        {new Date(order.createdAt).toLocaleDateString("pl-PL")}
                      </span>
                    </td>
                    <td>
                      <div className="data-table__actions">
                        <Link to={`/account/orders/${order.id}/details`} className="data-table__action-link" title={t("buyer_view.actions.view_details")}>
                          <FiEye />
                        </Link>
                        <Link to={`/account/complaints/new/${order.id}`} className="data-table__action-link" title={t("buyer_view.actions.file_dispute")}>
                          <FiFlag />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* LOCALIZED PACING HOOKS */}
      {data && <Pagination page={page} totalPage={data.totalPages} size={data.pageSize} />}
    </>
  );
};

export default BuyerView;
