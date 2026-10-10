
import React from "react";
import { useTranslation } from "react-i18next";
import { FiArrowRight, FiInfo, FiTruck } from "react-icons/fi";
import "../css/Cart.css";
import type { TCart, TCartItem } from "../types/TCart";
import { formatPrice } from "../util/util";
import CartAddressManager from "./CartAddressManager";
import CartItemCard from "./CartItemCard";

interface CartProps {
  cart: TCart;
  onCheckout: () => void;
  onRemoveItem: (listingId: number) => void;
}

const Cart: React.FC<CartProps> = ({
  cart,
  onRemoveItem,
  onCheckout,
}) => {
  const { t } = useTranslation();

  const sellerGroups = Object.values(
    cart.cartItemList.reduce<Record<number, TCartItem[]>>(
      (groups, item) => {
        if (!groups[item.sellerId]) {
          groups[item.sellerId] = [];
        }

        groups[item.sellerId].push(item);
        return groups;
      },
      {},
    ),
  );

  const itemTotal = cart.cartItemList.reduce(
    (sum, item) => sum + item.price,
    0,
  );

  const shippingCost = cart.cartItemList.reduce(
    (sum, item) => sum + (Number(item.shipping) || 0),
    0,
  );

  const totalServiceCharge = cart.cartItemList.reduce(
    (sum, item) => sum + (Number(item.serviceCharge) || 0),
    0,
  );

  const finalOrderTotal =
    itemTotal + shippingCost + totalServiceCharge;

  return (
    <main className="cart-page">
      <header className="cart-header">
        <h1 className="cart-title">
          {t("cart.header.title")}
        </h1>
      </header>

      <section className="cart-workspace">
        {/* Cart items grouped by seller */}
        <div className="cart-items-feed">
          {sellerGroups.map((sellerItems, index) => {
            const totalShipping = sellerItems.reduce(
              (sum, item) =>
                sum + (Number(item.shipping) || 0),
              0,
            );

            const groupKey =
              sellerItems[0]?.sellerId ?? index;

            return (
              <div
                key={groupKey}
                className="cart-seller-group border border-gray-200 rounded-lg p-4 bg-white mb-4"
              >
                <div className="cart-seller-header text-sm font-bold text-gray-700 mb-3 border-b border-gray-100 pb-2">
                  {t("cart.seller.label", {
                    defaultValue: "Seller Package",
                  })}
                </div>

                {sellerItems.map((item) => (
                  <CartItemCard
                    key={item.cartItemId}
                    item={item}
                    onRemove={onRemoveItem}
                  />
                ))}

                <div className="cart-seller-shipping-footer flex items-center justify-between mt-3 pt-3 border-t border-dashed border-gray-200 text-sm">
                  <span className="flex items-center gap-1.5 text-gray-500 font-medium">
                    <FiTruck className="text-teal-700" />
                    {t("cart.seller.shipping_cost", {
                      defaultValue: "Package Shipping Cost",
                    })}
                    :
                  </span>

                  <strong className="text-gray-900 font-bold">
                    {totalShipping > 0
                      ? `${formatPrice(totalShipping)} zł`
                      : t("cart.seller.free_shipping", {
                          defaultValue:
                            "Free Shipping (Consolidated)",
                        })}
                  </strong>
                </div>
              </div>
            );
          })}

          <CartAddressManager savedAddress={cart.address} />
        </div>

        {/* Order summary */}
        <aside className="cart-summary-sidebar">
          <h2 className="cart-summary-title">
            {t("cart.summary.title")}
          </h2>

          <dl className="cart-summary-ledger">
            <div className="cart-summary-row">
              <dt>{t("cart.summary.subtotal")}</dt>
              <dd>{formatPrice(itemTotal)} zł</dd>
            </div>

            <div className="cart-summary-row">
              <dt>{t("cart.summary.service_charge")}</dt>
              <dd>{formatPrice(totalServiceCharge)} zł</dd>
            </div>

            <div className="cart-summary-row">
              <dt>{t("cart.summary.shipping")}</dt>
              <dd>{formatPrice(shippingCost)} zł</dd>
            </div>

            <div className="cart-summary-row cart-summary-total-row">
              <dt>{t("cart.summary.total")}</dt>
              <dd>{formatPrice(finalOrderTotal)} zł</dd>
            </div>
          </dl>

          {/* Private-seller disclosure */}
          <div className="cart-private-seller-notice">
            <FiInfo
              className="cart-private-seller-icon"
              aria-hidden="true"
            />

            <div className="cart-private-seller-content">
              <strong>
                {t("cart.private_seller.title", {
                  defaultValue: "Rynek sprzedaży przez osoby prywatne",
                })}
              </strong>

              <p>
                {t("cart.private_seller.description", {
                  defaultValue:
"Produkty są sprzedawane przez osoby prywatne, a nie przez KASAWA Sp. z o.o. Serwis Kasoa.pl udostępnia platformę ogłoszeniową i pośredniczy w realizacji transakcji. Ochrona konsumenta przysługująca przy zakupach od przedsiębiorców może nie mieć zastosowania do tych transakcji."                })}
              </p>

              <a href="/terms">
                {t("cart.private_seller.terms_link", {
                  defaultValue: "Zapoznaj się z regulaminem serwisu",
                })}
              </a>
            </div>
          </div>

          <button
            type="button"
            className="cart-checkout-btn"
            onClick={onCheckout}
            disabled={!cart.address}
          >
            <span>{t("cart.summary.checkout_btn")}</span>
            <FiArrowRight aria-hidden="true" />
          </button>

          {!cart.address && (
            <p className="cart-checkout-warning">
              {t("cart.summary.address_warning")}
            </p>
          )}
        </aside>
      </section>
    </main>
  );
};

export default Cart;
