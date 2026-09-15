import { FiHeart, FiShoppingBag, FiTrash2 } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import type { Store } from "redux";
import { useAddWishListMutation, useGetWishListsQuery } from "../features/api/itemApi";
import { useAddToCart } from "../hooks/useAddTocart";
import { type RootState } from "../store";
import { formatPrice } from "../util/util";
import './../css/wishlist.scss';


export const loader =(store:Store<RootState>)=>async()=>{
          /*
        const dispatch = store.dispatch as AppDispatch;

            const promise= await dispatch(itemApi.endpoints.getWishLists.initiate());
                
        
            const data  = promise.data as TWishLists[];        
            console.log(data);
            
    */
  return null;
   
}
 const WishList =()=> {

  
const {data:wishlistItems=[] }=useGetWishListsQuery()


const navigate = useNavigate()


 const [addToWish,{isLoading}] = useAddWishListMutation()
 const {addItemToCart} = useAddToCart()

  const onRemoveWishlist = async(listingId: number) => {
 
      
 await addToWish(listingId)  
 
  };

if (isLoading) {
  return (
    <div className="wishlist-page__loading">
      <div className="wishlist-page__spinner"></div>
    </div>
  );
}

if (wishlistItems.length === 0) {
  return (
    <div className="wishlist-page__empty">
      <div className="wishlist-page__empty-icon">
        <FiHeart />
      </div>

      <h3>Your wishlist is empty</h3>

      <p>
        Save items you like to track them and purchase later.
      </p>

      <Link to="/shop" className="wishlist-page__empty-link">
        Explore Shop
      </Link>
    </div>
  );
}

return (
  <main className="wishlist-page">

    {/* Header */}
    <header className="wishlist-page__header">
      <div className="wishlist-page__header-content">
        <h2>Saved Items</h2>
        <p>Manage your pre-loved favorites list</p>
      </div>

      <span className="wishlist-page__count">
        {wishlistItems.length}{" "}
        {wishlistItems.length === 1 ? "Item" : "Items"}
      </span>
    </header>

    {/* Wishlist Grid */}
    <section className="wishlist-page__grid">

      {wishlistItems.map((item) => (
        <article
          key={item.id}
          className="wishlist-card"
        >

          {/* Product Image */}
          <figure className="wishlist-card__media">

            <img
              src={
                item.image ||
                "/images/placeholder-product.png"
              }
              alt={item.productName}
              loading="lazy"
            />

            <button
              type="button"
              className="wishlist-card__remove"
              onClick={() => onRemoveWishlist(item.listingId)}
              title="Remove from wishlist"
              aria-label={`Remove ${item.productName} from wishlist`}
            >
              <FiTrash2 />
            </button>

            {item.inventoryStatus !== "AVAILABLE" && (
              <mark className="wishlist-card__status">
                {item.inventoryStatus.replace("_", " ") || ""}
              </mark>
            )}
              <mark className="wishlist-card__status">
                {item.inventoryStatus}
              </mark>

          </figure>

          {/* Product Information */}
          <div className="wishlist-card__content">

            <div className="wishlist-card__info">

              <Link
                to={`/shop/listing/${item.listingId}`}
                className="wishlist-card__product-link"
              >
                <h4>{item.productName}</h4>
              </Link>

              <p>
                Added on{" "}
                {new Date(item.createAt).toLocaleDateString()}
              </p>

            </div>

            {/* Price & Buy */}
            <footer className="wishlist-card__footer">

              <strong>
                {formatPrice(item.sellerPrice)} zl
              </strong>

              <button
                type="button"
                className="wishlist-card__buy"
                disabled={
                  item.inventoryStatus !== "AVAILABLE"
                }
                onClick={()=>{
                  addItemToCart(item.listingId)
                  navigate('/cart')
                }}
              >
                <FiShoppingBag />
                <span>Buy</span>
              </button>

            </footer>

          </div>

        </article>
      ))}

    </section>
  </main>
);
};

export default WishList