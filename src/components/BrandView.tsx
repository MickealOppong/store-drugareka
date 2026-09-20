import { useState } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";

import "../css/GenericViewLayout.css"; // Universal layout style mapping sheet
import {
  useDeleteBrandMutation,
  useGetAllBrandsQuery
} from "../features/api/transApi";
import type { TbrandResponse } from "../types/TBrandResponse";
import Pagination from "./Pagination";

const BrandView = () => {
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);


    const [searchParams,] = useSearchParams();
    
    // Read active pagination location straight from URL parameters (1-indexed base)
    const page = parseInt(searchParams.get("page" )as string)||1;

  // CRUD RTK mutation/query hooks
  const [deleteBrand] = useDeleteBrandMutation();
  const {data,isLoading:loading} = useGetAllBrandsQuery({page,size:7})

const brands = data?.brands as TbrandResponse[]||[]

  /*
   * Delete category/brand row action handler
   */
  const handleDelete = async (brand: TbrandResponse) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${brand.name}"?`,
    );

    if (!confirmed) {
      return;
    }

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
  };

  /*
   * Search filtering collection logic
   */
  const filteredBrands = brands.filter((brand) =>
    brand.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="panel-view">
      {/* =====================================================
                GENERIC HEADER BLOCK
            ====================================================== */}
      <header className="panel-view__header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span className="panel-view__eyebrow">Product Brands</span>
          <h1 className="panel-view__title">Marki</h1>
          <p className="panel-view__description">Zarządzaj markami produktów w systemie.</p>
        </div>

        <Link
          to="/account/admin/brand/new"
          className="data-table__action-link"
          style={{ display: "flex", gap: "0.5rem", padding: "0 1rem", width: "auto", minWidth: "130px", height: "40px", backgroundColor: "#66704A", color: "#ffffff", borderColor: "#66704A", borderRadius: "12px", textDecoration: "none", fontWeight: 600, fontSize: "14px" }}
        >
          <FiPlus />
          Dodaj markę
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
            placeholder="Szukaj marki..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="panel-view__metrics-counter">
          {filteredBrands.length}{" "}
          {filteredBrands.length === 1 ? "Brand" : "Brands"}
        </div>
      </div>

      {/* =====================================================
                GENERIC ERROR MESSAGE ROW
            ====================================================== */}
      {error && <div className="panel-view__error-box">{error}</div>}

      {/* =====================================================
                GENERIC COMPONENT CONTAINER CARD
            ====================================================== */}
      <section className="panel-view__content-card">
        {loading ? (
          <div className="panel-view__loading-overlay">Ładowanie marek...</div>
        ) : filteredBrands.length === 0 ? (
          <div className="panel-view__empty-state">
            <div className="panel-view__empty-title">Brak marek</div>
            <p>
              {search
                ? "Nie znaleziono marek pasujących do wyszukiwania."
                : "Nie utworzono jeszcze żadnych marek produktowych."}
            </p>
          </div>
        ) : (
          <div className="panel-view__scroll-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nazwa</th>
                  <th>Slug</th>
                  <th>Sort Order</th>
                  <th className="data-table__actions-header">Akcje</th>
                </tr>
              </thead>

              <tbody>
                {filteredBrands.map((brand) => (
                  <tr key={brand.id}>
                    {/* AVATAR ICON + NAME */}
                    <td>
                      <div className="data-table__user-profile">
                        <span className="data-table__avatar-badge">
                          {brand.name?.charAt(0)?.toUpperCase()}
                        </span>
                        <span className="font-semibold text-main">{brand.name}</span>
                      </div>
                    </td>

                    {/* SLUG KEY STRINGS */}
                    <td>
                      <span className="data-table__text text-muted">
                        {brand.slug || "—"}
                      </span>
                    </td>

                    {/* SORT ORDER POSITION INDEX */}
                    <td>
                      <span className="data-table__text text-muted">
                        {brand.sortOrder ?? 0}
                      </span>
                    </td>

                    {/* DUAL ACTION SELECTION HOUSING ROW */}
                    <td>
                      <div className="data-table__actions" style={{ gap: "0.5rem" }}>
                        <Link
                          to={`/account/admin/brand/${brand.id}/edit`}
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
                          disabled={deletingId === brand.id}
                          onClick={() => handleDelete(brand)}
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
           {data && (
                    <Pagination
                      page={page}
                      totalPage={data.totalPages}
                      size={data.pageSize}
                    />
                  )}
    </main>
  );
};

export default BrandView;
