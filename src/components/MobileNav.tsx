
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FiArrowRight,
  FiHeart,
  FiMenu,
  FiShoppingBag,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/MobileNav.css";
import { appName } from "../data/data";
import { useLogoutMutation } from "../features/api/authApi";
import { useGetCartCountQuery } from "../features/api/cartApi";
import { useGetWishlistCountQuery } from "../features/api/itemApi";
import { logoutUser } from "../features/slice/userSlice";
import { useAppSelector } from "../store";
import CategoryTree from "./CategoryTree";
import Loading from "./Loading";
import Search from "./Search";

const MobileNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { t } = useTranslation();
  const { email, roles } = useAppSelector((state) => state.userSlice);
  const { guestCartCount } = useAppSelector((state) => state.cartSlice);

  const isUserLoggedIn = Boolean(email);

  const { data: cartCounter } = useGetCartCountQuery(undefined, {
    skip: !email,
  });

  const { data: wishlistCounter } = useGetWishlistCountQuery(undefined, {
    skip: !email,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [logout, { isLoading }] = useLogoutMutation();
  const refreshToken = localStorage.getItem("rtk") as string;

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const handleAccountLogout = async () => {
    try {
      await logout(refreshToken).unwrap();
      dispatch(logoutUser());
      closeMenu();
      navigate("/");
    } catch (error) {
      console.error("Logout transaction lifecycle exception:", error);
      dispatch(logoutUser());
      closeMenu();
      navigate("/login");
    }
  };

  const onUserButtonClick = () => {
    closeMenu();

    if (!email) {
      navigate("/login");
      return;
    }

    roles.includes("ROLE_ADMIN")
      ? navigate("/account/admin")
      : navigate("/account/user");
  };

  const onWishlistButtonClick = () => {
    closeMenu();

    if (!email) {
      navigate("/login");
      return;
    }

    navigate("/account/wishlist");
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <header className="mn-header">
      <div className="mn-header__inner">
        <Link
          to="/"
          className="mn-brand"
          onClick={closeMenu}
          style={{ textTransform: "uppercase" }}
        >
          {appName}
          <span className="mn-brand__light">.pl</span>
        </Link>

        <div className="mn-header__actions">
          <button
            type="button"
            className="mn-header__action-btn"
            aria-label={t("navigation.accessibility.view_cart")}
            onClick={() => {
              closeMenu();
              navigate("/cart");
            }}
          >
            <FiShoppingBag />
            <span className="mn-header__counter-badge">
              {isUserLoggedIn ? cartCounter : guestCartCount}
            </span>
          </button>

          <button
            type="button"
            className="mn-header__action-btn"
            onClick={onWishlistButtonClick}
            aria-label={t("navigation.accessibility.view_wishlist")}
          >
            <FiHeart />
            <span className="mn-header__counter-badge">
              {isUserLoggedIn ? wishlistCounter : 0}
            </span>
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
            aria-label={
              menuOpen
                ? t("navigation.accessibility.menu_close")
                : t("navigation.accessibility.menu_open")
            }
            aria-expanded={menuOpen}
            aria-controls="mn-mobile-drawer"
            onClick={() => setMenuOpen((open) => !open)}
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
        <div
          className="mn-drawer"
          id="mn-mobile-drawer"
        >
          {/* Top section: product categories */}
          <section className="mn-drawer__categories">
            <div className="mn-drawer__section-heading">
              <h2>{t("navigation.menu.categories")}</h2>
            </div>

            <div className="mn-drawer__category-content">
              <CategoryTree />
            </div>
          </section>

          {/* Bottom section: main navigation */}
          <nav
            className="mn-drawer__navigation"
            aria-label={t("navigation.menu.shop")}
          >
            <div className="mn-drawer__section-heading">
              <h2>{t("navigation.menu.shop")}</h2>
            </div>

            <div className="mn-drawer__nav">
              <Link
                to="/shop"
                className="mn-drawer__nav-link"
                onClick={closeMenu}
              >
                <span className="mn-drawer__link-text">
                  {t("navigation.menu.shop")}
                </span>
                <FiArrowRight className="mn-drawer__link-icon" />
              </Link>

              <Link
                to="/sell"
                className="mn-drawer__nav-link"
                onClick={closeMenu}
              >
                <span className="mn-drawer__link-text">
                  {t("navigation.menu.sell")}
                </span>
                <FiArrowRight className="mn-drawer__link-icon" />
              </Link>

              {email ? (
                <button
                  type="button"
                  className="mn-drawer__logout-btn"
                  onClick={handleAccountLogout}
                >
                  {t("navigation.actions.logout")}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="mn-drawer__nav-link mn-drawer__nav-link--login"
                  onClick={closeMenu}
                >
                  <span className="mn-drawer__link-text">
                    {t("navigation.actions.login")}
                  </span>
                  <FiArrowRight className="mn-drawer__link-icon" />
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default MobileNav;