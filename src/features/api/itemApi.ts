import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ShipmentRequest } from "../../components/ShipmentStatusModal";
import type { TListComplaintPage } from "../../types/TComplaints";
import type { TDashboard } from "../../types/TDashboard";
import type { TListPageDto } from "../../types/TListPageDto";
import type { TListTrans } from "../../types/TListTrans";
import type { TOrderPageDto } from "../../types/TOrderPageDto";
import type { TOrdersDto } from "../../types/TOrdersDto";
import type { TResponseDto } from "../../types/TResponseDto";
import type { TWishLists } from "../../types/TWishLists";
import { baseUrl } from "./baseUrl";

export const itemApi = createApi({
  reducerPath: "itemApi",
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
  tagTypes: ["categories",'wishlists','products','orders','complaints','shipment'],
  endpoints: (build) => ({
    addListing: build.mutation<TResponseDto, FormData>({
      query: (body) => ({
        url: "/api/item/listing",
        method: "post",
        body,
      }),
      invalidatesTags:['products']
    }),
      deleteListing: build.mutation<void, number>({
      query: (listingId) => ({
        url: "/api/item/listing/delete",
        method: "delete",
        params:{
          listingId
        }
      }),
      invalidatesTags:['products']
    }),
       editListing: build.mutation<TResponseDto, FormData>({
      query: (body) => ({
        url: "/api/item/listing/edit",
        method: "PUT",
        body,
      }),
      invalidatesTags:['products']
    }),

    getMylistings: build.query<TListPageDto, {page:number,size:number}>({
      query: ({page,size}) => ({
        url: "/api/item/products/me",
        params:{
          page,size
        }
      }),
      providesTags:['products']
    }),
       getStorelistings: build.query<TListPageDto, {page:number,size:number}>({
      query: ({page,size}) => ({
        url: "/api/item/products",
        params:{
          page,size
        }
      }),
          providesTags:['products']
    }),
      getWishLists: build.query<TWishLists[], void>({
      query: () => ({
        url: "/api/users/wishLists",
      }),
      providesTags:['wishlists']
    }),
       addWishList: build.mutation<TResponseDto, number>({
      query: (listingId) => ({
        url: "/api/users/add-wishlist",
        params:{
         listingId
        },
        method:"POST"
      }),
      invalidatesTags:['wishlists']
    }),
     getUserDashboard: build.query<TDashboard, void>({
      query: () => ({
        url: "/api/analytics/dashboard",
      }),
      providesTags:['wishlists','categories']
    }),
      getRecentViews: build.query<TListTrans[], number[]>({
      query: (ids) => ({
        url: "/api/item/recent-views",
        params:{
          ids
        }
      }),
    }),
     getWishlistCount: build.query<number,void>({
      query: () => ({
        url: "/api/users/count"
      }),
      providesTags:['wishlists']
    }),
      getPurchaseOrders: build.query<TOrderPageDto,{page:number,size:number}>({
      query: ({page,size}) => ({
        url: "/api/orders/buying",
        params:{
          page,size,
        }
      }),
      providesTags:['orders']
    }),
      getPurchaseDetails: build.query<TOrdersDto[],number>({
      query: (id) => ({
        url: "/api/orders/buying/details",
        params:{
          id
        }
      }),
      providesTags:['orders']
    }),
          getSaleOrders: build.query<TOrderPageDto,{page:number,size:number}>({
      query: ({page,size}) => ({
        url: "/api/orders/selling",
        params:{
          page,size,
        }
      }),
      providesTags:['orders']
    }),
          getStoreOrders: build.query<TOrderPageDto,{page:number,size:number}>({
      query: ({page,size}) => ({
        url: "/api/orders/orders",
        params:{
          page,size,
        }
      }),
      providesTags:['orders']
    }),
      addComplaint: build.mutation<void,FormData>({
      query: (body) => ({
        url: "/api/orders/complaints/new",
        body,
        method:'POST'
      }),
    invalidatesTags:['complaints']
    }),
         getComplaints: build.query<TListComplaintPage,{page:number,size:number}>({
      query: ({page,size}) => ({
        url: "/api/orders/complaints",
        params:{
          page,size
        }
      }),
   providesTags:['complaints']
    }),
        updateShipmentStatus: build.mutation<void,ShipmentRequest>({
      query: ({shipmentId,trackingNumber,comment,status,createdAt}) => ({
        url: "/api/shipment/update-status",
        params:{shipmentId,trackingNumber,comment,status,createdAt},
        method:'PUT'
      }),
    invalidatesTags:['shipment']
    }),
  }),
});
export const { useAddListingMutation,useGetMylistingsQuery,
  useAddWishListMutation,useGetUserDashboardQuery,useLazyGetRecentViewsQuery,
  useGetWishlistCountQuery,useGetWishListsQuery,useGetStoreOrdersQuery,useGetStorelistingsQuery,
  useAddComplaintMutation,useGetComplaintsQuery,useEditListingMutation,
  useGetPurchaseOrdersQuery,useGetSaleOrdersQuery,useGetPurchaseDetailsQuery,useUpdateShipmentStatusMutation,
  useDeleteListingMutation
} = itemApi;
