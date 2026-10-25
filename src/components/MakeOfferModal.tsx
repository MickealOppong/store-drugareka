
import { useEffect, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { FiAlertCircle, FiArrowRight, FiTag, FiX } from "react-icons/fi";

import { useStripeOfferBuyNowMutation } from "../features/api/checkoutApi";
import { useGetListingQuery, useMakeOfferMutation } from "../features/api/itemApi";
import type { TOfferDto } from "../types/TOfferDto";
import type { TResponseDto } from "../types/TResponseDto";
import { formatPrice } from "../util/util";
import "./../css/MakeOfferModal.scss";

type MakeOfferModalProps = {
  isOpen: boolean;
  onButtonClick: () => void;
  productName: string;
  currentPrice: number;
  id: number;
  isNegotiable: boolean;
  service?: number;
  shipment?: number;
};

const RESERVATION_WINDOW_MS = 15 * 60 * 1000;

const getErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (typeof error === "object" && error !== null) {
    const apiError = error as {
      data?: { message?: string };
      message?: string;
    };

    return (
      apiError.data?.message ||
      apiError.message ||
      fallback
    );
  }

  return fallback;
};

export const MakeOfferModal = ({
  isOpen,
  onButtonClick,
  productName,
  currentPrice,
  id,
  isNegotiable,
  service,
  shipment,
}: MakeOfferModalProps) => {
  const { t } = useTranslation();

  const [makeOffer, { isLoading: isOfferLoading }] =
    useMakeOfferMutation();

  const [buyNow, { isLoading: isCheckoutLoading }] =
    useStripeOfferBuyNowMutation();

  const [offerAccepted, setOfferAccepted] = useState(false);
  const [offer, setOffer] = useState("");
  const [shipping, setShipping] = useState(0);
  const [serviceCharge, setServiceCharge] = useState(0);
  const [message, setMessage] = useState("");
  const [alertError, setAlertError] = useState<string | null>(null);

  const{data:listing} = useGetListingQuery(id)
  

  const isComponentProcessing =
    isOfferLoading || isCheckoutLoading;

  const numericOffer = Number(offer);

  const totalInvoiceCost =
    serviceCharge + shipping + numericOffer;

  const totalCheckoutCost =
    currentPrice +
    Number(shipment || listing?.shippingCost) +
    Number(service || listing?.serviceCharge);

  const genericError = t(
    "make_offer_modal.validation.generic_error",
    {
      defaultValue: "Something went wrong. Please try again.",
    },
  );

  const checkoutError = t("checkout.generic.failed", {
    defaultValue: "Unable to create payment session.",
  });

  useEffect(() => {
    if (!isOpen) return;

    setOffer("");
    setShipping(0);
    setServiceCharge(0);
    setMessage("");
    setOfferAccepted(false);
    setAlertError(null);
  }, [isOpen, id, productName, currentPrice]);

  useEffect(() => {
    if (!isOpen || !offerAccepted) return;

    const dismissTimer = window.setTimeout(() => {
      onButtonClick();
    }, RESERVATION_WINDOW_MS);

    return () => window.clearTimeout(dismissTimer);
  }, [isOpen, offerAccepted, onButtonClick]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (!isComponentProcessing) {
      onButtonClick();
    }
  };

  const handleFormSubmit = async (
    event: ChangeEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setAlertError(null);

    if (
      !Number.isFinite(numericOffer) ||
      numericOffer <= 0
    ) {
      setAlertError(
        t("make_offer_modal.validation.invalid_amount", {
          defaultValue: "Please enter a valid offer amount.",
        }),
      );
      return;
    }

    if (numericOffer > currentPrice) {
      setAlertError(
        t("make_offer_modal.validation.offer_too_high", {
          defaultValue:
            "Your offer cannot exceed the current listing price.",
        }),
      );
      return;
    }

    try {
      const response = (await makeOffer({
        listingId: id,
        offer: numericOffer,
      }).unwrap()) as TResponseDto;

      

      const {
        message: apiMessage,
        httpStatus,
        data,
      } = response;

      if (httpStatus !== 200 || !data) {
        setAlertError(apiMessage || genericError);
        return;
      }

      const details = data as TOfferDto;
      const acceptedPrice = Number(details.price);

      if (
        !Number.isFinite(acceptedPrice) ||
        acceptedPrice <= 0
      ) {
        setAlertError(genericError);
        return;
      }

      setOffer(String(acceptedPrice));
      setServiceCharge(Number(details.serviceCharge) || 0);
      setShipping(Number(details.shipping) || 0);
      setMessage(apiMessage || "");
      setOfferAccepted(true);
    } catch (error: unknown) {
      setAlertError(getErrorMessage(error, genericError));
    }
  };

  const handleCheckout = async (amount: number) => {
    if (isComponentProcessing) return;

    setAlertError(null);

    if (!Number.isFinite(amount) || amount <= 0) {
      setAlertError(
        t("make_offer_modal.validation.invalid_amount", {
          defaultValue: "Please enter a valid amount.",
        }),
      );
      return;
    }

    try {
      const response = (await buyNow({
        listingId: id,
        offer: amount,
      }).unwrap()) as TResponseDto;

      const {
        data,
        message: apiMessage,
        httpStatus,
      } = response;

      if (
        httpStatus !== 200 ||
        typeof data !== "string" ||
        !data.trim()
      ) {
        setAlertError(apiMessage || checkoutError);
        return;
      }

      window.location.assign(data);
    } catch (error: unknown) {
      setAlertError(getErrorMessage(error, checkoutError));
    }
  };

  const handleQuickCheckout = () => {
    if (!offerAccepted) return;
    void handleCheckout(numericOffer);
  };


  const renderError = () =>
    alertError ? (
      <div
        className="mkt-offer-modal__error"
        role="alert"
        aria-live="assertive"
      >
        <FiAlertCircle aria-hidden="true" />
        <span>{alertError}</span>
      </div>
    ) : null;

  const renderCloseButton = () => (
    <button
      type="button"
      className="mkt-offer-modal__close-btn"
      onClick={handleClose}
      aria-label={t("common.close", {
        defaultValue: "Close",
      })}
      disabled={isComponentProcessing}
    >
      <FiX aria-hidden="true" />
    </button>
  );

  

  // ============================================================
  // MODE A: NEGOTIABLE LISTING
  // ============================================================

  if (isNegotiable) {
    return (
      <div
        className="mkt-offer-overlay"
        onClick={handleClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mkt-offer-title"
      >
        <div
          className="mkt-offer-modal"
          onClick={(event) => event.stopPropagation()}
        >
          <header className="mkt-offer-modal__header">
            <div className="mkt-offer-modal__badge">
              <FiTag aria-hidden="true" />
              <span>
                {t("make_offer_modal.header.badge", {
                  defaultValue: "Make an offer",
                })}
              </span>
            </div>

            {renderCloseButton()}
          </header>

          <form
            className="mkt-offer-modal__form"
            onSubmit={handleFormSubmit}
          >
            <div className="mkt-offer-modal__body">
              <h2
                id="mkt-offer-title"
                className="mkt-offer-modal__title"
              >
                {t("make_offer_modal.body.title", {
                  defaultValue: "Make your offer",
                })}
              </h2>

              <p className="mkt-offer-modal__description">
                {t("make_offer_modal.body.description", {
                  defaultValue:
                    "Suggest a price to the seller. If accepted, you can proceed to secure checkout.",
                })}
              </p>

              <div className="mkt-offer-modal__summary-box">
                <div className="mkt-offer-modal__summary-row">
                  <span className="mkt-offer-modal__summary-label">
                    {t("make_offer_modal.summary.product_name", {
                      defaultValue: "Product",
                    })}
                  </span>

                  <strong className="mkt-offer-modal__summary-value">
                    {productName}
                  </strong>
                </div>

                <div className="mkt-offer-modal__summary-row mkt-offer-modal__summary-row--total">
                  <span className="mkt-offer-modal__summary-label">
                    {t("make_offer_modal.summary.list_price", {
                      defaultValue: "Listing price",
                    })}
                  </span>

                  <strong className="mkt-offer-modal__summary-value mkt-offer-modal__summary-value--price">
                    {formatPrice(currentPrice)} zł
                  </strong>
                </div>

                {!offerAccepted && (
                  <div className="mkt-offer-modal__offer-field">
                    <label
                      className="mkt-offer-modal__field-label"
                      htmlFor="mkt-offer-amount"
                    >
                      {t("make_offer_modal.fields.offer_label", {
                        defaultValue: "Your offer",
                      })}
                    </label>

                    <div className="mkt-offer-modal__input-wrapper">
                      <input
                        id="mkt-offer-amount"
                        name="offer"
                        type="number"
                        className="mkt-offer-modal__input"
                        min="0.01"
                        max={currentPrice}
                        step="0.01"
                        value={offer}
                        onChange={(event) =>
                          setOffer(event.target.value)
                        }
                        disabled={isComponentProcessing}
                        required
                        aria-invalid={Boolean(alertError)}
                      />

                      <span className="mkt-offer-modal__currency">
                        zł
                      </span>
                    </div>
                  </div>
                )}

                {offerAccepted && (
                  <div className="mkt-offer-modal__breakdown-container animate-pop">
                    {message && (
                      <div
                        className="mkt-offer-modal__success-msg"
                        role="status"
                      >
                        {message}
                      </div>
                    )}

                    <div className="mkt-offer-modal__breakdown-table">
                      <div className="mkt-offer-modal__summary-row">
                        <span className="mkt-offer-modal__summary-label">
                          {t("make_offer_modal.summary.reduced_price", {
                            defaultValue: "Accepted offer",
                          })}
                        </span>

                        <strong className="mkt-offer-modal__summary-value mkt-offer-modal__summary-value--price-reduced">
                          {formatPrice(numericOffer)} zł
                        </strong>
                      </div>

                      <div className="mkt-offer-modal__summary-row">
                        <span className="mkt-offer-modal__summary-label">
                          {t("cart.summary.service_charge", {
                            defaultValue: "Service fee",
                          })}
                        </span>

                        <span className="mkt-offer-modal__summary-value">
                          {formatPrice(serviceCharge)} zł
                        </span>
                      </div>

                      <div className="mkt-offer-modal__summary-row">
                        <span className="mkt-offer-modal__summary-label">
                          {t("cart.summary.shipping", {
                            defaultValue: "Shipping cost",
                          })}
                        </span>

                        <span className="mkt-offer-modal__summary-value">
                          {formatPrice(shipping)} zł
                        </span>
                      </div>

                      <div className="mkt-offer-modal__summary-row mkt-offer-modal__summary-row--total">
                        <strong className="mkt-offer-modal__summary-label">
                          {t("cart.summary.total", {
                            defaultValue: "Total",
                          })}
                        </strong>

                        <strong className="mkt-offer-modal__summary-value mkt-offer-modal__summary-value--price">
                          {formatPrice(totalInvoiceCost)} zł
                        </strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {renderError()}
            </div>

            <footer className="mkt-offer-modal__footer">
              {offerAccepted ? (
                <button
                  type="button"
                  className="mkt-offer-modal__btn mkt-offer-modal__btn--cart"
                  onClick={handleQuickCheckout}
                  disabled={isComponentProcessing}
                >
                  {isCheckoutLoading ? (
                    <span>
                      {t("checkout.processing", {
                        defaultValue: "Processing...",
                      })}
                    </span>
                  ) : (
                    <>
                      <span>
                        {t("cart.summary.checkout_btn", {
                          defaultValue: "Secure checkout",
                        })}
                      </span>
                      <FiArrowRight aria-hidden="true" />
                    </>
                  )}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="mkt-offer-modal__btn mkt-offer-modal__btn--cancel"
                    onClick={handleClose}
                    disabled={isComponentProcessing}
                  >
                    {t("make_offer_modal.buttons.cancel", {
                      defaultValue: "Cancel",
                    })}
                  </button>

                  <button
                    type="submit"
                    className="mkt-offer-modal__btn mkt-offer-modal__btn--confirm"
                    disabled={
                      isComponentProcessing ||
                      !offer.trim() ||
                      !Number.isFinite(numericOffer) ||
                      numericOffer <= 0 ||
                      numericOffer > currentPrice
                    }
                  >
                    {isOfferLoading
                      ? t("common.loading", {
                          defaultValue: "Submitting...",
                        })
                      : t("make_offer_modal.buttons.submit", {
                          defaultValue: "Submit offer",
                        })}
                  </button>
                </>
              )}
            </footer>
          </form>
        </div>
      </div>
    );
  }

  // ============================================================
  // MODE B: DIRECT CHECKOUT
  // ============================================================

  return (
    <div
      className="mkt-offer-overlay"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mkt-checkout-title"
    >
      <div
        className="mkt-offer-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="mkt-offer-modal__header">
          <div className="mkt-offer-modal__badge">
            <FiTag aria-hidden="true" />
            <span>
              {t("make_offer_modal.header.title", {
                defaultValue: "Checkout",
              })}
            </span>
          </div>

          {renderCloseButton()}
        </header>

        <form
          className="mkt-offer-modal__form"
          onSubmit={(event) => {
            event.preventDefault();
            void handleCheckout(currentPrice);
          }}
        >
          <div className="mkt-offer-modal__body">
            <h2
              id="mkt-checkout-title"
              className="mkt-offer-modal__title"
            >
              {t("make_offer_modal.header.title", {
                defaultValue: "Order summary",
              })}
            </h2>

            <p className="mkt-offer-modal__description">
              {t("make_offer_modal.header.message", {
                defaultValue:
                  "Review your order before proceeding to secure payment.",
              })}
            </p>

            <div className="mkt-offer-modal__summary-box">
              <div className="mkt-offer-modal__summary-row">
                <span className="mkt-offer-modal__summary-label">
                  {t("make_offer_modal.summary.product_name", {
                    defaultValue: "Product",
                  })}
                </span>

                <strong className="mkt-offer-modal__summary-value">
                  {productName}
                </strong>
              </div>

              <div className="mkt-offer-modal__breakdown-table">
                <div className="mkt-offer-modal__summary-row">
                  <span className="mkt-offer-modal__summary-label">
                    {t("make_offer_modal.summary.list_price", {
                      defaultValue: "Item price",
                    })}
                  </span>

                  <span className="mkt-offer-modal__summary-value">
                    {formatPrice(currentPrice||Number(listing?.newPrice))} zł
                  </span>
                </div>

                <div className="mkt-offer-modal__summary-row">
                  <span className="mkt-offer-modal__summary-label">
                    {t("cart.summary.service_charge", {
                      defaultValue: "Service fee",
                    })}
                  </span>

                  <span className="mkt-offer-modal__summary-value">
                    {formatPrice(Number(service || Number(listing?.serviceCharge)))} zł
                  </span>
                </div>

                <div className="mkt-offer-modal__summary-row">
                  <span className="mkt-offer-modal__summary-label">
                    {t("cart.summary.shipping", {
                      defaultValue: "Shipping cost",
                    })}
                  </span>

                  <span className="mkt-offer-modal__summary-value">
                    {formatPrice(Number(shipment || Number(listing?.shippingCost)))} zł
                  </span>
                </div>

                <div className="mkt-offer-modal__summary-row mkt-offer-modal__summary-row--total">
                  <strong className="mkt-offer-modal__summary-label">
                    {t("cart.summary.total", {
                      defaultValue: "Total",
                    })}
                  </strong>

                  <strong className="mkt-offer-modal__summary-value mkt-offer-modal__summary-value--price">
                    {formatPrice(totalCheckoutCost)} zł
                  </strong>
                </div>
              </div>
            </div>

            {renderError()}
          </div>

          <footer className="mkt-offer-modal__footer">
            <button
              type="submit"
              className="mkt-offer-modal__btn mkt-offer-modal__btn--cart"
              disabled={isComponentProcessing}
            >
              {isCheckoutLoading ? (
                <span>
                  {t("checkout.processing", {
                    defaultValue: "Processing...",
                  })}
                </span>
              ) : (
                <>
                  <span>
                    {t("cart.summary.checkout_btn", {
                      defaultValue: "Secure checkout",
                    })}
                  </span>
                  <FiArrowRight aria-hidden="true" />
                </>
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default MakeOfferModal;
