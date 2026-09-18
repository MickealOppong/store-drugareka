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
      return headers;
    },
  }),
  tagTypes: ['checkout'],
  endpoints: (build) => ({
    checkoutBuyer: build.mutation<TResponseDto,string>({
      query: (locale) => ({
        url: "/api/checkout",
        params:{
          locale
        },
        method:"POST",
      }),
      invalidatesTags:['checkout']
    }),

  }),
  
});
export const { 
    useCheckoutBuyerMutation
} = checkoutApi;
