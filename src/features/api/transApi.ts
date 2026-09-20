import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TbrandRequest } from "../../types/TBrandRequest";
import type { TbrandResponse } from "../../types/TBrandResponse";
import type { TCategoryReponse } from "../../types/TCategoryResponse";
import type { TConditionRequest } from "../../types/TConditionRequest";
import type { TConditionResponse } from "../../types/TConditionResponse";
import type { TListPageBrand } from "../../types/TListPageBrand";
import type { TResponseDto } from "../../types/TResponseDto";
import { baseUrl } from "./baseUrl";





export const transApi = createApi({
    reducerPath:'transApi',
    baseQuery:fetchBaseQuery({
        baseUrl,
        
            prepareHeaders: (headers) => {
      // RTK Query runs this function EVERY time you make a request
      const token = localStorage.getItem('tk')??'';

      if (token) {
       headers.set('Authorization', `Bearer ${token}`);
     //  headers.set('Content-Type','application/json')
      }
      return headers;
    },
    
    }),
    tagTypes:['categories','brands','conditions'],
    endpoints:(build)=>({
        newCategory:build.mutation<TResponseDto,FormData>({
            query:(body)=>({
                url:'/api/category/new',
                method:'post',
              body
            }),
            invalidatesTags:['categories']
        }), 
          allParentcategories:build.query<string[],void>({
            query:()=>({
                url:'/api/category/parent-categories',
            }),
            providesTags:['categories']
        }),
       
           getCategory:build.query<TCategoryReponse,number>({
            query:(id)=>({
                url:`/api/category/${id}`,
                params:{
                    id
                }
            }),
            providesTags:['categories']
        }),
         editCategory:build.mutation<TResponseDto,FormData>({
            query:(body)=>({
                url:'/api/category/edit',
               body,
               method:"PUT"
            }),
            invalidatesTags:['categories']
        }),
         deleteCategory:build.mutation<TResponseDto,number>({
            query:(id)=>({
                url:'/api/category/delete',
               params:{
                id
               },
               method:"DELETE"
            }),
            invalidatesTags:['categories']
        }),
          getAllCategories: build.query<TCategoryReponse[], void>({
              query: () => ({
                url: "/api/store/all-categories",
              }),
              providesTags: ["categories"],
            }),
          getAllBrands:build.query<TListPageBrand,{page:number,size:number}>({
            query:({page,size})=>({
                url:'/api/brands/all',
                params:{
                    page,size
                }
            }),
            providesTags:['brands']
        }),
           getBrands:build.query<TListPageBrand,void>({
            query:()=>({
                url:'/api/brands/list',
            }),
            providesTags:['brands']
        }),
           fetchBrand:build.query<TbrandResponse,number>({
            query:(id)=>({
                url:'/api/brands/${id}',
                params:{
                    id
                }
            }),
            providesTags:['brands']
        }),
         newBrand:build.mutation<TResponseDto,TbrandRequest>({
            query:(body)=>({
                url:'/api/brands/new',
                method:'post',
              body
            }),
            invalidatesTags:['brands']
        }),
         editBrand:build.mutation<TResponseDto,TbrandResponse>({
            query:(body)=>({
                url:'/api/brands/edit',
               body,
               method:"PUT"
            }),
            invalidatesTags:['brands']
        }),
          deleteBrand:build.mutation<TResponseDto,number>({
            query:(id)=>({
                url:'/api/brands/delete',
               params:{
                id
               },
               method:"DELETE"
            }),
            invalidatesTags:['categories']
        }),
           deleteCondition:build.mutation<TResponseDto,number>({
            query:(id)=>({
                url:'/api/conditions/delete',
               params:{
                id
               },
               method:"DELETE"
            }),
            invalidatesTags:['conditions']
        }),
             newCondition:build.mutation<TResponseDto,TConditionRequest>({
            query:(body)=>({
                url:'/api/conditions/new',
                method:'post',
              body
            }),
            invalidatesTags:['conditions']
        }),
           editCondition:build.mutation<TResponseDto,FormData>({
            query:(body)=>({
                url:'/api/conditions/edit',
                method:'PUT',
              body
            }),
            invalidatesTags:['conditions']
        }),
          getCondition:build.query<TResponseDto,number>({
            query:(id)=>({
                url:'/api/conditions/${id}',
                params:{
                    id
                }
            }),
            providesTags:['conditions']
        }),
           getAllConditions:build.query<TConditionResponse[],void>({
            query:()=>({
                url:'/api/conditions/all',
            }),
            providesTags:['conditions']
        }),
    })
})
export const {useNewCategoryMutation,useLazyAllParentcategoriesQuery,useEditCategoryMutation,useLazyGetCategoryQuery
    ,useDeleteCategoryMutation,useDeleteBrandMutation,useEditBrandMutation,useNewBrandMutation,useLazyFetchBrandQuery,
    useLazyGetConditionQuery,useGetAllConditionsQuery,useNewConditionMutation,useDeleteConditionMutation,useGetAllBrandsQuery,
    useGetAllCategoriesQuery,useEditConditionMutation,useGetBrandsQuery
}= transApi