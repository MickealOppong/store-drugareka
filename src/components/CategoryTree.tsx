
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FiChevronDown,
  FiChevronRight
} from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import '../css/CategoryTree.css';
import { CATEGORY_HEADERS } from "../data/data";
import { useGetCategoryTreeQuery } from "../features/api/storeApi";
import type {
  TCategoryTreeDto,
  TSubCategory,
} from "../types/TCategoryTreeDto";
import { sanitizeCategoryKey } from "../util/util";

const CategoryTree = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    data: categories = [],
    isLoading,
    error,
  } = useGetCategoryTreeQuery();

  const selectedCategory = searchParams.get("category") || "all";

  const [expandedCategory, setExpandedCategory] = useState<number | null>(
    null,
  );

  // Keep the appropriate parent expanded when the URL changes.
  useEffect(() => {
    if (!categories.length || selectedCategory === "all") {
      setExpandedCategory(null);
      return;
    }

    const activeParent = categories.find(
      (parent: TCategoryTreeDto) =>
        parent.slug === selectedCategory ||
        parent.subCategories?.some(
          (child: TSubCategory) => child.slug === selectedCategory,
        ),
    );

    setExpandedCategory(activeParent?.id ?? null);
  }, [categories, selectedCategory]);

  // Parent name click: select the parent category and open the shop.
  const handleParentSelect = (parent: TCategoryTreeDto) => {
    navigate(`/shop/categories?category=${encodeURIComponent(parent.slug)}_${parent.id}`);
  };

  // Chevron click: expand or collapse children without navigating.
  const handleToggle = (parentId: number) => {
    setExpandedCategory((current) =>
      current === parentId ? null : parentId,
    );
  };

  // Child click: select the child category and open the shop.
  const handleChildSelect = (child: TSubCategory) => {
    navigate(`/shop/categories?category=${encodeURIComponent(child.slug)}_${child.id}`);
  };

  const isSelected = (slug: string) => selectedCategory === slug;

  if (isLoading) {
    return (
      <div className="category-tree__message" role="status">
        {t("catalog.feed.loading", {
          defaultValue: "Loading categories...",
        })}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="category-tree__message category-tree__message--error"
        role="alert"
      >
        {t("catalog.feed.error", {
          defaultValue: "Unable to load categories.",
        })}
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="category-tree__message">
        {t("catalog.feed.no_categories", {
          defaultValue: "No categories available.",
        })}
      </div>
    );
  }

  return (
    <nav
      className="category-tree"
      aria-label={t("navigation.menu.categories", {
        defaultValue: "Categories",
      })}
    >
      <ul className="category-tree__list">
        {categories.map((parent: TCategoryTreeDto) => {
          const hasChildren = Boolean(parent.subCategories?.length);
          const isExpanded = expandedCategory === parent.id;
          const isParentSelected = isSelected(parent.slug);

          const parentLabel = t(
            `categories.${sanitizeCategoryKey(parent.name)}.name`,
            { defaultValue: parent.name },
          );
            {/** CATEGORY ICONS */}
            const Icon = CATEGORY_HEADERS.find(
              (item) => item.key === sanitizeCategoryKey(parent.name),
            )?.icon;

             const IconColor= CATEGORY_HEADERS.find(
              (item) => item.key === sanitizeCategoryKey(parent.name),
            )?.color;

          return (
            <li
              key={parent.id}
              className={[
                "category-tree__node",
                isExpanded ? "category-tree__node--expanded" : "",
                isParentSelected ? "category-tree__node--selected" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="category-tree__parent-row">
                <button
                  type="button"
                  className={[
                    "category-tree__parent-link",
                    isParentSelected ? "is-active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => handleParentSelect(parent)}
                  aria-current={isParentSelected ? "page" : undefined}
                >
                <span className="catalog-browser__parent-label">
                    {Icon && <Icon style={{color:IconColor}}/>}
            
                  </span>
                        
                  <span className="category-tree__label">
                    {parentLabel}
                  </span>
                </button>

                {hasChildren && (
                  <button
                    type="button"
                    className="category-tree__toggle"
                    onClick={() => handleToggle(parent.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`category-children-${parent.id}`}
                    aria-label={t(
                      isExpanded
                        ? "navigation.categories.collapse"
                        : "navigation.categories.expand",
                      {
                        category: parentLabel,
                        defaultValue: `${isExpanded ? "Collapse" : "Expand"} ${parentLabel}`,
                      },
                    )}
                  >
                    {isExpanded ? (
                      <FiChevronDown aria-hidden="true" />
                    ) : (
                      <FiChevronRight aria-hidden="true" />
                    )}
                  </button>
                )}
              </div>

              {hasChildren && isExpanded && (
                <ul
                  className="category-tree__children"
                  id={`category-children-${parent.id}`}
                >
                  {parent.subCategories.map((child: TSubCategory) => {
                    const childSelected = isSelected(child.slug);

                    const childLabel = t(
                      `categories.${sanitizeCategoryKey(parent.name)}.subcategories.${sanitizeCategoryKey(child.name)}`,
                      { defaultValue: child.name },
                    );

                    return (
                      <li
                        key={child.id}
                        className="category-tree__child-node"
                      >
                        <button
                          type="button"
                          className={[
                            "category-tree__child-link",
                            childSelected ? "is-active" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          onClick={() => handleChildSelect(child)}
                          aria-current={childSelected ? "page" : undefined}
                        >
                          <span className="category-tree__child-marker" />
                          <span className="category-tree__label">
                            {childLabel}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default CategoryTree;