export type TInventoryItemResponse = {
  i: number;

  productId: number;

  brand: string;

  category: string;

  productName: string;

  slug: string;

  description: string;

  condition: string;
  inventoryStatus:string

  inventoryItemPrice: number[];

  status: string;
};
