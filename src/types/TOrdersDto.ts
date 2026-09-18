export type TOrdersDto = {
  id: number;
  buyer: string;
  orderStatus: string;
  currency: string;
  createdAt: Date;
  paidAt: Date;
  seller: string;
  orderNumber: string;
  orderTotal: number;
  shipping:number
  deliveryStatus?:string
  trackingNumber?:string
};
