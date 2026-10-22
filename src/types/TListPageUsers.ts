import type { TUserDto } from "./TUserDto"

export type TListPageUsers={
   userList:TUserDto[],
 pageSize:number,
page:number,
totalPages:number,
accumulatedItems:number
totalElements:number

}

