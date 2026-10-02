import { useState } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";

import "../css/GenericViewLayout.css"; // Universal layout style mapping sheet
import { useGetCouriersQuery } from "../features/api/itemApi";
import type { TCourierResponse } from "../types/TCourierResponse";
import { formatEnumToString, formatPrice, isFetchBaseQueryError } from "../util/util";

const ShipmentPriceView = () => {
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const {data,isLoading:loading,error} = useGetCouriersQuery()

const couriers = data as TCourierResponse[] || [];




  /*
   * Delete category/brand row action handler
   */
  const handleDelete = async (courier: TCourierResponse) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${courier.shippingMethod}"?`,
    );

    if (!confirmed) {
      return;
    }

    /*
    try {
      setDeletingId(brand.id as number);
     const response: any = await deleteBrand(brand.id as number);

      if (response?.error) {
        const { data } = response.error as {
          data: { error: { name: string } };
          message: string;
          status: number;
        };
        setError(data?.error?.name || "Failed to delete brand.");
      }
    } catch (err) {
      console.error("Deletion exception encountered:", err);
      setError("Wystąpił nieoczekiwany błąd podczas usuwania.");
    } finally {
      setDeletingId(null);
    }
      */
  };

  /*
   * Search filtering collection logic
   */
  const filteredCourier = couriers.filter((courier) =>
    courier.shippingMethod?.toLowerCase().includes(search.toLowerCase())
  );

  return (
   <>
    <main className="panel-view">
      {/* =====================================================
                GENERIC HEADER BLOCK
            ====================================================== */}
      <header className="panel-view__header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span className="panel-view__eyebrow">Catalog</span>
          <h1 className="panel-view__title">Courier</h1>
          <p className="panel-view__description">Manage Courier rates</p>
        </div>

        <Link
          to="/account/admin/courier/new"
          className="data-table__action-link"
          style={{ display: "flex", gap: "0.5rem", padding: "0 1rem", width: "auto", minWidth: "130px", height: "40px", backgroundColor: "#66704A", color: "#ffffff", borderColor: "#66704A", borderRadius: "12px", textDecoration: "none", fontWeight: 600, fontSize: "14px" }}
        >
          <FiPlus />
        Add Courier
        </Link>
      </header>

      {/* =====================================================
                GENERIC TOOLBAR GRID
            ====================================================== */}
      <div className="panel-view__toolbar">
        <div className="panel-view__search-wrapper">
          <FiSearch />
          <input
            type="text"
            placeholder="Search courier..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="panel-view__metrics-counter">
          {filteredCourier.length}{" "}
          {filteredCourier.length === 1 ? "Courier" : "Couriers"}
        </div>
      </div>

      {/* =====================================================
                GENERIC ERROR MESSAGE ROW
            ====================================================== */}
      {error && <div className="panel-view__error-box">{isFetchBaseQueryError(error)}</div>}

      {/* =====================================================
                GENERIC COMPONENT CONTAINER CARD
            ====================================================== */}
      <section className="panel-view__content-card">
        {loading ? (
          <div className="panel-view__loading-overlay">Loading courier...</div>
        ) : filteredCourier.length === 0 ? (
          <div className="panel-view__empty-state">
            <div className="panel-view__empty-title">No Courier</div>
            <p>
              {search
                ? "Nie znaleziono Kuriera pasujących do wyszukiwania."
                : "Nie utworzono jeszcze żadnych Kuriera."}
            </p>
          </div>
        ) : (
          <div className="panel-view__scroll-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Shipping size</th>
                  <th>Shipping method</th>
                   <th>Price</th>
                    <th>Active</th>
                  <th className="data-table__actions-header">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCourier.map((courier) => (
                  <tr key={courier.id}>

                        {/*ID */}
                    <td>
                      <span className="data-table__text text-muted">
                        {courier.id}
                      </span>
                    </td>

                    {/* SIZE */}
                    <td>
                      <div className="data-table__user-profile">
                        <span className="data-table__avatar-badge">
                          {courier.itemSize?.charAt(0)?.toUpperCase()}
                        </span>
                        <span className="font-semibold text-main">{formatEnumToString(courier.itemSize)}</span>
                      </div>
                    </td>

                    {/* METHOD */}
                    <td>
                      <span className="data-table__text text-muted">
                        {formatEnumToString(courier.shippingMethod)|| "—"}
                      </span>
                    </td>

                    {/* PRICE*/}
                    <td>
                      <span className="data-table__text text-muted">
                        {formatPrice(parseInt(courier.price))}
                      </span>
                    </td>

                    <td>
                      <span className="data-table__text text-muted">
                        {courier.active?"TRUE":"FALSE"}
                      </span>
                    </td>
                    <td>
                      <div className="data-table__actions" style={{ gap: "0.5rem" }}>
                        <Link
                          to={`/account/admin/brand/${courier.id}/edit`}
                          className="data-table__action-link"
                          title="Edytuj"
                        >
                          <FiEdit2 />
                        </Link>

                        <button
                          type="button"
                          className="data-table__action-link"
                          style={{ color: "#e11d48" }}
                          title="Usuń"
                          disabled={deletingId ===courier.id}
                          onClick={() => handleDelete(courier)}
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
   </>
  );
};

export default ShipmentPriceView;
