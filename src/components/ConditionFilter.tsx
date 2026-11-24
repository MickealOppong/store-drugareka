import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCheckCircle, FiPlus, FiX } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router";
import "../css/Filter.css";
import { useGetAllConditionsQuery } from "../features/api/storeApi";


export const ConditionFilter= () => {
  const { t } = useTranslation();
    const navigate = useNavigate();
    const { search, pathname } = useLocation();
      const searchParams = new URLSearchParams(search);
      
  // CRUD RTK lazy query and mutation triggers
  const {data:conditions=[]}= useGetAllConditionsQuery();
  const[selectedCondition,setSelectedCondition]=useState<string>('')

  useEffect(()=>{
    const condition = searchParams.get("condition") || "";
    setSelectedCondition(condition)
  },[pathname])

  const handleToggleCondition = (condition:string) => {
    setSelectedCondition(condition)
    searchParams.set("condition", condition);
    navigate(`${pathname}?${searchParams.toString()}`);
  };

  const handleClearAll = () => {
   setSelectedCondition('')
  
    searchParams.delete("condition");
    navigate(`${pathname}?${searchParams.toString()}#category-products`);
  };

  return (
    <div className="mkt-filter">
      <div className="mkt-filter__header">
        <span className="mkt-filter__title">
          {t("product_conditions.title")}
        </span>

        {conditions.length > 0 && (
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
        {conditions.map((option) => {
          const isSelected = selectedCondition===option.slug

          return (
            <button
              key={option.slug}
              type="button"
              className={`mkt-filter-chip ${isSelected ? "mkt-filter-chip--selected" : ""}`}
              onClick={() => handleToggleCondition(option.slug)}
              aria-pressed={isSelected}
            >
              <span className="mkt-filter-chip__label">
                {t(`product_conditions.conditions.${option.slug.toLowerCase()}`)}
              </span>
              
              <div className="mkt-filter-chip__indicator">
                {isSelected ? <FiCheckCircle /> : <FiPlus />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};


export default ConditionFilter;
