
export const appName = "kasoa";
export const appPurpose = "Designed for real connections.";
export const loginText1 = "Welcome back!";
export const loginText2 = "Log in to continue your adventure";
export const googleLogin = "Continue with Google";
export const appleLogin = "Continue with Apple";
export const terms_conditions =
  "I agree to terms and conditions regarding usage of spotkac.com.";
export const privacyPolicy =
  "I agree to processing of my data in line with data protection policy and GDPR.";

export const SHIPPING_METHOD = [
  {
    id: 1,
    value: "inpost",
    method: "inpost_courier",
  },
  {
    id: 2,
    value: "dpd",
    method: "dpd",
  },
   {
    id: 3,
    value: "locker",
    method: "locker_title",
  },
    {
    id: 3,
    value: "courier",
    method: "home_title",
  },
];

export const ITEM_SIZE = [
  {
    id: 1,
    value: "small_up_10kg",
    name: "Small - up to 10kg",
  },
  {
    id: 2,
    value: "medium_up_20kg",
    name: "Medium - up to 20kg",
  },
  {
    id: 3,
    value: "large_up_30kg",
    name: "Large - up to 30kg",
  },
  {
    id: 4,
    value: "xlarge_up_50kg",
    name: "xlarge - up to 50kg",
  },{
    id:5,
    value:"heavy_over_50kg",
    name:"Heavy - over 50kg"
  }
];




import { FaRunning } from "react-icons/fa";
import {
  FaBook,
  FaBriefcase,
  FaCar,
  FaChild,
  FaDumbbell,
  FaGamepad,
  FaHouse,
  FaMobileScreen,
  FaPaw,
  FaPerson,
  FaShirt,
  FaSuitcase,
  FaWandMagicSparkles
} from "react-icons/fa6";

export const CATEGORY_HEADERS = [
  {
    key: "electronics",
    icon: FaMobileScreen,
    color: "#0284c7" // Slate Blue
  },
  {
    key: "women",
    icon: FaShirt,
    color: "#db2777" // Rose Pink
  },
  {
    key: "men",
    icon: FaPerson,
    color: "#2563eb" // Royal Blue
  },
  {
    key: "kids",
    icon: FaChild,
    color: "#ea580c" // Playful Orange
  },
  {
    key: "home_garden",
    icon: FaHouse,
    color: "#16a34a" // Emerald Green
  },
  {
    key: "sports_recreation",
    icon: FaDumbbell,
    color: "#4f46e5" // Indigo Indigo
  },
  {
    key: "automotive",
    icon: FaCar,
    color: "#475569" // Charcoal Metallic
  },
  {
    key: "books_media",
    icon: FaBook,
    color: "#9333ea" // Deep Violet
  },
  {
    key: "beauty_health",
    icon: FaWandMagicSparkles,
    color: "#0d9488" // Warm Teal
  },
  {
    key: "office_business",
    icon: FaBriefcase,
    color: "#78350f" // Vintage Brown
  },
  {
    key: "hobbies_collectibles",
    icon: FaGamepad,
    color: "#e11d48" // Ruby Crimson
  },
  {
    key: "pets",
    icon: FaPaw,
    color: "#ca8a04" // Warm Amber
  },
  {
    key: "travel_luggage",
    icon: FaSuitcase,
    color: "#059669" // Sage Mint
  },
   {
    key: "sports_outdoor",
    icon: FaRunning,
    color: "#d00e7c" // Sage Mint
  }
];


export const STATUS_LIST = [
  { id: "pending", label: "Pending" },
  { id: "pending_payout", label: "Awaiting payment" },
  { id: "paid", label: "Paid" },
  { id: "completed", label: "Completed" },
  { id: "failed", label: "Failed" },
  { id: "cancelled", label: "Cancelled" },
  { id: "created", label: "Created" },
  { id: "refund", label: "Refund" },
  { id: "approved", label: "Approved" },
  { id: "processing", label: "Processing" },
  { id: "Ready_for_review", label: "Ready for review" },
  { id: "reversed", label: "Reversed" },
  { id: "transferred", label: "Transferred" }
];


export const DELIVERY_OPTIONS = [
  // DPD
  {
    id:1,
    value: 'DPD_PICKUP',
    label: 'DPD Pickup',
  },
  {
    id:2,
    value: 'DPD_COURIER_PICKUP',
    label: 'DPD Courier Pickup',
  },
  {
    id:3,
    value: 'DPD_PICKUP_TO_ADDRESS',
    label: 'DPD Pickup to Address',
  },
  {
    id:4,
    value: 'DPD_CLASSIC_COURIER',
    label: 'DPD Classic Courier',
  },

  // InPost
  {
    id:5,
    value: 'INPOST_LOCKER',
    label: 'InPost Parcel Locker',
  },
  {
    id:6,
    value: 'INPOST_COURIER',
    label: 'InPost Courier',
  }, {
    id:6,
    value: 'OTHER',
    label: 'Quotation',
  },
];

