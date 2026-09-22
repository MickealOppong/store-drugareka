import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { TAddress } from "../../components/CartAddressManager";
import type { TCart } from "../../types/TCart";
import type { TResponseDto } from "../../types/TResponseDto";
import { baseUrl } from "./baseUrl";

export const cartApi = createApi({
  reducerPath: "cartApi",
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
  tagTypes: ["cart"],
  endpoints: (build) => ({
    addToCart: build.mutation<TResponseDto, number>({
      query: (listingId) => ({
        url: "/api/cart/new",
        params: {
          listingId,
        },
        method: "POST",
      }),
      invalidatesTags: ["cart"],
    }),
    mergeCart: build.mutation<TResponseDto, number[]>({
      query: (guestItemIds) => ({
        url: "/api/cart/merge",
        params: {
          guestItemIds,
        },
        method: "POST",
      }),
      invalidatesTags: ["cart"],
    }),
    getBuyerCart: build.query<TCart, void>({
      query: () => ({
        url: "/api/cart/carts",
      }),
      providesTags: ["cart"],
    }),
    getCartCount: build.query<number, void>({
      query: () => ({
        url: "/api/cart/count",
      }),
      providesTags: ["cart"],
    }),
    removeCartItem: build.mutation<number, number>({
      query: (listingId) => ({
        url: "/api/cart/remove",
        params: {
          listingId,
        },
        method: "DELETE",
      }),
      invalidatesTags: ["cart"],
    }),
    addAddress: build.mutation<void, TAddress>({
      query: (body) => ({
        url: `/api/address/new`,
        body,
        method: "POST",
      }),
      invalidatesTags: ["cart"],
    }),
  }),
});
export const {
  useAddToCartMutation,
  useGetCartCountQuery,
  useRemoveCartItemMutation,
  useAddAddressMutation,
  useGetBuyerCartQuery,
  useLazyGetBuyerCartQuery,
  useMergeCartMutation,
  useLazyGetCartCountQuery
} = cartApi;
