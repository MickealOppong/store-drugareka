import {
    FiArrowRight,
    FiCheck,
    FiCreditCard,
    FiHelpCircle,
    FiPackage,
    FiShield,
    FiTag,
    FiTruck
} from "react-icons/fi";
import { Link } from "react-router-dom";

import { useAppSelector } from "../store";
import "./../css/Sell.css";


const Sell = () => {
const roles = useAppSelector((state)=>state.userSlice.roles)


    return (

        <main className="sell-page">


            {/* =====================================================
                HERO
            ====================================================== */}

            <section className="sell-hero">

                <div className="sell-hero__content">

                    <span className="sell-hero__eyebrow">
                        SPRZEDAJ Z DRUGĄ RĘKĄ
                    </span>

                    <h1>
                        Masz coś,
                        <br />
                        czego już nie potrzebujesz?
                    </h1>

                    <p>
                        Wystaw swój produkt i pozwól nam
                        zająć się jego sprzedażą.
                    </p>

                    <div className="sell-hero__actions">

                        <Link
                            to={`${roles.includes("ROLE_ADMIN")?"/account/admin":"/account/user/"}`}
                            className="sell-primary-button"
                        >
                            Zacznij sprzedawać
                            <FiArrowRight />
                        </Link>

                        <a
                            href="#how-it-works"
                            className="sell-secondary-button"
                        >
                            Jak to działa?
                        </a>

                    </div>

                </div>


                <div className="sell-hero__visual">

                    <div className="sell-hero__card">

                        <div className="sell-hero__card-icon">
                            <FiPackage />
                        </div>

                        <span>
                            Twój produkt
                        </span>

                        <strong>
                            Może dostać drugie życie.
                        </strong>

                    </div>

                    <div className="sell-hero__floating-card">

                        <FiCheck />

                        <div>
                            <strong>
                                Prosty proces
                            </strong>

                            <span>
                                Bez skomplikowanych formalności
                            </span>
                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                HOW IT WORKS
            ====================================================== */}

            <section
                className="sell-process"
                id="how-it-works"
            >

                <div className="sell-section-heading">

                    <span>
                        PROSTY PROCES
                    </span>

                    <h2>
                        Jak to działa?
                    </h2>

                    <p>
                        Od produktu, którego już nie używasz,
                        do sprzedaży w kilku prostych krokach.
                    </p>

                </div>


                <div className="sell-process__steps">


                    <article className="sell-step">

                        <div className="sell-step__number">
                            01
                        </div>

                        <div className="sell-step__icon">
                            <FiPackage />
                        </div>

                        <h3>
                            Dodaj produkt
                        </h3>

                        <p>
                            Opisz produkt, dodaj zdjęcia,
                            wybierz kategorię i określ cenę,
                            którą chcesz otrzymać.
                        </p>

                    </article>


                    <article className="sell-step">

                        <div className="sell-step__number">
                            02
                        </div>

                        <div className="sell-step__icon">
                            <FiTag />
                        </div>

                        <h3>
                            My zajmiemy się sprzedażą
                        </h3>

                        <p>
                            Produkt pojawi się w naszym sklepie
                            w cenie ustalonej przez Druga Ręka.
                        </p>

                    </article>


                    <article className="sell-step">

                        <div className="sell-step__number">
                            03
                        </div>

                        <div className="sell-step__icon">
                            <FiTruck />
                        </div>

                        <h3>
                            Wyślij produkt
                        </h3>

                        <p>
                            Gdy ktoś kupi produkt, otrzymasz
                            informację i instrukcję wysyłki.
                        </p>

                    </article>


                    <article className="sell-step">

                        <div className="sell-step__number">
                            04
                        </div>

                        <div className="sell-step__icon">
                            <FiCreditCard />
                        </div>

                        <h3>
                            Otrzymaj wypłatę
                        </h3>

                        <p>
                            Po zakończeniu transakcji otrzymasz
                            należną Ci kwotę.
                        </p>

                    </article>

                </div>

            </section>


            {/* =====================================================
                SELLER BENEFITS
            ====================================================== */}

            <section className="sell-benefits">

                <div className="sell-benefits__content">

                    <span className="sell-section-label">
                        DLACZEGO DRUGA RĘKA?
                    </span>

                    <h2>
                        Sprzedawaj bez
                        budowania własnego sklepu.
                    </h2>

                    <p>
                        Ty masz produkt. My zapewniamy miejsce,
                        w którym może znaleźć nowego właściciela.
                    </p>


                    <ul>

                        <li>
                            <FiCheck />
                            <span>
                                Proste dodawanie produktów
                            </span>
                        </li>

                        <li>
                            <FiCheck />
                            <span>
                                Nie musisz tworzyć własnego sklepu
                            </span>
                        </li>

                        <li>
                            <FiCheck />
                            <span>
                                Docierasz do nowych kupujących
                            </span>
                        </li>

                        <li>
                            <FiCheck />
                            <span>
                                Jasne zasady sprzedaży
                            </span>
                        </li>

                    </ul>

                    <Link
                       to={`${roles.includes("ROLE_ADMIN")?"/account/admin":"/account/user/"}`}
                        className="sell-primary-button"
                    >
                        Dodaj pierwszy produkt
                        <FiArrowRight />
                    </Link>

                </div>


                <div className="sell-benefits__visual">

                    <div className="sell-benefits__box">

                        <FiShield />

                        <h3>
                            Twój produkt.
                        </h3>

                        <strong>
                            Nasza platforma.
                        </strong>

                        <p>
                            Połączmy je.
                        </p>

                    </div>

                </div>

            </section>


            {/* =====================================================
                SELLER MODEL
            ====================================================== */}

            <section className="sell-model">

                <div className="sell-section-heading">

                    <span>
                        NASZ MODEL
                    </span>

                    <h2>
                        Ty ustalasz swoją cenę.
                    </h2>

                    <p>
                        Druga Ręka ustala cenę sprzedaży
                        dla klienta końcowego.
                    </p>

                </div>


                <div className="sell-model__grid">


                    <div className="sell-model__card">

                        <span>
                            TWOJA CENA
                        </span>

                        <strong>
                            500 zł
                        </strong>

                        <p>
                            Kwota, którą chcesz otrzymać
                            za produkt.
                        </p>

                    </div>


                    <div className="sell-model__arrow">
                        <FiArrowRight />
                    </div>


                    <div className="sell-model__card sell-model__card--highlight">

                        <span>
                            CENA W SKLEPIE
                        </span>

                        <strong>
                            649 zł
                        </strong>

                        <p>
                            Cena ustalona przez Druga Ręka
                            dla kupującego.
                        </p>

                    </div>

                </div>

            </section>


            {/* =====================================================
                FAQ / HELP
            ====================================================== */}

            <section className="sell-help">

                <div className="sell-help__icon">
                    <FiHelpCircle />
                </div>

                <div>

                    <h2>
                        Masz pytania dotyczące sprzedaży?
                    </h2>

                    <p>
                        Dowiedz się więcej o zasadach,
                        wypłatach i procesie wysyłki.
                    </p>

                </div>

                <Link to="/help/selling">
                    Dowiedz się więcej
                    <FiArrowRight />
                </Link>

            </section>


            {/* =====================================================
                FINAL CTA
            ====================================================== */}

            <section className="sell-final-cta">

                <span>
                    GOTOWY?
                </span>

                <h2>
                    Daj swoim rzeczom
                    drugie życie.
                </h2>

                <p>
                    Dodaj produkt i zacznij sprzedawać.
                </p>

                <Link
                  to={`${roles.includes("ROLE_ADMIN")?"/account/admin":"/account/user/"}`}
                    className="sell-primary-button"
                >
                    Zacznij sprzedawać
                    <FiArrowRight />
                </Link>

            </section>

        </main>

    );

};


export default Sell;