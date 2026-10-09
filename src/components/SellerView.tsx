import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiFlag, FiSearch, FiX } from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";

import { useGetSaleOrdersQuery } from "../features/api/itemApi";
import type { TOrdersDto } from "../types/TOrdersDto";
import { formatPrice } from "../util/util";
import OrderCancelModal from "./OrderCancelModal";
import Pagination from "./Pagination";

const SellerView =() => {
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<TOrdersDto>();

  const page = parseInt(searchParams.get("page") || "1");
  // ISOLATED API COMPONENT FETCH
  const { data, isLoading, isError } = useGetSaleOrdersQuery({
    page,
    size: 5,
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

  const openModal = (order: TOrdersDto) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };


  

  return (
    <>
      {/* LOCALIZED INDEPENDENT TOOLBAR */}
      <div className="panel-view__toolbar">
        <div className="panel-view__search-wrapper">
          <FiSearch />
          <input
            type="text"
            placeholder={t("seller_view.toolbar.search_placeholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="panel-view__metrics-counter">
          {filteredList.length}{" "}
          {filteredList.length === 1
            ? t("seller_view.toolbar.count_singular")
            : t("seller_view.toolbar.count_plural")}
        </div>
      </div>

      {isError && (
        <div className="panel-view__error-box">
          {t("seller_view.table.error")}
        </div>
      )}

      <section className="panel-view__content-card">
        {isLoading ? (
          <div className="panel-view__loading-overlay">
            {t("seller_view.table.loading")}
          </div>
        ) : filteredList.length === 0 ? (
          <div className="panel-view__empty-state">
            <div className="panel-view__empty-title">
              {t("seller_view.empty.title")}
            </div>
            <p>
              {search
                ? t("seller_view.empty.search_desc")
                : t("seller_view.empty.default_desc")}
            </p>
          </div>
        ) : (
          <div className="panel-view__scroll-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("seller_view.table.headers.order")}</th>
                  <th>{t("seller_view.table.headers.buyer")}</th>
                  <th>{t("seller_view.table.headers.subtotal")}</th>
                  <th>{t("seller_view.table.headers.shipping")}</th>
                  <th>{t("seller_view.table.headers.total")}</th>
                  <th>{t("seller_view.table.headers.status")}</th>
                  <th>{t("seller_view.table.headers.created")}</th>
                  <th className="data-table__actions-header">
                    {t("seller_view.table.headers.action")}
                  </th>
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
                        <span
                          className="data-table__avatar-badge"
                          style={{
                            backgroundColor: "#e2e8f0",
                            color: "#475569",
                          }}
                        >
                          {order.buyer?.charAt(0)?.toUpperCase()}
                        </span>
                        <span>{order.buyer}</span>
                      </div>
                    </td>
                    <td>
                      <span className="data-table__text">
                        {formatPrice(order.price)} {order.currency}
                      </span>
                    </td>
                    <td>
                      <span className="data-table__text">
                        {formatPrice(order.shipping)} {order.currency}
                      </span>
                    </td>
                    <td>
                      <span className="data-table__text font-bold text-primary">
                        {formatPrice(order.price + order.shipping)}{" "}
                        {order.currency}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge status-badge--${order.orderStatus?.toLowerCase().replace(/_/g, "-")}`}
                      >
                        {t(
                          `buyer_view.table.statuses.${order.orderItemStatus.toLowerCase()}`,
                          "",
                        )}
                      </span>
                    </td>
                    <td>
                      <span className="data-table__text text-muted">
                        {new Date(order.createdAt).toLocaleDateString("pl-PL")}
                      </span>
                    </td>
                    <td>
            
                      <div className="data-table__actions">
                        <Link
                          to={`/account/complaints/new/${order.id}`}
                      
                          className="data-table__action-link data-table__actions__action-link--dispute"
                          title={t("seller_view.actions.file_dispute")}
                        >
                          <FiFlag />
                        </Link>

                        <button
                          type="button"
        
                          className="data-table__actions__btn data-table__actions__btn--cancel"
                          onClick={() => openModal(order)}
                        >
                          <FiX />
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
      {modalOpen && (
        <OrderCancelModal
          isOpen={modalOpen}
          onButtonClick={closeModal}
          orderData={selectedOrder as TOrdersDto}
        />
      )}

      {/* LOCALIZED PACING HOOKS */}
      {data && (
        <Pagination
          page={page}
          totalPage={data.totalPages}
          size={data.pageSize}
          totalElements={data?.totalElements}
        />
      )}
    </>
  );
};

export default SellerView;
