import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { TCategoryReponse } from "../../types/TCategoryResponse";
import type { TListPageDto } from "../../types/TListPageDto";
import type { TListTrans } from "../../types/TListTrans";
import type { TResponseDto } from "../../types/TResponseDto";

import type { TCategoryTreeDto } from "../../types/TCategoryTreeDto";
import type { TSellingActivity } from "../../types/TSellingActivity";
import { CookieService } from "../../util/util";
import { baseUrl } from "./baseUrl";

export const storeApi = createApi({
  reducerPath: "storeApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
       // RTK Query runs this function EVERY time you make a request
        const token = CookieService.get("tk") ?? "";

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        //  headers.set('Content-Type','application/json')
      }
                  // user preferred langauge selected
      const currentLanguage = localStorage.getItem('i18nextLng') as string
      headers.set("Accept-Language", currentLanguage);
      return headers;
    },
  }),
  tagTypes: ["listings", "categories", "listing"],
  endpoints: (build) => ({
    getStoreListings: build.query<TListTrans[], void>({
      query: () => ({
        url: "/api/store/listings",
      }),
    }),
    getStoreListingsFeed: build.query<TListPageDto,{ queryCategory: string; page: number; size: number }>({
      query: ({ queryCategory, page, size }) => ({
        url: `/api/store/store-listing`,
        params: {
          queryCategory,
          page,
          size
        },
      }),
      providesTags: ["listing"],
    }),
    getAllParentCategories: build.query<TCategoryReponse[], void>({
      query: () => ({
        url: "/api/store/parent-categories",
      }),
      providesTags: ["categories"],
    }),
      getCategoryTree: build.query<TCategoryTreeDto[], void>({
      query: () => ({
        url: "/api/store/category-tree",
      }),
      providesTags: ["categories"],
    }),

    getListing: build.query<TListTrans, number>({
      query: (listingId) => ({
        url: `/api/store/listing/${listingId}`,
        params: {
          listingId,
        },
      }),
      providesTags: ["listings"],
    }),
    getTop6ProductCategories: build.query<TCategoryReponse[], void>({
      query: () => ({
        url: `/api/store/top6-categories`,
      }),
      providesTags: ["categories"],
    }),
        getTop12ProductCategories: build.query<TCategoryReponse[], void>({
      query: () => ({
        url: `/api/store/top12-categories`,
      }),
      providesTags: ["categories"],
    }),
    getProductCategories: build.query<TResponseDto, void>({
      query: () => ({
        url: `/api/store/all-categories`,
      }),
      providesTags: ["categories"],
    }),
        getLandingListing: build.query<TListTrans[], void>({
      query: () => ({
        url: `/api/store/landing-listing`,
      }),
      providesTags: ["listings"],
    }),

    getRecentSellerActivity: build.query<TSellingActivity[], void>({
      query: () => ({
        url: "/api/analytics/seller-recent",
      }),
      providesTags: ["listings"],
    }),
        confirmDelivery: build.mutation<boolean, string>({
      query: (token) => ({
        url: "/api/store/confirm-delivery",
        params:{
          token
        },
        method:'put'
      }),
    }),
  }),
  
});
export const {
  useGetStoreListingsFeedQuery,
  useGetAllParentCategoriesQuery,
  useGetListingQuery,
  useGetProductCategoriesQuery,
  useGetTop6ProductCategoriesQuery,
  useLazyGetListingQuery,
  useGetRecentSellerActivityQuery,
  useGetLandingListingQuery,
  useConfirmDeliveryMutation,
  useGetCategoryTreeQuery,
  useGetTop12ProductCategoriesQuery
} = storeApi;
