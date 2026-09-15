import type { TOrdersDto } from "./TOrdersDto"

export type TOrderPageDto={

      orders:TOrdersDto[],
     pageSize:number,
    page:number,
    totalPages:number,
    totalElements:0
    
    
}