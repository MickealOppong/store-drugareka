import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { TCategoryReponse } from "../../types/TCategoryResponse";
import type { TListPageDto } from "../../types/TListPageDto";
import type { TListTrans } from "../../types/TListTrans";
import type { TResponseDto } from "../../types/TResponseDto";
import { baseUrl } from "./baseUrl";

export const storeApi = createApi({
  reducerPath: "storeApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
       prepareHeaders: (headers) => {
      // RTK Query runs this function EVERY time you make a request
      const token = localStorage.getItem("tk") ?? "";

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        //  headers.set('Content-Type','application/json')
      }
      return headers;
    },
  }),
  tagTypes: ["listings", "categories","listing"],
  endpoints: (build) => ({
    getStoreListings: build.query<TListTrans[], void>({
      query: () => ({
        url: "/api/store/listings",
      }),
    }),
      getStoreListingsFeed: build.query<TListPageDto, { queryCategory: string; page: number; size: number; }>({
      query: ({queryCategory,page,size}) => ({
        url: `/api/store/store-listing`,
        params:{
          queryCategory,
          page,size
        }
      }),
      providesTags:['listing']
    }),
     getAllCategories: build.query<TCategoryReponse[], void>({
      query: () => ({
        url: "/api/store/all-categories",
      }),
      providesTags: ["categories"],
    }),

    getListing: build.query<TListTrans, number>({
      query: (listingId) => ({
        url: `/api/store/listing/${listingId}`,
        params:{
            listingId
        }
      }),
      providesTags: ["listings"],
    }),
     getTop6ProductCategories: build.query<TCategoryReponse[], void>({
      query: () => ({
        url: `/api/store/top6-categories`
      }),
      providesTags: ["categories"],
    }),
       getProductCategories: build.query<TResponseDto, void>({
      query: () => ({
        url: `/api/store/all-categories`
      }),
      providesTags: ["categories"],
    }),
  }),
});
export const { useGetStoreListingsFeedQuery, useGetAllCategoriesQuery,useGetListingQuery,
  useGetProductCategoriesQuery,useGetTop6ProductCategoriesQuery,useLazyGetListingQuery
} =
  storeApi;
