import React, { useEffect } from "react";
import { FiAlertTriangle, FiClock, FiDollarSign, FiFileText, FiShield } from "react-icons/fi";
import "./../css/TermsAndConditions.scss";

export const TermsAndConditions: React.FC = () => {
  // Automatyczne przewijanie okna na samą górę po zamontowaniu strony
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="terms-page">
      {/* =====================================================
          NAGŁÓWEK STRONY
          ====================================================== */}
      <header className="terms-page__header">
        <div className="terms-page__badge">
          <FiShield /> Ramy Prawne
        </div>
        <h1 className="terms-page__title">Regulamin i Warunki Korzystania</h1>
        <p className="terms-page__description">
          Witamy w Kasoa.pl. Prosimy o zapoznanie się z zasadami transakcyjnymi regulującymi działanie naszego ekosystemu handlowego.
        </p>
      </header>

      {/* =====================================================
          TREŚĆ REGULAMINU
          ====================================================== */}
      <div className="terms-page__content">
        
        {/* SEKCJA 1: ZERO CONTACT */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiShield /> <span>1. Polityka Bezobsługowa (Zero-Contact)</span>
          </h2>
          <p className="terms-page__text">
            Kasoa.pl działa wyłącznie jako bezkontaktowa platforma handlowa. Bezpośrednie wiadomości, moduły czatu oraz publiczne komentarze między kupującymi a sprzedającymi zostały całkowicie usunięte z architektury serwisu w celu zapewnienia pełnej ochrony transakcji oraz prywatności użytkowników.
          </p>
          <p className="terms-page__text">
            Sprzedawcy działają jako partnerzy logistyczni. Jakiekolwiek próby wymiany numerów telefonów, danych bankowych, linków zewnętrznych lub organizowania fizycznych spotkań poza platformą stanowią istotne naruszenie niniejszej umowy i będą skutkować permanentną blokadą konta.
          </p>
        </section>

        {/* SEKCJA 2: STAŁE CENY */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiDollarSign /> <span>2. Stałe Ceny i Absolutna Przejrzystość</span>
          </h2>
          <p className="terms-page__text">
            Wszystkie oferty na Kasoa.pl przedstawiają ostateczne ceny detaliczne. Negocjacje i zaniżone oferty są strukturalnie zablokowane przez interfejs. Kupujący płacą dokładnie taką kwotę, jaka wyświetla się na ekranie podsumowania zamówienia, powiększoną o standardową zryczałtowaną opłatę kurierską.
          </p>
          <p className="terms-page__text">
            Sprzedawcy zachowują autonomiczną kontrolę nad szybkością rotacji swojego asortymentu. Mogą oni dynamicznie aktualizować ceny swoich produktów z poziomu panelu sprzedawcy w celu przyspieszenia sprzedaży, jednak po rozpoczęciu procesu płatności przez kupującego cena zostaje zablokowana.
          </p>
        </section>

        {/* SEKCJA 3: ESCROW I PROCESOR TŁA */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiClock /> <span>3. Ochrona Escrow i Automatyczne Uwalnianie Środków</span>
          </h2>
          <p className="terms-page__text">
            W momencie pomyślnego autoryzowania płatności przez bezpieczne kanały Stripe, 100% środków zostaje zamrożone w bezpiecznej puli powierniczej (escrow) Kasoa. Środki te są w pełni zabezpieczone i nie trafiają bezpośrednio na konto sprzedawcy.
          </p>
          
          {/* BANER OSTRZEGAWCZY CRON */}
          <div className="terms-page__highlight-box">
            <FiAlertTriangle className="terms-page__highlight-icon" />
            <div className="terms-page__highlight-text">
              <strong>Automatyczne Rozliczenie po 14 Dniach:</strong> Środki są automatycznie uwalniane na saldo wypłat sprzedawcy dokładnie 14 dni po oznaczeniu paczki przez kuriera jako dostarczona, chyba że kupujący zarejestruje oficjalne zgłoszenie sporne.
            </div>
          </div>
          
          <p className="terms-page__text">
            Jeśli kupujący odbierze przesyłkę, ale zapomni kliknąć przycisk potwierdzenia odbioru, nasz autonomiczny procesor tła co noc weryfikuje bazę danych i zamyka transakcję, gwarantując terminowe rozliczenie dla sprzedawców.
          </p>
        </section>

        {/* SEKCJA 4: SPORY */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiFileText /> <span>4. Zgłoszenia Sporne i Integralność Produktu</span>
          </h2>
          <p className="terms-page__text">
            Kupujący mogą otworzyć zgłoszenie sporne z poziomu swojego panelu, jeśli przedmiot dotrze uszkodzony lub nie odpowiada opisowi katalogowemu. Zgłoszenie sporu natychmiast zatrzymuje 14-dniowy licznik automatycznego rozliczenia i zamraża środki w escrow do czasu weryfikacji przez administratora.
          </p>
          <p className="terms-page__text">
            Ponieważ kupujący płacą dokładnie to, co widzą w pełnej osłonie escrow, zweryfikowane wadliwe dostawy kwalifikują się do bezpośredniego zwrotu środków. Nieuzasadnione spory otwierane wyłącznie w celu ominięcia warunków stałych cen będą odrzucane na starcie.
          </p>
        </section>

      </div>
    </main>
  );
};

export default TermsAndConditions;
