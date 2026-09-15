import { useState, type ChangeEvent } from "react";
import { useNavigate, useRevalidator } from "react-router";
import {
  useNewBrandMutation
} from "../features/api/transApi";
import type { TbrandRequest } from "../types/TBrandRequest";
import "./../css/View.css";

const AddBrand = () => {
  const [active, setActive] = useState<boolean>(false);
  const {revalidate} = useRevalidator()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setIsSuccess] = useState("");


//crud hooks
const [createBrand] = useNewBrandMutation();



  

  

  const handleFormSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData);

    let name = formValues.name as string;
    let sortOrder = parseInt(formValues.sortOrder as string);

    const dto: TbrandRequest = {
        name,
        slug: name,
        active,
        sortOrder
    };
    

    try {
      const response = await  createBrand(dto);
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
        if(httpStatus===200){
            revalidate();
            navigate('/account/admin/brands')
        }
      }

      if (response.error) {
        const { data } = response?.error as {
          data: { error: { name: string } };
          message: string;
          status: number;
        };
        const { name } = data.error;
        setError(name);
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

          <h1 className="add-category__title">Add Brand</h1>

          <p className="add-category__description">
            Create a predefined Brand for the products
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
                Brand name
              </label>

              <input
                id="category-name"
                name="name"
                type="text"
                placeholder="e.g. drugaReka"
                className="add-category__input"
                maxLength={100}
                disabled={saving}
              />

              <span className="add-category__hint">
                Use a clear name that buyers will easily understand.
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
                checked={active}
                disabled={saving}
                onChange={() => setActive(() => !active)}
              />

              <span>Brand is active</span>
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
                {"Create brand"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default AddBrand;
