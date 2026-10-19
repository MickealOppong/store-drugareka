import type { TMedia } from "../types/TMedia";

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
minPrice:number
  productSlug: string;
 oldPrice:number,
 newPrice:number,
 negotiable:boolean,
  media:TMedia[]
sku:string
  productDescription: string;


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
