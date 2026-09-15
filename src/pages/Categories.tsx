import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Loading } from "../components";
import { useGetAllCategoriesQuery } from "../features/api/storeApi";
const  Categories = ()=>{
    const {data:categories=[],isLoading:isCategoriesLoading} = useGetAllCategoriesQuery()
    
    console.log(categories);
    
    if(isCategoriesLoading){
      return <Loading/>
    }
    return   <section className="categories section">
            <div className="section-heading">
              <div>
                <span className="section-eyebrow">DISCOVER</span>
    
                <h2>What are you looking for?</h2>
              </div>
            </div>
    
            <div className="category-grid">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/shop?category=${category.slug}`}
                  className="category-card"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                  />
    
                  <div className="category-card__overlay">
                    <h3>{category.name}</h3>
    
                    <FiArrowRight />
                  </div>
                </Link>
              ))}
            </div>
          </section>
}
export default Categories