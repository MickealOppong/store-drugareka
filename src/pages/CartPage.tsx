import { FiShoppingBag } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { Cart } from "../components/index";
import { useGetBuyerCartQuery, useRemoveCartItemMutation } from "../features/api/cartApi";
import { useCheckoutBuyerMutation } from "../features/api/checkoutApi";
import type { TCart } from "../types/TCart";
import './../css/Cart.css';

const CartPage = () => {
  const { data: cart, isLoading: cartLoading } = useGetBuyerCartQuery();

  const navigate = useNavigate();

 

  const [deleteItem] = useRemoveCartItemMutation();
  const [checkout] = useCheckoutBuyerMutation();



  const handleRemoveItem = async (listingId: number) => {
    try {
      await deleteItem(listingId).unwrap();
    } catch (error) {
      console.error("Failed to remove item from bag:", error);
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await checkout().unwrap();
      const clientSecret = response?.data; // Adjusted to match generic API wrappers safely

      if (clientSecret) {
        navigate("/checkout", { state: { clientSecret } });
      }
    } catch (error) {
      console.error("Checkout transaction initialization failure:", error);
    }
  };

  if (cartLoading) {
    return (
      <div id="cart-loading-screen">
        <div id="cart-loading-spinner" />
      </div>
    );
  }

  if (!cart || cart.cartItemList.length === 0) {
    return (
      <div className="cart-empty-view" id="cart-empty-view">
        <div className="cart-empty-icon-wrap">
          <FiShoppingBag />
        </div>
        <h2 className="cart-empty-title">Your shopping cart is empty</h2>
        <p className="cart-empty-text">
          You haven't added any one-of-a-kind pre-loved pieces to your bag yet.
        </p>
        <Link to="/shop" className="cart-empty-link">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <Cart
      cart={cart as TCart}
      onRemoveItem={handleRemoveItem}
      onCheckout={handleCheckout}
    />
  );
};

export default CartPage;
