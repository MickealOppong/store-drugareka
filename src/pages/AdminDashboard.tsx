import { useTranslation } from "react-i18next";
import {
  FiArrowRight,
  FiDollarSign,
  FiGrid,
  FiPackage,
  FiShoppingCart,
  FiTag,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { Link, redirect } from "react-router-dom";
import type { Store } from "redux";
import { Loading } from "../components";
import "../css/AdminDashboard.css";
import { useGetAnalyticsQuery } from "../features/api/adminApi";
import type { RootState } from "../store";

export const loader = (store: Store<RootState>) => async () => {
  const roles = store.getState().userSlice.roles || [];

  if (!roles.includes("ROLE_ADMIN")) {
    return redirect("/account/user");
  }

  return null;
};

interface DashboardStat {
  increase: number;
  percentageChange: number;
  previousTotal: number;
  total: number;
}

interface RecentListing {
  id: number | string;
  product: string;
  seller: string;
  price: number | string;
  status: string;
}

interface RecentUser {
  id: number | string;
  name: string;
  username: string;
  role: string[];
}

interface AdminDashboardDto {
  recentListings: RecentListing[];
  recentUsers: RecentUser[];
  stats: {
    Sales: DashboardStat;
    brands: DashboardStat;
    categories: DashboardStat;
    listings: DashboardStat;
    orders: DashboardStat;
    products: DashboardStat;
    sellers: DashboardStat;
    users: DashboardStat;
  };
}

const numberFormatter = new Intl.NumberFormat("pl-PL");
const currencyFormatter = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
  maximumFractionDigits: 2,
});

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useGetAnalyticsQuery();

  if (isLoading) {
    return <Loading />;
  }

  const dashboard = data as AdminDashboardDto | undefined;
  const stats = dashboard?.stats;
  const recentListings = dashboard?.recentListings ?? [];
  const recentUsers = dashboard?.recentUsers ?? [];

  const formatChange = (percentageChange: number) => {
    const value = Number(percentageChange ?? 0);
    return `${value > 0 ? "+" : ""}${numberFormatter.format(value)}%`;
  };

  const formatPrice = (price: number | string) => {
    const value = Number(price);
    return Number.isFinite(value) ? currencyFormatter.format(value) : price;
  };

  const primaryStats = [
    {
      key: "users",
      label: t("adminDashboard.stats.users"),
      value: stats?.users?.total ?? 0,
      change: stats?.users?.percentageChange ?? 0,
      icon: FiUsers,
      path: "/account/admin/users",
    },
    {
      key: "listings",
      label: t("adminDashboard.stats.listings"),
      value: stats?.listings?.total ?? 0,
      change: stats?.listings?.percentageChange ?? 0,
      icon: FiPackage,
      path: "/account/admin/listings",
    },
    {
      key: "orders",
      label: t("adminDashboard.stats.orders"),
      value: stats?.orders?.total ?? 0,
      change: stats?.orders?.percentageChange ?? 0,
      icon: FiShoppingCart,
      path: "/account/admin/orders",
    },
    {
      key: "sales",
      label: t("adminDashboard.stats.sales"),
      value: stats?.Sales?.total ?? 0,
      change: stats?.Sales?.percentageChange ?? 0,
      icon: FiDollarSign,
      path: "/account/admin/orders",
      isCurrency: true,
    },
  ];

  const overviewStats = [
    {
      key: "products",
      label: t("adminDashboard.stats.products"),
      stat: stats?.products,
    },
    {
      key: "categories",
      label: t("adminDashboard.stats.categories"),
      stat: stats?.categories,
    },
    {
      key: "sellers",
      label: t("adminDashboard.stats.sellers"),
      stat: stats?.sellers,
    },
    {
      key: "brands",
      label: t("adminDashboard.stats.brands"),
      stat: stats?.brands,
    },
  ];

  return (
    <main className="admin-dashboard">
      <header className="admin-dashboard__header">
        <div>
          <span className="admin-dashboard__eyebrow">
            {t("adminDashboard.header.eyebrow")}
          </span>
          <h1 className="admin-dashboard__title">
            {t("adminDashboard.header.title")}
          </h1>
          <p className="admin-dashboard__description">
            {t("adminDashboard.header.description")}
          </p>
        </div>
      </header>

      <div className="admin-dashboard__layout-body">
        <div className="admin-dashboard__main-content">
          <section className="admin-dashboard__stats">
            {primaryStats.map((stat) => {
              const Icon = stat.icon;

              return (
                <Link
                  key={stat.key}
                  to={stat.path}
                  className="admin-dashboard__stat"
                >
                  <div className="admin-dashboard__stat-top">
                    <div className="admin-dashboard__stat-icon">
                      <Icon />
                    </div>
                    <span className="admin-dashboard__stat-change">
                      {formatChange(stat.change)}
                    </span>
                  </div>
                  <div className="admin-dashboard__stat-value">
                    {stat.isCurrency
                      ? formatPrice(stat.value)
                      : numberFormatter.format(stat.value)}
                  </div>
                  <div className="admin-dashboard__stat-label">
                    {stat.label}
                  </div>
                </Link>
              );
            })}
          </section>

          <section className="admin-dashboard__overview">
            <div className="admin-dashboard__overview-header">
              <div>
                <h2 className="admin-dashboard__panel-title">
                  {t("adminDashboard.overview.title")}
                </h2>
                <p className="admin-dashboard__panel-subtitle">
                  {t("adminDashboard.overview.subtitle")}
                </p>
              </div>
              <FiTrendingUp className="admin-dashboard__overview-trend-icon" />
            </div>

            <div className="admin-dashboard__overview-grid">
              {overviewStats.map(({ key, label, stat }) => (
                <div className="admin-dashboard__metric" key={key}>
                  <span className="admin-dashboard__metric-label">
                    {label}
                  </span>
                  <strong className="admin-dashboard__metric-value">
                    {numberFormatter.format(stat?.total ?? 0)}
                  </strong>
                  <small className="admin-dashboard__metric-trend">
                    {t("adminDashboard.overview.change", {
                      increase: numberFormatter.format(stat?.increase ?? 0),
                      percentage: formatChange(stat?.percentageChange ?? 0),
                    })}
                  </small>
                </div>
              ))}
            </div>
          </section>

          <section className="admin-dashboard__panel">
            <div className="admin-dashboard__panel-header">
              <div>
                <h2 className="admin-dashboard__panel-title">
                  {t("adminDashboard.recentListings.title")}
                </h2>
                <p className="admin-dashboard__panel-subtitle">
                  {t("adminDashboard.recentListings.subtitle")}
                </p>
              </div>
              <Link
                to="/account/admin/listings"
                className="admin-dashboard__panel-link"
              >
                <span>{t("adminDashboard.actions.viewAll")}</span>
                <FiArrowRight />
              </Link>
            </div>

            <div className="admin-dashboard__table-wrapper">
              <table className="admin-dashboard__table">
                <thead>
                  <tr>
                    <th>{t("adminDashboard.recentListings.product")}</th>
                    <th>{t("adminDashboard.recentListings.seller")}</th>
                    <th>{t("adminDashboard.recentListings.price")}</th>
                    <th>{t("adminDashboard.recentListings.status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentListings.length > 0 ? (
                    recentListings.map((listing) => (
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
                            {formatPrice(listing.price)}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`admin-dashboard__status ${
                              listing.status === "PUBLISHED"
                                ? "admin-dashboard__status--success"
                                : "admin-dashboard__status--pending"
                            }`}
                          >
                            {t(
                              `adminDashboard.listingStatus.${listing.status}`,
                              { defaultValue: listing.status },
                            )}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4}>
                        {t("adminDashboard.recentListings.empty")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="admin-dashboard__sidebar">
          <div className="admin-dashboard__panel">
            <div className="admin-dashboard__panel-header">
              <div>
                <h2 className="admin-dashboard__panel-title">
                  {t("adminDashboard.recentUsers.title")}
                </h2>
                <p className="admin-dashboard__panel-subtitle">
                  {t("adminDashboard.recentUsers.subtitle")}
                </p>
              </div>
              <Link
                to="/account/admin/users"
                className="admin-dashboard__panel-link"
              >
                <span>{t("adminDashboard.actions.viewAll")}</span>
                <FiArrowRight />
              </Link>
            </div>

            <div className="admin-dashboard__users">
              {recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="admin-dashboard__user"
                  >
                    <div className="admin-dashboard__avatar">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="admin-dashboard__user-info">
                      <strong className="admin-dashboard__user-name">
                        {user.name}
                      </strong>
                      <span className="admin-dashboard__user-email">
                        {user.username}
                      </span>
                    </div>
                    <div className="admin-dashboard__user-roles">
                      {(user.role ?? []).map((role) => (
                        <span
                          key={role}
                          className={`admin-dashboard__role admin-dashboard__role--${role?.toLowerCase()}`}
                        >
                          {t(`adminDashboard.roles.${role.split("_")[1]}`, {
                            defaultValue: role,
                          })}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p>{t("adminDashboard.recentUsers.empty")}</p>
              )}
            </div>
          </div>

          <div className="admin-dashboard__quick">
            <h2 className="admin-dashboard__panel-title">
              {t("adminDashboard.quickActions.title")}
            </h2>
            <div className="admin-dashboard__quick-grid">
              <Link
                to="/account/listings/new"
                className="admin-dashboard__quick-item"
              >
                <FiPackage />
                <div>
                  <strong>{t("adminDashboard.quickActions.addProduct")}</strong>
                  <span>
                    {t("adminDashboard.quickActions.addProductDescription")}
                  </span>
                </div>
                <FiArrowRight />
              </Link>
              <Link
                to="/account/admin/categories"
                className="admin-dashboard__quick-item"
              >
                <FiGrid />
                <div>
                  <strong>{t("adminDashboard.quickActions.addCategory")}</strong>
                  <span>
                    {t("adminDashboard.quickActions.addCategoryDescription")}
                  </span>
                </div>
                <FiArrowRight />
              </Link>
              <Link
                to="/account/admin/brands"
                className="admin-dashboard__quick-item"
              >
                <FiTag />
                <div>
                  <strong>{t("adminDashboard.quickActions.manageBrands")}</strong>
                  <span>
                    {t("adminDashboard.quickActions.manageBrandsDescription")}
                  </span>
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
