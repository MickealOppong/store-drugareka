import { NavLink, useNavigate } from "react-router-dom";

import {
    FiArrowLeft,
    FiBarChart2,
    FiCreditCard,
    FiFlag,
    FiGrid,
    FiLayers,
    FiPackage,
    FiShoppingBag,
    FiTag,
    FiTruck,
    FiUsers
} from "react-icons/fi";

import { useDispatch } from "react-redux";
import { useLogoutMutation } from "../features/api/authApi";
import { logoutUser } from "../features/slice/userSlice";
import "./../css/Admin.css";

const AdminSidebar = ({onNavigate}:{onNavigate:()=>void}) => {


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

            {/* =====================================================
                ADMIN MENU
            ====================================================== */}

            <div className="account-sidebar__label">
                ADMINISTRACJA
            </div>


            <nav>

                {/* Dashboard */}

                <NavLink
                    to="/account/admin"
                    end onClick={onNavigate}
                >
                    <FiGrid />
                    Dashboard
                </NavLink>


                {/* Products / Listings */}

                <NavLink to="/account/admin/listings" onClick={onNavigate}>
                    <FiPackage />
                    Produkty
                </NavLink>


                {/* Categories */}

                <NavLink to="/account/admin/categories" onClick={onNavigate}>
                    <FiLayers />
                    Kategorie
                </NavLink>


                {/* Brands */}

                <NavLink to="/account/admin/brands" onClick={onNavigate}>
                    <FiTag />
                    Marki
                </NavLink>


                {/* Orders */}

                <NavLink to="/account/admin/orders" onClick={onNavigate}>
                    <FiShoppingBag />
                    Zamówienia
                </NavLink>


                {/* Shipments */}

                <NavLink to="/account/admin/shipments" onClick={onNavigate}>
                    <FiTruck />
                    Wysyłki
                </NavLink>


                {/* Users */}

                <NavLink to="/account/admin/users" onClick={onNavigate}>
                    <FiUsers />
                    Użytkownicy
                </NavLink>
                {/* Conditions*/}

                <NavLink to="/account/admin/conditions" onClick={onNavigate}>
                    <FiLayers />
                    Condition
                </NavLink>


                {/* Reports */}

                <NavLink to="/account/admin/reports" onClick={onNavigate}>
                    <FiFlag />
                    Zgłoszenia
                </NavLink>


                {/* Analytics */}

                <NavLink to="/account/admin/analytics" onClick={onNavigate}>
                    <FiBarChart2 />
                    Analityka
                </NavLink>


                {/* Payouts */}

                <NavLink to="/account/admin/payouts" onClick={onNavigate}>
                    <FiCreditCard />
                    Wypłaty
                </NavLink>

            </nav>


            {/* =====================================================
                BOTTOM
            ====================================================== */}

            <div className="account-sidebar__bottom">

                <NavLink to="/shop">
                    Powrót do sklepu
                </NavLink>

                    <button className="sidebar-close-btn" onClick={()=>handleAccountLogout()}><FiArrowLeft/> Log out</button>
            </div>

        </aside>
    );
};

export default AdminSidebar;