import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiArrowRight, FiChevronDown, FiChevronUp, FiHelpCircle, FiShoppingBag, FiTag } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAppSelector } from "../store";
import "./../css/Help.css";

interface FAQItem {
  id: string;
  role: "buyer" | "seller";
  questionKey: string;
  answerKey: string;
}

const Help = () => {
  const { t } = useTranslation();
  const roles = useAppSelector((state) => state.userSlice.roles) || [];
  const [activeFaqId, setActiveFaqId] = useState<string | null>(null);
  const [activeRoleTab, setActiveRoleTab] = useState<"buyer" | "seller">("buyer");

  const buttonRedirectPath = roles.includes("ROLE_ADMIN") 
    ? "/account/admin" 
    : "/account";


  const faqs: FAQItem[] = [
    // === BUYER FAQS ===
    {
      id: "buy-process",
      role: "buyer",
      questionKey: "help.faqs.buyer.process.question",
      answerKey: "help.faqs.buyer.process.answer"
    },
    {
      id: "buy-escrow",
      role: "buyer",
      questionKey: "help.faqs.buyer.escrow.question",
      answerKey: "help.faqs.buyer.escrow.answer"
    },
    {
      id: "buy-shipping",
      role: "buyer",
      questionKey: "help.faqs.buyer.shipping.question",
      answerKey: "help.faqs.buyer.shipping.answer"
    },
    // === SELLER FAQS ===
    {
      id: "sell-listing",
      role: "seller",
      questionKey: "help.faqs.seller.listing.question",
      answerKey: "help.faqs.seller.listing.answer"
    },
    {
      id: "sell-pricing",
      role: "seller",
      questionKey: "help.faqs.seller.pricing.question",
      answerKey: "help.faqs.seller.pricing.answer"
    },
    {
      id: "sell-payout",
      role: "seller",
      questionKey: "help.faqs.seller.payout.question",
      answerKey: "help.faqs.seller.payout.answer"
    }
  ];

  const filteredFaqs = faqs.filter(faq => faq.role === activeRoleTab);

  const toggleAccordion = (id: string) => {
    setActiveFaqId(activeFaqId === id ? null : id);
  };

  return (
    <main className="help-center">
      {/* =====================================================
          1. HEADER TITLE SEGMENT
      ====================================================== */}
      <header className="help-center__header">
        <div className="help-center__icon-wrap">
          <FiHelpCircle />
        </div>
        <span className="help-center__eyebrow">{t("help.header.eyebrow")}</span>
        <h1 className="help-center__title">{t("help.header.title")}</h1>
        <p className="help-center__description">{t("help.header.description")}</p>
      </header>

      {/* =====================================================
          2. ROLE FILTER NAVIGATION TOGGLE SWITCH
      ====================================================== */}
      <div className="help-center__tabs">
        <button
          type="button"
          className={`help-center__tab-btn ${activeRoleTab === "buyer" ? "is-active" : ""}`}
          onClick={() => { setActiveRoleTab("buyer"); setActiveFaqId(null); }}
        >
          <FiShoppingBag />
          <span>{t("help.tabs.buyer")}</span>
        </button>
        <button
          type="button"
          className={`help-center__tab-btn ${activeRoleTab === "seller" ? "is-active" : ""}`}
          onClick={() => { setActiveRoleTab("seller"); setActiveFaqId(null); }}
        >
          <FiTag />
          <span>{t("help.tabs.seller")}</span>
        </button>
      </div>

      {/* =====================================================
          3. DYNAMIC ACCORDION MATRIX
      ====================================================== */}
      <section className="help-center__content-card">
        <div className="help-center__accordion">
          {filteredFaqs.map((faq) => {
            const isOpen = activeFaqId === faq.id;
            return (
              <div 
                key={faq.id} 
                className={`help-center__item ${isOpen ? "help-center__item--open" : ""}`}
              >
                <button
                  type="button"
                  className="help-center__trigger"
                  onClick={() => toggleAccordion(faq.id)}
                  aria-expanded={isOpen}
                >
                  <span className="help-center__question">{t(faq.questionKey)}</span>
                  <span className="help-center__chevron">
                    {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                  </span>
                </button>
                
                <div className="help-center__panel">
                  <p className="help-center__answer">{t(faq.answerKey)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          4. TERMINAL CONVERSION FOOTER
      ====================================================== */}
      <section className="help-center__cta-banner">
        <h2 className="help-center__cta-title">
          {activeRoleTab === "buyer" ? t("help.cta.buyer_title") : t("help.cta.seller_title")}
        </h2>
        <p className="help-center__cta-desc">
          {activeRoleTab === "buyer" ? t("help.cta.buyer_desc") : t("help.cta.seller_desc")}
        </p>
        <Link 
          to={activeRoleTab === "buyer" ? "/shop" : buttonRedirectPath + "/listings/new"} 
          className="sl-btn sl-btn--primary help-center__cta-btn"
        >
          {activeRoleTab === "buyer" ? t("help.cta.buyer_btn") : t("help.cta.seller_btn")} 
          <FiArrowRight />
        </Link>
      </section>
    </main>
  );
};

export default Help;
