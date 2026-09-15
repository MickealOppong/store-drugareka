import { useEffect, useState } from "react";
import {
    RiFootprintLine,
    RiHandbagLine,
    RiMacbookLine,
    RiTShirtLine,
} from "react-icons/ri"; // Premium editorial line icons

interface SubCategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: React.ReactNode;
  subcategories: SubCategory[];
}

// Fixed marketplace structural dictionary data maps
const FORM_CATEGORIES: Category[] = [
  {
    id: "cat_1",
    name: "Clothes & Apparel",
    slug: "clothes",
    icon: <RiTShirtLine />,
    subcategories: [
      { id: "sub_1_1", name: "Tops & Shirts" },
      { id: "sub_1_2", name: "Outerwear & Coats" },
      { id: "sub_1_3", name: "Denim & Trousers" },
      { id: "sub_1_4", name: "Knitwear & Sweaters" },
    ],
  },
  {
    id: "cat_2",
    name: "Shoes & Footwear",
    slug: "shoes",
    icon: <RiFootprintLine />,
    subcategories: [
      { id: "sub_2_1", name: "Sneakers" },
      { id: "sub_2_2", name: "Boots" },
      { id: "sub_2_3", name: "Loafers & Dress Shoes" },
    ],
  },
  {
    id: "cat_3",
    name: "Accessories",
    slug: "accessories",
    icon: <RiHandbagLine />,
    subcategories: [
      { id: "sub_3_1", name: "Bags & Backpacks" },
      { id: "sub_3_2", name: "Jewelry & Rings" },
      { id: "sub_3_3", name: "Eyewear & Sunglasses" },
    ],
  },
  {
    id: "cat_4",
    name: "Electronics & Tech",
    slug: "electronics",
    icon: <RiMacbookLine />,
    subcategories: [
      { id: "sub_4_1", name: "Audio & Headphones" },
      { id: "sub_4_2", name: "Cameras & Optics" },
      { id: "sub_4_3", name: "Keyboards & Desk Setup" },
    ],
  },
];

interface CategorySelectorProps {
  selectedCategory: string;
  selectedSubCategory: string;
  onChange: (categorySlug: string, subCategoryName: string) => void;
  hasError?: boolean;
}

const CategorySelector = ({
  selectedCategory,
  selectedSubCategory,
  onChange,
  hasError = false,
}: CategorySelectorProps) => {
  // Automatically match parent values or default to first category option on mount
  const [activeTab, setActiveTab] = useState<Category>(
    FORM_CATEGORIES.find((c) => c.slug === selectedCategory) ||
      FORM_CATEGORIES[0],
  );

  // Sync state if parent forces a value update (e.g. form resets)
  useEffect(() => {
    const matched = FORM_CATEGORIES.find((c) => c.slug === selectedCategory);
    if (matched) setActiveTab(matched);
  }, [selectedCategory]);

  return <div className="category-input">
    
  </div>;
};

export default CategorySelector;
