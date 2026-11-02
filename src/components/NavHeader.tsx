import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiHeart, FiShoppingBag, FiUser } from "react-icons/fi";
import { useDispatch } from "react-redux";
// 🚀 THE NAVIGATION FIX: Imported NavLink instead of standard Link for automatic state matching
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../css/NavHeader.css";
import { appName } from "../data/data";
import { useLogoutMutation } from "../features/api/authApi";
import { useGetCartCountQuery } from "../features/api/cartApi";
import { useGetWishlistCountQuery } from "../features/api/itemApi";
import { userApi } from "../features/api/userApi";
import { logoutUser } from "../features/slice/userSlice";
import { useAppSelector } from "../store";
import Loading from "./Loading";
import Search from "./Search";

const NavHeader = () => {
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const { email, roles } = useAppSelector((state) => state.userSlice);
  const { guestCartCount } = useAppSelector((state) => state.cartSlice);
  const { t } = useTranslation();

  const isUserLoggedIn = Boolean(email);

  const { data: cartCounter } = useGetCartCountQuery(undefined, { skip: !email });
  const { data: wishlistCounter } = useGetWishlistCountQuery(undefined, { skip: !email });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const refreshToken = localStorage.getItem("rtk") as string;
  const [logout, { isLoading }] = useLogoutMutation();

  const handleAccountLogout = async () => {
    try {
      await logout(refreshToken).unwrap();
      dispatch(logoutUser());
      dispatch(userApi.util.resetApiState());
      navigate("/");
    } catch (error) {
      console.error("Logout transaction lifecycle exception:", error);
      dispatch(logoutUser());
      navigate("/login");
    }
  };

  const onUserButtonClick = () => {
    if (!email) {
      return navigate('/login');
    }
    roles.includes("ROLE_ADMIN") ? navigate('/account/admin') : navigate('/account/user');
  };

  const onWishlistButtonClick = () => {
    if (!email) {
      return navigate('/login');
    }
    navigate('/account/wishlist');
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <header className="nav-header">
      <div className="nav-header__inner">
        
        <Link to="/" className="nav-header__brand" style={{ textTransform: 'uppercase' }}>
          {appName} <span>.pl</span>
        </Link>

        {/*  REFACTORED WORKSPACE ROUTING TRAILER ARRAYS */}
        <nav className="nav-header__navigation">
          <NavLink 
            to="/shop?category=all_0" 
        
            className={({ isActive }) => 
              `nav-header__nav-link ${isActive ? "nav-header__nav-link--active" : ""}`
            }
            end // Stops route greedy matches matching subcategory children tracks loops unexpectedly
          >
            {t("navigation.menu.shop", "Shop")}
          </NavLink>
          
          <NavLink 
            to="/shop/categories?category=all_0" 
            className={({ isActive }) => 
              `nav-header__nav-link ${isActive ? "nav-header__nav-link--active" : ""}`
            }
          >
            {t("navigation.menu.categories", "Categories")}
          </NavLink>
          
          <NavLink 
            to="/sell" 
            className={({ isActive }) => 
              `nav-header__nav-link nav-header__nav-link--sell ${isActive ? "nav-header__nav-link--active" : ""}`
            }
          >
            {t("navigation.menu.sell", "Sell")}
          </NavLink>
        </nav>

        <div className="nav-header__actions">
          <button
            type="button"
            className="nav-header__action-btn"
            aria-label={t("navigation.accessibility.view_cart")}
            onClick={() => navigate("/cart")}
          >
            <FiShoppingBag />
            <span className="nav-header__counter-badge">
              {isUserLoggedIn ? cartCounter : guestCartCount}
            </span>
          </button>

          <button
            type="button"
            className="nav-header__action-btn"
            onClick={onWishlistButtonClick}
            aria-label={t("navigation.accessibility.view_wishlist")}
          >
            <FiHeart />
            <span className="nav-header__counter-badge">
              {isUserLoggedIn ? wishlistCounter : 0}
            </span>
          </button>

          <button 
            type="button"
            className="nav-header__action-btn nav-header__action-btn--account"
            onClick={onUserButtonClick}
            aria-label={t("navigation.accessibility.view_account")}
          >
            <FiUser />
            <span className="nav-header__btn-text">{t("navigation.actions.account")}</span>
          </button>

          {email ? (
            <button 
              type="button" 
              className="nav-header__auth-btn nav-header__auth-btn--logout" 
              onClick={handleAccountLogout}
            >
              {t("navigation.actions.logout")}
            </button>
          ) : (
            <Link to="/login" className="nav-header__auth-btn nav-header__auth-btn--login">
              {t("navigation.actions.login")}
            </Link>
          )}
          
        </div>
      </div>

      <div className="nav-header__search-overlay">
        <Search
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          recentSearches={["Nike shoes", "summer dress", "leather bag"]}
        />
      </div>
    </header>
  );
};

export default NavHeader;