export const CHECKOUT_OPTIONS = [
  // DPD
  {
    id:1,
    value: 'PICKUP',
    label: "Pickup",
    desc:'Pickup from a designated point',
  },
  {
    id:3,
    value: 'HOME_COURIER',
    label: 'Home Courier',
        desc:'Home delivery by Courier',
  },

  // InPost
  {
    id:2,
    value: 'PARCEL_LOCKER',
    label: 'Parcel Locker',
      desc:'Collect from Locker',
  },
  
   {
    id:4,
    value: 'PERSONAL_PICKUP',
    label: 'Personal pickup',
      desc:'Collect from seller',
  },
];


export const COLLECTION_CITIES = [
  { value: "warszawa", label: "Warszawa" },
  { value: "krakow", label: "Kraków" },
  { value: "lodz", label: "Łódź" },
  { value: "wroclaw", label: "Wrocław" },
  { value: "poznan", label: "Poznań" },
  { value: "gdansk", label: "Gdańsk" },
  { value: "szczecin", label: "Szczecin" },
  { value: "bydgoszcz", label: "Bydgoszcz" },
  { value: "lublin", label: "Lublin" },
  { value: "bialystok", label: "Białystok" },
  { value: "katowice", label: "Katowice" },
  { value: "gdynia", label: "Gdynia" },
  { value: "czestochowa", label: "Częstochowa" },
  { value: "radom", label: "Radom" },
  { value: "torun", label: "Toruń" },
  { value: "sosnowiec", label: "Sosnowiec" },
  { value: "rzeszow", label: "Rzeszów" },
  { value: "kielce", label: "Kielce" },
  { value: "gliwice", label: "Gliwice" },
  { value: "olsztyn", label: "Olsztyn" },
  { value: "zabrze", label: "Zabrze" },
  { value: "bytom", label: "Bytom" },
  { value: "bielsko-biala", label: "Bielsko-Biała" },
  { value: "zielona-gora", label: "Zielona Góra" },
  { value: "rybnik", label: "Rybnik" },
  { value: "ruda-slaska", label: "Ruda Śląska" },
  { value: "tychy", label: "Tychy" },
  { value: "opole", label: "Opole" },
  { value: "gorzow-wielkopolski", label: "Gorzów Wielkopolski" },
  { value: "dabrowa-gornicza", label: "Dąbrowa Górnicza" },
  { value: "plock", label: "Płock" },
  { value: "elblag", label: "Elbląg" },
  { value: "tarnow", label: "Tarnów" },
  { value: "koszalin", label: "Koszalin" },
  { value: "wloclawek", label: "Włocławek" },
  { value: "chorzow", label: "Chorzów" },
  { value: "legnica", label: "Legnica" },
  { value: "grudziadz", label: "Grudziądz" },
  { value: "nowy-sacz", label: "Nowy Sącz" },
  { value: "kalisz", label: "Kalisz" },
  { value: "jaworzno", label: "Jaworzno" },
  { value: "slupsk", label: "Słupsk" },
  { value: "jastrzebie-zdroj", label: "Jastrzębie-Zdrój" },
  { value: "jelenia-gora", label: "Jelenia Góra" },
  { value: "konin", label: "Konin" },
  { value: "piotrkow-trybunalski", label: "Piotrków Trybunalski" },
  { value: "inowroclaw", label: "Inowrocław" },
  { value: "lubin", label: "Lubin" },
  { value: "ostrow-wielkopolski", label: "Ostrów Wielkopolski" },
  { value: "stargard", label: "Stargard" },
]

export type CityRegion = {
  id: string;
  name: string;
  cities: string[];
};

