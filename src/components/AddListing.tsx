import imageCompression from "browser-image-compression";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { FiArrowLeft, FiImage, FiX } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "../css/AddListing.css";
import { ITEM_SIZE } from "../data/data";
import { useAddListingMutation } from "../features/api/itemApi";
import {
  useGetAllConditionsQuery,
  useGetBrandsQuery,
} from "../features/api/transApi";
import { updateRoles } from "../features/slice/userSlice";
import type { TbrandResponse } from "../types/TBrandResponse";
import type { TProductData } from "../types/TProductData";
import { CookieService, sanitizeBackendKey } from "../util/util";
import { CategoryDropdownSelect } from "./CategoryDropdownSelect";
import CityDropdownSelect from "./CityDropdownSelect";
import SearchSelect from "./SearchSelect";

type TFile = {
  file: File;
  preview: string;
};

const MAX_IMAGES = 8;
const MAX_TOTAL_IMAGE_BYTES = 5_000_000;
const TARGET_IMAGE_MB = 4_800_000 / MAX_IMAGES / (1024 * 1024);

const AddListing = () => {
  const [images, setImages] = useState<TFile[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const compressionLock = useRef(false);
  const previewUrls = useRef(new Set<string>());
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
      previewUrls.current.clear();
    };
  }, []);
  const [error, setError] = useState<string>('');
  const [personalCollectionAvailable, setPersonalCollectionAvailable] = useState(false);
  const [collectionCity, setCollectionCity] = useState("");
  const [cityValue, setCityValue] = useState("");

  /**
   * Brand query
   */
  const { data: brands = [] } = useGetBrandsQuery();

  /**
   * * navigate hook
   */

  const navigate = useNavigate();
  const disptach = useDispatch()

  /**
   * * crud hooks
   */
  const { data: conditions = [] } = useGetAllConditionsQuery();
  const [addItem] = useAddListingMutation();
  const [category, setCategory] = useState<string>("");
  const [categoryPath, setCategoryPath] = useState<string>("");

  const [formData, setFormData] = useState<TProductData>({
    id: 1,
    name: "",
    category: {
      name: "",
      path: "",
    },
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
    itemSize: "",
    minPrice:'0',
    yearMade: "",
    model: "",
    itemNumber: "",
    width: "",
    height: "",
    depth: "",
    collectionCity:''
  });

  /**
   *
   * TRANSLATION
   */
  const { t } = useTranslation();


  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Dynamic clean up based on field names

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Dynamic clean up based on field names

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTextInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Dynamic clean up based on field names

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length || compressionLock.current) return;

    const available = MAX_IMAGES - images.length;
    if (available <= 0) return;

    compressionLock.current = true;
    setIsCompressing(true);
    setError("");
    const newImages: TFile[] = [];

    try {
      for (const file of files.slice(0, available)) {
        if (!file.type.startsWith("image/")) {
          throw new Error("Wybierz prawidłowy plik zdjęcia.");
        }

        const compressed = await imageCompression(file, {
          maxSizeMB: TARGET_IMAGE_MB,
          maxWidthOrHeight: 1920,
          initialQuality: 0.85,
          useWebWorker: true,
          fileType: "image/webp",
          preserveExif: false,
        });

        // Use the actual encoder output type (some browsers fall back to PNG).
        const extensions: Record<string, string> = {
          "image/webp": "webp",
          "image/jpeg": "jpg",
          "image/png": "png",
        };
        const extension = extensions[compressed.type];
        if (!extension || compressed.size > 600_000 || compressed.size === 0) {
          throw new Error("Nie udało się zoptymalizować zdjęcia. Wybierz inne zdjęcie.");
        }
        const optimized = new File(
          [compressed],
          `${file.name.replace(/\.[^.]+$/, "")}.${extension}`,
          { type: compressed.type, lastModified: file.lastModified }
        );
        if (!mounted.current) return;
        const preview = URL.createObjectURL(optimized);
        previewUrls.current.add(preview);
        newImages.push({ file: optimized, preview });
      }

      const combined = [...images, ...newImages];
      if (combined.reduce((sum, image) => sum + image.file.size, 0) > MAX_TOTAL_IMAGE_BYTES) {
        throw new Error("Łączny rozmiar zdjęć przekracza 5 MB.");
      }
      if (mounted.current) setImages(combined);
    } catch (uploadError) {
      newImages.forEach(({ preview }) => {
        URL.revokeObjectURL(preview);
        previewUrls.current.delete(preview);
      });
      console.error("Image compression failed", uploadError);
      if (mounted.current) {
        setError("Nie udało się przetworzyć zdjęć. Spróbuj ponownie lub wybierz zdjęcia JPG, PNG lub WebP.");
      }
    } finally {
      compressionLock.current = false;
      if (mounted.current) setIsCompressing(false);
    }
  };

  /**
   * REMOVE IMAGE
   * @param index
   */
  const removeImage = (index: number) => {
    if (compressionLock.current) return;
    const image = images[index];
    if (image) {
      URL.revokeObjectURL(image.preview);
      previewUrls.current.delete(image.preview);
    }
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
    if (compressionLock.current) return;
    setError("");
    if (images.reduce((sum, image) => sum + image.file.size, 0) > MAX_TOTAL_IMAGE_BYTES) {
      setError("Łączny rozmiar zdjęć przekracza 5 MB.");
      return;
    }

    if (
      action === "PUBLISH" &&
      personalCollectionAvailable &&
      !collectionCity.trim()
    ) {
      setError("Please enter the city where buyers can collect this item.");
      return;
    }

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
    dataToSend.append("quantity",String(productData.quantity));
    dataToSend.append("categoryPath", categoryPath);
    dataToSend.append("price", productData.price);
    dataToSend.append("minPrice", productData.minPrice);
    dataToSend.append("sku", productData.sku);
    dataToSend.append("itemSize", productData.itemSize);
    dataToSend.append("productionYear", productData.yearMade);
    dataToSend.append("model", productData.model);
    dataToSend.append("itemNumber", productData.itemNumber);
    dataToSend.append("width", productData.width);
    dataToSend.append("height", productData.height);
    dataToSend.append("depth", productData.depth);
    dataToSend.append(
      "personalCollectionAvailable",
      String(personalCollectionAvailable)
    );
    dataToSend.append(
      "collectionCity",
      personalCollectionAvailable ? collectionCity.trim() : ""
    );

    images.forEach((file, index) => {
      dataToSend.append("images", file.file);
      dataToSend.append("imageSortOrder", String(index));
    });

  //  console.log(Object.fromEntries(dataToSend));

    
    try {
      const response = await addItem(dataToSend);
 
      
      if (response.data?.httpStatus === 200) {
         let roles :string[]= JSON.parse(CookieService.get("roles")as string);
          roles.push("ROLE_SELLER")
          CookieService.set('roles',JSON.stringify(roles))
                 
          disptach(updateRoles(roles))
        navigate("/account/listings/me");
      }

      if (response.error) {
        const errorResponse = response.error as {
          data?: {
            message?: any;
            error?: Record<string, unknown>;
          };
          status?: number;
          message?: string;
        };

        const messages: string[] = [];
        const responseMessage = errorResponse.data?.message as
          | string
          | Record<string, string>;

        if (typeof responseMessage === "string") {
          setError(responseMessage);
        } else {
          const errors = Object.values(responseMessage);

          if (messages.length === 0 && errorResponse.message) {
            errors.map((error) => {
              messages.push(error);
            });
          }
    
          setError(errors.join("\n"));
        }
      }
    } catch (submitError: unknown) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit the listing. Please try again.",
      );
    }
      
  };

  const handleCategoryChange = (category: string, path: string) => {
    setCategory(category);
    setCategoryPath(path);
  };

    const handleCityChange = (city:string,region:String) => {
    setCollectionCity(`${city},${region}`)
    setCityValue(city)
  };

  

  return (
    <main className="add-product">
      {/* =====================================================
                HEADER
            ====================================================== */}
      <header className="add-product__header">
        <div className="add-product__header-left">
          <Link
            to={"/account/listings/me"}
            className="add-product__back"
          >
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
            disabled={isCompressing}
            onClick={() => handleButtonClick("DRAFT")}
          >
            {t("add_listing.header.actions.save_draft")}
          </button>

          <button
            type="button"
            form="add-product-form"
            className="add-product__publish-btn"
            disabled={isCompressing}
            onClick={() => handleButtonClick("PUBLISH")}
          >
            {t("add_listing.header.actions.publish")}
          </button>
        </div>
      </header>
      <div
        className="add-product__error-container"
        role="alert"
      >
        {error && <span className="add-product__error-text">{error}</span>}
      </div>

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

                <span>{images.length}/{MAX_IMAGES}</span>
              </div>

              <div className="product-images" aria-busy={isCompressing}>
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
                      disabled={isCompressing}
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

                {images.length < MAX_IMAGES && (
                  <label className="product-image__upload">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={isCompressing}
                      onChange={handleImageUpload}
                    />

                    <FiImage />

                    <span>{t("add_listing.sections.images.add_btn")}</span>

                    <small>{isCompressing ? "Optymalizowanie zdjęć..." : "Zdjęcia są automatycznie optymalizowane."}</small>
                  </label>
                )}
              </div>
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
                    <label htmlFor="name">
                      {t("add_listing.fields.name.label")}
                    </label>

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
                </div>

                {/** CATEGORY */}

                <CategoryDropdownSelect
                  onChange={handleCategoryChange}
                  name={"category"}
                  value={category}
                />

                <div className="form-field">
                  <label htmlFor="condition">
                    {t("add_listing.fields.condition.label")}
                  </label>

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
                          {t(
                            `product_conditions.conditions.${sanitizeBackendKey(condition.name.toLowerCase())}`,
                          )}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="model">
                    {t("add_listing.fields.automotive.model")}
                  </label>

                  <input
                    id="model"
                    name="model"
                    type="text"
                    placeholder={""}
                    value={formData.model}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="oem_number">
                    {t("add_listing.fields.automotive.oem_number")}
                  </label>

                  <input
                    id="itemNumber"
                    name="itemNumber"
                    type="text"
                    placeholder={""}
                    value={formData.itemNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="year">
                    {t("add_listing.fields.automotive.year")}
                  </label>

                  <input
                    id="yearMade"
                    name="yearMade"
                    type="text"
                    placeholder={""}
                    value={formData.yearMade}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <div className="form-field form-field--full">
                    <label htmlFor="description">
                      {t("add_listing.fields.description.label")}
                    </label>

                    <textarea
                      id="description"
                      name="description"
                      rows={7}
                      placeholder={t(
                        "add_listing.fields.description.placeholder",
                      )}
                      value={formData.description}
                      onChange={handleTextInputChange}
                    />

                    <span className="form-field__hint">
                      {t("add_listing.fields.description.hint")}
                    </span>

                      <div className="description-guidance">
                        <strong>{t("add_listing.fields.description.measurement_tips.title")}</strong>
                        <ul>
                          <li>{t("add_listing.fields.description.measurement_tips.items.tip_1")}</li>
                          <li>{t("add_listing.fields.description.measurement_tips.items.tip_2")}</li>
                          <li>{t("add_listing.fields.description.measurement_tips.items.tip_3")}</li>
                          <li>{t("add_listing.fields.description.measurement_tips.items.tip_4")}</li>
                        </ul>
                      </div>
                  </div>
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
                  <label htmlFor="price">
                    {t("add_listing.fields.price.price")}
                  </label>

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
                </div>

                  <div className="form-field">
                  <label htmlFor="price">
                    {t("add_listing.fields.price.min_price")}
                  </label>

                  <div className="input-with-prefix">
                    <span>zł</span>

                    <input
                      id="minPrice"
                      name="minPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.minPrice}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="quantity">
                    {t("add_listing.fields.quantity.label")}
                  </label>

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
                  <label htmlFor="brand">
                    {t("add_listing.fields.brand.label")}
                  </label>
                  <SearchSelect
                    brands={brands as TbrandResponse[]}
                    value={formData.brand}
                    onChange={handleSelectChange}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="sku">
                    {t("add_listing.fields.sku.label")}
                  </label>

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
                </div>
              </div>

              {/* Personal collection */}
              <div className="personal-collection-section">
                <div className="form-field">
                  <label className="personal-collection-toggle" htmlFor="personalCollectionAvailable">
                    <input
                      id="personalCollectionAvailable"
                      name="personalCollectionAvailable"
                      type="checkbox"
                      checked={personalCollectionAvailable}
                      onChange={(e) => {
                        const enabled = e.target.checked;
                        setPersonalCollectionAvailable(enabled);
                        if (!enabled) setCollectionCity("");
                      }}
                    />
                    <span>{t("add_listing.fields.shipping_info.personal_collection.header")}</span>
                  </label>
                  <small>
                    {t("add_listing.fields.shipping_info.personal_collection.sub_header")}
                  </small>
                </div>
               
               {
                personalCollectionAvailable && 
                 <div className="form-field">
                 <CityDropdownSelect name={"collectionCity"} value={cityValue}    onChange={handleCityChange}/>
                 </div>
               }
              </div>

              {/** ITEM SIZE */}
              <div className="form-field">
                <label htmlFor="shippingMethod">
                  {t("add_listing.fields.cargo_sizes.label")}
                </label>

                <select
                  id="itemSize"
                  name="itemSize"
                  value={formData.itemSize}
                  onChange={handleSelectChange}
                >
                  <option
                    value=""
                    disabled
                  >
                    {t("add_listing.fields.cargo_sizes.placeholder")}
                  </option>

                  {ITEM_SIZE.map((size) => {
                    return (
                      <option
                        key={size.id}
                        value={size.value}
                      >
                        {t(
                          `add_listing.fields.cargo_sizes.item_size.${size.value}`,
                        )}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <div className="form-field">
                  <label htmlFor="width">
                    {t("add_listing.fields.dimension.width")}{' (cm)'}
                  </label>

                  <input
                    id="width"
                    name="width"
                    type="text"
                    placeholder={""}
                    value={formData.width}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="height">
                    {t("add_listing.fields.dimension.height")}{' (cm)'}
                  </label>

                  <input
                    id="height"
                    name="height"
                    type="text"
                    placeholder={""}
                    value={formData.height}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="depth">
                    {t("add_listing.fields.dimension.depth")}{' (cm)'}
                  </label>

                  <input
                    id="depth"
                    name="depth"
                    type="text"
                    placeholder={""}
                    value={formData.depth}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-field shippingInfo">
                <label htmlFor="shippingInfo">
                  {t("add_listing.fields.shipping_info.label")}
                </label>

                <textarea
                  id="shippingInfo"
                  name="shippingInfo"
                  rows={4}
                  placeholder={t(
                    "add_listing.fields.shipping_info.placeholder",
                  )}
                  value={formData.shippingInfo}
                  onChange={handleTextInputChange}
                />
              </div>
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
                    <strong>
                      {t("add_listing.sidebar.status.publish_label")}
                    </strong>
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
                    <img
                      src={images[0].preview}
                      alt="Product preview"
                    />
                  ) : (
                    <FiImage />
                  )}
                </div>

                <div className="product-preview__content">
                  <span>
                    {formData.category.name ||
                      t("add_listing.sidebar.preview.fallback_category")}
                  </span>
                  <h4>
                    {formData.name ||
                      t("add_listing.sidebar.preview.fallback_name")}
                  </h4>
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
