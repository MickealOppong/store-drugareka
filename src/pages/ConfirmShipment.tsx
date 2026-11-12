
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  FiAlertCircle,
  FiBox,
  FiCheckSquare,
  FiInfo,
  FiMapPin,
  FiSquare,
  FiTruck,
  FiXCircle,
} from "react-icons/fi";
import { useSearchParams } from "react-router";
import { Loading } from "../components";
import type { TAddress } from "../components/CartAddressManager";
import "../css/ConfirmShipment.css";
import {
  useConfirmShipmentMutation,
  useGetSellerShipmentsQuery,
} from "../features/api/authApi";
import type { TShipmentItemResponse } from "../types/TShipmentItemResponse";

type ShipmentResponse = {
  data: TShipmentItemResponse[] | null;
  httpStatus: number;
  message?: string | null;
};

const ConfirmShipment = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { t } = useTranslation();

  const [triggerCourierDispatch, { error }] =
    useConfirmShipmentMutation();

  const {
    isLoading: itemLoading,
    data,
  } = useGetSellerShipmentsQuery(token as string);

  const response = data as ShipmentResponse | undefined;

  console.log(data);
  

  const products = (response?.data ?? []) as (
    TShipmentItemResponse & { shipmentMethod?: string }
  )[];

  const responseMessage = (response?.message ?? "").toLocaleLowerCase("pl-PL");

  // API response states
  const isCancelled =
    responseMessage.includes("anulowan");

  const isAlreadyConfirmed =
    responseMessage.includes("confirmed") ||
    responseMessage.includes("potwierdzon");

  const hasNoItems = !itemLoading && products.length === 0;

  // All returned shipment items share the same shipment method.
  const shipmentMethod = products[0]?.shipmentMethod;

  const isPersonalPickup = shipmentMethod === "PERSONAL_PICKUP";

  // Seller address form states
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [instructions, setInstructions] = useState("");

  const [validationError, setValidationError] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);

    if (
      !name.trim() ||
      !street.trim() ||
      !city.trim() ||
      !postalCode.trim() ||
      !phone.trim() ||
      !country.trim()
    ) {
      setValidationError(
        t("confirm_shipment.errors.missing_fields")
      );
      return;
    }

    if (selectedItems.length === 0) {
      setValidationError(
        t("confirm_shipment.errors.no_items")
      );
      return;
    }

    const formData = new FormData();

    const address: TAddress = {
      street,
      city,
      postalCode,
      contact: phone,
      country,
    };

    formData.append("pickupAddress.street", address.street);
    formData.append("pickupAddress.city", address.city);
    formData.append("pickupAddress.postalCode", address.postalCode);
    formData.append("pickupAddress.country", address.country);
    formData.append("pickupAddress.contact", address.contact);

    formData.append("comment", instructions);
    formData.append("name", name);
    formData.append("token", String(token));
    formData.append("shipmentIds", String(selectedItems));

    try {
      setIsLoading(true);

      const result = await triggerCourierDispatch(formData).unwrap();

      if (result === true) {
        setIsSuccess(true);
      }
    } catch (err: unknown) {
      console.error("Shipment confirmation failed:", err);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleItemSelection = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const serverError =
    error && "data" in error
      ? (error.data as any)?.message
      : t("confirm_shipment.errors.network_fallback");

  if (itemLoading || isLoading) {
    return <Loading />;
  }

  // Cancelled order: HTTP 200, empty data, cancellation message.
  if (isCancelled) {
    return (
      <div className="al-confirm-shipment__status-page">
        <div className="al-confirm-shipment__cancelled">
          <FiXCircle className="al-confirm-shipment__status-icon" />

          <h1>
          {data?.message}
          </h1>

          <p>
            {t(
              "confirm_shipment.cancelled.description",
              "Nie musisz już podejmować żadnych działań związanych z wysyłką tego zamówienia."
            )}
          </p>
        </div>
      </div>
    );
  }

  // Shipment already confirmed.
  if (isAlreadyConfirmed) {
    return (
      <div className="al-confirm-shipment__status-page">
        <div className="al-confirm-shipment__success">
          <FiCheckSquare className="al-confirm-shipment__status-icon" />

          <h1>
            {t(
              "confirm_shipment.already_confirmed.title",
              "Wysyłka została potwierdzona"
            )}
          </h1>

          <p>
            {t(
              "confirm_shipment.already_confirmed.description",
              "Dane wysyłki zostały już potwierdzone."
            )}
          </p>
        </div>
      </div>
    );
  }

  // Successful confirmation submitted by the seller.
  if (isSuccess) {
    return (
      <div className="al-confirm-shipment__status-page">
        <div className="al-confirm-shipment__success">
          <FiCheckSquare className="al-confirm-shipment__status-icon" />

          <h1>
            {t(
              "confirm_shipment.success.title",
              "Wysyłka została potwierdzona"
            )}
          </h1>

          <p>
            {isPersonalPickup
              ? t(
                  "confirm_shipment.personal_pickup.success.description"
                )
              : t("confirm_shipment.success.description")}
          </p>
        </div>
      </div>
    );
  }

  // No active shipment items and no explicit cancellation message.
  if (hasNoItems) {
    return (
      <div className="al-confirm-shipment__status-page">
        <div className="al-confirm-shipment__cancelled">
          <FiInfo className="al-confirm-shipment__status-icon" />

          <h1>
            {t(
              "confirm_shipment.no_items.title",
              "Brak produktów do wysłania"
            )}
          </h1>

          <p>
            {t(
              "confirm_shipment.no_items.description",
              "Nie znaleziono aktywnych produktów przypisanych do tej wysyłki."
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="al-confirm-shipment">

      {/* LEFT COLUMN: Shipment information */}
      <div className="al-confirm-shipment__summary-pane">
        <h2 className="al-confirm-shipment__section-title">
          <FiBox />{" "}
          {isPersonalPickup
            ? t("confirm_shipment.personal_pickup.title")
            : t("confirm_shipment.title_step_1")}
        </h2>

        <div className="al-confirm-shipment__info-banner">
          <FiInfo className="al-confirm-shipment__banner-icon" />

          <div>
            <h4>
              {isPersonalPickup
                ? t("confirm_shipment.personal_pickup.title")
                : t("confirm_shipment.banner_title")}
            </h4>

            <p>
              {isPersonalPickup
                ? t("confirm_shipment.personal_pickup.banner_desc")
                : t("confirm_shipment.banner_desc")}
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="al-confirm-shipment__workspace-pane">

        {/* Products selection */}
        <div className="al-confirm-shipment__products-card">

          <h2 className="al-confirm-shipment__section-title">
            <FiBox />{" "}
            {t("confirm_shipment.select_products")}
          </h2>

          <div className="al-confirm-shipment_warning">
            <span>
              {"*"}
              {t("confirm_shipment.warning")}
            </span>
          </div>

          <div className="al-confirm-shipment__products-list">
            {products.map((item) => {
              const isChecked = selectedItems.includes(
                item.shipmentId
              );

              return (
                <div
                  key={item.shipmentId}
                  className={`al-confirm-shipment__product-row ${
                    isChecked
                      ? "al-confirm-shipment__product-row--selected"
                      : ""
                  }`}
                  onClick={() =>
                    toggleItemSelection(item.shipmentId)
                  }
                >
                  <div className="al-confirm-shipment__product-info">
                    <p className="al-confirm-shipment__product-name">
                      {t("confirm_shipment.product_label")}:{" "}
                      {item.productName}
                    </p>

                    <span className="al-confirm-shipment__product-sub">
                      {t("confirm_shipment.verified_status")}
                    </span>
                  </div>

                  <div className="al-confirm-shipment__checkbox-wrapper">
                    {isChecked ? (
                      <FiCheckSquare className="checkbox-icon active" />
                    ) : (
                      <FiSquare className="checkbox-icon" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Seller address confirmation */}
        <div className="al-confirm-shipment__form-pane">

          <h2 className="al-confirm-shipment__section-title">
            <FiMapPin />{" "}
            {isPersonalPickup
              ? t("confirm_shipment.personal_pickup.address_title")
              : t("confirm_shipment.title_step_2")}
          </h2>

          <form
            onSubmit={handleFormSubmit}
            className="al-confirm-shipment__form"
          >
            <div className="al-confirm-shipment__form-grid">

              {/* Seller name */}
              <div className="logistics-modal__field">
                <label
                  htmlFor="pickup-name"
                  className="logistics-modal__label"
                >
                  {t("confirm_shipment.fields.sender_name")}
                </label>

                <input
                  id="pickup-name"
                  type="text"
                  className="logistics-modal__input"
                  placeholder="Jonas Czerwony"
                  value={name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setName(e.target.value)
                  }
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Street */}
              <div className="logistics-modal__field">
                <label
                  htmlFor="pickup-street"
                  className="logistics-modal__label"
                >
                  {t("confirm_shipment.fields.street")}
                </label>

                <input
                  id="pickup-street"
                  type="text"
                  className="logistics-modal__input"
                  placeholder={t(
                    "confirm_shipment.placeholders.street"
                  )}
                  value={street}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setStreet(e.target.value)
                  }
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Postal code and city */}
              <div className="al-confirm-shipment__form-row">

                <div className="logistics-modal__field">
                  <label
                    htmlFor="pickup-postal"
                    className="logistics-modal__label"
                  >
                    {t("confirm_shipment.fields.postal_code")}
                  </label>

                  <input
                    id="pickup-postal"
                    type="text"
                    className="logistics-modal__input"
                    placeholder={t(
                      "confirm_shipment.placeholders.postal_code"
                    )}
                    value={postalCode}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setPostalCode(e.target.value)
                    }
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="logistics-modal__field">
                  <label
                    htmlFor="pickup-city"
                    className="logistics-modal__label"
                  >
                    {t("confirm_shipment.fields.city")}
                  </label>

                  <input
                    id="pickup-city"
                    type="text"
                    className="logistics-modal__input"
                    placeholder={t(
                      "confirm_shipment.placeholders.city"
                    )}
                    value={city}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setCity(e.target.value)
                    }
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Phone and country */}
              <div className="al-confirm-shipment__form-row">

                <div className="logistics-modal__field">
                  <label
                    htmlFor="pickup-phone"
                    className="logistics-modal__label"
                  >
                    {t("confirm_shipment.fields.phone")}
                  </label>

                  <input
                    id="pickup-phone"
                    type="tel"
                    className="logistics-modal__input"
                    placeholder={t(
                      "confirm_shipment.placeholders.phone"
                    )}
                    value={phone}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setPhone(e.target.value)
                    }
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="logistics-modal__field">
                  <label
                    htmlFor="country"
                    className="logistics-modal__label"
                  >
                    {t("confirm_shipment.fields.country")}
                  </label>

                  <input
                    id="country"
                    type="text"
                    className="logistics-modal__input"
                    placeholder="Poland"
                    value={country}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setCountry(e.target.value)
                    }
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Additional instructions */}
              <div className="logistics-modal__field">
                <label
                  htmlFor="pickup-notes"
                  className="logistics-modal__label"
                >
                  {t("confirm_shipment.fields.notes")}
                </label>

                <textarea
                  id="pickup-notes"
                  className="logistics-modal__textarea"
                  rows={3}
                  placeholder="np. I piętro, jest winda towarowa..."
                  value={instructions}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setInstructions(e.target.value)
                  }
                  disabled={isLoading}
                />
              </div>

              {/* Validation and server errors */}
              {(validationError || error) && (
                <div
                  className="panel-view__error-box style-alert-error"
                  style={{ marginTop: "16px" }}
                >
                  <FiAlertCircle style={{ flexShrink: 0 }} />

                  <span>
                    {validationError || serverError}
                  </span>
                </div>
              )}

              {/* Confirmation button */}
              <button
                type="submit"
                className="cart-address-save-btn al-confirm-shipment__submit-btn"
                disabled={isLoading || selectedItems.length === 0}
              >
                {isPersonalPickup ? <FiMapPin /> : <FiTruck />}

                <span>
                  {isPersonalPickup
                    ? t(
                        "confirm_shipment.personal_pickup.confirm_button",
                        "Potwierdź adres odbioru"
                      )
                    : t("confirm_shipment.buttons.submit_ready")}
                </span>
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmShipment;