export const CITY_REGION: CityRegion[] = [
  {
    id: "dolnoslaskie",
    name: "Dolnośląskie",
    cities: [
      "Bolesławiec",
      "Dzierżoniów",
      "Głogów",
      "Jelenia Góra",
      "Legnica",
      "Lubin",
      "Oleśnica",
      "Oława",
      "Świdnica",
      "Wałbrzych",
      "Wrocław",
    ],
  },
  {
    id: "kujawsko-pomorskie",
    name: "Kujawsko-Pomorskie",
    cities: [
      "Bydgoszcz",
      "Grudziądz",
      "Inowrocław",
      "Toruń",
      "Włocławek",
    ],
  },
  {
    id: "lubelskie",
    name: "Lubelskie",
    cities: [
      "Biała Podlaska",
      "Chełm",
      "Kraśnik",
      "Lublin",
      "Puławy",
      "Świdnik",
      "Zamość",
    ],
  },
  {
    id: "lubuskie",
    name: "Lubuskie",
    cities: [
      "Gorzów Wielkopolski",
      "Nowa Sól",
      "Zielona Góra",
      "Żary",
    ],
  },
  {
    id: "lodzkie",
    name: "Łódzkie",
    cities: [
      "Bełchatów",
      "Kutno",
      "Łódź",
      "Pabianice",
      "Piotrków Trybunalski",
      "Radomsko",
      "Sieradz",
      "Skierniewice",
      "Tomaszów Mazowiecki",
      "Zduńska Wola",
      "Zgierz",
    ],
  },
  {
    id: "malopolskie",
    name: "Małopolskie",
    cities: [
      "Chrzanów",
      "Kraków",
      "Nowy Sącz",
      "Nowy Targ",
      "Olkusz",
      "Oświęcim",
      "Tarnów",
    ],
  },
  {
    id: "mazowieckie",
    name: "Mazowieckie",
    cities: [
      "Ciechanów",
      "Grodzisk Mazowiecki",
      "Legionowo",
      "Marki",
      "Mińsk Mazowiecki",
      "Mława",
      "Ostrołęka",
      "Otwock",
      "Piaseczno",
      "Płock",
      "Pruszków",
      "Radom",
      "Siedlce",
      "Sochaczew",
      "Warszawa",
      "Wołomin",
      "Ząbki",
      "Żyrardów",
    ],
  },
  {
    id: "opolskie",
    name: "Opolskie",
    cities: [
      "Brzeg",
      "Kędzierzyn-Koźle",
      "Nysa",
      "Opole",
    ],
  },
  {
    id: "podkarpackie",
    name: "Podkarpackie",
    cities: [
      "Dębica",
      "Jarosław",
      "Jasło",
      "Krosno",
      "Mielec",
      "Przemyśl",
      "Rzeszów",
      "Sanok",
      "Stalowa Wola",
      "Tarnobrzeg",
    ],
  },
  {
    id: "podlaskie",
    name: "Podlaskie",
    cities: [
      "Białystok",
      "Łomża",
      "Suwałki",
    ],
  },
  {
    id: "pomorskie",
    name: "Pomorskie",
    cities: [
      "Chojnice",
      "Gdańsk",
      "Gdynia",
      "Kwidzyn",
      "Lębork",
      "Malbork",
      "Pruszcz Gdański",
      "Rumia",
      "Słupsk",
      "Sopot",
      "Starogard Gdański",
      "Tczew",
      "Wejherowo",
    ],
  },
  {
    id: "slaskie",
    name: "Śląskie",
    cities: [
      "Będzin",
      "Bielsko-Biała",
      "Bytom",
      "Chorzów",
      "Cieszyn",
      "Czechowice-Dziedzice",
      "Częstochowa",
      "Dąbrowa Górnicza",
      "Gliwice",
      "Jastrzębie-Zdrój",
      "Jaworzno",
      "Katowice",
      "Knurów",
      "Mikołów",
      "Mysłowice",
      "Piekary Śląskie",
      "Racibórz",
      "Ruda Śląska",
      "Rybnik",
      "Siemianowice Śląskie",
      "Sosnowiec",
      "Świętochłowice",
      "Tarnowskie Góry",
      "Tychy",
      "Wodzisław Śląski",
      "Zabrze",
      "Zawiercie",
      "Żory",
    ],
  },
  {
    id: "swietokrzyskie",
    name: "Świętokrzyskie",
    cities: [
      "Kielce",
      "Ostrowiec Świętokrzyski",
      "Skarżysko-Kamienna",
      "Starachowice",
    ],
  },
  {
    id: "warminsko-mazurskie",
    name: "Warmińsko-Mazurskie",
    cities: [
      "Elbląg",
      "Ełk",
      "Iława",
      "Olsztyn",
      "Ostróda",
    ],
  },
  {
    id: "wielkopolskie",
    name: "Wielkopolskie",
    cities: [
      "Gniezno",
      "Kalisz",
      "Konin",
      "Leszno",
      "Luboń",
      "Ostrów Wielkopolski",
      "Piła",
      "Poznań",
      "Września",
    ],
  },
  {
    id: "zachodniopomorskie",
    name: "Zachodniopomorskie",
    cities: [
      "Kołobrzeg",
      "Koszalin",
      "Szczecin",
      "Szczecinek",
      "Stargard",
      "Świnoujście",
    ],
  },
];
