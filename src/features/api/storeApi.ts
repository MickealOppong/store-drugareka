import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { TCategoryReponse } from "../../types/TCategoryResponse";
import type { TListPageDto } from "../../types/TListPageDto";
import type { TListTrans } from "../../types/TListTrans";
import type { TResponseDto } from "../../types/TResponseDto";

import type { TbrandResponse } from "../../types/TBrandResponse";
import type { TCategoryTreeDto } from "../../types/TCategoryTreeDto";
import type { TConditionResponse } from "../../types/TConditionResponse";
import type { TQueryDto } from "../../types/TQueryDto";
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
      const currentLanguage = localStorage.getItem("i18nextLng") as string;
      headers.set("Accept-Language", currentLanguage);
      return headers;
    },
  }),
  tagTypes: ["listings", "categories", "listing", "wishlists",'conditions','brands'],
  endpoints: (build) => ({
    getStoreListings: build.query<TListTrans[], void>({
      query: () => ({
        url: "/api/store/listings",
      }),
    }),
getStoreListingsFeed: build.query<TListPageDto, TQueryDto>({
  query: (params) => ({
    url: `/api/store/store-listing`,
    method: "GET",
    params,
  }),
  providesTags: ["listings"],
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
      providesTags: ["listing"],
    }),
       getListingBySlug: build.query<TListTrans, {slug:string,id:number}>({
      query: ({slug,id}) => ({
        url: `/api/store/listing/slug`,
        params: {
         slug,id
        },
      }),
      providesTags: ["listing"],
    }),
       getSellerListing: build.query<TListTrans[], number>({
      query: (sellerId) => ({
        url: `/api/store/listings/seller`,
        params: {
         sellerId
        },
      }),
      providesTags: ["listing"],
    }),
    getTop6ProductCategories: build.query<TCategoryReponse[], void>({
      query: () => ({
        url: `/api/store/top6-categories`,
      }),
      providesTags: ["categories"],
    }),
    getTop8ProductCategories: build.query<TCategoryReponse[], void>({
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
        params: {
          token,
        },
        method: "put",
      }),
    }),
    confirmReturn: build.mutation<boolean, string>({
      query: (token) => ({
        url: "/api/store/confirm-return",
        params: {
          token,
        },
        method: "put",
      }),
    }),
    isDeliveryConfirmed: build.query<boolean, string>({
      query: (token) => ({
        url: "/api/store/verify-confirmation",
        params: {
          token,
        },
      }),
    }),

    isReturnConfirmed: build.query<boolean, string>({
      query: (token) => ({
        url: "/api/store/verify-return",
        params: {
          token,
        },
      }),
    }),
       getAllConditions: build.query<TConditionResponse[], void>({
          query: () => ({
            url: "/api/store/all",
          }),
          providesTags: ["conditions"],
        }),
      fetchBrands: build.query<TbrandResponse[],string>({
         query: (category) => ({
           url: "/api/store/brands",
           params:{category}
         }),
         providesTags: ["brands"],
       }),
         confirmAvailability: build.mutation<boolean,string>({
         query: (token) => ({
           url: "/api/listings/availability/confirm",
           params:{token},
                  method:"PUT"
         })
       }),
           markAsSold: build.mutation<boolean,string>({
         query: (token) => ({
           url: "/api/listings/availability/sold",
           params:{token},
           method:"PUT"
         })
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
  useGetTop8ProductCategoriesQuery,
  useIsDeliveryConfirmedQuery,
  useIsReturnConfirmedQuery,
  useConfirmReturnMutation,
  useGetListingBySlugQuery,
  useGetSellerListingQuery,
  useLazyGetStoreListingsFeedQuery,
  useGetAllConditionsQuery,
  useFetchBrandsQuery,
useConfirmAvailabilityMutation,
  useMarkAsSoldMutation
} = storeApi;
