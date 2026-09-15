import React from "react";
import { FiTrash2 } from "react-icons/fi";
import type { TCartItem } from "../types/TCart";
import { formatPrice } from "../util/util";
import { CartTimer } from "./index";

interface CartItemCardProps {
  item:TCartItem
  onRemove: (listingId: number) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item, onRemove }) => {
  return (
    <article className="cart-item-card">
      <figure className="cart-item-thumb">
        <img src={item.image} alt={item.productName} loading="lazy" />
      </figure>
      
      <div className="cart-item-body">
        <div className="cart-item-body-main">
          <div className="cart-item-meta">
            <h3 className="cart-item-name">{item.productName}</h3>
            <CartTimer expiryTimestamp={new Date(item.reservedUntil).toUTCString()} />
          </div>
          <button 
            type="button" 
            className="cart-item-remove-btn" 
            onClick={() => onRemove(item.listingId)}
            title="Remove item from bag"
          >
            <FiTrash2 />
          </button>
        </div>
        
        <footer className="cart-item-footer">
          <div>
            <p className="cart-item-delivery-label">Cena przedmiotu</p>
            <strong className="cart-item-price">{formatPrice(item.price)} zł</strong>
          </div>
          <div className="text-right">
            <p className="cart-item-delivery-label">Koszt dostawy</p>
            <span className="cart-item-shipping-fee">+{formatPrice(item.shipping)} zł</span>
          </div>
        </footer>
      </div>
    </article>
  );
};

export default CartItemCard;
