import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";
import { useNavigate, useParams, useRevalidator } from "react-router";

import "../css/View.css";
import {
  useEditCategoryMutation,
  useLazyAllParentcategoriesQuery,
  useLazyGetCategoryQuery,
} from "../features/api/transApi";
import type { TCategoryReponse } from "../types/TCategoryResponse";
import type { TFile } from "./EditListing";

const EditCategory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();

  const [editCategory, { isLoading: saving, isSuccess: success }] =
    useEditCategoryMutation();
  const [getCategory] = useLazyGetCategoryQuery();
  const [fetchParentCategories] = useLazyAllParentcategoriesQuery();

  const [active, setActive] = useState(false);
  const [name, setName] = useState("");
  const [parent, setParent] = useState("");
  const [image, setImage] = useState<TFile | null>(null);
  const [sortOrder, setSortOrder] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState("");

  const loadParentCategories = useCallback(async () => {
    try {
      const response = await fetchParentCategories().unwrap();
      const data = response
      setCategories(Array.isArray(data) ? (data as string[]) : []);
    } catch (err) {
      console.error(err);
      setError("Server error when loading parent categories.");
    }
  }, [fetchParentCategories]);

  const loadCategory = useCallback(async () => {
    if (!id) {
      setError("Invalid category ID.");
      return;
    }

    try {
      const response = await getCategory(Number(id)).unwrap();
      const category = response as TCategoryReponse;

      setName(category.name ?? "");
      setParent(category.parent ?? "");
      setSortOrder(category.sortOrder ?? 0);
      setActive(Boolean(category.active));

      if (!category.image) {
        setImage(null);
        return;
      }

      console.log(category);
      
      const imageResponse = await fetch(category.image);

      if (!imageResponse.ok) {
        throw new Error("Failed to load category image.");
      }

      const blob = await imageResponse.blob();
      const fileName =
        new URL(category.image).pathname.split("/").pop() || "image.jpg";

      setImage({
        file: new File([blob], fileName, {
          type: blob.type || "image/jpeg",
        }),
        preview: category.image,
      });
    } catch (err) {
      console.error(err);
      setError("Server error when loading category.");
    }
  }, [getCategory, id]);

  useEffect(() => {
    void loadParentCategories();
    void loadCategory();
  }, [loadParentCategories, loadCategory]);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (image?.preview?.startsWith("blob:")) {
      URL.revokeObjectURL(image.preview);
    }

    setImage({
      file,
      preview: URL.createObjectURL(file),
    });

    event.target.value = "";
  };

  const handleRemoveImage = () => {
    if (image?.preview?.startsWith("blob:")) {
      URL.revokeObjectURL(image.preview);
    }

    setImage(null);
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id) {
      setError("Invalid category ID.");
      return;
    }

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    setError("");

    const formData = new FormData();

    formData.append("id", id);
    formData.append("name", name.trim());
    formData.append("parent", parent);
    formData.append("slug", name.trim());
    formData.append("active", active ? "1" : "0");
    formData.append("sortOrder", String(sortOrder));

    if (image?.file) {
      formData.append("image", image.file);
    }

    
    try {
      const response = await editCategory(formData);

      if ("error" in response && response.error) {
        const errorResponse = response.error as {
          data?: {
            error?: { name?: string };
            message?: string;
          };
          message?: string;
        };

        setError(
          errorResponse.data?.error?.name ||
            errorResponse.data?.message ||
            errorResponse.message ||
            "Failed to update category.",
        );
        return;
      }

      if ("data" in response && response.data) {
        const data = response.data as {
          httpStatus?: number;
          message?: string;
        };

        if (data.httpStatus === 400 || data.httpStatus === 403) {
          setError(data.message || "Unable to update category.");
          return;
        }

        if (data.httpStatus === 200 || data.httpStatus === undefined) {
          revalidate();
          navigate("/account/admin/categories");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Critical connection error.");
    }
  };

  return (
    <main className="add-category">
      <header className="add-category__header">
        <div>
          <span className="add-category__eyebrow">
            Catalog Management
          </span>

          <h1 className="add-category__title">Edit Category</h1>

          <p className="add-category__description">
            Edit predefined category for the products.
          </p>
        </div>
      </header>

      <div className="add-category__content">
        <section className="add-category__form-card">
          <form className="add-category__form" onSubmit={handleFormSubmit}>
            <div className="add-category__field">
              <label htmlFor="category-name" className="add-category__label">
                Category name
              </label>

              <input
                id="category-name"
                name="name"
                type="text"
                placeholder="e.g. Laptops & Spare Parts"
                className="add-category__input"
                maxLength={100}
                disabled={saving}
                value={name}
                onChange={(event) => setName(event.target.value)}
              />

              <span className="add-category__hint">
                Use a clear name that buyers will easily understand.
              </span>
            </div>

            <div className="add-category__field">
              <label htmlFor="category-image" className="add-category__label">
                Category image
              </label>

              <div className="add-category__upload">
                <input
                  id="category-image"
                  name="image"
                  type="file"
                  accept="image/*"
                  className="add-category__file-input"
                  disabled={saving}
                  onChange={handleImageUpload}
                />

                {image?.preview ? (
                  <div className="add-category__preview">
                    <img
                      src={image.preview}
                      alt={name || "Category preview"}
                      className="add-category__preview-image"
                    />

                    <label
                      htmlFor="category-image"
                      className="add-category__preview-overlay"
                    >
                      <FiUploadCloud />
                      <span>Change image</span>
                    </label>

                    <button
                      type="button"
                      className="add-category__remove"
                      onClick={handleRemoveImage}
                      disabled={saving}
                      aria-label="Remove category image"
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="category-image"
                    className="add-category__dropzone"
                  >
                    <FiUploadCloud className="add-category__upload-icon" />

                    <span className="add-category__upload-title">
                      Upload category image
                    </span>

                    <span className="add-category__upload-text">
                      Click to choose an image
                    </span>

                    <span className="add-category__hint">
                      PNG, JPG or WEBP formats accepted
                    </span>
                  </label>
                )}
              </div>

              <span className="add-category__hint">
                Choose an image that clearly describes this category.
              </span>
            </div>

            <div className="add-category__field">
              <label htmlFor="category-parent" className="add-category__label">
                Parent category
              </label>

              <select
                id="category-parent"
                name="parent"
                className="add-category__select"
                disabled={saving}
                value={parent}
                onChange={(event) => setParent(event.target.value)}
              >
                <option value="">No parent — Root category</option>

                {categories.map((category) => (
                  <option value={category} key={category}>
                    {category}
                  </option>
                ))}
              </select>

              <span className="add-category__hint">
                Leave empty to create a top-level category.
              </span>
            </div>

            <div className="add-category__field">
              <label
                htmlFor="category-sort-order"
                className="add-category__label"
              >
                Display order
              </label>

              <div className="add-category__numeric-wrapper">
                           <input
                  id="category-sort-order"
                  name="sortOrder"
                  type="number"
                  min={0}
                  className="add-category__input add-category__input--numeric"
                  disabled={saving}
                  value={sortOrder}
                  onChange={(event) =>
                    setSortOrder(
                      Number.parseInt(event.target.value, 10) || 0,
                    )
                  }
                />
              </div>

              <span className="add-category__hint">
                Lower numbers appear first.
              </span>
            </div>

            <label className="add-category__checkbox">
              <input
                type="checkbox"
                name="isActive"
                checked={active}
                disabled={saving}
                onChange={(event) => setActive(event.target.checked)}
              />

              <span>Category is active</span>
            </label>

            {error && (
              <div className="add-category__message add-category__message--error">
                {error}
              </div>
            )}

            {success && !error && (
              <div className="add-category__message add-category__message--success">
                Category updated successfully.
              </div>
            )}

            <div className="add-category__actions">
              <button
                type="button"
                className="add-category__cancel"
                disabled={saving}
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="add-category__submit"
                disabled={saving}
              >
                {saving ? "Updating..." : "Update category"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default EditCategory;
