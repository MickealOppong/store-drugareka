import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TResponseDto } from "../../types/TResponseDto";

import { CookieService } from "../../util/util";
import { baseUrl } from "./baseUrl";

export const adminApi = createApi({
  reducerPath: "adminApi",
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
  tagTypes: ['admin'],
  endpoints: (build) => ({
    getAnalytics: build.query<TResponseDto,void>({
      query: () => ({
        url: "/api/analytics/dashboard-admin",
      }),
    }),
  }),
});
export const {
useGetAnalyticsQuery
} = adminApi;
