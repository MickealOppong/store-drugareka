import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TResponseDto } from "../../types/TResponseDto";
import { baseUrl } from "./baseUrl";

export const checkoutApi = createApi({
  reducerPath: "checkoutApi",
  baseQuery: fetchBaseQuery({
    baseUrl,

    prepareHeaders: (headers) => {
      // RTK Query runs this function EVERY time you make a request
      const token = localStorage.getItem("tk") ?? "";

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
  tagTypes: ['checkout'],
  endpoints: (build) => ({
    checkoutBuyerPayU: build.mutation<TResponseDto,void>({
      query: () => ({
        url: "/api/checkout/payU",
        method:"POST",
      }),
      invalidatesTags:['checkout']
    }),
       checkoutBuyerStripe: build.mutation<TResponseDto,void>({
      query: () => ({
        url: "/api/checkout/stripe",
        method:"POST",
      }),
      invalidatesTags:['checkout']
    }),
stripeBuyNow: build.mutation<TResponseDto,number>({
      query: (listingId) => ({
        url: "/api/checkout/stripe-buy-now",
        params:{
          listingId,
        },
        method:"POST",
      }),
      invalidatesTags:['checkout']
    }),
    payUbuyNow: build.mutation<TResponseDto,{listingId:number,locale:string}>({
      query: ({listingId,locale}) => ({
        url: "/api/checkout/payU-buy-now",
        params:{
          listingId,locale
        },
        method:"POST",
      }),
      invalidatesTags:['checkout']
    }),
  }),
});
export const { 
    useCheckoutBuyerStripeMutation,useStripeBuyNowMutation,usePayUbuyNowMutation,useCheckoutBuyerPayUMutation
} = checkoutApi;
