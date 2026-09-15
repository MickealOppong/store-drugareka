import type { TFile } from "./TFile";

export type TProductData={
    images: TFile[];
    id: number;
    name: string;
    category: string;
    description: string;
    price: string;
    quantity: string;
    condition: string;
    brand: string;
    sku: string;
    shippingInfo: string;
    status:string;
    imageSortOrder:number[],
    shippingMethod:string
}