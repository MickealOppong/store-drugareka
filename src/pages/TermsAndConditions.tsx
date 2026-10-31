import React, { useEffect } from 'react';
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiDollarSign,
  FiFileText,
  FiInfo,
  FiLock,
  FiPackage,
  FiRefreshCw,
  FiShield,
  FiTruck,
  FiUser,
} from 'react-icons/fi';

import '../css/TermsAndConditions.scss';

const TermsAndConditions: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="terms-page">
      <header className="terms-page__header">
        <span className="terms-page__badge">
          <FiFileText />
          Regulamin i Warunki Korzystania
        </span>

        <h1 className="terms-page__title">
          Regulamin Kasoa.pl
        </h1>

        <p className="terms-page__lead">
          Zasady korzystania z serwisu Kasoa.pl oraz warunki organizacji
          i rozliczania transakcji sprzedaży prywatnej.
        </p>

        <div className="terms-page__company-box">
          <p>
            <strong>Operator Serwisu i Administrator Danych Osobowych:</strong>
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

        <div className="terms-page__info-banner">
          <FiInfo />
          <div>
            <strong>Ważna informacja dotycząca modelu sprzedaży</strong>
            <p>
              Kasoa.pl obecnie obsługuje wyłącznie transakcje sprzedaży
              prywatnej (C2C). Sprzedający oferują Towary jako osoby prywatne,
              a KASAWA działa jako pośrednik organizujący i obsługujący proces
              transakcji. Przy każdym Towarze Kupujący jest informowany
              o charakterze sprzedaży oraz zasadach dotyczących odrzucenia
              i zwrotu Towaru.
            </p>
          </div>
        </div>
      </header>

      <div className="terms-page__content">

        {/* 1 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiFileText />
            1. Postanowienia ogólne
          </h2>

          <p className="terms-page__text">
            Niniejszy Regulamin określa zasady korzystania z serwisu
            internetowego Kasoa.pl, zasady tworzenia i korzystania z Konta,
            wystawiania Towarów, składania Zamówień, dokonywania płatności
            elektronicznych, organizacji dostawy, procedury odrzucenia
            i zwrotu Towaru, reklamacji oraz rozliczeń związanych
            z transakcjami zawieranymi za pośrednictwem Serwisu.
          </p>

          <p className="terms-page__text">
            Serwis prowadzony jest przez KASAWA SPÓŁKA Z OGRANICZONĄ
            ODPOWIEDZIALNOŚCIĄ z siedzibą w Piotrkowie Trybunalskim.
            Przed złożeniem Zamówienia Kupujący zobowiązany jest zapoznać się
            z Regulaminem i zaakceptować jego postanowienia.
          </p>

          <p className="terms-page__text">
            Regulamin jest udostępniany Użytkownikom w sposób umożliwiający
            jego pozyskanie, odtworzenie i utrwalenie.
          </p>
        </section>

        {/* 2 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiInfo />
            2. Definicje
          </h2>

          <ul className="terms-page__list">
            <li>
              <strong>Serwis / Kasoa.pl</strong> – internetowa platforma
              dostępna pod adresem kasoa.pl, za pośrednictwem której
              Użytkownicy mogą oferować i nabywać Towary.
            </li>

            <li>
              <strong>Operator / KASAWA</strong> – KASAWA SPÓŁKA Z OGRANICZONĄ
              ODPOWIEDZIALNOŚCIĄ, prowadząca Serwis oraz zapewniająca
              infrastrukturę techniczną, płatniczą i logistyczną niezbędną
              do obsługi transakcji.
            </li>

            <li>
              <strong>Użytkownik</strong> – osoba korzystająca z Serwisu,
              posiadająca Konto lub korzystająca z funkcjonalności Serwisu
              dostępnych bez rejestracji.
            </li>

            <li>
              <strong>Sprzedający</strong> – osoba fizyczna nieprowadząca
              działalności gospodarczej, oferująca Towar za pośrednictwem
              Serwisu w ramach sprzedaży prywatnej.
            </li>

            <li>
              <strong>Kupujący</strong> – Użytkownik dokonujący zakupu Towaru
              za pośrednictwem Serwisu.
            </li>

            <li>
              <strong>Towar</strong> – rzecz ruchoma oferowana przez
              Sprzedającego za pośrednictwem Serwisu.
            </li>

            <li>
              <strong>Oferta</strong> – prezentacja Towaru w Serwisie
              zawierająca w szczególności jego opis, zdjęcia i informacje
              dotyczące ceny.
            </li>

            <li>
              <strong>Zamówienie</strong> – oświadczenie Kupującego zmierzające
              do zawarcia umowy sprzedaży Towaru ze Sprzedającym.
            </li>

            <li>
              <strong>Konto</strong> – indywidualny profil Użytkownika
              utworzony w Serwisie.
            </li>

            <li>
              <strong>Procedura odrzucenia</strong> – procedura organizowana
              przez Kasoa.pl, umożliwiająca Kupującemu zgłoszenie odrzucenia
              Towaru w terminie określonym w Regulaminie po jego doręczeniu.
            </li>
          </ul>
        </section>

        {/* 3 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiShield />
            3. Charakter transakcji i rola KASAWA
          </h2>

          <p className="terms-page__text">
            Kasoa.pl umożliwia zawieranie transakcji sprzedaży prywatnej
            pomiędzy osobami fizycznymi. Umowa sprzedaży Towaru jest zawierana
            pomiędzy Sprzedającym a Kupującym.
          </p>

          <p className="terms-page__text">
            KASAWA nie jest właścicielem Towarów oferowanych przez
            Sprzedających i, o ile przy konkretnej Ofercie wyraźnie nie
            wskazano inaczej, nie występuje jako sprzedawca tych Towarów.
            Umowa sprzedaży jest zawierana pomiędzy Sprzedającym a Kupującym.
            KASAWA świadczy usługi marketplace, w tym udostępnia Serwis,
            koordynuje obsługę transakcji i dostawy oraz przekazuje informacje
            niezbędne do realizacji płatności za pośrednictwem zewnętrznego
            dostawcy usług płatniczych.
          </p>

          <p className="terms-page__text">
            Płatności i transfery związane z transakcjami są obsługiwane
            za pośrednictwem Stripe i właściwego rozwiązania Stripe Connect,
            zgodnie z umowami zawartymi z Stripe. KASAWA nie przyjmuje środków
            na własny rachunek bankowy wyłącznie z tego powodu, że organizuje
            transakcję w Serwisie. Rzeczywisty przepływ środków zależy od
            konfiguracji Stripe Connect zastosowanej dla danej transakcji.
          </p>

          <p className="terms-page__text">
            Dane kontaktowe Sprzedającego nie są udostępniane Kupującemu
            bezpośrednio. Komunikacja dotycząca realizacji transakcji,
            w zakresie obsługiwanym przez Serwis, odbywa się za pośrednictwem
            Kasoa.pl.
          </p>
        </section>

        {/* 4 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiPackage />
            4. Wystawianie i prezentacja Towarów
          </h2>

          <p className="terms-page__text">
            Sprzedający zobowiązany jest do przedstawienia Towaru w sposób
            zgodny z jego rzeczywistym stanem. Oferta powinna zawierać
            prawdziwy opis Towaru, w szczególności informacje dotyczące jego
            rodzaju, stanu, właściwości oraz ewentualnych uszkodzeń lub wad.
          </p>

          <p className="terms-page__text">
            Sprzedający powinien zamieścić rzeczywiste zdjęcia oferowanego
            Towaru, umożliwiające Kupującemu zapoznanie się z jego wyglądem
            i stanem.
          </p>

          <p className="terms-page__text">
            Cena prezentowana Kupującemu jest podawana w złotych polskich
            (PLN), o ile w Serwisie nie wskazano inaczej.
          </p>

          <p className="terms-page__text">
            Złożenie Zamówienia następuje poprzez użycie jednoznacznego
            przycisku akcji <strong>„Zamawiam i płacę”</strong> lub innego
            równoważnego komunikatu wskazanego w Serwisie.
          </p>
        </section>

        {/* 5 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiTruck />
            5. Czas realizacji zamówienia i dostawa
          </h2>

          <p className="terms-page__text">
            Dostawy realizowane są za pośrednictwem zintegrowanych operatorów
            logistycznych, w szczególności DPD oraz InPost, na terytorium
            Rzeczypospolitej Polskiej.
          </p>

          <p className="terms-page__text">
            Sprzedający zobowiązany jest przygotować i przekazać przesyłkę
            operatorowi logistycznemu w terminie do
            <strong> 3 dni roboczych</strong> od momentu potwierdzenia
            płatności za Zamówienie.
          </p>

          <p className="terms-page__text">
            Łączny przewidywany czas realizacji Zamówienia, obejmujący
            przygotowanie Towaru przez Sprzedającego oraz dostawę, wynosi od
            <strong> 2 do 5 dni roboczych</strong>.
          </p>

          <p className="terms-page__text">
            Informacje dotyczące przewoźnika oraz statusu przesyłki mogą być
            udostępniane Kupującemu za pośrednictwem jego Konta lub wiadomości
            wysyłanych przez Serwis.
          </p>
        </section>

        {/* 6 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiDollarSign />
            6. Płatności elektroniczne
          </h2>

          <p className="terms-page__text">
            Obsługę płatności elektronicznych zapewnia Stripe, w tym
            odpowiednie usługi Stripe Connect, zgodnie z warunkami Stripe
            mającymi zastosowanie do Kupującego, Sprzedającego i Operatora.
            W zależności od dostępnej metody płatności oraz konfiguracji
            Serwisu płatność może być obsługiwana przez Stripe lub właściwego
            partnera płatniczego wskazanego podczas składania Zamówienia.
            Dostawcą właściwym dla konkretnej płatności jest podmiot wskazany
            w procesie płatności; niniejsze postanowienia dotyczą Stripe
            w zakresie, w jakim Stripe obsługuje daną płatność.
          </p>

          <p className="terms-page__text">
            KASAWA nie przechowuje pełnych danych instrumentów płatniczych
            Kupującego. Dane płatnicze są przetwarzane przez właściwego
            dostawcę usług płatniczych zgodnie z jego warunkami i politykami.
          </p>

          <p className="terms-page__text">
            W modelu Stripe Connect płatność i ewentualny późniejszy transfer
            do Sprzedającego są realizowane zgodnie z konfiguracją Stripe
            Connect oraz umowami zawartymi ze Stripe. W przypadku modelu
            oddzielnych obciążeń i transferów (Separate Charges and Transfers)
            obciążenie może zostać zarejestrowane na saldzie Stripe konta
            platformy, a transfer do połączonego konta Sprzedającego jest
            inicjowany zgodnie z właściwymi warunkami i zasadami Stripe.
            Nie oznacza to samo przez się, że środki zostały wypłacone na
            rachunek bankowy KASAWA.
          </p>

          <p className="terms-page__text">
            Sprzedający upoważnia KASAWA, w zakresie dopuszczonym przez
            właściwe umowy Stripe i niniejszy Regulamin, do przekazywania
            Stripe instrukcji dotyczących wypłaty środków należnych
            Sprzedającemu. Instrukcje te służą realizacji uzgodnionych
            warunków transakcji, w tym potwierdzenia dostawy oraz zasad
            dotyczących zgłoszeń, zwrotów lub sporów. KASAWA nie jest
            upoważniona na podstawie tego postanowienia do wykorzystywania
            środków należnych Sprzedającemu na własne cele ani do dowolnego
            kierowania ich do niepowiązanych odbiorców. Upoważnienie to jest
            ograniczone do instrukcji przewidzianych w Regulaminie, warunkach
            sprzedaży zaakceptowanych przez Sprzedającego oraz właściwych
            umowach Stripe. Nie daje ono KASAWA samodzielnego prawa do zmiany
            odbiorcy należnych Sprzedającemu środków ani do dowolnego ustalania
            terminu transferu poza uzgodnionymi warunkami i dopuszczalnymi
            ograniczeniami prawnymi lub proceduralnymi.
          </p>

          <p className="terms-page__text">
            Warunkiem korzystania przez Sprzedającego z funkcji otrzymywania
            płatności może być utworzenie lub powiązanie konta Stripe Connect,
            podanie wymaganych danych oraz przejście weryfikacji tożsamości,
            działalności lub rachunku wypłat, jeśli wymaga tego Stripe lub
            prawo. Sprzedający zobowiązany jest zaakceptować warunki umowy
            Stripe Connected Account Agreement lub inne warunki Stripe
            właściwe dla danego typu konta. KASAWA może ograniczyć możliwość
            wystawiania Towarów, realizacji transakcji lub otrzymywania
            transferów, jeśli konto nie ma wymaganych możliwości albo
            weryfikacja pozostaje nieukończona. KASAWA nie zastępuje Stripe
            w weryfikacji wymaganej przez Stripe.
          </p>

          <p className="terms-page__text">
            Kwoty, prowizje i inne opłaty związane z transakcją są ustalane
            zgodnie z informacjami przedstawionymi przed jej zawarciem.
            Zwroty, obciążenia zwrotne, reklamacje i spory mogą skutkować
            anulowaniem, korektą lub odwróceniem płatności albo transferu,
            o ile pozwalają na to właściwe zasady Stripe i przepisy prawa.
            Odpowiedzialność za takie kwoty i sposób ich rozliczenia określają
            Regulamin, warunki danej transakcji oraz właściwe umowy Stripe;
            KASAWA nie gwarantuje, że transfer będzie nieodwracalny.
          </p>

          <p className="terms-page__text">
            Dostawca usług płatniczych realizuje płatności i transfery zgodnie
            ze swoimi umowami, procedurami, wymogami weryfikacyjnymi oraz
            obowiązującymi przepisami. Samo przekazanie instrukcji przez
            KASAWA nie gwarantuje natychmiastowego wykonania ani rozliczenia
            transferu.
          </p>

          <p className="terms-page__text">
            Usługi płatnicze są świadczone przez właściwego dostawcę usług
            płatniczych zgodnie z mającymi zastosowanie przepisami, w tym
            dyrektywą (UE) 2015/2366 (PSD2) oraz polską ustawą z dnia
            19 sierpnia 2011 r. o usługach płatniczych. KASAWA administruje
            transakcją na Platformie i przekazuje instrukcje w zakresie
            wynikającym z uzgodnionych warunków; niniejszy Regulamin nie
            stanowi wyłączenia ani ograniczenia obowiązków, które mogą mieć
            zastosowanie do KASAWA na mocy bezwzględnie obowiązującego prawa.
          </p>
        </section>

        {/* 7 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiRefreshCw />
            7. Odrzucenie i zwrot Towaru
          </h2>

          <div className="terms-page__highlight-box">
            <FiRefreshCw />

            <div>
              <strong>
                24 godziny na odrzucenie Towaru po dostawie
              </strong>

              <p>
                Kasoa.pl umożliwia Kupującemu odrzucenie Towaru w terminie
                <strong> 24 godzin od momentu jego doręczenia</strong>.
                Odrzucenie Towaru należy zgłosić za pośrednictwem Konta
                Użytkownika zgodnie z procedurą dostępną w Serwisie.
              </p>

              <p>
                Po skutecznym zgłoszeniu odrzucenia Kupujący ma
                <strong> 3 dni</strong> na nadanie Towaru zgodnie z instrukcją
                zwrotu udostępnioną przez Kasoa.pl.
              </p>
            </div>
          </div>

          <p className="terms-page__text">
            Zwrot Towaru należy wysłać na dokładny adres wskazany Kupującemu
            w formularzu lub instrukcji zwrotu udostępnionej przez Kasoa.pl.
            Kupujący nie powinien wysyłać Towaru bezpośrednio na adres
            Sprzedającego, chyba że Kasoa.pl wyraźnie wskaże taki adres
            w ramach procedury zwrotu.
          </p>

          <p className="terms-page__text">
            W transakcjach pomiędzy osobami prywatnymi (C2C) Kupującemu
            nie przysługuje ustawowe 14-dniowe prawo odstąpienia od umowy
            przysługujące Konsumentowi w przypadku zakupu od przedsiębiorcy.
          </p>

          <p className="terms-page__text">
            Procedura 24-godzinnego odrzucenia i 3-dniowego zwrotu jest
            procedurą organizowaną przez Kasoa.pl. Nie ogranicza ona praw
            Kupującego, których nie można wyłączyć ani ograniczyć na podstawie
            bezwzględnie obowiązujących przepisów prawa.
          </p>

          <p className="terms-page__text">
            Jeżeli zgłoszenie Kupującego zostanie uznane za uzasadnione,
            Sprzedający ponosi koszty związane z takim zwrotem, w tym koszt
            przesyłki zwrotnej oraz inne uzasadnione koszty obsługi zwrotu
            i rozliczenia płatności, które zgodnie z zasadami dostawcy
            płatności nie podlegają zwrotowi. Koszty te nie obciążają
            Kupującego i mogą zostać rozliczone z kwot należnych
            Sprzedającemu, z zastrzeżeniem bezwzględnie obowiązujących
            przepisów prawa.
          </p>

          <p className="terms-page__text">
            Opłata serwisowa Kasoa.pl za usługę obsługi i organizacji
            transakcji nie podlega zwrotowi w przypadku uzasadnionego zwrotu
            Towaru, w zakresie, w jakim usługa, za którą opłata została
            pobrana, została już wykonana, a zatrzymanie opłaty jest
            dopuszczalne na podstawie obowiązujących przepisów prawa.
            Postanowienie to nie wyłącza prawa Kupującego do otrzymania
            zwrotu jakiejkolwiek kwoty, której zwrot jest wymagany przez
            bezwzględnie obowiązujące przepisy prawa.
          </p>

          <p className="terms-page__text">
            Adres Operatora do korespondencji oraz zgłoszeń związanych
            z procedurą zwrotu:
          </p>

          <div className="terms-page__company-box">
            <p>
              <strong>
                KASAWA SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ
              </strong>
            </p>
            <p>ul. Kostromska nr 55 lok. 95</p>
            <p>97-300 Piotrków Trybunalski, Polska</p>
          </div>
        </section>

        {/* 8 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiFileText />
            8. Procedura reklamacyjna
          </h2>

          <p className="terms-page__text">
            Reklamacje dotyczące działania Serwisu, realizacji Zamówienia
            lub przebiegu transakcji można zgłaszać elektronicznie na adres:
            <strong> support@kasoa.pl</strong> lub pisemnie na adres siedziby
            Operatora.
          </p>

          <div className="terms-page__company-box">
            <p>
              <strong>
                KASAWA SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ
              </strong>
            </p>
            <p>ul. Kostromska nr 55 lok. 95</p>
            <p>97-300 Piotrków Trybunalski, Polska</p>
            <p>E-mail: support@kasoa.pl</p>
            <p>Tel.: +48 722 364 131</p>
          </div>

          <p className="terms-page__text">
            Reklamacja powinna zawierać, w miarę możliwości, numer
            Zamówienia, opis problemu oraz informacje pozwalające
            na jego rozpatrzenie.
          </p>

          <p className="terms-page__text">
            Reklamacja zostanie rozpatrzona w terminie
            <strong> 14 dni</strong> od dnia jej otrzymania.
          </p>

          <p className="terms-page__text">
            Jeżeli charakter zgłoszenia wymaga zwrotu Towaru, Kupujący
            otrzyma odpowiednią instrukcję dotyczącą sposobu i adresu
            nadania przesyłki.
          </p>
        </section>

        {/* 9 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiShield />
            9. Przepisy unijne – DAC7 i DSA
          </h2>

          <p className="terms-page__text">
            W zakresie, w jakim przepisy dotyczące raportowania platform
            cyfrowych mają zastosowanie do działalności Kasoa.pl, Operator
            może być zobowiązany do gromadzenia, weryfikowania i przekazywania
            właściwym organom określonych informacji dotyczących
            Sprzedających oraz transakcji realizowanych za pośrednictwem
            Serwisu.
          </p>

          <p className="terms-page__text">
            Użytkownik zobowiązany jest podawać dane wymagane przez Operatora
            w związku z obowiązkami wynikającymi z przepisów prawa, w tym
            przepisów dotyczących raportowania platform cyfrowych.
          </p>

          <p className="terms-page__text">
            Na podstawie przepisów Aktu o Usługach Cyfrowych (DSA) Operator
            może podejmować działania wobec Ofert zawierających Towary
            niedozwolone, niebezpieczne, niezgodne z prawem lub naruszające
            Regulamin. Takie Oferty mogą zostać usunięte lub ograniczone,
            a Konto Użytkownika może zostać czasowo ograniczone lub
            zablokowane w przypadkach określonych w Regulaminie.
          </p>
        </section>

        {/* 10 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiAlertTriangle />
            10. Towary niedozwolone
          </h2>

          <p className="terms-page__text">
            Zabronione jest oferowanie za pośrednictwem Serwisu Towarów,
            których sprzedaż lub posiadanie jest zabronione przez przepisy
            prawa, a także Towarów, których sprzedaż może stwarzać zagrożenie
            dla zdrowia, życia lub bezpieczeństwa Użytkowników.
          </p>

          <p className="terms-page__text">
            W szczególności zabronione jest wystawianie Towarów podrobionych,
            skradzionych, nielegalnych, niebezpiecznych oraz innych Towarów
            wskazanych w aktualnej liście Towarów niedozwolonych dostępnej
            w Serwisie.
          </p>

          <p className="terms-page__text">
            Operator może usunąć Ofertę naruszającą niniejszy Regulamin
            lub obowiązujące przepisy prawa.
          </p>
        </section>

        {/* 11 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiUser />
            11. Konto Użytkownika
          </h2>

          <p className="terms-page__text">
            Utworzenie Konta wymaga podania danych niezbędnych do korzystania
            z funkcjonalności Serwisu oraz zaakceptowania niniejszego
            Regulaminu.
          </p>

          <p className="terms-page__text">
            Użytkownik zobowiązany jest do podawania prawdziwych,
            aktualnych i kompletnych danych oraz do ich aktualizowania
            w przypadku zmiany.
          </p>

          <p className="terms-page__text">
            Użytkownik odpowiada za zachowanie poufności danych
            umożliwiających dostęp do jego Konta oraz za działania
            podejmowane przy użyciu Konta, z zastrzeżeniem przypadków
            wynikających z obowiązujących przepisów prawa.
          </p>
        </section>

        {/* 12 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiCheckCircle />
            12. Obowiązki Sprzedającego
          </h2>

          <ul className="terms-page__list">
            <li>
              Sprzedający może oferować wyłącznie Towary, które może legalnie
              sprzedać.
            </li>

            <li>
              Sprzedający zobowiązany jest podawać prawdziwe informacje
              dotyczące Towaru.
            </li>

            <li>
              Sprzedający odpowiada za zgodność Towaru z opisem i zdjęciami
              zamieszczonymi w Ofercie.
            </li>

            <li>
              Sprzedający zobowiązany jest odpowiednio zabezpieczyć Towar
              przed wysyłką.
            </li>

            <li>
              Sprzedający zobowiązany jest przekazać przesyłkę operatorowi
              logistycznemu w terminie określonym w niniejszym Regulaminie.
            </li>
          </ul>
        </section>

        {/* 13 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiCheckCircle />
            13. Obowiązki Kupującego
          </h2>

          <ul className="terms-page__list">
            <li>
              Kupujący zobowiązany jest podawać prawidłowe dane wymagane
              do realizacji Zamówienia i dostawy.
            </li>

            <li>
              Kupujący zobowiązany jest dokonać płatności zgodnie
              z instrukcjami przedstawionymi w Serwisie.
            </li>

            <li>
              Kupujący powinien sprawdzić Towar po jego doręczeniu
              i w przypadku skorzystania z procedury odrzucenia dokonać
              zgłoszenia w terminie 24 godzin.
            </li>

            <li>
              W przypadku zgłoszenia odrzucenia Kupujący zobowiązany jest
              nadać Towar zgodnie z instrukcją zwrotu w terminie 3 dni.
            </li>
          </ul>
        </section>

        {/* 14 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiDollarSign />
            14. Rozliczenie ze Sprzedającym
          </h2>

          <p className="terms-page__text">
            Wypłata należności Sprzedającemu jest realizowana za pośrednictwem
            Stripe Connect zgodnie z warunkami Stripe, właściwą konfiguracją
            płatności oraz niniejszym Regulaminem. Jeżeli warunki danej
            transakcji przewidują potwierdzenie dostawy lub inne obiektywne
            kryteria wypłaty, KASAWA może po ich spełnieniu przekazać Stripe
            odpowiednią instrukcję. Termin wykonania transferu zależy również
            od procedur Stripe, statusu konta Sprzedającego i wymogów prawnych.
          </p>

          <p className="terms-page__text">
            Szczegółowe zasady dotyczące kwoty należnej Sprzedającemu oraz
            wynagrodzenia KASAWA określone są w procesie
            <strong> „Sprzedaj z nami”</strong> oraz w informacjach
            przedstawianych Sprzedającemu przed zaakceptowaniem warunków
            sprzedaży. Opłaty i prowizje są rozliczane zgodnie z informacjami
            przedstawionymi przed zawarciem danej transakcji oraz z możliwościami
            i zasadami właściwego rozwiązania Stripe Connect. Sprzedający
            zobowiązuje się utrzymywać prawidłowe dane konta oraz rachunku
            wypłat i niezwłocznie uzupełniać informacje wymagane przez Stripe.
            Brak weryfikacji, ograniczenie konta, kontrola bezpieczeństwa,
            niedostępność środków lub inne ograniczenia po stronie Stripe mogą
            opóźnić albo uniemożliwić transfer, mimo spełnienia warunków
            transakcji.
          </p>

          <p className="terms-page__text">
            Instrukcja wypłaty może zostać opóźniona w zakresie przewidzianym
            w Regulaminie, w szczególności gdy trwa zgłoszenie, procedura
            zwrotu lub spór dotyczący Zamówienia, albo gdy wymagają tego
            procedury Stripe lub przepisy prawa. Ograniczenia te stosuje się
            na podstawie określonych warunków transakcji; nie przyznają one
            KASAWA nieograniczonego prawa do dysponowania środkami należnymi
            Sprzedającemu. Każde opóźnienie powinno mieć podstawę w konkretnym
            warunku Regulaminu, zaakceptowanych warunkach transakcji, procedurze
            Stripe lub przepisie prawa i powinno trwać tylko przez okres
            uzasadniony daną przyczyną. KASAWA prowadzi ewidencję instrukcji
            transferu i ich statusów w zakresie niezbędnym do obsługi
            transakcji, rozliczeń i rozpatrywania zgłoszeń.
          </p>

          <p className="terms-page__text">
            Ostateczna kwota wypłaty należna Sprzedającemu może zostać
            pomniejszona o opłaty pobierane przez Stripe w związku z realizacją
            transferu środków na połączone konto Sprzedającego, jeżeli takie
            opłaty mają zastosowanie do danej transakcji. Wysokość tych opłat
            zależy od taryfy, konfiguracji oraz zasad Stripe. Sprzedający
            otrzymuje rozliczenie kwoty wypłaty z uwzględnieniem opłat
            i potrąceń, które zgodnie z Regulaminem oraz informacjami
            przedstawionymi przed transakcją obciążają Sprzedającego.
          </p>

          <p className="terms-page__text">
            Jeżeli po opłaceniu Zamówienia Sprzedający anuluje Zamówienie
            z przyczyn leżących po jego stronie, Sprzedający ponosi koszt
            opłat pobranych przez Stripe w związku ze zwrotem płatności
            Kupującemu, w zakresie, w jakim opłaty te nie podlegają zwrotowi
            przez Stripe. Kwota takich kosztów może zostać uwzględniona
            w rozliczeniu Sprzedającego lub potrącona z należnych mu środków,
            o ile jest to prawnie dopuszczalne i zostało przedstawione
            Sprzedającemu przed zawarciem transakcji. Sprzedający nie ponosi
            kosztów wynikających z błędu KASAWA ani z okoliczności, za które
            zgodnie z prawem odpowiada KASAWA.
          </p>
        </section>

        {/* 15 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiLock />
            15. Dane osobowe
          </h2>

          <p className="terms-page__text">
            Administratorem danych osobowych przetwarzanych w związku
            z korzystaniem z Serwisu jest KASAWA SPÓŁKA Z OGRANICZONĄ
            ODPOWIEDZIALNOŚCIĄ.
          </p>

          <p className="terms-page__text">
            Szczegółowe informacje dotyczące zasad przetwarzania danych
            osobowych, podstaw prawnych przetwarzania, praw Użytkowników
            oraz okresów przechowywania danych znajdują się w Polityce
            Prywatności Kasoa.pl.
          </p>

          <p className="terms-page__text">
            Dane Użytkowników są przetwarzane w zakresie niezbędnym
            do świadczenia usług, realizacji Zamówień, obsługi płatności,
            dostaw, reklamacji oraz wykonywania obowiązków wynikających
            z przepisów prawa.
          </p>
        </section>

        {/* 16 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiShield />
            16. Własność intelektualna
          </h2>

          <p className="terms-page__text">
            Prawa do elementów Serwisu, w tym do jego oznaczeń, układu,
            oprogramowania, grafik oraz materiałów przygotowanych przez
            KASAWA, przysługują Operatorowi lub podmiotom uprawnionym.
          </p>

          <p className="terms-page__text">
            Użytkownik nie może wykorzystywać elementów Serwisu poza zakresem
            dozwolonym przez obowiązujące przepisy prawa bez odpowiedniej
            zgody uprawnionego podmiotu.
          </p>
        </section>

        {/* 17 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiAlertTriangle />
            17. Moderacja i bezpieczeństwo Serwisu
          </h2>

          <p className="terms-page__text">
            KASAWA może monitorować Oferty oraz działania Użytkowników
            w zakresie dozwolonym przez prawo w celu zapewnienia
            bezpieczeństwa Serwisu i zgodności jego działania
            z Regulaminem oraz obowiązującymi przepisami.
          </p>

          <p className="terms-page__text">
            W przypadku stwierdzenia naruszenia Regulaminu lub przepisów
            prawa Operator może w szczególności usunąć Ofertę, ograniczyć
            jej widoczność, czasowo ograniczyć dostęp do wybranych
            funkcjonalności lub zablokować Konto.
          </p>
        </section>

        {/* 18 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiTruck />
            18. Problemy z dostawą
          </h2>

          <p className="terms-page__text">
            W przypadku zagubienia, uszkodzenia lub innego problemu
            z przesyłką Użytkownik powinien niezwłocznie zgłosić problem
            za pośrednictwem Serwisu lub na adres kontaktowy Operatora.
          </p>

          <p className="terms-page__text">
            KASAWA może współpracować z właściwym operatorem logistycznym
            w celu wyjaśnienia statusu przesyłki oraz podjęcia działań
            przewidzianych dla danego rodzaju zdarzenia.
          </p>
        </section>

        {/* 19 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiUser />
            19. Odpowiedzialność Użytkownika
          </h2>

          <p className="terms-page__text">
            Użytkownik ponosi odpowiedzialność za informacje i materiały
            przekazywane do Serwisu oraz za zgodność swoich działań
            z niniejszym Regulaminem i obowiązującymi przepisami prawa.
          </p>

          <p className="terms-page__text">
            Użytkownik nie może podejmować działań mających na celu
            zakłócenie działania Serwisu, obchodzenie zabezpieczeń,
            uzyskanie nieuprawnionego dostępu do danych lub systemów
            ani wykorzystywanie Serwisu w sposób sprzeczny z jego
            przeznaczeniem.
          </p>
        </section>

        {/* 20 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiRefreshCw />
            20. Anulowanie Zamówienia
          </h2>

          <p className="terms-page__text">
            Zamówienie może zostać anulowane w przypadkach przewidzianych
            w Regulaminie, w szczególności gdy realizacja Zamówienia
            nie jest możliwa, Towar został wcześniej sprzedany, Oferta
            została usunięta z powodu naruszenia Regulaminu lub wystąpiły
            inne okoliczności uniemożliwiające prawidłową realizację
            transakcji.
          </p>

          <p className="terms-page__text">
            W przypadku anulowania Zamówienia, jeżeli płatność została
            wcześniej dokonana, środki zostaną zwrócone Kupującemu zgodnie
            z zasadami właściwymi dla zastosowanego sposobu płatności.
          </p>

          <p className="terms-page__text">
            Jeżeli anulowanie opłaconego Zamówienia następuje z inicjatywy
            Sprzedającego lub z przyczyn leżących po jego stronie, Sprzedający
            ponosi niepodlegające zwrotowi przez Stripe opłaty związane
            z wykonaniem zwrotu płatności Kupującemu, zgodnie z zasadami
            określonymi w pkt 14 Regulaminu. Nie dotyczy to sytuacji,
            w których anulowanie wynika z okoliczności, za które odpowiada
            KASAWA lub Kupujący, chyba że bezwzględnie obowiązujące przepisy
            prawa stanowią inaczej.
          </p>
        </section>

        {/* 21 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiFileText />
            21. Zmiany Regulaminu
          </h2>

          <p className="terms-page__text">
            KASAWA może zmienić Regulamin w przypadku zmiany przepisów prawa,
            zmiany funkcjonalności Serwisu, wprowadzenia nowych usług,
            konieczności zwiększenia bezpieczeństwa lub z innych ważnych
            przyczyn związanych z funkcjonowaniem Serwisu.
          </p>

          <p className="terms-page__text">
            Aktualna wersja Regulaminu jest publikowana w Serwisie.
            Zmiany nie naruszają praw nabytych przez Użytkowników przed
            wejściem zmian w życie.
          </p>
        </section>

        {/* 22 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiInfo />
            22. Kontakt i zgłoszenia
          </h2>

          <p className="terms-page__text">
            W sprawach związanych z działaniem Serwisu, Zamówieniami,
            płatnościami, dostawą oraz zgłoszeniami Użytkownik może
            skontaktować się z KASAWA za pośrednictwem:
          </p>

          <div className="terms-page__company-box">
            <p>
              <strong>KASAWA SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ</strong>
            </p>
            <p>ul. Kostromska nr 55 lok. 95</p>
            <p>97-300 Piotrków Trybunalski, Polska</p>
            <p>E-mail: support@kasoa.pl</p>
            <p>Tel.: +48 722 364 131</p>
          </div>
        </section>

        {/* 23 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiShield />
            23. Pozasądowe rozwiązywanie sporów
          </h2>

          <p className="terms-page__text">
            W przypadkach, w których przepisy prawa przewidują możliwość
            skorzystania z pozasądowych sposobów rozwiązywania sporów,
            Użytkownik może skorzystać z właściwych procedur i podmiotów
            uprawnionych do prowadzenia takich postępowań.
          </p>

          <p className="terms-page__text">
            Użytkownik może również skontaktować się z Operatorem w celu
            podjęcia próby polubownego rozwiązania zgłoszonego problemu
            przed skierowaniem sprawy do właściwego organu lub sądu.
          </p>
        </section>

        {/* 24 */}
        <section className="terms-page__section">
          <h2 className="terms-page__section-title">
            <FiFileText />
            24. Prawo właściwe i postanowienia końcowe
          </h2>

          <p className="terms-page__text">
            Do korzystania z Serwisu oraz do umów zawieranych za jego
            pośrednictwem stosuje się prawo polskie, z zastrzeżeniem
            bezwzględnie obowiązujących przepisów prawa, które mają
            zastosowanie niezależnie od wyboru prawa.
          </p>

          <p className="terms-page__text">
            W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie
            mają odpowiednie przepisy prawa polskiego, w szczególności
            przepisy Kodeksu cywilnego oraz, w zakresie mającym zastosowanie,
            przepisy ustawy o prawach konsumenta.
          </p>

          <p className="terms-page__text">
            Jeżeli którekolwiek postanowienie Regulaminu okaże się nieważne
            lub nieskuteczne, nie wpływa to na ważność pozostałych
            postanowień, chyba że obowiązujące przepisy prawa stanowią
            inaczej.
          </p>

          <p className="terms-page__text">
            Data ostatniej aktualizacji:{' '}
            <strong>30 września 2026 r.</strong>
          </p>
        </section>

      </div>
    </main>
  );
};

export default TermsAndConditions;