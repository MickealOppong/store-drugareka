import { useRef, useState, type SyntheticEvent } from 'react';




const TermsAndConditions = () => {
  const [, setHasScrolledToBottom] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

 // if (true) return null;

  // Detects when the user has scrolled to the bottom of the terms
  const handleScroll = (e: SyntheticEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    // 5px tolerance buffer for cross-browser scaling issues
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 5;
    
    if (isAtBottom) {
      setHasScrolledToBottom(true);
    }
  };

  return (
    <section className="terms-overlay">
      <div className="terms-card">
        
        <header className="terms-header">
          <h2>Terms & Conditions</h2>
        </header>

        <div 
          className="terms-body" 
          ref={scrollContainerRef} 
          onScroll={handleScroll}
        >
            <h1>Polski</h1>
          <h3>Regulamin Serwisu spotkac</h3>
          <p>
            Witamy w serwisie spotkac. Niniejszy Regulamin („Regulamin”) określa zasady dostępu oraz korzystania 
            ze strony internetowej, aplikacji mobilnych oraz usług (wspólnie określanych jako „Platforma”) 
            zarządzanych przez spotkac („my”, „nas” lub „nasz”). Tworząc konto, logując się lub korzystając z Platformy, 
            użytkownik jednoznacznie zgadza się na przestrzeganie niniejszego Regulaminu. W przypadku braku zgody na te warunki, 
            należy natychmiast zaprzestać korzystania z Platformy.
          </p>

          <h3>1. Wymagania Kwalifikacyjne i Bezpieczeństwo Konta</h3>
          <p><strong>Wymóg Wiekowy:</strong> Aby utworzyć konto, należy mieć ukończone 18 lat. Platforma jest przeznaczona głównie dla osób dorosłych w wieku 30 lat i starszych.</p>
          <p><strong>Status Cywilny:</strong> Korzystając z Platformy, użytkownik oświadcza i gwarantuje, że jest singlem i poszukuje autentycznych relacji społecznych lub romantycznych.</p>
          <p><strong>Dane Logowania:</strong> Użytkownik ponosi wyłączną odpowiedzialność za zachowanie poufności swoich danych logowania. Użytkownik zobowiązuje się do natychmiastowego powiadomienia nas o każdym nieautoryzowanym użyciu swojego konta.</p>

          <h3>2. Ekosystem Platformy (tzw. "Content Tax")</h3>
          <p>W celu utrzymania aktywnej, autentycznej społeczności o wysokich intencjach, Platforma stosuje unikalne ograniczenia systemowe:</p>
          <p>
            <strong>Obowiązkowy Publiczny Wpis:</strong> Jeśli po rejestracji lub zalogowaniu na koncie użytkownika nie ma ani jednego (0) aktywnego, publicznego momentu, dostęp do wyszukiwarki („Discover”), wysyłania wiadomości oraz przeglądania innych profili zostanie zablokowany. Użytkownik zostanie automatycznie przekierowany do ekranu dodawania nowego momentu.
          </p>
          <p><strong>Wymagany Wkład:</strong> Aby korzystać z funkcji wyszukiwania lub inicjować kontakt z innym uczestnikiem serwisu, użytkownik musi utrzymywać przynajmniej jeden (1) aktywny, publicznie widoczny moment przedstawiający styl życia.</p>
          <p><strong>Opcja Ukrycia Profilu:</strong> Użytkownik zachowuje prawo do usunięcia wszystkich swoich aktywnych momentów w dowolnym momencie w celu ukrycia profilu. Spowoduje to natychmiastowe zawieszenie dostępu do wyszukiwarki i przeniesie konto w status niewidzialny do czasu opublikowania nowego publicznego momentu.</p>
          
          <h3>3. Zasady Dotyczące Treści i Zachowania Użytkowników</h3>
          Profil użytkownika składa się z dwóch niezależnych elementów wizualnych: <strong>Zdjęcia Profilowego / Awatara</strong> (weryfikacja tożsamości) oraz <strong>Zdjęcia Momentu wraz z opisem</strong> (kontekst stylu życia).
          <p>
            <strong>Zakazane Treści:</strong> Surowo zabrania się dodawania standardowych selfie portretowych, zdjęć z lustra lub samych zbliżeń twarzy w główne pole „Momentu”. Momenty muszą przedstawiać otoczenie, aktywność, krajobraz, scenerię lub hobby.
          </p>
          <p><strong>Standardy Jakości:</strong> Zabrania się publikowania memów internetowych, grafik chronionych prawem autorskim, materiałów reklamowych, zrzutów ekranu oraz zdjęć o niskiej rozdzielczości lub rozmazanych.</p>
          <p><strong>Integritet Zachowania:</strong> Zabrania się wykorzystywania Platformy do nękania, spamowania, wyłudzeń finansowych, reklamy komercyjnej lub działań niezgodnych z prawem. Wszelkie próby sztucznego manipulowania statystykami lub wielokrotnego klikania liczników wyświetleń („spam-click”) będą skutkować natychmiastowym usunięciem konta.</p>
          
          <h3>4. Metryki, Analityka i Interakcje</h3>
          <p><strong>Świadome Śledzenie Wyświetleń:</strong> Liczba wyświetleń widoczna na panelu użytkownika reprezentuje realne skupienie uwagi. Licznik wzrasta wyłącznie wtedy, gdy inny użytkownik celowo zatrzyma kursor myszy nad kartą (desktop) lub kliknie/tapnie kartę w celu rozwinięcia dolnej szuflady z opisem tekstowym (mobile).</p>
          <p><strong>Struktura Danych:</strong> Suma wyświetleń w panelu jest ogólnym, kroczącym agregatem liczbowym. Reprezentuje ona całkowitą liczbę interakcji i nie pokazuje listy unikalnych profili odwiedzających, chyba że zostanie to odblokowane za pomocą funkcji premium.</p>
          
          <h3>5. Pakiety Premium, Tokeny i Monetyzacja</h3>
          <p><strong>Bariery Subskrypcyjne:</strong> Niektóre funkcje prywatności, takie jak zmiana widoczności dodatkowych momentów na status „Match Only” (Tylko dla dopasowanych), są funkcjonalnościami premium i mogą wymagać aktywnej płatnej subskrypcji.</p>
          <p><strong>Tokeny Połączeń:</strong> Platforma ma prawo ograniczyć liczbę bezpłatnych zapytań o kontakt („Let's Connect”), które użytkownik może wysłać w ciągu tygodnia. Dodatkowe pakiety połączeń można zakupić w formie bezzwrotnych pakietów tokenów.</p>
          <p><strong>Płatności:</strong> Wszystkie transakcje finansowe są przetwarzane bezpiecznie przez zewnętrznych operatorów płatności. Subskrypcje odnawiają się automatycznie, chyba że zostaną anulowane przed końcem bieżącego okresu rozliczeniowego.</p>
          
          <h3>6. Ograniczenie Odpowiedzialności i Usunięcie Konta</h3>
          <p><strong>Interakcje Użytkowników:</strong> Nie prowadzimy weryfikacji niekaralności użytkowników w rejestrach sądowych. Użytkownik ponosi wyłączną odpowiedzialność za swoje interakcje, komunikację oraz spotkania w świecie rzeczywistym z innymi uczestnikami serwisu.</p>
          <p><strong>Zamknięcie Konta:</strong> Zastrzegamy sobie prawo, według własnego uznania, do modyfikacji, zawieszenia lub usunięcia konta użytkownika w trybie natychmiastowym i bez uprzedzenia, jeśli naruszy on jakiekolwiek postanowienie niniejszego Regulaminu lub nie spełni standardów dotyczących publikowanych treści.</p>
        
          <h3>7. Polityka Prywatności i Zgodność z RODO (GDPR)</h3>
          <p>
            Zgodnie z Rozporządzeniem o Ochronie Danych Osobowych (RODO), administratorem danych osobowych jest spotkac. 
            Przetwarzamy Twoje dane rejestracyjne, zdjęcie awatara oraz pliki multimedialne przesyłane jako momenty.
          </p>
          <p>
            <strong>Przechowywanie Plików i Lokalizacja:</strong> Wszystkie przesłane zdjęcia oraz pliki wideo są bezpiecznie przechowywane na 
            szyfrowanych serwerach w chmurze (Object Storage) zlokalizowanych wyłącznie na terenie Unii Europejskiej (UE). Twoje dane nigdy nie 
            są przekazywane do państw trzecich poza Europejski Obszar Gospodarczy (EOG).
          </p>
          <p>
            <strong>Automatyczne Czyszczenie Metadanych (EXIF):</strong> W celu ochrony Twojego bezpieczeństwa osobistego oraz prywatności lokalizacji, 
            nasz system automatycznie i bezpowrotnie usuwa wszystkie osadzone metadane EXIF (w tym precyzyjne współrzędne geograficzne GPS, 
            model urządzenia oraz znaczniki czasu wykonania zdjęcia) z każdego pliku graficznego natychmiast po jego przesłaniu, a przed jego publikacją.
          </p>
          <p>
            <strong>Przechowywanie i Usuwanie Danych:</strong> Przesłane momenty są przechowywane w bazie danych tak długo, jak długo Twoje konto pozostaje 
            aktywne lub do momentu, gdy samodzielnie usuniesz je za pośrednictwem swojego panelu. Żądanie usunięcia konta („prawo do bycia zapomnianym”) 
            uruchamia procedurę trwałego skasowania wszystkich Twoich plików multimedialnych oraz logów interakcji z naszych serwerów produkcyjnych w ciągu 30 dni.
          </p>
          <p>
            <strong>Ochrona Dokumentów Prywatnych i Własności Intelektualnej:</strong> Każdy Moment, zdjęcie profilowe, 
            opis tekstowy oraz wiadomość na czacie opublikowana na Platformie stanowi dokument prywatny oraz własność intelektualną 
            użytkownika, który ją zamieścił. Użytkownikom surowo zabrania się kopiowania, pobierania, rozpowszechniania, 
            udostępniania poza Platformą lub publikowania jakichkolwiek treści należących do innego użytkownika <strong>bez wyraźnej, pisemnej 
            zgody właściciela danego materiału</strong>. Jakiekolwiek naruszenie tej zasady, w tym udostępnianie zrzutów ekranu (screenshotów) 
            z profili innych użytkowników lub prywatnych rozmów, będzie skutkować natychmiastowym, stałym zablokowaniem konta oraz podjęciem odpowiednich kroków prawnych.
          </p>

          <h3>8. Bezpieczeństwo Użytkowników i Aktualizacje Zasad</h3>
          <p>
            Zastrzegamy sobie prawo do modyfikacji progów zaangażowania i ograniczeń funkcjonalnych w celu ochrony stabilności sieci oraz 
            minimalizowania aktywności botów spamujących. Dalsze korzystanie z naszej infrastruktury sieciowej po wprowadzeniu zmian 
            stanowi dorozumianą akceptację zaktualizowanych warunków Regulaminu.
          </p>
            <h1>English</h1>
          <h3>Terms and Conditions for Spotkac</h3>
          <p>
            <p>Welcome to spotkac. These Terms and Conditions ("Terms") govern your access to and use of the website,
            mobile applications, and services (collectively, the "Platform") operated by spotkac ("we," "us," or "our").
            By creating an account, logging in, or using the Platform, you explicitly agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use the Platform.</p>
          </p>
          

          <h3>1. Eligibility and Account Security</h3>
          <p><strong>Age Requirement:</strong> You must be at least 18 years of age to create an account. The Platform is primarily designed for adults aged 30 and older</p>
            <p><strong>Single Status:</strong> By using the Platform, you represent and warrant that you are single and seeking genuine social or romantic connections.</p>
            <p><strong>Account Credentials:</strong> You are solely responsible for maintaining the confidentiality of your login credentials. You agree to notify us immediately of any unauthorized use of your account.</p>

          <h3>2. The Core Platform Ecosystem (The "Content Tax")</h3>
          <p>To maintain an active, authentic, and high-intent community, the Platform enforces unique structural constraints:</p>
          <p>
           <strong>Mandatory Public Post:</strong> Upon registration and subsequent logins, if your account contains zero (0) active public moments, you will be restricted from accessing the "Discover" feed, 
           sending connections, or viewing other profiles. You will be automatically redirected to a post-creation interface.
          </p>
          <p><strong>Enforced Contribution:</strong> To access the platform’s lookup features or initiate contact with another member, you must maintain at least one (1) active, publicly viewable lifestyle moment.</p>

          <p><strong>The Escape Hatch:</strong> You retain the right to delete all your active moments at any time to hide your profile. Doing so will pause your access to the discovery feed and place your account into an invisible state until a new public moment is published.</p>
          
          <h3>3. User Content and Conduct Rules</h3>
          Your profile consists of two distinct visual silos: an <strong>Avatar Photo</strong> (for identity verification) and a <strong>Moment Photo/Caption</strong> (for lifestyle context).
          <p>
           <strong>Prohibited Content:</strong> You are strictly prohibited from uploading standard headshot selfies, mirror selfies, or portraits into the primary "Moment" slot. Moments must depict original environments, activities, scenery, or hobbies.
          </p>
          <p><strong>Quality Standards:</strong> You may not upload internet memes, copyrighted media, promotional advertisements, screenshots, or low-resolution/blurry images.</p>
           <p><strong>Behavioral Integrity:</strong> You may not use the Platform for harassment, spamming, financial solicitation, commercial advertising, or illegal activities. Any attempts to manipulate analytics or "spam-click" view counters will result in immediate termination.</p>
          
          <h3>4. Metrics, Analytics, and Interactions</h3>
            <p><strong>Intentional View Tracking:</strong> The views displayed on your dashboard represent focused attention. Views are only incremented when another user deliberately pauses their cursor over your card (desktop) or taps the card layout to expand the text description drawer (mobile).</p>
            <p><strong>Data Structure:</strong> The dashboard view total is a rolling numerical aggregate. It represents total interaction instances and does not explicitly break down unique visitor profiles unless specified by a premium feature.</p>
          
          <h3>5. Premium Tiers, Token Packs, and Monetization</h3>
            <p><strong>Subscription Gating:</strong> Certain privacy features, such as changing a secondary moment's visibility to "Match Only," are premium functionalities and may require an active paid subscription.</p>
            <p><strong>Connection Tokens:</strong> The Platform may restrict the number of connection requests ("Let's Connect") you can send for free each week. Additional connection capacity can be purchased via non-refundable token bundles</p>
            <p><strong>Billing:</strong> All financial transactions are processed securely via third-party gateways. Subscriptions renew automatically unless cancelled prior to the billing cycle end date.</p>
          
          <h3>6. Limitation of Liability and Termination</h3>
            <p><strong>User Interactions:</strong> We do not conduct criminal background checks on users. You are solely responsible for your interactions, communications, and real-life meetings with other members.</p>
             <p><strong>Account Termination:</strong> We reserve the right, in our sole discretion, to modify, suspend, or terminate your account immediately and without notice if you violate any provision of these Terms or fail to meet the platform's content standards.</p>
        

          <h3>7. Privacy Policy & GDPR Compliance</h3>
                <p>
                In accordance with the General Data Protection Regulation (GDPR), the data controller is spotkac. 
                We process your registration details, avatar photo, and multimedia files uploaded as moments.
                </p>
                <p>
                <strong>File Storage and Location:</strong> All uploaded image and video files are securely stored on 
                encrypted cloud storage servers located strictly within the European Union (EU). Your data is never 
                transferred to third countries outside the EEA.
                </p>
                <p>
                <strong>Automated Metadata Scrubbing (EXIF):</strong> To safeguard your personal safety and location privacy, 
                our system automatically and permanently strips all embedded EXIF metadata (including precise GPS coordinates, 
                device models, and capture timestamps) from every image file immediately upon upload, prior to publication.
                </p>
                <p>
                <strong>Data Retention and Erasure:</strong> Uploaded moments are retained only as long as your account remains 
                active or until you manually delete them via your dashboard. Requesting account erasure (the "Right to be Forgotten") 
                triggers the permanent deletion of all your multimedia assets and interaction logs from our live production servers within 30 days.
                </p>
                
            <p>
                <strong>Protection of Private Documents and Intellectual Property:</strong> Every Moment, profile image, 
                text description, and chat message published on the Platform constitutes a private document and the intellectual 
                property of the owner who published it. Users are strictly prohibited from copying, downloading, distributing, 
                sharing outside the Platform, or publishing any content belonging to another user <strong> without the "express written 
                consent of the owner"</strong>. Any violation of this rule, including sharing screenshots of other users' profiles or private 
                conversations, will result in immediate, permanent account termination and potential legal action.
                </p>


            <h3>8. User Safety & Policy Updates</h3>
                <p>
                We reserve the right to modify these engagement thresholds to protect network stability and 
            minimize spam bots. Continued use of our network infrastructure following updates constitutes 
            implicit acceptance of modified terms.
          </p>

        </div>

      </div>
    </section>
  );
};
 
export default TermsAndConditions