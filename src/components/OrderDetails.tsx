import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { useGetPurchaseDetailsQuery } from "../features/api/itemApi";
import type { TOrdersDto } from "../types/TOrdersDto";
import { formatPrice } from "../util/util";

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

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
          {orders.length}{" "}
          {orders.length === 1
            ? t("order_details.toolbar.count_singular")
            : t("order_details.toolbar.count_plural")}
        </div>
        <div className="panel-view__metrics-counter">
          <span>{t("order_details.toolbar.total_label")}{": "}</span>
          <span>{` ${formatPrice(totalCost)} zł`}</span>
        </div>
      </div>

      {isError && (
        <div className="panel-view__error-box">
          {t("order_details.table.error")}
        </div>
      )}

      <section className="panel-view__content-card">
        {isLoading ? (
          <div className="panel-view__loading-overlay">
            {t("order_details.table.loading")}
          </div>
        ) : orders.length === 0 ? (
          <div className="panel-view__empty-state">
            <div className="panel-view__empty-title">
              {t("order_details.empty.title")}
            </div>
          </div>
        ) : (
          <div className="panel-view__scroll-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("order_details.table.headers.order")}</th>
                  <th>{t("order_details.table.headers.seller")}</th>
                  <th>{t("order_details.table.headers.subtotal")}</th>
                  <th>{t("order_details.table.headers.shipping")}</th>
                  <th>{t("order_details.table.headers.total")}</th>
                  <th>{t("order_details.table.headers.order_status")}</th>
                  <th>{t("order_details.table.headers.tracking_number")}</th>
                  <th>{t("order_details.table.headers.delivery_status")}</th>
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
                        {t(`buyer_view.table.statuses.${order.orderStatus?.toLowerCase()}`, { defaultValue: order.orderStatus?.replace(/_/g, " ") })}
                      </span>
                    </td>
                    <td>
                      <span className="data-table__text font-bold text-primary">
                        {order.trackingNumber || "-"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge status-badge--${order.deliveryStatus?.toLowerCase().replace(/_/g, "-")}`}
                      >
                        {t(`buyer_view.table.statuses.${order.deliveryStatus?.toLowerCase()}`, { defaultValue: order.deliveryStatus?.replace(/_/g, " ") })}
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
