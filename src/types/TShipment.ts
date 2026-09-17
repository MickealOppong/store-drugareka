export type TShipment={
    listingOrderId:number,
    seller:string,
    deliveryAddress:string,
    orderNumber:string
    status:string,
    shippedAt:Date,
    deliveredAt:Date
      id:number,
      comment:string,
      trackingNumber:string
}

export type TListShipmentPage={
  
     shipments:TShipment[],
     pageSize:number,
    page:number,
    totalPages:number,
    totalElements:0
}