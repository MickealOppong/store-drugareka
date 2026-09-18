import { useTranslation } from "react-i18next";
import {
  FiArrowLeft,
  FiBarChart2,
  FiCreditCard,
  FiFlag,
  FiGrid,
  FiLayers,
  FiPackage,
  FiShoppingBag,
  FiTag,
  FiTruck,
  FiUsers,
} from "react-icons/fi";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { Loading } from "../components";
import '../css/Admin.css';
import { useLogoutMutation } from "../features/api/authApi";
import { logoutUser } from "../features/slice/userSlice";

interface AdminSidebarProps {
  onNavigate: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onNavigate }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const refreshToken = localStorage.getItem("rtk") as string;
  const [logout, { isLoading }] = useLogoutMutation();

  const handleAccountLogout = async () => {
    try {
      await logout(refreshToken).unwrap();
      dispatch(logoutUser());
      navigate("/");
    } catch (error) {
      console.error("Admin logout session interception error:", error);
      dispatch(logoutUser());
      navigate("/login");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="al-sidebar">
      <div className="al-sidebar__label">{t("admin_sidebar.label")}</div>

      <nav className="al-sidebar__menu">
        <NavLink to="/account/admin" end className="al-nav-link" onClick={onNavigate}>
          <FiGrid className="al-nav-link__icon" />
          <span>{t("admin_sidebar.menu.dashboard")}</span>
        </NavLink>

        <NavLink to="/account/admin/listings" className="al-nav-link" onClick={onNavigate}>
          <FiPackage className="al-nav-link__icon" />
          <span>{t("admin_sidebar.menu.products")}</span>
        </NavLink>

        <NavLink to="/account/admin/categories" className="al-nav-link" onClick={onNavigate}>
          <FiLayers className="al-nav-link__icon" />
          <span>{t("admin_sidebar.menu.categories")}</span>
        </NavLink>

        <NavLink to="/account/admin/brands" className="al-nav-link" onClick={onNavigate}>
          <FiTag className="al-nav-link__icon" />
          <span>{t("admin_sidebar.menu.brands")}</span>
        </NavLink>

        <NavLink to="/account/admin/orders" className="al-nav-link" onClick={onNavigate}>
          <FiShoppingBag className="al-nav-link__icon" />
          <span>{t("admin_sidebar.menu.orders")}</span>
        </NavLink>

        <NavLink to="/account/admin/shipments" className="al-nav-link" onClick={onNavigate}>
          <FiTruck className="al-nav-link__icon" />
          <span>{t("admin_sidebar.menu.shipments")}</span>
        </NavLink>

        <NavLink to="/account/admin/users" className="al-nav-link" onClick={onNavigate}>
          <FiUsers className="al-nav-link__icon" />
          <span>{t("admin_sidebar.menu.users")}</span>
        </NavLink>

        <NavLink to="/account/admin/conditions" className="al-nav-link" onClick={onNavigate}>
          <FiLayers className="al-nav-link__icon" />
          <span>{t("admin_sidebar.menu.conditions")}</span>
        </NavLink>

        <NavLink to="/account/admin/reports" className="al-nav-link" onClick={onNavigate}>
          <FiFlag className="al-nav-link__icon" />
          <span>{t("admin_sidebar.menu.reports")}</span>
        </NavLink>

        <NavLink to="/account/admin/analytics" className="al-nav-link" onClick={onNavigate}>
          <FiBarChart2 className="al-nav-link__icon" />
          <span>{t("admin_sidebar.menu.analytics")}</span>
        </NavLink>

        <NavLink to="/account/admin/payouts" className="al-nav-link" onClick={onNavigate}>
          <FiCreditCard className="al-nav-link__icon" />
          <span>{t("admin_sidebar.menu.payouts")}</span>
        </NavLink>
      </nav>

      <div className="al-sidebar-footer">
        <NavLink to="/shop" className="al-sidebar-footer__back-link" onClick={onNavigate}>
          {t("user_sidebar.footer.back_to_shop")}
        </NavLink>

        <button type="button" className="al-sidebar-footer__logout-btn" onClick={handleAccountLogout}>
          <FiArrowLeft /> <span>{t("user_sidebar.footer.logout")}</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
