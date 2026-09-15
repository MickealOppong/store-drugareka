import React, { useState } from "react";
import { FiCheckCircle, FiEdit, FiMapPin, FiX } from "react-icons/fi";
import { useAddAddressMutation } from "../features/api/cartApi";

export interface TAddress {
  id?: number;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  contact: string;
}



interface CartAddressManagerProps {
  savedAddress: TAddress | null;
}

const CartAddressManager: React.FC<CartAddressManagerProps> = ({ savedAddress }) => {
  const [createAddress, { isLoading: isSaving }] = useAddAddressMutation();
  const [editMode, setEditMode] = useState<boolean>(false);

  // 1. ISOLATED FORM STATE HOOK
  const [addressForm, setAddressForm] = useState<TAddress>({
    street: savedAddress?.street || "",
    city: savedAddress?.city || "",
    postalCode: savedAddress?.postalCode || "",
    country: savedAddress?.country || "Poland",
    contact: savedAddress?.contact || "",
  });

  // FIELD VALIDATION BUCKETS
  const [errors, setErrors] = useState({
    street: "",
    city: "",
    postalCode: "",
    contact: "",
  });

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    if (!editMode && savedAddress) {
      setAddressForm(savedAddress); // Revert back to original on cancel click triggers
    }
  };

  const handleInputChange = (field: keyof TAddress, value: string) => {
    setAddressForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" })); // Wipe errors reactively on typings
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({ street: "", city: "", postalCode: "", contact: "" });

    try {
      await createAddress(addressForm).unwrap();

        setEditMode(false);
      
    } catch (err: any) {
      console.error("Address validation constraint block caught:", err);
      // Capture Spring Boot MethodArgumentNotValidException structured map payloads
      if (err?.status === 403 && err?.data?.error) {
        const backendErrors = err.data.error;
        setErrors({
          street: backendErrors.street || "",
          city: backendErrors.city || "",
          postalCode: backendErrors.postalCode || "",
          contact: backendErrors.contact || "",
        });
        setEditMode(true);
      }
    }
  };

  return (
    <div className="cart-address-block">
      <div className="cart-address-block-header">
        <h3 className="cart-address-heading">
          <FiMapPin /> <span>Delivery Address</span>
        </h3>
        <button 
          type="button" 
          className={editMode ? "cancel" : "edit"} 
          onClick={toggleEditMode}
          title={editMode ? "Cancel modification" : "Edit address info"}
        >
          {editMode ? <FiX /> : <FiEdit />}
        </button>
      </div>

      {savedAddress && !editMode ? (
        <div className="cart-address-saved">
          <FiCheckCircle className="cart-address-check-icon" />
          <div className="cart-address-details">
            <p className="font-semibold text-main">{savedAddress.street}</p>
            <p>{savedAddress.postalCode} {savedAddress.city}</p>
            <p className="text-muted text-sm">{savedAddress.country}</p>
            <p className="cart-address-phone-text">📞 {savedAddress.contact}</p>
          </div>
        </div>
      ) : (
        <form className="cart-address-form" onSubmit={handleFormSubmit}>
          <div className="cart-form-row">
            <div className="cart-form-container">
              <div className="cart-form-group">
                <label htmlFor="street">Ulica i nr domu</label>
                <input
                  id="street"
                  type="text"
                  placeholder="np. Piotrkowska 12"
                  value={addressForm.street}
                  onChange={(e) => handleInputChange("street", e.target.value)}
                  required
                />
              </div>
              {errors.street && <span className="error">{errors.street}</span>}
            </div>

            <div className="cart-form-container">
              <div className="cart-form-group">
                <label htmlFor="contact">Telefon kontaktowy</label>
                <input
                  id="contact"
                  type="tel"
                  placeholder="np. +48 500 600 700"
                  value={addressForm.contact}
                  onChange={(e) => handleInputChange("contact", e.target.value)}
                  required
                />
              </div>
              {errors.contact && <span className="error">{errors.contact}</span>}
            </div>
          </div>

          <div className="cart-form-row">
            <div className="cart-form-container">
              <div className="cart-form-group">
                <label htmlFor="city">Miejscowość</label>
                <input
                  id="city"
                  type="text"
                  placeholder="np. Łódź"
                  value={addressForm.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  required
                />
              </div>
              {errors.city && <span className="error">{errors.city}</span>}
            </div>

            <div className="cart-form-container">
              <div className="cart-form-group">
                <label htmlFor="postalCode">Kod pocztowy</label>
                <input
                  id="postalCode"
                  type="text"
                  placeholder="np. 90-001"
                  value={addressForm.postalCode}
                  onChange={(e) => handleInputChange("postalCode", e.target.value)}
                  required
                />
              </div>
              {errors.postalCode && <span className="error">{errors.postalCode}</span>}
            </div>
          </div>

          <button 
            type="submit" 
            className="cart-address-save-btn" 
            disabled={isSaving}
          >
            {isSaving ? "Saving details..." : "Save Address Location"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CartAddressManager;
