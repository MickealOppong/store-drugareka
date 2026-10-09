import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FiCornerDownLeft,
  FiEdit,
  FiSearch,
  FiTruck,
} from "react-icons/fi";
import { useSearchParams } from "react-router-dom";

import { ShipmentStatusModal } from "../components";
import "../css/GenericViewLayout.css";
import { useGetShipmentsQuery } from "../features/api/userApi";
import { useAppSelector } from "../store";
import type { TShipment } from "../types/TShipment";

const Shipment = () => {
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParamsState] = useSearchParams();
  const { t } = useTranslation();

  /**
   * ACTUAL = outgoing shipments
   * RETURN = return shipments
   */

  // Extract existing parameters with safe fallback lookups from localStorage strings
const activeTab = searchParams.get("type") || localStorage.getItem("tab") || "ACTUAL";
const activePage = searchParams.get("page") || "1";

useEffect(() => {
  if (!searchParams.has("type") || !searchParams.has("page")) {
    setSearchParamsState({
      type: activeTab,
      page: activePage
    }, { replace: true }); 
  }
}, [searchParams, setSearchParamsState, activeTab, activePage]);

  /**
   * User roles
   */
  const roles = useAppSelector((state) => state.userSlice.roles);

  /**
   * Status modal
   */
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] =
    useState<TShipment | null>(null);

  /**
   * Pagination
   */
  const page = parseInt(searchParams.get("page") || "1", 10);

  /**
   * Change between outgoing shipments and returns.
   */
  const handleTabChange = (type: "ACTUAL" | "RETURN") => {

    setSearchParamsState({
      type,
      page: "1",
    });

    setSearch("");
        localStorage.setItem('tab',type)
  };

  /**
   * Fetch shipments.
   */
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetShipmentsQuery({
    page,
    size: 5,
    type: activeTab,
  },{refetchOnMountOrArgChange:true});

  

  /**
   * Shipment list.
   */
  const shipments = (data?.shipments as TShipment[]) || [];

  /**
   * Search by delivery address.
   */
  const filteredList = shipments.filter((item) =>
    item.deliveryAddress
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  /**
   * Open shipment status modal.
   */
  const openStatusModal = (shipment: TShipment) => {
    setSelectedShipment(shipment);
    setModalOpen(true);
  };

  /**
   * Close shipment status modal.
   */
  const closeStatusModal = () => {
    setModalOpen(false);
    setSelectedShipment(null);
  };

  return (
    <main className="panel-view">
      {/* =================================================
          HEADER
      ================================================== */}
      <header className="panel-view__header">
        <div>
          <span className="panel-view__eyebrow">
            {activeTab === "ACTUAL"
              ? t("shipments.header.eyebrow")
              : "Zwroty"}
          </span>

          <h1 className="panel-view__title">
            {activeTab === "ACTUAL"
              ? t("shipments.header.title")
              : "Logistyka Zwrotów Towaru"}
          </h1>

          <p className="panel-view__description">
            {activeTab === "ACTUAL"
              ? t("shipments.header.description")
              : "Zarządzaj przesyłkami zwrotnymi generowanymi przez kupujących w ramach procedur reklamacji."}
          </p>
        </div>
      </header>

      {/* =================================================
          TAB SWITCHER
      ================================================== */}
      <div
        className="panel-view__switcher-wrapper"
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "20px",
          borderBottom: "1px solid #e0e7e6",
          paddingBottom: "12px",
        }}
      >
        {/* OUTGOING */}
        <button
          type="button"
          className={`panel-view__switch-btn ${
            activeTab === "ACTUAL"
              ? "panel-view__switch-btn--active"
              : ""
          }`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "700",
            border: "1px solid #1e3a3a",
            cursor: "pointer",
            backgroundColor:
              activeTab === "ACTUAL" ? "#1e3a3a" : "#ffffff",
            color:
              activeTab === "ACTUAL" ? "#ffffff" : "#1e3a3a",
          }}
          onClick={() => handleTabChange("ACTUAL")}
        >
          <FiTruck />
          Przesyłki Wychodzące
        </button>

        {/* RETURNS */}
        <button
          type="button"
          className={`panel-view__switch-btn ${
            activeTab === "RETURN"
              ? "panel-view__switch-btn--active"
              : ""
          }`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "700",
            border: "1px solid #1e3a3a",
            cursor: "pointer",
            backgroundColor:
              activeTab === "RETURN" ? "#1e3a3a" : "#ffffff",
            color:
              activeTab === "RETURN" ? "#ffffff" : "#1e3a3a",
          }}
          onClick={() => handleTabChange("RETURN")}
        >
          <FiCornerDownLeft />
          Paczki Zwrotne (Disputes)
        </button>
      </div>

      {/* =================================================
          SEARCH TOOLBAR
      ================================================== */}
      <div className="panel-view__toolbar">
        <div className="panel-view__search-wrapper">
          <FiSearch />

          <input
            type="text"
            placeholder={
              activeTab === "ACTUAL"
                ? t("shipments.toolbar.search_placeholder")
                : "Szukaj według adresu zwrotnego..."
            }
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

      {/* =================================================
          ERROR
      ================================================== */}
      {isError && (
        <div className="panel-view__error-box">
          {t("shipments.table.error")}
        </div>
      )}

      {/* =================================================
          SHIPMENT TABLE
      ================================================== */}
      <section className="panel-view__content-card">
        {isLoading ? (
          <div className="panel-view__loading-overlay">
            {t("shipments.table.loading")}
          </div>
        ) : filteredList.length === 0 ? (
          <div className="panel-view__empty-state">
            <div className="panel-view__empty-title">
              {activeTab === "ACTUAL"
                ? t("shipments.empty.title")
                : "Brak przesyłek zwrotnych"}
            </div>

            <p>
              {search
                ? t("shipments.empty.search_desc")
                : activeTab === "ACTUAL"
                ? t("shipments.empty.default_desc")
                : "W systemie nie zarejestrowano obecnie żadnych aktywnych zwrotów logistycznych."}
            </p>
          </div>
        ) : (
          <div className="panel-view__scroll-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>
                    {t("shipments.table.headers.order")}
                  </th>

                  <th>
                    {activeTab === "ACTUAL"
                      ? t("shipments.table.headers.seller")
                      : "Kupujący (Zwracający)"}
                  </th>

                  <th>
                    {activeTab === "ACTUAL"
                      ? t("shipments.table.headers.address")
                      : "Adres Odbioru Zwrotu"}
                  </th>

                  <th>
                    {t(
                      "shipments.table.headers.tracking_number"
                    )}
                  </th>

                  <th>
                    {t(
                      "shipments.table.headers.size"
                    )}
                  </th>

                  <th>
                    {activeTab === "ACTUAL"
                      ? t("shipments.table.headers.shipped_at")
                      : "Nadano Zwrot"}
                  </th>

                  <th>
                    {activeTab === "ACTUAL"
                      ? t("shipments.table.headers.delivered_at")
                      : "Odebrano Zwrot"}
                  </th>

                  <th>
                    {t("shipments.table.headers.status")}
                  </th>

                  <th className="data-table__actions-header">
                    {t("shipments.table.headers.action")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredList.map((item) => {
                  const normalizedStatusClass =
                    item.status
                      ?.toLowerCase()
                      .replace(/_/g, "-");

                  return (
                    <tr key={item.id}>
                      {/* ORDER */}
                      <td>
                        <span className="data-table__text font-semibold text-main">
                          #{item.orderNumber}
                        </span>
                      </td>

                      {/* SELLER / BUYER */}
                      <td>
                        <span className="data-table__text text-muted">
                          {item.seller}
                        </span>
                      </td>

                      {/* ADDRESS */}
                      <td>
                        <span
                          className="data-table__text"
                          style={{
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            minWidth: "180px",
                            display: "inline-block",
                          }}
                        >
                          {item.deliveryAddress}
                        </span>
                      </td>

                      {/* TRACKING NUMBER */}
                      <td>
                        <span
                          className="data-table__text"
                          style={{
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            minWidth: "180px",
                            display: "inline-block",
                          }}
                        >
                          {item.trackingNumber || "-"}
                        </span>
                      </td>

                        {/* ITEM SIZE*/}
                      <td>
                       {
                        item.itemSize && <span
                          className="data-table__text"
                          style={{
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            minWidth: "180px",
                            display: "inline-block",
                          }}
                        >
                           {t(`add_listing.fields.cargo_sizes.${item.itemSize.toLowerCase()}`)}
                        </span>
                       }
                      </td>

                      {/* SHIPPED AT */}
                      <td>
                        <span className="data-table__text text-muted">
                          {item.shippedAt
                            ? new Date(
                                item.shippedAt
                              ).toLocaleDateString("pl-PL")
                            : "-"}
                        </span>
                      </td>

                      {/* DELIVERED AT */}
                      <td>
                        <span className="data-table__text text-muted">
                          {item.deliveredAt
                            ? new Date(
                                item.deliveredAt
                              ).toLocaleDateString("pl-PL")
                            : "-"}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td>
                        <span
                          className={`status-badge status-badge--${normalizedStatusClass}`}
                        >
                          {t(
                            `buyer_view.table.statuses.${item.status?.toLowerCase()}`,
                            {
                              defaultValue:
                                item.status?.replace(
                                  /_/g,
                                  " "
                                ),
                            }
                          )}
                        </span>
                      </td>

                      {/* ACTION */}
                      {(roles.includes("ROLE_ADMIN") ||
                        item.status !== "DELIVERED") && (
                        <td>
                          <button
                            type="button"
                            className="data-table__action-link"
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                            title={t(
                              "shipments.actions.edit_hint"
                            )}
                            onClick={() =>
                              openStatusModal(item)
                            }
                          >
                            <FiEdit />
                          </button>
                        </td>
                      )}

                      {/* Empty action cell when no action is available */}
                      {roles.includes("ROLE_ADMIN") === false &&
                        item.status === "DELIVERED" && (
                          <td />
                        )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* =================================================
          SHIPMENT STATUS MODAL
      ================================================== */}
      {modalOpen && selectedShipment && (
        <ShipmentStatusModal
          shipment={selectedShipment}
          onClose={closeStatusModal}
          onSaveSuccess={() => {
            closeStatusModal();
            refetch();
          } } type={activeTab}        />
      )}
    </main>
  );
};

export default Shipment;