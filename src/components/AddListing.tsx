import { useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { FiArrowLeft, FiImage, FiX } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import "../css/AddListing.css";
import { SHIPPING_METHOD } from "../data/data";
import { useAddListingMutation } from "../features/api/itemApi";
import { useGetAllCategoriesQuery } from "../features/api/storeApi";
import {
  useAllBrandsQuery,
  useGetAllConditionsQuery,
} from "../features/api/transApi";
import type { TbrandResponse } from "../types/TBrandResponse";
import type { TProductData } from "../types/TProductData";
import { sanitizeBackendKey } from "../util/util";
import SearchSelect from "./SearchSelect";

type TFile = {
  file: File;
  preview: string;
};

const AddListing = () => {
  const [images, setImages] = useState<TFile[]>([]);

  /**
   * Brand query
   */
  const { data: brands = [] } = useAllBrandsQuery();

  /**
   * * navigate hook
   */

  const navigate = useNavigate();
  /**
   * Errors
   */
  const [brandError, setBrandError] = useState<string>("");
  const [priceError, setPriceError] = useState<string>("");
  const [categoryError, setCategoryError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [conditionError, setConditionError] = useState<string>("");
  const [imageError, setImageError] = useState<string>("");
  const [shippingError, setShippingError] = useState<string>("");
  const [shippingMethodError, setShippingMethodError] = useState<string>("");

  /**
   * * crud hooks
   */
  const { data: categories = [] } = useGetAllCategoriesQuery();
  const { data: conditions = [] } = useGetAllConditionsQuery();
  const [addItem] = useAddListingMutation();

  const [formData, setFormData] = useState<TProductData>({
    id: 1,
    name: "",
    category: "",
    description: "",
    price: "2",
    quantity: "1",
    condition: "",
    brand: "",
    sku: "",
    shippingInfo: "",
    status: "",
    images: [],
    imageSortOrder: [],
    shippingMethod: "",
  });

  /**
   * 
   * TRANSLATION
   */
  const {t} = useTranslation()

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Dynamic clean up based on field names
    if (name === "brand" && brandError) setBrandError("");
    if (name === "name" && nameError) setNameError("");

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Dynamic clean up based on field names
    if (name === "condition" && conditionError) setConditionError("");
    if (name === "category" && categoryError) setCategoryError("");

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTextInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Dynamic clean up based on field names
    if (name === "shippingInfo" && shippingError) setShippingError("");
    if (name === "description" && descriptionError) setDescriptionError("");

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    // Dynamic clean up based on field names
    setImageError("");

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages].slice(0, 8));
  };

  /**
   * REMOVE IMAGE
   * @param index
   */
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   *  FORM SUBMIT
   *
   */

  const handleButtonClick = (action: string) => {
    handleSubmit(action);
  };
  const handleSubmit = async (action: string) => {
    const productData: TProductData = {
      ...formData,
      images,
    };

    productData.status = action;

    const dataToSend = new FormData();
    dataToSend.append("name", productData.name);
    dataToSend.append("description", productData.description);
    dataToSend.append("condition", productData.condition);
    dataToSend.append("shippingInfo", productData.shippingInfo);
    dataToSend.append("brand", productData.brand);
    dataToSend.append("status", productData.status);
    dataToSend.append("category", productData.category);
    dataToSend.append("price", productData.price);
    dataToSend.append("sku", productData.sku);
    dataToSend.append("shippingMethod", productData.shippingMethod);

    images.forEach((file, index) => {
      dataToSend.append("images", file.file);
      dataToSend.append("imageSortOrder", String(index));
    });

    console.log("Product:", productData);
    try {
      const response = await addItem(dataToSend);

      if (response.data?.httpStatus === 200) {
        navigate("/account/listings/me");
      }

      if (response.error) {
        type TError = {
          price: string;
          name: string;
          description: string;
          status: string;
          category: string;
          brand: string;
          condition: string;
          shipping: string;
          shippingMethod: string;
        };

        const { data, status } = response?.error as {
          data: any;
          message: string;
          status: number;
        };
        if (status === 400) {
          setImageError(data.error ? (data.error as string) : "");
        }

        if (status === 413) {
          setImageError(data.error);
        }

        const {
          name,
          description,
          category,
          brand,
          condition,
          shipping,
          price,
          shippingMethod,
        } = data.error as TError;
        setNameError(name);
        setConditionError(condition);
        setCategoryError(category);
        setDescriptionError(description);
        setBrandError(brand);
        setShippingError(shipping);
        setPriceError(price);
        setShippingMethodError(shippingMethod);
      }
    } catch (error: any) {}
  };

  return (
 <main className="add-product">
      {/* =====================================================
                HEADER
            ====================================================== */}
      <header className="add-product__header">
        <div className="add-product__header-left">
          <Link to="/dashboard/products" className="add-product__back">
            <FiArrowLeft />
          </Link>

          <div>
            <h1>{t("add_listing.header.title_add")}</h1>
            <p>{t("add_listing.header.subtitle")}</p>
          </div>
        </div>

        <div className="add-product__header-actions">
          <button
            type="button"
            className="add-product__draft-btn"
            onClick={() => handleButtonClick("DRAFT")}
          >
            {t("add_listing.header.actions.save_draft")}
          </button>

          <button
            type="button"
            form="add-product-form"
            className="add-product__publish-btn"
            onClick={() => handleButtonClick("PUBLISH")}
          >
            {t("add_listing.header.actions.publish")}
          </button>
        </div>
      </header>

      {/* =====================================================
                FORM
            ====================================================== */}
      <form
        id="add-product-form"
        className="add-product__form"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="add-product__layout">
          {/* =================================================
                        LEFT COLUMN
                    ================================================== */}
          <div className="add-product__main">
            {/* Product Images */}
            <section className="product-section">
              <div className="product-section__header">
                <div>
                  <h2>{t("add_listing.sections.images.title")}</h2>
                  <p>{t("add_listing.sections.images.subtitle")}</p>
                </div>

                <span>{images.length}/8</span>
              </div>

              <div className="product-images">
                {images.map((image, index) => (
                  <div className="product-image" key={index}>
                    <img src={image.preview} alt={`Product ${index + 1}`} />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="product-image__remove"
                    >
                      <FiX />
                    </button>

                    {index === 0 && (
                      <span className="product-image__primary">
                        {t("add_listing.sections.images.main_label")}
                      </span>
                    )}
                  </div>
                ))}

                {images.length < 8 && (
                  <label className="product-image__upload">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />

                    <FiImage />

                    <span>{t("add_listing.sections.images.add_btn")}</span>

                    <small>{t("add_listing.sections.images.hint")}</small>
                  </label>
                )}
              </div>
              {imageError && (
                <span className="form-field__error-msg">{imageError}</span>
              )}
            </section>

            {/* Basic Information */}
            <section className="product-section">
              <div className="product-section__header">
                <div>
                  <h2>{t("add_listing.sections.info.title")}</h2>
                  <p>{t("add_listing.sections.info.subtitle")}</p>
                </div>
              </div>

              <div className="form-grid">
                <div>
                  <div className="form-field form-field--full">
                    <label htmlFor="name">{t("add_listing.fields.name.label")}</label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder={t("add_listing.fields.name.placeholder")}
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  {/* Fallback handling for downstream pricing or general shippingErrors if passed */}
                  {nameError && (
                    <span className="form-field__error-msg">{nameError}</span>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="category">{t("add_listing.fields.category.label")}</label>

                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleSelectChange}
                  >
                    <option
                      value=""
                      disabled
                    >
                 {t("add_listing.fields.category.placeholder")}
                    </option>

                    {categories?.map((category) => {
                      return (
                        <option
                          key={category.id}
                          value={category.name}
                        >
                        {t(`category_names.${sanitizeBackendKey(category.slug.toLowerCase())}`)}
                        </option>
                      );
                    })}
                  </select>
                  {/* Fallback handling for general shippingErrors if passed */}
                  {categoryError && (
                    <span className="form-field__error-msg">
                      {categoryError}
                    </span>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="condition">{t("add_listing.fields.condition.label")}</label>

                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleSelectChange}
                  >
                    <option
                      value=""
                      disabled
                    >
                 {t("add_listing.fields.condition.placeholder")}
                    </option>

                    {conditions?.map((condition) => {
                      return (
                        <option
                          key={condition.id}
                          value={condition.name}
                        >
                          {t(`product_conditions.${sanitizeBackendKey(condition.name.toLowerCase())}`)}
                        </option>
                      );
                    })}
                  </select>
                  {conditionError && (
                    <span className="form-field__error-msg">
                      {conditionError}
                    </span>
                  )}
                </div>

                <div>
                  <div className="form-field form-field--full">
                    <label htmlFor="description">{t("add_listing.fields.description.label")}</label>

                    <textarea
                      id="description"
                      name="description"
                      rows={7}
                      placeholder={t("add_listing.fields.description.placeholder")}
                      value={formData.description}
                      onChange={handleTextInputChange}
                    />

                    <span className="form-field__hint">
                    {t("add_listing.fields.description.hint")}
                    </span>
                  </div>
                  {descriptionError && (
                    <span className="form-field__error-msg">
                      {descriptionError}
                    </span>
                  )}
                </div>
              </div>
            </section>

                    {/* Pricing & Inventory */}
            <section className="product-section">
              <div className="product-section__header">
                <div>
                  <h2>{t("add_listing.sections.pricing.title")}</h2>
                  <p>{t("add_listing.sections.pricing.subtitle")}</p>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="price">{t("add_listing.fields.price.label")}</label>

                  <div className="input-with-prefix">
                    <span>zł</span>

                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  {priceError && (
                    <span className="form-field__error-msg">{priceError}</span>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="quantity">{t("add_listing.fields.quantity.label")}</label>

                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    placeholder="1"
                    value={formData.quantity}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="brand">{t("add_listing.fields.brand.label")}</label>
                  <SearchSelect 
                    brands={brands as TbrandResponse[]} 
                    value={formData.brand} 
                    onChange={handleSelectChange}  
                  />
                  {brandError && (
                    <span className="form-field__error-msg">{brandError}</span>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="sku">{t("add_listing.fields.sku.label")}</label>

                  <input
                    id="sku"
                    name="sku"
                    type="text"
                    placeholder={t("add_listing.fields.sku.placeholder")}
                    value={formData.sku}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </section>

            {/* Shipping */}
            <section className="product-section">
              <div className="product-section__header">
                <div>
                  <h2>{t("add_listing.sections.shipping.title")}</h2>
                  <p>{t("add_listing.sections.shipping.subtitle")}</p>
                </div>
              </div>
              
              <div className="form-field">
                <label htmlFor="shippingMethod">{t("add_listing.fields.shipping_method.label")}</label>

                <select
                  id="shippingMethod"
                  name="shippingMethod"
                  value={formData.shippingMethod}
                  onChange={handleSelectChange}
                >
                  <option value="" disabled>
                    {t("add_listing.fields.shipping_method.placeholder")}
                  </option>

                  {SHIPPING_METHOD.map((method) => {
                    return (
                      <option key={method.id} value={method.value}>
                        {method.method}
                      </option>
                    );
                  })}
                </select>
                {shippingMethodError && (
                  <span className="form-field__error-msg">
                    {shippingMethodError}
                  </span>
                )}
              </div>

              <div className="form-field shippingInfo">
                <label htmlFor="shippingInfo">{t("add_listing.fields.shipping_info.label")}</label>

                <textarea
                  id="shippingInfo"
                  name="shippingInfo"
                  rows={4}
                  placeholder={t("add_listing.fields.shipping_info.placeholder")}
                  value={formData.shippingInfo}
                  onChange={handleTextInputChange}
                />
              </div>
              {shippingError && (
                <span className="form-field__error-msg">{shippingError}</span>
              )}
            </section>
          </div>

          {/* =================================================
                        RIGHT SIDEBAR
                    ================================================== */}
          <aside className="add-product__sidebar">
            {/* Publish */}
            <section className="product-card">
              <div className="product-card__header">
                <h3>{t("add_listing.sidebar.status.title")}</h3>
              </div>

              <div className="status-option">
                <div className="status-option__icon">
                  <span className="primary" />
                </div>

                <div className="status-option__message">
                  <div>
                    <strong>{t("add_listing.sidebar.status.publish_label")}</strong>
                    <p>{t("add_listing.sidebar.status.publish_desc")}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Tips */}
            <section className="product-card">
              <div className="product-card__header">
                <h3>{t("add_listing.sidebar.tips.title")}</h3>
              </div>

              <ul className="product-tips">
                <li>{t("add_listing.sidebar.tips.tip1")}</li>
                <li>{t("add_listing.sidebar.tips.tip2")}</li>
                <li>{t("add_listing.sidebar.tips.tip3")}</li>
                <li>{t("add_listing.sidebar.tips.tip4")}</li>
              </ul>
            </section>

            {/* Preview */}
            <section className="product-card product-card--preview">
              <div className="product-card__header">
                <h3>{t("add_listing.sidebar.preview.title")}</h3>
              </div>

              <div className="product-preview">
                <div className="product-preview__image">
                  {images.length > 0 ? (
                    <img src={images[0].preview} alt="Product preview" />
                  ) : (
                    <FiImage />
                  )}
                </div>

                <div className="product-preview__content">
                  <span>{formData.category || t("add_listing.sidebar.preview.fallback_category")}</span>
                  <h4>{formData.name || t("add_listing.sidebar.preview.fallback_name")}</h4>
                  <strong>{formData.price || "0.00"} zł</strong>
                </div>
              </div>
            </section>
          </aside>

        </div>
      </form>
    </main>
  );
};

export default AddListing;
