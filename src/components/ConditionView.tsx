import { useState } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { Link, useRevalidator } from "react-router-dom";

import '../css/GenericViewLayout.css'; // Reuses your unified generic layout styles seamlessly
import { useDeleteConditionMutation, useGetAllConditionsQuery } from "../features/api/transApi";
import type { TConditionDto } from "../types/TConditionDto";
import type { TResponseDto } from "../types/TResponseDto";

const ConditionView = () => {
  const [search, setSearch] = useState("");
  const [loading, ] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { revalidate } = useRevalidator();

  // CRUD RTK lazy query and mutation triggers
  const {data:conditions=[]}= useGetAllConditionsQuery();
  const [deleteCondition] = useDeleteConditionMutation();



  /*
   * Delete specific condition item row action handler
   */
  const handleDelete = async (category: TConditionDto) => {
    const confirmed = window.confirm(
      `Delete "${category.name}" might delete all sub-categories, are you sure?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(category.id as number);
      const response: any = await deleteCondition(category.id as number);
      
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
        setError(data?.error?.name || "Failed to drop condition entry.");
      }
    } catch (err) {
      console.error("Exception occurred inside delete validation lifecycle:", err);
      setError("Wystąpił błąd podczas usuwania elementu.");
    } finally {
      setDeletingId(null);
    }
  };

  /*
   * Filter computation pipeline mapping logic
   */
  const filteredConditions = conditions.filter((condition) =>
    condition.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="panel-view">
      {/* =====================================================
                GENERIC HEADER BLOCK
            ====================================================== */}
      <header className="panel-view__header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span className="panel-view__eyebrow">Product Condition</span>
          <h1 className="panel-view__title">Conditions</h1>
          <p className="panel-view__description">Manage product conditions</p>
        </div>

        <Link
          to="/account/admin/condition/new"
          className="data-table__action-link"
          style={{ display: "flex", gap: "0.5rem", padding: "0 1rem", width: "auto", minWidth: "150px", height: "40px", backgroundColor: "#66704A", color: "#ffffff", borderColor: "#66704A", borderRadius: "12px", textDecoration: "none", fontWeight: 600, fontSize: "14px" }}
        >
          <FiPlus />
          Add condition
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
            placeholder="Search product conditions..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="panel-view__metrics-counter">
          {filteredConditions.length}{" "}
          {filteredConditions.length === 1 ? "Stan" : "Stanie"}
        </div>
      </div>

      {/* =====================================================
                GENERIC ERROR BOX ROW
            ====================================================== */}
      {error && <div className="panel-view__error-box">{error}</div>}

      {/* =====================================================
                GENERIC COMPONENT CONTAINER CARD
            ====================================================== */}
      <section className="panel-view__content-card">
        {loading && conditions.length === 0 ? (
          <div className="panel-view__loading-overlay">Loading product conditioms...</div>
        ) : filteredConditions.length === 0 ? (
          <div className="panel-view__empty-state">
            <div className="panel-view__empty-title">No product condition</div>
            <p>
              {search
                ? "Nie znaleziono pozycji pasujących do wpisanego hasła."
                : "Nie zarejestrowano jeszcze żadnych klasyfikacji stanów w bazie danych."}
            </p>
          </div>
        ) : (
          <div className="panel-view__scroll-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>name</th>
                  <th>description</th>
                  <th>ID</th>
                  <th>sort order</th>
                  <th>Status</th>
                  <th className="data-table__actions-header">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredConditions.map((condition) => (
                  <tr key={condition.id}>
                    {/* ICON INITIAL + TEXT NAME */}
                    <td>
                      <div className="data-table__user-profile">
                        <span className="data-table__avatar-badge">
                          {condition.name?.charAt(0)?.toUpperCase()}
                        </span>
                        <span className="font-semibold text-main">{condition.name}</span>
                      </div>
                    </td>

                    {/* EXTENDED DESCRIPTION CELL */}
                    <td>
                      <span className="data-table__text text-muted" style={{ whiteSpace: "normal", minWidth: "150px", display: "inline-block" }}>
                        {condition.description || "—"}
                      </span>
                    </td>

                    {/* ID ELEMENT */}
                    <td>
                      <span className="data-table__text text-muted">
                        #{condition.id}
                      </span>
                    </td>

                    {/* SORT DISPLAY ORDER */}
                    <td>
                      <span className="data-table__text text-muted">
                        {condition.sortOrder ?? 0}
                      </span>
                    </td>

                    {/* UNIFIED STATUS COMPLIANT STATE BADGES */}
                    <td>
                      <span className={`status-badge ${condition.active ? 'status-badge--completed' : 'status-badge--disputed'}`}>
                        {condition.active ? "Aktywna" : "Nieaktywna"}
                      </span>
                    </td>

                    {/* ACTIONS ROW HUB PANEL */}
                    <td>
                      <div className="data-table__actions" style={{ gap: "0.5rem" }}>
                        <Link
                          to={`/account/admin/condition/${condition.id}/edit`}
                          className="data-table__action-link"
                          title="Edytuj stan"
                        >
                          <FiEdit2 />
                        </Link>

                        <button
                          type="button"
                          className="data-table__action-link"
                          style={{ color: "#e11d48" }}
                          title="Usuń stan"
                          disabled={deletingId === condition.id}
                          onClick={() => handleDelete(condition)}
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

export default ConditionView;
