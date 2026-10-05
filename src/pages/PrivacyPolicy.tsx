import React, { useEffect } from 'react';
import {
  FiClock,
  FiEye,
  FiFileText,
  FiLock,
  FiMail,
  FiShare2,
  FiShield,
  FiUserCheck,
} from 'react-icons/fi';

import '../css/TermsAndConditions.scss';

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="terms-page">
      <header className="terms-page__header">
        <span className="terms-page__badge">
          <FiLock />
          RODO & Prywatność
        </span>

        <h1 className="terms-page__title">
          Polityka Prywatności Serwisu Kasoa.pl
        </h1>

        <p className="terms-page__lead">
          Niniejsza Polityka Prywatności określa zasady przetwarzania
          i ochrony danych osobowych Użytkowników w związku z korzystaniem
          z platformy Kasoa.pl oraz realizacją transakcji sprzedaży
          prywatnej.
        </p>

        <div className="terms-page__company-box">
          <p>
            <strong>Administrator Danych Osobowych:</strong>
          </p>

          <p>
            <strong>
              KASAWA SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ
            </strong>
          </p>

          <p>
            ul. Kostromska nr 55 lok. 95, 97-300 Piotrków Trybunalski, Polska
          </p>

          <p>
            KRS: 0001269876 | NIP: 7712946929 | REGON: 54582126100000
          </p>

          <p>
            E-mail: kasawa.corp@gmail.com | Tel.: +48 722 364 131
          </p>
        </div>
      </header>

      <div className="terms-page__content">

        {/* 1 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiShield />
            1. Postanowienia ogólne i zgodność z RODO
          </h2>

          <p className="terms-page__text">
            Administratorem danych osobowych Użytkowników przetwarzanych
            w związku z korzystaniem z Serwisu Kasoa.pl jest KASAWA SPÓŁKA
            Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ z siedzibą w Piotrkowie
            Trybunalskim.
          </p>

          <p className="terms-page__text">
            Dane osobowe są przetwarzane zgodnie z Rozporządzeniem
            Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia
            27 kwietnia 2016 r. („RODO”), właściwymi przepisami prawa
            polskiego dotyczącymi ochrony danych osobowych oraz innymi
            obowiązującymi przepisami prawa.
          </p>

          <p className="terms-page__text">
            KASAWA stosuje odpowiednie środki techniczne i organizacyjne
            mające na celu ochronę danych osobowych przed ich utratą,
            zniszczeniem, nieuprawnionym dostępem, ujawnieniem lub innym
            niezgodnym z prawem przetwarzaniem.
          </p>

          <p className="terms-page__text">
            KASAWA nie wyznaczyła Inspektora Ochrony Danych, jeżeli obowiązek
            jego wyznaczenia nie wynika z obowiązujących przepisów prawa.
          </p>
        </section>

        {/* 2 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiEye />
            2. Zakres, cele i podstawy prawne przetwarzania danych
          </h2>

          <p className="terms-page__text">
            KASAWA przetwarza dane osobowe wyłącznie w zakresie niezbędnym
            do prowadzenia Serwisu, realizacji Zamówień, obsługi płatności,
            dostaw, bezpieczeństwa oraz wykonywania obowiązków wynikających
            z przepisów prawa.
          </p>

          <ul className="terms-page__list">
            <li>
              <strong>Utworzenie i obsługa Konta:</strong> w szczególności
              adres e-mail, hasło oraz dane identyfikacyjne podane przez
              Użytkownika. Podstawą przetwarzania jest art. 6 ust. 1 lit. b
              RODO – wykonanie umowy lub podjęcie działań na żądanie osoby
              przed jej zawarciem.
            </li>

            <li>
              <strong>Realizacja Zamówień i dostaw:</strong> w szczególności
              imię i nazwisko, adres dostawy, kod pocztowy, miejscowość
              i numer telefonu wymagany przez operatora logistycznego.
              Podstawą przetwarzania jest art. 6 ust. 1 lit. b RODO.
            </li>

            <li>
              <strong>Obsługa płatności:</strong> dane niezbędne do
              przeprowadzenia i rozliczenia płatności za pośrednictwem
              PayU. Podstawą przetwarzania przez KASAWA może być
              art. 6 ust. 1 lit. b RODO oraz, w odpowiednim zakresie,
              art. 6 ust. 1 lit. c RODO.
            </li>

            <li>
              <strong>Obsługa reklamacji, zgłoszeń i sporów:</strong>
              dane niezbędne do rozpatrzenia zgłoszenia, ustalenia
              okoliczności sprawy oraz ochrony przed roszczeniami.
              Podstawą może być art. 6 ust. 1 lit. b, c lub f RODO,
              zależnie od charakteru sprawy.
            </li>

            <li>
              <strong>Wykonywanie obowiązków prawnych:</strong> dane
              wymagane do realizacji obowiązków podatkowych, rachunkowych,
              związanych z przeciwdziałaniem nadużyciom oraz innych
              obowiązków wynikających z prawa. Podstawą jest art. 6 ust. 1
              lit. c RODO.
            </li>

            <li>
              <strong>Bezpieczeństwo Serwisu i zapobieganie nadużyciom:</strong>
              dane techniczne, informacje dotyczące aktywności w Serwisie
              oraz informacje niezbędne do wykrywania i przeciwdziałania
              oszustwom, nadużyciom i naruszeniom Regulaminu. Podstawą może
              być art. 6 ust. 1 lit. f RODO.
            </li>
          </ul>
        </section>

        {/* 3 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiShare2 />
            3. Odbiorcy danych osobowych
          </h2>

          <p className="terms-page__text">
            Dane osobowe mogą być przekazywane podmiotom zewnętrznym
            wyłącznie w zakresie niezbędnym do realizacji określonych
            celów oraz na podstawie właściwej podstawy prawnej.
          </p>

          <div className="terms-page__highlight-box">
            <FiLock />

            <div>
              <strong>PayU S.A. – operator płatności</strong>

              <p>
                W celu realizacji płatności dane osobowe mogą być przekazywane
                do:
              </p>

              <p>
                <strong>
                  PayU S.A. z siedzibą w Poznaniu przy ul. Grunwaldzkiej 186,
                  60-166 Poznań, wpisanej do Rejestru Przedsiębiorców
                  Krajowego Rejestru Sądowego pod numerem KRS:0000274399 | NIP:792308495 | REGON:300523444.
                </strong>
              </p>

              <p>
                W odniesieniu do danych przekazanych PayU w związku
                z realizacją płatności PayU występuje jako administrator
                danych osobowych. Szczegółowe informacje dotyczące
                przetwarzania danych przez PayU są dostępne w polityce
                prywatności PayU.
              </p>
            </div>
          </div>

          <ul className="terms-page__list">
            <li>
              <strong>Operatorzy logistyczni</strong> – w szczególności
              DPD i InPost, w zakresie niezbędnym do przygotowania,
              nadania, śledzenia i doręczenia przesyłki.
            </li>

            <li>
              <strong>Dostawcy usług IT</strong> – podmioty zapewniające
              hosting, infrastrukturę serwerową, utrzymanie systemów,
              bezpieczeństwo oraz inne usługi techniczne niezbędne
              do działania Serwisu.
            </li>

            <li>
              <strong>Dostawcy usług komunikacyjnych</strong> – podmioty
              umożliwiające wysyłanie wiadomości e-mail, powiadomień
              lub innych komunikatów związanych z działaniem Serwisu.
            </li>

            <li>
              <strong>Organy publiczne i inne podmioty uprawnione</strong> –
              jeżeli obowiązek przekazania danych wynika z przepisów prawa
              lub jest niezbędny do ochrony praw KASAWA.
            </li>
          </ul>

          <p className="terms-page__text">
            Dane Kupującego wymagane do dostawy mogą być przekazywane
            operatorowi logistycznemu w celu wykonania przesyłki.
            Dane adresowe Kupującego nie są udostępniane Sprzedającemu
            za pośrednictwem interfejsu Kasoa.pl, z zastrzeżeniem sytuacji,
            w których przekazanie danych jest wymagane przez prawo lub
            niezbędne do realizacji określonego procesu.
          </p>
        </section>

        {/* 4 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiClock />
            4. Okres przechowywania danych
          </h2>

          <p className="terms-page__text">
            Dane osobowe są przechowywane przez okres nie dłuższy niż
            niezbędny do realizacji celu, dla którego zostały zebrane,
            z uwzględnieniem obowiązków prawnych ciążących na KASAWA
            oraz konieczności ustalenia, dochodzenia lub obrony przed
            roszczeniami.
          </p>

          <p className="terms-page__text">
            Dane związane z aktywnym Kontem są co do zasady przechowywane
            przez okres korzystania z Konta. Po jego usunięciu określone
            dane mogą być nadal przechowywane, jeżeli jest to niezbędne
            do wykonania obowiązku prawnego, rozliczeń, archiwizacji
            wymaganej prawem lub ochrony przed roszczeniami.
          </p>

          <p className="terms-page__text">
            Dokumentacja księgowa i podatkowa jest przechowywana przez
            okres wymagany właściwymi przepisami prawa. Okres ten może
            wynosić co najmniej 5 lat dla określonych dokumentów księgowych,
            przy czym sposób obliczania terminu zależy od rodzaju dokumentu
            i podstawy prawnej jego przechowywania.
          </p>

          <p className="terms-page__text">
            Dane dotyczące reklamacji, sporów i roszczeń mogą być
            przechowywane przez okres niezbędny do ich rozpatrzenia
            oraz do upływu właściwych terminów przedawnienia roszczeń.
          </p>
        </section>

        {/* 5 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiUserCheck />
            5. Prawa osób, których dane dotyczą
          </h2>

          <p className="terms-page__text">
            Osobie, której dane dotyczą, przysługują – w zakresie określonym
            przepisami RODO – w szczególności następujące prawa:
          </p>

          <ul className="terms-page__list">
            <li>
              prawo dostępu do swoich danych osobowych oraz otrzymania
              ich kopii;
            </li>

            <li>
              prawo do sprostowania i uzupełnienia nieprawidłowych
              lub niekompletnych danych;
            </li>

            <li>
              prawo do usunięcia danych w przypadkach przewidzianych
              przepisami RODO;
            </li>

            <li>
              prawo do ograniczenia przetwarzania danych w przypadkach
              przewidzianych przepisami RODO;
            </li>

            <li>
              prawo do przenoszenia danych, jeżeli spełnione są warunki
              określone w art. 20 RODO;
            </li>

            <li>
              prawo do wniesienia sprzeciwu wobec przetwarzania danych,
              jeżeli podstawą przetwarzania jest prawnie uzasadniony
              interes administratora;
            </li>

            <li>
              prawo do cofnięcia zgody w dowolnym momencie, jeżeli
              przetwarzanie odbywa się na podstawie zgody;
            </li>

            <li>
              prawo do wniesienia skargi do Prezesa Urzędu Ochrony Danych
              Osobowych.
            </li>
          </ul>

          <p className="terms-page__text">
            Skorzystanie z prawa do usunięcia danych nie zawsze będzie
            możliwe, jeżeli KASAWA jest zobowiązana do dalszego ich
            przechowywania na podstawie przepisów prawa lub dane są
            niezbędne do ustalenia, dochodzenia albo obrony roszczeń.
          </p>
        </section>

        {/* 6 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiShield />
            6. Zautomatyzowane podejmowanie decyzji i profilowanie
          </h2>

          <p className="terms-page__text">
            Kasoa.pl może wykorzystywać rozwiązania informatyczne służące
            do automatycznej organizacji procesów, wykrywania nadużyć,
            zapewnienia bezpieczeństwa oraz obsługi Zamówień.
          </p>

          <p className="terms-page__text">
            Jeżeli w ramach Serwisu stosowane byłoby zautomatyzowane
            podejmowanie decyzji w rozumieniu art. 22 RODO, które wywołuje
            wobec Użytkownika skutki prawne lub w podobny sposób istotnie
            na niego wpływa, Użytkownik zostanie poinformowany o takim
            przetwarzaniu w zakresie wymaganym przez przepisy prawa.
          </p>
        </section>

        {/* 7 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiLock />
            7. Bezpieczeństwo danych
          </h2>

          <p className="terms-page__text">
            KASAWA stosuje odpowiednie środki techniczne i organizacyjne
            mające na celu ochronę danych osobowych, w szczególności
            zabezpieczenia systemów informatycznych, kontrolę dostępu
            oraz rozwiązania mające na celu zapobieganie nieuprawnionemu
            dostępowi do danych.
          </p>

          <p className="terms-page__text">
            Dostęp do danych osobowych mają wyłącznie osoby i podmioty,
            które potrzebują dostępu do tych danych w związku z realizacją
            określonych zadań lub obowiązków.
          </p>
        </section>

        {/* 8 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiFileText />
            8. Podanie danych osobowych
          </h2>

          <p className="terms-page__text">
            Podanie danych osobowych może być dobrowolne, jednak w zakresie,
            w jakim dane są niezbędne do utworzenia Konta, zawarcia lub
            wykonania umowy, realizacji Zamówienia, dostawy albo wykonania
            obowiązku prawnego, ich niepodanie może uniemożliwić korzystanie
            z określonych funkcjonalności Serwisu lub realizację Zamówienia.
          </p>
        </section>

        {/* 9 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiShare2 />
            9. Przekazywanie danych poza Europejski Obszar Gospodarczy
          </h2>

          <p className="terms-page__text">
            Jeżeli w związku z korzystaniem z usług zewnętrznych dostawców
            danych osobowych dojdzie do przekazania danych poza Europejski
            Obszar Gospodarczy, KASAWA zapewni zastosowanie wymaganych
            przepisami RODO mechanizmów legalizujących takie przekazanie,
            w szczególności odpowiedniej decyzji stwierdzającej odpowiedni
            stopień ochrony lub odpowiednich zabezpieczeń przewidzianych
            w art. 46 RODO, jeżeli będą wymagane.
          </p>
        </section>

        {/* 10 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiMail />
            10. Kontakt w sprawach ochrony danych osobowych
          </h2>

          <p className="terms-page__text">
            Wnioski dotyczące realizacji praw wynikających z RODO oraz
            pytania dotyczące przetwarzania danych osobowych należy kierować
            na adres:
          </p>

          <div className="terms-page__company-box">
            <p>
              <strong>KASAWA SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ</strong>
            </p>

            <p>
              ul. Kostromska nr 55 lok. 95
            </p>

            <p>
              97-300 Piotrków Trybunalski, Polska
            </p>

            <p>
              E-mail: privacy@kasoa.pl
            </p>

            <p>
              Tel.: +48 722 364 131
            </p>
          </div>

          <p className="terms-page__text">
            Osoba, której dane dotyczą, może również wnieść skargę do
            Prezesa Urzędu Ochrony Danych Osobowych, jeżeli uzna, że
            przetwarzanie jej danych osobowych narusza przepisy dotyczące
            ochrony danych osobowych.
          </p>

          <p
            className="terms-page__text"
            style={{
              fontSize: '12px',
              color: '#64748b',
              marginTop: '16px',
            }}
          >
            Ostatnia aktualizacja: 1 października 2026 r.
          </p>
        </section>

      </div>
    </main>
  );
};

export default PrivacyPolicy;