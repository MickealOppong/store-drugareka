import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Outlet, redirect } from "react-router-dom";
import type { Store } from "redux";
import { appName } from "../data/data";
import { userApi } from "../features/api/userApi";
import { updateUser } from "../features/slice/userSlice";
import { useAppSelector, type AppDispatch, type RootState } from "../store";
import type { TUserDto } from "../types/TUserDto";
import "./../css/AccountLayout.css"; // Clean decoupled SCSS bundle target
import Admin from "./Admin";
import User from "./User";

export const loader = (store: Store<RootState>) => async () => {
  const { username } = store.getState().userSlice;

  if (!username) {
    return redirect('/login');
  }

  const dispatch = store.dispatch as AppDispatch;
  const response = await dispatch(userApi.endpoints.getUser.initiate(username, { forceRefetch: true }));
  
  if (response.error) {
    const { status } = response.error as { status: number; data: any };
    if (status === 401) {
      return redirect("/login");
    }
  }
  
  store.dispatch(updateUser(response.data?.data));
  return null;
};

export default function SellerLayout() {
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const user: TUserDto = useAppSelector((state) => state.userSlice);

  // 🚀 FIXED: Fallback protection logic avoiding runtime trace failures on unauthenticated arrays
  const userRolesList = user?.roles || [];
  const isAdminUser = userRolesList.includes("ROLE_ADMIN");

  const handleCloseNavigation = () => setOpenSidebar(false);

  return (
    <div className="al-layout">
      {/* ==========================================================================
          MOBILE STICKY TOP BAR SUB-HEADER
      ========================================================================== */}
      <div className="al-mobile-bar">
        <div className="al-brand"  style={{textTransform:'uppercase'}}>
          {appName}<span className="al-brand__light">.pl</span>
        </div>
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

      {/* ==========================================================================
          RESPONSIVE PANEL SLIDER COMPONENT ELEMENT
      ========================================================================== */}
      <div className={`al-sidebar-wrapper ${openSidebar ? "al-sidebar-wrapper--open" : ""}`}>
        {/* GLASSMORPHISM ACTIVE TRANSITION SCRIM OVERLAY SURFACE */}
        <div className="al-sidebar-overlay" onClick={handleCloseNavigation} />
        
        <div className="al-sidebar-container">
          {/* SLIDEOUT WRAPPER BRAND LOGO ANCHOR */}
          <div className="al-brand al-brand--sidebar" style={{textTransform:'uppercase'}}>
           {appName}<span className="al-brand__light">.pl</span>
          </div>

          {/* INTERNAL MOBILE RETRACT BUTTON */}
          <button 
            type="button"
            className="al-sidebar-close"
            onClick={handleCloseNavigation}
            aria-label="Close navigation menu"
          >
            <FiX />
          </button>

          {/* DYNAMIC INVERSE ROUTER RENDERING TRACKS */}
          <nav className="al-sidebar-nav">
            {isAdminUser ? (
              <Admin onNavigate={handleCloseNavigation} />
            ) : (
              <User onNavigate={handleCloseNavigation} />
            )}
          </nav>
        </div>
      </div>

      {/* ==========================================================================
          CORE VIEWPORT INNER SUB-ROUTER TARGET WORKSPACE
      ========================================================================== */}
      <main className="al-content">
        <Outlet />
      </main>
    </div>
  );
}
