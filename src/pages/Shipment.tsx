import { useState } from "react";
import { FiEye, FiSearch } from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";

import { Pagination } from "../components";
import { useGetShipmentsQuery } from "../features/api/userApi";
import type { TShipment } from "../types/TShipment";
import "./../css/GenericViewLayout.css"; // Reuses your unified generic layout styles seamlessly

const Shipment = () => {
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const size = 10;

  /*
   * =====================================================
   * API SHIPMENT QUERY DATA LIFECYCLE
   * =====================================================
   */
  const { data, isLoading, isError } = useGetShipmentsQuery({
    page,
    size,
  });

  const shipments = (data?.shipments as TShipment[]) || [];

  /*
   * =====================================================
   * SEARCH BY DELIVERY ADDRESS
   * =====================================================
   */
  const filteredList = shipments.filter((item) =>
    item.deliveryAddress?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="panel-view">
      {/* =================================================
                GENERIC HEADER BLOCK
            ================================================== */}
      <header className="panel-view__header">
        <div>
          <span className="panel-view__eyebrow">Shipments</span>
          <h1 className="panel-view__title">Order Shipments</h1>
          <p className="panel-view__description">Zarządzaj Dostawami i Logistyką.</p>
        </div>
      </header>

      {/* =================================================
                GENERIC TOOLBAR GRID
            ================================================== */}
      <div className="panel-view__toolbar">
        <div className="panel-view__search-wrapper">
          <FiSearch />
          <input
            type="text"
            placeholder="Szukaj adresu dostawy..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="panel-view__metrics-counter">
          {filteredList.length} {filteredList.length === 1 ? "Wpis" : "Wpisy"}
        </div>
      </div>

      {/* =================================================
                GENERIC ERROR ROW MAPPER
            ================================================== */}
      {isError && (
        <div className="panel-view__error-box">Unable to load shipments data payload.</div>
      )}

      {/* =================================================
                GENERIC CARD WORKSPACE TABLE
            ================================================== */}
      <section className="panel-view__content-card">
        {isLoading ? (
          <div className="panel-view__loading-overlay">Ładowanie Użytkowników...</div>
        ) : filteredList.length === 0 ? (
          <div className="panel-view__empty-state">
            <div className="panel-view__empty-title">Brak Wyników</div>
            <p>
              {search
                ? "Nie znaleziono przesyłek pasujących do kryteriów wyszukiwania."
                : "Brak aktywnych rekordów przesyłek w systemie."}
            </p>
          </div>
        ) : (
          <div className="panel-view__scroll-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Seller</th>
                  <th>Delivery Address</th>
                  <th>Shipped At</th>
                  <th>Delivered At</th>
                  <th>Status</th>
                  <th className="data-table__actions-header">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredList.map((item) => {
                  const normalizedStatusClass = item.status?.toLowerCase().replace(/_/g, "-");
                  const humanReadableStatus = item.status?.replace(/_/g, " ");

                  return (
                    <tr key={item.id}>
                      {/* ORDER REFS */}
                      <td>
                        <span className="data-table__text font-semibold text-main">
                          #{item.id}
                        </span>
                      </td>

                      {/* SELLER DATA */}
                      <td>
                        <span className="data-table__text text-muted">
                          {item.seller}
                        </span>
                      </td>

                      {/* DIRECT MVP CUSTOMER DELIVERY ADDRESS DESCRIPTOR */}
                      <td>
                        <span className="data-table__text" style={{ whiteSpace: "normal", wordBreak: "break-word", minWidth: "180px", display: "inline-block" }}>
                          {item.deliveryAddress}
                        </span>
                      </td>

                      {/* NULLABLE TIMESTAMPS HANDLERS */}
                      <td>
                        <span className="data-table__text text-muted">
                          {item.shippedAt ? new Date(item.shippedAt).toLocaleDateString("pl-PL") : '-'}
                        </span>
                      </td>

                      <td>
                        <span className="data-table__text text-muted">
                          {item.deliveredAt ? new Date(item.deliveredAt).toLocaleDateString("pl-PL") : '-'}
                        </span>
                      </td>

                      {/* DYNAMIC REGEX BADGE EXTRACTOR */}
                      <td>
                        <span className={`status-badge status-badge--${normalizedStatusClass}`}>
                          {humanReadableStatus}
                        </span>
                      </td>

                      {/* ACTION LINK HUB */}
                      <td>
                        <div className="data-table__actions">
                          <Link
                            to={`/account/orders/${item.listingOrderId}`}
                            className="data-table__action-link"
                            title="View order tracking specifics"
                          >
                            <FiEye />
                          </Link>
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

      {/* =================================================
                PAGINATION ACTION ELEMENTS
            ================================================== */}
      {data && (
        <Pagination
          page={data.page}
          totalPage={data.totalPages}
          size={data.pageSize}
        />
      )}
    </main>
  );
};

export default Shipment;
