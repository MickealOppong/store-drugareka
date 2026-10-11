import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCheck, FiChevronDown, FiChevronRight, FiLayers } from "react-icons/fi";
import "../css/CategoryDropdownSelect.css";
import { useGetCategoryTreeQuery } from "../features/api/storeApi";
import type { TCategoryTreeDto, TSubCategory } from "../types/TCategoryTreeDto";
import { sanitizeCategoryKey } from "../util/util";

type CategoryDropdownSelectProps = {
  name: string;
  value: string;
  onChange: (category: string, path: string) => void;
};

type CategorySelection = {
  name: string;
  path: string;
  label: string;
};

export const CategoryDropdownSelect = ({
  name,
  value,
  onChange,
}: CategoryDropdownSelectProps) => {

  
  const { t } = useTranslation();
  const { data: catalogTree = [], isLoading, error } = useGetCategoryTreeQuery();

  const [isOpen, setIsOpen] = useState(false);
  const [expandedParentId, setExpandedParentId] = useState<string | number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Localization utilities
  const getParentLabel = (parent: TCategoryTreeDto) =>
    t(`categories.${sanitizeCategoryKey(parent.name)}.name`, {
      defaultValue: parent.name,
    });

  const getChildLabel = (parent: TCategoryTreeDto, child: TSubCategory) =>
    t(
      `categories.${sanitizeCategoryKey(parent.name)}.subcategories.${sanitizeCategoryKey(child.name)}`,
      { defaultValue: child.name },
    );

  // Resolves the text label displayed on the closed input bar button
  const selectedCategory = useMemo<CategorySelection | null>(() => {
    for (const parent of catalogTree) {
      if (value === parent.name || value === parent.path) {
        return {
          name: parent.name,
          path: parent.path,
          label: getParentLabel(parent),
        };
      }

      const child = parent.subCategories?.find(
        (item) => value === item.name || value === item.path,
      );

      if (child) {
        return {
          name: child.name,
          path: child.path,
          label: `${getParentLabel(parent)} / ${getChildLabel(parent, child)}`,
        };
      }
    }
    return null;
  }, [catalogTree, value, t]);

  // Click-Outside Listener to drop the view safely during loose blur interactions
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const selectCategory = (category: CategorySelection) => {
    onChange(category.name, category.path);
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className="category-dropdown__status">
        {t("catalog.feed.loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-dropdown__status category-dropdown__status--error">
        {t("catalog.feed.error")}
      </div>
    );
  }

  return (
    <div className="category-dropdown" ref={dropdownRef}>
      <label htmlFor={`${name}-trigger`} className="category-dropdown__label">
        <FiLayers aria-hidden="true" />
        {t("categories.header.text_label")}
      </label>

      {/* Main input target container button hook */}
      <button
        id={`${name}-trigger`}
        type="button"
        className={`category-dropdown__trigger${isOpen ? " is-open" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${name}-options`}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className={selectedCategory ? "" : "category-dropdown__placeholder"}>
          {selectedCategory?.label ??
            t("categories.header.placeholder_text", {
              defaultValue: "-- Select a Category --",
            })}
        </span>
        <FiChevronDown className="category-dropdown__trigger-icon" aria-hidden="true" />
      </button>

      {/* Accordion Menu Selection Drawer List */}
      {isOpen && (
        <div
          id={`${name}-options`}
          className="category-dropdown__menu"
          role="listbox"
          aria-label={t("categories.header.text_label")}
        >
          {catalogTree.map((parent: TCategoryTreeDto) => {
            const hasChildren = Boolean(parent.subCategories?.length);
            const isExpanded = expandedParentId === parent.id;
            const isParentSelected = value === parent.name || value === parent.path;

            return (
              <div className="category-dropdown__group" key={parent.id}>
                <div className="category-dropdown__parent-row">
                  {/* Left-Side: Expand Accordion Trigger Button */}
                  <button
                    type="button"
                    className="category-dropdown__expand"
                    aria-expanded={hasChildren ? isExpanded : undefined}
                    onClick={() => {
                      if (hasChildren) {
                        setExpandedParentId((current) =>
                          current === parent.id ? null : parent.id
                        );
                      } else {
                        selectCategory({
                          name: parent.name,
                          path: parent.path,
                          label: getParentLabel(parent),
                        });
                      }
                    }}
                  >
                    {hasChildren ? (
                      isExpanded ? (
                        <FiChevronDown aria-hidden="true" />
                      ) : (
                        <FiChevronRight aria-hidden="true" />
                      )
                    ) : (
                      <span className="category-dropdown__tree-spacer" />
                    )}
                    <span>{getParentLabel(parent)}</span>
                  </button>

                  {/* Right-Side: Direct Choice Commit Action Target Button */}
                  <button
                    type="button"
                    className={`category-dropdown__select-parent${isParentSelected ? " is-selected" : ""}`}
                    aria-label={`${t("categories.header.select_parent", {
                      defaultValue: "Select parent category",
                    })}: ${getParentLabel(parent)}`}
                    onClick={() =>
                      selectCategory({
                        name: parent.name,
                        path: parent.path,
                        label: getParentLabel(parent),
                      })
                    }
                  >
                    {isParentSelected ? (
                      <FiCheck aria-hidden="true" />
                    ) : (
                      t("categories.header.select_parent_short", {
                        defaultValue: "Select",
                      })
                    )}
                  </button>
                </div>

                {/* Subcategory Nesting Layer Block Drawer */}
                {hasChildren && isExpanded && (
                  <div className="category-dropdown__children">
                    {parent.subCategories?.map((child: TSubCategory) => {
                      const isChildSelected = value === child.name || value === child.path;

                      return (
                        <button
                          type="button"
                          role="option"
                          aria-selected={isChildSelected}
                          key={child.id}
                          className={`category-dropdown__child${isChildSelected ? " is-selected" : ""}`}
                          onClick={() =>
                            selectCategory({
                              name: child.name,
                              path: child.path,
                              label: `${getParentLabel(parent)} / ${getChildLabel(parent, child)}`,
                            })
                          }
                        >
                          <span>{getChildLabel(parent, child)}</span>
                          {isChildSelected && <FiCheck aria-hidden="true" />}
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

      {/* Hidden input field ensures standard HTML5 native form validation continues to work seamlessly */}
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

export default CategoryDropdownSelect;
