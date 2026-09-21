import type { TAddress } from "../components/CartAddressManager"

export type TUserDto={
    userId:number
    firstName:string,
    lastName:string,
    email:string
    roles:string[],
    tokenDto?:{
        expiredAt:string,
        issuedAt:string,
        refreshToken:string,
        token:string
    },
    address:TAddress,
    accountNumber:string
}