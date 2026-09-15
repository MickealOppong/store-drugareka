import { useState } from "react";
import { FiHeart, FiShoppingBag, FiUser } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../features/api/authApi";
import { useGetCartCountQuery } from "../features/api/cartApi";
import { useGetWishlistCountQuery } from "../features/api/itemApi";
import { logoutUser } from "../features/slice/userSlice";
import { useAppSelector } from "../store";
import "./../css/NavHeader.css";
import Loading from "./Loading";
import Search from "./Search";
const NavHeader = () => {
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const {username,roles} = useAppSelector((state) => state.userSlice);
 const {guestCartCount} = useAppSelector((state)=>state.cartSlice)

 
  //log in check
    const isUserLoggedIn = Boolean(username);

  //cart & wishlistcounter
  const{data:cartCounter} = useGetCartCountQuery()
  const{data:wishlistCounter} = useGetWishlistCountQuery()

  
  //dispatcher
  const dispatch = useDispatch();

  //nivaget hook
  const navigate = useNavigate();

  //refresh token
  const refreshToken = localStorage.getItem("rtk") as string;

  //logout hook
  const [logout, { isLoading }] = useLogoutMutation();

  const handleAccountLogout = async () => {
    const response = await logout(refreshToken);

    if (response.data === true) {
       dispatch(logoutUser());
      navigate("/");
    }

  };

    const onUserButtonClick =()=>{
    roles.includes("ROLE_ADMIN")?navigate('/account/admin')
    :navigate('/account/user')
  }

const onWishlistButtonClick=()=>{
  if(!username){
    return navigate('/login')
  }
  navigate('/account/wishlist')
}

  if (isLoading) {
    return <Loading />;
  }
 return (
  <header className="landing-header">
    <div className="landing-header__inner">
      
      {/* 1. BRAND PLATFORM LOGO PROFILE */}
      <Link to="/" className="brand">
        <span>Druga</span>Ręka
      </Link>

      {/* 2. CORE MARKETPLACE CATEGORIZATION NAVIGATION */}
      <nav className="landing-nav">
        <Link to="/shop">Shop</Link>
        <Link to="/shop/categories">Categories</Link>
        <Link to="/sell" className="sell-link">
          Sell with us
        </Link>
      </nav>

      {/* 3. FUNCTIONAL CONTROL UTILITIES & IDENTITY ACCENT LINKS */}
      <div className="landing-header__actions">
        
        {/* Dynamic Search Back-Trigger Action */}
        <button
          type="button"
          className="icon-button"
          aria-label="cart items catalog"
          onClick={()=>navigate("/cart")}
         
        >
          <FiShoppingBag />
    
          <span className="cart-counter">{isUserLoggedIn?cartCounter:guestCartCount}</span>
        </button>

        {/* Saved Items Wishlist Panel Intercept */}
        <button
          type="button"
          className="icon-button"
          onClick={()=>onWishlistButtonClick()}
          aria-label="View saved listings wishlist"
        >
          <FiHeart />
          <span>{isUserLoggedIn?wishlistCounter:0}</span>
        </button>

        {/* Dashboard Menu / Protected Route Portal Redirect Toggle */}
        <button 
          type="button"
          className="icon-button"
          onClick={onUserButtonClick}
          aria-label="Open user dashboard account center menu"
        >
          <FiUser />
          <span>Account</span>
        </button>

        {/* Conditional Authentication State Buttons */}
        {username ? (
          <button
            type="button"
            className="login-button"
            onClick={handleAccountLogout}
          >
            Log out
          </button>
        ) : (
          <Link to="/login" className="login-button">
            Sign in
          </Link>
        )}
        
      </div>
    </div>

    {/* ==========================================================================
       4. PERSISTENT FLOATING DRILL-DOWN SEARCH CONTROLS OVERLAY
       ========================================================================== */}
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
