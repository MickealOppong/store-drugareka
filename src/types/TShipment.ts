export type TShipment={
    listingOrderId:number,
    seller:string,
    deliveryAddress:string,
    status:string,
    shippedAt:Date,
    deliveredAt:Date
      id:number,
}

export type TListShipmentPage={
  
     shipments:TShipment[],
     pageSize:number,
    page:number,
    totalPages:number,
    totalElements:0
}