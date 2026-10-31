
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
    value: "large_up_50kg",
    name: "Large - up to 50kg",
  },
  {
    id: 4,
    value: "heavy_above_50kg",
    name: "Heavy - over 50kg",
  },
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
    value: 'DPD_PICKUP',
    label: "Pickup",
    desc:'Pickup from a designated point',
  },
  {
    id:3,
    value: 'DPD_CLASSIC_COURIER',
    label: 'Home Courier',
        desc:'Home delivery by Courier',
  },

  // InPost
  {
    id:2,
    value: 'INPOST_LOCKER',
    label: 'Parcel Locker',
      desc:'Collect from Locker',
  },
  
];