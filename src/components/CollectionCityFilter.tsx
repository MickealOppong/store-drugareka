import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FiCheck,
  FiChevronDown,
  FiChevronRight,
  FiMapPin,
  FiX,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router";
import "../css/CollectionCityFilter.css";
import { CITY_REGION, type CityRegion } from "../data/data";

type CityDropdownSelectProps = {
  name: string;
  value: string;
  selectedRegion?: string;
};

export const CollectionCityFilter = ({
  name,
  value,
  selectedRegion = "",
}: CityDropdownSelectProps) => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [expandedRegionId, setExpandedRegionId] = useState<string | null>(
    selectedRegion || null
  );
  const navigate = useNavigate();
  const { search, pathname } = useLocation();
    const searchParams = new URLSearchParams(search);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find selected city and its region.
  const selectedLocation = useMemo(() => {
    for (const region of CITY_REGION) {
      if (selectedRegion && region.id !== selectedRegion) {
        continue;
      }

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
  }, [value, selectedRegion]);

  // Expand the selected city's region.
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

  // Open dropdown and expand the first region if none is selected.
  const toggleDropdown = () => {
    setIsOpen((open) => {
      if (!open && !expandedRegionId) {
        setExpandedRegionId(CITY_REGION[0]?.id ?? null);
      }

      return !open;
    });
  };

  // Expand or collapse a voivodeship.
  const toggleRegion = (regionId: string) => {
    setExpandedRegionId((current) => (current === regionId ? null : regionId));
  };

  // Select a city.
  const selectCity = (city: string, region: CityRegion) => {
  
    searchParams.set("collectionCity", `${city}_${region.name}`);
    navigate(`${pathname}?${searchParams.toString()}`);
    setIsOpen(false);
  };

const clearCityFilter =()=>{
  searchParams.delete("collectionCity");
  navigate(`${pathname}?${searchParams.toString()}`);
    setIsOpen(false);
}

  
  return (
    <div className="collection-city-dropdown" ref={dropdownRef}>
     <div className="collection-city-dropdown__header" >
         <label
        htmlFor={`${name}-trigger`}
        className="collection-city-dropdown__label"
      >
        <FiMapPin aria-hidden="true" />
       {t("categories.collection.placeholder_label")}
      </label>
     <button onClick={()=>clearCityFilter()}    className="collection-city-dropdown__btn">
     {t("categories.collection.clear_location")}
         <FiX/>
     </button>
     </div>

      <button
        id={`${name}-trigger`}
        type="button"
        className={`collection-city-dropdown__trigger${
          isOpen ? " is-open" : ""
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${name}-options`}
        onClick={toggleDropdown}
      >
        <span
          className={
            selectedLocation
              ? "collection-city-dropdown__value"
              : "collection-city-dropdown__placeholder"
          }
        >
          {selectedLocation?.label ??
            t("categories.collection.select_city")}
        </span>

        <FiChevronDown
          className="collection-city-dropdown__trigger-icon"
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          id={`${name}-options`}
          className="collection-city-dropdown__menu"
          role="listbox"
          aria-label={t("locations.header.text_label", {
            defaultValue: "Miejsce odbioru",
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
                className="collection-city-dropdown__group"
                key={region.id}
              >
                <div className="collection-city-dropdown__parent-row">
                  <button
                    type="button"
                    className="collection-city-dropdown__expand"
                    aria-expanded={isExpanded}
                    onClick={() => toggleRegion(region.id)}
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
                  <div className="collection-city-dropdown__children">
                    {region.cities.map((city) => {
                      const isSelected =
                        value === city &&
                        (!selectedRegion || selectedRegion === region.id);

                      return (
                        <button
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          key={`${region.id}-${city}`}
                          className={`collection-city-dropdown__child${
                            isSelected ? " is-selected" : ""
                          }`}
                          onClick={() => selectCity(city, region)}
                        >
                          <span>{city}</span>

                          {isSelected && <FiCheck aria-hidden="true" />}
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
        className="collection-city-dropdown__validation-input"
      />
    </div>
  );
};

export default CollectionCityFilter;
