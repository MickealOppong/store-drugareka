import { useTranslation } from 'react-i18next';
import './../css/LangSwitch.css';


// Define the shape of our supported languages configuration array
interface LangOption {
  code: string;
  label: string;
}

interface LanguageSwitcherProps {
  isAuthenticated?: boolean; // Pass true when the user enters the active app dashboard
}

const LANGUAGES: LangOption[] = [
  { code: 'pl', label: 'PL' },
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
  { code: 'fr', label: 'FR' },
  { code: 'tw', label: 'TWI' }
];


const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ isAuthenticated = false }) => {
  const { i18n } = useTranslation();
  
  // Extracts the base 2-letter locale prefix cleanly (e.g., 'pl-PL' -> 'pl')
  const currentLang = i18n.language ? i18n.language.split('-')[0] : 'pl';

  const handleLanguageChange = (selectedLanguage: string) => {
    i18n.changeLanguage(selectedLanguage); // Updates the i18next global state engine and handles caching
  };

  return (
    <div className="language-component-wrapper">
      {/* 
        TIER 1 AUTHENTICATED: 
        Language is immutable. Option switches are fully stripped to prevent dynamic data-label mismatches.
      */}
      {isAuthenticated ? (
        <div className="language-badge-locked">
          <span className="lock-icon" aria-hidden="true">🔒</span>
          <span>
            Language locked: <strong>{currentLang.toUpperCase()}</strong>
          </span>
        </div>
      ) : (
        /* 
          TIER 2 GUEST (Landing/Registration/Login Pages): 
          Fully interactive premium layout slider pill capsule matrix allows seamless swapping.
        */
        <div className="app-language-toggle">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              className={currentLang === lang.code ? 'active' : ''}
              onClick={() => handleLanguageChange(lang.code)}
              aria-label={`Switch language to ${lang.label}`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
