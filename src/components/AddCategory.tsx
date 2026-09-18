import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useRevalidator } from "react-router";
import '../css/View.css';
import {
  useLazyAllParentcategoriesQuery,
  useNewCategoryMutation,
} from "../features/api/transApi";

const AddCategory = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory] = useNewCategoryMutation();
  const [getParentCategories] = useLazyAllParentcategoriesQuery({
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const { revalidate } = useRevalidator();
  const navigate = useNavigate();

  //Form data inputs
  const [active, setActive] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [parent, setParent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [sortOrder, setSortOrder] = useState<number>(0);

  const [loading, ] = useState(false);
  const [saving,] = useState(false);
  const [error, setError] = useState("");
  const [success,] = useState("");

  async function parentCategories() {
    const response = await getParentCategories();
    setCategories(() => (response.data as string[]) || []);
  }

  useEffect(() => {
    parentCategories();
  }, []);

  const handleFormSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    const dataToSend = new FormData();

    dataToSend.append("name", name);
    dataToSend.append("parent", parent);
    dataToSend.append("sortOrder", String(sortOrder));
    dataToSend.append("active", active ? "1" : "0");
    if (image) {
      dataToSend.append("image", image);
    }

    const formValues = Object.fromEntries(dataToSend);
    console.log(formValues);

    try {
      const response = await newCategory(dataToSend);
      console.log(response);

      if (response.data) {
        const { httpStatus, message } = response.data as {
          message: string;
          httpStatus: number;
        };
        if (httpStatus === 400) {
          setError(message);
        }
        if (httpStatus === 403) {
          setError(message);
        }
        if (httpStatus === 200) {
          revalidate();
          navigate("/account/admin/categories");
        }
      }

      if (response.error) {
        console.log(response.error);
        
        const { data, status } = response?.error as {
          data: any;
          message: string;
          status: number;
        };
        if (status === 400) {
          const { error } = data as { error: string };

          setError(error);
        }
        if (status === 403) {
          const { error} = data as { error:{name: string }};
          setError(error.name);
        }
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <main className="add-category">
      {/* =====================================================
                HEADER
            ====================================================== */}

      <header className="add-category__header">
        <div>
          <span className="add-category__eyebrow">Catalog</span>

          <h1 className="add-category__title">Add Category</h1>

          <p className="add-category__description">
            Create a predefined category for the marketplace.
          </p>
        </div>
      </header>

      {/* =====================================================
                CONTENT
            ====================================================== */}

      <div className="add-category__content">
        {/* =================================================
                    FORM
                ================================================== */}

        <section className="add-category__form-card">
          <form
            className="add-category__form"
            onSubmit={handleFormSubmit}
          >
            {/* =================================================
                            CATEGORY NAME
                        ================================================== */}

            <div className="add-category__field">
              <label
                htmlFor="category-name"
                className="add-category__label"
              >
                Category name
              </label>

              <input
                id="category-name"
                name="name"
                type="text"
                value={name}
                placeholder="e.g. Laptops"
                className="add-category__input"
                maxLength={100}
                disabled={saving}
                onChange={(e) => setName(e.target.value)}
              />

              <span className="add-category__hint">
                Use a clear name that buyers will easily understand.
              </span>
            </div>

            {/* =================================================
                            PARENT CATEGORY
                        ================================================== */}

            <div className="add-category__field">
              <label
                htmlFor="category-parent"
                className="add-category__label"
              >
                Parent category
              </label>

              <select
                id="category-parent"
                name="parentId"
                className="add-category__select"
                disabled={saving || loading}
                value={parent}
                onChange={(e) => setParent(e.target.value)}
              >
                <option value="">No parent — Root category</option>
                {categories.map((category) => {
                  return (
                    <option
                      value={category}
                      key={category}
                    >
                      {category}
                    </option>
                  );
                })}
              </select>

              <span className="add-category__hint">
                Leave empty to create a top-level category.
              </span>
            </div>
            {/* =================================================
                            SORT ORDER
                        ================================================== */}

            <div className="add-category__field">
              <label
                htmlFor="category-parent"
                className="add-category__label"
              >
                Category image
              </label>

              <input
                type="file"
                name="image"
                id="image"
                accept="image/png, image/jpeg, image/webp"
                className="add-category__inputfile"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];

                  if (selectedFile) {
                    if (selectedFile.size > 5 * 1024 * 1024) {
                      alert("Image is too large. Max size is 5MB.");
                      return;
                    }

                    setImage(selectedFile);
                  }
                }}
              />

              <span className="add-category__hint">
                Provide image that describe the category
              </span>
            </div>

            {/* =================================================
                            SORT ORDER
                        ================================================== */}

            <div className="add-category__field">
              <label
                htmlFor="category-sort-order"
                className="add-category__label"
              >
                Display order
              </label>

              <input
                id="category-sort-order"
                name="sortOrder"
                type="number"
                className="add-category__input"
                min="0"
                disabled={saving}
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value))}
              />

              <span className="add-category__hint">
                Lower numbers appear first.
              </span>
            </div>

            {/* =================================================
                            ACTIVE
                        ================================================== */}

            <label className="add-category__checkbox">
              <input
                type="checkbox"
                name="isActive"
                disabled={saving}
                checked={active}
                onChange={() => setActive(!active)}
              />

              <span>Category is active</span>
            </label>

            {/* =================================================
                            MESSAGES
                        ================================================== */}

            {error && (
              <div className="add-category__message add-category__message--error">
                {error}
              </div>
            )}

            {success && (
              <div className="add-category__message add-category__message--success">
                {success}
              </div>
            )}

            {/* =================================================
                            ACTIONS
                        ================================================== */}

            <div className="add-category__actions">
              <button
                type="button"
                className="add-category__cancel"
                disabled={saving}
              >
                Clear
              </button>

              <button
                type="submit"
                className="add-category__submit"
                disabled={saving}
              >
                {location.pathname.includes("/account/admin/categories/new")
                  ? "Create category"
                  : "Update category"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default AddCategory;
