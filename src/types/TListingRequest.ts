/*
export type TListingRequest={
    active:boolean,
    brand:TbrandDto,
    category:TCategoryDto,
    condition:string,
    description:string,
    images:Blob[],
    name:string,
    price:string,
    quantity:string,
    shipping:string,
    sku:string,
    slug:string;

}
*/

export type TListingRequest ={
    productData:FormData,
    images:Blob[]
}