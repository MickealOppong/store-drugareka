import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCheckCircle, FiPlus, FiX } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router";
import "../css/ConditionFilter.css";
import { useFetchBrandsQuery } from "../features/api/storeApi";


export const BrandFilter= () => {
  const { t } = useTranslation();
    const navigate = useNavigate();
    const { search, pathname } = useLocation();
      const searchParams = new URLSearchParams(search);
      const[selectedCategory,setSelectedCategory]=useState<string>('')
      
  // CRUD RTK lazy query and mutation triggers
  const {data:brands=[]}= useFetchBrandsQuery(selectedCategory||'')
  const[selectedBrand,setSelectedBrand]=useState<string>('')
  
  const brand = searchParams.get("brand") || "";
  const category = searchParams.get("category") || "";

useEffect(()=>{
//remove category id and pass only slug to query
  const cleanCategory =category.substring(0,category.lastIndexOf('_'));

  setSelectedBrand(brand)
  setSelectedCategory(cleanCategory)
},[pathname,category,brand])

  const handleToggleBrand = (brand:string) => {
    setSelectedBrand(brand)
    searchParams.set("brand", brand);
    navigate(`${pathname}?${searchParams.toString()}#category-products`);
  };

  const handleClearAll = () => {
   setSelectedBrand('')
  
    searchParams.set("brand", '');
    navigate(`${pathname}?${searchParams.toString()}`);
  };

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
        {brands.map((option) => {
          const isSelected = selectedBrand===option.name

          return (
            <button
              key={option.slug}
              type="button"
              className={`mkt-condition-chip ${isSelected ? "mkt-condition-chip--selected" : ""}`}
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
    </div>
  );
};


export default BrandFilter;
