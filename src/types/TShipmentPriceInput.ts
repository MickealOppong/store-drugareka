export type TShippingSize = "SMALL" | "MEDIUM" | "LARGE" | "HEAVY";
export type TShippingMethod = "STANDARD" | "BULKY" | "PALLET"

export interface TShipmentPriceInput {
  id?:number
  itemSize: string
  shippingMethod: string
  price: string;
  active: boolean;
}