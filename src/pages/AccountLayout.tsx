
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, Outlet, redirect } from "react-router-dom";
import "../css/AccountLayout.css"; // 🚀 Connect directly to compiled stylesheet asset outputs
import { appName } from "../data/data";
import { userApi } from "../features/api/userApi";
import { updateUser } from "../features/slice/userSlice";

import type { Store } from "redux";
import { useAppSelector, type AppDispatch, type RootState } from "../store";
import type { TUserDto } from "../types/TUserDto";
import Admin from "./Admin";
import User from "./User";

export const loader = (store: Store<RootState>) => async () => {
  const { email } = store.getState().userSlice;

  // 1. Unauthenticated Gate
  if (!email) {
    return redirect("/login");
  }

  const dispatch = store.dispatch as AppDispatch;

  try {
    // 2. Initiate the RTK Query endpoint request
    const apiQueryTrigger = dispatch(userApi.endpoints.getUser.initiate());
    
    // 3. Force the loader to wait until the network payload is FULLY resolved
    const response = await apiQueryTrigger.unwrap(); 
    
    if (response) {
      // 4. Update your slice once the data is guaranteed to exist
      dispatch(updateUser(response.data));
    //  console.log("Loader Synced: User data loaded successfully", response);
    }
    
  } catch (error: any) {
   // console.error("Loader Exception: User profile sync failed", error);
    
    // If the backend returns a 401 or 403 on this profiles sync, clear state and boot to login
    if (error?.status === 401 || error?.status === 403) {
       return redirect("/login");
    }
  }

  return null;
};

export default function SellerLayout() {
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const user: TUserDto = useAppSelector((state) => state.userSlice);

  const userRolesList = user?.roles || [];
  const isAdminUser = userRolesList.includes("ROLE_ADMIN");

  const handleCloseNavigation = () => setOpenSidebar(false);

  return (
    <div className="al-layout">
      {/* MOBILE STICKY TOP BAR */}
      <div className="al-mobile-bar">
        <Link to="/shop" className="al-brand">
          {appName}
          <span className="al-brand__light">.pl</span>
        </Link>
        <button
          type="button"
          className="al-mobile-toggle"
          onClick={() => setOpenSidebar(true)}
          aria-label="Open navigation menu"
          aria-expanded={openSidebar}
        >
          <FiMenu />
        </button>
      </div>

      {/* RESPONSIVE PANEL SLIDER COLUMN */}
      <div className={`al-sidebar-wrapper ${openSidebar ? "al-sidebar-wrapper--open" : ""}`}>
        <div className="al-sidebar-overlay" onClick={handleCloseNavigation} />

        <div className="al-sidebar-container">
          <Link to="/shop" className="al-brand">
            {appName}
            <span className="al-brand__light">.pl</span>
          </Link>

          <button
            type="button"
            className="al-sidebar-close"
            onClick={handleCloseNavigation}
            aria-label="Close navigation menu"
          >
            <FiX />
          </button>

          <nav className="al-sidebar-nav">
            {isAdminUser ? (
              <Admin onNavigate={handleCloseNavigation} />
            ) : (
              <User onNavigate={handleCloseNavigation} />
            )}
          </nav>
        </div>
      </div>

      {/* CORE VIEWPORT OUTLET TARGET PANEL WORKSPACE */}
      <main className="al-content">
        <Outlet />
      </main>
    </div>
  );
}
