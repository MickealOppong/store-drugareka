import type { TbrandDto } from "./TBrandResponse";
import type { TCategoryDto } from "./TCategoryResponse";

export type TProduct = {
  productId: number;
  brand: TbrandDto
  name:string,
  description:string,
  category:TCategoryDto
  price: number;
  oldPrice: number;
  condition: string;
  image: string;
};
