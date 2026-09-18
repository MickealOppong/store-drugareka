import { useState, type ChangeEvent } from "react";
import { useNavigate, useRevalidator } from "react-router";
import {
  useNewConditionMutation
} from "../features/api/transApi";
import type { TConditionRequest } from "../types/TConditionRequest";
import './../css/View.css';

const AddCondition= () => {
  const [active, setActive] = useState<boolean>(false);
  const {revalidate} = useRevalidator()
  const navigate = useNavigate()


  const [saving,] = useState(false);
  const [error, setError] = useState("");
  const [success, ] = useState("");


/**
 * ** crud hooks
 */
const [createCondition] = useNewConditionMutation()




  const handleFormSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData);

    let name = formValues.name as string;
    let sortOrder = parseInt(formValues.sortOrder as string);
    let description = formValues.description as string;

    const dto: TConditionRequest = {
        name,
        description,
        active,
        sortOrder,
        slug:name
    };
    console.log(dto);
    

    try {
      const response = await  createCondition(dto);
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
        if(httpStatus===200){
            revalidate();
            navigate('/account/admin/conditions')
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

          <h1 className="add-category__title">Add Condition</h1>

          <p className="add-category__description">
            Create a predefined Condition for the products
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
                 Condition
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
                            DESCRIPTION
                        ================================================== */}

            <div className="add-category__field">
              <label
                htmlFor="category-name"
                className="add-category__label"
              >
                Description
              </label>

              <input
                id="category-name"
                name="description"
                type="text"
                placeholder=""
                className="add-category__input"
                maxLength={100}
                disabled={saving}
              />

              <span className="add-category__hint">
                Provide a clear description that buyers will easily understand.
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

              <span>Condition is active</span>
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
                {"Create condition"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default AddCondition;
