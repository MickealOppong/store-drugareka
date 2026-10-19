import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TLogin } from "../../types/TLogin";
import { type TRegisterDto } from "../../types/TRegisterDto";
import type { TResponseDto } from "../../types/TResponseDto";

import type { TChangePasswordDto } from "../../types/TChangePasswordDto";
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
  tagTypes: ["wishlists", "shipment"],
  endpoints: (build) => ({
    addUser: build.mutation<TResponseDto, TRegisterDto>({
      query: (body) => ({
        url: "/api/auth/register",
        method: "post",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    login: build.mutation<TResponseDto, TLogin>({
      query: (body) => ({
        url: "/api/auth/login",
        method: "post",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    logout: build.mutation<boolean, string>({
      query: (refreshToken) => ({
        url: "/api/auth/logout",
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
        url: "/api/seller/shipment/ship",
        method: "POST",
        body,
      }),
      invalidatesTags: ["wishlists"],
    }),
    getSellerShipments: build.query<TShipmentItemResponse[], string>({
      query: (token) => ({
        url: "/api/seller/shipment/token",
        params: {
          token,
        },
      }),
      providesTags: ["shipment"],
    }),
    ResetPasswordRequest: build.mutation<TResponseDto, string>({
      query: (email) => ({
        url: "/api/auth/reset-password-request",
        params: {
          email,
        },
        method: "POST",
      }),
    }),
      changePassword: build.mutation<TResponseDto,TChangePasswordDto>({
          query: (body) => ({
            url: `/api/auth/change-password`,
           body,
            method: "PUT",
          }),
        }),
  }),
});
export const {
  useAddUserMutation,
  useLoginMutation,
  useLogoutMutation,
  useConfirmShipmentMutation,
  useLazyGetSellerShipmentsQuery,
  useResetPasswordRequestMutation,
  useGetSellerShipmentsQuery,
  useChangePasswordMutation
} = authApi;
