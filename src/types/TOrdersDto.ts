export type TOrdersDto = {
  id: number;
  buyer: string;
  orderStatus: string;
    orderItemStatus: string;
  currency: string;
  createdAt: Date;
  paidAt: Date;
  seller: string;
  orderNumber: string;
  price: number;
  shipping:number,
  serviceCharge:number
  deliveryStatus?:string
  trackingNumber?:string
  deliveryUpdatedAt:Date
};
