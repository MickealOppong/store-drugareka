import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useParams, useRevalidator } from "react-router";
import '../css/View.css';
import {
    useEditConditionMutation,
    useLazyGetConditionQuery
} from "../features/api/transApi";
import type { TConditionResponse } from "../types/TConditionResponse";

const EditCondition = () => {
 
  const [active,setActive]=useState<boolean>(false)
  const[name,setName] = useState<string>('')
  const[description,setDescription] = useState<string>('')
  const[sortOrder,setSortOrder] = useState<number>(0)
    const [saving,] = useState(false);

    const [error, setError] = useState<string>("");


const [editCondition,{isSuccess:success}] = useEditConditionMutation()

  //params
  const {id} = useParams()
    const {revalidate} = useRevalidator()
    const navigate = useNavigate()


    const [fetchCondition]=useLazyGetConditionQuery();
    
    async function getCondition() {
    try {
           const response = await fetchCondition(parseInt(id as string)).unwrap()
           const condition =response.data as TConditionResponse
      setName(condition.name)
      setDescription(condition.description)
      setSortOrder(condition.sortOrder)
      setActive(condition.active)
    } catch (error:any) {
        setError('Server error')
    }
       
    }

    useEffect(()=>{
        getCondition();
        },[id])

  const handleFormSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    
    const formData = new FormData();
   
    formData.append('id', String(id))
    formData.append('name', name)
    formData.append('description', description)
    formData.append('slug', name)
    formData.append('active', active===true?'1':'0')
    formData.append('sortOrder',String(sortOrder))

       try {

      const response =await editCondition(formData);      

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

          <h1 className="add-category__title">Edit Condition</h1>

          <p className="add-category__description">
            Edit a predefined Condition for the products
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
                           CONDITION NAME
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
                value={name}
                onChange={(e)=>setName(e.target.value)}
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
                value={description}
                  onChange={(e)=>setDescription(e.target.value)}
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
                min="1"
                disabled={saving}
                value={sortOrder}
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
                onClick={()=>navigate(-1)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="add-category__submit"
                disabled={saving}
              >
                {"Update condition"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default EditCondition;
