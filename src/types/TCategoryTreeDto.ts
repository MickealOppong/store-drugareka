
export type TCategoryTreeDto={
     id:number
     name:string;
    slug:string;
    path:string
    subCategories:TSubCategory[]
}

export type TSubCategory={
      id:number
     name:string;
     parent:string
     path:string
    slug:string;
}