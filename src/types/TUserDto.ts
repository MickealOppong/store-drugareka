import type { TAddress } from "../components/CartAddressManager"

export type TUserDto={
    userId:number
    firstName:string,
    lastName:string,
    email:string
    sellerId:number
    roles:string[],
    tokenDto?:{
        expiredAt:string,
        issuedAt:string,
        refreshToken:string,
        token:string
    },
    address:TAddress,
    hasAddress:string
}