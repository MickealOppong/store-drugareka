import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";

import "../css/GenericViewLayout.css"; // Reuses your unified generic layout styles seamlessly
import {
  useDeleteUserMutation,
  useLazyGetAllUsersQuery,
} from "../features/api/userApi";
import type { TResponseDto } from "../types/TResponseDto";
import type { TUserDto } from "../types/TUserDto";

const UserView = () => {
  const [users, setUsers] = useState<TUserDto[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // RTK API query lazy hooks
  const [getUsers] = useLazyGetAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  /*
   * Lifecycle trigger hook to load users payload database rows
   */
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(() => response.data as TUserDto[]);
    } catch (err) {
      console.error("Failed to fetch platform users dataset:", err);
      setError("Nie udało się załadować listy użytkowników.");
    }
  };

  /*
   * Delete User account target mapping action row handler
   */
  const handleDelete = async (user: TUserDto) => {
    const confirmed = window.confirm(
      `Czy na pewno chcesz usunąć użytkownika ID: "${user.userId}"?`,
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setDeletingId(user.userId);
    setError("");

    try {
      const response: any = await deleteUser(user.userId);
      if (response?.data) {
        const { httpStatus, message } = response.data as TResponseDto;
        
        if (httpStatus === 200) {
          fetchUsers(); // Instantly update view context layout grid mapping array rows
        } else if (httpStatus === 400 || httpStatus === 403) {
          setError(message);
        }
      }
      if (response?.error) {
        setError("Ups, nie udało się usunąć wybranego użytkownika.");
      }
    } catch (err) {
      console.error("Exception occurred during user deletion flow:", err);
      setError("Wystąpił nieoczekiwany błąd podczas modyfikacji bazy danych.");
    } finally {
      setLoading(false);
      setDeletingId(null);
    }
  };

  /*
   * Combined text query filter matching first name and last name targets
   */
  const filteredList = users.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="panel-view">
      {/* =====================================================
                GENERIC HEADER BLOCK
            ====================================================== */}
      <header className="panel-view__header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span className="panel-view__eyebrow">Users</span>
          <h1 className="panel-view__title">All Users</h1>
          <p className="panel-view__description">Manage users.</p>
        </div>

        <Link
          to="/account/admin/user/new"
          className="data-table__action-link"
          style={{ display: "flex", gap: "0.5rem", padding: "0 1rem", width: "auto", minWidth: "150px", height: "40px", backgroundColor: "#66704A", color: "#ffffff", borderColor: "#66704A", borderRadius: "12px", textDecoration: "none", fontWeight: 600, fontSize: "14px" }}
        >
          <FiPlus />
         Add user
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
            placeholder="Search users..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="panel-view__metrics-counter">
          {filteredList.length} {filteredList.length === 1 ? "User" : "Users"}
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
        {loading && users.length === 0 ? (
          <div className="panel-view__loading-overlay">Loading users...</div>
        ) : filteredList.length === 0 ? (
          <div className="panel-view__empty-state">
            <div className="panel-view__empty-title">No user</div>
            <p>
              {search
                ? "Nie znaleziono kont pasujących do kryteriów wyszukiwania."
                : "Nie zarejestrowano jeszcze żadnych użytkowników w systemie."}
            </p>
          </div>
        ) : (
          <div className="panel-view__scroll-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>first name</th>
                  <th>last name</th>
                  <th>ID</th>
                  <th>Email / Login</th>
                  <th>Role</th>
                  <th className="data-table__actions-header">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredList.map((user) => {
                  // Extracts string like ROLE_ADMIN -> admin to load context colors smoothly
                  const userRoleRaw = user.roles[0] || "ROLE_USER";
                  const normalizedRoleClass = userRoleRaw.toLowerCase().replace(/_/g, "-");
                  const humanReadableRole = userRoleRaw.replace("ROLE_", "");

                  return (
                    <tr key={user.userId}>
                      {/* FIRST NAME DISPLAY */}
                      <td>
                        <div className="data-table__user-profile">
                          <span className="data-table__avatar-badge">
                            {user.firstName?.charAt(0)?.toUpperCase()}
                          </span>
                          <span className="font-semibold text-main">{user.firstName}</span>
                        </div>
                      </td>

                      {/* LAST NAME DISPLAY */}
                      <td>
                        <div className="data-table__user-profile">
                          <span className="data-table__avatar-badge" style={{ backgroundColor: "#e2e8f0", color: "#475569" }}>
                            {user.lastName?.charAt(0)?.toUpperCase()}
                          </span>
                          <span className="font-semibold text-main">{user.lastName}</span>
                        </div>
                      </td>

                      {/* USER ID STRINGS */}
                      <td>
                        <span className="data-table__text text-muted">
                          #{user.userId ?? 0}
                        </span>
                      </td>

                      {/* MASTER USERNAME KEY */}
                      <td>
                        <span className="data-table__text">
                          {user.email ?? "—"}
                        </span>
                      </td>

                      {/* STRUCTURAL BADGE MATRIX ROLE DECORATOR */}
                      <td>
                        <span className={`status-badge status-badge--${normalizedRoleClass}`}>
                          {humanReadableRole}
                        </span>
                      </td>

                      {/* ACTIONS TOOL COLUMN */}
                      <td>
                        <div className="data-table__actions" style={{ gap: "0.5rem" }}>
                          <Link
                            to={`/account/admin/user/${user.userId}/edit`}
                            className="data-table__action-link"
                            title="Edytuj dane użytkownika"
                          >
                            <FiEdit2 />
                          </Link>

                          <button
                            type="button"
                            className="data-table__action-link"
                            style={{ color: "#e11d48" }}
                            title="Usuń użytkownika"
                            disabled={deletingId === user.userId}
                            onClick={() => handleDelete(user)}
                          >
                            <FiTrash2 />
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
    </main>
  );
};

export default UserView;
