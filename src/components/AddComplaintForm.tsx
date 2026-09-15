import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { FiAlertTriangle, FiArrowLeft, FiSend } from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAddComplaintMutation } from "../features/api/itemApi";
import "./../css/AddComplaintForm.css"; // Imports the dedicated complaint form stylesheet

interface ComplaintFormData {
  issue: string;
  description: string;
}

export const AddComplaintForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ComplaintFormData>({
    issue: "DELIVERY_ISSUE",
    description: "",
  });

  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  // RTK Mutation Hook for submitting the dispute to Spring Boot
  const [submitComplaint, { isLoading: isSubmitting }] =useAddComplaintMutation()

  const handleInputChange = (e: ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.description.trim() || !id) {
      return setStatus({ success: false, message: "Proszę uzupełnić szczegółowy opis problemu." });
    }

    setStatus(null);

    const dataToSend = new FormData()
    dataToSend.append("orderId",id)
    dataToSend.append("issue",formData.issue)
    dataToSend.append("description",formData.description)

    console.log(Object.fromEntries(dataToSend));
    
    try {
      const res = await submitComplaint(dataToSend).unwrap();
      console.log(res);
      

      setStatus({ 
        success: true, 
        message: "Zgłoszenie sporu zostało wysłane. Środki w systemie escrow zostały zamrożone do czasu weryfikacji przez administratora." 
      });
      
      //setFormData({ issue: "DELIVERY_ISSUE", description: "" });
      
      // Optional: Redirect back to orders dashboard after a brief delay
      setTimeout(() => {
        navigate("/account/orders");
      }, 3500);

    } catch (error) {
      console.error("Dispute registration crash:", error);
      setStatus({ 
        success: false, 
        message: "Nie udało się wysłać zgłoszenia. Upewnij się, że zamówienie kwalifikuje się do otwarcia sporu." 
      });
    }
  };

  return (
    <main className="complaint-form-page">
      {/* =====================================================
                NAVIGATION LINK HEADER
            ====================================================== */}
      <header className="complaint-form-page__back-header">
        <Link to={`/account/orders/${id}`} className="complaint-form-page__back-link">
          <FiArrowLeft /> <span>Powrót do zamówienia</span>
        </Link>
      </header>

      {/* =====================================================
                MAIN TITLES
            ====================================================== */}
      <section className="complaint-form-page__title-area">
        <span className="complaint-form-page__eyebrow">Centrum Rozstrzygania Sporów</span>
        <h1 className="complaint-form-page__title">Zgłoś problem z zamówieniem</h1>
        <p className="complaint-form-page__description">
          Masz problem z odebraną paczką lub dostawą? Utwórz oficjalne zgłoszenie reklamacyjne dla zamówienia #{id}.
        </p>
      </section>

      {/* =====================================================
                STATUS FEEDBACK ALERT BANNER
            ====================================================== */}
      {status && (
        <output 
          className={`complaint-form-page__alert-banner ${
            status.success ? "complaint-form-page__alert-banner--success" : "complaint-form-page__alert-banner--error"
          }`} 
          aria-live="polite"
        >
          <FiAlertTriangle className="complaint-form-page__alert-icon" />
          <span>{status.message}</span>
        </output>
      )}

      {/* =====================================================
                CORE INTERACTIVE DISPUTE INPUT BOX CARD
            ====================================================== */}
      <div className="complaint-form-page__card-body">
        <form onSubmit={handleFormSubmit} className="complaint-form-page__form">
          
          <div className="complaint-input-field">
            <label htmlFor="issueType" className="complaint-input-field__label">Powód zgłoszenia sporu</label>
            <select
              id="issueType"
              name="issueType"
              className="complaint-input-field__select"
              value={formData.issue}
              onChange={handleInputChange}
              required
            >
              <option value="DELIVERY_ISSUE">Przesyłka nie dotarła / brak statusu śledzenia</option>
              <option value="ITEM_MISMATCH">Towar uszkodzony lub niezgodny z opisem ogłoszenia</option>
              <option value="FRAUD">Podejrzenie próby wyłudzenia / oszustwa</option>
              <option value="OTHER">Inny problem techniczny lub logistyczny</option>
            </select>
          </div>

          <div className="complaint-input-field">
            <label htmlFor="description" className="complaint-input-field__label">Szczegółowy opis sytuacji</label>
            <textarea
              id="description"
              name="description"
              rows={7}
              className="complaint-input-field__textarea"
              placeholder="Opisz dokładnie sytuację (np. co jest uszkodzone, czego brakuje w paczce)..."
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <footer className="complaint-form-page__form-footer">
            <button 
              type="submit" 
              className="complaint-form-page__submit-btn" 
              disabled={isSubmitting}
            >
              <FiSend />
              <span>{isSubmitting ? "Wysyłanie zgłoszenia..." : "Otwórz oficjalny spór"}</span>
            </button>
          </footer>
        </form>
      </div>
    </main>
  );
};

export default AddComplaintForm;
