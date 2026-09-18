import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { FiMail, FiMapPin, FiPhone, FiSend } from "react-icons/fi";
import './../css/ContactForm.css';

interface ContactFormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });
  
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    try {
      console.log("Submitting contact request payload:", formData);
      setStatus({ success: true, message: "Dziękujemy! Twoja wiadomość została wysłana pomyślnie." });
      setFormData({ fullName: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatus({ success: false, message: "Coś poszło nie tak. Spróbuj ponownie później." });
    }
  };

  return (
    <main className="contact-form-page">
      {/* =====================================================
                HEADER BLOCK
            ====================================================== */}
      <header className="contact-form-page__header">
        <div>
          <span className="contact-form-page__eyebrow">Pomoc</span>
          <h1 className="contact-form-page__title">Get in Touch</h1>
          <p className="contact-form-page__description">Masz pytania dotyczące drugirynek.pl? Napisz do nas.</p>
        </div>
      </header>

      {/* =====================================================
                STATUS FEEDBACK BANNER
            ====================================================== */}
      {status && (
        <output 
          className={`contact-form-page__feedback-banner ${
            status.success ? "contact-form-page__feedback-banner--success" : "contact-form-page__feedback-banner--error"
          }`} 
          aria-live="polite"
        >
          {status.message}
        </output>
      )}

      {/* =====================================================
                TWO-COLUMN LAYOUT BODY SPLIT
            ====================================================== */}
      <section className="contact-form-page__layout-grid">
        
        {/* LEFT COLUMN: CHANNELS DESCRIPTOR INFO ASIDE */}
        <aside className="contact-form-page__info-card">
          <h2 className="contact-form-page__info-title">Contact Information</h2>
          <p className="contact-form-page__info-description">Skontaktuj się bezpośrednio z naszym zespołem wsparcia.</p>

          <ul className="contact-form-page__channels-list">
            <li className="contact-form-page__channel-item">
              <div className="contact-form-page__icon-wrapper">
                <FiMail />
              </div>
              <div className="contact-form-page__text-wrapper">
                <strong>Email Us</strong>
                <p>support@drugirynek.pl</p>
              </div>
            </li>
            
            <li className="contact-form-page__channel-item">
              <div className="contact-form-page__icon-wrapper">
                <FiPhone />
              </div>
              <div className="contact-form-page__text-wrapper">
                <strong>Call Us</strong>
                <p>+48 123 456 789</p>
              </div>
            </li>
            
            <li className="contact-form-page__channel-item">
              <div className="contact-form-page__icon-wrapper">
                <FiMapPin />
              </div>
              <div className="contact-form-page__text-wrapper">
                <strong>Headquarters</strong>
                <p>Piotrków Trybunalski, Poland</p>
              </div>
            </li>
          </ul>
        </aside>

        {/* RIGHT COLUMN: CORE INTERACTIVE INPUT CARD */}
        <form onSubmit={handleFormSubmit} className="contact-form-page__input-card">
          
          <div className="contact-input-field">
            <label htmlFor="fullName" className="contact-input-field__label">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className="contact-input-field__input"
              placeholder="e.g. Jan Kowalski"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="contact-input-field">
            <label htmlFor="email" className="contact-input-field__label">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              className="contact-input-field__input"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="contact-input-field">
            <label htmlFor="subject" className="contact-input-field__label">Subject</label>
            <input
              id="subject"
              name="subject"
              type="text"
              className="contact-input-field__input"
              placeholder="How can we help you?"
              value={formData.subject}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="contact-input-field">
            <label htmlFor="message" className="contact-input-field__label">Message</label>
            <textarea
              id="message"
              name="message"
              rows={6}
              className="contact-input-field__textarea"
              placeholder="Wpisz tutaj treść swojej wiadomości..."
              value={formData.message}
              onChange={handleInputChange}
              required
            />
          </div>

          <footer className="contact-form-page__footer">
            <button type="submit" className="contact-form-page__submit-btn">
              <FiSend />
              <span>Send Message</span>
            </button>
          </footer>
        </form>

      </section>
    </main>
  );
};

export default ContactForm;
