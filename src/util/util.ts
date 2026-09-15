
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const storeToLocalStorage=(name:string,data:string)=>{
    localStorage.setItem(name,data)
}

export const fromLocalStorage=(name:string)=>{
   return localStorage.getItem(name);
}


export const removeFromLocalStorage=(name:string)=>{
    localStorage.removeItem(name);
}


  export const POLISH_CITIES = [
    "Warszawa", "Kraków", "Łódź", "Wrocław", "Poznań", 
    "Gdańsk", "Szczecin", "Bydgoszcz", "Lublin", "Białystok", 
    "Katowice", "Gdynia", "Częstochowa", "Radom", "Rzeszów", 
    "Toruń", "Sosnowiec", "Kielce", "Gliwice", "Olsztyn", 
    "Zabrze", "Bielsko-Biała", "Bytom", "Zielona Góra", "Rybnik", 
    "Ruda Śląska", "Opole", "Tychy", "Gorzów Wielkopolski", "Elbląg"
  ];

  
export const getDaysFromNow=(inputDate:Date|string)=>{
    const past = new Date(inputDate).getTime();
  const now = Date.now();
    
  const diffInMs = now - past;

  
  
  // Math.abs handles both past and future dates
  const diff = Math.abs(diffInMs); 
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const years = Math.floor(days / 365);
    
    if(minutes <1){
        
         return "now" ;
    }

    if(minutes <60){
        
         return minutes=== 1 ? "a m ago" : `${minutes} m ago`;
    }

     if(hours <24){
         return hours === 1 ? "hr ago" : `${hours} hr ago`;
    }
      if(days <31){
         return days === 1 ? "1d ago" : `${days} d ago`;
    }

     return years === 1 ? "1 yr ago" : `${years} yr ago`;
     
}


export const getAgeFromDateOfBirth =(date:string)=>{
  
  const today = new Date();
  const birthDate = new Date(date);

  let age = today.getFullYear() - birthDate.getFullYear();
  
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // Reduce age by 1 if the birthday has not occurred yet this year
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}





// Translation dictionary for "Yesterday" and fallback day formatting for Twi
const translations: Record<string, { yesterday: string; weekdays?: string[]; shortMonth?: string }> = {
  en: { yesterday: "Yesterday" },
  fr: { yesterday: "Hier" },
  pl: { yesterday: "Wczoraj" },
  de: { yesterday: "Gestern" },
  tw: { 
    yesterday: "Anwummerɛ", 
    weekdays: ["Kwasieda", "Dwowda", "Benada", "Wukuda", "Yawoada", "Fiada", "Memeneda"]
  }
};

export function formatLastSentDate(dateInput: Date | string | number, localeInput:string) {
  if (!dateInput) return "";

  const locale =localeInput;
  const msgDate = new Date(dateInput);
  const now = new Date();

  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayMidnight = new Date(todayMidnight);
  yesterdayMidnight.setDate(yesterdayMidnight.getDate() - 1);
  
  const sevenDaysAgoMidnight = new Date(todayMidnight);
  sevenDaysAgoMidnight.setDate(sevenDaysAgoMidnight.getDate() - 7);

  const t = translations[locale] || translations.en;

  // --- SCENARIO 1: SENT TODAY -> Return Time (e.g., "10:15 AM" or "22:15") ---
  if (msgDate >= todayMidnight) {
    // Automatically uses 12-hour clock for EN, and 24-hour clock for FR/PL/DE based on global standards
    const use12Hour = locale === 'en' || locale === 'tw';
    return msgDate.toLocaleTimeString(locale === 'tw' ? 'en' : locale, { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: use12Hour 
    });
  }

  // --- SCENARIO 2: SENT YESTERDAY -> Return Translated "Yesterday" ---
  if (msgDate >= yesterdayMidnight && msgDate < todayMidnight) {
    return t.yesterday;
  }

  // --- SCENARIO 3: SENT WITHIN 7 DAYS -> Return Day Name (e.g., "Wednesday" / "Mercredi") ---
  if (msgDate >= sevenDaysAgoMidnight && msgDate < yesterdayMidnight) {
    if (locale === 'tw' && t.weekdays) {
      return t.weekdays[msgDate.getDay()];
    }
    return msgDate.toLocaleDateString(locale, { weekday: 'long' });
  }

  // --- SCENARIO 4: OLDER THAN A WEEK -> Return Calendar Date (e.g., "Jul 09" / "09 juil.") ---
  if (locale === 'tw') {
    // Custom fallback string formatting for Twi (Day / Month Number) since short names aren't standardized
    return `${msgDate.getDate()} / ${msgDate.getMonth() + 1}`;
  }
  return msgDate.toLocaleDateString(locale, { month: 'short', day: '2-digit' });
}






// Type guard function to check if the error is a standard RTK Query network error
export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error !== null && 'status' in error;
}

export function sanitizeBackendKey(rawString:string) {
  if (!rawString) return null;
  
  return rawString
    .trim()
    .toUpperCase()
      .replace(/[']+/g, '') // remove apostrophy
    .replace(/\//g, '_')     // CRUCIAL: Converts forward slashes (/) to underscores (_)
    .replace(/[-\s]+/g, '_') // Converts spaces and dashes directly to underscores
    .replace(/__+/g, '_')    // Fixes duplicate underscores (e.g. UX__UI becomes UX_UI)
    .replace(/^_+|_+$/g, ''); // Trims trailing or leading underscores
}
// src/utils/sanitizeCityKey.js
export function sanitizeKey(rawString:string) {
  if (!rawString) return 'any_city';
  
  return rawString
    .trim()
    .toLowerCase()
    .replace( /_/g,' ')
    .split(' ')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');
}

export function sanitizeCategoryKey(rawString:string) {
  if (!rawString) return 'any_city';
  
  return rawString
    .trim()
    .toLowerCase()
    .replace( /_/g,'')
    .replace(' ','_');
 
}

  /**
   *
   * @param price
   * @returns
   */
  export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pl-PL", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };


  