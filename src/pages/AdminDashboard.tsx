import {
  FiArrowRight,
  FiGrid,
  FiPackage,
  FiTag,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { Link, redirect } from "react-router-dom";

import type { Store } from "redux";
import type { RootState } from "../store";
import "./../css/AdminDashboard.css"; // Clean target compilation path

export const loader = (store: Store<RootState>) => async () => {
  const roles = store.getState().userSlice.roles || [];
  if (!roles.includes("ROLE_ADMIN")) {
    return redirect("/account/user");
  }
  return null;
};

const AdminDashboard = () => {
  const stats = [
    {
      label: "Użytkownicy",
      value: "1,248",
      change: "+12%",
      icon: FiUsers,
      path: "/account/admin/users",
    },
    {
      label: "Produkty",
      value: "486",
      change: "+8%",
      icon: FiPackage,
      path: "/account/admin/listings",
    },
    {
      label: "Kategorie",
      value: "15",
      change: "",
      icon: FiGrid,
      path: "/account/admin/categories",
    },
    {
      label: "Marki",
      value: "324",
      change: "+24",
      icon: FiTag,
      path: "/account/admin/brands",
    },
  ];

  const recentListings = [
    {
      id: 1,
      product: "iPhone 15 128GB",
      seller: "Anna Nowak",
      price: "2 799 zł",
      status: "Opublikowana",
    },
    {
      id: 2,
      product: "Air Max 270",
      seller: "Piotr Wiśniewski",
      price: "420 zł",
      status: "Opublikowana",
    },
    {
      id: 3,
      product: "Galaxy S24 128GB",
      seller: "Tomasz Kamiński",
      price: "2 150 zł",
      status: "Oczekuje",
    },
    {
      id: 4,
      product: "ThinkPad X1 Carbon",
      seller: "Adam Zieliński",
      price: "3 900 zł",
      status: "Opublikowana",
    },
  ];

  const recentUsers = [
    {
      id: 1,
      name: "Michał Kowalski",
      username: "michal.kowalski@example.com",
      role: "USER",
    },
    {
      id: 2,
      name: "Anna Nowak",
      username: "anna.nowak@example.com",
      role: "SELLER",
    },
    {
      id: 3,
      name: "Piotr Wiśniewski",
      username: "piotr.wisniewski@example.com",
      role: "SELLER",
    },
    {
      id: 4,
      name: "Robert Dąbrowski",
      username: "robert.dabrowski@example.com",
      role: "ADMIN",
    },
  ];

  return (
    <main className="admin-dashboard">
      {/* =====================================================
                HEADER METADATA BLOCK
          ====================================================== */}
      <header className="admin-dashboard__header">
        <div>
          <span className="admin-dashboard__eyebrow">Administracja</span>
          <h1 className="admin-dashboard__title">Dashboard</h1>
          <p className="admin-dashboard__description">
            Przegląd najważniejszych danych Twojego marketplace.
          </p>
        </div>
      </header>

      {/* =====================================================
                RESPONSIVE TWO-COLUMN GRID ENGINE
          ====================================================== */}
      <div className="admin-dashboard__layout-body">
        {/* LEFT COLUMN CONTENT: GENERAL ACTIVE LEDGERS */}
        <div className="admin-dashboard__main-content">
          {/* HIGH-DENSITY COUNTER STATS ROW */}
          <section className="admin-dashboard__stats">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Link
                  key={stat.label}
                  to={stat.path}
                  className="admin-dashboard__stat"
                >
                  <div className="admin-dashboard__stat-top">
                    <div className="admin-dashboard__stat-icon">
                      <Icon />
                    </div>
                    {stat.change && (
                      <span className="admin-dashboard__stat-change">
                        {stat.change}
                      </span>
                    )}
                  </div>
                  <div className="admin-dashboard__stat-value">
                    {stat.value}
                  </div>
                  <div className="admin-dashboard__stat-label">
                    {stat.label}
                  </div>
                </Link>
              );
            })}
          </section>

          {/* SYSTEM SUMMARY METRICS CARD */}
          <section className="admin-dashboard__overview">
            <div className="admin-dashboard__overview-header">
              <div>
                <h2 className="admin-dashboard__panel-title">Marketplace</h2>
                <p className="admin-dashboard__panel-subtitle">
                  Podsumowanie ogólnej aktywności.
                </p>
              </div>
              <FiTrendingUp className="admin-dashboard__overview-trend-icon" />
            </div>

            <div className="admin-dashboard__overview-grid">
              <div className="admin-dashboard__metric">
                <span className="admin-dashboard__metric-label">
                  Aktywne oferty
                </span>
                <strong className="admin-dashboard__metric-value">1,842</strong>
                <small className="admin-dashboard__metric-trend">
                  +8.4% w tym miesiącu
                </small>
              </div>
              <div className="admin-dashboard__metric">
                <span className="admin-dashboard__metric-label">
                  Zamówienia
                </span>
                <strong className="admin-dashboard__metric-value">328</strong>
                <small className="admin-dashboard__metric-trend">
                  +14.2% w tym miesiącu
                </small>
              </div>
              <div className="admin-dashboard__metric">
                <span className="admin-dashboard__metric-label">
                  Sprzedający
                </span>
                <strong className="admin-dashboard__metric-value">214</strong>
                <small className="admin-dashboard__metric-trend">
                  18 nowych kont
                </small>
              </div>
              <div className="admin-dashboard__metric">
                <span className="admin-dashboard__metric-label">
                  Wartość sprzedaży
                </span>
                <strong className="admin-dashboard__metric-value">
                  84 620 zł
                </strong>
                <small className="admin-dashboard__metric-trend">
                  Bieżący okres
                </small>
              </div>
            </div>
          </section>

          {/* DYNAMIC LISTINGS LOGS VIEW PORT */}
          <section className="admin-dashboard__panel">
            <div className="admin-dashboard__panel-header">
              <div>
                <h2 className="admin-dashboard__panel-title">
                  Ostatnie oferty
                </h2>
                <p className="admin-dashboard__panel-subtitle">
                  Najnowsze listingi sprzedających.
                </p>
              </div>
              <Link
                to="/account/admin/listings"
                className="admin-dashboard__panel-link"
              >
                <span>Wszystkie</span> <FiArrowRight />
              </Link>
            </div>
            <div className="admin-dashboard__table-wrapper">
              <table className="admin-dashboard__table">
                <thead>
                  <tr>
                    <th>Produkt</th>
                    <th>Sprzedający</th>
                    <th>Cena</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentListings.map((listing) => (
                    <tr key={listing.id}>
                      <td>
                        <strong className="admin-dashboard__product-name">
                          {listing.product}
                        </strong>
                      </td>
                      <td>
                        <span className="admin-dashboard__text-regular">
                          {listing.seller}
                        </span>
                      </td>
                      <td>
                        <span className="admin-dashboard__text-regular font-semibold">
                          {listing.price}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`admin-dashboard__status ${listing.status === "Opublikowana" ? "admin-dashboard__status--success" : "admin-dashboard__status--pending"}`}
                        >
                          {listing.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN ASIDE: QUICK INTERVENTION PANE */}
        <aside className="admin-dashboard__sidebar">
          {/* USER REGISTRY FEED PANEL */}
          <div className="admin-dashboard__panel">
            <div className="admin-dashboard__panel-header">
              <div>
                <h2 className="admin-dashboard__panel-title">
                  Nowi użytkownicy
                </h2>
                <p className="admin-dashboard__panel-subtitle">
                  Ostatnio zarejestrowane konta.
                </p>
              </div>
              <Link
                to="/account/admin/users"
                className="admin-dashboard__panel-link"
              >
                <span>Wszyscy</span> <FiArrowRight />
              </Link>
            </div>
            <div className="admin-dashboard__users">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="admin-dashboard__user"
                >
                  <div className="admin-dashboard__avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="admin-dashboard__user-info">
                    <strong className="admin-dashboard__user-name">
                      {user.name}
                    </strong>
                    <span className="admin-dashboard__user-email">
                      {user.username}
                    </span>
                  </div>
                  <span
                    className={`admin-dashboard__role admin-dashboard__role--${user.role.toLowerCase()}`}
                  >
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ADMINISTRATIVE OVERRIDE UTILITIES PANEL */}
          <div className="admin-dashboard__quick">
            <h2 className="admin-dashboard__panel-title">Szybkie działania</h2>
            <div className="admin-dashboard__quick-grid">
              <Link
                to="/account/listings/new"
                className="admin-dashboard__quick-item"
              >
                <FiPackage />
                <div>
                  <strong>Dodaj produkt</strong>
                  <span>Utwórz nowy produkt w katalogu</span>
                </div>
                <FiArrowRight />
              </Link>
              <Link
                to="/account/admin/categories"
                className="admin-dashboard__quick-item"
              >
                <FiGrid />
                <div>
                  <strong>Dodaj kategorię</strong>
                  <span>Zarządzaj drzewem kategorii</span>
                </div>
                <FiArrowRight />
              </Link>
              <Link
                to="/account/admin/brands"
                className="admin-dashboard__quick-item"
              >
                <FiTag />
                <div>Zarządzaj markamiModyfikuj słowniki marek</div>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};
export default AdminDashboard;
