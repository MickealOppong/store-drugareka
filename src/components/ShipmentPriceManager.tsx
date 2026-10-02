import { useState, type ChangeEvent, type FormEvent } from "react";
import {
    FiAlertCircle,
    FiCheckCircle,
    FiDollarSign,
    FiLayers,
    FiTruck,
} from "react-icons/fi";
import { useNavigate, useRevalidator } from "react-router";
import "../css/ShippingPrice.css";
import { ITEM_SIZE, SHIPPING_METHOD } from "../data/data";
import { useAddCourierPriceMutation } from "../features/api/itemApi";
import type { TShipmentPriceInput } from "../types/TShipmentPriceInput";

const ShipmentPriceManager = () => {
  const { revalidate } = useRevalidator();

  const [formData, setFormData] = useState<TShipmentPriceInput>({
    itemSize: "",
    shippingMethod: "",
    price: "0.00",
    active: true,
  });

  const [isSubmitting, setIsLoading] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const [addCourierPrice] = useAddCourierPriceMutation();
  const navigate = useNavigate()

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSaveSuccess(false);
    setSubmissionError(null);
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
      setFormData((prev) => ({
        ...prev,
        price: value,
      }));
      setSaveSuccess(false);
      setSubmissionError(null);
    }
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      active: e.target.checked,
    }));
    setSaveSuccess(false);
    setSubmissionError(null);
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveSuccess(false);
    setSubmissionError(null);

    const payload: TShipmentPriceInput = {
        itemSize: formData.itemSize,
        shippingMethod: formData.shippingMethod,
        price: formData.price,
        active: formData.active,
    };

       console.log(payload);
       

    try {
      await addCourierPrice(payload).unwrap();
      setSaveSuccess(true);
      revalidate();
      navigate(-1)
    } catch (err: any) {
      console.error("Failed to propagate updated logistics matrix data down to DB:", err);
      const {status} =err as {status:number,data:any}
      if(status===500){
        setSubmissionError("Server error,please check data and try again")
      }
      const {itemSize,shippingMethod,price,category} =  err?.data.error as {itemSize:string,shippingMethod:string,price:number,category:string}
      setSubmissionError(`${itemSize?itemSize:''} \n${shippingMethod?shippingMethod:''}\n${price}\n${category?category:''}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="shipment-price-manager">
      {/* HEADER SECTION */}
      <header className="shipment-price-manager__header">
        <div>
          <span className="shipment-price-manager__eyebrow">Logistics Management</span>
          <h1 className="shipment-price-manager__title">Shipping Price Manager</h1>
          <p className="shipment-price-manager__description">
            Configure flat rates and routing rules for the Kasoa.pl courier delivery networks.
          </p>
        </div>
      </header>

      {/* CONTENT WORKSPACE */}
      <div className="shipment-price-manager__content">
        <section className="shipment-price-manager__form-card">
          <form className="shipment-price-manager__form" onSubmit={handleFormSubmit}>
            
            {/* BOXING SIZE SELECTOR */}
            <div className="shipment-price-manager__field">
              <label htmlFor="shippingSize" className="shipment-price-manager__label">
                <FiLayers /> Cargo Size Tier *
              </label>
              <select
                id="shippingSize"
                name="itemSize"
                value={formData.itemSize}
                onChange={handleSelectChange}
                disabled={isSubmitting}
                className="shipment-price-manager__select"
              >
                  <option value="" disabled>Select option</option>
                {ITEM_SIZE.map((size) => (
                  <option key={size.id} value={size.value}>
                    {size.name}
                  </option>
                ))}
              </select>
            </div>

            {/* LOGISTICS CARRIER METHOD SELECTOR */}
            <div className="shipment-price-manager__field">
              <label htmlFor="shippingMethod" className="shipment-price-manager__label">
                <FiTruck /> Shipping Method *
              </label>
              <select
                id="shippingMethod"
                name="shippingMethod"
                value={formData.shippingMethod}
                onChange={handleSelectChange}
                disabled={isSubmitting}
                className="shipment-price-manager__select"
              >
                <option value="" disabled>Select option</option>
                {SHIPPING_METHOD.map((method) => (
                    
                     <option key={method.value} value={method.value}>
                    {method.method}
                  </option>
                ))}
              </select>
            </div>


            {/* CURRENCY GROSS VALUE INPUT */}
            <div className="shipment-price-manager__field shipment-price-manager__field--price">
              <label htmlFor="price" className="shipment-price-manager__label">
                <FiDollarSign /> Gross Flat Rate (Price PLN) *
              </label>
              <div className="shipment-price-manager__price-wrapper">
                <span className="shipment-price-manager__currency">PLN</span>
                <input
                  id="price"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handlePriceChange}
                  disabled={isSubmitting}
                  required
                  className="shipment-price-manager__price-input"
                />
              </div>
            </div>

            {/* SYSTEM ACTIVE TOGGLE */}
            <label className="shipment-price-manager__checkbox">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                disabled={isSubmitting}
                onChange={handleCheckboxChange}
              />
              <span>Active</span>
            </label>

            {/* EXCEPTION RUNTIME ALERTS */}
            {submissionError && (
              <div className="shipment-price-manager__message shipment-price-manager__message--error">
                <FiAlertCircle />
                <span>{submissionError}</span>
              </div>
            )}

            {saveSuccess && (
              <div className="shipment-price-manager__message shipment-price-manager__message--success">
                <FiCheckCircle />
                <span>Logistics pricing matrix rule successfully applied.</span>
              </div>
            )}

            {/* FORM ACTION SUBMIT TRIGGER */}
            <button
              type="submit"
              className="shipment-price-manager__submit"
              disabled={isSubmitting || !formData.price}
            >
              {isSubmitting ? "Saving rule..." : "Save Pricing Rule"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default ShipmentPriceManager;
