import {
  FiArrowRight,
  FiGrid,
  FiPackage,
  FiShoppingBag,
  FiTag,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { Link, redirect } from "react-router-dom";

import type { Store } from "redux";
import type { RootState } from "../store";
import "./../css/AdminDashboard.css";

export const loader = (store: Store<RootState>) => async () => {
    const roles = store.getState().userSlice.roles;
    if (!roles.includes("ROLE_ADMIN")) {
        return redirect("/account/user");
    }
    return null;
};

const AdminDashboard = () => {
  const stats = [
    { label: "Użytkownicy", value: "1,248", change: "+12%", icon: FiUsers, path: "/account/users" },
    { label: "Produkty", value: "486", change: "+8%", icon: FiPackage, path: "/account/products" },
    { label: "Kategorie", value: "15", change: "", icon: FiGrid, path: "/account/categories" },
    { label: "Marki", value: "324", change: "+24", icon: FiTag, path: "/account/brands" },
  ];

  const recentListings = [
    { id: 1, product: "iPhone 15 128GB", seller: "Anna Nowak", price: "2 799 zł", status: "Opublikowana" },
    { id: 2, product: "Air Max 270", seller: "Piotr Wiśniewski", price: "420 zł", status: "Opublikowana" },
    { id: 3, product: "Galaxy S24 128GB", seller: "Tomasz Kamiński", price: "2 150 zł", status: "Oczekuje" },
    { id: 4, product: "ThinkPad X1 Carbon", seller: "Adam Zieliński", price: "3 900 zł", status: "Opublikowana" },
  ];

  const recentUsers = [
    { id: 1, name: "Michał Kowalski", username: "michal.kowalski@example.com", role: "USER" },
    { id: 2, name: "Anna Nowak", username: "anna.nowak@example.com", role: "SELLER" },
    { id: 3, name: "Piotr Wiśniewski", username: "piotr.wisniewski@example.com", role: "SELLER" },
    { id: 4, name: "Robert Dąbrowski", username: "robert.dabrowski@example.com", role: "ADMIN" },
  ];

  return (
    <main className="admin-dashboard">
      {/* =====================================================
                HEADER
            ====================================================== */}
      <header className="admin-dashboard__header">
        <div>
          <span className="admin-dashboard__eyebrow">Administracja</span>
          <h1>Dashboard</h1>
          <p>Przegląd najważniejszych danych Twojego marketplace.</p>
        </div>
      </header>

      {/* =====================================================
                RESPONSIVE SPLIT WORKSPACE BODY
            ====================================================== */}
      <div className="admin-dashboard__layout-body">
        
        {/* LEFT COLUMN COMPONENT (FIXED / PINNED ON WIDESCREEN) */}
        <div className="admin-dashboard__main-content">
          
          {/* STATS ROW */}
          <section className="admin-dashboard__stats">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Link key={stat.label} to={stat.path} className="admin-dashboard__stat">
                  <div className="admin-dashboard__stat-top">
                    <div className="admin-dashboard__stat-icon"><Icon /></div>
                    {stat.change && <span className="admin-dashboard__stat-change">{stat.change}</span>}
                  </div>
                  <div className="admin-dashboard__stat-value">{stat.value}</div>
                  <div className="admin-dashboard__stat-label">{stat.label}</div>
                </Link>
              );
            })}
          </section>

          {/* MARKETPLACE SUMMARY OVERVIEW */}
          <section className="admin-dashboard__overview">
            <div className="admin-dashboard__overview-header">
              <div>
                <h2>Marketplace</h2>
                <p>Podsumowanie aktywności.</p>
              </div>
              <FiTrendingUp />
            </div>

            <div className="admin-dashboard__overview-grid">
              <div className="admin-dashboard__metric">
                <span>Aktywne oferty</span>
                <strong>1,842</strong>
                <small>+8.4% w tym miesiącu</small>
              </div>
              <div className="admin-dashboard__metric">
                <span>Zamówienia</span>
                <strong>328</strong>
                <small>+14.2% w tym miesiącu</small>
              </div>
              <div className="admin-dashboard__metric">
                <span>Sprzedający</span>
                <strong>214</strong>
                <small>18 nowych</small>
              </div>
              <div className="admin-dashboard__metric">
                <span>Wartość sprzedaży</span>
                <strong>84 620 zł</strong>
                <small>Ten miesiąc</small>
              </div>
            </div>
          </section>

          {/* RECENT LISTINGS DATA TABLE */}
          <section className="admin-dashboard__panel">
            <div className="admin-dashboard__panel-header">
              <div>
                <h2>Ostatnie oferty</h2>
                <p>Najnowsze listingi sprzedających.</p>
              </div>
              <Link to="/account/listings">
                Wszystkie <FiArrowRight />
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
                      <td><strong>{listing.product}</strong></td>
                      <td>{listing.seller}</td>
                      <td>{listing.price}</td>
                      <td>
                        <span className={`admin-dashboard__status ${listing.status === "Opublikowana" ? "admin-dashboard__status--success" : "admin-dashboard__status--pending"}`}>
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

        {/* ASIDE COLUMN PANEL (SCROLLABLE ALONGSIDE STICKY REGIONS) */}
        <aside className="admin-dashboard__sidebar">
          
          {/* NEW REGISTERED USERS COMPONENT */}
          <div className="admin-dashboard__panel" style={{ marginBottom: "20px" }}>
            <div className="admin-dashboard__panel-header">
              <div>
                <h2>Nowi użytkownicy</h2>
                <p>Ostatnio zarejestrowane konta.</p>
              </div>
              <Link to="/account/users">
                Wszyscy <FiArrowRight />
              </Link>
            </div>
            <div className="admin-dashboard__users">
              {recentUsers.map((user) => (
                <div key={user.id} className="admin-dashboard__user">
                  <div className="admin-dashboard__avatar">{user.name.charAt(0).toUpperCase()}</div>
                  <div className="admin-dashboard__user-info">
                    <strong>{user.name}</strong>
                    <span>{user.username}</span>
                  </div>
                  <span className={`admin-dashboard__role admin-dashboard__role--${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK LINKS COMPONENT PANEL */}
          <div className="admin-dashboard__quick">
            <h2>Szybkie działania</h2>
            <div className="admin-dashboard__quick-grid">
              <Link to="/account/listings/new">
                <FiPackage />
                <div>
                  <strong>Dodaj produkt</strong>
                  <span>Utwórz nowy produkt w katalogu</span>
                </div>
                <FiArrowRight />
              </Link>
              <Link to="/account/admin/categories">
                <FiGrid />
                <div>
                  <strong>Dodaj kategorię</strong>
                  <span>Dodaj kategorię do katalogu</span>
                </div>
                <FiArrowRight />
              </Link>
              <Link to="/account/admin/brand/new">
                <FiTag />
                <div>
                  <strong>Dodaj markę</strong>
                  <span>Dodaj markę do katalogu</span>
                </div>
                <FiArrowRight />
              </Link>
              <Link to="/account/admin/orders">
                <FiShoppingBag />
                <div>
                  <strong>Zamówienia</strong>
                  <span>Sprawdź ostatnie zamówienia</span>
                </div>
                <FiArrowRight />
              </Link>
            </div>
          </div>
        </aside>

      </div>
    </main>
  );
};

export default AdminDashboard;
