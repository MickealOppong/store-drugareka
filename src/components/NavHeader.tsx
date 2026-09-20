import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiHeart, FiShoppingBag, FiUser } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "../css/NavHeader.css";
import { appName } from "../data/data";
import { useLogoutMutation } from "../features/api/authApi";
import { useGetCartCountQuery } from "../features/api/cartApi";
import { useGetWishlistCountQuery } from "../features/api/itemApi";
import { logoutUser } from "../features/slice/userSlice";
import { useAppSelector } from "../store";
import logoKasoa from './../assets/logo-kasoa.png';
import Loading from "./Loading";
import Search from "./Search";
const NavHeader = () => {
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const { username, roles } = useAppSelector((state) => state.userSlice);
  const { guestCartCount } = useAppSelector((state) => state.cartSlice);
  const { t } = useTranslation();

  const isUserLoggedIn = Boolean(username);

  const { data: cartCounter } = useGetCartCountQuery();
  const { data: wishlistCounter } = useGetWishlistCountQuery();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const refreshToken = localStorage.getItem("rtk") as string;
  const [logout, { isLoading }] = useLogoutMutation();

  const handleAccountLogout = async () => {
    const response = await logout(refreshToken);
    if (response.data === true) {
      dispatch(logoutUser());
      navigate("/");
    }
  };

  const onUserButtonClick = () => {
    if (!username) {
      return navigate('/login');
    }
    roles.includes("ROLE_ADMIN") ? navigate('/account/admin') : navigate('/account/user');
  };

  const onWishlistButtonClick = () => {
    if (!username) {
      return navigate('/login');
    }
    navigate('/account/wishlist');
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <header className="landing-header">
      <div className="landing-header__inner">
        
        <Link to="/" className="brand" style={{textTransform:'uppercase'}}>
         <img src={logoKasoa} alt="" style={{width:"30px",height:'30px'}} /> {appName} <span>.pl</span>
        </Link>

        <nav className="landing-nav">
          <Link to="/shop">{t("navigation.menu.shop")}</Link>
          <Link to="/shop/categories">{t("navigation.menu.categories")}</Link>
          <Link to="/sell" className="sell-link">
            {t("navigation.menu.sell")}
          </Link>
        </nav>

        <div className="landing-header__actions">
          <button
            type="button"
            className="icon-button"
            aria-label={t("navigation.accessibility.view_cart")}
            onClick={() => navigate("/cart")}
          >
            <FiShoppingBag />
            <span className="cart-counter">{isUserLoggedIn ? cartCounter : guestCartCount}</span>
          </button>

          <button
            type="button"
            className="icon-button"
            onClick={onWishlistButtonClick}
            aria-label={t("navigation.accessibility.view_wishlist")}
          >
            <FiHeart />
            <span>{isUserLoggedIn ? wishlistCounter : 0}</span>
          </button>

          <button 
            type="button"
            className="icon-button"
            onClick={onUserButtonClick}
            aria-label={t("navigation.accessibility.view_account")}
          >
            <FiUser />
            <span>{t("navigation.actions.account")}</span>
          </button>

          {username ? (
            <button type="button" className="login-button" onClick={handleAccountLogout}>
              {t("navigation.actions.logout")}
            </button>
          ) : (
            <Link to="/login" className="login-button">
              {t("navigation.actions.login")}
            </Link>
          )}
          
        </div>
      </div>

      <div className="landing-header__search-overlay">
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
