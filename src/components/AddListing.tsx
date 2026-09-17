import { useState, type ChangeEvent } from "react";
import { FiArrowLeft, FiImage, FiX } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { SHIPPING_METHOD } from "../data/data";
import { useAddListingMutation } from "../features/api/itemApi";
import { useGetAllCategoriesQuery } from "../features/api/storeApi";
import {
  useAllBrandsQuery,
  useGetAllConditionsQuery,
} from "../features/api/transApi";
import type { TbrandResponse } from "../types/TBrandResponse";
import type { TProductData } from "../types/TProductData";
import "./../css/AddListing.css";
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
          <Link
            to="/dashboard/products"
            className="add-product__back"
          >
            <FiArrowLeft />
          </Link>

          <div>
            <h1>Add product</h1>
            <p>Create a product and make it available to buyers.</p>
          </div>
        </div>

        <div className="add-product__header-actions">
          <button
            type="button"
            className="add-product__draft-btn"
            onClick={() => handleButtonClick("DRAFT")}
          >
            Save draft
          </button>

          <button
            type="button"
            form="add-product-form"
            className="add-product__publish-btn"
            onClick={() => handleButtonClick("PUBLISH")}
          >
            Publish product
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
                  <h2>Product images</h2>
                  <p>Add clear images of your product.</p>
                </div>

                <span>{images.length}/8</span>
              </div>

              <div className="product-images">
                {images.map((image, index) => (
                  <div
                    className="product-image"
                    key={index}
                  >
                    <img
                      src={image.preview}
                      alt={`Product ${index + 1}`}
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="product-image__remove"
                    >
                      <FiX />
                    </button>

                    {index === 0 && (
                      <span className="product-image__primary">Main</span>
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

                    <span>Add images</span>

                    <small>JPG, PNG or WEBP</small>
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
                  <h2>Product information</h2>
                  <p>Give buyers the important details.</p>
                </div>
              </div>

              <div className="form-grid">
                <div>
                  <div className="form-field form-field--full">
                    <label htmlFor="name">Product name</label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="e.g. Vintage leather jacket"
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
                  <label htmlFor="category">Category</label>

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
                      Select category
                    </option>

                    {categories?.map((category) => {
                      return (
                        <option
                          key={category.id}
                          value={category.name}
                        >
                          {category.name}
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
                  <label htmlFor="condition">Condition</label>

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
                      Select condition
                    </option>

                    {conditions?.map((condition) => {
                      return (
                        <option
                          key={condition.id}
                          value={condition.name}
                        >
                          {condition.name}
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
                    <label htmlFor="description">Description</label>

                    <textarea
                      id="description"
                      name="description"
                      rows={7}
                      placeholder="Describe the product, its condition, features and anything buyers should know..."
                      value={formData.description}
                      onChange={handleTextInputChange}
                    />

                    <span className="form-field__hint">
                      Be clear and honest about the product.
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
                  <h2>Pricing & inventory</h2>
                  <p>Set your price and available quantity.</p>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="price">Price</label>

                  <div className="input-with-prefix">
                    <span>€</span>

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
                  <label htmlFor="quantity">Quantity</label>

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

                <div >
                   <label htmlFor="brand">Brand</label>
                  <SearchSelect brands={brands as TbrandResponse[]} value={formData.brand} onChange={handleSelectChange}  />
                  {brandError && (
                    <span className="form-field__error-msg">{brandError}</span>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="sku">SKU</label>

                  <input
                    id="sku"
                    name="sku"
                    type="text"
                    placeholder="Optional"
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
                  <h2>Shipping</h2>
                  <p>
                    Within how many days can this product be delivered to the buyer?
                  </p>
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="shippingMethod">Shipping method</label>

                <select
                  id="shippingMethod"
                  name="shippingMethod"
                  value={formData.shippingMethod}
                  onChange={handleSelectChange}
                >
                  <option
                    value=""
                    disabled
                  >
                    Select shipping method
                  </option>

                  {SHIPPING_METHOD.map((method) => {
                    return (
                      <option
                        key={method.id}
                        value={method.value}
                      >
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
                <label htmlFor="shippingInfo">Shipping information</label>

                <textarea
                  id="shippingInfo"
                  name="shippingInfo"
                  rows={4}
                  placeholder="e.g. Ships within 2–3 business days. Buyer pays shipping."
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
                <h3>Product status</h3>
              </div>

              <div className="status-option">
                <div className="status-option__icon">
                  <span className="primary" />
                </div>

                <div className="status-option__message">
                  <div>
                    <strong>Publish</strong>

                    <p>Buyers can see and purchase this product.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Tips */}

            <section className="product-card">
              <div className="product-card__header">
                <h3>Product tips</h3>
              </div>

              <ul className="product-tips">
                <li>Use bright, clear product images.</li>

                <li>Write an accurate description.</li>

                <li>Mention any defects or signs of use.</li>

                <li>Use a competitive price.</li>
              </ul>
            </section>

            {/* Preview */}

            <section className="product-card product-card--preview">
              <div className="product-card__header">
                <h3>Preview</h3>
              </div>

              <div className="product-preview">
                <div className="product-preview__image">
                  {images.length > 0 ? (
                    <img
                      src={images[0].preview}
                      alt="Product preview"
                    />
                  ) : (
                    <FiImage />
                  )}
                </div>

                <div className="product-preview__content">
                  <span>{formData.category || "Category"}</span>

                  <h4>{formData.name || "Your product name"}</h4>

                  <strong>€{formData.price || "0.00"}</strong>
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
