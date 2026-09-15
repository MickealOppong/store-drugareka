export type TUser ={
    userId?:number,
    firstName:string,
    lastName:string,
    email:string,
    roles:string[]|string,
    isTermsAccepted:boolean,
    dob:Date,
    password:string
}