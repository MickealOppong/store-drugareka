import { useTranslation } from "react-i18next";
import {
  FiArrowLeft,
  FiCreditCard,
  FiGrid,
  FiHeart,
  FiPackage,
  FiPlus,
  FiShoppingBag,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

import { Loading } from "../components";
import '../css/Admin.css';
import { useLogoutMutation } from "../features/api/authApi";
import { logoutUser } from "../features/slice/userSlice";

interface UserSidebarProps {
  onNavigate: () => void;
}

const User: React.FC<UserSidebarProps> = ({ onNavigate }) => {
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
      console.error("Logout transaction lifecycle exception:", error);
      dispatch(logoutUser());
      navigate("/login");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="al-sidebar">
      <div className="al-sidebar__label"  >{t("user_sidebar.label")}</div>

      <nav className="al-sidebar__menu">
        <NavLink to="/account/user" end className="al-nav-link" onClick={onNavigate}>
          <FiGrid className="al-nav-link__icon" />
          <span>{t("user_sidebar.menu.dashboard")}</span>
        </NavLink>

        <NavLink to="/account/listings/me" className="al-nav-link" onClick={onNavigate}>
          <FiPackage className="al-nav-link__icon" />
          <span>{t("user_sidebar.menu.my_products")}</span>
        </NavLink>

        <NavLink to="/account/orders" className="al-nav-link" onClick={onNavigate}>
          <FiShoppingBag className="al-nav-link__icon" />
          <span>{t("user_sidebar.menu.orders")}</span>
        </NavLink>

        <NavLink to="/account/shipments" className="al-nav-link" onClick={onNavigate}>
          <FiTruck className="al-nav-link__icon" />
          <span>{t("user_sidebar.menu.shipments")}</span>
        </NavLink>

        <NavLink to="/account/wishlist" className="al-nav-link" onClick={onNavigate}>
          <FiHeart className="al-nav-link__icon" />
          <span>{t("user_sidebar.menu.wishlist")}</span>
        </NavLink>

        <NavLink to="/account/payouts" className="al-nav-link" onClick={onNavigate}>
          <FiCreditCard className="al-nav-link__icon" />
          <span>{t("user_sidebar.menu.payouts")}</span>
        </NavLink>
           <NavLink to="/account/me" className="al-nav-link" onClick={onNavigate}>
          <FiUser className="al-nav-link__icon" />
          <span>{t("user_sidebar.menu.my_profile")}</span>
        </NavLink>
       
      </nav>

      <div className="al-sidebar-footer">
        <NavLink to="/account/listings/new" className="al-add-btn" onClick={onNavigate}>
          <FiPlus />
          <span>{t("user_sidebar.footer.add_product")}</span>
        </NavLink>

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

export default User;
