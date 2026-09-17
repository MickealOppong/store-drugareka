import React from "react";
import { useParams } from "react-router-dom";

import { useGetPurchaseDetailsQuery } from "../features/api/itemApi";
import type { TOrdersDto } from "../types/TOrdersDto";
import { formatPrice } from "../util/util";

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // ISOLATED API COMPONENT FETCH
  const { data, isLoading, isError } = useGetPurchaseDetailsQuery(
    parseInt(id as string),
  );

  const orders = (data as TOrdersDto[]) || [];

  const totalCost = orders.reduce((accumulator, currentOrder) => {
    return accumulator + (currentOrder.orderTotal + currentOrder.shipping);
  }, 0);

  return (
    <>
      {/* LOCALIZED INDEPENDENT TOOLBAR */}
      <div className="panel-view__toolbar">
        <div className="panel-view__metrics-counter">
          {orders.length} {orders.length === 1 ? "purchase" : "purchases"}
        </div>
        <div className="panel-view__metrics-counter">
          <span>Total</span>
          <span>{` ${totalCost} zl`}</span>
        </div>
      </div>

      {isError && (
        <div className="panel-view__error-box">
          Unable to fetch purchase records.
        </div>
      )}

      <section className="panel-view__content-card">
        {isLoading ? (
          <div className="panel-view__loading-overlay">
            Loading purchases...
          </div>
        ) : orders.length === 0 ? (
          <div className="panel-view__empty-state">
            <div className="panel-view__empty-title">No purchases found</div>
          </div>
        ) : (
          <div className="panel-view__scroll-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Seller</th>
                  <th>Subtotal</th>
                  <th>Shipping</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Delivery Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
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
                      <span className="data-table__text">
                        {formatPrice(order.orderTotal)} {order.currency}
                      </span>
                    </td>
                    <td>
                      <span className="data-table__text">
                        {formatPrice(order.shipping)} {order.currency}
                      </span>
                    </td>
                    <td>
                      <span className="data-table__text font-bold text-primary">
                        {formatPrice(order.orderTotal + order.shipping)}{" "}
                        {order.currency}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge status-badge--${order.orderStatus?.toLowerCase().replace(/_/g, "-")}`}
                      >
                        {order.orderStatus?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge status-badge--${order.deliveryStatus?.toLowerCase().replace(/_/g, "-")}`}
                      >
                        {order.deliveryStatus?.replace(/_/g, " ")}
                      </span>
                    </td>
                
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
};

export default OrderDetails;
