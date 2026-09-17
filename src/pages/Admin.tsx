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
import { useLogoutMutation } from "../features/api/authApi";
import { logoutUser } from "../features/slice/userSlice";
import './../css/Admin.css';

interface AdminSidebarProps {
  onNavigate: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onNavigate }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      <div className="al-sidebar__label">Administracja</div>

      <nav className="al-sidebar__menu">
        <NavLink to="/account/admin" end className="al-nav-link" onClick={onNavigate}>
          <FiGrid className="al-nav-link__icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/account/admin/listings" className="al-nav-link" onClick={onNavigate}>
          <FiPackage className="al-nav-link__icon" />
          <span>Produkty</span>
        </NavLink>

        <NavLink to="/account/admin/categories" className="al-nav-link" onClick={onNavigate}>
          <FiLayers className="al-nav-link__icon" />
          <span>Kategorie</span>
        </NavLink>

        <NavLink to="/account/admin/brands" className="al-nav-link" onClick={onNavigate}>
          <FiTag className="al-nav-link__icon" />
          <span>Marki</span>
        </NavLink>

        <NavLink to="/account/admin/orders" className="al-nav-link" onClick={onNavigate}>
          <FiShoppingBag className="al-nav-link__icon" />
          <span>Zamówienia</span>
        </NavLink>

        <NavLink to="/account/admin/shipments" className="al-nav-link" onClick={onNavigate}>
          <FiTruck className="al-nav-link__icon" />
          <span>Wysyłki</span>
        </NavLink>

        <NavLink to="/account/admin/users" className="al-nav-link" onClick={onNavigate}>
          <FiUsers className="al-nav-link__icon" />
          <span>Użytkownicy</span>
        </NavLink>

        <NavLink to="/account/admin/conditions" className="al-nav-link" onClick={onNavigate}>
          <FiLayers className="al-nav-link__icon" />
          <span>Condition</span>
        </NavLink>

        <NavLink to="/account/admin/reports" className="al-nav-link" onClick={onNavigate}>
          <FiFlag className="al-nav-link__icon" />
          <span>Zgłoszenia</span>
        </NavLink>

        <NavLink to="/account/admin/analytics" className="al-nav-link" onClick={onNavigate}>
          <FiBarChart2 className="al-nav-link__icon" />
          <span>Analityka</span>
        </NavLink>

        <NavLink to="/account/admin/payouts" className="al-nav-link" onClick={onNavigate}>
          <FiCreditCard className="al-nav-link__icon" />
          <span>Wypłaty</span>
        </NavLink>
      </nav>

      <div className="al-sidebar-footer">
        <NavLink to="/shop" className="al-sidebar-footer__back-link" onClick={onNavigate}>
          Powrót do sklepu
        </NavLink>

        <button type="button" className="al-sidebar-footer__logout-btn" onClick={handleAccountLogout}>
          <FiArrowLeft /> <span>Log out</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
