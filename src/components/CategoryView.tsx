import { useState } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { Link, useRevalidator } from "react-router-dom";

import { useGetAllCategoriesQuery } from "../features/api/storeApi";
import { useDeleteCategoryMutation } from "../features/api/transApi";
import type { TCategoryReponse } from "../types/TCategoryResponse";
import type { TResponseDto } from "../types/TResponseDto";
import './../css/GenericViewLayout.css'; // Reuses your unified generic layout styles seamlessly

const CategoryView = () => {
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { revalidate } = useRevalidator();
  const { data: categories = [], isLoading } = useGetAllCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();

  /*
   * Delete category item row action handler
   */
  const handleDelete = async (category: TCategoryReponse) => {
    const confirmed = window.confirm(
      `Delete "${category.name}" might delete all sub-categories, are you sure?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(category.id as number);
      const response: any = await deleteCategory(category.id as number);

      if (response?.data) {
        const { httpStatus } = response.data as TResponseDto;
        if (httpStatus === 200) {
          revalidate();
        }
      }

      if (response?.error) {
        const { data } = response.error as {
          data: { error: { name: string } };
          message: string;
          status: number;
        };
        setError(data?.error?.name || "Failed to delete category.");
      }
    } catch (err) {
      console.error("Deletion lifecycle exception occurred:", err);
      setError("An unexpected error occurred during deletion.");
    } finally {
      setDeletingId(null);
    }
  };

  /*
   * Search filtering pipeline operation
   */
  const filteredCategories = categories.filter((category) =>
    category.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="panel-view">
      {/* =====================================================
                GENERIC HEADER BLOCK
            ====================================================== */}
      <header className="panel-view__header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span className="panel-view__eyebrow">Product Categories</span>
          <h1 className="panel-view__title">Kategorie</h1>
          <p className="panel-view__description">Zarządzaj kategoriami produktów w panelu administracyjnym.</p>
        </div>

        <Link
          to="/account/admin/categories/new"
          className="data-table__action-link"
          style={{ display: "flex", gap: "0.5rem", padding: "0 1rem", width: "auto", minWidth: "140px", height: "40px", backgroundColor: "#66704A", color: "#ffffff", borderColor: "#66704A", borderRadius: "12px", textDecoration: "none", fontWeight: 600, fontSize: "14px" }}
        >
          <FiPlus />
          Dodaj kategorię
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
            placeholder="Szukaj kategorii..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="panel-view__metrics-counter">
          {filteredCategories.length}{" "}
          {filteredCategories.length === 1 ? "kategoria" : "kategorii"}
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
        {isLoading ? (
          <div className="panel-view__loading-overlay">Ładowanie kategorii...</div>
        ) : filteredCategories.length === 0 ? (
          <div className="panel-view__empty-state">
            <div className="panel-view__empty-title">Brak kategorii</div>
            <p>
              {search
                ? "Nie znaleziono kategorii pasujących do kryteriów wyszukiwania."
                : "Nie utworzono jeszcze żadnych kategorii produktowych."}
            </p>
          </div>
        ) : (
          <div className="panel-view__scroll-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nazwa</th>
                  <th>Kolejność</th>
                  <th>Status</th>
                  <th>Parent</th>
                  <th>Slug</th>
                  <th className="data-table__actions-header">Akcje</th>
                </tr>
              </thead>

              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.id}>
                    {/* AVATAR ICON + NAME */}
                    <td>
                      <div className="data-table__user-profile">
                        <span className="data-table__avatar-badge">
                          {category.name?.charAt(0)?.toUpperCase()}
                        </span>
                        <span className="font-semibold text-main">{category.name}</span>
                      </div>
                    </td>

                    {/* SORT ORDER INDEX */}
                    <td>
                      <span className="data-table__text text-muted">
                        {category.sortOrder ?? 0}
                      </span>
                    </td>

                    {/* DYNAMIC BOOLEAN STATUS BADGES */}
                    <td>
                      <span className={`status-badge ${category.active ? 'status-badge--completed' : 'status-badge--disputed'}`}>
                        {category.active ? "Aktywna" : "Nieaktywna"}
                      </span>
                    </td>

                    {/* PARENT REFERENCE VALUE MAP */}
                    <td>
                      <span className="data-table__text text-muted">
                        {category.parent || "—"}
                      </span>
                    </td>

                    {/* SLUG EXTENSION TEXT */}
                    <td>
                      <span className="data-table__text text-muted">
                        {category.slug}
                      </span>
                    </td>

                    {/* MULTI-ACTION MANAGEMENT SELECTIONS BUTTON SECTOR */}
                    <td>
                      <div className="data-table__actions" style={{ gap: "0.5rem" }}>
                        <Link
                          to={`/account/admin/categories/${category.id}/edit`}
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
                          disabled={deletingId === category.id}
                          onClick={() => handleDelete(category)}
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
  );
};

export default CategoryView;
