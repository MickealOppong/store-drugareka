import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TLogin } from "../../types/TLogin";
import { type TRegisterDto } from "../../types/TRegisterDto";
import type { TResponseDto } from "../../types/TResponseDto";

import type { TShipmentItemResponse } from "../../types/TShipmentItemResponse";
import { baseUrl } from "./baseUrl";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      // user preferred langauge selected
      const currentLanguage = localStorage.getItem("i18nextLng") as string;
      headers.set("Accept-Language", currentLanguage);
      return headers;
    },
  }),
  tagTypes: ["wishlists",'shipment'],
  endpoints: (build) => ({
    addUser: build.mutation<TResponseDto, TRegisterDto>({
      query: (body) => ({
        url: "/auth/register",
        method: "post",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    login: build.mutation<TResponseDto, TLogin>({
      query: (body) => ({
        url: "/auth/login",
        method: "post",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    logout: build.mutation<boolean, string>({
      query: (refreshToken) => ({
        url: "/auth/logout",
        method: "Delete",
        params: {
          refreshToken,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["wishlists"],
    }),
    confirmShipment: build.mutation<boolean, FormData>({
      query: (body) => ({
        url:"/api/seller/shipment/ship",
        method: "POST",
        body,
      }),
      invalidatesTags: ["wishlists"],
    }),
      getSellerShipments: build.query<TShipmentItemResponse[], string>({
      query: (token) => ({
        url: "/api/seller/shipment/token",
       params:{
        token
       }
      }),
      providesTags:['shipment']
    }),
  }),
});
export const {
  useAddUserMutation,
  useLoginMutation,
  useLogoutMutation,
  useConfirmShipmentMutation,
 useLazyGetSellerShipmentsQuery
} = authApi;
