import { NavLink, useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiCreditCard,
  FiGrid,
  FiPackage,
  FiPlus,
  FiShoppingBag,
  FiTruck
} from "react-icons/fi";

import { useDispatch } from "react-redux";
import { useLogoutMutation } from "../features/api/authApi";
import { logoutUser } from "../features/slice/userSlice";
import { useAppSelector } from "../store";
import "./../css/Admin.css";

const User = ({onNavigate}:{onNavigate:()=>void}) => {

      //roles
      const roles = useAppSelector((state)=>state.userSlice.roles)

      
      //dispatcher
      const dispatch = useDispatch()
  
      //nivaget hook
      const navigate = useNavigate();
  
      //refresh token
      const refreshToken = localStorage.getItem('rtk') as string;
  
      //logout hook
      const [logout,{isLoading}]= useLogoutMutation()
    
      const handleAccountLogout =async ()=>{
  
        const response = await logout(refreshToken)
  
        if(response.data===true){
            dispatch(logoutUser())
            navigate('/')
        }
  
        
      }


          if(isLoading){
            return <p>Loading</p>
        }

      
    return (
       <aside className="account-sidebar">
        

          <div className="account-sidebar__label">TWOJA STRONA</div>

          <nav>
            <NavLink to="/account/user" onClick={onNavigate}>
              <FiGrid />
              Dashboard
            </NavLink>

            <NavLink to="/account/listings/me" onClick={onNavigate} >
              <FiPackage />
              Moje produkty
            </NavLink>


            <NavLink to="/account/orders" onClick={onNavigate}>
              <FiShoppingBag />
              Zamówienia
            </NavLink>

            <NavLink to="/account/shipments" onClick={onNavigate}>
              <FiTruck />
              Wysyłki
            </NavLink>
            <NavLink to="/account/wishlist" onClick={onNavigate}>
              <FiTruck />
              wishlist
            </NavLink>

            <NavLink to="/account/payouts" onClick={onNavigate}>
              <FiCreditCard />
              Wypłaty
            </NavLink>
          </nav>

          <div className="account-sidebar__bottom">
            <NavLink
              to="/account/listings/new"
              className="account-add-button" onClick={onNavigate}
            >
              <FiPlus />
              Dodaj produkt
            </NavLink>

            <NavLink to="/shop" onClick={onNavigate}>Powrót do sklepu</NavLink>
                  <button  className="sidebar-close-btn" onClick={()=>handleAccountLogout()}><FiArrowLeft/> Log out</button>
          </div>
     
        </aside>
    );
};

export default User