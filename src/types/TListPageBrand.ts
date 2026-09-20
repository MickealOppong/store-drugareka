import type { TbrandResponse } from "./TBrandResponse"

export type TListPageBrand={
  brands:TbrandResponse[]
 pageSize:number,
page:number,
totalPages:number,
totalElements:number

}