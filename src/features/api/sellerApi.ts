import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TConditionResponse } from "../../types/TConditionResponse";
import type { TListPageBrand } from "../../types/TListPageBrand";
import type { TListPageSellerProfile } from "../../types/TListPageSellerProfile";
import type { TListTrans } from "../../types/TListTrans";
import { CookieService } from "../../util/util";
import { baseUrl } from "./baseUrl";

export const sellerApi = createApi({
  reducerPath: "sellerApi",
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
  tagTypes: ["sellers", "seller"],
  endpoints: (build) => ({
    getSellers: build.query<
      TListPageSellerProfile,
      { query: string; page: number; size: number }
    >({
      query: ({ query, page, size }) => ({
        url: "/api/sellerProfile/sellers",
        params: { query, page, size },
      }),
      providesTags: ["sellers"],
    }),
    updateSellerStatus: build.mutation<boolean, FormData>({
      query: (body) => ({
        url: "/api/sellerProfile/update-status",
        body,
        method: "PUT",
      }),
      invalidatesTags: ["seller", "sellers"],
    }),
    createEnquiry: build.mutation<
      boolean,
      { listingId: number; message: string }
    >({
      query: ({ listingId, message }) => ({
        url: "/api/enquiry/create",
        params: { listingId, message },
        method: "POST",
      }),
      invalidatesTags: ["seller", "sellers"],
    }),
    validateToken: build.mutation<
      { listingId: number; validated: boolean },
      string
    >({
      query: (token) => ({
        url: "/api/enquiry/enquiry-token",
        params: { token },
        method: "POST",
      }),
    }),
    validateAndUpdateListing: build.mutation<boolean, string>({
      query: (token) => ({
        url: "/api/store/token-update-listing",
        params: { token },
        method: "POST",
      }),
    }),
    getListing: build.query<TListTrans, number>({
      query: (listingId) => ({
        url: `/api/store/listing/${listingId}`,
        params: {
          listingId,
        },
      }),
    }),
    editListing: build.mutation<boolean, FormData>({
      query: (body) => ({
        url: "/api/enquiry/listing/edit",
        method: "PUT",
        body,
      }),
    }),
    getAllConditions: build.query<TConditionResponse[], void>({
      query: () => ({
        url: "/api/store/all",
      }),
    }),
    getBrands: build.query<TListPageBrand, void>({
      query: () => ({
        url: "/api/store/brands/all",
      }),
    }),
  }),
});
export const {
  useGetSellersQuery,
  useUpdateSellerStatusMutation,
  useCreateEnquiryMutation,
  useValidateTokenMutation,
  useValidateAndUpdateListingMutation,
  useLazyGetListingQuery,
  useEditListingMutation,
  useGetAllConditionsQuery,
  useGetBrandsQuery,
} = sellerApi;
