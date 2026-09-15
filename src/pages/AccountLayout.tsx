import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Outlet, redirect } from "react-router-dom";
import type { Store } from "redux";
import { userApi } from "../features/api/userApi";
import { updateUser } from "../features/slice/userSlice";
import { useAppSelector, type AppDispatch, type RootState } from "../store";
import type { TUserDto } from "../types/TUserDto";
import "./../css/AccountLayout.css";
import Admin from "./Admin";
import User from "./User";

export const loader = (store:Store<RootState>)=>async ()=>{
  const {username} = store.getState().userSlice;

  if(!username){
   // return redirect('/login')
  }

  const dispatch = store.dispatch as AppDispatch;
  const response = await dispatch(userApi.endpoints.getUser.initiate(username,{forceRefetch:true}))
  if(response.error){
    const {status} = response.error as {status:number,data:any}
    if(status===401){
      return redirect("/login")
    }
  }
  
  store.dispatch(updateUser(response.data?.data))

  return null;
}
export default function SellerLayout() {
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const user: TUserDto = useAppSelector((state) => state.userSlice);



return (
  <div className="account-layout">
    {/* Top mobile navigation bar toggle header */}
    <div className="account-mobile-bar">
      <div className="account-sidebar__brand">
        Druga<span>Ręka</span>
      </div>
      <button 
        className="account-mobile-toggle" 
        onClick={() => setOpenSidebar(true)}
        aria-label="Open navigation menu"
      >
        <FiMenu />
      </button>
    </div>

    {/* Sidebar structural node layout wrapper */}
    <div className={`account-sidebar-wrapper ${openSidebar ? "account-sidebar-wrapper--open" : ""}`}>
      {/* Invisible mobile click-away overlay backing surface */}
      <div className="account-sidebar-overlay" onClick={()=>setOpenSidebar(false)}/>
      
      <div className="account-sidebar-container-wrapper">
        {/* Brand layout title header inside the sliding side pane */}
        <div className="account-sidebar-container__brand">
          Druga<span>Ręka</span>
        </div>

        {/* Mobile-only internal close trigger button */}
        <button 
          className="account-sidebar-close-btn"
          onClick={() => setOpenSidebar(false)}
          aria-label="Close navigation menu"
        >
          <FiX />
        </button>

        {user.roles.includes("ROLE_ADMIN") ? <Admin onNavigate={()=>setOpenSidebar(false)} /> : <User onNavigate={()=>setOpenSidebar(false)}/>}
      </div>
    </div>

    <main className="account-content">
      <Outlet />
    </main>
  </div>
);


}
