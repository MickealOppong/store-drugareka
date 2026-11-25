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
import "../css/Filter.css";
import { useFetchBrandsQuery } from "../features/api/storeApi";

const INITIAL_VISIBLE_BRANDS = 8;

export const BrandFilter = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { search, pathname } = useLocation();

  const searchParams = new URLSearchParams(search);

  const selectedBrand = searchParams.get("brand") || "";
  const category = searchParams.get("category") || "";

  const separatorIndex = category.lastIndexOf("_");

  const selectedCategory =
    separatorIndex >= 0
      ? category.substring(0, separatorIndex)
      : category;

  const [isExpanded, setIsExpanded] = useState(false);

  const { data: brands = [] } = useFetchBrandsQuery(
    selectedCategory
  );

  useEffect(() => {
    setIsExpanded(false);
  }, [category]);

  const handleToggleBrand = (brand: string) => {
    const params = new URLSearchParams(search);

    if (selectedBrand === brand) {
      params.delete("brand");
    } else {
      params.set("brand", brand);
    }

    params.set("page", "1");

    navigate(
      `${pathname}?${params.toString()}#category-products`
    );
  };

  const handleClearAll = () => {
    const params = new URLSearchParams(search);

    params.delete("brand");
    params.set("page", "1");

    navigate(`${pathname}?${params.toString()}`);
  };

  // Prevent duplicate brand names from being displayed
  const uniqueBrands = brands.filter(
    (option, index, array) =>
      array.findIndex(
        (item) =>
          item.name.trim().toLowerCase() ===
          option.name.trim().toLowerCase()
      ) === index
  );

  const visibleBrands = isExpanded
    ? uniqueBrands
    : uniqueBrands.slice(0, INITIAL_VISIBLE_BRANDS);

  const remainingBrands = Math.max(
    0,
    uniqueBrands.length - INITIAL_VISIBLE_BRANDS
  );

  return (
    <div className="mkt-filter">
      <div className="mkt-filter__header">
        <span className="mkt-filter__title">
          {t("user_products.table.headers.brand")}
        </span>

        {selectedBrand && (
          <button
            type="button"
            className="mkt-filter__clear-btn"
            onClick={handleClearAll}
          >
            <span>{t("product_conditions.clear")}</span>

            <FiX className="mkt-filter__clear-icon" />
          </button>
        )}
      </div>

      <div className="mkt-filter__grid">
        {visibleBrands.map((option) => {
          const isSelected =
            selectedBrand !== "" &&
            selectedBrand === option.name;

          return (
            <button
              key={option.id}
              type="button"
              className={`mkt-filter-chip ${
                isSelected
                  ? "mkt-filter-chip--selected"
                  : ""
              }`}
              onClick={() => handleToggleBrand(option.name)}
              aria-pressed={isSelected}
            >
              <span className="mkt-filter-chip__label">
                {option.name}
              </span>

              <div className="mkt-filter-chip__indicator">
                {isSelected ? (
                  <FiCheckCircle />
                ) : (
                  <FiPlus />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {remainingBrands > 0 && (
        <button
          type="button"
          className="mkt-filter__expand-btn"
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