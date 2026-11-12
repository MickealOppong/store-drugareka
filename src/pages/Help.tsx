
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FiArrowRight,
  FiChevronDown,
  FiChevronUp,
  FiHelpCircle,
  FiShoppingBag,
  FiTag
} from "react-icons/fi";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "./../css/Help.css";

interface FAQItem {
  id: string;
  role: "buyer" | "seller";
  questionKey: string;
  answerKey: string;
}

const Help = () => {
  const { t } = useTranslation();

  const [activeFaqId, setActiveFaqId] = useState<string | null>(null);
  const [activeRoleTab, setActiveRoleTab] = useState<"buyer" | "seller">("buyer");

  const buttonRedirectPath = "/account";

  const faqs: FAQItem[] = [
    // ================= BUYER FAQS =================
    {
      id: "buy-process",
      role: "buyer",
      questionKey: "help.faqs.buyer.process.question",
      answerKey: "help.faqs.buyer.process.answer"
    },
    {
      id: "buy-payment",
      role: "buyer",
      questionKey: "help.faqs.buyer.payment.question",
      answerKey: "help.faqs.buyer.payment.answer"
    },
    {
      id: "buy-shipping",
      role: "buyer",
      questionKey: "help.faqs.buyer.shipping.question",
      answerKey: "help.faqs.buyer.shipping.answer"
    },
    {
      id: "buy-collection",
      role: "buyer",
      questionKey: "help.faqs.buyer.collection.question",
      answerKey: "help.faqs.buyer.collection.answer"
    },
    {
      id: "buy-confirmation",
      role: "buyer",
      questionKey: "help.faqs.buyer.confirmation.question",
      answerKey: "help.faqs.buyer.confirmation.answer"
    },
    {
      id: "buy-returns",
      role: "buyer",
      questionKey: "help.faqs.buyer.returns.question",
      answerKey: "help.faqs.buyer.returns.answer"
    },
    {
      id: "buy-misrepresentation",
      role: "buyer",
      questionKey: "help.faqs.buyer.misrepresentation.question",
      answerKey: "help.faqs.buyer.misrepresentation.answer"
    },
    {
      id: "buy-cancellation",
      role: "buyer",
      questionKey: "help.faqs.buyer.cancellation.question",
      answerKey: "help.faqs.buyer.cancellation.answer"
    },
    {
      id: "buy-service-charge",
      role: "buyer",
      questionKey: "help.faqs.buyer.service_charge.question",
      answerKey: "help.faqs.buyer.service_charge.answer"
    },
    {
      id: "buy-delivery-problems",
      role: "buyer",
      questionKey: "help.faqs.buyer.delivery_problems.question",
      answerKey: "help.faqs.buyer.delivery_problems.answer"
    },

    // ================= SELLER FAQS =================
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
      id: "sell-verification",
      role: "seller",
      questionKey: "help.faqs.seller.verification.question",
      answerKey: "help.faqs.seller.verification.answer"
    },
    {
      id: "sell-shipping",
      role: "seller",
      questionKey: "help.faqs.seller.shipping.question",
      answerKey: "help.faqs.seller.shipping.answer"
    },
    {
      id: "sell-payout",
      role: "seller",
      questionKey: "help.faqs.seller.payout.question",
      answerKey: "help.faqs.seller.payout.answer"
    },
    {
      id: "sell-fees",
      role: "seller",
      questionKey: "help.faqs.seller.fees.question",
      answerKey: "help.faqs.seller.fees.answer"
    },
    {
      id: "sell-cancellation",
      role: "seller",
      questionKey: "help.faqs.seller.cancellation.question",
      answerKey: "help.faqs.seller.cancellation.answer"
    },
    {
      id: "sell-accuracy",
      role: "seller",
      questionKey: "help.faqs.seller.accuracy.question",
      answerKey: "help.faqs.seller.accuracy.answer"
    }
  ];

  const filteredFaqs = faqs.filter(
    (faq) => faq.role === activeRoleTab
  );

  const toggleAccordion = (id: string) => {
    setActiveFaqId((currentId) => currentId === id ? null : id);
  };

  const changeRoleTab = (role: "buyer" | "seller") => {
    setActiveRoleTab(role);
    setActiveFaqId(null);
  };

  return (
    <>
    <main className="help-center">

      {/* ================= HEADER ================= */}
      <header className="help-center__header">
        <div className="help-center__icon-wrap">
          <FiHelpCircle />
        </div>

        <span className="help-center__eyebrow">
          {t("help.header.eyebrow")}
        </span>

        <h1 className="help-center__title">
          {t("help.header.title")}
        </h1>

        <p className="help-center__description">
          {t("help.header.description")}
        </p>
      </header>

      {/* ================= ROLE TABS ================= */}
      <div className="help-center__tabs">
        <button
          type="button"
          className={`help-center__tab-btn ${
            activeRoleTab === "buyer" ? "is-active" : ""
          }`}
          onClick={() => changeRoleTab("buyer")}
        >
          <FiShoppingBag />
          <span>{t("help.tabs.buyer")}</span>
        </button>

        <button
          type="button"
          className={`help-center__tab-btn ${
            activeRoleTab === "seller" ? "is-active" : ""
          }`}
          onClick={() => changeRoleTab("seller")}
        >
          <FiTag />
          <span>{t("help.tabs.seller")}</span>
        </button>
      </div>

      {/* ================= FAQ ACCORDION ================= */}
      <section className="help-center__content-card">
        <div className="help-center__accordion">
          {filteredFaqs.map((faq) => {
            const isOpen = activeFaqId === faq.id;

            return (
              <div
                key={faq.id}
                className={`help-center__item ${
                  isOpen ? "help-center__item--open" : ""
                }`}
              >
                <button
                  type="button"
                  className="help-center__trigger"
                  onClick={() => toggleAccordion(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${faq.id}`}
                >
                  <span className="help-center__question">
                    {t(faq.questionKey)}
                  </span>

                  <span className="help-center__chevron">
                    {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                  </span>
                </button>

                <div
                  id={`faq-panel-${faq.id}`}
                  className="help-center__panel"
                  hidden={!isOpen}
                >
                  <p className="help-center__answer">
                    {t(faq.answerKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= CTA FOOTER ================= */}
      <section className="help-center__cta-banner">
        <h2 className="help-center__cta-title">
          {activeRoleTab === "buyer"
            ? t("help.cta.buyer_title")
            : t("help.cta.seller_title")}
        </h2>

        <p className="help-center__cta-desc">
          {activeRoleTab === "buyer"
            ? t("help.cta.buyer_desc")
            : t("help.cta.seller_desc")}
        </p>

        <Link
          to={
            activeRoleTab === "buyer"
              ? "/shop"
              : `${buttonRedirectPath}/listings/new`
          }
          className="sl-btn sl-btn--primary help-center__cta-btn"
        >
          {activeRoleTab === "buyer"
            ? t("help.cta.buyer_btn")
            : t("help.cta.seller_btn")}

          <FiArrowRight />
        </Link>
      </section>

    </main>
    <Footer/>
    </>
  );
};

export default Help;
