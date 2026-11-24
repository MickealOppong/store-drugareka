import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiPlus,
  FiX,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router";
import "../css/ConditionFilter.css";
import { useFetchBrandsQuery } from "../features/api/storeApi";

const INITIAL_VISIBLE_BRANDS = 8;

export const BrandFilter = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { search, pathname } = useLocation();

  const searchParams = new URLSearchParams(search);

  const [selectedCategory, setSelectedCategory] =
    useState<string>("");

  const [selectedBrand, setSelectedBrand] =
    useState<string>("");

  const [isExpanded, setIsExpanded] = useState(false);

  const { data: brands = [] } = useFetchBrandsQuery(
    selectedCategory || ""
  );

  const brand = searchParams.get("brand") || "";
  const category = searchParams.get("category") || "";

  useEffect(() => {
    const cleanCategory = category.substring(
      0,
      category.lastIndexOf("_")
    );

    setSelectedBrand(brand);
    setSelectedCategory(cleanCategory);
  }, [pathname, category, brand]);

  // Collapse when the category changes
  useEffect(() => {
    setIsExpanded(false);
  }, [category]);

  const handleToggleBrand = (brand: string) => {
    setSelectedBrand(brand);
    searchParams.set("brand", brand);

    navigate(
      `${pathname}?${searchParams.toString()}#category-products`
    );
  };

  const handleClearAll = () => {
    setSelectedBrand("");
    searchParams.set("brand", "");

    navigate(`${pathname}?${searchParams.toString()}`);
  };

  // Keep the selected brand visible when collapsed
  const orderedBrands = [
    ...brands.filter((option) => option.name === selectedBrand),
    ...brands.filter((option) => option.name !== selectedBrand),
  ];

  const visibleBrands = isExpanded
    ? orderedBrands
    : orderedBrands.slice(0, INITIAL_VISIBLE_BRANDS);

  const remainingBrands = Math.max(
    0,
    brands.length - INITIAL_VISIBLE_BRANDS
  );

  return (
    <div className="mkt-condition-filter">
      <div className="mkt-condition-filter__header">
        <span className="mkt-condition-filter__title">
          {t("user_products.table.headers.brand")}
        </span>

        {brands.length > 0 && (
          <button
            type="button"
            className="mkt-condition-filter__clear-btn"
            onClick={handleClearAll}
          >
            <span>{t("product_conditions.clear")}</span>

            <FiX className="mkt-condition-filter__clear-icon" />
          </button>
        )}
      </div>

      <div className="mkt-condition-filter__grid">
        {visibleBrands.map((option) => {
          const isSelected = selectedBrand === option.name;

          return (
            <button
              key={option.slug}
              type="button"
              className={`mkt-condition-chip ${
                isSelected
                  ? "mkt-condition-chip--selected"
                  : ""
              }`}
              onClick={() => handleToggleBrand(option.name)}
              aria-pressed={isSelected}
            >
              <span className="mkt-condition-chip__label">
                {option.name}
              </span>

              <div className="mkt-condition-chip__indicator">
                {isSelected ? <FiCheckCircle /> : <FiPlus />}
              </div>
            </button>
          );
        })}
      </div>

      {remainingBrands > 0 && (
        <button
          type="button"
          className="mkt-condition-filter__expand-btn"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
        >
          <span>
            {isExpanded
              ? t("brand_filter.view_less")
              : `${t("brand_filter.view_more")} (${remainingBrands})`}
          </span>

          {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
        </button>
      )}
    </div>
  );
};

export default BrandFilter;