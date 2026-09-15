import React from "react";
import { FiArrowRight } from "react-icons/fi";
import type { TCart } from "../types/TCart";
import { formatPrice } from "../util/util";
import './../css/Cart.css';
import CartAddressManager from "./CartAddressManager";
import CartItemCard from "./CartItemCard";

interface CartProps {
  cart: TCart;
  onCheckout: () => void;
  onRemoveItem: (listingId: number) => void;
}

// Named export directly mapping into index files cleanly
 const Cart: React.FC<CartProps> = ({ cart, onRemoveItem, onCheckout }) => {
  // Memoize summary computations locally to maintain rendering frame accuracy
  const itemTotal = cart.cartItemList.reduce((sum, item) => sum + item.price, 0);
  const shippingCost = cart.cartItemList.reduce((sum, item) => sum + item.shipping, 0);
  const finalOrderTotal = itemTotal + shippingCost;

  return (
    <main className="cart-page">
      <header className="cart-header">
        <h1 className="cart-title">Shopping Bag</h1>
      </header>

      <section className="cart-workspace">
        {/* LEFT STREAM: MAIN ACTIVE ITEMS SCROLL HOUSING */}
        <div className="cart-items-feed">
          {cart.cartItemList.map((item) => (
            <CartItemCard 
              key={item.cartItemId} 
             item={item}
              onRemove={onRemoveItem} 
            />
          ))}

          {/* ISOLATED ADDRESS FORM CONTROLLER PANE */}
          <CartAddressManager savedAddress={cart.address} />
        </div>

        {/* RIGHT SIDEBAR: TRANSACTION BILLING CALCULATORS CARD */}
        <aside className="cart-summary-sidebar">
          <h2 className="cart-summary-title">Order Summary</h2>
          
          <dl className="cart-summary-ledger">
            <div className="cart-summary-row">
              <dt>Subtotal</dt>
              <dd>{formatPrice(itemTotal)} zł</dd>
            </div>
            <div className="cart-summary-row">
              <dt>Shipping cost</dt>
              <dd>{formatPrice(shippingCost)} zł</dd>
            </div>
            <div className="cart-summary-row cart-summary-total-row">
              <dt>Total</dt>
              <dd>{formatPrice(finalOrderTotal)} zł</dd>
            </div>
          </dl>

          <button 
            type="button" 
            className="cart-checkout-btn" 
            onClick={onCheckout}
            disabled={!cart.address}
          >
            <span>Secure Checkout</span>
            <FiArrowRight />
          </button>
          
          {!cart.address && (
            <p className="cart-checkout-warning">
              Please add a delivery address to unlock checkout options.
            </p>
          )}
        </aside>
      </section>
    </main>
  );
};

export default Cart;
