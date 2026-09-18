import { Outlet } from "react-router";
import { MobileNav, NavHeader } from "../components";
import './../css/GenericViewLayout.css';

const SharedLayout = () => {

  return (
    
    <section>
      <NavHeader/>
      <MobileNav/>
      <main>
        <Outlet/>
      </main>
    </section>
  );
};

export default SharedLayout;
