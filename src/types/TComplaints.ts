export type TListComplaintPage={
   complaintResponseList:TComplaints[],
    pageSize:number,
page:number,
totalPages:number,
totalElements:number,
accumulatedItems:number
}

export type TComplaints={
    id:number
    ticketId:string,
    orderNumber:string,
    user:string,
    reason:string
    status:string,
    createdAt:Date,
    sellerComment:string,
    buyerComment:string
    listingImages:string[],
    images:string[]
}