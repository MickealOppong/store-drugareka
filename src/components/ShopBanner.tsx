import { useTranslation } from "react-i18next";
import { FiArrowRight, FiTag } from "react-icons/fi";

import bannerImage from "../assets/Banner.png";
import "../css/ShopBanner.scss";

const ShopBanner = () => {
  const { t } = useTranslation();

  return (
    <section className="shop-banner" aria-labelledby="shop-banner-title">
      <div className="shop-banner__content">
        <span className="shop-banner__eyebrow">
          <FiTag aria-hidden="true" />
          {t("shop.banner.eyebrow")}
        </span>

        <h2 id="shop-banner-title">{t("shop.banner.title")}</h2>
        <p>{t("shop.banner.description")}</p>

        <a className="shop-banner__cta" href="#shop-products">
          {t("shop.banner.cta")}
          <FiArrowRight aria-hidden="true" />
        </a>

        <span className="shop-banner__note">{t("shop.banner.note")}</span>
      </div>

      <div className="shop-banner__visual" aria-hidden="true">
        <img
          className="shop-banner__image"
          src={bannerImage}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  );
};

export default ShopBanner;
