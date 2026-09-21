import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiEdit, FiSearch } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";

import { Pagination, ShipmentStatusModal } from "../components";
import "../css/GenericViewLayout.css"; // Shared layout framework classes
import { useGetShipmentsQuery } from "../features/api/userApi";
import type { TShipment } from "../types/TShipment";

const Shipment = () => {
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  // 1. DIALOG STATE ANCHORS
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<TShipment | null>(null);

  const page = parseInt(searchParams.get("page") || "1");

  // 2. DISPATCH MAIN DATA PIPELINE DATA STREAM
  const { data, isLoading, isError, refetch } = useGetShipmentsQuery({ page, size:5 });
  const shipments = (data?.shipments as TShipment[]) || [];
  
  

  // 3. LOGISTICAL SEARCH FILTER ENGINE
  const filteredList = shipments.filter((item) =>
    item.deliveryAddress?.toLowerCase().includes(search.toLowerCase())
  );

  const openStatusModal = (shipment: TShipment) => {
    setSelectedShipment(shipment);
    setModalOpen(true);
  };

  const closeStatusModal = () => {
    setModalOpen(false);
    setSelectedShipment(null);
  };

  return (
    <main className="panel-view">
      {/* =================================================
                UNIVERSAL HEADER BLOCK
            ================================================== */}
      <header className="panel-view__header">
        <div>
          <span className="panel-view__eyebrow">{t("shipments.header.eyebrow")}</span>
          <h1 className="panel-view__title">{t("shipments.header.title")}</h1>
          <p className="panel-view__description">{t("shipments.header.description")}</p>
        </div>
      </header>

      {/* =================================================
                UNIVERSAL SEARCH TOOLBAR GRID
            ================================================== */}
      <div className="panel-view__toolbar">
        <div className="panel-view__search-wrapper">
          <FiSearch />
          <input
            type="text"
            placeholder={t("shipments.toolbar.search_placeholder")}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="panel-view__metrics-counter">
          {filteredList.length}{" "}
          {filteredList.length === 1 
            ? t("shipments.toolbar.count_singular") 
            : t("shipments.toolbar.count_plural")}
        </div>
      </div>

      {isError && (
        <div className="panel-view__error-box">{t("shipments.table.error")}</div>
      )}

      {/* =================================================
                UNIVERSAL WORKSPACE GRID TABLE CARD
            ================================================== */}
      <section className="panel-view__content-card">
        {isLoading ? (
          <div className="panel-view__loading-overlay">{t("shipments.table.loading")}</div>
        ) : filteredList.length === 0 ? (
          <div className="panel-view__empty-state">
            <div className="panel-view__empty-title">{t("shipments.empty.title")}</div>
            <p>
              {search
                ? t("shipments.empty.search_desc")
                : t("shipments.empty.default_desc")}
            </p>
          </div>
        ) : (
          <div className="panel-view__scroll-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("shipments.table.headers.order")}</th>
                  <th>{t("shipments.table.headers.seller")}</th>
                  <th>{t("shipments.table.headers.address")}</th>
                   <th>{t("shipments.table.headers.tracking_number")}</th>
                  <th>{t("shipments.table.headers.shipped_at")}</th>
                  <th>{t("shipments.table.headers.delivered_at")}</th>
                  <th>{t("shipments.table.headers.status")}</th>
                  <th className="data-table__actions-header">{t("shipments.table.headers.action")}</th>
                </tr>
              </thead>

              <tbody>
                {filteredList.map((item) => {
                  const normalizedStatusClass = item.status?.toLowerCase().replace(/_/g, "-");

                  return (
                    <tr key={item.id}>
                      <td>
                        <span className="data-table__text font-semibold text-main">
                          #{item.orderNumber}
                        </span>
                      </td>

                      <td>
                        <span className="data-table__text text-muted">{item.seller}</span>
                      </td>

                      <td>
                        <span
                          className="data-table__text"
                          style={{ whiteSpace: "normal", wordBreak: "break-word", minWidth: "180px", display: "inline-block" }}
                        >
                          {item.deliveryAddress}
                        </span>
                      </td>
    <td>
                        <span
                          className="data-table__text"
                          style={{ whiteSpace: "normal", wordBreak: "break-word", minWidth: "180px", display: "inline-block" }}
                        >
                          {item.trackingNumber}
                        </span>
                      </td>
                      <td>
                        <span className="data-table__text text-muted">
                          {item.shippedAt ? new Date(item.shippedAt).toLocaleDateString("pl-PL") : "-"}
                        </span>
                      </td>

                      <td>
                        <span className="data-table__text text-muted">
                          {item.deliveredAt ? new Date(item.deliveredAt).toLocaleDateString("pl-PL") : "-"}
                        </span>
                      </td>

                      <td>
                        <span className={`status-badge status-badge--${normalizedStatusClass}`}>
                          {t(`buyer_view.table.statuses.${item.status?.toLowerCase()}`, { defaultValue: item.status?.replace(/_/g, " ") })}
                        </span>
                      </td>

                      <td>
                        <div className="data-table__actions">
                          <button
                            type="button"
                            className="data-table__action-link"
                            style={{ background: "none", border: "none", cursor: "pointer" }}
                            title={t("shipments.actions.edit_hint")}
                            onClick={() => openStatusModal(item)}
                          >
                            <FiEdit />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {data && (
        <Pagination
          page={page}
          totalPage={data.totalPages}
          size={data.pageSize}
          totalElements={data?.totalElements}
        />
      )}

      {/* =================================================
                ISOLATED DECOUPLED INLINE DIALOG SUB-PANEL
            ================================================== */}
      {modalOpen && selectedShipment && (
        <ShipmentStatusModal
          shipment={selectedShipment}
          onClose={closeStatusModal}
          onSaveSuccess={() => {
            closeStatusModal();
            refetch(); // Instantly refresh data grids without needing an overhead site layout reboot
          }}
        />
      )}
    </main>
  );
};

export default Shipment;
