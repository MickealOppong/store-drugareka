import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useParams, useRevalidator } from "react-router";
import "../css/View.css";
import {
  useEditBrandMutation,
  useLazyFetchBrandQuery
} from "../features/api/transApi";
import type { TbrandResponse } from "../types/TBrandResponse";

const EditBrand = () => {
 
  const [active,setActive]=useState<boolean>(false)
  const[name,setName] = useState<string>('')
  const[sortOrder,setSortOrder] = useState<number>(0)
    const [error, setError] = useState<string>("");

  //edit hook
  const [EditBrand,{isLoading,isSuccess}] = useEditBrandMutation()
  const[getBrand]=useLazyFetchBrandQuery()


  //params
  const {id} = useParams()
  const catId = parseInt(id as string)
    const {revalidate} = useRevalidator()
    const navigate = useNavigate()

  
  async function getBrandById(){
    
    const response = await getBrand(catId)
    console.log(response);
    
    setName(()=>response.data?.name as string)
    setActive(()=>response.data?.active as boolean)
    setSortOrder(()=>response?.data?.sortOrder as number)
  }

  useEffect(()=>{
    getBrandById()
  },[catId])

  const handleFormSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    /*
    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData);

    let name = formValues.name as string;
    let parent = formValues.parentId as string;
    let sortOrder = parseInt(formValues.sortOrder as string);
    */

    const dto:TbrandResponse={
      id:catId,
      name,
      sortOrder,
      active,
      slug: name
    }
  

       try {
      const response = await EditBrand(dto)

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

          <h1 className="add-category__title">Edit Brand</h1>

          <p className="add-category__description">
            Create a predefined Brand for the marketplace.
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
                value={name}
                placeholder="e.g. Laptops"
                className="add-category__input"
                maxLength={100}
                disabled={isLoading}
                onChange={(e)=>setName(e.target.value)}
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
                value={sortOrder}
                className="add-category__input"
                min="0"
                disabled={isSuccess}
                onChange={(e)=>setSortOrder(parseInt(e.target.value))}
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
                Update brand
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default EditBrand;
