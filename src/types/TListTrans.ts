import type { TMedia } from "../types/TMedia";
import type { TPriceDto } from "../types/TPriceDto";

export type TListTrans = {
  listingId: number;
  inventoryId: number;

  productId: number;

  brand: string;
  sellerId: number;

  category:{
    name:string,
    path:string
  }
  shippingCost:number,
  serviceCharge:number

  productName: string;

  productSlug: string;
  priceDto:TPriceDto
  media:TMedia[]
sku:string
  productDescription: string;
  isNegotiable:boolean;

  productCondition: string;
  shippingMethod:string
  shipping:string

  inventoryStatus: string;
  listingStatus: string;
  createdAt:Date,
  itemSize:string,
    width:string,
    height:string,
    depth:string,
    model:string,
    productionYear:string,
    itemNumber:string
};
