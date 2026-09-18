import type { TbrandResponse } from "./TBrandResponse";
import type { TCategoryReponse } from "./TCategoryResponse";


export type TProduct = {
  productId: number;
  brand: TbrandResponse
  name:string,
  description:string,
  category:TCategoryReponse
  price: number;
  oldPrice: number;
  condition: string;
  image: string;
};
