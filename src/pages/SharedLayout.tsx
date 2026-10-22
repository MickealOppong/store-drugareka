import { Outlet } from "react-router";
import { MobileNav, NavHeader } from "../components";
import '../css/SharedLayout.css'; // 🚀 Point straight to your compiled template style assets

const SharedLayout = () => {
  return (
   
    <section className="mkt-shared-layout">
      <NavHeader />
      <MobileNav />
      <main className="mkt-shared-layout__main">
        <Outlet />
      </main>
    </section>
  );
};

export default SharedLayout;
