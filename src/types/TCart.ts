import type { TAddress } from "../components/CartAddressManager";


export type TCart = {
  cartId: number;
  status: string;
  address:TAddress
  cartItemList:TCartItem[]
};

export type TCartItem = {

  cartItemId: number;
  productName: string;
  image: string;
  listingId: number;
  reservedUntil: Date;
  price:number,
  shipping:number,
  shippingMethod:string
};