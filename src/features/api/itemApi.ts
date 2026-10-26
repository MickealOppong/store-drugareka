import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ShipmentRequest } from "../../components/ShipmentStatusModal";
import type { TComplaints, TListComplaintPage } from "../../types/TComplaints";
import type { TCourierResponse } from "../../types/TCourierResponse";
import type { TDashboard } from "../../types/TDashboard";
import type { TListPageDto } from "../../types/TListPageDto";
import type { TListTrans } from "../../types/TListTrans";
import type { TOrderPageDto } from "../../types/TOrderPageDto";
import type { TOrdersDto } from "../../types/TOrdersDto";
import type { TResponseDto } from "../../types/TResponseDto";
import type { TShipmentPriceInput } from "../../types/TShipmentPriceInput";
import type { TWishLists } from "../../types/TWishLists";
import { CookieService } from "../../util/util";
import { baseUrl } from "./baseUrl";

export const itemApi = createApi({
  reducerPath: "itemApi",
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
  tagTypes: ["categories",'wishlists','products','orders','complaints','shipment','shipments','users','user','listings','listing'],
  endpoints: (build) => ({
    addListing: build.mutation<TResponseDto, FormData>({
      query: (body) => ({
        url: "/api/item/listing",
        method: "post",
        body,
      }),
      invalidatesTags:['products','users','user']
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
         invalidatesTags: ["wishlists"],
    }),
        addCourierPrice: build.mutation<TResponseDto,TShipmentPriceInput>({
      query: (body) => ({
        url: "/api/courier/courier-charge",
       body,
        method:"POST"
      }),
      invalidatesTags:['shipments']
    }),
       editCourierPrice: build.mutation<TResponseDto,TShipmentPriceInput>({
      query: (body) => ({
        url: "/api/courier/edit-courier-charge",
       body,
        method:"PUT"
      }),
      invalidatesTags:['shipments']
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
      cancelOrder: build.mutation<TResponseDto,number>({
      query: (orderItemId) => ({
        url: "/api/orders/cancel-seller-order",
        params:{
         orderItemId
        },
        method:"POST"
      }),
     invalidatesTags:['orders']
    }),
        cancelBuyerOrder: build.mutation<TResponseDto,number>({
      query: (orderItemId) => ({
        url: "/api/orders/cancel-buyer-order",
        params:{
         orderItemId
        },
        method:"POST"
      }),
     invalidatesTags:['orders']
    }),
      returnItem: build.mutation<TResponseDto,FormData>({
      query: (body) => ({
        url: "/api/dispute/return-intent",
        body,
        method:"POST"
      }),
     invalidatesTags:['orders']
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
        url: "/api/dispute/complaints",
        params:{
          page,size
        }
      }),
   providesTags:['complaints']
    }),
          getBuyerComplaint: build.query<TComplaints,string>({
      query: (orderNumber) => ({
        url: "/api/dispute/complaint",
        params:{
          orderNumber
        }
      }),
   providesTags:['complaints']
    }),
           updateOrderDispute: build.mutation<TResponseDto,{orderNumber:string,decision:string,reason:string}>({
      query: ({orderNumber,reason,decision}) => ({
        url: "/api/dispute/update",
        params:{
      orderNumber,reason,decision
        },
        method:"PUT"
      }),
   invalidatesTags:['complaints']
    }),
          updateOrderDisputeAdmin: build.mutation<TResponseDto,{orderNumber:string,decision:string,reason:string}>({
      query: ({orderNumber,reason,decision}) => ({
        url: "/api/dispute/admin-review",
        params:{
      orderNumber,reason,decision
        },
        method:"PUT"
      }),
   invalidatesTags:['complaints']
    }),
        updateShipmentStatus: build.mutation<void,ShipmentRequest>({
      query: ({shipmentId,trackingNumber,comment,status,createdAt}) => ({
        url: "/api/shipment/shipment-status",
        params:{shipmentId,trackingNumber,comment,status,createdAt},
        method:'PUT'
      }),
    invalidatesTags:['shipment']
    }),
         updateReturnShipmentStatus: build.mutation<void,ShipmentRequest>({
      query: ({shipmentId,trackingNumber,comment,status,createdAt}) => ({
        url: "/api/shipment/return-status",
        params:{shipmentId,trackingNumber,comment,status,createdAt},
        method:'PUT'
      }),
    invalidatesTags:['shipment']
    }),
           getCouriers: build.query<TCourierResponse[],void>({
      query: () => ({
        url: "/api/courier/options",
      }),
 providesTags:['shipments']
    }),
     makeOffer: build.mutation<TResponseDto, {listingId:number,offer:number}>({
          query: ({listingId,offer}) => ({
            url: "/api/item/make-offer",
            params: {
              listingId,offer
            },
            method:"POST"
          }),
        }),
            getListing: build.query<TListTrans, number>({
              query: (listingId) => ({
                url: `/api/item/listing/${listingId}`,
                params: {
                  listingId,
                },
              }),
              providesTags: ["listing"],
            }),
                  getReturnDetails: build.query<TListTrans, number>({
              query: (orderId) => ({
                url: `/api/order/${orderId}/return`,
                params: {
                 orderId
                },
              }),
         
            }),
                  getShipmentPrice: build.query<TShipmentPriceInput, number>({
              query: (id) => ({
                url: `/api/courier/option/${id}`,
                params: {
                id
                },
              }),
         
            }),
  }),
});
export const { useAddListingMutation,useGetMylistingsQuery,
  useAddWishListMutation,useGetUserDashboardQuery,useLazyGetRecentViewsQuery,
  useGetWishlistCountQuery,useGetWishListsQuery,useGetStoreOrdersQuery,useGetStorelistingsQuery,
  useAddComplaintMutation,useGetComplaintsQuery,useEditListingMutation,
  useGetPurchaseOrdersQuery,useGetSaleOrdersQuery,useGetPurchaseDetailsQuery,useUpdateShipmentStatusMutation,
  useDeleteListingMutation,useLazyGetWishListsQuery,useLazyGetWishlistCountQuery,
  useCancelOrderMutation,useReturnItemMutation,useUpdateReturnShipmentStatusMutation,useAddCourierPriceMutation
  ,useGetCouriersQuery,useMakeOfferMutation,useLazyGetListingQuery,useGetListingQuery,useCancelBuyerOrderMutation,
  useGetReturnDetailsQuery,useGetBuyerComplaintQuery,useUpdateOrderDisputeMutation,useUpdateOrderDisputeAdminMutation,
  useLazyGetBuyerComplaintQuery,useLazyGetShipmentPriceQuery,useEditCourierPriceMutation
} = itemApi;
