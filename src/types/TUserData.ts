import type { TUserPost } from "./TUserPost"

export type TUserData={
    firstName:string,
    lastName:string,
    profession:string,
    language:string,
    drinking:string,
    pets:string,
    smoking:string,
    education:string,
    preference:string,
    lookingFor:string,
    hasMatchRequest:boolean,
    aboutMe:string,
    aboutThem:string,
    date_of_birth:string,
    height:string,
    country:string,
    city:string,
    gender:string,
    username:string,
    profileImage:string,
    id:number,
    postDtoList:TUserPost[]
    rulesAccepted:boolean,
    planningStyle:string,
    chronoType:string,
    socialEnergy:string

}