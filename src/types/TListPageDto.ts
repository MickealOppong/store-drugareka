import type { TListTrans } from "./TListTrans"

export type TListPageDto={
   listings:TListTrans[],
 pageSize:number,
page:number,
totalPages:number,
totalElements:number

}

