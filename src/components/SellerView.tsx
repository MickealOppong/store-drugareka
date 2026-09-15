import React, { useState } from "react";
import { FiEye, FiFlag, FiSearch } from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";

import { useGetPurchaseOrdersQuery } from "../features/api/itemApi";
import type { TOrdersDto } from "../types/TOrdersDto";
import { formatPrice } from "../util/util";
import Pagination from "./Pagination";

const SellerView: React.FC = () => {
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  
  const page = parseInt(searchParams.get("page") || "1", 10);
  const size = 10;

  // ISOLATED API COMPONENT FETCH
  const { data, isLoading, isError ,error} = useGetPurchaseOrdersQuery({
    page,
    size,
  });

  const orders = (data?.orders as TOrdersDto[]) || [];

  
  

  // ISOLATED SEARCH FILTER ENGINE
  const filteredList = orders.filter((order) => {
    const query = search.toLowerCase().trim();
    if (!query) return true;
    return (
      String(order.orderNumber || order.id).includes(query) ||
      order.buyer?.toLowerCase().includes(query)
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
            placeholder="Search sales..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="panel-view__metrics-counter">
          {filteredList.length} {filteredList.length === 1 ? "sale" : "sales"}
        </div>
      </div>

      {isError && (
        <div className="panel-view__error-box">Unable to fetch sales records.</div>
      )}

      <section className="panel-view__content-card">
        {isLoading ? (
          <div className="panel-view__loading-overlay">Loading sales...</div>
        ) : filteredList.length === 0 ? (
          <div className="panel-view__empty-state">
            <div className="panel-view__empty-title">No sales found</div>
            <p>{search ? "No sales match your search." : "Your sales records will appear here."}</p>
          </div>
        ) : (
          <div className="panel-view__scroll-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Buyer</th>
                  <th>Subtotal</th>
                  <th>Shipping</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th className="data-table__actions-header">Action</th>
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
                        <span className="data-table__avatar-badge" style={{ backgroundColor: "#e2e8f0", color: "#475569" }}>
                          {order.buyer?.charAt(0)?.toUpperCase()}
                        </span>
                        <span>{order.buyer}</span>
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
                        {order.orderStatus?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td>
                      <span className="data-table__text text-muted">
                        {new Date(order.createdAt).toLocaleDateString("pl-PL")}
                      </span>
                    </td>
                    <td>
                      <div className="data-table__actions">
                        <Link to={`/account/orders/${order.id}`} className="data-table__action-link" title="View Details">
                          <FiEye />
                        </Link>
                        <Link to={`/account/complaints/new/${order.id}`} className="data-table__action-link" title="File Dispute">
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
      {data && <Pagination page={data.page} totalPage={data.totalPages} size={data.pageSize} />}
    </>
  );
};

export default SellerView;
