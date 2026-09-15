export type TListComplaintPage={
   complaintResponseList:TComplaints[],
    pageSize:number,
page:number,
totalPages:number,
totalElements:number
}

export type TComplaints={
    id:number
    ticketId:string,
    orderNumber:string,
    user:string,
    issue:string,
    description:string,
    status:string,
    createdAt:Date
}