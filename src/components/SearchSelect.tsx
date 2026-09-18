import React, { useEffect, useRef, useState } from "react";
import { FiCheck, FiSearch, FiTag, FiX } from "react-icons/fi";
import "../css/SearchSelect.css";
import type { TbrandResponse } from "../types/TBrandResponse";

interface SearchSelectProps {
  brands: TbrandResponse[];
  value: string; // 
  onChange: (e: any) => void; 
}

const SearchSelect: React.FC<SearchSelectProps> = ({ brands, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown cleanly when clicking outside the component scope bounds
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter against the current text string value passed down from AddListing's state
  const filteredBrands = brands.filter((brand: TbrandResponse) =>
    brand.name.toLowerCase().includes(value.toLowerCase().trim())
  );

  const handleSelect = (brand: TbrandResponse) => {
    // Pass selection straight up to AddListing's state engine
    onChange({
      target: {
        name: "brand",
        value: brand.name
      }
    });
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Reset parent form data field
    onChange({
      target: {
        name: "brand",
        value: ""
      }
    });
  };

  return (
    <div className="brand-select" ref={dropdownRef}>
      {/* SEARCH CONTAINER CONTROL TRIGGER */}
      <div 
        className={`brand-select__control ${isOpen ? "brand-select__control--focused" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiTag className="brand-select__meta-icon" />
        
        <input
          type="text"
          name="brand"
          className="brand-select__input"
          placeholder="Wpisz lub szukaj..."
          value={value} 
          onChange={onChange} 
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }} 
          onFocus={() => setIsOpen(true)}
          autoComplete="off"
        />

        {value && !isOpen ? (
          <button type="button" className="brand-select__clear-btn" onClick={handleClear} aria-label="Wyczyść wybór">
            <FiX />
          </button>
        ) : (
          <FiSearch className="brand-select__search-icon" />
        )}
      </div>

      {/* FLOATING DROPDOWN OPTIONS MATRIX */}
      {isOpen && (
        <div className="brand-select__dropdown">
          <ul className="brand-select__list">
            {filteredBrands.length > 0 ? (
              filteredBrands.map((brand: TbrandResponse) => (
                <li
                  key={brand.id}
                  className={`brand-select__option ${brand.name === value ? "brand-select__option--active" : ""}`}
                  onClick={() => handleSelect(brand)}
                >
                  <span>{brand.name}</span>
                  {brand.name === value && <FiCheck className="brand-select__check-icon" />}
                </li>
              ))
            ) : (
              <li className="brand-select__empty-state">
                <p className="brand-select__empty-text">Nie znaleźliśmy "{value}"</p>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchSelect;
