import { useTranslation } from "react-i18next";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Loading } from "../components";
import { useGetAllCategoriesQuery } from "../features/api/storeApi";
import "./../css/Categories.css"; // Imports the new isolated layout module cleanly

const Categories = () => {
  //translation hook
  const {t} = useTranslation()
  const { data: categories = [], isLoading: isCategoriesLoading } = useGetAllCategoriesQuery();
  
  if (isCategoriesLoading) {
    return <Loading />;
  }

  return (
    <section className="ct-panel">
      {/* SCOPED PANEL HEADER SEGMENT */}
      <div className="ct-panel__header">
        <div>
          <span className="ct-panel__eyebrow">{t("categories_page.header.eyebrow")}</span>
          <h2 className="ct-panel__title">{t("categories_page.header.title")}</h2>
        </div>
      </div>

      {/* COMPACT INTUITIVE GRID MATRIX */}
      <div className="ct-grid">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/shop?category=${category.slug}`}
            className="ct-card"
          >
            <div className="ct-card__thumb">
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
              />
            </div>

            <div className="ct-card__overlay">
              <h3 className="ct-card__name">{category.name}</h3>
              <FiArrowRight className="ct-card__icon" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;
