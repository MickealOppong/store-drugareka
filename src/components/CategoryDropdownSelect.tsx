import React, { type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { FiLayers } from "react-icons/fi";
import "../css/CategoryDropdownSelect.css"; //
import { useGetCategoryTreeQuery } from "../features/api/storeApi";
import type { TCategoryTreeDto, TSubCategory } from "../types/TCategoryTreeDto";
import { sanitizeCategoryKey } from "../util/util";

export const CategoryDropdownSelect = ({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string;
  onChange: (category: string,path:string) => void;
}) => {
  const { t } = useTranslation();
  // RTK Query database hook execution loop
  const {
    data: catalogTree = [],
    isLoading,
    error,
  } = useGetCategoryTreeQuery();




const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
  const selectedCategoryName = e.target.value;

  if (!selectedCategoryName) return;

  let matchedParent: TCategoryTreeDto | null = null;
  let matchedChild: TSubCategory | null = null;

  for (const parent of catalogTree) {
    // Check if the selected text matches the main category name directly
    if (parent.name === selectedCategoryName) {
      matchedParent = parent;
      break;
    }

    // Check if the selected text matches a subcategory name
    const childMatch = parent.subCategories?.find(
      (child) => child.name === selectedCategoryName
    );
    
    if (childMatch) {
      matchedParent = parent;
      matchedChild = childMatch;
      break;
    }
  }

  if (matchedParent) {
    if (!matchedChild) {
      // It has no child, meaning the user selected the main top-level parent category
      onChange(matchedParent.name,matchedParent.path);
    } else {
      // It is a subcategory child leaf. Pass the child name followed by its parent slug/name
      onChange(String(matchedChild.name), matchedChild.path);
    }
  }
};

  

  if (isLoading)
    return (
      <div className="category-dropdown__status">
        {t("catalog.feed.loading")}
      </div>
    );
  if (error)
    return (
      <div className="category-dropdown__status category-dropdown__status--error">
        {t("catalog.feed.error")}
      </div>
    );

  return (
    <div className="category-dropdown">
      <label
        htmlFor={name}
        className="category-dropdown__label"
      >
        <FiLayers /> {t("categories.header.text_label")}
      </label>

      <div className="category-dropdown__wrapper">
        <select
          id={name}
          name={name}
          value={value}
          onChange={handleSelectChange}
          className="category-dropdown__select"
          required
        >
          {/* Default blank option line prompt */}
          <option
            value=""
            disabled
            hidden
          >
            {t("categories.header.placeholder_text", {
              defaultValue: "-- Select a Category --",
            })}
          </option>

          {/* Loop through main categories as bold options / optgroups */}
          {catalogTree.map((mainCat: TCategoryTreeDto) => {
            const localizedMainName = t(
              `categories.${sanitizeCategoryKey(mainCat.name)}.name`,
            );

            return (
              <React.Fragment key={mainCat.id}>
                {/* Parent option itself is fully selectable if a child is not picked */}
                <option
                  value={mainCat.name}
                  className="category-dropdown__option--parent"
                >
                  {localizedMainName.toUpperCase()}
                </option>

                {/* Render indented child nodes right beneath the active parent */}
                {mainCat.subCategories?.map((subCat: TSubCategory) => {
                  const localizedSubName = t(
                    `categories.${sanitizeCategoryKey(mainCat.name)}.subcategories.${sanitizeCategoryKey(subCat.name)}`,
                  );

                  return (
                    <option
                      key={subCat.id}
                      value={subCat.name}
                      className="category-dropdown__option--child"
                    >
                      &nbsp;&nbsp;&nbsp;&nbsp;↳ {localizedSubName}
                    </option>
                  );
                })}
              </React.Fragment>
            );
          })}
        </select>
      </div>
    </div>
  );
};

export default CategoryDropdownSelect;
