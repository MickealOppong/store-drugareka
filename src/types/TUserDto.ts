export type TUserDto={
    userId:number
    firstName:string,
    lastName:string,
    username:string
    roles:string[],
    tokenDto?:{
        expiredAt:string,
        issuedAt:string,
        refreshToken:string,
        token:string
    }
}