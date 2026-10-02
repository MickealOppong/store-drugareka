import { useTranslation } from "react-i18next";
import { FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Cart } from "../components/index";
import '../css/Cart.css';
import { useGetBuyerCartQuery, useRemoveCartItemMutation } from "../features/api/cartApi";
import { useCheckoutBuyerPayUMutation } from "../features/api/checkoutApi";
import type { TCart } from "../types/TCart";

const CartPage = () => {
  const { data: cart, isLoading: cartLoading } = useGetBuyerCartQuery();
  const { t } = useTranslation();

  //console.log(cart);
  


  const [deleteItem] = useRemoveCartItemMutation();
  const [checkout] =useCheckoutBuyerPayUMutation()

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
      const checkoutUrl = response?.data; // Adjusted to match generic API wrappers safely

     
      if (checkoutUrl) {
       // navigate("/checkout", { state: { clientSecret } });
     window.location.href=response.data
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
        <h2 className="cart-empty-title">{t("cart_page.empty.title")}</h2>
        <p className="cart-empty-text">
          {t("cart_page.empty.description")}
        </p>
        <Link to="/shop" className="cart-empty-link">
          {t("cart_page.empty.continue_btn")}
        </Link>
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
