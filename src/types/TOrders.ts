export type TOrders={
    orderId:number,
    buyer:{
        userId:number,
        name:string,
        username:string
    },
    seller:{
        userId:number,
        name:string,
        username:string
    },
    status:string,
    totalAmount:number
    currency:string,
    createdAt:string
}

