import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useParams, useRevalidator } from "react-router";
import "../css/View.css";
import {
  useEditCategoryMutation,
  useLazyAllParentcategoriesQuery,
  useLazyGetCategoryQuery
} from "../features/api/transApi";
import type { TCategoryReponse } from "../types/TCategoryResponse";

const EditCategory = () => {
 
  const [active,setActive]=useState<boolean>(false)
  const[name,setName] = useState<string>()
  const[parent,setParent] = useState<string>()
  const[sortOrder,setSortOrder] = useState<number>()
  const [categories, setCategories] = useState<string[]>([]);
    const [error, setError] = useState<string>("");

  //edit hook
  const [EditCategory,{isLoading,isSuccess}] = useEditCategoryMutation()
  const[getCategory]=useLazyGetCategoryQuery()
    const [fetchParentCategories] = useLazyAllParentcategoriesQuery({refetchOnFocus:true,refetchOnReconnect:true});

  //params
  const {id} = useParams()
  const catId = parseInt(id as string)
    const {revalidate} = useRevalidator()
    const navigate = useNavigate()


    async function getParentCategories() {
      const response = await fetchParentCategories();
      setCategories(() => (response.data as string[]) || []);
    }
  
    useEffect(() => {
      getParentCategories();
    }, []);
  
  async function getcategoryById(){
    console.log('here');
    
    const response = await getCategory(catId)
    console.log(response);
    
    setName(()=>response.data?.name)
    setParent(()=>response.data?.parent)
    setActive(()=>response.data?.active as boolean)
    setSortOrder(()=>response.data?.sortOrder)
  }

  useEffect(()=>{
    getcategoryById()
  },[catId])

  const handleFormSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData);

    let name = formValues.name as string;
    let parent = formValues.parentId as string;
    let sortOrder = parseInt(formValues.sortOrder as string);

    const dto:TCategoryReponse={
      id: catId,
      name,
      parent,
      sortOrder,
      active,
      slug: name,
      image: ""
    }
  

       try {
      const response = await EditCategory(dto)

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
            navigate('/account/admin/categories')
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
                disabled={isLoading}
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
                disabled={ isLoading}
                defaultValue={parent}
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
                htmlFor="category-sort-order"
                className="add-category__label"
              >
                Display order
              </label>

              <input
                id="category-sort-order"
                name="sortOrder"
                type="number"
                value={sortOrder}
                className="add-category__input"
                min="0"
                disabled={isSuccess}
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
                disabled={isSuccess}
                onChange={() => setActive(() => !active)}
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

            {isSuccess && (
              <div className="add-category__message add-category__message--success">
                {"Done"}
              </div>
            )}

            {/* =================================================
                            ACTIONS
                        ================================================== */}

            <div className="add-category__actions">
              <button
                type="button"
                className="add-category__cancel"
                disabled={isLoading}
              >
                Clear
              </button>

              <button
                type="submit"
                className="add-category__submit"
                disabled={isLoading}
              >
                Update category
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default EditCategory;
