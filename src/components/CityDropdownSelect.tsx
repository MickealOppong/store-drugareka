
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FiCheck,
  FiChevronDown,
  FiChevronRight,
  FiMapPin,
} from "react-icons/fi";
import "../css/CategoryDropdownSelect.css";
import { CITY_REGION, type CityRegion } from "../data/data";



type CityDropdownSelectProps = {
  name: string;
  value: string;
  onChange: (city: string, region: string) => void;
};



export const CityDropdownSelect = ({
  name,
  value,
  onChange,
}: CityDropdownSelectProps) => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [expandedRegionId, setExpandedRegionId] = useState<string | null>(
    null
  );


  
  const dropdownRef = useRef<HTMLDivElement>(null);


  const selectedLocation = useMemo(() => {
    for (const region of CITY_REGION) {
      const city = region.cities.find((item) => item === value);

      if (city) {
        return {
          city,
          region: region.name,
          regionId: region.id,
          label: `${city}, ${region.name}`,
        };
      }
    }

    return null;
  }, [value]);

  // Automatically expand the selected city's region.
  useEffect(() => {
    if (selectedLocation) {
      setExpandedRegionId(selectedLocation.regionId);
    }
  }, [selectedLocation]);

  // Close dropdown when clicking outside.
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const selectCity = (city: string, region: CityRegion) => {
    onChange(city, region.name);
    setIsOpen(false);
  };

    
  return (
    <div className="category-dropdown" ref={dropdownRef}>
      <label
        htmlFor={`${name}-trigger`}
        className="category-dropdown__label"
      >
        <FiMapPin aria-hidden="true" />
        {t("locations.header.text_label", {
          defaultValue: "Collection location",
        })}
      </label>

      <button
        id={`${name}-trigger`}
        type="button"
        className={`category-dropdown__trigger${
          isOpen ? " is-open" : ""
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${name}-options`}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span
          className={
            selectedLocation ? "" : "category-dropdown__placeholder"
          }
        >
          {selectedLocation?.label ??
            t("locations.header.placeholder_text", {
              defaultValue: "-- Select a city --",
            })}
        </span>

        <FiChevronDown
          className="category-dropdown__trigger-icon"
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          id={`${name}-options`}
          className="category-dropdown__menu"
          role="listbox"
          aria-label={t("locations.header.text_label", {
            defaultValue: "Collection location",
          })}
        >
          {CITY_REGION.toSorted((a,b)=>{
            if(a.name==="") return-1;
            if(b.name==="") return 1;
                return a.name.localeCompare(b.name);
          }).map((region) => {
            const isExpanded = expandedRegionId === region.id;

            return (
              <div
                className="category-dropdown__group"
                key={region.id}
              >
                <div className="category-dropdown__parent-row">
                  <button
                    type="button"
                    className="category-dropdown__expand"
                    aria-expanded={isExpanded}
                    onClick={() =>
                      setExpandedRegionId((current) =>
                        current === region.id ? null : region.id
                      )
                    }
                  >
                    {isExpanded ? (
                      <FiChevronDown aria-hidden="true" />
                    ) : (
                      <FiChevronRight aria-hidden="true" />
                    )}

                    <span>{region.name}</span>
              
                  </button>
                </div>

                {isExpanded && (
                  <div className="category-dropdown__children">
                    {region.cities.map((city) => {
                      const isSelected = value === city;

                      return (
                        <button
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          key={city}
                          className={`category-dropdown__child${
                            isSelected ? " is-selected" : ""
                          }`}
                          onClick={() => selectCity(city, region)}
                        >
                          <span>{city}</span>

                          {isSelected && (
                            <FiCheck aria-hidden="true" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <input
        type="text"
        name={name}
        value={value}
        required
        readOnly
        tabIndex={-1}
        aria-hidden="true"
        className="category-dropdown__validation-input"
      />
    </div>
  );
};

export default CityDropdownSelect;
