import type { TbrandResponse } from "./TBrandResponse";
import type { TCategoryReponse } from "./TCategoryResponse";
import type { TConditionResponse } from "./TConditionResponse";

export type TProductResponse = {
  productId: number;
  productName: string;
  category: TCategoryReponse;
  productDescription: string;
  quantity: string;
  productCondition: TConditionResponse;
  brand: TbrandResponse;
  inventoryItemPrice: number[];
  inventoryId: number;
  sku: string;
  sellerId:number;
  shipping: string;
  listingStatus: string;
  productSlug: string;
  images?: string[];
  inventoryStatus: string;
};
