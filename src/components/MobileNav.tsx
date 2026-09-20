import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiArrowRight, FiHeart, FiMenu, FiShoppingBag, FiUser, FiX } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/MobileNav.css";
import { appName } from "../data/data";
import { useLogoutMutation } from "../features/api/authApi";
import { useGetCartCountQuery } from "../features/api/cartApi";
import { useGetWishlistCountQuery } from "../features/api/itemApi";
import { logoutUser } from "../features/slice/userSlice";
import { useAppSelector } from "../store";
import logoKasoa from './../assets/logo-kasoa.png';
import Loading from "./Loading";
import Search from "./Search";
const MobileNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  
  const { username, roles } = useAppSelector((state) => state.userSlice);
  const { guestCartCount } = useAppSelector((state) => state.cartSlice);
  const isUserLoggedIn = Boolean(username);

  const { data: cartCounter } = useGetCartCountQuery();
  const { data: wishlistCounter } = useGetWishlistCountQuery();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [logout, { isLoading }] = useLogoutMutation();
  const refreshToken = localStorage.getItem("rtk") as string;

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleAccountLogout = async () => {
    try {
      const response = await logout(refreshToken).unwrap();
      if (response === true) {
        dispatch(logoutUser());
        navigate("/");
      }
    } catch (error) {
      console.error("Logout execution failure:", error);
    }
  };

  const onUserButtonClick = () => {
    setMenuOpen(false);
    if (!username) {
      return navigate('/login');
    }
    roles.includes("ROLE_ADMIN") ? navigate('/account/admin') : navigate('/account/user');
  };

  const onWishlistButtonClick = () => {
    setMenuOpen(false);
    if (!username) {
      return navigate('/login');
    }
    navigate('/account/wishlist');
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <header className="mn-header">
      <div className="mn-header__inner">
        
        <Link to="/" className="mn-brand" onClick={() => setMenuOpen(false)}  style={{textTransform:'uppercase'}}>
          <img src={logoKasoa} alt="" style={{width:"30px",height:'30px'}} /> {appName}<span className="mn-brand__light">.pl</span>
        </Link>

        <div className="mn-header__actions">
          <button
            type="button"
            className="mn-header__action-btn"
            aria-label={t("navigation.accessibility.view_cart")}
            onClick={() => navigate("/cart")}
          >
            <FiShoppingBag />
            <span className="mn-header__counter-badge">{isUserLoggedIn ? cartCounter : guestCartCount}</span>
          </button>

          <button
            type="button"
            className="mn-header__action-btn"
            onClick={onWishlistButtonClick}
            aria-label={t("navigation.accessibility.view_wishlist")}
          >
            <FiHeart />
            <span className="mn-header__counter-badge">{isUserLoggedIn ? wishlistCounter : 0}</span>
          </button>

          <button 
            type="button"
            className="mn-header__action-btn"
            onClick={onUserButtonClick}
            aria-label={t("navigation.accessibility.view_account")}
          >
            <FiUser />
          </button>

          <button
            type="button"
            className="mn-header__menu-toggle"
            aria-label={menuOpen ? t("navigation.accessibility.menu_close") : t("navigation.accessibility.menu_open")}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <Search
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          recentSearches={["Nike shoes", "summer dress", "leather bag"]}
        />
      </div>

      {menuOpen && (
        <div className="mn-drawer">
          <nav className="mn-drawer__nav">
            
            <Link to="/shop" className="mn-drawer__nav-link">
              <span className="mn-drawer__link-text">{t("navigation.menu.shop")}</span>
              <FiArrowRight className="mn-drawer__link-icon" />
            </Link>

            <Link to="/shop/categories" className="mn-drawer__nav-link">
              <span className="mn-drawer__link-text">{t("navigation.menu.categories")}</span>
              <FiArrowRight className="mn-drawer__link-icon" />
            </Link>

            <Link to="/sell" className="mn-drawer__nav-link">
              <span className="mn-drawer__link-text">{t("navigation.menu.sell")}</span>
              <FiArrowRight className="mn-drawer__link-icon" />
            </Link>

            {username ? (
              <button type="button" className="mn-drawer__logout-btn" onClick={handleAccountLogout}>
                {t("navigation.actions.logout")}
              </button>
            ) : (
              <Link to="/login" className="mn-drawer__nav-link mn-drawer__nav-link--login">
                <span className="mn-drawer__link-text">{t("navigation.actions.login")}</span>
                <FiArrowRight className="mn-drawer__link-icon" />
              </Link>
            )}

          </nav>
        </div>
      )}
    </header>
  );
};

export default MobileNav;
