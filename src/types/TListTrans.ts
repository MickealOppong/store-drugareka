import type { TMedia } from "../types/TMedia";
import type { TPriceDto } from "../types/TPriceDto";

export type TListTrans = {
  listingId: number;
  inventoryId: number;

  productId: number;

  brand: string;
  sellerId: number;

  category: string;

  productName: string;

  productSlug: string;
  priceDto:TPriceDto
  media:TMedia[]
sku:string
  productDescription: string;

  productCondition: string;
  shippingMethod:string
  shipping:string

  inventoryStatus: string;
  listingStatus: string;
  createdAt:Date
};
