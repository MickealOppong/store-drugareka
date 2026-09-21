import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { appName } from "../data/data";
import LanguageSwitcher from "./LanguageSwitcher";

const Footer = ()=>{
    const {t }=useTranslation();
    
    return (
              <footer className="landing-footer">
        <div className="landing-footer__brand">
          <Link
            to="/"
            className="brand"
          >
            {appName}<span>.pl</span>
          </Link>

          <p>{t("landing.footer.tagline")}</p>
        </div>

        <div className="landing-footer__links">
          <div>
            <h4>{t("landing.footer.heading_shop")}</h4>

            <Link to="/shop">{t("landing.footer.link_all_products")}</Link>

            <Link to="/shop/categories">{t("landing.footer.link_categories")}</Link>

            <Link to="/shop">{t("landing.footer.link_new_arrivals")}</Link>
          </div>

          <div>
            <h4>{t("landing.footer.heading_sell")}</h4>

            <Link to="/sell">{t("landing.footer.link_how_it_works")}</Link>

            <Link to="/account/user">{t("landing.footer.link_start_selling")}</Link>
          </div>

          <div>
            <h4>{t("landing.footer.heading_help")}</h4>

            <Link to="/help">{t("landing.footer.link_help_centre")}</Link>

            <Link to="/contact">{t("landing.footer.link_contact")}</Link>
          </div>
        </div>
        <LanguageSwitcher/>
      </footer>
    )
}
export default Footer;